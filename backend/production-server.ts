import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import userApp from './user-service/src';
import railwayApp from './railway-service/src';
import reservationApp from './reservation-service/src';
import tourismApp from './tourism-service/src';
import heritageApp from './heritage-service/src';
import recommendationApp from './recommendation-service/src';
import itineraryApp from './itinerary-service/src';
import notificationApp from './notification-service/src';
import gatewayApp from './api-gateway/src';

const PORT = Number(process.env.PORT) || 5000;

// Start microservices internally on their respective ports
const services = [
  { name: 'User Service', app: userApp, port: 5001 },
  { name: 'Railway Service', app: railwayApp, port: 5002 },
  { name: 'Reservation Service', app: reservationApp, port: 5003 },
  { name: 'Tourism Service', app: tourismApp, port: 5004 },
  { name: 'Heritage Service', app: heritageApp, port: 5005 },
  { name: 'Recommendation Service', app: recommendationApp, port: 5006 },
  { name: 'Itinerary Service', app: itineraryApp, port: 5007 },
  { name: 'Notification Service', app: notificationApp, port: 5008 },
];

services.forEach(({ name, app, port }) => {
  app.listen(port, '127.0.0.1', () => {
    console.log(`[MICROSERVICE] Started ${name.padEnd(24)} on http://127.0.0.1:${port}`);
  });
});

// Serve compiled frontend production assets (React SPA)
const distPath = path.resolve(__dirname, '../frontend/dist');
gatewayApp.use(express.static(distPath));

// For all non-API GET requests, serve frontend's index.html (SPA client routing)
gatewayApp.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

gatewayApp.listen(PORT, '0.0.0.0', () => {
  console.log('===============================================================');
  console.log(`       AUREVIA ALL-IN-ONE PRODUCTION CLOUD SERVER             `);
  console.log(`         "The World, Seamlessly Connected."                    `);
  console.log('===============================================================');
  console.log(`Listening on: http://0.0.0.0:${PORT}`);
  console.log(`Frontend App: http://localhost:${PORT}`);
  console.log(`API Gateway:  http://localhost:${PORT}/api/health`);
  console.log('===============================================================');
});
