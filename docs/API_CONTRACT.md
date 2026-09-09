# API_CONTRACT.md — medicine_check REST API

Base URL: `http://localhost:4000/api/v1`

All protected routes require: `Authorization: Bearer <jwt>`

All responses follow:
```json
{ "success": true, "data": {}, "meta": {} }
{ "success": false, "message": "...", "code": "ERROR_CODE", "errors": [] }
```

---

## Auth

### POST /api/v1/auth/login
Auth: Public

Request:
```json
{ "email": "string", "password": "string", "tenantType": "medical_store|platform|individual" }
```
Response (200):
```json
{ "success": true, "data": { "token": "jwt", "user": { "id", "name", "email", "role", "tenantId", "tenantName", "permissions" } } }
```
Errors: `401 INVALID_CREDENTIALS`, `403 ACCOUNT_DISABLED`

### POST /api/v1/auth/otp/request
Auth: Public — Consumer phone OTP

Request: `{ "phone": "+91XXXXXXXXXX" }`
Response (200): `{ "success": true, "data": { "otpSent": true } }`

### POST /api/v1/auth/otp/verify
Auth: Public

Request: `{ "phone": "+91XXXXXXXXXX", "otp": "123456" }`
Response (200): `{ "success": true, "data": { "token": "jwt", "user": {} } }`

### POST /api/v1/auth/logout
Auth: Required — Invalidates token (in-memory blacklist Phase 1)

Response (204): No content

---

## Medicines (Public)

### GET /api/v1/medicines
Auth: Public

Query: `?search=augmentin&schedule=H&priceBreach=true&page=1&limit=20`
Response (200):
```json
{
  "success": true,
  "data": [ "MedicineProduct array" ],
  "meta": { "total": 50, "page": 1, "limit": 20 }
}
```

### GET /api/v1/medicines/:id
Auth: Public

Response (200): `{ "success": true, "data": "MedicineProduct" }`
Errors: `404 NOT_FOUND`

### GET /api/v1/medicines/:id/substitutes
Auth: Public

Response (200): `{ "success": true, "data": [ "MedicineSubstitute array" ] }`

### GET /api/v1/salts
Auth: Public

Query: `?search=amoxicillin`
Response (200): `{ "success": true, "data": [ { salt, strength, formulations[], products[] }... ] }`

### GET /api/v1/stores
Auth: Public

Query: `?lat=12.9&lng=77.6&radius=5&janAushadhi=true`
Response (200): `{ "success": true, "data": [ "NearbyChemistStore array" ] }`

---

## Reports (Consumer / Pharmacist)

### POST /api/v1/reports/price-discrepancy
Auth: Required (any authenticated user)

Request:
```json
{
  "medicineId": "CAN-DRUG-04921",
  "medicineName": "Augmentin 625 Duo",
  "reportedPrice": 250.00,
  "storeName": "ABC Pharmacy",
  "storeLocation": "Bangalore",
  "reporterNotes": "Charged above DPCO ceiling"
}
```
Response (201): `{ "success": true, "data": { "ticketId": "#DISC-2026-XXXX", "severity": "high" } }`

---

## Pharmacist Portal (Permission: `store:read`)

### GET /api/v1/pharmacist/inventory
Auth: Required | Permission: `store:read`
Tenant-scoped.

Query: `?search=&inStock=true&demandCategory=High+Demand&page=1&limit=50`
Response (200): `{ "success": true, "data": [ "StoreInventoryItem array" ], "meta": {} }`

### PATCH /api/v1/pharmacist/inventory/:id
Auth: Required | Permission: `store:inventory_write`

Request: `{ "stockQuantity": 150, "chemistMrp": 58.50 }`
Response (200): `{ "success": true, "data": "updatedItem" }`
Validation: `chemistMrp` must not exceed `dpcoCeiling` (backend enforced)

### GET /api/v1/pharmacist/prescriptions
Auth: Required | Permission: `prescription:dispense`

Query: `?status=pending_pharmacist_review`
Response (200): `{ "success": true, "data": [ "PrescriptionDispenseRequest array" ] }`

