import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Recommendation, Destination } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5006;
const DATA_FILE = path.resolve(__dirname, '../data/recommendations.json');
const TOURISM_DATA_FILE = path.resolve(__dirname, '../../tourism-service/data/tourism.json');

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface RecommendationStore {
  recommendations: Recommendation[];
}

function loadData(): RecommendationStore {
  if (!fs.existsSync(DATA_FILE)) {
    const initial: RecommendationStore = {
      recommendations: [
        {
          id: 'rec_init_001',
          userId: 'usr_demo_002',
          destinationId: 'dest_munnar',
          destinationName: 'Munnar',
          destinationImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          category: 'Nature',
          matchScore: 96,
          reason: 'Recommended because you selected Nature and Cultural Experiences and have 3 days available for a scenic mountain retreat.',
          state: 'Kerala',
          attractions: ['Eravikulam National Park', 'KDHP Tea Museum & Factory', 'Mattupetty Dam'],
          createdAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { recommendations: [] };
  }
}

function saveData(data: RecommendationStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getAvailableDestinations(): Destination[] {
  try {
    if (fs.existsSync(TOURISM_DATA_FILE)) {
      const raw = fs.readFileSync(TOURISM_DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.destinations && parsed.destinations.length) {
        return parsed.destinations;
      }
    }
  } catch (e) {}

  // Fallback default list if tourism data file is initializing
  return [
    {
      id: 'dest_munnar',
      name: 'Munnar',
      state: 'Kerala',
      country: 'India',
      coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      description: 'Emerald tea gardens in the Western Ghats.',
      highlights: ['Tea Plantations', 'Eravikulam National Park'],
      bestTimeToVisit: 'September to March',
      category: 'Nature',
      estimatedVisitDurationDays: 3,
      latitude: 10.0889,
      longitude: 77.0595,
      ecoFriendlyScore: 94,
      sustainableTips: [],
      nearestStationCode: 'ERS',
      nearestStationName: 'Ernakulam Junction',
      popularAttractions: [],
    },
    {
      id: 'dest_jaipur',
      name: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      coverImage: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59f4?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      description: 'Royal palaces and forts in the Pink City.',
      highlights: ['Amber Fort', 'Hawa Mahal'],
      bestTimeToVisit: 'October to March',
      category: 'Historical',
      estimatedVisitDurationDays: 3,
      latitude: 26.9124,
      longitude: 75.7873,
      ecoFriendlyScore: 86,
      sustainableTips: [],
      nearestStationCode: 'JP',
      nearestStationName: 'Jaipur Junction',
      popularAttractions: [],
    },
  ];
}

const app = express();
app.use(cors());
app.use(express.json());

eventBus.initialize().catch((err) => console.warn('[Recommendation-Service] Event bus init warning:', err));

app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'recommendation-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// Rule-based Recommendation Algorithm
app.post('/api/recommendations/generate', async (req: Request, res: Response) => {
  try {
    const { userId, categories, preferredState, availableDays, travelStyle } = req.body;
    const userCategories: string[] = categories && categories.length ? categories : ['Nature'];
    const userDays = Number(availableDays) || 3;
    const destinations = getAvailableDestinations();

    const scored = destinations.map((dest) => {
      let score = 50; // base score
      const reasons: string[] = [];

      // 1. Category Matching (up to +30 points)
      const matchesCategory = userCategories.some(
        (c) => c.toLowerCase() === dest.category.toLowerCase()
      );
      if (matchesCategory) {
        score += 30;
        reasons.push(`matches your interest in ${dest.category}`);
      }

      // Check sub-attraction categories
      if (dest.popularAttractions && dest.popularAttractions.length) {
        const matchingSpots = dest.popularAttractions.filter((s) =>
          userCategories.some((c) => c.toLowerCase() === s.category.toLowerCase())
        );
        if (matchingSpots.length > 0) {
          score += 10;
          reasons.push(`features attractions matching ${matchingSpots[0].category}`);
        }
      }

      // 2. Preferred State Matching (+15 points)
      if (preferredState && preferredState !== 'ALL') {
        if (dest.state.toLowerCase() === preferredState.toLowerCase()) {
          score += 15;
          reasons.push(`is located in your preferred state of ${dest.state}`);
        }
      }

      // 3. Duration Matching (+10 points)
      const dayDiff = Math.abs(dest.estimatedVisitDurationDays - userDays);
      if (dayDiff === 0) {
        score += 10;
        reasons.push(`ideally fits your ${userDays}-day schedule`);
      } else if (dayDiff === 1) {
        score += 5;
        reasons.push(`comfortably accommodates a ${userDays}-day itinerary`);
      }

      // 4. Sustainability & Train Accessibility (+5 points)
      if (dest.ecoFriendlyScore >= 90) {
        score += 5;
        reasons.push(`features a high sustainability score (${dest.ecoFriendlyScore}/100)`);
      }

      // Bound score to 99 max
      const finalScore = Math.min(99, Math.max(45, score));
      const reasonSummary = `Recommended because it ${reasons.join(', and ')}.`;

      const recommendation: Recommendation = {
        id: `rec_${Date.now()}_${dest.id}`,
        userId: userId || 'anonymous',
        destinationId: dest.id,
        destinationName: dest.name,
        destinationImage: dest.coverImage,
        category: dest.category,
        matchScore: finalScore,
        reason: reasonSummary,
        state: dest.state,
        attractions: dest.popularAttractions ? dest.popularAttractions.map((a) => a.name) : dest.highlights,
        createdAt: new Date().toISOString(),
      };

      return recommendation;
    });

    // Rank by matchScore descending
    scored.sort((a, b) => b.matchScore - a.matchScore);
    const topRecommendations = scored.slice(0, 6);

    // Save generated recommendations for this user
    if (userId) {
      const store = loadData();
      store.recommendations = [
        ...topRecommendations,
        ...store.recommendations.filter((r) => r.userId !== userId),
      ];
      saveData(store);

      // Publish event
      eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.RECOMMENDATION_GENERATED, {
        userId,
        recommendedIds: topRecommendations.map((r) => r.destinationId),
        matchScore: topRecommendations[0]?.matchScore || 90,
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    }

    res.json({
      success: true,
      count: topRecommendations.length,
      recommendations: topRecommendations,
      explanation: 'Recommendations computed via rule-based category, duration, and regional preference matching.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/recommendations', (req: Request, res: Response) => {
  const store = loadData();
  const userId = req.query.userId as string;
  let results = store.recommendations;
  if (userId) {
    results = results.filter((r) => r.userId === userId);
  }
  if (!results.length) {
    // Generate initial default set if empty
    const destinations = getAvailableDestinations();
    results = destinations.slice(0, 4).map((d, idx) => ({
      id: `rec_def_${d.id}`,
      userId: userId || 'guest',
      destinationId: d.id,
      destinationName: d.name,
      destinationImage: d.coverImage,
      category: d.category,
      matchScore: 95 - idx * 4,
      reason: `Recommended destination in ${d.state} with outstanding rail connectivity and cultural heritage.`,
      state: d.state,
      attractions: d.highlights,
      createdAt: new Date().toISOString(),
    }));
  }
  res.json({ success: true, count: results.length, recommendations: results });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Recommendation-Service] Server listening on port ${PORT}`);
  });
}

export default app;
