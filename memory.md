# Project Memory

This document serves as the long-term memory for the project, tracking its state, architecture, and roadmap.

## Project Overview
**Medi_Check** is a multi-tenant healthcare SaaS and consumer platform designed for:
- Active ingredient medicine comparison.
- Jan Aushadhi generic drug discovery.
- NPPA DPCO price ceiling enforcement.
- CDSCO compliance traceability.

## Tech Stack
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express, Zod (Validation), InMemory Store
- **Security**: Helmet, CORS, Express-Rate-Limit, JWT, Custom RBAC

## Project Status: Complete
The monolithic MVP application is now **Complete**. All six phases outlined in `phase.md` have been executed successfully.

### Architectural Landscape (Final State)
1. **Frontend (React/Vite)**
   - Beautiful, responsive UI built with TailwindCSS and Lucide-React.
   - Core Views: `ConsumerCompareView`, `PharmacistPortalView`, `AdminPortalView`.
   - Wired up to the live backend using `src/api/client.ts`.

2. **Backend (Node.js/Express)**
   - **Data Layer**: An `inMemoryStore` containing `Map` collections seeded with mock payload data.
   - **Repositories**: Standardized DAO classes (`MedicineRepository`, `InventoryRepository`, etc.).
   - **Business Logic (Services)**: Handles DPCO ceiling logic, Jan Aushadhi substitute filtering, discrepancy triage, and simulated SHA-256 auditing.
   - **Validation**: Payload schemas built with `zod`.
   - **API Layer**: Organized into distinct Express routers (`medicine`, `pharmacist`, `admin`).
   - **Security**: Features JWT authentication, RBAC middleware, `helmet` header hardening, `cors`, and `express-rate-limit`.

## Current Focus
The MVP build phase has concluded. Future steps could involve replacing the `inMemoryStore` with a real PostgreSQL database, setting up CI/CD pipelines, or implementing the integration tests outlined in `backend/tests/integration.outline.md`.
