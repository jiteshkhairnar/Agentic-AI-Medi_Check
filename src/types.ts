/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppViewMode = 
  | 'consumer-compare'
  | 'consumer-salt-directory'
  | 'consumer-savings-calc'
  | 'consumer-stores'
  | 'consumer-clinical-trust'
  | 'consumer-history'
  | 'pharmacist-portal'
  | 'admin-portal'
  | 'admin-discrepancy-queue'
  | 'admin-audit-logs'
  | 'admin-catalog-governance'
  | 'admin-system-architecture';

export type UserRole = 
  | 'super_admin'
  | 'platform_admin'
  | 'lead_pharmacist'
  | 'catalog_ops'
  | 'security_officer'
  | 'medical_store'
  | 'consumer';

export interface MedicineSubstitute {
  id: string;
  name: string;
  brandOrGenericType: 'pmbi_janaushadhi' | 'branded_generic' | 'prescribed_alternative' | 'partial_match';
  manufacturer: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  price: number;
  unitPrice: number;
  savingsVsReference: number;
  savingsPercentage: number;
  matchGrade: 'strong_100' | 'bioequivalent' | 'partial_dose_difference';
  matchBadgeText: string;
  regulatoryCert: string;
  storeAvailability: string;
  isJanAushadhi: boolean;
  distanceInfo?: string;
  verifiedTimeAgo?: string;
  cautionNotes?: string;
  isDirectlyInterchangeable: boolean;
}

export interface MedicineProduct {
  id: string; // e.g. CAN-DRUG-04921
  brandName: string;
  genericSalt: string;
  compositionDetails: string;
  manufacturer: string;
  dosageForm: string;
  packSize: string;
  scheduleCategory: 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'OTC' | 'Schedule G';
  dpcoStatutoryCap: number;
  currentChemistMRP: number;
  hasPriceBreach: boolean;
  excessMarginPercentage: number;
  excessMarkupAmount: number;
  referenceCode: string;
  isDiscontinued?: boolean;
  searchesPerDay: number;
  substitutes: MedicineSubstitute[];
}

export type DiscrepancySeverity = 'critical' | 'high' | 'medium' | 'low';
export type DiscrepancyCategory = 
  | 'dpco_ceiling_violation' 
  | 'bioequivalence_mismatch' 
  | 'partner_feed_corruption' 
  | 'missing_batch_expiry' 
  | 'auto_resolved';

export interface DiscrepancyTicket {
  ticketId: string; // e.g. #DISC-2026-0891
  medicineId: string;
  medicineName: string;
  category: DiscrepancyCategory;
  categoryLabel: string;
  subCategoryTag: string;
  severity: DiscrepancySeverity;
  status: 'active_investigating' | 'pending_clinical_signoff' | 'quarantine_active' | 'resolved';
  brandManufacturer: string;
  composition: string;
  reportedPrice: number;
  statutoryCapPrice: number;
  overchargePercentage: number;
  triggerDescription: string;
  locationContext: string;
  dailyPatientSearches: number;
  assignedTo: string;
  createdTimeAgo: string;
  evidenceTelemetry: {
    title: string;
    statusBadge: string;
    statusColor: 'tertiary' | 'error' | 'primary';
    icon: string;
  }[];
  auditTrace: {
    time: string;
    event: string;
    isHighlight?: boolean;
  }[];
  recommendedProtocol: string;
  defaultRationale: string;
}

export interface AuditLogEvent {
  id: string; // AUD-2026-88190
  timestamp: string;
  dateTag: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  actorAvatar?: string;
  actorIp: string;
  actorSignatureAlg: string;
  sessionToken: string;
  actionType: 
    | 'PRICE_CAP_ENFORCE' 
    | 'BULK_STOCK_SYNC' 
    | 'MERGE_DUPLICATE' 
    | 'ALGORITHM_UPDATE' 
    | 'REGULATORY_NOTIFICATION'
    | 'EMERGENCY_LISTING_FREEZE';
  targetEntityId: string;
  targetEntityName: string;
  targetCategory: string;
  verificationBadge: string;
  shaShort: string;
  shaFull: string;
  prevHash: string;
  blockHash: string;
  merkleRoot: string;
  beforeSnapshotJson: string;
  afterSnapshotJson: string;
  operationalNotes: string;
  isTamperEvident: boolean;
}

export interface NearbyChemistStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'Jan Aushadhi Kendra' | 'Retail Pharmacy' | 'Hospital Store';
  phone: string;
  inStock: boolean;
  stockLastVerified: string;
  acceptsPrescriptionUpload: boolean;
  dpcoCompliant: boolean;
}

export interface JwtTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  tenant_id: string;
  tenant_name: string;
  tenant_type: 'medical_store' | 'platform' | 'pharma_company' | 'individual';
  license_no?: string;
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  tenantType: 'medical_store' | 'platform' | 'pharma_company' | 'individual';
  licenseNumber?: string;
  avatar?: string;
  permissions: string[];
  jwtRaw: string;
  jwtPayload: JwtTokenPayload;
}

export interface TenantOrganization {
  id: string;
  name: string;
  type: 'medical_store' | 'pharma_company' | 'regulatory_agency';
  plan: 'Free Community' | 'Chemist Pro' | 'Enterprise Multi-Store';
  ownerName: string;
  ownerEmail: string;
  licenseNumber: string;
  cityPincode: string;
  status: 'active' | 'suspended' | 'pending_verification';
  monthlySearches: number;
  inventoryItemsCount: number;
  joinedDate: string;
  dbSchema: string;
}

export interface PlatformUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantName: string;
  tenantId: string;
  mfaEnabled: boolean;
  status: 'active' | 'invited' | 'disabled';
  lastActive: string;
  permissions: string[];
}

export interface StoreInventoryItem {
  id: string;
  medicineName: string;
  genericSalt: string;
  brandOrGeneric: 'Jan Aushadhi' | 'Branded Generic' | 'Branded Original';
  dosageForm: string;
  packSize: string;
  stockQuantity: number;
  minThreshold: number;
  chemistMrp: number;
  dpcoCeiling: number;
  isWithinDpcoCap: boolean;
  batchNumber: string;
  expiryDate: string;
  inStock: boolean;
  lastUpdated: string;
  demandCategory: 'High Demand' | 'Essential' | 'Standard';
}

export interface PrescriptionDispenseItem {
  brandName: string;
  genericSalt: string;
  dosage: string;
  brandedCost: number;
  genericSubstituteName: string;
  genericCost: number;
  isAvailableInStock: boolean;
  savings: number;
}

export interface PrescriptionDispenseRequest {
  id: string;
  patientName: string;
  patientAgeGender: string;
  patientPhone: string;
  doctorName: string;
  hospitalClinic: string;
  prescribedMedicines: PrescriptionDispenseItem[];
  totalBrandedCost: number;
  totalGenericCost: number;
  totalSavings: number;
  status: 'pending_pharmacist_review' | 'ready_for_pickup' | 'dispensed' | 'cancelled';
  uploadedAt: string;
}

export interface SupplierReorderItem {
  id: string;
  genericSalt: string;
  productName: string;
  supplierSource: 'PMBI Central Depot' | 'State Warehouse' | 'Authorized C&F';
  quantityOrdered: number;
  unitCost: number;
  totalCost: number;
  status: 'Dispatched' | 'In Transit' | 'Delivered' | 'Order Placed';
  expectedDelivery: string;
  trackingNo: string;
}
