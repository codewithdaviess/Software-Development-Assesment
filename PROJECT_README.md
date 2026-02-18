# Isimo Weather App - Software Development Assessment

A full-stack weather tracking application that integrates with the OpenWeatherMap API, stores weather data locally in PostgreSQL, and provides an intuitive web interface for users to manage and monitor weather for their favorite locations.

## 📋 Project Overview

This application demonstrates:
- **API Integration**: Real-time weather data from OpenWeatherMap API
- **Database Design**: PostgreSQL with proper schema for locations, weather snapshots, and user preferences
- **Full CRUD Operations**: Complete location management with soft deletes
- **Modern Frontend**: React with Vite for fast development and production builds
- **Node.js Backend**: Express.js with proper error handling and middleware
- **Data Synchronization**: On-demand and scheduled weather data refresh
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## ✨ Features Implemented

### Core Features
✅ **Add/Remove Cities**: Manage tracked weather locations  
✅ **Current Weather**: View real-time weather for all tracked cities  
✅ **5-Day Forecast**: Detailed forecast with day-by-day breakdown  
✅ **Favorites**: Mark important locations as favorites  
✅ **City Search**: Search for cities with auto-suggestions  
✅ **Last Sync Tracking**: Timestamps showing when weather data was last updated  
✅ **Manual Refresh**: On-demand data synchronization  
✅ **Soft Deletes**: Safe data removal with recovery capability  

