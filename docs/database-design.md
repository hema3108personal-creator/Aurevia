# AUREVIA – Database Design & Entity Relationships

## 1. Relational Database Strategy

AUREVIA uses a **Database-Per-Service** architectural pattern. In a production PostgreSQL deployment, each microservice manages its own schema (`users`, `railway`, `reservations`, `tourism`, `heritage`, `recommendations`, `itineraries`, `notifications`).

In local standalone execution, each service operates an ACID-compliant, JSON/SQLite-compatible relational store with atomic file writes and schema validation, perfectly mirroring the PostgreSQL schema.

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o| USER_PREFERENCE : has
    USER ||--o{ BOOKING : books
    USER ||--o{ ITINERARY : creates
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ SAVED_DESTINATION : saves
    USER ||--o{ SAVED_HERITAGE : saves

    TRAIN ||--|{ TRAIN_CLASS : contains
    TRAIN }|--|| STATION : departs_from
    TRAIN }|--|| STATION : arrives_at

    BOOKING ||--|{ PASSENGER : includes
    BOOKING ||--o| BOOKING_EVENT_OUTBOX : logs

    DESTINATION ||--o{ TOURIST_SPOT : features
    DESTINATION ||--o{ SAVED_DESTINATION : saved_by

    HERITAGE_SITE ||--o{ SAVED_HERITAGE : saved_by

    ITINERARY ||--|{ ITINERARY_ACTIVITY : contains

    USER {
        string id PK
        string email UK
        string name
        string phone
        enum role "USER | ADMIN"
        boolean isActive
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    USER_PREFERENCE {
        string id PK
        string userId FK
        string_array categories
        string preferredState
        int availableDays
        string travelStyle
    }

    STATION {
        string id PK
        string code UK
        string name
        string city
        string state
        float latitude
        float longitude
    }

    TRAIN {
        string id PK
        string trainNumber UK
        string trainName
        string sourceStationCode
        string destinationStationCode
        string departureTime
        string arrivalTime
        int durationMinutes
        float distanceKm
        boolean isSimulated
    }

    TRAIN_CLASS {
        string id PK
        string trainId FK
        string classCode
        string className
        float fare
        int totalSeats
        int availableSeats
    }

    BOOKING {
        string id PK
        string pnr UK
        string userId FK
        string trainNumber
        string trainName
        string journeyDate
        string travelClass
        float totalFare
        enum status "PENDING | CONFIRMED | CANCELLED"
        string idempotencyKey UK
        string cancellationReason
        datetime createdAt
    }

    PASSENGER {
        string id PK
        string bookingId FK
        string name
        int age
        string gender
        string seatPreference
        string seatNumber
    }

    BOOKING_EVENT_OUTBOX {
        string id PK
        string eventType
        json payload
        string status
        datetime createdAt
        datetime publishedAt
    }

    DESTINATION {
        string id PK
        string name UK
        string state
        string category
        string description
        int estimatedVisitDurationDays
        float latitude
        float longitude
        int ecoFriendlyScore
        string nearestStationCode
    }

    TOURIST_SPOT {
        string id PK
        string destinationId FK
        string name
        string category
        float estimatedDurationHours
        float entryFee
    }

    HERITAGE_SITE {
        string id PK
        string name UK
        string location
        string state
        string category
        string historicalBackground
        string culturalSignificance
        string architecturalDetails
        json visitingInformation
        string nearestStationCode
    }

    ITINERARY {
        string id PK
        string userId FK
        string title
        string destinationId
        string destinationName
        string startDate
        string endDate
        int numberOfDays
        string notes
    }

    ITINERARY_ACTIVITY {
        string id PK
        string itineraryId FK
        int dayNumber
        string activityTitle
        string timeSlot
        int durationMinutes
        int orderIndex
    }

    NOTIFICATION {
        string id PK
        string userId FK
        string title
        string message
        enum type
        string referenceId
        boolean isRead
        datetime createdAt
    }
```

---

## 3. Data Integrity & Constraints

- **Unique Constraints:**
  - `users.email` (Case-insensitive unique identity)
  - `stations.code` (Unique 3-4 letter railway junction code, e.g., MAS, NDLS, ERS)
  - `trains.trainNumber` (Unique 5-digit Indian Railways service number, e.g., 20633)
  - `bookings.pnr` (Unique 10-character reference number, format `PNR-XXXX-XXXX`)
  - `bookings.idempotencyKey` (Guarantees zero duplicate booking operations on client retry)
  - `saved_destinations.(userId, destinationId)` (Prevents duplicate bookmarks)
  - `saved_heritage.(userId, heritageId)` (Prevents duplicate heritage saves)