### PATCH /api/v1/pharmacist/prescriptions/:id/status
Auth: Required | Permission: `prescription:dispense`

Request: `{ "status": "dispensed|cancelled|ready_for_pickup" }`
Response (200): `{ "success": true, "data": "updated" }`

### GET /api/v1/pharmacist/reorders
Auth: Required | Permission: `supplier:order_create`

Response (200): `{ "success": true, "data": [ "SupplierReorderItem array" ] }`

### POST /api/v1/pharmacist/reorders
Auth: Required | Permission: `supplier:order_create`

Request: `{ "genericSalt": "string", "productName": "string", "quantityOrdered": 100, "supplierSource": "PMBI Central Depot|State Warehouse|Authorized C&F" }`
Response (201): `{ "success": true, "data": "newReorderItem" }`

---

## Admin — Discrepancy Queue (Permission: `discrepancy:review`)

### GET /api/v1/admin/discrepancies
Auth: Required | Permission: `discrepancy:review`

Query: `?severity=critical&status=active_investigating&category=dpco_ceiling_violation&page=1&limit=20`
Response (200): `{ "success": true, "data": [ "DiscrepancyTicket array" ], "meta": {} }`

### GET /api/v1/admin/discrepancies/:id
Auth: Required | Permission: `discrepancy:review`

Response (200): `{ "success": true, "data": "DiscrepancyTicket" }`

### POST /api/v1/admin/discrepancies/:id/resolve
Auth: Required | Permission: `discrepancy:review`

Request: `{ "rationale": "string", "enforcedPrice": 204.35 }`
Response (200): `{ "success": true, "data": { "ticket": "updated", "auditId": "AUD-2026-XXXXX" } }`

---

## Admin — Audit Ledger (Permission: `platform:overview`)

### GET /api/v1/admin/audit-logs
Auth: Required | Permission: `platform:overview`

Query: `?actionType=PRICE_CAP_ENFORCE&page=1&limit=50`
Response (200): `{ "success": true, "data": [ "AuditLogEvent array" ], "meta": {} }`

### GET /api/v1/admin/audit-logs/:id
Auth: Required | Permission: `platform:overview`

Response (200): `{ "success": true, "data": "AuditLogEvent" }`

---

## Admin — Catalog (Permission: `catalog:moderate`)

### GET /api/v1/admin/catalog
Auth: Required | Permission: `catalog:moderate`

Query: `?search=&hasPriceBreach=true&page=1&limit=50`
Response (200): `{ "success": true, "data": [ "MedicineProduct array" ], "meta": {} }`

### POST /api/v1/admin/catalog
Auth: Required | Permission: `catalog:moderate`

Request: Full `MedicineProduct` fields (minus `id`, auto-generated)
Response (201): `{ "success": true, "data": "createdProduct" }`

### PATCH /api/v1/admin/catalog/:id
Auth: Required | Permission: `catalog:moderate`

Request: Partial MedicineProduct fields
Response (200): `{ "success": true, "data": "updatedProduct" }`

---

## Admin — Tenants & Users (Permission: `tenant:manage`)

### GET /api/v1/admin/tenants
Auth: Required | Permission: `tenant:manage`

Response (200): `{ "success": true, "data": [ "TenantOrganization array" ] }`

### GET /api/v1/admin/users
Auth: Required | Permission: `user:manage`

Query: `?role=&status=active`
Response (200): `{ "success": true, "data": [ "PlatformUserItem array" ] }`

### POST /api/v1/admin/users
Auth: Required | Permission: `user:manage`

Request: `{ "name", "email", "role", "tenantId" }`
Response (201): `{ "success": true, "data": "newUser" }`

### PATCH /api/v1/admin/users/:id/status
Auth: Required | Permission: `user:manage`

Request: `{ "status": "active|disabled" }`
Response (200): `{ "success": true, "data": "updatedUser" }`

---

## Health

### GET /api/v1/health
Auth: Public

Response (200): `{ "success": true, "data": { "status": "ok", "uptime": 123, "timestamp": "ISO" } }`
