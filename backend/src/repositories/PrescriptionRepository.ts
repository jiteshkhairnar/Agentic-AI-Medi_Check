import { PrescriptionDispenseRequest } from '../../../shared/types';
import { Prescription } from '../models/Prescription';

export class PrescriptionRepository {
  public static async findAll(): Promise<PrescriptionDispenseRequest[]> {
    const docs = await Prescription.find().lean();
    return docs as unknown as PrescriptionDispenseRequest[];
  }

  public static async findById(id: string): Promise<PrescriptionDispenseRequest | null> {
    const doc = await Prescription.findOne({ id }).lean();
    return doc ? (doc as unknown as PrescriptionDispenseRequest) : null;
  }

  public static async updateStatus(
    id: string, 
    status: 'pending_pharmacist_review' | 'ready_for_pickup' | 'dispensed' | 'cancelled'
  ): Promise<PrescriptionDispenseRequest | null> {
    const doc = await Prescription.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    ).lean();
    return doc ? (doc as unknown as PrescriptionDispenseRequest) : null;
  }
}
