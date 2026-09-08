/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  AuthUser, 
  TenantOrganization, 
  PlatformUserItem, 
  StoreInventoryItem, 
  PrescriptionDispenseRequest, 
  SupplierReorderItem 
} from '../types';

export function generateMockJwt(payload: any): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'sig_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  pharmacist: {
    id: 'USR-PHARM-1084',
    name: 'Rajesh Patel, D.Pharm',
    email: 'rajesh.patel@janaushadhi-1084.in',
    role: 'medical_store',
    tenantId: 'tenant-medstore-1084',
    tenantName: 'Jan Aushadhi Kendra #1084 (Domlur BDA)',
    tenantType: 'medical_store',
    licenseNumber: 'DL-KA-BNG-2024-9128 (Retail & Chemist)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'store:read',
      'store:inventory_write',
      'store:price_update',
      'prescription:dispense',
      'supplier:order_create',
      'analytics:store_read'
    ],
    jwtRaw: '',
    jwtPayload: {
      sub: 'USR-PHARM-1084',
      email: 'rajesh.patel@janaushadhi-1084.in',
      name: 'Rajesh Patel, D.Pharm',
      role: 'medical_store',
      tenant_id: 'tenant-medstore-1084',
      tenant_name: 'Jan Aushadhi Kendra #1084 (Domlur BDA)',
      tenant_type: 'medical_store',
      license_no: 'DL-KA-BNG-2024-9128',
      permissions: ['store:read', 'store:inventory_write', 'prescription:dispense', 'supplier:order_create'],
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iss: 'medicine_check.auth.gateway'
    }
  },
  admin: {
    id: 'USR-ADMIN-0042',
    name: 'Vikram Malhotra',
    email: 'vikram.ops@medicinecheck.gov.in',
    role: 'platform_admin',
    tenantId: 'tenant-platform-ops',
    tenantName: 'National Drug Price Transparency Mission (HQ)',
    tenantType: 'platform',
    licenseNumber: 'NPPA-OFFICER-REG-2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'platform:overview',
      'tenant:manage',
      'tenant:provision',
      'user:manage',
      'catalog:moderate',
      'discrepancy:review',
      'system:config_write'
    ],
    jwtRaw: '',
    jwtPayload: {
      sub: 'USR-ADMIN-0042',
      email: 'vikram.ops@medicinecheck.gov.in',
      name: 'Vikram Malhotra',
      role: 'platform_admin',
      tenant_id: 'tenant-platform-ops',
      tenant_name: 'National Drug Price Transparency Mission (HQ)',
      tenant_type: 'platform',
      permissions: ['platform:overview', 'tenant:manage', 'user:manage', 'catalog:moderate'],
      iat: Math.floor(Date.now() / 1000) - 1800,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iss: 'medicine_check.auth.gateway'
    }
  },
  super_admin: {
    id: 'USR-SUPER-0001',
    name: 'Dr. Ananya Sharma',
    email: 'dr.sharma@medicinecheck.gov.in',
    role: 'super_admin',
    tenantId: 'tenant-gov-central',
    tenantName: 'Central Drugs Standard Control Org & NPPA Division',
    tenantType: 'platform',
    licenseNumber: 'CDSCO-CLINICAL-DIR-881',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UZymvmL9QjpSa4_J7jE77rN5xLqhqbrDPWzOFw6cs_EHiiWljNc4PrpzZtFJaK3MwbRiTtM01x--nnyOJ-ZpqOB17CjneCY9JbjCLN4giuQgBviYad3fBTwiU0pdZJUUeer_bOil_fEIh51q--MAtfhe7_4mXqC2xp0qBmdKcLHKJ3h0hP9uwTnUGuxsI2ObIybE0AfA4RPYJCRhz1qS4OXNG4iAa7MsxdlPzwZzfu2LOF1-KOVM1rKGZy',
    permissions: [
      '*',
      'security:audit_sign',
      'catalog:quarantine_force',
      'statutory:ceiling_override',
      'tenant:billing_override'
    ],
    jwtRaw: '',
    jwtPayload: {
      sub: 'USR-SUPER-0001',
      email: 'dr.sharma@medicinecheck.gov.in',
      name: 'Dr. Ananya Sharma',
      role: 'super_admin',
      tenant_id: 'tenant-gov-central',
      tenant_name: 'Central Drugs Standard Control Org & NPPA Division',
      tenant_type: 'platform',
      license_no: 'CDSCO-CLINICAL-DIR-881',
      permissions: ['*'],
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      iss: 'medicine_check.auth.gateway'
    }
  },
  consumer: {
    id: 'USR-CONSUMER-991',
    name: 'Kavita Nambiar',
    email: 'kavita.nambiar@gmail.com',
    role: 'consumer',
    tenantId: 'tenant-consumer-global',
    tenantName: 'Individual Patient Member',
    tenantType: 'individual',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'consumer:search',
      'consumer:compare',
      'consumer:savings_calc',
      'consumer:report_discrepancy',
      'consumer:save_medicines'
    ],
    jwtRaw: '',
    jwtPayload: {
      sub: 'USR-CONSUMER-991',
      email: 'kavita.nambiar@gmail.com',
      name: 'Kavita Nambiar',
      role: 'consumer',
      tenant_id: 'tenant-consumer-global',
      tenant_name: 'Individual Patient Member',
      tenant_type: 'individual',
      permissions: ['consumer:search', 'consumer:compare'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
      iss: 'medicine_check.auth.gateway'
    }
  }
};

