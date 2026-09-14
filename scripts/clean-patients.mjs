import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

dotenv.config({ path: path.resolve('packages/database/.env') });
dotenv.config({ path: path.resolve('.env') });

const neonUrl = process.env.DATABASE_URL;

const realisticPatients = [
  {
    id: 'pat_1',
    mrn: 'MRN-2026-00412',
    firstName: 'Paulo',
    lastName: 'Hubert',
    dateOfBirth: '1985-04-11',
    gender: 'MALE',
    bloodGroup: 'O+',
    phoneNumber: '+1 (555) 234-5678',
    email: 'paulo.hubert@example.com',
    street: '458 Lexington Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10017',
    emergencyContactName: 'Clara Hubert',
    emergencyContactPhone: '+1 (555) 234-9988',
    emergencyContactRelation: 'Spouse',
    allergies: ['Penicillin'],
    activeMedications: ['Amlodipine Besylate 5mg', 'Atorvastatin 20mg'],
    insuranceProvider: 'Blue Cross Blue Shield',
    insurancePolicyNumber: 'BCBS-NY-994123'
  },
  {
    id: 'pat_2',
    mrn: 'MRN-2026-00413',
    firstName: 'Elena',
    lastName: 'Rostova',
    dateOfBirth: '1991-08-24',
    gender: 'FEMALE',
    bloodGroup: 'A-',
    phoneNumber: '+1 (555) 872-9102',
    email: 'elena.rostova@example.com',
    street: '742 Park Avenue',
    city: 'Boston',
    state: 'MA',
    postalCode: '02108',
    emergencyContactName: 'Mikhail Rostov',
    emergencyContactPhone: '+1 (555) 872-4411',
    emergencyContactRelation: 'Brother',
    allergies: ['Sulfa drugs', 'Latex'],
    activeMedications: ['Levothyroxine 50mcg'],
    insuranceProvider: 'Aetna Premier Care',
    insurancePolicyNumber: 'AET-MA-884102'
  },
  {
    id: 'pat_3',
    mrn: 'MRN-2026-00414',
    firstName: 'Marcus',
    lastName: 'Chen',
    dateOfBirth: '1976-03-15',
    gender: 'MALE',
    bloodGroup: 'B+',
    phoneNumber: '+1 (555) 431-8890',
    email: 'marcus.chen@example.com',
    street: '1280 California St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94109',
    emergencyContactName: 'Grace Chen',
    emergencyContactPhone: '+1 (555) 431-9922',
    emergencyContactRelation: 'Spouse',
    allergies: [],
    activeMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    insuranceProvider: 'Kaiser Permanente',
    insurancePolicyNumber: 'KP-CA-339104'
  },
  {
    id: 'pat_4',
    mrn: 'MRN-2026-00415',
    firstName: 'Amara',
    lastName: 'Okafor',
    dateOfBirth: '1998-11-03',
    gender: 'FEMALE',
    bloodGroup: 'O-',
    phoneNumber: '+1 (555) 672-3341',
    email: 'amara.okafor@example.com',
    street: '340 Peachtree St NE',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30308',
    emergencyContactName: 'Chidi Okafor',
    emergencyContactPhone: '+1 (555) 672-0012',
    emergencyContactRelation: 'Father',
    allergies: ['Aspirin', 'Ibuprofen'],
    activeMedications: ['Albuterol Inhaler'],
    insuranceProvider: 'UnitedHealthcare Choice',
    insurancePolicyNumber: 'UHC-GA-771209'
  },
  {
    id: 'pat_5',
    mrn: 'MRN-2026-00416',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    dateOfBirth: '1982-06-29',
    gender: 'FEMALE',
    bloodGroup: 'AB+',
    phoneNumber: '+1 (555) 912-7744',
    email: 'sophia.rodriguez@example.com',
    street: '905 Brickell Ave',
    city: 'Miami',
    state: 'FL',
    postalCode: '33131',
    emergencyContactName: 'Carlos Rodriguez',
    emergencyContactPhone: '+1 (555) 912-5500',
    emergencyContactRelation: 'Spouse',
    allergies: ['Cephalosporins'],
    activeMedications: ['Omeprazole 20mg'],
    insuranceProvider: 'Cigna Global Health',
    insurancePolicyNumber: 'CIG-FL-550921'
  },
  {
    id: 'pat_6',
    mrn: 'MRN-2026-00417',
    firstName: 'David',
    lastName: 'Kowalski',
    dateOfBirth: '1968-12-19',
    gender: 'MALE',
    bloodGroup: 'A+',
    phoneNumber: '+1 (555) 388-1920',
    email: 'david.kowalski@example.com',
    street: '612 Michigan Ave',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60611',
    emergencyContactName: 'Anna Kowalski',
    emergencyContactPhone: '+1 (555) 388-9911',
    emergencyContactRelation: 'Daughter',
    allergies: ['Codeine'],
    activeMedications: ['Warfarin 2.5mg', 'Metoprolol 25mg'],
    insuranceProvider: 'Humana Medicare Advantage',
    insurancePolicyNumber: 'HUM-IL-119283'
  }
];

