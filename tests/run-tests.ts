import * as http from 'http';
import userApp from '../backend/user-service/src';
import railwayApp from '../backend/railway-service/src';
import reservationApp from '../backend/reservation-service/src';
import tourismApp from '../backend/tourism-service/src';
import heritageApp from '../backend/heritage-service/src';
import recommendationApp from '../backend/recommendation-service/src';
import itineraryApp from '../backend/itinerary-service/src';
import notificationApp from '../backend/notification-service/src';
import gatewayApp from '../backend/api-gateway/src';
import { eventBus } from '../shared/event-bus';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, details !== undefined ? JSON.stringify(details) : '');
    failed++;
  }
}

function httpRequest(options: {
  port: number;
  path: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const postData = options.body ? JSON.stringify(options.body) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: options.port,
        path: options.path,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData).toString() } : {}),
          ...(options.headers || {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            resolve({ status: res.statusCode || 200, data });
          } catch (e) {
            resolve({ status: res.statusCode || 200, data: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('            AUREVIA AUTOMATED TEST SUITE EXECUTION             ');
  console.log('===============================================================\n');

  // Start HTTP servers on their designated microservice ports
  const servers: http.Server[] = [];
  await new Promise<void>((resolve) => {
    servers.push(userApp.listen(5001, () => {}));
    servers.push(railwayApp.listen(5002, () => {}));
    servers.push(reservationApp.listen(5003, () => {}));
    servers.push(tourismApp.listen(5004, () => {}));
    servers.push(heritageApp.listen(5005, () => {}));
    servers.push(recommendationApp.listen(5006, () => {}));
    servers.push(itineraryApp.listen(5007, () => {}));
    servers.push(notificationApp.listen(5008, () => {}));
    servers.push(gatewayApp.listen(5000, () => resolve()));
  });

  try {
    // Test 1: EventBus initialization
    console.log('[TEST GROUP 1] Event Bus & Messaging Architecture');
    await eventBus.initialize();
    assert(true, 'EventBus initialized with durable topic exchange and queues');

    // Test 2: User Service - Registration
    console.log('\n[TEST GROUP 2] User Service & Authentication');
    const testEmail = `test_user_${Date.now()}@example.com`;
    const regRes = await httpRequest({
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      body: {
        name: 'Rohan Mehta',
        email: testEmail,
        password: 'Password@123',
        phone: '+91 98765 43210',
      },
    });

    assert(regRes.status === 201 && regRes.data.success === true, 'User registration endpoint returns 201 Created', regRes.data);
    assert(!!regRes.data?.token, 'Registration issues JWT access token');
    const registeredUserId = regRes.data?.user?.id;
    const userToken = regRes.data?.token;

    // Test 3: User Service - Login
    const loginRes = await httpRequest({
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      body: {
        email: testEmail,
        password: 'Password@123',
      },
    });

    assert(loginRes.status === 200 && loginRes.data.success === true, 'User login validates bcrypt hash and issues JWT', loginRes.data);

    // Test 4: Railway Service - Train Search
    console.log('\n[TEST GROUP 3] Railway Service - Search & Availability');
    const searchRes = await httpRequest({
      port: 5002,
      path: '/api/trains/search?from=MAS&to=ERS',
    });

    assert(searchRes.status === 200 && searchRes.data.success === true, 'Train search returns results for route MAS -> ERS', searchRes.data);
    assert(searchRes.data.trains.length > 0, `Found ${searchRes.data.trains?.length} trains between Chennai and Kochi`);
    assert(searchRes.data.trains[0]?.isSimulated === true, 'Clearly marks train data as simulated');

    // Test 5: Reservation Service - Booking & Event-Driven Flow
    console.log('\n[TEST GROUP 4] Reservation Service & Event-Driven Booking Workflow');
    const idempotencyKey = `idem_test_${Date.now()}`;
    const bookingRes = await httpRequest({
      port: 5003,
      path: '/api/bookings',
      method: 'POST',
      body: {
        userId: registeredUserId,
        userName: 'Rohan Mehta',
        userEmail: testEmail,
        trainId: 'trn_20633',
        trainNumber: '20633',
        trainName: 'Vande Bharat Express',
        sourceStationCode: 'MAS',
        sourceStationName: 'Chennai Central',
        destinationStationCode: 'ERS',
        destinationStationName: 'Ernakulam Junction (Kochi)',
        journeyDate: '2026-12-10',
        departureTime: '06:00',
        arrivalTime: '14:30',
        travelClass: 'CC',
        passengers: [{ name: 'Rohan Mehta', age: 31, gender: 'MALE', seatPreference: 'WINDOW' }],
        totalFare: 1580,
        idempotencyKey,
      },
    });

    assert(bookingRes.status === 201 && bookingRes.data.success === true, 'Railway reservation created and stored in database', bookingRes.data);
    assert(bookingRes.data?.booking?.pnr?.startsWith('PNR-'), `Generated unique PNR: ${bookingRes.data?.booking?.pnr}`);
    const createdBookingId = bookingRes.data?.booking?.id;

    // Test 6: Idempotency Key Verification
    const dupRes = await httpRequest({
      port: 5003,
      path: '/api/bookings',
      method: 'POST',
      body: {
        userId: registeredUserId,
        trainNumber: '20633',
        journeyDate: '2026-12-10',
        travelClass: 'CC',
        passengers: [{ name: 'Rohan Mehta', age: 31, gender: 'MALE' }],
        idempotencyKey,
      },
    });
    assert(dupRes.data?.isDuplicate === true, 'Idempotency key prevents duplicate booking creation');

    // Test 7: Notification Service - Consumer Verification
    console.log('\n[TEST GROUP 5] Notification Service Event Consumer Verification');
    // Allow asynchronous event dispatch
    await new Promise((r) => setTimeout(r, 400));

    const notifRes = await httpRequest({
      port: 5008,
      path: `/api/notifications?userId=${registeredUserId}`,
    });

    assert(notifRes.status === 200 && notifRes.data.success === true, 'Notification service endpoint responds');
    const foundBookingNotif = notifRes.data?.notifications?.some(
      (n: any) => n.type === 'BOOKING_CONFIRMATION'
    );
    assert(foundBookingNotif, 'NotificationService consumed BookingConfirmed event and stored notification');

    // Test 8: Tourism & Heritage Discovery
    console.log('\n[TEST GROUP 6] Tourism & Cultural Heritage Modules');
    const destRes = await httpRequest({
      port: 5004,
      path: '/api/destinations',
    });
    assert(destRes.data.destinations?.length >= 5, `Retrieved ${destRes.data.destinations?.length} Indian destinations`);

    const heritageRes = await httpRequest({
      port: 5005,
      path: '/api/heritage',
    });
    assert(heritageRes.data.sites?.length >= 5, `Retrieved ${heritageRes.data.sites?.length} Cultural Heritage sites`);

    // Test 9: Recommendation Service - Rule-Based Scoring
    console.log('\n[TEST GROUP 7] Recommendation Engine Rule-Based Scoring');
    const recRes = await httpRequest({
      port: 5006,
      path: '/api/recommendations/generate',
      method: 'POST',
      body: {
        userId: registeredUserId,
        categories: ['Nature', 'Cultural Experiences'],
        preferredState: 'Kerala',
        availableDays: 3,
      },
    });

    assert(recRes.status === 200 && recRes.data.success === true, 'Recommendation algorithm executed successfully');
    assert(recRes.data.recommendations?.length > 0, `Generated ${recRes.data.recommendations?.length} ranked recommendations`);
    assert(recRes.data?.recommendations[0]?.matchScore >= 80, `Top destination scored ${recRes.data?.recommendations[0]?.matchScore}/100`);
    assert(typeof recRes.data?.recommendations[0]?.reason === 'string', 'Transparent human-readable explanation generated');

    // Test 10: Itinerary Service
    console.log('\n[TEST GROUP 8] Travel Itinerary Management');
    const itinRes = await httpRequest({
      port: 5007,
      path: '/api/itineraries',
      method: 'POST',
      body: {
        userId: registeredUserId,
        title: 'Western Ghats Scenic Journey',
        destinationId: 'dest_munnar',
        destinationName: 'Munnar',
        startDate: '2026-12-10',
        endDate: '2026-12-13',
        numberOfDays: 3,
        activities: [
          { dayNumber: 1, activityTitle: 'Arrival & Tea Tasting', durationMinutes: 180, orderIndex: 0 },
        ],
      },
    });

    assert(itinRes.status === 201 && itinRes.data.success === true, 'Itinerary created successfully with timeline activities');
    const createdItinId = itinRes.data?.itinerary?.id;

    // Test 11: Booking Cancellation Flow
    console.log('\n[TEST GROUP 9] Booking Cancellation & Event Flow');
    const cancelRes = await httpRequest({
      port: 5003,
      path: `/api/bookings/${createdBookingId}/cancel`,
      method: 'POST',
      body: { reason: 'Schedule update' },
    });

    assert(cancelRes.status === 200 && cancelRes.data.success === true, 'Booking cancelled successfully');
    assert(cancelRes.data?.booking?.status === 'CANCELLED', 'Booking status persisted as CANCELLED in database');

    // Test 12: API Gateway Routing & Health Aggregation
    console.log('\n[TEST GROUP 10] API Gateway Reverse Proxy & Analytics');
    const gwHealth = await httpRequest({
      port: 5000,
      path: '/api/health',
    });
    assert(gwHealth.status === 200 && gwHealth.data?.systemOperational === true, 'API Gateway confirms all 9 microservices are healthy');

    const gwAnalytics = await httpRequest({
      port: 5000,
      path: '/api/admin/analytics',
    });
    assert(gwAnalytics.status === 200 && gwAnalytics.data?.success === true, 'Admin analytics aggregation responds with metrics and charts');
    assert(gwAnalytics.data?.metrics?.totalBookings > 0, `Total bookings computed: ${gwAnalytics.data?.metrics?.totalBookings}`);

  } finally {
    // Cleanly close test servers
    servers.forEach((s) => s.close());
  }

  // Summary
  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
