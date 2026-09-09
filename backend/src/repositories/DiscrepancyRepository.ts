import { DiscrepancyTicket } from '../../../shared/types';
import { Discrepancy } from '../models/Discrepancy';

export class DiscrepancyRepository {
  public static async findAll(): Promise<DiscrepancyTicket[]> {
    const docs = await Discrepancy.find().lean();
    return docs as unknown as DiscrepancyTicket[];
  }

  public static async findById(id: string): Promise<DiscrepancyTicket | null> {
    const doc = await Discrepancy.findOne({ ticketId: id }).lean();
    // Fallback if the id was queried against id instead of ticketId, although ticketId is the main identifier.
    if (!doc) {
      const docAlt = await Discrepancy.findOne({ id }).lean();
      return docAlt ? (docAlt as unknown as DiscrepancyTicket) : null;
    }
    return doc ? (doc as unknown as DiscrepancyTicket) : null;
  }

  public static async update(id: string, updateData: Partial<DiscrepancyTicket>): Promise<DiscrepancyTicket | null> {
    const doc = await Discrepancy.findOneAndUpdate(
      { ticketId: id },
      { $set: updateData },
      { new: true }
    ).lean();
    return doc ? (doc as unknown as DiscrepancyTicket) : null;
  }

  public static async findByStatus(status: DiscrepancyTicket['status']): Promise<DiscrepancyTicket[]> {
    const docs = await Discrepancy.find({ status }).lean();
    return docs as unknown as DiscrepancyTicket[];
  }
}
