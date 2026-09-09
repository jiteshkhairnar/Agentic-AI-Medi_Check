import { UserRole } from '../../../shared/types';

export interface User {
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
}