async function run() {
  console.log('--- Cleaning and Reseeding Patients in Neon & Local SQLite ---');

  // 1. Neon Database
  if (neonUrl) {
    console.log('Connecting to Neon PostgreSQL...');
    const sql = neon(neonUrl);
    // Delete duplicate generated patients
    await sql`DELETE FROM patients;`;
    console.log('Purged existing duplicate patients in Neon.');

    for (const p of realisticPatients) {
      await sql`
        INSERT INTO patients (
          id, mrn, first_name, last_name, date_of_birth, gender, blood_group,
          phone_number, email, address, emergency_contact,
          allergies, active_medications, insurance_provider,
          insurance_policy_number, consent_given, created_at, updated_at
        ) VALUES (
          ${p.id}, ${p.mrn}, ${p.firstName}, ${p.lastName}, ${p.dateOfBirth}, ${p.gender}, ${p.bloodGroup},
          ${p.phoneNumber}, ${p.email}, ${JSON.stringify({ street: p.street, city: p.city, state: p.state, postalCode: p.postalCode, country: 'USA' })},
          ${JSON.stringify({ name: p.emergencyContactName, phone: p.emergencyContactPhone, relationship: p.emergencyContactRelation })},
          ${JSON.stringify(p.allergies)}, ${JSON.stringify(p.activeMedications)}, ${p.insuranceProvider},
          ${p.insurancePolicyNumber}, TRUE, NOW(), NOW()
        );
      `;
    }
    console.log(`Successfully seeded ${realisticPatients.length} diverse, unique patients in Neon!`);
  }

  // 2. Local SQLite databases
  const sqlitePaths = [
    path.resolve('apps/patient-service/patient.db'),
    path.resolve('patient.db')
  ];

  for (const dbPath of sqlitePaths) {
    if (!fs.existsSync(dbPath)) continue;
    try {
      const db = new DatabaseSync(dbPath);
      db.exec(`DELETE FROM patients;`);
      const stmt = db.prepare(`
        INSERT INTO patients (
          id, mrn, first_name, last_name, date_of_birth, gender, blood_group,
          phone_number, email, address_json, emergency_contact_json,
          allergies_json, active_medications_json, insurance_provider,
          insurance_policy_number, consent_given, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, datetime('now'), datetime('now')
        )
      `);

      for (const p of realisticPatients) {
        stmt.run(
          p.id, p.mrn, p.firstName, p.lastName, p.dateOfBirth, p.gender, p.bloodGroup,
          p.phoneNumber, p.email,
          JSON.stringify({ street: p.street, city: p.city, state: p.state, postalCode: p.postalCode, country: 'USA' }),
          JSON.stringify({ name: p.emergencyContactName, phone: p.emergencyContactPhone, relationship: p.emergencyContactRelation }),
          JSON.stringify(p.allergies),
          JSON.stringify(p.activeMedications),
          p.insuranceProvider,
          p.insurancePolicyNumber,
          1
        );
      }
      console.log(`Seeded SQLite at: ${dbPath}`);
    } catch (e) {
      console.log(`Note on ${dbPath}:`, e.message);
    }
  }

  console.log('Patient deduplication and reseeding COMPLETE.');
}

run().catch(console.error);
