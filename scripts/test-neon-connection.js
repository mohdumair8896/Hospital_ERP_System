import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment or .env');
  process.exit(1);
}

async function testConnection() {
  console.log('Connecting to Neon PostgreSQL database...');
  const sql = neon(connectionString);
  const result = await sql`SELECT version(), current_database(), current_user;`;
  console.log('✅ Successfully connected to Neon:');
  console.log(result);

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log('Existing tables in public schema:', tables.map(t => t.table_name));
}

testConnection().catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});
