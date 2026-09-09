import { AuditLogEvent } from '../../../shared/types';
import { AuditLog } from '../models/AuditLog';

export class AuditRepository {
  public static async findAll(): Promise<AuditLogEvent[]> {
    const docs = await AuditLog.find().sort({ timestamp: -1 }).lean();
    return docs as unknown as AuditLogEvent[];
  }

  public static async createLog(event: AuditLogEvent): Promise<AuditLogEvent> {
    const doc = await AuditLog.create(event);
    return doc.toObject() as unknown as AuditLogEvent;
  }
}
