import { StoreInventoryItem } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

export class InventoryRepository {
  public static async findAll(): Promise<StoreInventoryItem[]> {
    return Array.from(Store.inventories.values());
  }

  public static async findById(id: string): Promise<StoreInventoryItem | null> {
    return Store.inventories.get(id) || null;
  }

  // In our mock, inventories aren't strictly tied to tenant IDs in the model,
  // but in a real DB they would be. We'll return all for now to simulate.
  public static async findByTenantId(tenantId: string): Promise<StoreInventoryItem[]> {
    return this.findAll();
  }

  public static async updateStock(id: string, quantity: number): Promise<StoreInventoryItem | null> {
    const item = Store.inventories.get(id);
    if (!item) return null;

    item.stockQuantity = quantity;
    item.inStock = quantity > 0;
    item.lastUpdated = 'Just now';
    Store.inventories.set(id, item);
    return item;
  }
}
