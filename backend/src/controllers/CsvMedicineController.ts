import { Request, Response } from 'express';
import { Store, CsvMedicine } from '../store/inMemoryStore';

/**
 * Normalize a salt composition string for index lookup.
 */
function normalizeSalt(salt: string): string {
  return salt.trim().toLowerCase().replace(/\s+/g, ' ');
}

export class CsvMedicineController {
  /**
   * GET /api/v1/csv-medicines/search?query=Augmentin&limit=50
   * Full-text search across product_name and salt_composition.
   */
  public static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = ((req.query.query as string) || '').toLowerCase().trim();
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);

      if (!query) {
        // Return first N medicines as a sample
        const sample = Array.from(Store.csvMedicines.values()).slice(0, limit);
        res.json({ success: true, data: sample, total: Store.csvMedicines.size });
        return;
      }

      const results: CsvMedicine[] = [];
      for (const med of Store.csvMedicines.values()) {
        if (
          med.product_name.toLowerCase().includes(query) ||
          med.salt_composition.toLowerCase().includes(query) ||
          med.sub_category.toLowerCase().includes(query)
        ) {
          results.push(med);
          if (results.length >= limit) break;
        }
      }

      res.json({ success: true, data: results, total: results.length });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/v1/csv-medicines/:id
   * Get a single medicine by its CSV id.
   */
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const med = Store.csvMedicines.get(id);
      if (!med) {
        res.status(404).json({ success: false, error: 'Medicine not found' });
        return;
      }
      res.json({ success: true, data: med });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/v1/csv-medicines/:id/generics
   * Given a medicine, return all other medicines with the same salt composition
   * (the generic alternatives), sorted by price ascending.
   */
  public static async getGenerics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const med = Store.csvMedicines.get(id);
      if (!med) {
        res.status(404).json({ success: false, error: 'Medicine not found' });
        return;
      }

      const normalizedSalt = normalizeSalt(med.salt_composition);
      const sameIdSet = Store.saltIndex.get(normalizedSalt);

      if (!sameIdSet || sameIdSet.size <= 1) {
        res.json({
          success: true,
          data: {
            reference: med,
            generics: [],
            salt_composition: med.salt_composition,
            total_generics: 0,
            savings: null
          }
        });
        return;
      }

      // Get all medicines with the same salt, excluding the reference
      const generics: CsvMedicine[] = [];
      for (const genId of sameIdSet) {
        if (genId === id) continue;
        const generic = Store.csvMedicines.get(genId);
        if (generic && generic.product_price > 0) {
          generics.push(generic);
        }
      }

      // Sort by price ascending (cheapest first)
      generics.sort((a, b) => a.product_price - b.product_price);

      // Calculate savings
      const cheapest = generics.length > 0 ? generics[0] : null;
      const savings = cheapest && med.product_price > 0
        ? {
            cheapest_name: cheapest.product_name,
            cheapest_price: cheapest.product_price,
            reference_price: med.product_price,
            amount_saved: parseFloat((med.product_price - cheapest.product_price).toFixed(2)),
            percentage_saved: parseFloat(
              (((med.product_price - cheapest.product_price) / med.product_price) * 100).toFixed(1)
            )
          }
        : null;

      res.json({
        success: true,
        data: {
          reference: med,
          generics: generics.slice(0, 100), // cap at 100 generics
          salt_composition: med.salt_composition,
          total_generics: generics.length,
          savings
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/v1/csv-medicines/salt-search?salt=Amoxicillin
   * Search by salt/active ingredient and return all matching medicines grouped.
   */
  public static async searchBySalt(req: Request, res: Response): Promise<void> {
    try {
      const query = ((req.query.salt as string) || '').toLowerCase().trim();
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);

      if (!query) {
        res.status(400).json({ success: false, error: 'salt query parameter is required' });
        return;
      }

      const results: CsvMedicine[] = [];
      for (const med of Store.csvMedicines.values()) {
        if (med.salt_composition.toLowerCase().includes(query)) {
          results.push(med);
          if (results.length >= limit) break;
        }
      }

      // Sort by price ascending
      results.sort((a, b) => a.product_price - b.product_price);

      res.json({ success: true, data: results, total: results.length });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
