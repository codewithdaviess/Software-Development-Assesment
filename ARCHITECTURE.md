# Architecture Documentation

## System Overview

This document outlines the architectural decisions made for the Isimo Weather App and the rationale behind them.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application (Vite)                │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐    │   │
│  │  │   Pages     │  │Components│  │   Context   │    │   │
│  │  │  (Home,     │  │ (Navbar, │  │(Notifications    │   │
│  │  │ Tracked,    │  │  CityCard,  API/Services)   │   │
│  │  │Favorites)   │  │ Location |  │             │    │   │
│  │  │             │  │  List)   │  │             │    │   │
│  │  └─────────────┘  └──────────┘  └─────────────┘    │   │
│  │                                                       │   │
│  │              Services Layer (api.js)                 │   │
│  │              Axios HTTP Client                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js API Server                     │
│                    (Port 3000)                               │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Routes Layer                         │   │
│  │  • /api/locations (CRUD)                             │   │
│  │  • /api/weather (Current & Forecast)                 │   │
│  │  • /api/search (City Search)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controllers Layer                        │   │
│  │  • location.controller.js                            │   │
│  │  • weather.controller.js                             │   │
│  │                                                       │   │
│  │  Responsibilities:                                   │   │
│  │  - Parse requests                                    │   │
│  │  - Validate inputs                                   │   │
│  │  - Call appropriate services                         │   │
│  │  - Return formatted responses                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Services & Middleware                    │   │
│  │  • weather.service.js (API integration)              │   │
│  │  • errorHandler.js (Error handling)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Database Access (via pg library)                │   │
│  │  • Connection pooling (config/db.js)                 │   │
│  │  • Parameterized queries (SQL injection prevention)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐         ┌──────────┐        ┌─────────┐
   │PostgreSQL│        │OpenWeather    │     │Caching │
   │Database  │        │API (Free)     │     │Layer   │
   │(localhost)        │               │     │(Future)│
   └─────────┘         └──────────┘        └─────────┘
```

## Architectural Principles

### 1. Separation of Concerns (SoC)
- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Handle request/response, validation
- **Services**: Encapsulate business logic and API calls
- **Database**: Abstract database operations

**Benefit**: Changes to one layer don't require changes to others.

### 2. MVC-Like Pattern (adapted for REST API)
- **Models**: Database schema and data structures
- **Views**: JSON responses (no traditional view rendering)
- **Controllers**: Process requests and orchestrate responses

### 3. Error Handling Strategy

```
Frontend Error
       │
       ▼
Try-Catch Block
       │
       ├─ Network Error → Toast: "Connection failed"
       ├─ 404 Error → Toast: "City not found"
       ├─ 500 Error → Toast: "Server error"
       └─ Other → Toast: "Error performing action"

Backend Error
       │
       ▼
Controller/Service
       │
       ├─ Validation Error → next(error)
       ├─ DB Error → next(error)
       └─ API Error → next(error)
              │
              ▼
       Error Middleware
              │
              ├─ Log to console
              ├─ Set HTTP status
              └─ Send JSON response
```

### 4. Data Flow for Create Location

```
User Input (CityCard)
       │
       ▼
handleSaveLocation() [React]
       │
       ▼
createLocation(API request)
       │
       ▼
POST /api/locations [Express]
       │
       ▼
createLocation Controller
       │
       ├─ Validate input
       ├─ If lat/lon missing:
       │  ├─ Call OpenWeather Geo API
       │  ├─ Extract coordinates
       │  └─ Fill in country
       │
       ▼
INSERT INTO locations
       │
       ▼
Return created location
       │
       ▼
Frontend State Update
       │
       ▼
Show Notification "Added to tracking"
       │
       ▼
UI Re-renders with new location
```

## Technology Choices & Rationale

### Frontend: React + Vite

**Why React?**
- Component reusability (Navbar, CityCard, LocationList)
- Virtual DOM for efficient updates
- Large ecosystem and community support
- React Context API eliminates need for Redux on small projects

**Why Vite?**
- Fast development server with HMR
- Smaller bundle size than Create React App
- ES module based build system
- Better performance than Webpack for this project size

### Backend: Express.js

**Why Express?**
- Lightweight and flexible
- Minimal learning curve
- Large middleware ecosystem
- Perfect for REST APIs
- Fast routing
- Widely used in production

### Database: PostgreSQL

**Why PostgreSQL?**
- Robust relational database
- ACID compliance for data integrity
- JSON support for flexibility
- Excellent documentation
- Free and open source
- Better than SQLite for production

**Soft Deletes Implementation:**
```sql
-- Instead of DELETE, we UPDATE deleted_at:
UPDATE locations SET deleted_at = NOW() WHERE id = 123;

-- Query only active records:
SELECT * FROM locations WHERE deleted_at IS NULL;

-- Allows recovery of accidentally deleted data
```

### Frontend State Management: React Context

**Why Context API over Redux?**
- No additional dependencies
- Sufficient for application size
- Simpler mental model
- Better for notifications use case
- Can upgrade to Redux if needed later

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first approach
- Smaller CSS bundles
- Responsive design built-in (sm:, md:, lg:)
- Consistent design system
- Less time writing custom CSS

## Key Architectural Decisions

### 1. Route Ordering Matters

**Problem**: Before `/search` route, requests to `/cities/search` matched `/:id` route first.

**Solution**: Order routes by specificity:
```javascript
// ✓ Correct order
router.get('/search', searchCity);        // Specific
router.get('/:id', getLocationById);      // Generic
```

### 2. API Response Transformation

**Problem**: OpenWeatherMap returns verbose nested JSON, frontend expects simpler format.

**Solution**: Transform in controller, not frontend:
```javascript
// Backend transforms
const transformed = {
  main: { temp: data.main.temp },
  description: data.weather[0].description,
  weatherType: data.weather[0].main
};

