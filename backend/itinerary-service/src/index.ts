import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Itinerary, ItineraryActivity } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5007;
const DATA_FILE = path.resolve(__dirname, '../data/itineraries.json');

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface ItineraryStore {
  itineraries: Itinerary[];
}

function loadData(): ItineraryStore {
  if (!fs.existsSync(DATA_FILE)) {
    const initialItineraries: Itinerary[] = [
      {
        id: 'itin_sample_001',
        userId: 'usr_demo_002',
        title: 'Munnar & Western Ghats Scenic Retreat',
        destinationId: 'dest_munnar',
        destinationName: 'Munnar',
        startDate: '2026-12-05',
        endDate: '2026-12-08',
        numberOfDays: 3,
        notes: 'Pack light rain jacket and comfortable walking shoes for high altitude tea trails.',
        createdAt: '2026-11-20T12:00:00.000Z',
        updatedAt: '2026-11-20T12:00:00.000Z',
        activities: [
          {
            id: 'act_101',
            dayNumber: 1,
            activityTitle: 'Arrival & Scenic Ghat Journey',
            description: 'Arrive via Vande Bharat Express at Ernakulam, transfer to Munnar hill station through Cheeyappara waterfalls.',
            timeSlot: '09:00 AM – 01:00 PM',
            durationMinutes: 240,
            orderIndex: 0,
          },
          {
            id: 'act_102',
            dayNumber: 1,
            activityTitle: 'KDHP Tea Museum & Factory Walk',
            description: 'Guided historical tour of Orthodox tea manufacturing and fresh tea tasting.',
            timeSlot: '03:00 PM – 05:00 PM',
            durationMinutes: 120,
            attractionId: 'spot_tea_museum',
            attractionName: 'KDHP Tea Museum & Factory',
            orderIndex: 1,
          },
          {
            id: 'act_103',
            dayNumber: 2,
            activityTitle: 'Eravikulam National Park Safari',
            description: 'Early morning safari to spot Nilgiri Tahr and view Anamudi Peak across shola forests.',
            timeSlot: '08:00 AM – 11:30 AM',
            durationMinutes: 210,
            attractionId: 'spot_eravikulam',
            attractionName: 'Eravikulam National Park',
            orderIndex: 0,
          },
          {
            id: 'act_104',
            dayNumber: 2,
            activityTitle: 'Mattupetty Lake & Dam Reflection Point',
            description: 'Relaxing lakeside stroll, solar boating, and photography of misty tea plantation slopes.',
            timeSlot: '02:00 PM – 04:30 PM',
            durationMinutes: 150,
            attractionId: 'spot_mattupetty',
            attractionName: 'Mattupetty Dam & Lake',
            orderIndex: 1,
          },
          {
            id: 'act_105',
            dayNumber: 3,
            activityTitle: 'Traditional Spice Plantation Trail & Return',
            description: 'Walk through organic cardamom and vanilla gardens, followed by return rail transfer.',
            timeSlot: '10:00 AM – 02:00 PM',
            durationMinutes: 240,
            orderIndex: 0,
          },
        ],
      },
    ];

    const initialStore = { itineraries: initialItineraries };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { itineraries: [] };
  }
}

function saveData(data: ItineraryStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

eventBus.initialize().catch((err) => console.warn('[Itinerary-Service] Event bus init warning:', err));

app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'itinerary-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// List itineraries
app.get('/api/itineraries', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let list = store.itineraries;
  if (userId) {
    list = list.filter((i) => i.userId === userId);
  }
  res.json({ success: true, count: list.length, itineraries: list });
});

// Get single itinerary
app.get('/api/itineraries/:id', (req: Request, res: Response) => {
  const store = loadData();
  const itinerary = store.itineraries.find((i) => i.id === req.params.id);
  if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
  res.json({ success: true, itinerary });
});

// Create itinerary
app.post('/api/itineraries', async (req: Request, res: Response) => {
  try {
    const { userId, title, destinationId, destinationName, startDate, endDate, numberOfDays, notes, activities } = req.body;

    if (!userId || !title || !destinationId) {
      return res.status(400).json({ success: false, message: 'Missing required itinerary fields' });
    }

    const store = loadData();
    const id = `itin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newItinerary: Itinerary = {
      id,
      userId,
      title,
      destinationId,
      destinationName: destinationName || 'Scenic Destination',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      numberOfDays: Number(numberOfDays) || 3,
      notes: notes || '',
      activities: activities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.itineraries.unshift(newItinerary);
    saveData(store);

    // Publish event
    await eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.ITINERARY_CREATED, {
      itineraryId: newItinerary.id,
      userId: newItinerary.userId,
      title: newItinerary.title,
      destinationId: newItinerary.destinationId,
      destinationName: newItinerary.destinationName,
      startDate: newItinerary.startDate,
      endDate: newItinerary.endDate,
      numberOfDays: newItinerary.numberOfDays,
      timestamp: newItinerary.createdAt,
    });

    res.status(201).json({ success: true, message: 'Itinerary created successfully', itinerary: newItinerary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update itinerary
app.put('/api/itineraries/:id', async (req: Request, res: Response) => {
  try {
    const store = loadData();
    const index = store.itineraries.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Itinerary not found' });

    const existing = store.itineraries[index];
    const updated: Itinerary = {
      ...existing,
      ...req.body,
      id: existing.id,
      userId: existing.userId, // ensure ownership cannot be overridden
      updatedAt: new Date().toISOString(),
    };

    store.itineraries[index] = updated;
    saveData(store);

    await eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.ITINERARY_UPDATED, {
      itineraryId: updated.id,
      userId: updated.userId,
      title: updated.title,
      timestamp: updated.updatedAt,
    });

    res.json({ success: true, message: 'Itinerary updated', itinerary: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete itinerary
app.delete('/api/itineraries/:id', (req: Request, res: Response) => {
  const store = loadData();
  const initialLen = store.itineraries.length;
  store.itineraries = store.itineraries.filter((i) => i.id !== req.params.id);
  if (store.itineraries.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Itinerary not found' });
  }
  saveData(store);
  res.json({ success: true, message: 'Itinerary deleted successfully' });
});

// Add activity to itinerary
app.post('/api/itineraries/:id/activities', (req: Request, res: Response) => {
  const store = loadData();
  const itinerary = store.itineraries.find((i) => i.id === req.params.id);
  if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });

  const activity: ItineraryActivity = {
    id: `act_${Date.now()}`,
    dayNumber: req.body.dayNumber || 1,
    activityTitle: req.body.activityTitle,
    description: req.body.description || '',
    timeSlot: req.body.timeSlot || 'Morning',
    durationMinutes: Number(req.body.durationMinutes) || 120,
    attractionId: req.body.attractionId,
    attractionName: req.body.attractionName,
    orderIndex: itinerary.activities.length,
  };

  itinerary.activities.push(activity);
  itinerary.updatedAt = new Date().toISOString();
  saveData(store);

  res.status(201).json({ success: true, message: 'Activity added', activity, itinerary });
});

// Delete activity from itinerary
app.delete('/api/itineraries/:id/activities/:activityId', (req: Request, res: Response) => {
  const store = loadData();
  const itinerary = store.itineraries.find((i) => i.id === req.params.id);
  if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });

  itinerary.activities = itinerary.activities.filter((a) => a.id !== req.params.activityId);
  itinerary.updatedAt = new Date().toISOString();
  saveData(store);

  res.json({ success: true, message: 'Activity removed', itinerary });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Itinerary-Service] Server listening on port ${PORT}`);
  });
}

export default app;
