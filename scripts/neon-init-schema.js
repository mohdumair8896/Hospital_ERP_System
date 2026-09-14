import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment or .env');
  process.exit(1);
}

async function initNeonSchema() {
  console.log('====================================================');
  console.log('🐘 Initializing Neon PostgreSQL Schema & Infrastructure');
  console.log('====================================================\n');

  const sql = neon(connectionString);

  console.log('1. Creating tables...');

  // 1. Departments Table
  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      id VARCHAR(64) PRIMARY KEY,
      code VARCHAR(32) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255) NOT NULL,
      emergency_support BOOLEAN NOT NULL DEFAULT false,
      icon VARCHAR(64) NOT NULL
    );
  `;
  console.log('  ✓ departments table ready');

  // 2. Doctors Table
  await sql`
    CREATE TABLE IF NOT EXISTS doctors (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      specialty VARCHAR(255) NOT NULL,
      department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
      qualification VARCHAR(255) NOT NULL,
      experience_years INTEGER NOT NULL DEFAULT 0,
      rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
      review_count INTEGER NOT NULL DEFAULT 0,
      consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 100.0,
      available_days JSONB NOT NULL DEFAULT '[]'::jsonb,
      available_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
      avatar_url TEXT NOT NULL,
      bio TEXT NOT NULL,
      phone VARCHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id);`;
  console.log('  ✓ doctors table ready');

  // 3. Appointments Table
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(64) PRIMARY KEY,
      appointment_number VARCHAR(64) UNIQUE NOT NULL,
      patient_id VARCHAR(64) NOT NULL,
      patient_name VARCHAR(255) NOT NULL,
      patient_phone VARCHAR(64) NOT NULL,
      patient_email VARCHAR(255) NOT NULL,
      doctor_id VARCHAR(64) NOT NULL,
      doctor_name VARCHAR(255) NOT NULL,
      department_id VARCHAR(64) NOT NULL,
      department_name VARCHAR(255) NOT NULL,
      slot_date DATE NOT NULL,
      slot_time VARCHAR(32) NOT NULL,
      type VARCHAR(64) NOT NULL DEFAULT 'OPD_IN_PERSON',
      status VARCHAR(64) NOT NULL DEFAULT 'CONFIRMED',
      symptoms TEXT NOT NULL,
      consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 150.0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(slot_date);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);`;
  console.log('  ✓ appointments table ready');

  // 4. Patients Table
  await sql`
    CREATE TABLE IF NOT EXISTS patients (
      id VARCHAR(64) PRIMARY KEY,
      mrn VARCHAR(64) UNIQUE NOT NULL,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      date_of_birth DATE NOT NULL,
      gender VARCHAR(32) NOT NULL,
      blood_group VARCHAR(16) NOT NULL,
      phone_number VARCHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address JSONB NOT NULL DEFAULT '{}'::jsonb,
      emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
      allergies JSONB NOT NULL DEFAULT '[]'::jsonb,
      active_medications JSONB NOT NULL DEFAULT '[]'::jsonb,
      insurance_provider VARCHAR(255),
      insurance_policy_number VARCHAR(128),
      consent_given BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone_number);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);`;
  console.log('  ✓ patients table ready');

  // 5. Clinical Encounters Table
  await sql`
    CREATE TABLE IF NOT EXISTS clinical_encounters (
      id VARCHAR(64) PRIMARY KEY,
      encounter_number VARCHAR(64) UNIQUE NOT NULL,
      appointment_id VARCHAR(64),
      patient_id VARCHAR(64) NOT NULL,
      doctor_id VARCHAR(64) NOT NULL,
      doctor_name VARCHAR(255) NOT NULL,
      type VARCHAR(32) NOT NULL DEFAULT 'OPD',
      chief_complaint TEXT NOT NULL,
      vitals JSONB NOT NULL DEFAULT '{}'::jsonb,
      primary_diagnosis_code VARCHAR(32) NOT NULL,
      primary_diagnosis_name VARCHAR(255) NOT NULL,
      secondary_diagnoses JSONB NOT NULL DEFAULT '[]'::jsonb,
      clinical_notes TEXT NOT NULL,
      prescriptions JSONB NOT NULL DEFAULT '[]'::jsonb,
      lab_orders JSONB NOT NULL DEFAULT '[]'::jsonb,
      status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      finalized_at TIMESTAMPTZ
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_encounters_patient ON clinical_encounters(patient_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_encounters_doctor ON clinical_encounters(doctor_id);`;
  console.log('  ✓ clinical_encounters table ready');

  // 6. Users Table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      username VARCHAR(64) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(64) NOT NULL,
      department_id VARCHAR(64),
      doctor_id VARCHAR(64),
      patient_id VARCHAR(64),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  console.log('  ✓ users table ready');

  // 7. Audit Records Table (Cryptographic Chain)
  await sql`
    CREATE TABLE IF NOT EXISTS audit_records (
      id VARCHAR(64) PRIMARY KEY,
      sequence_number BIGINT UNIQUE NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      trace_id VARCHAR(128) NOT NULL,
      actor_id VARCHAR(64) NOT NULL,
      actor_name VARCHAR(255) NOT NULL,
      actor_role VARCHAR(64) NOT NULL,
      client_ip VARCHAR(64) NOT NULL,
      user_agent TEXT NOT NULL,
      action VARCHAR(64) NOT NULL,
      resource_type VARCHAR(64) NOT NULL,
      resource_id VARCHAR(128) NOT NULL,
      description TEXT NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      http_method VARCHAR(16) NOT NULL,
      status_code INTEGER NOT NULL,
      execution_time_ms INTEGER NOT NULL,
      clinical_reason TEXT,
      diff_json TEXT,
      prev_record_hash VARCHAR(64) NOT NULL,
      record_hash VARCHAR(64) NOT NULL
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_records(timestamp);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_records(actor_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_records(resource_type, resource_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_records(action);`;
  console.log('  ✓ audit_records table ready');

  console.log('\n2. Seeding production clinical data into Neon PostgreSQL...');

  // Seed Departments
  const deptCount = await sql`SELECT count(*)::int as cnt FROM departments;`;
  if (deptCount[0].cnt === 0) {
    await sql`
      INSERT INTO departments (id, code, name, description, location, emergency_support, icon) VALUES
      ('dept_emg', 'EMERGENCY', 'Emergency & Trauma Department', '24/7 acute emergency medical and surgical triage care with Level 1 trauma facilities.', 'Building A, Ground Floor', true, 'Activity'),
      ('dept_card', 'CARDIOLOGY', 'Cardiology & Heart Center', 'Comprehensive diagnostic, interventional, and electrophysiology cardiac care.', 'Building B, 3rd Floor', true, 'Heart'),
      ('dept_neuro', 'NEUROLOGY', 'Neurology & Brain Institute', 'Comprehensive neurological care, stroke intervention, and spine surgery.', 'Building B, 4th Floor', true, 'Brain'),
      ('dept_ped', 'PEDIATRICS', 'Pediatrics & Neonatology', 'Compassionate inpatient, outpatient, and neonatal intensive care for infants and adolescents.', 'Building C, 2nd Floor', true, 'Baby'),
      ('dept_ortho', 'ORTHOPEDICS', 'Orthopedic Surgery & Joint Center', 'Advanced joint replacement, arthroscopic surgery, and sports medicine rehabilitation.', 'Building A, 2nd Floor', false, 'Bone'),
      ('dept_oncol', 'ONCOLOGY', 'Comprehensive Cancer Center', 'Medical, surgical, and radiation oncology with precision genomic therapies.', 'Building C, 4th Floor', false, 'Shield');
    `;
    console.log('  ✓ Seeded 6 departments');
  }

  // Seed Doctors
  const docCount = await sql`SELECT count(*)::int as cnt FROM doctors;`;
  if (docCount[0].cnt === 0) {
    await sql`
      INSERT INTO doctors (id, name, title, specialty, department_id, qualification, experience_years, rating, review_count, consultation_fee, available_days, available_slots, avatar_url, bio, phone, email) VALUES
      ('doc_sarah', 'Dr. Sarah Patel', 'Dr. Sarah Patel, MD, FACC', 'Cardiologist', 'dept_card', 'MD (Harvard), Fellowship Interventional Cardiology', 16, 4.96, 248, 150.0, 
       '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]'::jsonb, '["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"]'::jsonb,
       'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
       'World-renowned interventional cardiologist specializing in coronary artery disease and non-invasive valve repair.',
       '+1 (555) 123-4567', 'sarah.patel@hospital.com'),
      ('doc_elena', 'Dr. Elena Rostova', 'Dr. Elena Rostova, MD, PhD', 'Neurologist', 'dept_neuro', 'MD, PhD (Johns Hopkins), Vascular Neurology Fellowship', 14, 4.94, 186, 180.0,
       '["Tuesday", "Wednesday", "Thursday", "Friday"]'::jsonb, '["09:00 AM", "11:30 AM", "01:30 PM", "04:00 PM"]'::jsonb,
       'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=400',
       'Director of Stroke Care & Comprehensive Neurovascular Therapeutics.',
       '+1 (555) 345-6789', 'elena.rostova@hospital.com'),
      ('doc_michael', 'Dr. Michael Chang', 'Dr. Michael Chang, MD, FAAP', 'Pediatric Specialist', 'dept_ped', 'MD (Stanford), Board Certified Pediatrician', 12, 4.92, 194, 120.0,
       '["Monday", "Wednesday", "Friday", "Saturday"]'::jsonb, '["09:30 AM", "11:00 AM", "03:00 PM"]'::jsonb,
       'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
       'Whole-child pediatric specialist dedicated to compassionate care from infancy to adolescence.',
       '+1 (555) 234-5678', 'michael.chang@hospital.com'),
      ('doc_marcus', 'Dr. Marcus Thorne', 'Dr. Marcus Thorne, MD, FAAOS', 'Orthopedic Surgeon', 'dept_ortho', 'MD (Columbia), Fellowship Adult Reconstruction', 18, 4.91, 312, 195.0,
       '["Monday", "Tuesday", "Thursday"]'::jsonb, '["08:30 AM", "10:00 AM", "02:30 PM"]'::jsonb,
       'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
       'Pioneer in robotic-assisted total hip and knee arthroplasty with rapid recovery protocols.',
       '+1 (555) 456-7890', 'marcus.thorne@hospital.com'),
      ('doc_priya', 'Dr. Priya Nair', 'Dr. Priya Nair, MD, FACP', 'Oncologist', 'dept_oncol', 'MD (UCSF), Hematology & Medical Oncology Fellowship', 15, 4.97, 215, 200.0,
       '["Monday", "Wednesday", "Thursday", "Friday"]'::jsonb, '["09:00 AM", "11:00 AM", "02:00 PM"]'::jsonb,
       'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=400',
       'Leader in targeted immunotherapy and precision genomic medicine for solid tumor oncology.',
       '+1 (555) 567-8901', 'priya.nair@hospital.com'),
      ('doc_james', 'Dr. James Wilson', 'Dr. James Wilson, MD, FACEP', 'Emergency Medicine Physician', 'dept_emg', 'MD (Penn), Emergency Medicine Residency Chief', 11, 4.89, 420, 160.0,
       '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]'::jsonb, '["24 Hours On-Call"]'::jsonb,
       'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
       'Emergency Trauma Director leading critical resuscitations and rapid medical decision-making.',
       '+1 (555) 678-9012', 'james.wilson@hospital.com');
    `;
    console.log('  ✓ Seeded 6 doctors');
  }

  // Seed Patients
  const patCount = await sql`SELECT count(*)::int as cnt FROM patients;`;
  if (patCount[0].cnt === 0) {
    await sql`
      INSERT INTO patients (id, mrn, first_name, last_name, date_of_birth, gender, blood_group, phone_number, email, address, emergency_contact, allergies, active_medications, insurance_provider, insurance_policy_number, consent_given) VALUES
      ('pat_1', 'MRN-2026-00412', 'Paulo', 'Hubert', '1985-04-12', 'MALE', 'O+', '+1 (555) 234-5678', 'paulo.hubert@example.com',
       '{"street": "458 Lexington Ave", "city": "New York", "state": "NY", "postalCode": "10017", "country": "USA"}'::jsonb,
       '{"name": "Clara Hubert", "relationship": "Spouse", "phone": "+1 (555) 234-9988"}'::jsonb,
       '["Penicillin"]'::jsonb, '["Amlodipine Besylate 5mg", "Atorvastatin 20mg"]'::jsonb,
       'Blue Cross Blue Shield', 'BCBS-NY-994123', true),
      ('pat_2', 'MRN-2026-00413', 'Laurence', 'Vendetta', '1979-11-23', 'MALE', 'A+', '+1 (555) 876-1234', 'laurence.v@example.com',
       '{"street": "742 Evergreen Terrace", "city": "Los Angeles", "state": "CA", "postalCode": "90001", "country": "USA"}'::jsonb,
       '{"name": "Elena Vendetta", "relationship": "Sister", "phone": "+1 (555) 876-4321"}'::jsonb,
       '["Sulfa drugs", "Peanuts"]'::jsonb, '["Lisinopril 10mg"]'::jsonb,
       'Aetna Health', 'AET-CA-448129', true),
      ('pat_3', 'MRN-2026-00414', 'Cassandra', 'Raul', '1992-08-30', 'FEMALE', 'B+', '+1 (555) 345-9876', 'cassandra.r@example.com',
       '{"street": "1200 Beacon St", "city": "Boston", "state": "MA", "postalCode": "02446", "country": "USA"}'::jsonb,
       '{"name": "Marcus Raul", "relationship": "Brother", "phone": "+1 (555) 345-6789"}'::jsonb,
       '["Aspirin"]'::jsonb, '["Metformin 500mg"]'::jsonb,
       'UnitedHealthcare', 'UHC-MA-881293', true);
    `;
    console.log('  ✓ Seeded 3 patient demographics');
  }

  // Seed & Synchronize Users
  const usersToSeed = [
    { id: 'usr_admin', username: 'admin', password_hash: 'admin123', email: 'admin@hospital.com', name: 'Dr. Arthur Vance (Director)', role: 'ADMIN', department_id: null, doctor_id: null, patient_id: null },
    { id: 'usr_auditor', username: 'auditor', password_hash: 'audit123', email: 'eleanor.compliance@hospital.com', name: 'Eleanor Campbell (Chief Compliance Officer)', role: 'COMPLIANCE_AUDITOR', department_id: null, doctor_id: null, patient_id: null },
    { id: 'usr_sarah', username: 'dr_sarah', password_hash: 'doctor123', email: 'sarah.patel@hospital.com', name: 'Dr. Sarah Patel, MD, FACC', role: 'DOCTOR', department_id: 'dept_card', doctor_id: 'doc_sarah', patient_id: null },
    { id: 'usr_nurse', username: 'nurse_jane', password_hash: 'nurse123', email: 'jane.miller@hospital.com', name: 'Jane Miller, RN (Charge Nurse)', role: 'NURSE', department_id: 'dept_card', doctor_id: null, patient_id: null },
    { id: 'usr_reception', username: 'reception', password_hash: 'desk123', email: 'sam.reception@hospital.com', name: 'Samuel Rivera (Reception OPD Desk)', role: 'RECEPTIONIST', department_id: null, doctor_id: null, patient_id: null },
    { id: 'usr_cmo', username: 'cmo', password_hash: 'cmo123', email: 'cmo@hospital.com', name: 'Dr. Katherine Bell, MD (CMO)', role: 'CHIEF_MEDICAL_OFFICER', department_id: null, doctor_id: null, patient_id: null },
    { id: 'usr_paulo', username: 'paulo', password_hash: 'patient123', email: 'paulo.hubert@example.com', name: 'Paulo Hubert', role: 'PATIENT', department_id: null, doctor_id: null, patient_id: 'pat_1' }
  ];

  for (const u of usersToSeed) {
    await sql`
      INSERT INTO users (id, username, password_hash, email, name, role, department_id, doctor_id, patient_id)
      VALUES (${u.id}, ${u.username}, ${u.password_hash}, ${u.email}, ${u.name}, ${u.role}, ${u.department_id}, ${u.doctor_id}, ${u.patient_id})
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        department_id = EXCLUDED.department_id,
        doctor_id = EXCLUDED.doctor_id,
        patient_id = EXCLUDED.patient_id;
    `;
  }
  console.log('  ✓ Seeded & synchronized 7 platform users (Admin, Auditor, Doctor, Nurse, Reception, CMO, Patient)');

  // Seed Genesis Block for Audit Records if empty
  const auditCount = await sql`SELECT count(*)::int as cnt FROM audit_records;`;
  if (auditCount[0].cnt === 0) {
    const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
    await sql`
      INSERT INTO audit_records (
        id, sequence_number, timestamp, trace_id, actor_id, actor_name, actor_role,
        client_ip, user_agent, action, resource_type, resource_id, description,
        endpoint, http_method, status_code, execution_time_ms, clinical_reason,
        diff_json, prev_record_hash, record_hash
      ) VALUES (
        'audit_genesis', 0, NOW(), 'trace_genesis_block', 'system_init',
        'Hospital Genesis Architect', 'ADMIN', '127.0.0.1', 'Neon Postgres Initializer',
        'CREATE', 'SYSTEM_CONFIG', 'config_genesis', 'Genesis block of the cryptographic immutable audit chain',
        '/system/bootstrap', 'POST', 200, 1, 'Initial cryptographic establishment',
        '{"event": "NEON_POSTGRES_GENESIS"}'::text, ${GENESIS_HASH}, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
    `;
    console.log('  ✓ Seeded Audit Genesis Record with cryptographic proof');
  }

  // Print Summary
  const tables = await sql`
    SELECT table_name, (
      SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name
    ) as column_count
    FROM information_schema.tables t
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log('\n====================================================');
  console.log('🎉 Neon PostgreSQL Database Setup Complete!');
  console.log('====================================================');
  console.table(tables);
}

initNeonSchema().catch(err => {
  console.error('❌ Schema initialization error:', err);
  process.exit(1);
});
