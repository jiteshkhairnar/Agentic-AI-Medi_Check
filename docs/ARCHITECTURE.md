# ARCHITECTURE.md — medicine_check Backend

## System Architecture

```
┌─────────────────────────────────────┐
│      React SPA (Vite, port 3000)    │
│  Consumer / Pharmacist / Admin UI   │
└────────────────┬────────────────────┘
                 │ HTTP (Vite proxy /api → :4000)
                 ▼
┌─────────────────────────────────────┐
│     Express API Server (port 4000)  │
│         backend/src/server.ts       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Global Middleware Stack   │   │
│  │  cors → helmet → rateLimit  │   │
│  │  → requestLogger → morgan   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │       Route Registry         │   │
│  │  /api/v1/auth               │   │
│  │  /api/v1/medicines          │   │
│  │  /api/v1/pharmacist         │   │
│  │  /api/v1/admin              │   │
│  │  /api/v1/reports            │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │   Auth Middleware            │   │
│  │  authenticate → authorize   │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Request Validator           │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Controllers                 │   │
│  │  (HTTP in/out only)         │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Services (Business Logic)   │   │
│  │  + Audit Service             │   │
│  │  + Price Compliance Service  │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Repositories (Data Access)  │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  In-Memory Store (Phase 1)   │   │
│  │  Seeded from mock data       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Data Flow (Typical Protected Request)
```
Client → POST /api/v1/admin/discrepancies/:id/resolve
  → cors + helmet
  → authenticate(jwt) — extract user from token
  → authorize('discrepancy:review') — check permission
  → validate(resolveSchema) — validate body
  → DiscrepancyController.resolve(req, res)
  → DiscrepancyService.resolveTicket(ticketId, rationale, actor)
      → validate DPCO ceiling enforcement
      → DiscrepancyRepository.update(ticket)
      → AuditService.append(action, actor, before, after)
  → 200 { success: true, data: updatedTicket }
```

## Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts          # env var validation
│   │   └── logger.ts       # pino structured logger
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── medicines.routes.ts
│   │   ├── pharmacist.routes.ts
│   │   ├── admin.routes.ts
│   │   └── reports.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── medicine.service.ts
│   │   ├── pharmacist.service.ts
│   │   ├── admin.service.ts
│   │   ├── audit.service.ts        # SHA-256 chained ledger
│   │   └── priceCompliance.service.ts
│   ├── repositories/
│   │   ├── medicine.repository.ts
│   │   ├── discrepancy.repository.ts
│   │   ├── audit.repository.ts
│   │   ├── pharmacist.repository.ts
│   │   └── admin.repository.ts
│   ├── store/
│   │   └── inMemory.ts     # seeded in-memory data store
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── validators/
│   │   ├── auth.validators.ts
│   │   ├── medicine.validators.ts
│   │   ├── discrepancy.validators.ts
│   │   └── report.validators.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── sha256Chain.ts
│   │   └── apiResponse.ts
│   ├── constants/
│   │   └── roles.ts
│   ├── app.ts
│   └── server.ts
```

## Key Architectural Decisions
- See `DECISIONS.md` for rationale on each decision
- Phase 1 uses in-memory store; Phase 2 migrates to PostgreSQL with no controller/service changes
- Repository pattern ensures database can be swapped without touching business logic