### Bonus Features Implemented
✅ **Responsive Design**: Mobile, tablet, and desktop layouts  
✅ **Toast Notifications**: User-friendly action feedback  
✅ **Full-Width Headers**: Modern page layouts  
✅ **Global Navbar**: Navigation accessible from all pages  
✅ **Unified Color Scheme**: Consistent branding (#5896FD primary color)  
✅ **Smooth Animations**: Slide-in notifications and transitions  

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 12+
- **HTTP Client**: Axios
- **API**: OpenWeatherMap API (Free Tier)
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Router**: React Router v6

### Testing
- **Backend Tests**: Jest (weather.test.js, location.test.js)

## 📁 Project Structure

```
software-development-assessment/
├── README.md                          # This file
├── isimo-weather-app/
│   ├── isimo-backend/
│   │   ├── app.js                    # Express app setup
│   │   ├── server.js                 # Server entry point
│   │   ├── package.json
│   │   ├── .env.example              # Environment template
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── weather.controller.js # Weather endpoints
│   │   │   └── location.controller.js # Location CRUD endpoints
│   │   ├── routes/
│   │   │   ├── weather.routes.js
│   │   │   ├── location.routes.js
│   │   │   └── dbtest.routes.js      # Database connectivity test
│   │   ├── services/
│   │   │   └── weather.service.js    # Weather API logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Error handling middleware
│   │   ├── database/
│   │   │   └── schema.sql            # PostgreSQL schema
│   │   ├── docs/
│   │   │   └── swagger.js            # API documentation
│   │   └── tests/
│   │       ├── location.test.js      # Location CRUD tests
│   │       └── weather.test.js       # Weather endpoint tests
│   │
│   └── isimo-frontend/
│       ├── package.json
│       ├── vite.config.js
│       ├── eslint.config.js
│       ├── index.html
│       ├── src/
│       │   ├── main.jsx
│       │   ├── App.jsx               # Main app component
│       │   ├── App.css
│       │   ├── index.css
│       │   ├── context/
│       │   │   └── NotificationContext.jsx # Global notifications
│       │   ├── components/
│       │   │   ├── Navbar.jsx        # Navigation with menu
│       │   │   ├── Hero.jsx          # Home page hero + search
│       │   │   ├── CityCard.jsx      # Weather card component
│       │   │   ├── LocationList.jsx  # Grid of locations
│       │   │   ├── NotificationContainer.jsx # Toast display
│       │   ├── pages/
│       │   │   ├── Home.jsx          # Home page layout
│       │   │   ├── TrackedCities.jsx # Add & manage cities
│       │   │   └── Favorites.jsx     # Favorite cities page
│       │   ├── services/
│       │   │   └── api.js            # Axios API client
│       │   └── assets/
│       └── public/
```

## 🚀 Setup Instructions

### Option A (Recommended for Assessment): Docker Compose

```bash
cd isimo-weather-app
cp .env.example .env
# add OPENWEATHER_API_KEY to .env
docker compose up --build
```

Docker endpoints:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`
- PostgreSQL: `localhost:5432`

Detailed Docker guide: `isimo-weather-app/README.Docker.md`

### Option B: Local Development (Yarn)

#### Prerequisites
- Node.js 20+ and Yarn 4 (via Corepack)
- PostgreSQL 12+
- OpenWeatherMap API Key (free at https://openweathermap.org/api)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd software-development-assessment
cd isimo-weather-app
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd isimo-backend
yarn install
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb isimo_weather

# Load schema
psql -U postgres -d isimo_weather -f database/schema.sql
```

Or connect via GUI client (pgAdmin) and run the SQL script.

#### Environment Configuration
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
```

**.env** template:
```
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/isimo_weather
OPENWEATHER_API_KEY=your_api_key_here
NODE_ENV=development
```

Get your API key:
1. Visit https://openweathermap.org/api
2. Sign up for free
3. Go to "API keys" tab
4. Copy your default key

#### Start Backend Server
```bash
yarn start
# Server runs on http://localhost:3000
```

Backend API endpoints available at:
- `GET /api/locations` - Get all tracked cities
- `POST /api/locations` - Add new city
- `PATCH /api/locations/:id` - Update city
- `DELETE /api/locations/:id` - Remove city
- `GET /api/weather/:city` - Get current weather
- `GET /api/weather/forecast/:city` - Get 5-day forecast
- `GET /api/locations/favorites` - Get favorite cities
- `GET /api/locations/search/:query` - Search for cities

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../isimo-frontend
yarn install
```

#### Start Development Server
```bash
yarn dev
# Frontend runs on http://localhost:5173
```

#### Build for Production
```bash
yarn build
# Creates optimized build in dist/
```

## 📊 Database Schema

### Locations Table
Stores cities the user wants to track.

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto-incremented, with ID compaction after deletion |
| name | VARCHAR(100) | City name (editable) |
| country | VARCHAR(100) | Country name |
| latitude | DECIMAL(10,6) | Geographic coordinate |
| longitude | DECIMAL(10,6) | Geographic coordinate |
| is_favorite | BOOLEAN | User favorite flag |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last modification time |
| deleted_at | TIMESTAMP | Soft delete flag (NULL = active) |

### Weather Snapshots Table
Stores historical weather data for analysis and tracking changes.

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto-incremented |
| location_id | INT FK | References locations table |
| temperature | DECIMAL(5,2) | Temperature in metric units |
| humidity | INT | Humidity percentage |
| wind_speed | DECIMAL(5,2) | Wind speed in m/s |
| description | VARCHAR(255) | Weather description |
| snapshot_time | TIMESTAMP | When data was captured |

### User Preferences Table
Stores application settings per user session.

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto-incremented |
| unit | VARCHAR(10) | Temperature units (metric/imperial) |
| refresh_interval | INT | Auto-refresh interval in seconds |
| created_at | TIMESTAMP | When preferences were set |

## 🔄 API Response Examples

### Get Weather
```bash
curl http://localhost:3000/api/weather/London
```

Response:
```json
{
  "success": true,
  "data": {
    "main": {
      "temp": 15.5,
      "temp_min": 13.2,
      "temp_max": 17.8
    },
    "description": "partly cloudy",
    "weatherType": "Clouds"
  }
}
```

### Get 5-Day Forecast
```bash
curl http://localhost:3000/api/weather/forecast/London
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "day": "Thu",
      "temp": 15.5,
      "type": "Clouds",
      "description": "partly cloudy"
    },
    {
      "day": "Fri",
      "temp": 16.2,
      "type": "Rain",
      "description": "light rain"
    }
  ]
}
```

### Create Location
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "London",
    "country": "UK",
    "latitude": 51.5074,
    "longitude": -0.1278
  }'
