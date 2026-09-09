import { z } from 'zod';

// Medicine Queries
export const searchMedicinesSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters long"),
});

// Pharmacist Inventory & Dispensary
export const updateStockSchema = z.object({
  quantity: z.number().int().min(0, "Stock quantity cannot be negative"),
});

export const dispensePrescriptionSchema = z.object({
  prescriptionId: z.string().min(1, "Prescription ID is required"),
  action: z.enum(['dispense', 'cancel', 'ready_for_pickup']),
});

// Admin / Discrepancy
export const triageDiscrepancySchema = z.object({
  action: z.enum(['resolve', 'quarantine', 'investigate']),
  notes: z.string().optional(),
});
