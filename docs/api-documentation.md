# AUREVIA – REST API Documentation & Reference

The AUREVIA platform exposes REST APIs through the centralized **API Gateway on Port 5000**. All microservices communicate with JSON over HTTP and enforce input validation using Zod schemas.

---

## 1. Authentication & User Service Endpoints

### `POST /api/auth/register`
Creates a new traveler account and publishes a `user.registered` event.
- **Request Body:**
  ```json
  {
    "name": "Aarav Sharma",
    "email": "traveler@aurevia.com",
    "password": "Traveler@12345",
    "phone": "+91 98765 43210"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_demo_002",
      "name": "Aarav Sharma",
      "email": "traveler@aurevia.com",
      "role": "USER",
      "isActive": true
    }
  }
  ```

### `POST /api/auth/login`
Authenticates credentials against salted bcrypt password hash.
- **Request Body:**
  ```json
  {
    "email": "traveler@aurevia.com",
    "password": "Traveler@12345"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
  ```

### `GET /api/auth/me`
Returns authenticated user profile. Requires `Authorization: Bearer <token>`.

### `GET /api/auth/preferences` / `PUT /api/auth/preferences`
Retrieves or updates travel interest categories, available days, and preferred states.

---

## 2. Railway Service Endpoints

### `GET /api/stations`
Lists Indian Railways stations.
- **Query Parameters:** `q` (Search query, optional)

### `GET /api/trains/search`
Searches available trains between stations with simulated seat inventory.
- **Query Parameters:**
  - `from`: Station code (e.g. `MAS`)
  - `to`: Station code (e.g. `ERS`)
  - `date`: Journey date (`YYYY-MM-DD`)
  - `travelClass`: Class filter (`CC`, `EC`, `1A`, `2A`, `3A`, `SL`, or `ALL`)
  - `sortBy`: `departure`, `duration`, or `fare`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "isSimulated": true,
    "trains": [
      {
        "id": "trn_20633",
        "trainNumber": "20633",
        "trainName": "Vande Bharat Express",
        "sourceStationCode": "MAS",
        "sourceStationName": "Chennai Central",
        "destinationStationCode": "ERS",
        "destinationStationName": "Ernakulam Junction (Kochi)",
        "departureTime": "06:00",
        "arrivalTime": "14:30",
        "durationFormatted": "8h 30m",
        "distanceKm": 695,
        "isSimulated": true,
        "classes": [
          { "classCode": "CC", "className": "AC Chair Car", "fare": 1580, "availableSeats": 48 },
          { "classCode": "EC", "className": "Executive Anubhuti", "fare": 2950, "availableSeats": 16 }
        ]
      }
    ]
  }
  ```

---

## 3. Reservation Service Endpoints

### `POST /api/bookings`
Creates a simulated railway booking, validates idempotency, commits the record, and publishes `booking.confirmed`.
- **Request Body:**
  ```json
  {
    "userId": "usr_demo_002",
    "trainId": "trn_20633",
    "trainNumber": "20633",
    "trainName": "Vande Bharat Express",
    "sourceStationCode": "MAS",
    "destinationStationCode": "ERS",
    "journeyDate": "2026-12-05",
    "travelClass": "CC",
    "passengers": [
      { "name": "Aarav Sharma", "age": 29, "gender": "MALE", "seatPreference": "WINDOW" }
    ],
    "totalFare": 1580,
    "idempotencyKey": "idem_unique_token_123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Railway booking confirmed successfully",
    "booking": {
      "id": "bkg_101",
      "pnr": "PNR-4493-3693",
      "status": "CONFIRMED",
      "passengers": [
        { "name": "Aarav Sharma", "seatNumber": "C3-24", ... }
      ]
    }
  }
  ```

### `POST /api/bookings/:id/cancel`
Cancels booking and publishes `booking.cancelled` event.

---

## 4. Recommendation Service Endpoints

### `POST /api/recommendations/generate`
Executes rule-based scoring algorithm matching user categories, trip duration, regional preferences, and calculating human-readable explanations.
- **Request Body:**
  ```json
  {
    "userId": "usr_demo_002",
    "categories": ["Nature", "Cultural Experiences"],
    "preferredState": "Kerala",
    "availableDays": 3,
    "travelStyle": "Scenic"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 6,
    "recommendations": [
      {
        "destinationId": "dest_munnar",
        "destinationName": "Munnar",
        "matchScore": 96,
        "reason": "Recommended because it matches your interest in Nature, is located in your preferred state of Kerala, and ideally fits your 3-day schedule."
      }
    ]
  }
  ```

---

## 5. System Health & Gateway Endpoints

### `GET /api/health`
Probes all 9 microservices simultaneously and returns health metrics.
```json
{
  "gateway": { "service": "api-gateway", "status": "HEALTHY", "port": 5000 },
  "services": {
    "user": { "service": "user-service", "status": "HEALTHY" },
    "railway": { "service": "railway-service", "status": "HEALTHY" },
    "reservation": { "service": "reservation-service", "status": "HEALTHY" },
    "tourism": { "service": "tourism-service", "status": "HEALTHY" },
    "heritage": { "service": "heritage-service", "status": "HEALTHY" },
    "recommendation": { "service": "recommendation-service", "status": "HEALTHY" },
    "itinerary": { "service": "itinerary-service", "status": "HEALTHY" },
    "notification": { "service": "notification-service", "status": "HEALTHY" }
  },
  "systemOperational": true
}
```

### `GET /api/docs`
Serves full OpenAPI 3.0 specification for Swagger tools.
