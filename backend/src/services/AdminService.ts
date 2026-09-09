import { DiscrepancyRepository } from '../repositories/DiscrepancyRepository';
import { DiscrepancyTicket, AuthUser } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

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

    if (action === 'resolve') {
      ticket.status = 'resolved';
    } else if (action === 'quarantine') {
      ticket.status = 'quarantine_active';
    } else if (action === 'investigate') {
      ticket.status = 'active_investigating';
    }

    // Since we didn't add a dedicated updateStatus to DiscrepancyRepository, 
    // we just modify the reference. InMemoryStore is updated automatically because of object reference.
    return ticket;
  }

  /**
   * Get all users registered on the platform
   */
  public static async getPlatformUsers(): Promise<AuthUser[]> {
    return Array.from(Store.users.values());
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