// Initialize JWT raws
Object.keys(DEMO_USERS).forEach(key => {
  DEMO_USERS[key].jwtRaw = generateMockJwt(DEMO_USERS[key].jwtPayload);
});

export const INITIAL_STORE_INVENTORY: StoreInventoryItem[] = [
  {
    id: 'INV-101',
    medicineName: 'Amoxyclav 625 (Jan Aushadhi)',
    genericSalt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Film Coated Tablet',
    packSize: '10 Tablets',
    stockQuantity: 142,
    minThreshold: 30,
    chemistMrp: 58.50,
    dpcoCeiling: 204.35,
    isWithinDpcoCap: true,
    batchNumber: 'JA-2026-AUG09',
    expiryDate: '11/2027',
    inStock: true,
    lastUpdated: '10 mins ago',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-102',
    medicineName: 'Augmentin 625 Duo',
    genericSalt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    brandOrGeneric: 'Branded Original',
    dosageForm: 'Film Coated Tablet',
    packSize: '10 Tablets',
    stockQuantity: 18,
    minThreshold: 20,
    chemistMrp: 204.00,
    dpcoCeiling: 204.35,
    isWithinDpcoCap: true,
    batchNumber: 'GSK-99120',
    expiryDate: '08/2027',
    inStock: true,
    lastUpdated: '1 hour ago',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-103',
    medicineName: 'Telmisartan 40mg (Jan Aushadhi)',
    genericSalt: 'Telmisartan (40mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Tablet',
    packSize: '10 Tablets',
    stockQuantity: 280,
    minThreshold: 50,
    chemistMrp: 14.20,
    dpcoCeiling: 72.80,
    isWithinDpcoCap: true,
    batchNumber: 'BPPI-TEL-441',
    expiryDate: '04/2028',
    inStock: true,
    lastUpdated: '35 mins ago',
    demandCategory: 'Essential'
  },
  {
    id: 'INV-104',
    medicineName: 'Telma 40 (Glenmark)',
    genericSalt: 'Telmisartan (40mg)',
    brandOrGeneric: 'Branded Original',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    stockQuantity: 45,
    minThreshold: 25,
    chemistMrp: 148.50,
    dpcoCeiling: 154.00,
    isWithinDpcoCap: true,
    batchNumber: 'GLEN-8812',
    expiryDate: '01/2028',
    inStock: true,
    lastUpdated: '2 hours ago',
    demandCategory: 'Essential'
  },
  {
    id: 'INV-105',
    medicineName: 'Metformin 500mg SR (Jan Aushadhi)',
    genericSalt: 'Metformin Hydrochloride Sustained Release (500mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Sustained Release Tablet',
    packSize: '10 Tablets',
    stockQuantity: 310,
    minThreshold: 60,
    chemistMrp: 9.80,
    dpcoCeiling: 34.50,
    isWithinDpcoCap: true,
    batchNumber: 'JA-MET-908',
    expiryDate: '09/2028',
    inStock: true,
    lastUpdated: '15 mins ago',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-106',
    medicineName: 'Glycomet 500 SR',
    genericSalt: 'Metformin Hydrochloride Sustained Release (500mg)',
    brandOrGeneric: 'Branded Original',
    dosageForm: 'Sustained Release Tablet',
    packSize: '10 Tablets',
    stockQuantity: 8,
    minThreshold: 30,
    chemistMrp: 32.50,
    dpcoCeiling: 34.50,
    isWithinDpcoCap: true,
    batchNumber: 'USV-77189',
    expiryDate: '05/2027',
    inStock: true,
    lastUpdated: 'Today 09:00',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-107',
    medicineName: 'Rosuvastatin 10mg (Jan Aushadhi)',
    genericSalt: 'Rosuvastatin Calcium (10mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Film Coated Tablet',
    packSize: '10 Tablets',
    stockQuantity: 195,
    minThreshold: 40,
    chemistMrp: 28.00,
    dpcoCeiling: 198.50,
    isWithinDpcoCap: true,
    batchNumber: 'BPPI-RSV-112',
    expiryDate: '12/2027',
    inStock: true,
    lastUpdated: '40 mins ago',
    demandCategory: 'Essential'
  },
  {
    id: 'INV-108',
    medicineName: 'Pan 40 (Pantoprazole)',
    genericSalt: 'Pantoprazole Sodium Gastro-resistant (40mg)',
    brandOrGeneric: 'Branded Original',
    dosageForm: 'Enteric Coated Tablet',
    packSize: '15 Tablets',
    stockQuantity: 0,
    minThreshold: 20,
    chemistMrp: 165.00,
    dpcoCeiling: 172.00,
    isWithinDpcoCap: true,
    batchNumber: 'ALKM-5512',
    expiryDate: '03/2027',
    inStock: false,
    lastUpdated: 'Yesterday',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-109',
    medicineName: 'Pantoprazole 40mg (Jan Aushadhi)',
    genericSalt: 'Pantoprazole Sodium Gastro-resistant (40mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Enteric Coated Tablet',
    packSize: '10 Tablets',
    stockQuantity: 240,
    minThreshold: 40,
    chemistMrp: 18.50,
    dpcoCeiling: 114.60,
    isWithinDpcoCap: true,
    batchNumber: 'JA-PAN-881',
    expiryDate: '10/2028',
    inStock: true,
    lastUpdated: '20 mins ago',
    demandCategory: 'High Demand'
  },
  {
    id: 'INV-110',
    medicineName: 'Paracetamol 650mg IP',
    genericSalt: 'Paracetamol IP (650mg)',
    brandOrGeneric: 'Jan Aushadhi',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    stockQuantity: 520,
    minThreshold: 100,
    chemistMrp: 12.00,
    dpcoCeiling: 31.50,
    isWithinDpcoCap: true,
    batchNumber: 'JA-PCM-0021',
    expiryDate: '02/2029',
    inStock: true,
    lastUpdated: '5 mins ago',
    demandCategory: 'Essential'
  }
];

