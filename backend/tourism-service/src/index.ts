import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Destination, TouristSpot } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5004;
const DATA_FILE = path.resolve(__dirname, '../data/tourism.json');

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface SavedDestinationRecord {
  id: string;
  userId: string;
  destinationId: string;
  savedAt: string;
}

interface TourismStore {
  destinations: Destination[];
  savedDestinations: SavedDestinationRecord[];
}

function loadData(): TourismStore {
  if (!fs.existsSync(DATA_FILE)) {
    const initialDestinations: Destination[] = [
      {
        id: 'dest_munnar',
        name: 'Munnar',
        state: 'Kerala',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616484178591-6870145b879a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Munnar rises gracefully amidst the Western Ghats, blanketed by emerald tea plantations, misty rolling hills, and rare endemic flora like the Neelakurinji flower.',
        highlights: ['Endless Tea Plantations', 'Eravikulam National Park', 'Mattupetty Reservoir', 'Pleasant Mountain Climate'],
        bestTimeToVisit: 'September to March',
        category: 'Nature',
        estimatedVisitDurationDays: 3,
        latitude: 10.0889,
        longitude: 77.0595,
        ecoFriendlyScore: 94,
        sustainableTips: [
          'Take scenic local trains to Ernakulam and electric buses up the ghat road.',
          'Support local organic tea cooperatives in Lock-Hart Estate.',
          'Avoid single-use plastics near delicate wildlife sanctuaries.',
        ],
        nearestStationCode: 'ERS',
        nearestStationName: 'Ernakulam Junction (Kochi)',
        popularAttractions: [
          {
            id: 'spot_eravikulam',
            name: 'Eravikulam National Park',
            destinationId: 'dest_munnar',
            category: 'Wildlife',
            description: 'Sanctuary of the endangered Nilgiri Tahr and home to Anamudi Peak, the highest peak in South India.',
            highlights: ['Nilgiri Tahr spotting', 'Anamudi Peak view', 'High altitude shola grasslands'],
            imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 3,
            latitude: 10.2012,
            longitude: 77.0425,
            entryFee: 200,
          },
          {
            id: 'spot_tea_museum',
            name: 'KDHP Tea Museum & Factory',
            destinationId: 'dest_munnar',
            category: 'Cultural',
            description: 'Historic demonstration factory showcasing century-old tea processing methods and colonial heritage.',
            highlights: ['Tea tasting sessions', 'Historical machinery', 'Fresh tea leaf processing'],
            imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 2,
            latitude: 10.0815,
            longitude: 77.0543,
            entryFee: 150,
          },
          {
            id: 'spot_mattupetty',
            name: 'Mattupetty Dam & Lake',
            destinationId: 'dest_munnar',
            category: 'Nature',
            description: 'A picturesque storage reservoir nestled among hills, famed for reflection vistas and birdwatching.',
            highlights: ['Quiet electric boating', 'Misty reflection views', 'Elephant viewing points'],
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 2,
            latitude: 10.1065,
            longitude: 77.1248,
            entryFee: 50,
          },
        ],
      },
      {
        id: 'dest_ooty',
        name: 'Ooty (Udhagamandalam)',
        state: 'Tamil Nadu',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'The Queen of Hill Stations, crowned by the UNESCO-listed Nilgiri Mountain Railway, eucalyptus forests, and English cottage architecture.',
        highlights: ['Nilgiri Toy Train', 'Botanical Gardens', 'Doddabetta Peak', 'Tea Plantations'],
        bestTimeToVisit: 'October to June',
        category: 'Nature',
        estimatedVisitDurationDays: 3,
        latitude: 11.4102,
        longitude: 76.695,
        ecoFriendlyScore: 92,
        sustainableTips: [
          'Ride the historic UNESCO steam locomotive instead of private taxis.',
          'Purchase artisan Toda embroidery directly from indigenous tribal craft centers.',
        ],
        nearestStationCode: 'CBE',
        nearestStationName: 'Coimbatore Junction',
        popularAttractions: [
          {
            id: 'spot_toy_train',
            name: 'Nilgiri Mountain Railway',
            destinationId: 'dest_ooty',
            category: 'Historical',
            description: 'Century-old UNESCO rack-and-pinion railway ascending misty gorges and cascading waterfalls.',
            highlights: ['UNESCO World Heritage', 'Viaduct crossings', 'Vintage steam locomotives'],
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 4,
            latitude: 11.4064,
            longitude: 76.7032,
            entryFee: 290,
          },
          {
            id: 'spot_botanical',
            name: 'Government Botanical Gardens',
            destinationId: 'dest_ooty',
            category: 'Nature',
            description: 'Sprawling 55-acre landscaped terraced garden established in 1848, containing 1,000+ exotic floral species.',
            highlights: ['Fossilized tree trunk', 'Italian garden', 'Fern house'],
            imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 2,
            latitude: 11.4173,
            longitude: 76.7118,
            entryFee: 40,
          },
        ],
      },
      {
        id: 'dest_kodaikanal',
        name: 'Kodaikanal',
        state: 'Tamil Nadu',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'],
        description: 'The Princess of Hill Stations, celebrated for star-shaped lakes, cliffside pine groves, and the iconic Coakers Walk overlooking cloud-filled valleys.',
        highlights: ['Kodai Star Lake', 'Coakers Walk', 'Pillar Rocks', 'Pine Forests'],
        bestTimeToVisit: 'September to May',
        category: 'Nature',
        estimatedVisitDurationDays: 2,
        latitude: 10.2381,
        longitude: 77.4892,
        ecoFriendlyScore: 89,
        sustainableTips: ['Cycle around the 5 km lake perimeter rather than driving motorized vehicles.'],
        nearestStationCode: 'MDU',
        nearestStationName: 'Madurai Junction',
        popularAttractions: [],
      },
      {
        id: 'dest_jaipur',
        name: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59f4?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1603262110263-fb010d6e59f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'The UNESCO-inscribed Pink City, renowned for majestic hilltop fortresses, intricate terracotta facades, and Rajput royal architecture.',
        highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
        bestTimeToVisit: 'October to March',
        category: 'Historical',
        estimatedVisitDurationDays: 3,
        latitude: 26.9124,
        longitude: 75.7873,
        ecoFriendlyScore: 86,
        sustainableTips: ['Use electric Jaipur Metro for city transit to reduce traffic and emissions.'],
        nearestStationCode: 'JP',
        nearestStationName: 'Jaipur Junction',
        popularAttractions: [
          {
            id: 'spot_amber_fort',
            name: 'Amer Fort',
            destinationId: 'dest_jaipur',
            category: 'Historical',
            description: 'Opulent fort perched high on Cheel ka Teela, blending Rajput and Mughal design with Sheesh Mahal (Mirror Palace).',
            highlights: ['Sheesh Mahal', 'Maota Lake view', 'Royal courtyards'],
            imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 3,
            latitude: 26.9855,
            longitude: 75.8513,
            entryFee: 100,
          },
          {
            id: 'spot_hawa_mahal',
            name: 'Hawa Mahal (Palace of Winds)',
            destinationId: 'dest_jaipur',
            category: 'Historical',
            description: 'Five-storey pink sandstone facade featuring 953 intricately carved jharokhas that allow cooling breeze to circulate.',
            highlights: ['Honeycomb facade', 'City view from top', 'Stained glass windows'],
            imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59f4?auto=format&fit=crop&w=800&q=80',
            estimatedDurationHours: 1.5,
            latitude: 26.9239,
            longitude: 75.8267,
            entryFee: 50,
          },
        ],
      },
      {
        id: 'dest_agra',
        name: 'Agra',
        state: 'Uttar Pradesh',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'World-famous home of the Taj Mahal, Agra Fort, and Fatehpur Sikri—the golden epicenter of Mughal architecture along the Yamuna river.',
        highlights: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Mughal Cuisine'],
        bestTimeToVisit: 'October to March',
        category: 'Historical',
        estimatedVisitDurationDays: 2,
        latitude: 27.1767,
        longitude: 78.0081,
        ecoFriendlyScore: 88,
        sustainableTips: ['Utilize battery-operated eco-rickshaws in the protected Taj Trapezium Zone (TTZ).'],
        nearestStationCode: 'AGC',
        nearestStationName: 'Agra Cantt',
        popularAttractions: [],
      },
      {
        id: 'dest_mysuru',
        name: 'Mysuru',
        state: 'Karnataka',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1600100397608-f010f4439c2c?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1600100397608-f010f4439c2c?auto=format&fit=crop&w=800&q=80'],
        description: 'The City of Palaces, renowned for Indo-Saracenic royal estates, fragrant sandalwood, silk weaving, and vibrant Dasara festivities.',
        highlights: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens', 'Devaraja Market'],
        bestTimeToVisit: 'October to March',
        category: 'Cultural',
        estimatedVisitDurationDays: 2,
        latitude: 12.2958,
        longitude: 76.6394,
        ecoFriendlyScore: 91,
        sustainableTips: ['Rent bicycles from the Trin Trin public bicycle sharing network across heritage zones.'],
        nearestStationCode: 'MYS',
        nearestStationName: 'Mysuru Junction',
        popularAttractions: [],
      },
      {
        id: 'dest_goa',
        name: 'Goa',
        state: 'Goa',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'],
        description: 'A vibrant blend of sun-kissed Arabian Sea beaches, Portuguese colonial cathedrals, tranquil spice plantations, and Konkan hospitality.',
        highlights: ['Palolem & Morjim Beaches', 'Basilica of Bom Jesus', 'Spice Plantations', 'Dudhsagar Falls'],
        bestTimeToVisit: 'November to February',
        category: 'Beach',
        estimatedVisitDurationDays: 4,
        latitude: 15.2993,
        longitude: 74.124,
        ecoFriendlyScore: 85,
        sustainableTips: ['Participate in marine conservation beach cleanups and avoid nesting turtle dunes.'],
        nearestStationCode: 'MAO',
        nearestStationName: 'Madgaon Junction',
        popularAttractions: [],
      },
      {
        id: 'dest_manali',
        name: 'Manali',
        state: 'Himachal Pradesh',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
        description: 'Himalayan adventure haven situated by the Beas River, surrounded by snow-draped alpine peaks, cedar forests, and Solang Valley.',
        highlights: ['Solang Valley', 'Rohtang Pass gateway', 'Old Manali cafes', 'Hadimba Temple'],
        bestTimeToVisit: 'October to June',
        category: 'Adventure',
        estimatedVisitDurationDays: 4,
        latitude: 32.2432,
        longitude: 77.1892,
        ecoFriendlyScore: 90,
        sustainableTips: ['Practice Leave No Trace trekking principles and support zero-waste mountain initiatives.'],
        nearestStationCode: 'CDG',
        nearestStationName: 'Chandigarh Junction',
        popularAttractions: [],
      },
      {
        id: 'dest_varanasi',
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'],
        description: 'One of the world’s oldest continuously inhabited spiritual capitals, celebrated for sacred Ganga river ghats, classical arts, and timeless culture.',
        highlights: ['Ganga Aarti at Dashashwamedh', 'Kashi Vishwanath Corridor', 'Sunrise Boat Ride', 'Sarnath'],
        bestTimeToVisit: 'October to March',
        category: 'Cultural',
        estimatedVisitDurationDays: 3,
        latitude: 25.3176,
        longitude: 82.9739,
        ecoFriendlyScore: 84,
        sustainableTips: ['Opt for manual rowboats or solar-powered boats during sunrise river tours.'],
        nearestStationCode: 'BSB',
        nearestStationName: 'Varanasi Junction',
        popularAttractions: [],
      },
      {
        id: 'dest_udaipur',
        name: 'Udaipur',
        state: 'Rajasthan',
        country: 'India',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'],
        description: 'The Venice of the East, famed for shimmering Lake Pichola, whitewashed royal palaces, marble courtyards, and sunset views over the Aravalli range.',
        highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon-ki-Bari'],
        bestTimeToVisit: 'September to March',
        category: 'Historical',
        estimatedVisitDurationDays: 3,
        latitude: 24.5854,
        longitude: 73.7125,
        ecoFriendlyScore: 89,
        sustainableTips: ['Respect lake conservation regulations and avoid contaminating water bodies.'],
        nearestStationCode: 'UDZ',
        nearestStationName: 'Udaipur City',
        popularAttractions: [],
      },
    ];

    const initialStore = { destinations: initialDestinations, savedDestinations: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { destinations: [], savedDestinations: [] };
  }
}

function saveData(data: TourismStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

eventBus.initialize().catch((err) => console.warn('[Tourism-Service] Event bus init warning:', err));

app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'tourism-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

app.get('/api/destinations', (req: Request, res: Response) => {
  const store = loadData();
  const { category, state, search } = req.query as Record<string, string>;
  let list = store.destinations;

  if (category && category !== 'ALL') {
    list = list.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (state && state !== 'ALL') {
    list = list.filter((d) => d.state.toLowerCase() === state.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.state.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, count: list.length, destinations: list });
});

app.get('/api/destinations/:id', (req: Request, res: Response) => {
  const store = loadData();
  const dest = store.destinations.find((d) => d.id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase());
  if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });

  // Publish destination viewed event
  const userId = req.headers['x-user-id'] as string;
  eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.DESTINATION_VIEWED, {
    userId,
    destinationId: dest.id,
    destinationName: dest.name,
    category: dest.category,
    timestamp: new Date().toISOString(),
  }).catch(() => {});

  res.json({ success: true, destination: dest });
});

