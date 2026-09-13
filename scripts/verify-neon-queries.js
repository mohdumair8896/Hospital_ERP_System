import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function verifyQueries() {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('1. Querying departments from Neon:');
  const depts = await sql`SELECT id, code, name, location FROM departments ORDER BY name ASC;`;
  console.table(depts);

  console.log('\n2. Querying doctors from Neon:');
  const docs = await sql`SELECT id, name, specialty, consultation_fee, rating FROM doctors ORDER BY rating DESC;`;
  console.table(docs);

  console.log('\n3. Querying patients from Neon:');
  const patients = await sql`SELECT id, mrn, first_name, last_name, phone_number FROM patients;`;
  console.table(patients);

  console.log('\n4. Querying audit genesis block from Neon:');
  const audit = await sql`SELECT id, sequence_number, actor_name, action, description FROM audit_records;`;
  console.table(audit);
}

verifyQueries().catch(console.error);
