import { Request, Response } from 'express';
import { MedicineService } from '../services/MedicineService';
import { searchMedicinesSchema } from '../validators/schemas';

export class MedicineController {
  public static async search(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        const all = await MedicineService.searchMedicines('');
        res.json({ success: true, data: all });
        return;
      }
      
      const validation = searchMedicinesSchema.safeParse({ query });
      if (!validation.success) {
        res.status(400).json({ success: false, error: validation.error.errors[0].message });
        return;
      }

      const results = await MedicineService.searchMedicines(query);
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async getJanAushadhi(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const results = await MedicineService.getJanAushadhiSubstitutes(id);
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async getBreaches(req: Request, res: Response): Promise<void> {
    try {
      const results = await MedicineService.getPriceBreaches();
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
