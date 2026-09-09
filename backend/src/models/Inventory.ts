import mongoose, { Schema } from 'mongoose';

const InventorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  medicineId: { type: String, required: true },
  name: { type: String, required: true },
  batchNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  mrp: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  supplier: { type: String, required: true },
  lastRestocked: { type: String, required: true },
  isLowStock: { type: Boolean, required: true },
  isExpired: { type: Boolean, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => { delete ret._id; delete ret.__v; }
  }
});

export const Inventory = mongoose.model('Inventory', InventorySchema);
