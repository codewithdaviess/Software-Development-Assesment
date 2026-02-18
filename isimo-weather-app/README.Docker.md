# Docker Setup (Yarn + Compose)

This project uses Docker Compose to run:
- `db` (PostgreSQL 16)
- `backend` (Node/Express, Yarn)
- `frontend` (Vite build served by Nginx, Yarn)

## Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- OpenWeatherMap API key

## 1. Configure Environment

From `isimo-weather-app`:

```bash
cp .env.example .env
```

Set your API key in `.env`:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## 2. Build and Start

```bash
docker compose up --build
```

## 3. Service Endpoints

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`
- PostgreSQL: `localhost:5432`

## Compose Configuration Notes

- `db` initializes schema/data from:
  - `./isimo-backend/database/init.sql`
- `backend` environment values are defined in `compose.yaml`:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `DATABASE_URL=postgresql://postgres:password@db:5432/isimo_weather`
  - `OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}` (from `.env`)
- `frontend` build argument in `compose.yaml`:
  - `VITE_API_BASE_URL=http://localhost:5000/api`

## Yarn Configuration in Containers

Both backend and frontend Dockerfiles use Yarn 4 with Corepack:

- `corepack enable && corepack prepare yarn@4.11.0 --activate`
- `yarn install --immutable`

## Stop and Clean Up

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```
