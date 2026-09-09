import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../shared/types';

export interface IUser extends Document {
  id: string; // Ensure id is accessible
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  tenantType: 'medical_store' | 'platform' | 'pharma_company' | 'individual';
  licenseNumber?: string;
  avatar?: string;
  permissions: string[];
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  tenantId: { type: String, required: true },
  tenantName: { type: String, required: true },
  tenantType: { type: String, required: true },
  licenseNumber: { type: String },
  avatar: { type: String },
  permissions: [{ type: String }]
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
