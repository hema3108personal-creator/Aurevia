import userApp from './user-service/src';
import railwayApp from './railway-service/src';
import reservationApp from './reservation-service/src';
import tourismApp from './tourism-service/src';
import heritageApp from './heritage-service/src';
import recommendationApp from './recommendation-service/src';
import itineraryApp from './itinerary-service/src';
import notificationApp from './notification-service/src';
import gatewayApp from './api-gateway/src';

const services = [
  { name: 'User Service', app: userApp, port: 5001 },
  { name: 'Railway Service', app: railwayApp, port: 5002 },
  { name: 'Reservation Service', app: reservationApp, port: 5003 },
  { name: 'Tourism Service', app: tourismApp, port: 5004 },
  { name: 'Heritage Service', app: heritageApp, port: 5005 },
  { name: 'Recommendation Service', app: recommendationApp, port: 5006 },
  { name: 'Itinerary Service', app: itineraryApp, port: 5007 },
  { name: 'Notification Service', app: notificationApp, port: 5008 },
  { name: 'API Gateway', app: gatewayApp, port: 5000 },
];

console.log('===============================================================');
console.log('       AUREVIA EVENT-DRIVEN MICROSERVICES ORCHESTRATOR         ');
console.log('         "The World, Seamlessly Connected."                    ');
console.log('===============================================================');

services.forEach(({ name, app, port }) => {
  app.listen(port, () => {
    console.log(`[ORCHESTRATOR] Started ${name.padEnd(24)} on http://localhost:${port}`);
  });
});

console.log('===============================================================');
console.log('All 9 microservices and API Gateway are running.');
console.log('Gateway URL: http://localhost:5000');
console.log('Health Check: http://localhost:5000/api/health');
console.log('Swagger Docs: http://localhost:5000/api/docs');
console.log('===============================================================');
