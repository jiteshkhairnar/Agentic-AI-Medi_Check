# Medi_Check Healthcare SaaS

This project is a multi-tenant healthcare SaaS and consumer platform designed for medicine comparison, generic drug discovery, and compliance traceability.

## Monorepo Structure

This repository is split into two independent subfolders:

- `frontend/`: React + Vite application
- `backend/`: Node.js + Express API server
- `shared/`: Shared TypeScript types and mock data used by both

## Installation

You can install all dependencies from the root directory, which will automatically install dependencies for both the frontend and backend:

```bash
npm run install:all
```

Alternatively, you can install them independently:

**Installing Frontend Dependencies:**
```bash
cd frontend
npm install
```

**Installing Backend Dependencies:**
```bash
cd backend
npm install
```

## Running the Application

**Starting Both (Recommended):**
From the root directory, you can start both the frontend and backend concurrently:
```bash
npm run dev:all
```

**Starting the Backend Independently:**
```bash
npm run dev:backend
# Or from inside the backend directory:
# npm run dev
```
The backend will run on `http://localhost:4000`.

**Starting the Frontend Independently:**
```bash
npm run dev:frontend
# Or from inside the frontend directory:
# npm run dev
```
The frontend will run on `http://localhost:3000`.

## Environment Variables
- `frontend/.env`: Configure `VITE_API_URL`
- `backend/.env`: Configure `PORT`, `JWT_SECRET`, and `JWT_EXPIRES_IN`
