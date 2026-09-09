# Integration Testing Strategy Outline

This document outlines the planned integration testing strategy for the `medicine_check` backend application. Since the core backend does not use a persistent database yet, these tests will focus on API behavior against the `InMemoryStore`.

## 1. Authentication & RBAC Enforcement
**Objective**: Ensure that only authorized roles can access protected endpoints.

- **Test 1.1**: Unauthenticated user trying to access `/api/v1/pharmacist/prescriptions`.
  - *Expected*: `401 Unauthorized`.
- **Test 1.2**: User with `medical_store` role trying to access `/api/v1/admin/users`.
  - *Expected*: `403 Forbidden`.
- **Test 1.3**: User with `platform_admin` accessing `/api/v1/admin/discrepancies`.
  - *Expected*: `200 OK`, valid JSON response.

## 2. Medicine Service & Catalog Boundary Limits
**Objective**: Test DPCO logic and generic substitute filtering.

- **Test 2.1**: Search medicines by brand (`Augmentin`).
  - *Expected*: Should return valid formulation details.
- **Test 2.2**: Query Jan Aushadhi substitutes.
  - *Expected*: Should return an array where `isJanAushadhi === true` for all elements.
- **Test 2.3**: DPCO breach calculation.
  - *Expected*: `MedicineService.getPriceBreaches()` should only return medicines where `chemistMrp > dpcoCeiling`.

## 3. Pharmacist Dispensation Workflow
**Objective**: Test the end-to-end dispensation of a prescription.

- **Test 3.1**: Call `PATCH /api/v1/pharmacist/inventory/:id/stock` to deduct inventory.
  - *Expected*: Returns the updated `StoreInventoryItem` with correctly decremented stock.
- **Test 3.2**: Call `POST /api/v1/pharmacist/dispense` to mark an Rx as `dispensed`.
  - *Expected*: The prescription's status changes to `dispensed`.

## 4. Admin Discrepancy Triage
**Objective**: Test the capability for Admins to review and action tickets.

- **Test 4.1**: `PATCH /api/v1/admin/discrepancies/:id/triage` with valid action (`quarantine`).
  - *Expected*: Ticket status updates to `quarantine_active`.
- **Test 4.2**: Test payload validation (invalid action).
  - *Expected*: Zod validation error (`400 Bad Request`).

## 5. Security & Rate Limiting
**Objective**: Verify infrastructure protections.

- **Test 5.1**: Send 101 requests within 15 minutes to `/api/v1/medicines/search`.
  - *Expected*: The 101st request should receive a `429 Too Many Requests` or similar rate-limiting error payload.