app.get('/api/attractions', (req: Request, res: Response) => {
  const store = loadData();
  const allAttractions: TouristSpot[] = [];
  store.destinations.forEach((d) => {
    if (d.popularAttractions) {
      allAttractions.push(...d.popularAttractions);
    }
  });
  res.json({ success: true, count: allAttractions.length, attractions: allAttractions });
});

// Saved destinations
app.get('/api/saved-destinations', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let saved = store.savedDestinations;
  if (userId) {
    saved = saved.filter((s) => s.userId === userId);
  }
  const destinationDetails = saved.map((s) => {
    const dest = store.destinations.find((d) => d.id === s.destinationId);
    return { ...s, destination: dest };
  }).filter((s) => s.destination);

  res.json({ success: true, count: destinationDetails.length, saved: destinationDetails });
});

app.post('/api/saved-destinations', (req: Request, res: Response) => {
  const { userId, destinationId } = req.body;
  if (!userId || !destinationId) {
    return res.status(400).json({ success: false, message: 'userId and destinationId required' });
  }
  const store = loadData();
  const existing = store.savedDestinations.find((s) => s.userId === userId && s.destinationId === destinationId);
  if (existing) {
    return res.json({ success: true, message: 'Already saved', record: existing });
  }

  const record: SavedDestinationRecord = {
    id: `save_${Date.now()}`,
    userId,
    destinationId,
    savedAt: new Date().toISOString(),
  };
  store.savedDestinations.push(record);
  saveData(store);
  res.status(201).json({ success: true, message: 'Destination saved', record });
});

