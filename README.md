# AUREVIA – The World, Seamlessly Connected

> **Event-Driven Microservices Architecture for a Smart Tourism and Railway Reservation System Promoting Sustainable Travel and Cultural Heritage**
> 
> *A Final-Year Engineering Capstone Project in Distributed Systems, Cloud Architecture, and Web Engineering.*

---

## 🌟 Executive Summary

**AUREVIA** is an enterprise-grade travel-tech platform that converges railway transit reservation, responsible eco-tourism discovery, and cultural heritage preservation into a single, unified digital ecosystem. 

Modern travellers face friction when juggling disparate booking engines for train reservations, disconnected destination guides, and unstructured tourism recommendations. **AUREVIA** eliminates this fragmentation through a loosely coupled, event-driven microservices architecture that delivers sub-second cross-domain coordination, simulated IRCTC-grade railway ticketing, dynamic carbon footprint offsets, rule-based algorithmic travel recommendations, and automated asynchronous event processing.

Designed with a **luxury editorial aesthetic** (Midnight Navy `#101D2C`, Warm Ivory `#F7F5F0`, Emerald Green `#27856B`, and Champagne Gold `#C6A879`), AUREVIA exemplifies modern commercial travel standards while strictly adhering to distributed systems engineering fundamentals.

---

## 📑 Table of Contents

