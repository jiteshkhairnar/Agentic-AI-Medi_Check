import mongoose, { Schema } from 'mongoose';

const PrescriptionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorRegNo: { type: String, required: true },
  prescribedMedicines: [{
    medicineId: { type: String },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  prescriptionImageUrl: { type: String },
  dispensedByUserId: { type: String },
  totalAmount: { type: Number }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => { delete ret._id; delete ret.__v; }
  }
});

export const Prescription = mongoose.model('Prescription', PrescriptionSchema);
