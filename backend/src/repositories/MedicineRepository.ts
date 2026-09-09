import { MedicineProduct } from '../../../shared/types';
import { Store } from '../store/inMemoryStore';

export class MedicineRepository {
  public static async findAll(): Promise<MedicineProduct[]> {
    return Array.from(Store.medicines.values());
  }

  public static async findById(id: string): Promise<MedicineProduct | null> {
    return Store.medicines.get(id) || null;
  }

  public static async findBySalt(salt: string): Promise<MedicineProduct[]> {
    const all = await this.findAll();
    return all.filter(m => m.genericSalt.toLowerCase().includes(salt.toLowerCase()));
  }

  public static async findWithPriceBreach(): Promise<MedicineProduct[]> {
    const all = await this.findAll();
    return all.filter(m => m.hasPriceBreach);
  }
}
