import { StoreInventoryItem } from '../../../shared/types';
import { Inventory } from '../models/Inventory';

export class InventoryRepository {
  public static async findAll(): Promise<StoreInventoryItem[]> {
    const docs = await Inventory.find().lean();
    return docs as unknown as StoreInventoryItem[];
  }

  public static async findById(id: string): Promise<StoreInventoryItem | null> {
    const doc = await Inventory.findOne({ id }).lean();
    return doc ? (doc as unknown as StoreInventoryItem) : null;
  }

  public static async findByTenantId(tenantId: string): Promise<StoreInventoryItem[]> {
    // Return all to simulate current behavior, or optionally filter:
    const docs = await Inventory.find({ tenantId }).lean();
    return docs as unknown as StoreInventoryItem[];
  }

  public static async updateStock(id: string, quantity: number): Promise<StoreInventoryItem | null> {
    const doc = await Inventory.findOneAndUpdate(
      { id },
      { 
        $set: { 
          stockQuantity: quantity, 
          inStock: quantity > 0, 
          lastUpdated: new Date().toISOString() 
        } 
      },
      { new: true }
    ).lean();
    return doc ? (doc as unknown as StoreInventoryItem) : null;
  }
}
