import dotenv from 'dotenv';

// Load environment variables from the root .env file (CWD is project root)
dotenv.config();

import app from './app';
import { initializeInMemoryStore } from './store/inMemoryStore';
import { loadCsvMedicines } from './services/CsvMedicineService';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // Initialize the Phase 1 Database (In-Memory mock data)
    console.log('Initializing in-memory data store...');
    await initializeInMemoryStore();
    
    // Load the CSV medicine dataset
    console.log('Loading medicine.csv dataset...');
    await loadCsvMedicines();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 [medicine_check] API Server running on http://localhost:${PORT}`);
      console.log(`➡️  Health check: http://localhost:${PORT}/api/v1/health\n`);
    });
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

bootstrap();
