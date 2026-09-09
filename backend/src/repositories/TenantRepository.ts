import { TenantOrganization } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

export class TenantRepository {
  public static async findAll(): Promise<TenantOrganization[]> {
    return Array.from(Store.tenants.values());
  }

  public static async findById(id: string): Promise<TenantOrganization | null> {
    return Store.tenants.get(id) || null;
  }
}
