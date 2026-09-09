# REQUIREMENTS.md — Backend Requirements

Requirements derived from: frontend types.ts, mock data, App.tsx component tree, and AuthModal.

---

## Authentication & Authorization

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-001 | Users authenticate with email + password (Pharmacist/Admin) or phone + OTP (Consumer) | High | `/api/v1/auth/login`, `/api/v1/auth/otp/*` | Pending |
| REQ-002 | JWT issued on successful login containing: `sub`, `role`, `tenant_id`, `permissions` | High | Auth service + JWT util | Pending |
| REQ-003 | Protected routes require valid JWT in `Authorization: Bearer <token>` header | High | `authenticate` middleware | Pending |
| REQ-004 | Role-based access enforced per endpoint (`super_admin`, `platform_admin`, `lead_pharmacist`, `catalog_ops`, `security_officer`, `medical_store`, `consumer`) | High | `authorize(permission)` middleware | Pending |
| REQ-005 | Multi-tenant isolation: every query scoped to `tenant_id` from JWT (never from request body) | Critical | All repositories | Pending |

---

## Medicine Catalog (Consumer + Pharmacist)

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-010 | List all canonical medicine products with filters (search by name/salt, schedule, price breach) | High | `GET /api/v1/medicines` | Pending |
| REQ-011 | Get single medicine product with full substitute list | High | `GET /api/v1/medicines/:id` | Pending |
| REQ-012 | List generic/Jan Aushadhi substitutes for a medicine | High | `GET /api/v1/medicines/:id/substitutes` | Pending |
| REQ-013 | Salt/active-ingredient directory with search | Medium | `GET /api/v1/salts` | Pending |
| REQ-014 | Nearby Jan Aushadhi / chemist store locator | Medium | `GET /api/v1/stores` | Pending |

---

## Pharmacist Portal

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-020 | List store inventory (scoped to tenant) | High | `GET /api/v1/pharmacist/inventory` | Pending |
| REQ-021 | Update inventory item (stock quantity, MRP) | High | `PATCH /api/v1/pharmacist/inventory/:id` | Pending |
| REQ-022 | List prescription dispense requests (tenant-scoped) | High | `GET /api/v1/pharmacist/prescriptions` | Pending |
| REQ-023 | Update prescription status (dispense / cancel) | High | `PATCH /api/v1/pharmacist/prescriptions/:id/status` | Pending |
| REQ-024 | List supplier reorder items (tenant-scoped) | Medium | `GET /api/v1/pharmacist/reorders` | Pending |
| REQ-025 | Create supplier reorder | Medium | `POST /api/v1/pharmacist/reorders` | Pending |

---

## Admin — Discrepancy Queue

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-030 | List all discrepancy tickets with filters (severity, status, category) | High | `GET /api/v1/admin/discrepancies` | Pending |
| REQ-031 | Get single discrepancy ticket with full audit trace | High | `GET /api/v1/admin/discrepancies/:id` | Pending |
| REQ-032 | Resolve a discrepancy ticket (sets status=resolved, records rationale + actor) | High | `POST /api/v1/admin/discrepancies/:id/resolve` | Pending |

---

## Admin — Audit Ledger

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-040 | List audit log events (paginated) with filters | High | `GET /api/v1/admin/audit-logs` | Pending |
| REQ-041 | Get single audit event with before/after snapshot | Medium | `GET /api/v1/admin/audit-logs/:id` | Pending |
| REQ-042 | Every admin write action must append a tamper-evident SHA-256 chained audit record | Critical | Audit service (called from all write services) | Pending |

---

## Admin — Catalog Governance

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-050 | List canonical drug catalog with search/filter | High | `GET /api/v1/admin/catalog` | Pending |
| REQ-051 | Register a new canonical drug | High | `POST /api/v1/admin/catalog` | Pending |
| REQ-052 | Update canonical drug details | Medium | `PATCH /api/v1/admin/catalog/:id` | Pending |

---

## Admin — Tenant & User Management

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-060 | List tenants (organizations) | High | `GET /api/v1/admin/tenants` | Pending |
| REQ-061 | List platform users with role/status filters | High | `GET /api/v1/admin/users` | Pending |
| REQ-062 | Create / invite platform user | Medium | `POST /api/v1/admin/users` | Pending |
| REQ-063 | Update user status (active/disabled) | Medium | `PATCH /api/v1/admin/users/:id/status` | Pending |

---

## Price Compliance

| ID | Description | Priority | Backend Impact | Status |
|---|---|---|---|---|
| REQ-070 | Report price discrepancy (consumer/pharmacist reports a chemist violation) | High | `POST /api/v1/reports/price-discrepancy` | Pending |
| REQ-071 | Backend must validate reported price vs DPCO ceiling and flag breaches | Critical | Price compliance service | Pending |

---

## ASSUMPTION — REQ-A001
> **No external database in Phase 1.** Backend serves data from in-memory seed derived from mock data files. Phase 2 will migrate to PostgreSQL.