// Frontend receives clean data
const temp = weather.main.temp;
```

**Benefit**: Single source of truth for API format.

### 3. Connection Pooling

```javascript
// config/db.js
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,  // Maximum connections
  min: 2,   // Minimum connections
});

// Reuses connections instead of creating new ones
export default pool;
```

**Benefit**: Better performance under load.

### 4. ID Compaction After Soft Delete

**Problem**: Deleting records leaves ID gaps:
```
IDs: 1, 2, 3, 4, 5
Delete #3:
IDs: 1, 2, __, 4, 5
```

**Solution**: Reset sequence after deletion:
```sql
SELECT SETVAL('locations_id_seq', 
  (SELECT MAX(id) FROM locations WHERE deleted_at IS NULL) + 1
);
```

**Benefit**: Clean ID sequence, better UX for users.

### 5. Notifications as Global Context

**Why Global State?**
- Notifications triggered from multiple components
- Prop drilling would require passing callbacks through 5+ levels
- Context API is perfect for this cross-cutting concern

**Implementation**:
```jsx
// NotificationContext provides:
- addNotification(message, type, duration)
- removeNotification(id)
- All components can use: useNotification()
```

### 6. Component Composition Strategy

```
App
├── Navbar (global, fixed)
├── Routes
│   ├── Home
│   │   ├── Hero (search section)
│   │   └── LocationList
│   │       └── CityCard (reusable)
│   ├── TrackedCities
│   │   ├── Search (same as Hero)
│   │   └── LocationList
│   │       └── CityCard
│   └── Favorites
│       └── LocationList
│           └── CityCard
└── NotificationContainer (global)
```

**Benefit**: CityCard is reused 3+ places, reducing code duplication.

## Data Persistence Strategy

### 1. Local Database (PostgreSQL)

Stores:
- Locations (name, coordinates, favorites)
- Weather snapshots (historical data for analysis)
- User preferences (units, refresh intervals)

### 2. HTTP Caching

Weather data cached in memory until manual refresh.
Could be enhanced with Redis for multi-instance deployment.

### 3. Browser Session Storage

Theoretically could store selected location in browser, but currently not used.

## Scalability Considerations

### Current State (Suitable for)
- Single user or small teams
- < 1000 tracked locations
- < 100 requests/minute to API

### If Scaling to Production

1. **Caching Layer**: Add Redis for distributed caching
2. **Background Jobs**: Add Bull queue for automatic syncs
3. **API Gateway**: Use Kong or AWS API Gateway
4. **Database Replication**: Master-slave PostgreSQL setup
5. **Load Balancing**: Nginx/HAProxy in front of Express
6. **Authentication**: Add JWT or OAuth2
7. **Rate Limiting**: Implement token bucket algorithm
8. **Monitoring**: Add DataDog, New Relic, or ELK stack
9. **Containerization**: Docker + Kubernetes

## Security Considerations

### Input Validation
```javascript
// Validate city name before API call
if (!name || name.length > 100) {
  return res.status(400).json({ error: "Invalid input" });
}
```

### SQL Injection Prevention
```javascript
// Parameterized query prevents SQL injection
pool.query("SELECT * FROM locations WHERE id = $1", [id]);
// NOT: `SELECT * FROM locations WHERE id = ${id}` ❌
```

### Environment Variables
```bash
# Never commit .env file
# Use .env.example for reference
# Store API keys safely
```

### CORS (if needed)
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Monitoring & Debugging

### Frontend
- React DevTools browser extension
- Console error logging
- Performance tab in Chrome DevTools
- Network tab to inspect API calls

### Backend
- Console.log (enhanced with timestamp)
- Morgan middleware for HTTP logging
- Error middleware catches all exceptions
- Database query logging with pg library

## Testing Strategy

### Unit Tests (Current)
- Location CRUD operations
- Weather endpoint responses
- Favorite toggling

### Integration Tests (Could Add)
- Full request/response flow
- Database transactions
- Error scenarios

### E2E Tests (Could Add)
- User workflows (Cypress/Playwright)
- Multi-page interactions
- Responsive design verification

## Future Enhancements

### Phase 2 (Recommended)
1. Add automatic background sync (Bull queue)
2. User authentication (PostgreSQL users table)
3. Weather alerts (temperature thresholds)
4. Historical data analytics (charts)

### Phase 3 (Nice to Have)
1. Mobile app (React Native)
2. Advanced caching (Redis)
3. Real-time updates (WebSockets)
4. Weather comparisons (multiple cities)
5. Social sharing (favorite locations)

## Deployment Architecture

### Current (Development)
```
Laptop
├── Frontend (npm run dev)
├── Backend (npm start)
└── PostgreSQL (local)
```

### Recommended (Production)
```
Cloud Provider (AWS/GCP/Azure)
├── Frontend (CDN + S3)
├── Backend (ECS/Heroku/Render)
├── Database (RDS PostgreSQL)
└── Redis Cache (ElastiCache)
```

---

**Document Version**: 1.0  
**Last Updated**: February 13, 2026  
**Maintainer**: Development Team
