import { DiscrepancyRepository } from '../repositories/DiscrepancyRepository';
import { DiscrepancyTicket, AuthUser } from '../../../shared/types';
import { User } from '../models/User';

export class AdminService {
  /**
   * Triage a discrepancy ticket by updating its status
   */
  public static async triageDiscrepancy(
    ticketId: string, 
    action: 'resolve' | 'quarantine' | 'investigate'
  ): Promise<DiscrepancyTicket | null> {
    const ticket = await DiscrepancyRepository.findById(ticketId);
    if (!ticket) return null;

    let newStatus = ticket.status;
    if (action === 'resolve') {
      newStatus = 'resolved';
    } else if (action === 'quarantine') {
      newStatus = 'quarantine_active';
    } else if (action === 'investigate') {
      newStatus = 'active_investigating';
    }

    return DiscrepancyRepository.update(ticketId, { status: newStatus });
  }

  /**
   * Get all users registered on the platform
   */
  public static async getPlatformUsers(): Promise<AuthUser[]> {
    const docs = await User.find().lean();
    // Re-map the `_id` back to `id` explicitly if needed
    return docs.map(doc => {
      const user = { ...doc, id: doc.id || (doc as any)._id.toString() };
      delete (user as any)._id;
      return user;
    }) as unknown as AuthUser[];
  }

  /**
   * Get all discrepancies filtered optionally by status
   */
  public static async getDiscrepancies(status?: DiscrepancyTicket['status']): Promise<DiscrepancyTicket[]> {
    if (status) {
      return DiscrepancyRepository.findByStatus(status);
    }
    return DiscrepancyRepository.findAll();
  }
}