app.delete('/api/saved-destinations/:destinationId', (req: Request, res: Response) => {
  const userId = req.query.userId as string || req.body.userId;
  const store = loadData();
  store.savedDestinations = store.savedDestinations.filter(
    (s) => !(s.destinationId === req.params.destinationId && (!userId || s.userId === userId))
  );
  saveData(store);
  res.json({ success: true, message: 'Removed from saved destinations' });
});

// Admin management
app.post('/api/destinations', (req: Request, res: Response) => {
  const store = loadData();
  const newDest: Destination = {
    ...req.body,
    id: `dest_${Date.now()}`,
    country: 'India',
    popularAttractions: req.body.popularAttractions || [],
  };
  store.destinations.push(newDest);
  saveData(store);
  res.status(201).json({ success: true, destination: newDest });
});

app.put('/api/destinations/:id', (req: Request, res: Response) => {
  const store = loadData();
  const index = store.destinations.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Destination not found' });
  store.destinations[index] = { ...store.destinations[index], ...req.body };
  saveData(store);
  res.json({ success: true, destination: store.destinations[index] });
});

app.delete('/api/destinations/:id', (req: Request, res: Response) => {
  const store = loadData();
  store.destinations = store.destinations.filter((d) => d.id !== req.params.id);
  saveData(store);
  res.json({ success: true, message: 'Destination deleted' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Tourism-Service] Server listening on port ${PORT}`);
  });
}

export default app;
