import crypto from 'crypto';
import { AuditRepository } from '../repositories/AuditRepository';
import { AuditLogEvent } from '../../../src/types';

export class AuditService {
  /**
   * Logs an action with simulated SHA-256 block hashing
   */
  public static async logAction(
    actorName: string,
    actorEmail: string,
    actorRole: string,
    actionType: AuditLogEvent['actionType'],
    targetEntityId: string,
    targetEntityName: string,
    operationalNotes: string
  ): Promise<AuditLogEvent> {
    const allLogs = await AuditRepository.findAll();
    const lastLog = allLogs.length > 0 ? allLogs[allLogs.length - 1] : null;

    const prevHash = lastLog ? lastLog.shaFull : '00000000000000000000';
    const timestamp = new Date().toISOString();
    
    // Simulate SHA-256 hash logic
    const dataToHash = `${prevHash}-${actorEmail}-${actionType}-${targetEntityId}-${timestamp}`;
    const shaFull = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const shaShort = `${shaFull.substring(0, 4)}...${shaFull.substring(shaFull.length - 3)}`;
    const blockHash = `${shaFull.substring(0, 12)}...${shaFull.substring(shaFull.length - 4)}`;

    const newLog: AuditLogEvent = {
      id: `AUD-${Date.now()}`,
      timestamp,
      dateTag: 'Today',
      actorName,
      actorEmail,
      actorRole,
      actorIp: '127.0.0.1', // Mock
      actorSignatureAlg: 'ECDSA P-256',
      sessionToken: 'mock_session_token',
      actionType,
      targetEntityId,
      targetEntityName,
      targetCategory: 'System Event',
      verificationBadge: 'Anchored & Valid',
      shaShort,
      shaFull,
      prevHash,
      blockHash,
      merkleRoot: 'mock_merkle_root_hash',
      beforeSnapshotJson: '{}',
      afterSnapshotJson: '{}',
      operationalNotes,
      isTamperEvident: true
    };

    return AuditRepository.createLog(newLog);
  }

  /**
   * Fetch complete audit trail
   */
  public static async getAuditTrail(): Promise<AuditLogEvent[]> {
    return AuditRepository.findAll();
  }
}
