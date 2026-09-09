import mongoose, { Schema } from 'mongoose';

const DiscrepancySchema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  medicineId: { type: String, required: true },
  medicineName: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  subCategoryTag: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true },
  brandManufacturer: { type: String, required: true },
  composition: { type: String, required: true },
  reportedPrice: { type: Number, required: true },
  statutoryCapPrice: { type: Number, required: true },
  overchargePercentage: { type: Number, required: true },
  triggerDescription: { type: String, required: true },
  locationContext: { type: String, required: true },
  dailyPatientSearches: { type: Number, required: true },
  assignedTo: { type: String, required: true },
  createdTimeAgo: { type: String, required: true },
  evidenceTelemetry: {
    scansCount: { type: Number, required: true },
    uniquePharmacies: { type: Number, required: true },
    statesAffected: { type: Number, required: true },
    firstDetected: { type: String, required: true },
    lastDetected: { type: String, required: true }
  },
  aiConfidenceScore: { type: Number, required: true },
  recommendedAction: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => { delete ret._id; delete ret.__v; }
  }
});

export const Discrepancy = mongoose.model('Discrepancy', DiscrepancySchema);
