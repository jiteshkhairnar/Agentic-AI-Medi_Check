import { MedicineProduct } from '../../../shared/types';
import { Medicine } from '../models/Medicine';

export class MedicineRepository {
  public static async findAll(): Promise<MedicineProduct[]> {
    const docs = await Medicine.find().lean();
    return docs as unknown as MedicineProduct[];
  }

  public static async findById(id: string): Promise<MedicineProduct | null> {
    const doc = await Medicine.findOne({ id }).lean();
    return doc ? (doc as unknown as MedicineProduct) : null;
  }

  public static async findBySalt(salt: string): Promise<MedicineProduct[]> {
    const docs = await Medicine.find({ genericSalt: { $regex: salt, $options: 'i' } }).lean();
    return docs as unknown as MedicineProduct[];
  }

  public static async findWithPriceBreach(): Promise<MedicineProduct[]> {
    const docs = await Medicine.find({ hasPriceBreach: true }).lean();
    return docs as unknown as MedicineProduct[];
  }
}
