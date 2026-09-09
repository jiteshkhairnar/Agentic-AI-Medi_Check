# CONTEXT.md — medicine_check

## Project Name
`medicine_check`

## Project Purpose
India's independent medicine price-transparency and comparison platform. Empowers citizens to find bioequivalent Jan Aushadhi / generic alternatives, enforces NPPA DPCO 2013 price ceilings, and provides CDSCO compliance traceability.

## Target Users
| User | Role |
|---|---|
| Citizens | Compare branded medicines to generics, find Jan Aushadhi stores |
| Medical Store / Pharmacist | Manage inventory, dispense prescriptions, trigger price-compliance alerts |
| Platform Admin | Review discrepancy queue, govern drug catalog, manage tenants/users |
| Super Admin (CDSCO/NPPA) | Platform-wide oversight, audit ledger, compliance certificates |

## Core Modules
1. **Consumer Compare** — Medicine comparison matrix + Jan Aushadhi substitutes
2. **Salt Directory** — Active ingredient / formulation index
3. **Pharmacist Portal** — Store inventory, prescription dispense, supplier reorders
4. **Admin Portal** — Discrepancy queue, audit ledger, catalog governance, tenant/user management
5. **Auth / RBAC** — Multi-tenant JWT-based identity

## Technology Stack
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express (in TypeScript)
- **AI**: Google Gen AI SDK (`@google/genai`)
- **Runtime**: Node 24.x

## Backend Architecture
```
Frontend (React SPA)
    ↓ HTTP (Vite proxy /api → :4000)
API Gateway (Express /api/v1/)
    ↓
Middleware (auth, validate, rate-limit)
    ↓
Controllers
    ↓
Services (business logic)
    ↓
Repositories (data access)
    ↓
In-Memory Store / JSON seed (Phase 1, no external DB yet)
```

## Database
Phase 1: In-memory seeded from existing mock data (mockData.ts / portalMockData.ts).
Phase 2: PostgreSQL with schema-per-tenant isolation.

## Authentication Strategy
JWT (HS256 for local dev). Tokens contain `sub`, `role`, `tenant_id`, `permissions`.

## Authorization Strategy
RBAC: permission strings (e.g. `store:inventory_write`, `catalog:moderate`).
Middleware checks permission per route.

## Important Integrations
- Google Gen AI SDK — AI-powered medicine equivalence reasoning (future)
- NPPA / CDSCO data feed — price ceiling and compliance data (future)

## Current Implementation Status
- Frontend: Complete (all views + mock data)
- Backend: **Phase 1** — Express API serving frontend-compatible JSON

## Important Constraints
- All price ceiling logic must be backend-enforced (never trust frontend)
- Multi-tenant: every data access must be scoped to `tenant_id`
- SHA-256 audit chain must be maintained for all admin actions
- Never expose password hashes, raw JWT secrets, or sensitive PII in API responses