export const INITIAL_PRESCRIPTION_REQUESTS: PrescriptionDispenseRequest[] = [
  {
    id: 'RX-REQ-8891',
    patientName: 'Ramesh Sundaram',
    patientAgeGender: '62 / Male',
    patientPhone: '+91 98450 11290',
    doctorName: 'Dr. S. K. Narayanan (MD, Cardiology)',
    hospitalClinic: 'Manipal Hospital, Old Airport Road',
    prescribedMedicines: [
      {
        brandName: 'Telma 40 (15 Tabs)',
        genericSalt: 'Telmisartan (40mg)',
        dosage: '1 Tab Daily (Morning)',
        brandedCost: 148.50,
        genericSubstituteName: 'Telmisartan 40mg Jan Aushadhi (15 Tabs eq.)',
        genericCost: 21.30,
        isAvailableInStock: true,
        savings: 127.20
      },
      {
        brandName: 'Rosuvas 10 (10 Tabs)',
        genericSalt: 'Rosuvastatin (10mg)',
        dosage: '1 Tab at Bedtime',
        brandedCost: 248.00,
        genericSubstituteName: 'Rosuvastatin 10mg Jan Aushadhi',
        genericCost: 28.00,
        isAvailableInStock: true,
        savings: 220.00
      },
      {
        brandName: 'Glycomet 500 SR (30 Tabs)',
        genericSalt: 'Metformin SR (500mg)',
        dosage: '1 Tab Twice Daily after meals',
        brandedCost: 97.50,
        genericSubstituteName: 'Metformin 500mg SR Jan Aushadhi (30 Tabs)',
        genericCost: 29.40,
        isAvailableInStock: true,
        savings: 68.10
      }
    ],
    totalBrandedCost: 494.00,
    totalGenericCost: 78.70,
    totalSavings: 415.30,
    status: 'pending_pharmacist_review',
    uploadedAt: '18 mins ago'
  },
  {
    id: 'RX-REQ-8892',
    patientName: 'Sunita Sharma',
    patientAgeGender: '48 / Female',
    patientPhone: '+91 97112 44302',
    doctorName: 'Dr. Meenakshi Iyer (Chest Physician)',
    hospitalClinic: 'Apollo Clinic, Indiranagar',
    prescribedMedicines: [
      {
        brandName: 'Augmentin 625 Duo (10 Tabs)',
        genericSalt: 'Amoxicillin (500mg) + Clavulanate (125mg)',
        dosage: '1 Tab every 12 hours for 5 days',
        brandedCost: 204.00,
        genericSubstituteName: 'Amoxyclav 625 Jan Aushadhi',
        genericCost: 58.50,
        isAvailableInStock: true,
        savings: 145.50
      },
      {
        brandName: 'Pan 40 (10 Tabs)',
        genericSalt: 'Pantoprazole (40mg)',
        dosage: '1 Tab Before Breakfast',
        brandedCost: 110.00,
        genericSubstituteName: 'Pantoprazole 40mg Jan Aushadhi',
        genericCost: 18.50,
        isAvailableInStock: true,
        savings: 91.50
      }
    ],
    totalBrandedCost: 314.00,
    totalGenericCost: 77.00,
    totalSavings: 237.00,
    status: 'ready_for_pickup',
    uploadedAt: '1 hour ago'
  },
  {
    id: 'RX-REQ-8893',
    patientName: 'Karthik Raja',
    patientAgeGender: '35 / Male',
    patientPhone: '+91 94432 77819',
    doctorName: 'Dr. Anand Verma (General Physician)',
    hospitalClinic: 'Fortis Health Centre',
    prescribedMedicines: [
      {
        brandName: 'Dolo 650 (15 Tabs)',
        genericSalt: 'Paracetamol (650mg)',
        dosage: 'SOS for Fever / Body ache',
        brandedCost: 31.50,
        genericSubstituteName: 'Paracetamol 650mg Jan Aushadhi',
        genericCost: 12.00,
        isAvailableInStock: true,
        savings: 19.50
      }
    ],
    totalBrandedCost: 31.50,
    totalGenericCost: 12.00,
    totalSavings: 19.50,
    status: 'dispensed',
    uploadedAt: '3 hours ago'
  }
];

