import { MEDICINES_DATA, DISCREPANCY_TICKETS, AUDIT_LOG_EVENTS } from '../../../shared/data/mockData';
import { 
  INITIAL_PLATFORM_USERS, 
  INITIAL_SUPPLIER_ORDERS, 
  INITIAL_PRESCRIPTION_REQUESTS, 
  INITIAL_TENANTS 
} from '../../../shared/data/portalMockData';
import { Medicine } from '../models/Medicine';
import { User } from '../models/User';
import { Inventory } from '../models/Inventory';
import { Prescription } from '../models/Prescription';
import { Discrepancy } from '../models/Discrepancy';
import { Tenant } from '../models/Tenant';
import { AuditLog } from '../models/AuditLog';

export const seedDatabase = async () => {
  try {
    const medCount = await Medicine.countDocuments();
    if (medCount > 0) {
      console.log('📦 Database already seeded. Skipping seed process.');
      return;
    }

    console.log('🌱 Seeding MongoDB Database...');

    await Medicine.insertMany(MEDICINES_DATA);
    await User.insertMany(INITIAL_PLATFORM_USERS);
    await Inventory.insertMany(INITIAL_SUPPLIER_ORDERS);
    await Prescription.insertMany(INITIAL_PRESCRIPTION_REQUESTS);
    await Discrepancy.insertMany(DISCREPANCY_TICKETS);
    await Tenant.insertMany(INITIAL_TENANTS);
    await AuditLog.insertMany(AUDIT_LOG_EVENTS);

    console.log('✅ Seeded:');
    console.log(`  - ${MEDICINES_DATA.length} medicines`);
    console.log(`  - ${INITIAL_PLATFORM_USERS.length} users`);
    console.log(`  - ${INITIAL_SUPPLIER_ORDERS.length} inventory items`);
    console.log(`  - ${INITIAL_PRESCRIPTION_REQUESTS.length} prescriptions`);
    console.log(`  - ${DISCREPANCY_TICKETS.length} discrepancies`);
    console.log(`  - ${INITIAL_TENANTS.length} tenants`);
    console.log(`  - ${AUDIT_LOG_EVENTS.length} audit logs`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
