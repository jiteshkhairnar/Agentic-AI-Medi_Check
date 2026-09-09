import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { Store, CsvMedicine } from '../store/inMemoryStore';

/**
 * Normalize a salt composition string for indexing.
 * e.g. "Amoxicillin (500mg) + Clavulanic Acid (125mg)" → "amoxicillin (500mg) + clavulanic acid (125mg)"
 */
function normalizeSalt(salt: string): string {
  return salt.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Parse the product_price field which may have a ₹ symbol or garbled chars.
 * e.g. "₹133.93" or "?133.93" → 133.93
 */
function parsePrice(raw: string): number {
  // Strip everything except digits and dots
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

/**
 * Load medicine.csv into the in-memory store and build the salt index.
 */
export async function loadCsvMedicines(): Promise<void> {
  // Resolve CSV path relative to project root (CWD)
  const csvPath = path.resolve(process.cwd(), 'data', 'medicine.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  CSV file not found at ${csvPath}. Skipping CSV medicine loading.`);
    return;
  }

  return new Promise((resolve, reject) => {
    let count = 0;

    const parser = fs.createReadStream(csvPath, { encoding: 'utf-8' })
      .pipe(parse({
        columns: true,       // use first row as column names
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true
      }));

    parser.on('data', (row: Record<string, string>) => {
      const price = parsePrice(row.product_price || '');
      // Skip rows with no product name or no salt
      if (!row.product_name || !row.salt_composition) return;

      const id = `csv-${count}`;
      count++;

      // Parse side effects
      const sideEffects = row.side_effects
        ? row.side_effects.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Parse drug interactions (JSON string)
      let drugInteractions: any = null;
      try {
        if (row.drug_interactions) {
          drugInteractions = JSON.parse(row.drug_interactions);
        }
      } catch {
        drugInteractions = null;
      }

      const medicine: CsvMedicine = {
        id,
        sub_category: row.sub_category || '',
        product_name: row.product_name,
        salt_composition: row.salt_composition,
        product_price: price,
        product_manufactured: row.product_manufactured || '',
        medicine_desc: row.medicine_desc || '',
        side_effects: sideEffects,
        drug_interactions: drugInteractions
      };

      Store.csvMedicines.set(id, medicine);

      // Build salt index
      const normalizedSalt = normalizeSalt(row.salt_composition);
      if (!Store.saltIndex.has(normalizedSalt)) {
        Store.saltIndex.set(normalizedSalt, new Set<string>());
      }
      Store.saltIndex.get(normalizedSalt)!.add(id);
    });

    parser.on('end', () => {
      console.log(`  - ${Store.csvMedicines.size} CSV medicines loaded`);
      console.log(`  - ${Store.saltIndex.size} unique salt compositions indexed`);
      resolve();
    });

    parser.on('error', (err) => {
      console.error('Error parsing medicine.csv:', err);
      reject(err);
    });
  });
}