export const INITIAL_SUPPLIER_ORDERS: SupplierReorderItem[] = [
  {
    id: 'PO-PMBI-2026-901',
    genericSalt: 'Telmisartan (40mg) Tablets',
    productName: 'PMBI Telmisartan 40mg (Box of 500 Tabs)',
    supplierSource: 'PMBI Central Depot',
    quantityOrdered: 50,
    unitCost: 55.00,
    totalCost: 2750.00,
    status: 'Dispatched',
    expectedDelivery: 'Tomorrow, 11:30 AM',
    trackingNo: 'DTDC-BLR-881920'
  },
  {
    id: 'PO-PMBI-2026-902',
    genericSalt: 'Amoxicillin + Clavulanate (625mg)',
    productName: 'PMBI Amoxyclav 625 (Box of 200 Tabs)',
    supplierSource: 'State Warehouse',
    quantityOrdered: 30,
    unitCost: 480.00,
    totalCost: 14400.00,
    status: 'In Transit',
    expectedDelivery: '10 Nov 2026',
    trackingNo: 'SPEEDPOST-IN-7721'
  },
  {
    id: 'PO-PMBI-2026-903',
    genericSalt: 'Metformin SR (500mg)',
    productName: 'PMBI Metformin 500mg (Box of 1000 Tabs)',
    supplierSource: 'PMBI Central Depot',
    quantityOrdered: 20,
    unitCost: 820.00,
    totalCost: 16400.00,
    status: 'Delivered',
    expectedDelivery: 'Delivered Yesterday',
    trackingNo: 'DTDC-BLR-870014'
  }
];

