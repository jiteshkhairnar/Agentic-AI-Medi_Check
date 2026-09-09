# Backend Development Phases

This document outlines the phased implementation plan for the `medicine_check` backend, structured according to the AI Backend Development Master Prompt and the existing frontend architecture.

## Phase 1: Foundation & Architecture
- [ ] Finalize `/docs` context files (`REQUIREMENTS.md`, `ARCHITECTURE.md`, `API_CONTRACT.md`, etc.).
- [ ] Setup Express project structure (`src/config`, `src/routes`, `src/controllers`, `src/services`, `src/repositories`).
- [ ] Configure environment variables (`.env.example`) and structured logging.
- [ ] Initialize the Phase 1 Database (In-Memory Store seeded from frontend mock data).
- [ ] Setup application bootstrap, CORS, and centralized error handling middleware.

## Phase 2: Core Identity & Access Management (IAM)
- [x] Define `User` and `Tenant` schema structures.
- [x] Implement Authentication Service (Mock Login / OTP flow).
- [x] Implement JWT issuance and the `authenticate` middleware.
- [x] Implement granular Role-Based Access Control (RBAC) and `authorize` middleware.
- [x] Create and test Auth routes and controllers.

## Phase 3: Core Domain Repositories
- [x] Implement Repositories for Medicine Catalog and Generic Substitutes.
- [x] Implement Repositories for Pharmacist Inventory and Prescription requests.
- [x] Implement Repositories for Admin Discrepancy Tickets and Tenants.
- [x] Implement the **Audit Repository** for the SHA-256 chained ledger tracking.

## Phase 4: Business Logic (Services) & Validation
- [x] Implement input validation schemas (using a library like Zod or Joi).
- [x] Build Medicine/Catalog services (Search, Jan Aushadhi substitution matching, Price breach flagging).
- [x] Build Pharmacist services (Inventory management, dispensing logic).
- [x] Build Admin services (Discrepancy triage, catalog governance, user management).
- [x] Build Price Compliance & Audit services (enforcing DPCO ceilings and logging immutable actions).

## Phase 5: API Layer (Routes & Controllers)
- [x] Connect Controllers to their respective Services.
- [x] Register all REST Routes (`/api/v1/medicines`, `/api/v1/pharmacist`, `/api/v1/admin`, etc.).
- [x] Ensure consistent API response formats (Success vs. Error structures).
- [x] Connect the React/Vite frontend to use the `/api/v1` routes instead of hardcoded mock data.

## Phase 6: Security, Testing & Handover
- [x] Apply security hardening (Helmet, strict Rate Limiting, CORS origin checks).
- [x] Write integration test outlines or create sample test endpoints.
- [x] Ensure `memory.md` is fully updated with the new architectural landscape.
- [x] Perform a final build check (`npm run build`).
