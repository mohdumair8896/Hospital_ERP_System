import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Patient, CreatePatientDto } from '@hospital/contracts';
import * as neonDb from '@hospital/database';

export class PatientDatabase {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const defaultPath = typeof __dirname !== 'undefined'
      ? path.resolve(__dirname, '../patient.db')
      : path.resolve(process.cwd(), 'patient.db');
    const resolvedPath = dbPath || process.env.PATIENT_DB_PATH || defaultPath;

    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(resolvedPath);
    this.init();
    this.seed();
  }

  private init(): void {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        mrn TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL,
        blood_group TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT NOT NULL,
        address_json TEXT NOT NULL,
        emergency_contact_json TEXT NOT NULL,
        allergies_json TEXT NOT NULL,
        active_medications_json TEXT NOT NULL,
        insurance_provider TEXT,
        insurance_policy_number TEXT,
        consent_given INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
      CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone_number);
      CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);
    `);
  }

  private seed(): void {
    const p1 = this.db.prepare(`SELECT id FROM patients WHERE id = 'pat_1'`).get() as any;
    if (p1) return;

    const seedPatients: CreatePatientDto[] = [
      {
        firstName: 'Paulo',
        lastName: 'Hubert',
        dateOfBirth: '1985-04-12',
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
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS-NY-994123'
      },
      {
        firstName: 'Laurence',
        lastName: 'Vendetta',
        dateOfBirth: '1979-11-23',
        gender: 'MALE',
        bloodGroup: 'A+',
        phoneNumber: '+1 (555) 876-1234',
        email: 'laurence.v@example.com',
        street: '742 Evergreen Terrace',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        emergencyContactName: 'Elena Vendetta',
        emergencyContactPhone: '+1 (555) 876-4321',
        emergencyContactRelation: 'Sister',
        allergies: ['Sulfa drugs', 'Peanuts'],
        insuranceProvider: 'Aetna Health',
        insurancePolicyNumber: 'AET-CA-448129'
      },
      {
        firstName: 'Cassandra',
        lastName: 'Raul',
        dateOfBirth: '1992-07-19',
        gender: 'FEMALE',
        bloodGroup: 'B+',
        phoneNumber: '+1 (555) 345-9876',
        email: 'cassandra.raul@example.com',
        street: '1200 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        postalCode: '33139',
        emergencyContactName: 'Marco Raul',
        emergencyContactPhone: '+1 (555) 345-1122',
        emergencyContactRelation: 'Father',
        allergies: [],
        insuranceProvider: 'Cigna Global',
        insurancePolicyNumber: 'CIG-FL-100293'
      }
    ];

    seedPatients.forEach((p, idx) => {
      const id = `pat_${idx + 1}`;
      const mrn = `MRN-2026-004${10 + idx + 1}`;
      this.create(p, id, mrn);
    });
  }

  public async create(dto: CreatePatientDto, explicitId?: string, explicitMrn?: string): Promise<Patient> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.createPatient(dto);
      } catch (err) {
        console.error('[PatientDatabase] Neon create error, using local fallback:', err);
      }
    }
    const suffix = Math.floor(10000 + Math.random() * 90000);
    const id = explicitId || `pat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mrn = explicitMrn || `MRN-2026-${suffix}`;
    const now = new Date().toISOString();

    const patient: Patient = {
      id,
      mrn,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      address: {
        street: dto.street,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: 'USA'
      },
      emergencyContact: {
        name: dto.emergencyContactName,
        phone: dto.emergencyContactPhone,
        relationship: dto.emergencyContactRelation
      },
      allergies: dto.allergies || [],
      activeMedications: [],
      insuranceProvider: dto.insuranceProvider,
      insurancePolicyNumber: dto.insurancePolicyNumber,
      consentGiven: true,
      createdAt: now,
      updatedAt: now
    };

    const stmt = this.db.prepare(`
      INSERT INTO patients (
        id, mrn, first_name, last_name, date_of_birth, gender, blood_group,
        phone_number, email, address_json, emergency_contact_json,
        allergies_json, active_medications_json, insurance_provider,
        insurance_policy_number, consent_given, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    try {
      stmt.run(
        patient.id,
        patient.mrn,
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth,
        patient.gender,
        patient.bloodGroup,
        patient.phoneNumber,
        patient.email,
        JSON.stringify(patient.address),
        JSON.stringify(patient.emergencyContact),
        JSON.stringify(patient.allergies),
        JSON.stringify(patient.activeMedications),
        patient.insuranceProvider || null,
        patient.insurancePolicyNumber || null,
        patient.consentGiven ? 1 : 0,
        patient.createdAt,
        patient.updatedAt
      );
    } catch (sqliteErr) {
      console.warn('[PatientDatabase] Local sqlite insert warning:', sqliteErr);
    }

    return patient;
  }

  public async getById(id: string): Promise<Patient | null> {
    if (process.env.DATABASE_URL) {
      try {
        const patient = await neonDb.getPatientById(id);
        if (patient) return patient;
      } catch (err) {
        console.error('[PatientDatabase] Neon query error, using local fallback:', err);
      }
    }
    const stmt = this.db.prepare(`SELECT * FROM patients WHERE id = ? OR mrn = ?`);
    const row = stmt.get(id, id) as any;
    if (!row) return null;

    return this.mapRow(row);
  }

  public async search(query?: string): Promise<Patient[]> {
    if (process.env.DATABASE_URL) {
      try {
        const patients = await neonDb.searchPatients(query);
        if (patients && patients.length > 0) return patients;
      } catch (err) {
        console.error('[PatientDatabase] Neon query error, using local fallback:', err);
      }
    }
    let sql = `SELECT * FROM patients`;
    const params: any[] = [];

    if (query && query.trim() !== '') {
      sql += ` WHERE first_name LIKE ? OR last_name LIKE ? OR mrn LIKE ? OR phone_number LIKE ?`;
      const term = `%${query.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(r => this.mapRow(r));
  }

  private mapRow(row: any): Patient {
    return {
      id: row.id,
      mrn: row.mrn,
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      bloodGroup: row.blood_group,
      phoneNumber: row.phone_number,
      email: row.email,
      address: JSON.parse(row.address_json),
      emergencyContact: JSON.parse(row.emergency_contact_json),
      allergies: JSON.parse(row.allergies_json),
      activeMedications: JSON.parse(row.active_medications_json),
      insuranceProvider: row.insurance_provider,
      insurancePolicyNumber: row.insurance_policy_number,
      consentGiven: Boolean(row.consent_given),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
