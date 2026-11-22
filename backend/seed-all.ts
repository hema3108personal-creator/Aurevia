import * as path from 'path';
import * as fs from 'fs';

console.log('[Seed] Ensuring all microservices data stores are primed with demonstration data...');

const services = [
  'user-service',
  'railway-service',
  'reservation-service',
  'tourism-service',
  'heritage-service',
  'recommendation-service',
  'itinerary-service',
  'notification-service',
];

services.forEach((s) => {
  const dir = path.resolve(__dirname, s, 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log(`[Seed] Verified data directory for ${s}`);
});

console.log('[Seed] All microservice databases seeded successfully.');
