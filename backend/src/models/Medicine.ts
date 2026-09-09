import mongoose, { Schema, Document } from 'mongoose';

const SubstituteSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  brandOrGenericType: { type: String, required: true },
  manufacturer: { type: String, required: true },
  composition: { type: String, required: true },
  strength: { type: String, required: true },
  dosageForm: { type: String, required: true },
  packSize: { type: String, required: true },
  price: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  savingsVsReference: { type: Number, required: true },
  savingsPercentage: { type: Number, required: true },
  matchGrade: { type: String, required: true },
  matchBadgeText: { type: String, required: true },
  regulatoryCert: { type: String, required: true },
  storeAvailability: { type: String, required: true },
  isJanAushadhi: { type: Boolean, required: true },
  distanceInfo: { type: String },
  verifiedTimeAgo: { type: String },
  cautionNotes: { type: String },
  isDirectlyInterchangeable: { type: Boolean, required: true }
}, { _id: false });

const MedicineSchema = new Schema({
  id: { type: String, required: true, unique: true }, // We keep string ID for simplicity mapped to original mockData IDs
  brandName: { type: String, required: true },
  genericSalt: { type: String, required: true },
  compositionDetails: { type: String, required: true },
  manufacturer: { type: String, required: true },
  dosageForm: { type: String, required: true },
  packSize: { type: String, required: true },
  scheduleCategory: { type: String, required: true },
  dpcoStatutoryCap: { type: Number, required: true },
  currentChemistMRP: { type: Number, required: true },
  hasPriceBreach: { type: Boolean, required: true },
  excessMarginPercentage: { type: Number, required: true },
  excessMarkupAmount: { type: Number, required: true },
  referenceCode: { type: String, required: true },
  isDiscontinued: { type: Boolean },
  searchesPerDay: { type: Number, required: true },
  substitutes: [SubstituteSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: (_: any, ret: any) => {
      // Return custom id instead of _id if needed, but we explicitly store id
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const Medicine = mongoose.model('Medicine', MedicineSchema);
