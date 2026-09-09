import { MedicineRepository } from '../repositories/MedicineRepository';
import { MedicineProduct, MedicineSubstitute } from '../../../src/types';

export class MedicineService {
  /**
   * Search catalog by brand name or generic salt
   */
  public static async searchMedicines(query: string): Promise<MedicineProduct[]> {
    const all = await MedicineRepository.findAll();
    const q = query.toLowerCase();
    
    return all.filter(med => 
      med.brandName.toLowerCase().includes(q) || 
      med.genericSalt.toLowerCase().includes(q)
    );
  }

  /**
   * Retrieve specifically Jan Aushadhi alternatives for a given medicine
   */
  public static async getJanAushadhiSubstitutes(medicineId: string): Promise<MedicineSubstitute[]> {
    const med = await MedicineRepository.findById(medicineId);
    if (!med) return [];

    return med.substitutes.filter(sub => sub.isJanAushadhi);
  }

  /**
   * Identify all medicines currently breaching DPCO statutory caps
   */
  public static async getPriceBreaches(): Promise<MedicineProduct[]> {
    return MedicineRepository.findWithPriceBreach();
  }
}
