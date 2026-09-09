import { PrescriptionDispenseRequest } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

export class PrescriptionRepository {
  public static async findAll(): Promise<PrescriptionDispenseRequest[]> {
    return Array.from(Store.prescriptions.values());
  }

  public static async findById(id: string): Promise<PrescriptionDispenseRequest | null> {
    return Store.prescriptions.get(id) || null;
  }

  public static async updateStatus(
    id: string, 
    status: 'pending_pharmacist_review' | 'ready_for_pickup' | 'dispensed' | 'cancelled'
  ): Promise<PrescriptionDispenseRequest | null> {
    const req = Store.prescriptions.get(id);
    if (!req) return null;

    req.status = status;
    Store.prescriptions.set(id, req);
    return req;
  }
}
