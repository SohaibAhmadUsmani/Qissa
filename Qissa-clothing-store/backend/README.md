# Qissa Wear Backend

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Fill values in `.env`, especially `MONGO_URI` and `JWT_SECRET`.

4. Run in development:

```bash
npm run dev
```

## Current Endpoints

- `GET /api/health`
- `POST /api/v1/auth/signup` (placeholder)
- `POST /api/v1/auth/login` (placeholder)

## Architecture Notes

- `src/config`: environment and database setup
- `src/routes`: API route modules
- `src/middlewares`: shared middleware (error handling)

The auth logic, models, and controllers will be added in Phase 1 next step.
