import { AuditLogEvent } from '../../../src/types';
import { Store } from '../store/inMemoryStore';

export class AuditRepository {
  public static async findAll(): Promise<AuditLogEvent[]> {
    return Array.from(Store.auditLogs.values());
  }

  public static async createLog(event: AuditLogEvent): Promise<AuditLogEvent> {
    // In a real system, we'd calculate SHA hashes here based on previous entries
    Store.auditLogs.set(event.id, event);
    return event;
  }
}