export const INITIAL_TENANTS: TenantOrganization[] = [
  {
    id: 'tenant-medstore-1084',
    name: 'Jan Aushadhi Kendra #1084 - Domlur BDA',
    type: 'medical_store',
    plan: 'Chemist Pro',
    ownerName: 'Rajesh Patel',
    ownerEmail: 'rajesh.patel@janaushadhi-1084.in',
    licenseNumber: 'DL-KA-BNG-2024-9128',
    cityPincode: 'Bengaluru 560071',
    status: 'active',
    monthlySearches: 4280,
    inventoryItemsCount: 342,
    joinedDate: '15 Jan 2025',
    dbSchema: 'tenant_medstore_1084'
  },
  {
    id: 'tenant-sanjeevani-414',
    name: 'Sanjeevani Medicos & Generic Center',
    type: 'medical_store',
    plan: 'Enterprise Multi-Store',
    ownerName: 'Girish Deshmukh',
    ownerEmail: 'girish@sanjeevanimedicos.in',
    licenseNumber: 'DL-KA-BNG-2023-1109',
    cityPincode: 'Bengaluru 560038',
    status: 'active',
    monthlySearches: 8940,
    inventoryItemsCount: 680,
    joinedDate: '02 Mar 2024',
    dbSchema: 'tenant_sanjeevani_414'
  },
  {
    id: 'tenant-apollo-blr-04',
    name: 'Apollo Pharmacy 24/7 HAL 2nd Stage',
    type: 'medical_store',
    plan: 'Enterprise Multi-Store',
    ownerName: 'Sunil Nair',
    ownerEmail: 'ops.hal@apollopharmacy.org',
    licenseNumber: 'DL-KA-BNG-2022-7789',
    cityPincode: 'Bengaluru 560008',
    status: 'active',
    monthlySearches: 18450,
    inventoryItemsCount: 1420,
    joinedDate: '10 Nov 2023',
    dbSchema: 'tenant_apollo_blr_04'
  },
  {
    id: 'tenant-pharma-mankind',
    name: 'Mankind Pharma Compliance Portal',
    type: 'pharma_company',
    plan: 'Enterprise Multi-Store',
    ownerName: 'Dr. Alok Srivastava',
    ownerEmail: 'regulatory@mankindpharma.com',
    licenseNumber: 'CDSCO-MFG-DL-2019-012',
    cityPincode: 'New Delhi 110020',
    status: 'active',
    monthlySearches: 45100,
    inventoryItemsCount: 420,
    joinedDate: '18 Aug 2024',
    dbSchema: 'tenant_pharma_mankind'
  },
  {
    id: 'tenant-pharma-sun',
    name: 'Sun Pharma Regulatory Data Feed',
    type: 'pharma_company',
    plan: 'Enterprise Multi-Store',
    ownerName: 'Neha Aggarwal',
    ownerEmail: 'compliance@sunpharma.com',
    licenseNumber: 'CDSCO-MFG-MH-2018-882',
    cityPincode: 'Mumbai 400063',
    status: 'active',
    monthlySearches: 62000,
    inventoryItemsCount: 512,
    joinedDate: '05 Jan 2024',
    dbSchema: 'tenant_pharma_sun'
  },
  {
    id: 'tenant-delhi-med-store-12',
    name: 'Gupta Medical Hall & Jan Aushadhi',
    type: 'medical_store',
    plan: 'Free Community',
    ownerName: 'Sanjay Gupta',
    ownerEmail: 'guptamed@delhichemist.in',
    licenseNumber: 'DL-DEL-CP-2024-5519',
    cityPincode: 'New Delhi 110001',
    status: 'active',
    monthlySearches: 1850,
    inventoryItemsCount: 198,
    joinedDate: '12 Sep 2025',
    dbSchema: 'tenant_delhi_med_12'
  }
];

