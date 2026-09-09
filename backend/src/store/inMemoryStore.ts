import { MEDICINES_DATA, DISCREPANCY_TICKETS, AUDIT_LOG_EVENTS } from '../../../src/data/mockData';
import { 
  DEMO_USERS, 
  INITIAL_STORE_INVENTORY, 
  INITIAL_PRESCRIPTION_REQUESTS, 
  INITIAL_TENANTS 
} from '../../../src/data/portalMockData';
import { 
  MedicineProduct, 
  AuthUser, 
  StoreInventoryItem, 
  PrescriptionDispenseRequest, 
  DiscrepancyTicket, 
  TenantOrganization,
  AuditLogEvent
} from '../../../src/types';

// In-Memory Collections
export const Store = {
  medicines: new Map<string, MedicineProduct>(),
  users: new Map<string, AuthUser>(),
  inventories: new Map<string, StoreInventoryItem>(),
  prescriptions: new Map<string, PrescriptionDispenseRequest>(),
  discrepancies: new Map<string, DiscrepancyTicket>(),
  tenants: new Map<string, TenantOrganization>(),
  auditLogs: new Map<string, AuditLogEvent>()
};

export const initializeInMemoryStore = async () => {
  // Seed Medicines
  MEDICINES_DATA.forEach(med => {
    Store.medicines.set(med.id, { ...med });
  });
  
  // Seed Demo Users
  Object.values(DEMO_USERS).forEach(user => {
    Store.users.set(user.id, { ...user });
  });

  // Seed Inventories
  INITIAL_STORE_INVENTORY.forEach(item => {
    Store.inventories.set(item.id, { ...item });
  });

  // Seed Prescriptions
  INITIAL_PRESCRIPTION_REQUESTS.forEach(req => {
    Store.prescriptions.set(req.id, { ...req });
  });

  // Seed Discrepancies
  DISCREPANCY_TICKETS.forEach(ticket => {
    Store.discrepancies.set(ticket.ticketId, { ...ticket });
  });

  // Seed Tenants
  INITIAL_TENANTS.forEach(tenant => {
    Store.tenants.set(tenant.id, { ...tenant });
  });

  // Seed Audit Logs
  AUDIT_LOG_EVENTS.forEach(log => {
    Store.auditLogs.set(log.id, { ...log });
  });

  console.log(`Seeded:
  - ${Store.medicines.size} medicines
  - ${Store.users.size} users
  - ${Store.inventories.size} inventory items
  - ${Store.prescriptions.size} prescriptions
  - ${Store.discrepancies.size} discrepancies
  - ${Store.tenants.size} tenants
  - ${Store.auditLogs.size} audit logs
  into memory.`);
};
