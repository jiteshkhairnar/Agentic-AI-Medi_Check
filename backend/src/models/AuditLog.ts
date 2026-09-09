import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  tenantId: { type: String, required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  details: { type: String, required: true },
  ipAddress: { type: String, required: true },
  cryptographicHash: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => { delete ret._id; delete ret.__v; }
  }
});

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