export const INITIAL_PLATFORM_USERS: PlatformUserItem[] = [
  {
    id: 'USR-SUPER-0001',
    name: 'Dr. Ananya Sharma',
    email: 'dr.sharma@medicinecheck.gov.in',
    role: 'super_admin',
    tenantName: 'CDSCO & NPPA Central Division',
    tenantId: 'tenant-gov-central',
    mfaEnabled: true,
    status: 'active',
    lastActive: 'Just now',
    permissions: ['* (All System Capabilities)']
  },
  {
    id: 'USR-ADMIN-0042',
    name: 'Vikram Malhotra',
    email: 'vikram.ops@medicinecheck.gov.in',
    role: 'platform_admin',
    tenantName: 'National Drug Transparency Mission',
    tenantId: 'tenant-platform-ops',
    mfaEnabled: true,
    status: 'active',
    lastActive: '4 mins ago',
    permissions: ['tenant:manage', 'user:manage', 'catalog:moderate', 'system:telemetry']
  },
  {
    id: 'USR-COMPL-0089',
    name: 'Pooja Iyer',
    email: 'pooja.compliance@medicinecheck.gov.in',
    role: 'security_officer',
    tenantName: 'CDSCO Drug Price Enforcement Cell',
    tenantId: 'tenant-gov-central',
    mfaEnabled: true,
    status: 'active',
    lastActive: '22 mins ago',
    permissions: ['audit:read', 'audit:sign', 'discrepancy:enforce', 'quarantine:apply']
  },
  {
    id: 'USR-PHARM-1084',
    name: 'Rajesh Patel, D.Pharm',
    email: 'rajesh.patel@janaushadhi-1084.in',
    role: 'medical_store',
    tenantName: 'Jan Aushadhi Kendra #1084 (Domlur)',
    tenantId: 'tenant-medstore-1084',
    mfaEnabled: false,
    status: 'active',
    lastActive: '12 mins ago',
    permissions: ['store:inventory_write', 'prescription:dispense', 'supplier:order_create']
  },
  {
    id: 'USR-CATALOG-014',
    name: 'Arjun Rao',
    email: 'arjun.catalog@medicinecheck.gov.in',
    role: 'catalog_ops',
    tenantName: 'National Drug Transparency Mission',
    tenantId: 'tenant-platform-ops',
    mfaEnabled: true,
    status: 'active',
    lastActive: '1 hour ago',
    permissions: ['catalog:read', 'catalog:brand_mapping', 'catalog:salt_edit']
  }
];