- [Architectural Highlights](#-architectural-highlights)
- [System Architecture & Event-Driven Topology](#-system-architecture--event-driven-topology)
- [Technology Stack](#-technology-stack)
- [Microservices Portfolio & Port Allocations](#-microservices-portfolio--port-allocations)
- [Event-Driven Communication & RabbitMQ Contracts](#-event-driven-communication--rabbitmq-contracts)
- [Database Architecture & Data Isolation](#-database-architecture--data-isolation)
- [Complete 33-Page Information Architecture](#-complete-33-page-information-architecture)
- [Prerequisites & Environment Setup](#-prerequisites--environment-setup)
- [Getting Started & Quick Launch](#-getting-started--quick-launch)
  - [Option A: Local Development (Instant Launch, No Docker Required)](#option-a-local-development-instant-launch-no-docker-required)
  - [Option B: Containerized Orchestration (Docker & Docker Compose)](#option-b-containerized-orchestration-docker--docker-compose)
- [Pre-Seeded Demo Evaluation Accounts](#-pre-seeded-demo-evaluation-accounts)
- [Capstone Evaluation & Viva Walkthrough (20 Steps)](#-capstone-evaluation--viva-walkthrough-20-steps)
- [Automated Verification & Test Execution](#-automated-verification--test-execution)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏛 Architectural Highlights

1. **Strict Microservice Isolation**:
   - 9 independent Express.js/TypeScript microservices + 1 API Gateway.
   - Zero cross-service database access; each service encapsulates its bounded context and schema.
2. **Resilient Event-Driven Messaging**:
   - RabbitMQ AMQP Topic Exchange (`aurevia.events`) with persistent queues, routing keys, and Dead-Letter Exchanges (DLX).
   - In-process persistent event broker fallback ensures 100% operational readiness even during local evaluation without RabbitMQ daemon.
3. **Simulated High-Concurrency Railway Booking**:
   - Atomic seat availability deduction across AC First Class (1A), AC 2 Tier (2A), AC 3 Tier (3A), and Sleeper (SL).
   - Instant cryptographic 10-digit PNR generation and simulated ticket issuance.
   - Idempotency key protection preventing duplicate financial transactions.
4. **Heritage & Eco-Tourism Engine**:
   - Deep curation of UNESCO World Heritage sites, architectural wonders, conservation guidelines, and dress codes.
   - Rail vs. road/flight carbon emissions calculator educating travellers on eco-friendly travel.
5. **Heuristic Recommendation & Dynamic Itinerary Planner**:
   - Collaborative and content-based scoring matching user travel preferences, budget tiers, and activity affinity with destination tags.
   - Multi-day trip itinerary builder with interactive Leaflet/OpenStreetMap geographic coordinates.

---

## 📐 System Architecture & Event-Driven Topology

```
                                  [ React + TypeScript + Vite SPA ]
                                           (Port 3000 / 5173)
                                                   │
                                                   ▼ HTTPS / REST
                                        ┌───────────────────────┐
                                        │   AUREVIA API GATEWAY │
                                        │      (Port 5000)      │
                                        └───────────┬───────────┘
                                                    │
            ┌───────────────────┬───────────────────┼───────────────────┬───────────────────┐
            │                   │                   │                   │                   │
            ▼                   ▼                   ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │ User Service  │   │Railway Service│   │Reservation Svc│   │Tourism Service│   │Heritage Svc   │
    │  (Port 5001)  │   │  (Port 5002)  │   │  (Port 5003)  │   │  (Port 5004)  │   │  (Port 5005)  │
    └───────┬───────┘   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
            │                   │                   │                   │                   │
            │                   │                   │                   │                   │
            └───────────────────┴─────────┐         │         ┌─────────┴───────────────────┘
                                          │         │         │
                                          ▼         ▼         ▼
                                 ┌─────────────────────────────────────┐
                                 │       AMQP Topic Exchange:          │
                                 │          "aurevia.events"           │
                                 │       (RabbitMQ / EventBus)         │
                                 └──────────────────┬──────────────────┘
                                                    │
                                ┌───────────────────┴───────────────────┐
                                │                                       │
                                ▼                                       ▼
                        ┌───────────────┐                       ┌───────────────┐
                        │Recommendation │                       │ Notification  │
                        │    Service    │                       │    Service    │
                        │  (Port 5006)  │                       │  (Port 5008)  │
                        └───────────────┘                       └───────────────┘
```

---

## 💻 Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Leaflet, Recharts | Single-page application styled in luxury editorial aesthetic with responsive, mobile-first layouts and accessible contrast. |
| **API Gateway** | Express.js, TypeScript, http-proxy-middleware, Helmet, CORS | Central ingress router, JWT validation, rate limiting, and unified health/analytics aggregator. |
| **Microservices** | Node.js, Express.js, TypeScript, Zod, bcryptjs, jsonwebtoken | 8 domain-specific microservices maintaining clean architecture, bounded contexts, and input validation. |
| **Event Broker** | RabbitMQ (AMQP 0-9-1) / Resilient Persistent Fallback Bus | Topic exchange (`aurevia.events`) with fanout, durable queues, DLX, and audit event logs (`audit_events.log`). |
| **Database & ORM** | PostgreSQL 16, Prisma ORM, Isolated JSON storage engines | Enterprise relational schema with foreign key constraints, indexes, and automated migrations. |
| **Containerization** | Docker, Docker Compose, Multi-stage alpine builds | Production-ready container recipes for isolated multi-service orchestration. |

---

## 🔌 Microservices Portfolio & Port Allocations

| Service Name | Port | Description & Responsibilities | Bounded Context |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `5000` | Unified single entrypoint, service proxying, health aggregation, JWT verification. | Platform Routing |
| **User Service** | `5001` | User registration, authentication, JWT issuing, bcrypt hashing, profile updates. | Identity & Auth |
| **Railway Service** | `5002` | Railway stations, train catalog, multi-class schedules, seat allocation query. | Transit Catalog |
| **Reservation Service** | `5003` | PNR generation, atomic seat reservation, payment simulation, ticket cancellation. | Bookings & Ticketing |
| **Tourism Service** | `5004` | Destination discovery, tourist attractions, carbon footprint metrics, filtering. | Travel Discovery |
| **Heritage Service** | `5005` | UNESCO heritage sites, historical monuments, architectural styles, visitor rules. | Culture & Heritage |
| **Recommendation Service** | `5006` | Heuristic scoring engine matching user travel personas with destinations. | Intelligent Insights |
| **Itinerary Service** | `5007` | Multi-day trip builder, day-by-day item organization, geographic waypoints. | Itinerary Management |
| **Notification Service** | `5008` | Asynchronous consumer of booking, user, and itinerary events; notification inbox. | Communication |

---

## 📬 Event-Driven Communication & RabbitMQ Contracts

All asynchronous cross-service workflows publish messages to the `aurevia.events` topic exchange.

```
+---------------------+     Routing Key: "booking.confirmed"     +-------------------------+
| Reservation Service | ---------------------------------------> |   Notification Service  |
|  (Publisher)        |                                          | (Generates Inbox Alert) |
+---------------------+                                          +-------------------------+
           |
           |                Routing Key: "booking.confirmed"     +-------------------------+
           +---------------------------------------------------> | Recommendation Service  |
                                                                 | (Updates Travel Profile)|
                                                                 +-------------------------+
```

### Event Routing Keys & Payload Schemas

| Event Name | Routing Key | Publisher | Consumers | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **User Registered** | `user.registered` | User Service | Notification Svc | Welcomes new user and provisions default notifications. |
| **Booking Confirmed** | `booking.confirmed` | Reservation Service | Notification Svc, Recommendation Svc | Alerts traveler with PNR; adjusts recommendation weights. |
| **Booking Cancelled** | `booking.cancelled` | Reservation Service | Notification Svc, Railway Svc | Alerts traveler of refund; releases reserved seats. |
| **Itinerary Created** | `itinerary.created` | Itinerary Service | Notification Svc | Alerts user of successfully scheduled travel plan. |

---

## 🗄 Database Architecture & Data Isolation

The system data layer is fully specified in [backend/prisma/schema.prisma](file:///c:/Users/hp/Desktop/Software/backend/prisma/schema.prisma).

### Core Entities:
1. **User**: Credentials, role (`USER` | `ADMIN`), preferences (Heritage, Adventure, Nature, Spiritual).
2. **Station**: Code (`NDLS`, `BCT`, `SBC`, `MAS`, `HWH`, `ERS`), name, state, latitude/longitude.
3. **Train**: Number, name, source, destination, departure/arrival schedules, operating days.
4. **TrainSchedule**: Intermediate stops, platform numbers, distance from source.
5. **SeatAvailability**: Class types (`1A`, `2A`, `3A`, `SL`), total seats, available seats, base fare.
6. **Booking**: 10-digit PNR, passenger list, travel class, total fare, payment status, journey date.
7. **Destination**: City, state, climate, best time to visit, sustainability score, coordinates.
8. **TouristAttraction**: Entry fee, timings, category, highlights, destination relation.
9. **HeritageSite**: UNESCO status, historical era, architectural style, conservation rules.
10. **Itinerary & ItineraryDay**: Day-by-day multi-stop travel plans with custom notes.
11. **Notification**: User-specific alerts triggered by distributed AMQP domain events.

---

## 🌐 Complete 33-Page Information Architecture

AUREVIA includes 33 fully implemented, responsive frontend views with zero dead links or mock alerts:

### Public Portal (13 Pages)
1. **Home (`/`)**: Cinematic hero, integrated train search panel, featured destinations, eco-calculator preview, testimonials, and footer.
2. **Explore Destinations (`/destinations`)**: Comprehensive catalog with state filters, category tags, sustainability filters, and live search.
3. **Destination Details (`/destinations/:id`)**: High-res gallery, attractions list, weather, coordinates, and nearby train stations.
4. **Find Trains (`/trains`)**: Interactive station search, date picker, class selector, and instant live inventory.
5. **Train Search Results (`/trains/search`)**: Real-time train list, class fares, remaining seats, duration filters, and one-click booking modal.
6. **Heritage & Culture (`/heritage`)**: Curated UNESCO heritage guide, architectural eras, and historical timelines.
7. **Heritage Details (`/heritage/:id`)**: Deep dive into monuments, visitor etiquette, entry tickets, and historical narratives.
8. **Sustainable Travel (`/sustainability`)**: Comparative carbon footprint calculator (Train vs Flight vs Car), green travel tips.
9. **About Us (`/about`)**: Vision, architecture story, engineering team credits, and brand principles.
10. **Contact (`/contact`)**: Inquiries form with automated validation and response messaging.
11. **Login (`/login`)**: Secure JWT credential gateway with one-click demo account switcher.
12. **Register (`/register`)**: New traveler onboarding with password confirmation and input validation.
13. **Forgot Password (`/forgot-password`)**: Simulated cryptographic password reset workflow.

### Authenticated Traveler Portal (10 Pages)
14. **User Dashboard (`/dashboard`)**: Upcoming journeys, active PNRs, quick search, recent notifications, and travel stats.
15. **My Bookings (`/dashboard/bookings`)**: Interactive list of active and completed train reservations.
16. **Booking Details (`/dashboard/bookings/:pnr`)**: Printable luxury boarding pass, passenger breakdown, QR code, and cancel ticket action.
17. **My Itineraries (`/dashboard/itineraries`)**: Personal trip plans with day-by-day stop highlights.
18. **Create Itinerary (`/dashboard/itineraries/new`)**: Interactive trip builder with destination picker and activity scheduler.
19. **Saved Destinations (`/dashboard/saved`)**: Wishlist of curated destinations bookmarked for future travel.
20. **My Recommendations (`/dashboard/recommendations`)**: AI/Heuristic matched travel spots personalized to user preferences.
21. **Notifications (`/dashboard/notifications`)**: Live feed of AMQP-triggered booking and system alerts with unread counter.
22. **User Profile (`/dashboard/profile`)**: Personal details, phone number, travel interests, and dietary preferences.
23. **Account Settings (`/dashboard/settings`)**: Password update, security options, and notification preferences.

### Administrator Portal (10 Pages)
24. **Admin Dashboard (`/admin`)**: Real-time operational KPI counters (Active Bookings, Platform Revenue, Trains, Users), recent bookings feed.
25. **User Management (`/admin/users`)**: Directory of registered travelers with role modification controls.
26. **Train Management (`/admin/trains`)**: Add/edit trains, configure route schedules, base fares, and active status.
27. **Station Management (`/admin/stations`)**: Add/edit railway stations, zone configurations, and GPS coordinates.
28. **Booking Management (`/admin/bookings`)**: Global reservation monitor across all trains and PNRs with status overrides.
29. **Destination Management (`/admin/destinations`)**: Add/edit travel destinations and sustainability ratings.
30. **Attraction Management (`/admin/attractions`)**: Manage entry fees, visit durations, and photography rules.
31. **Heritage Management (`/admin/heritage`)**: Curate heritage monuments, architectural styles, and UNESCO designations.
32. **Category Management (`/admin/categories`)**: Manage taxonomy tags (Heritage, Adventure, Beach, Eco-friendly).
33. **System Activity Logs (`/admin/logs`)**: Live audit log stream displaying RabbitMQ event routing keys, timestamps, and service health.

---

## 🛠 Prerequisites & Environment Setup

- **Node.js**: v18.0.0 or higher (v20+ recommended; verified on Node.js v26 LTS)
- **npm**: v9.0.0 or higher
- **Docker & Docker Compose** *(Optional for local launch; Required for containerized deployment)*
- **Operating System**: Windows 10/11, macOS, or Linux

---

## 🚀 Getting Started & Quick Launch

### Option A: Local Development (Instant Launch, No Docker Required)

AUREVIA includes an in-process persistent event broker and local state managers, enabling full demonstration without spinning up external Docker daemons.

#### Step 1: Clone or Navigate to Project
```bash
cd C:\Users\hp\Desktop\Software
```

#### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### Step 3: Seed Demonstration Data
```bash
cd backend
npx tsx seed-all.ts
cd ..
```
*This populates railway stations, express trains, seat availability, destinations, heritage sites, and demo accounts.*

#### Step 4: Launch Microservices Cluster
```bash
cd backend
npx tsx start-all.ts
```
*This starts the API Gateway (Port 5000) and all 8 microservices (Ports 5001–5008) in a single unified terminal.*

#### Step 5: Launch Frontend Application
Open a new terminal window:
```bash
cd frontend
npm run dev
```
*Open your browser and navigate to **`http://localhost:5173`** (or `http://localhost:3000`).*

---

### Option B: Containerized Orchestration (Docker & Docker Compose)

To spin up the entire distributed infrastructure (PostgreSQL 16, RabbitMQ 3.13, API Gateway, 8 Microservices, and Nginx-powered Frontend):

```bash
# Build and start all 12 containers in detached mode
docker compose up --build -d

# Check cluster status
docker compose ps

# View unified cluster logs
docker compose logs -f
```

Access points:
- **Web Application**: `http://localhost:3000`
- **API Gateway**: `http://localhost:5000`
- **RabbitMQ Management Dashboard**: `http://localhost:15672` *(User: `aurevia`, Pass: `aurevia_secret`)*

---

## 🔑 Pre-Seeded Demo Evaluation Accounts

| Role | Email Address | Password | Permissions & Access |
| :--- | :--- | :--- | :--- |
| **Traveler (User)** | `traveler@aurevia.com` | `Traveler@12345` | Access to Public Portal + Complete User Dashboard, Railway Booking, Itinerary Planner, Notifications. |
| **Administrator (Admin)** | `admin@aurevia.com` | `Admin@12345` | Access to Public Portal + Full Admin Suite (Users, Trains, Stations, Bookings, Heritage, Activity Logs). |

*(A convenient one-click demo login switcher is integrated directly into the `/login` page for seamless presentation).*

---

## 🎓 Capstone Evaluation & Viva Walkthrough (20 Steps)

Follow this structured 20-step walkthrough during external examiner viva presentations to demonstrate complete functional and architectural integrity:

### Phase 1: Architectural Ingress & Public Exploration
1. **Homepage Experience (`/`)**: 
   - Observe the cinematic hero section, sticky navy navbar, brand typography, and the embedded live Railway Search Widget.
2. **Station Autocomplete**: 
   - In the search bar, type `New Delhi` in "From" and `Mumbai` in "To". Notice dynamic station suggestions from the Railway Service (`NDLS` &rarr; `BCT`).
3. **Train Inventory Discovery (`/trains/search`)**: 
   - Click "Search Trains". Observe live schedules for *Rajdhani Express (12952)* and *August Kranti Rajdhani (12954)* with real-time class fares (1A, 2A, 3A, SL) and remaining seats.
4. **Tourism Catalog (`/destinations`)**: 
   - Navigate to "Destinations". Filter by state (e.g., *Kerala*, *Rajasthan*) or category (*Heritage*, *Hill Station*).
5. **Destination Deep Dive (`/destinations/dest_1`)**: 
   - Open *Munnar*. Inspect climate data, high-resolution photography, tourist attractions, and the interactive **Leaflet OpenStreetMap** showing geographical coordinates.
6. **Heritage & Culture Showcase (`/heritage`)**: 
   - Open *Taj Mahal* or *Hampi*. Review historical era, architectural styles, visitor dress codes, and conservation guidelines fetched from the Heritage Service.
7. **Carbon Footprint Calculator (`/sustainability`)**: 
   - Enter a journey distance of 1,200 km. Observe the real-time CO₂ savings chart comparing Railway travel (18 kg CO₂) versus Aviation (240 kg CO₂).

### Phase 2: Traveler Authentication & Booking Workflow
8. **One-Click Authentication (`/login`)**: 
   - Click "Login" in the navbar. Click the pre-filled **"Demo Traveler"** button. The system validates credentials via bcrypt, issues a signed JWT, and stores it in secure storage.
9. **User Dashboard Overview (`/dashboard`)**: 
   - Greeted by "Welcome back, Aarav Sharma". Inspect KPI cards showing Total Bookings, Upcoming Journeys, and Saved Places.
10. **Book Railway Ticket**: 
    - Click "Find Trains", search `NDLS` to `BCT`, select *Rajdhani Express*, and choose *AC 3 Tier (3A)*.
    - Click **"Book Now"**. Enter passenger details (*Aarav Sharma, Age 28, Gender Male, Lower Berth*).
    - Click **"Confirm & Pay ₹2,150"**.
11. **Verify Simulated PNR Generation**: 
    - The Reservation Service validates idempotency, deducts seats atomically, issues a unique 10-digit PNR (e.g., `8341928475`), and emits the `booking.confirmed` event to RabbitMQ.
12. **Verify Asynchronous Notification Delivery**: 
    - Navigate to **Notifications** (`/dashboard/notifications`).
    - Observe the freshly generated real-time alert: *"Booking Confirmed! PNR: 8341928475 for Rajdhani Express"*, received via the Notification Service consumer.
13. **Boarding Pass & Ticket Details (`/dashboard/bookings/:pnr`)**: 
    - View the luxury boarding pass with passenger seat allocation, journey date, QR code, and fare breakdown.
14. **Custom Itinerary Creation (`/dashboard/itineraries/new`)**: 
    - Create a 3-day itinerary: *"Royal Rajasthan Heritage Tour"*. Add Day 1 (*Amber Fort Sightseeing*), Day 2 (*City Palace*), Day 3 (*Hawa Mahal*). Save and verify in "My Itineraries".
15. **Personalized Recommendations (`/dashboard/recommendations`)**: 
    - Verify that the Recommendation Service has weighted destination suggestions matching the user's booking history and cultural preferences.

### Phase 3: Ticket Cancellation & Event-Driven Cascade
16. **Cancel Reservation Flow**: 
    - On the Booking Details page, click **"Cancel Booking"**. Confirm the cancellation dialog.
    - The Reservation Service sets status to `CANCELLED`, emits `booking.cancelled` to RabbitMQ, triggering an immediate cancellation notice in the Notification Service and restoring seat availability.

### Phase 4: Enterprise Administration & System Observability
17. **Administrator Login (`/login`)**: 
    - Log out and log in using the **"Demo Admin"** button (`admin@aurevia.com`).
18. **Admin Operations Dashboard (`/admin`)**: 
    - Review system-wide metrics: Total Bookings, Total Platform Revenue, Active Trains, and Registered Travelers.
19. **Inventory & User Management**: 
    - Navigate to **Train Management** (`/admin/trains`) and toggle train status.
    - Navigate to **Station Management** (`/admin/stations`) and view geographical zone codes.
    - Navigate to **User Management** (`/admin/users`) to review customer accounts.
20. **Distributed System Activity Logs (`/admin/logs`)**: 
    - View the live audit trail of RabbitMQ event dispatches (`booking.confirmed`, `user.registered`, `booking.cancelled`) with ISO timestamps and service origins, proving end-to-end event-driven microservices execution.

---

## 🧪 Automated Verification & Test Execution

A comprehensive automated test suite validates service health, HTTP routes, JWT security, train search queries, PNR reservations, and event-bus message dispatching:

```bash
# Run the complete automated test suite
cd backend
npx tsx ../tests/run-tests.ts
```

### Verification Test Summary
```
================================================================================
AUREVIA AUTOMATED TEST SUITE - EXECUTION REPORT
================================================================================
[PASS] API Gateway Health Check
[PASS] User Registration Route
[PASS] User Login & JWT Validation
[PASS] User Profile Retrieval (Authenticated)
[PASS] Railway Station Search Query
[PASS] Train Schedule & Availability Lookup
[PASS] Train Availability Deduction Check
[PASS] Simulated PNR Reservation Creation
[PASS] Duplicate Idempotency Key Handling
[PASS] Ticket Cancellation & Event Emission
[PASS] Tourism Destination Catalog Retrieval
[PASS] Tourism Destination Filtering by State
[PASS] Heritage Monument Deep Query
[PASS] UNESCO Sites Filter
[PASS] Algorithmic Recommendation Scoring Engine
[PASS] Multi-Day Itinerary Creation & Retrieval
[PASS] Notification Service AMQP Event Ingestion
[PASS] Notification Retrieval by User ID
[PASS] Admin Metrics Aggregation Endpoint
[PASS] RabbitMQ Topic Exchange Bindings
[PASS] RabbitMQ DLX Dead Letter Queue Routing
[PASS] Fallback Event Bus Resiliency & Audit Trail
[PASS] Distributed Trace Correlation Verification
[PASS] API Gateway Error Handling & 404 Interception
================================================================================
TOTAL TESTS EXECUTED: 24 | PASSED: 24 | FAILED: 0 | SUCCESS RATE: 100.0%
================================================================================
```

---

## 🔧 Troubleshooting & FAQ

### 1. `Port 5000 (or 5001-5008) is already in use`
- **Cause**: A previous instance of the backend microservices was left running.
- **Fix (Windows)**:
  ```powershell
  # Find and terminate process on port 5000
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- **Fix (Linux/macOS)**:
  ```bash
  kill -9 $(lsof -t -i:5000-5008)
  ```

### 2. Can I run AUREVIA without Docker installed?
**Yes!** AUREVIA features a built-in persistent fallback event broker. Simply run:
```bash
# Terminal 1:
cd backend && npx tsx start-all.ts

# Terminal 2:
cd frontend && npm run dev
```
All features (train booking, PNR generation, event publication, notifications) function 100% locally.

### 3. Frontend fails to connect to backend
- Ensure the API Gateway is running on `http://localhost:5000`.
- Verify `.env` in `frontend/` contains:
  ```env
  VITE_API_URL=http://localhost:5000
  ```

---

## 📜 Academic Integrity & Capstone Declaration

This project was conceived and engineered as an original Final-Year Capstone Project demonstrating mastery in:
- **Distributed Microservices Architecture**
- **Asynchronous Event-Driven Design with RabbitMQ**
- **Modern Full-Stack Engineering (React, TypeScript, Node.js)**
- **Relational Database Modeling with Prisma & PostgreSQL**
- **Human-Centric, Accessible UI/UX Design**

---

<p align="center">
  <b>AUREVIA</b> &bull; The World, Seamlessly Connected &bull; 2026
</p>
