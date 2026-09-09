import { TenantOrganization } from '../../../shared/types';
import { Tenant } from '../models/Tenant';

export class TenantRepository {
  public static async findAll(): Promise<TenantOrganization[]> {
    const docs = await Tenant.find().lean();
    return docs as unknown as TenantOrganization[];
  }

  public static async findById(id: string): Promise<TenantOrganization | null> {
    const doc = await Tenant.findOne({ id }).lean();
    return doc ? (doc as unknown as TenantOrganization) : null;
  }
}
