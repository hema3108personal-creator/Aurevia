import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Booking, Passenger, BookingStatus } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5003;
const DATA_FILE = path.resolve(__dirname, '../data/reservations.json');

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface OutboxEvent {
  id: string;
  eventType: string;
  payload: any;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  createdAt: string;
  publishedAt?: string;
}

interface ReservationStore {
  bookings: Booking[];
  outbox: OutboxEvent[];
}

function loadData(): ReservationStore {
  if (!fs.existsSync(DATA_FILE)) {
    const initialBookings: Booking[] = [
      {
        id: 'bkg_sample_101',
        pnr: 'PNR-8492-3104',
        userId: 'usr_demo_002',
        userEmail: 'traveler@aurevia.com',
        userName: 'Aarav Sharma',
        trainId: 'trn_20633',
        trainNumber: '20633',
        trainName: 'Vande Bharat Express',
        sourceStationCode: 'MAS',
        sourceStationName: 'Chennai Central',
        destinationStationCode: 'ERS',
        destinationStationName: 'Ernakulam Junction (Kochi)',
        journeyDate: '2026-12-05',
        departureTime: '06:00',
        arrivalTime: '14:30',
        travelClass: 'CC',
        passengers: [
          { name: 'Aarav Sharma', age: 29, gender: 'MALE', seatPreference: 'WINDOW', seatNumber: 'C3-24' },
          { name: 'Pooja Sharma', age: 27, gender: 'FEMALE', seatPreference: 'WINDOW', seatNumber: 'C3-25' },
        ],
        totalFare: 3160,
        status: 'CONFIRMED',
        idempotencyKey: 'idem_init_sample_101',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-20T10:00:00.000Z',
      },
    ];

    const initialStore = { bookings: initialBookings, outbox: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { bookings: [], outbox: [] };
  }
}

function saveData(data: ReservationStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

eventBus.initialize().catch((err) => console.warn('[Reservation-Service] Event bus init warning:', err));

app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'reservation-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// Helper to generate realistic PNR format
function generatePNR(): string {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `PNR-${part1}-${part2}`;
}

// Create new reservation
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userEmail,
      userName,
      trainId,
      trainNumber,
      trainName,
      sourceStationCode,
      sourceStationName,
      destinationStationCode,
      destinationStationName,
      journeyDate,
      departureTime,
      arrivalTime,
      travelClass,
      passengers,
      totalFare,
      idempotencyKey,
    } = req.body;

    if (!userId || !trainNumber || !journeyDate || !travelClass || !passengers || !passengers.length) {
      return res.status(400).json({ success: false, message: 'Missing required reservation fields' });
    }

    const store = loadData();

    // Idempotency check: if already submitted with this key, return existing booking
    if (idempotencyKey) {
      const existing = store.bookings.find((b) => b.idempotencyKey === idempotencyKey);
      if (existing) {
        console.log(`[Reservation-Service] Idempotent request detected for key ${idempotencyKey}. Returning existing booking.`);
        return res.json({ success: true, booking: existing, isDuplicate: true });
      }
    }

    const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const pnr = generatePNR();

    // Assign coach & seat numbers
    const coachPrefix = travelClass === 'EC' ? 'E' : travelClass === 'CC' ? 'C' : travelClass === '1A' ? 'H' : travelClass === '2A' ? 'A' : travelClass === '3A' ? 'B' : 'S';
    const coachNum = Math.floor(1 + Math.random() * 4);
    const assignedPassengers: Passenger[] = passengers.map((p: any, idx: number) => ({
      name: p.name,
      age: Number(p.age),
      gender: p.gender || 'MALE',
      seatPreference: p.seatPreference || 'WINDOW',
      seatNumber: `${coachPrefix}${coachNum}-${Math.floor(1 + Math.random() * 60)}`,
    }));

    const newBooking: Booking = {
      id: bookingId,
      pnr,
      userId,
      userEmail: userEmail || 'traveler@aurevia.com',
      userName: userName || 'Valued Traveler',
      trainId: trainId || `trn_${trainNumber}`,
      trainNumber,
      trainName: trainName || 'Express Journey',
      sourceStationCode,
      sourceStationName: sourceStationName || sourceStationCode,
      destinationStationCode,
      destinationStationName: destinationStationName || destinationStationCode,
      journeyDate,
      departureTime: departureTime || '06:00',
      arrivalTime: arrivalTime || '14:30',
      travelClass,
      passengers: assignedPassengers,
      totalFare: Number(totalFare) || 1500,
      status: 'CONFIRMED',
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save booking to store
    store.bookings.unshift(newBooking);

    // Transactional Outbox pattern record
    const outboxRecord: OutboxEvent = {
      id: `outbox_${Date.now()}`,
      eventType: RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CONFIRMED,
      payload: {
        bookingId: newBooking.id,
        pnr: newBooking.pnr,
        userId: newBooking.userId,
        trainId: newBooking.trainId,
        trainNumber: newBooking.trainNumber,
        trainName: newBooking.trainName,
        fromStation: newBooking.sourceStationName,
        toStation: newBooking.destinationStationName,
        journeyDate: newBooking.journeyDate,
        departureTime: newBooking.departureTime,
        arrivalTime: newBooking.arrivalTime,
        travelClass: newBooking.travelClass,
        passengers: newBooking.passengers,
        totalFare: newBooking.totalFare,
        status: newBooking.status,
        timestamp: newBooking.createdAt,
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    store.outbox.push(outboxRecord);
    saveData(store);

    // Publish event asynchronously via RabbitMQ / EventBus
    try {
      await eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CONFIRMED, outboxRecord.payload);
      outboxRecord.status = 'PUBLISHED';
      outboxRecord.publishedAt = new Date().toISOString();
      saveData(store);
    } catch (err: any) {
      console.error('[Reservation-Service] Failed to publish event from outbox:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Railway booking confirmed successfully',
      booking: newBooking,
      isSimulated: true,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let list = store.bookings;
  if (userId) {
    list = list.filter((b) => b.userId === userId);
  }
  res.json({ success: true, count: list.length, bookings: list });
});

// Admin view: all bookings
app.get('/api/bookings/all', (req: Request, res: Response) => {
  const store = loadData();
  res.json({ success: true, count: store.bookings.length, bookings: store.bookings });
});

// Get single booking by ID or PNR
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const store = loadData();
  const booking = store.bookings.find((b) => b.id === req.params.id || b.pnr === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, booking });
});

// Cancel booking
app.post('/api/bookings/:id/cancel', async (req: Request, res: Response) => {
  const store = loadData();
  const index = store.bookings.findIndex((b) => b.id === req.params.id || b.pnr === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

  const target = store.bookings[index];
  if (target.status === 'CANCELLED') {
    return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
  }

  target.status = 'CANCELLED';
  target.cancellationReason = req.body.reason || 'Requested by passenger';
  target.updatedAt = new Date().toISOString();
  saveData(store);

  // Publish cancellation event
  await eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CANCELLED, {
    bookingId: target.id,
    pnr: target.pnr,
    userId: target.userId,
    trainNumber: target.trainNumber,
    journeyDate: target.journeyDate,
    reason: target.cancellationReason,
    timestamp: target.updatedAt,
  });

  res.json({ success: true, message: 'Booking cancelled successfully', booking: target });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Reservation-Service] Server listening on port ${PORT}`);
  });
}

export default app;
