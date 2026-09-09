import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { triageDiscrepancySchema } from '../validators/schemas';

export class AdminController {
  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const results = await AdminService.getPlatformUsers();
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async getDiscrepancies(req: Request, res: Response): Promise<void> {
    try {
      // type cast from query string
      const status = req.query.status as any;
      const results = await AdminService.getDiscrepancies(status);
      res.json({ success: true, data: results });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  public static async triage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validation = triageDiscrepancySchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({ success: false, error: validation.error.issues[0].message });
        return;
      }

      const result = await AdminService.triageDiscrepancy(id, validation.data.action);
      if (!result) {
        res.status(404).json({ success: false, error: 'Ticket not found' });
        return;
      }

      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
