import { DiscrepancyTicket } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

export class DiscrepancyRepository {
  public static async findAll(): Promise<DiscrepancyTicket[]> {
    return Array.from(Store.discrepancies.values());
  }

  public static async findById(id: string): Promise<DiscrepancyTicket | null> {
    return Store.discrepancies.get(id) || null;
  }

  public static async findByStatus(status: DiscrepancyTicket['status']): Promise<DiscrepancyTicket[]> {
    const all = await this.findAll();
    return all.filter(t => t.status === status);
  }
}
