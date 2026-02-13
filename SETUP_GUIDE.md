# Quick Setup Guide

Complete step-by-step setup for the Isimo Weather App.

## Prerequisites Check

```bash
# Verify Node.js version (need 16+)
node --version

# Verify npm version (need 8+)
npm --version

# Verify PostgreSQL is installed and running
psql --version
```

If any are missing, install from:
- Node.js: https://nodejs.org
- PostgreSQL: https://www.postgresql.org/download/

## Step 1: Get OpenWeatherMap API Key

1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Go to "API keys" section
4. Copy your default API key
5. Save it somewhere safe (you'll need it in 5 minutes)

## Step 2: Clone and Navigate

```bash
# Clone repository
git clone <repository-url>
cd software-development-assessment
cd isimo-weather-app
```

## Step 3: Setup PostgreSQL Database

### Option A: Command Line (Linux/Mac)

```bash
# Create database
createdb isimo_weather

# Load schema
psql -U postgres -d isimo_weather -f isimo-backend/database/schema.sql

# Verify tables were created
psql -U postgres -d isimo_weather -c "\dt"
```

### Option B: PgAdmin GUI (Windows/Mac/Linux)

1. Open PgAdmin (should be installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `isimo_db`
4. Click Create
5. Open SQL editor (Tools → Query Tool)
6. Copy-paste contents of `isimo-backend/database/schema.sql`
7. Execute (F5 or Execute button)

### Option C: Connection String Only

If database already exists:
```sql
-- Run this SQL directly
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weather_snapshots (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    humidity INT,
    wind_speed DECIMAL(5,2),
    description VARCHAR(255),
    snapshot_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(10) DEFAULT 'metric',
    refresh_interval INT DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 4: Setup Backend

```bash
# Navigate to backend
cd isimo-backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your settings
```

**Edit `.isimo-backend/.env`:**
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/isimo_weather
OPENWEATHER_API_KEY=your_api_key_from_step_1
```

**Customize:**
- Change `password` if your PostgreSQL password is different
- Paste your API key from Step 1
- Leave PORT as 3000

## Step 5: Start Backend

```bash
# From isimo-backend directory
npm start

# Should output:
# ✓ Server running on port 3000
# ✓ Database connected
```

**Test Backend:**
```bash
# In another terminal, test the API
curl http://localhost:3000/api/locations
# Should return: {"success":true,"data":[]}
```

## Step 6: Setup Frontend

```bash
# Navigate to frontend (from isimo-weather-app)
cd ../isimo-frontend

# Install dependencies
npm install
```

No environment configuration needed for frontend.

## Step 7: Start Frontend

```bash
# From isimo-frontend directory
npm run dev

# Should output:
# ✓ Vite ready in 1000ms
# ✓ Local: http://localhost:5173
```

## Step 8: Access Application

1. Open browser to http://localhost:5173
2. Search for a city (e.g., "London")
3. Click Search
4. Click the city card to expand
5. Click "Save" to add to tracking

**That's it!** 🎉

## Troubleshooting

### Backend won't start

```bash
# Check if port 3000 is in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process using port 3000
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Try starting again
npm start
```

### Database connection failed

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running:
# Mac: brew services start postgresql
# Windows: Services → PostgreSQL → Start
# Linux: sudo systemctl start postgresql
```

### API key error

```bash
# Verify API key is valid at:
https://openweathermap.org/api/weather-data-3h

# Check .env file has correct key
cat .env | grep OPENWEATHER_API_KEY
```

### Cannot find module error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Change .env PORT to different number (e.g., 3001)
# Or kill process on that port
```

## Next Steps

1. **Add a City**: Search for any city worldwide
2. **Favorites**: Click heart icon to mark as favorite
3. **Edit**: Click edit button to rename location
4. **Delete**: Click trash to remove from tracking
5. **Refresh**: Use refresh button to sync latest weather

## Running Tests

```bash
# Backend tests
cd isimo-backend
npm test

# Frontend tests (manual UI testing currently)
cd ../isimo-frontend
npm run dev  # Use browser dev tools
```

## Common Tasks

### Search for a city
1. Type city name in search box
2. Click Search
3. Click card to expand
4. Click Save Location

### View 5-day forecast
1. Click on a tracked city card
2. Click different day pills to see forecast
3. Temperature and conditions update

### Toggle favorite
1. Click city card to expand
2. Click heart icon
3. Card highlights as favorite

### Edit location name
1. Click city card to expand
2. Click "Edit" button
3. Type new name
4. Click "Save"

### Delete location
1. Click city card to expand
2. Click trash icon
3. Location removed from tracking

## Performance Tips

- **Faster Searches**: Recently searched cities are cached
- **Lower API Usage**: Manual refresh only (no auto-sync)
- **Mobile Friendly**: Responsive design adapts to screen size

## Getting Help

**Check Documentation**:
- Main docs: [PROJECT_README.md](../PROJECT_README.md)
- Architecture: [ARCHITECTURE.md](../ARCHITECTURE.md)
- API: Check backend swagger.js

**Check Logs**:
- Backend console: Shows errors and requests
- Browser console (F12): Shows frontend errors
- Browser Network tab: Shows API requests/responses

**Common Issues**:
- Port in use? Kill existing process
- Database error? Verify PostgreSQL running
- API error? Check OPENWEATHER_API_KEY in .env

## Deployment

To deploy to production, see [PROJECT_README.md](../PROJECT_README.md#deployment) for recommendations.

---

**Version**: 1.0 | **Updated**: February 13, 2026