```

Response:
```json
{
  "id": 1,
  "name": "London",
  "country": "UK",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "is_favorite": false,
  "created_at": "2025-02-13T10:00:00.000Z",
  "updated_at": "2025-02-13T10:00:00.000Z",
  "deleted_at": null
}
```

## 🧪 Testing

### Run Backend Tests
```bash
cd isimo-backend
yarn test
```

Tests cover:
- Location CRUD operations (create, read, update, delete)
- Weather API integration (valid/invalid cities, error handling)
- Favorite location toggling
- Soft delete functionality

### Run Frontend Tests
Frontend currently uses manual testing via UI. To add automated tests:
```bash
cd isimo-frontend
yarn dev
```

## 🏛️ Architectural Decisions

### Backend Architecture
- **Separation of Concerns**: Controllers, services, and routes are separate
- **Error Handling**: Centralized error middleware catches all exceptions
- **Database Pool**: Connection pooling for efficient resource utilization
- **Route Ordering**: Routes matched by specificity (/search before /:id)
- **Soft Deletes**: Users can recover accidentally deleted data
- **API Response Transform**: Raw API responses transformed to consistent format

### Frontend Architecture
- **Component-Based**: Reusable components (CityCard, Navbar, etc.)
- **Global State**: React Context API for notifications vs. prop drilling
- **Responsive Design**: Mobile-first Tailwind classes with breakpoints
- **Feature Pages**: Separate pages for Home, Tracked Cities, Favorites
- **API Client**: Centralized axios instance in services/api.js
- **No Third-Party State Management**: Lightweight alternative to Redux

### Data Flow
```
User Input → React Component → API Service → Express Route 
→ Controller → Database/External API → Response → State Update → UI Render
```

### Error Handling Strategy
1. **Frontend**: Try-catch blocks, user-friendly toast notifications
2. **Backend**: Error middleware catches exceptions, returns 400-500 status codes
3. **API Failures**: Graceful degradation, error messages shown to user
4. **Validation**: Check for missing/invalid data before database operations

### Performance Optimizations
1. **Connection Pooling**: Reuse database connections
2. **Response Caching**: Weather data cached until manual refresh
3. **Lazy Loading**: Components load data on demand
4. **Tailwind CSS**: Minimal CSS per component via utility classes
5. **Vite**: Fast build and HMR for development

## 🔐 Security Considerations

- API keys stored in `.env` file (not in code)
- Soft deletes prevent accidental data loss
- Input validation on all endpoints
- CORS headers configured (if needed)
- SQL injection prevented via parameterized queries

## 🐛 Error Handling

### Frontend
- Invalid city search → "City not found" message
- Network errors → "Error" toast notification
- API failures → Graceful fallback to last cached data

### Backend
- Invalid city → `400 Bad Request`
- Duplicate location → `409 Conflict` (or `200 Success` if already exists)
- Database error → `500 Internal Server Error`
- Rate limited → `429 Too Many Requests`

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** (< 640px): Single column, touch-friendly buttons
- **Tablet** (640px - 1024px): Two-column layout
- **Desktop** (> 1024px): Three-column grid, full-width headers

## 🎨 UI/UX Features

- **Toast Notifications**: Action feedback (added, removed, renamed)
- **Smooth Animations**: Slide-in effects for notifications
- **Gradient Headers**: Full-width colored sections per page
- **Card Interactions**: Expandable cards showing forecast
- **Edit Mode**: Inline editing for location names
- **Favorites System**: Visual feedback with heart icons
- **Loading States**: Refresh button disabled during sync

## 📝 Assumptions Made

1. **Single User**: Application assumes one user per browser session
2. **Metric Units**: Weather data displayed in Celsius (metric system)
3. **Free API Tier**: Uses free OpenWeatherMap endpoints (60 calls/min limit)
4. **Local Storage**: No authentication; relies on browser/session storage
5. **Synchronous Operations**: Weather data fetched on-demand (not background jobs)
6. **No Data Backup**: User assumes responsible for data management
7. **No Offline Mode**: Requires internet connection for API calls

## 🔗 API Documentation

Full API documentation available in docs/swagger.js (can be extended for Swagger UI integration)

## 📚 Additional Resources

- OpenWeatherMap API: https://openweathermap.org/api
- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- Tailwind CSS: https://tailwindcss.com
- PostgreSQL Docs: https://www.postgresql.org/docs/

## 🤝 Contributing

To extend this project:
1. Fork the repository
2. Create a feature branch
3. Make meaningful commits
4. Include tests for new functionality
5. Update documentation
6. Submit pull request

## 📄 License

This project is part of a software development assessment.

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review error messages in console/logs
3. Verify environment variables are set correctly
4. Ensure database connection is active

---

**Version**: 1.0.0  
**Last Updated**: February 13, 2026  
**Status**: ✅ All Core Requirements Met
