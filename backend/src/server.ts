import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { seedDatabase } from './store/seed';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Seed initial mock data if database is empty
    await seedDatabase();
    
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
