import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Notification } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG, AureviaEvent } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5008;
const DATA_FILE = path.resolve(__dirname, '../data/notifications.json');

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface NotificationStore {
  notifications: Notification[];
}

function loadData(): NotificationStore {
  if (!fs.existsSync(DATA_FILE)) {
    const initialNotifications: Notification[] = [
      {
        id: 'notif_welcome_001',
        userId: 'usr_demo_002',
        title: 'Welcome to AUREVIA',
        message: 'Welcome to AUREVIA! Discover cultural heritage, seamless railway journeys, and sustainable travel.',
        type: 'SYSTEM',
        isRead: false,
        createdAt: '2026-11-20T10:00:00.000Z',
      },
      {
        id: 'notif_sample_booking',
        userId: 'usr_demo_002',
        title: 'Booking Confirmed: PNR-8492-3104',
        message: 'Your journey on 20633 Vande Bharat Express (Chennai Central -> Ernakulam Junction) for 2026-12-05 is confirmed.',
        type: 'BOOKING_CONFIRMATION',
        referenceId: 'bkg_sample_101',
        isRead: false,
        createdAt: '2026-11-20T10:05:00.000Z',
      },
    ];

    const initialStore = { notifications: initialNotifications };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { notifications: [] };
  }
}

function saveData(data: NotificationStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

// Event Consumer Handlers
async function setupEventConsumers() {
  await eventBus.initialize();

  // 1. Subscribe to Booking Confirmed
  await eventBus.subscribe(RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CONFIRMED, async (event: AureviaEvent) => {
    console.log(`[Notification-Service] Received BOOKING_CONFIRMED event for user ${event.payload.userId}, PNR ${event.payload.pnr}`);
    const store = loadData();
    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: event.payload.userId,
      title: `Booking Confirmed: ${event.payload.pnr}`,
      message: `Your reservation on ${event.payload.trainNumber} ${event.payload.trainName} from ${event.payload.fromStation} to ${event.payload.toStation} on ${event.payload.journeyDate} is confirmed. Total Fare: ₹${event.payload.totalFare}.`,
      type: 'BOOKING_CONFIRMATION',
      referenceId: event.payload.bookingId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.unshift(notif);
    saveData(store);
    console.log(`[Notification-Service] Notification created: ${notif.id}`);
  });

  // 2. Subscribe to Booking Cancelled
  await eventBus.subscribe(RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CANCELLED, async (event: AureviaEvent) => {
    console.log(`[Notification-Service] Received BOOKING_CANCELLED event for PNR ${event.payload.pnr}`);
    const store = loadData();
    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: event.payload.userId,
      title: `Booking Cancelled: ${event.payload.pnr}`,
      message: `Your reservation for train ${event.payload.trainNumber} on ${event.payload.journeyDate} has been cancelled. Reason: ${event.payload.reason || 'Requested by user'}.`,
      type: 'BOOKING_CANCELLATION',
      referenceId: event.payload.bookingId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.unshift(notif);
    saveData(store);
  });

  // 3. Subscribe to User Registered
  await eventBus.subscribe(RABBITMQ_CONFIG.ROUTING_KEYS.USER_REGISTERED, async (event: AureviaEvent) => {
    console.log(`[Notification-Service] Received USER_REGISTERED event for ${event.payload.email}`);
    const store = loadData();
    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: event.payload.userId,
      title: 'Welcome to AUREVIA',
      message: `Hello ${event.payload.name}! Welcome to AUREVIA – The World, Seamlessly Connected. Begin exploring destinations and simulated train journeys.`,
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.unshift(notif);
    saveData(store);
  });

  // 4. Subscribe to Itinerary Created
  await eventBus.subscribe(RABBITMQ_CONFIG.ROUTING_KEYS.ITINERARY_CREATED, async (event: AureviaEvent) => {
    console.log(`[Notification-Service] Received ITINERARY_CREATED event for itinerary ${event.payload.title}`);
    const store = loadData();
    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: event.payload.userId,
      title: `Itinerary Planned: ${event.payload.title}`,
      message: `Your ${event.payload.numberOfDays}-day itinerary for ${event.payload.destinationName} (${event.payload.startDate} to ${event.payload.endDate}) is saved.`,
      type: 'ITINERARY',
      referenceId: event.payload.itineraryId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.notifications.unshift(notif);
    saveData(store);
  });
}

setupEventConsumers().catch((err) => console.error('[Notification-Service] Failed to set up consumers:', err));

app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'notification-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// List notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let list = store.notifications;
  if (userId) {
    list = list.filter((n) => n.userId === userId);
  }
  res.json({ success: true, count: list.length, notifications: list });
});

// Unread count
app.get('/api/notifications/unread-count', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let list = store.notifications;
  if (userId) {
    list = list.filter((n) => n.userId === userId && !n.isRead);
  } else {
    list = list.filter((n) => !n.isRead);
  }
  res.json({ success: true, unreadCount: list.length });
});

// Mark single as read
app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const store = loadData();
  const notif = store.notifications.find((n) => n.id === req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
  notif.isRead = true;
  saveData(store);
  res.json({ success: true, notification: notif });
});

// Mark all as read
app.patch('/api/notifications/read-all', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string || req.body.userId;
  if (userId) {
    store.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
  } else {
    store.notifications.forEach((n) => (n.isRead = true));
  }
  saveData(store);
  res.json({ success: true, message: 'All notifications marked as read' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Notification-Service] Server listening on port ${PORT}`);
  });
}

export default app;
