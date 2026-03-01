import dataSource from '@/config/database.config';
import { seedMenu } from './menu.seed';

async function run() {
  await dataSource.initialize();
  console.log('📦 Database connected');

  await seedMenu(dataSource);

  await dataSource.destroy();
  console.log('🌱 Seed finished');
}

run().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
