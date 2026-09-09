export interface Tenant {
  id: string;
  name: string;
  type: 'medical_store' | 'pharma_company' | 'regulatory_agency' | 'platform' | 'individual';
  plan: 'Free Community' | 'Chemist Pro' | 'Enterprise Multi-Store';
  ownerName: string;
  ownerEmail: string;
  licenseNumber?: string;
  cityPincode?: string;
  status: 'active' | 'suspended' | 'pending_verification';
  joinedDate: string;
}
