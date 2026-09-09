import { InventoryRepository } from '../repositories/InventoryRepository';
import { PrescriptionRepository } from '../repositories/PrescriptionRepository';
import { StoreInventoryItem, PrescriptionDispenseRequest } from '../../../src/types';

export class PharmacistService {
  /**
   * Update physical stock count for an inventory item
   */
  public static async updateInventoryStock(itemId: string, newQuantity: number): Promise<StoreInventoryItem | null> {
    return InventoryRepository.updateStock(itemId, newQuantity);
  }

  /**
   * Process a prescription to dispense medicines
   */
  public static async dispensePrescription(prescriptionId: string): Promise<PrescriptionDispenseRequest | null> {
    // In a real app, this would also deduct stock from inventory
    return PrescriptionRepository.updateStatus(prescriptionId, 'dispensed');
  }

  /**
   * Get all prescriptions assigned to the current pharmacist's store/tenant
   */
  public static async getStorePrescriptions(tenantId: string): Promise<PrescriptionDispenseRequest[]> {
    // Mock: just returns all
    return PrescriptionRepository.findAll();
  }
}
