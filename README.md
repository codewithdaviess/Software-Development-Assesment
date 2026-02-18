# Software Development Assessment - Isimo Weather App

A full-stack weather tracking application integrating OpenWeatherMap API with React, Node.js, and PostgreSQL.

## 🎯 Quick Start

### Recommended for Assessors: Docker (2 minutes)

```bash
cd isimo-weather-app
cp .env.example .env
# add your OPENWEATHER_API_KEY in .env
docker compose up --build
```

App endpoints (Docker):
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api
- Database: localhost:5432

Full Docker instructions: **[isimo-weather-app/README.Docker.md](isimo-weather-app/README.Docker.md)**

### Local Development Setup (5 minutes)

**Backend:**
```bash
cd isimo-weather-app/isimo-backend
yarn install
# Create .env file with OPENWEATHER_API_KEY and DATABASE_URL
yarn start  # Runs on http://localhost:3000
```

**Database:**
```bash
createdb isimo_weather
psql -U postgres -d isimo_weather -f database/schema.sql
```

**Frontend:**
```bash
cd isimo-weather-app/isimo-frontend
yarn install
yarn dev  # Runs on http://localhost:5173
```

## 📋 Requirements Checklist

✅ **API Integration** - OpenWeatherMap API with current weather & 5-day forecast  
✅ **Database** - PostgreSQL with locations, weather snapshots, user preferences  
✅ **CRUD Operations** - Full Create, Read, Update, Delete with soft deletes  
✅ **User Interface** - React with responsive design (mobile/tablet/desktop)  
✅ **Data Synchronization** - Manual refresh with last-sync tracking  
✅ **Error Handling** - API errors, invalid cities, network failures  
✅ **Code Quality** - Clean structure, meaningful naming, error handling  
✅ **Testing** - Unit tests for location and weather endpoints  
✅ **Documentation** - Complete setup guide and architectural decisions  

## 🎁 Bonus Features Implemented

✅ **Responsive Design** - Mobile-friendly with Tailwind CSS  
✅ **Toast Notifications** - User feedback for all actions  
✅ **Global Navigation** - Navbar on all pages  
✅ **Rich UI** - Expandable cards, inline editing, smooth animations  
✅ **Architecture Documentation** - Decision rationale explained  

## 📖 Full Documentation

**[→ Read the complete PROJECT_README.md](PROJECT_README.md)**

It contains:
- Project overview and features
- Technology stack details
- Setup instructions for Docker and local development
- Database schema with tables & columns
- API response examples
- Testing procedures
- Architectural decisions & rationale
- Security considerations
- Error handling strategy
- Responsive design approach
- Assumptions made

## 🚀 Runtime Endpoints

Docker (recommended for assessment):
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000/api
- **Database**: PostgreSQL (localhost:5432)

Local development:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📁 Project Structure

```
isimo-weather-app/
├── isimo-backend/          # Node.js/Express API server
│   ├── database/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   └── server.js
├── isimo-frontend/         # React/Vite frontend application
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── PROJECT_README.md       # Full documentation (START HERE)
```

## ✨ Key Features

- 🔍 **Search Cities** - Find weather for any city worldwide
- 📍 **Track Locations** - Add/remove cities from watchlist
- ⭐ **Favorites** - Mark important locations
- 🌡️ **Weather Data** - Current conditions and 5-day forecast
- 🔄 **Sync Control** - Manual refresh with timestamp tracking
- 📱 **Responsive** - Works on mobile, tablet, desktop
- 🎨 **Modern UI** - Tailwind CSS with smooth animations

---

**For complete documentation, see [PROJECT_README.md](PROJECT_README.md)**
