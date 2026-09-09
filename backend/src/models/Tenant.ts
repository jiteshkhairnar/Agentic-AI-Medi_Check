import mongoose, { Schema } from 'mongoose';

const TenantSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  userCount: { type: Number, required: true },
  licenseNumber: { type: String },
  region: { type: String }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => { delete ret._id; delete ret.__v; }
  }
});

export const Tenant = mongoose.model('Tenant', TenantSchema);
