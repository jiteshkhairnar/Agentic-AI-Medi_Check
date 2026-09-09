import { Request, Response } from 'express';
import { PharmacistService } from '../services/PharmacistService';
import { updateStockSchema, dispensePrescriptionSchema } from '../validators/schemas';

export class PharmacistController {
  public static async getPrescriptions(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.user?.tenantId || '';
      const results = await PharmacistService.getStorePrescriptions(tenantId);
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validation = updateStockSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({ success: false, error: validation.error.errors[0].message });
        return;
      }

      const result = await PharmacistService.updateInventoryStock(id, validation.data.quantity);
      if (!result) {
        res.status(404).json({ success: false, error: 'Inventory item not found' });
        return;
      }

      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async dispense(req: Request, res: Response): Promise<void> {
    try {
      const validation = dispensePrescriptionSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({ success: false, error: validation.error.errors[0].message });
        return;
      }

      const result = await PharmacistService.dispensePrescription(validation.data.prescriptionId);
      if (!result) {
        res.status(404).json({ success: false, error: 'Prescription not found' });
        return;
      }

      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
