import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ClinicalEncounter, VitalSigns, PrescriptionItem } from '@hospital/contracts';
import * as neonDb from '@hospital/database';

export class ClinicalDatabase {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const defaultPath = typeof __dirname !== 'undefined'
      ? path.resolve(__dirname, '../clinical.db')
      : path.resolve(process.cwd(), 'clinical.db');
    const resolvedPath = dbPath || process.env.CLINICAL_DB_PATH || defaultPath;

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

      CREATE TABLE IF NOT EXISTS clinical_encounters (
        id TEXT PRIMARY KEY,
        encounter_number TEXT UNIQUE NOT NULL,
        appointment_id TEXT,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        type TEXT NOT NULL,
        chief_complaint TEXT NOT NULL,
        vitals_json TEXT NOT NULL,
        primary_diagnosis_code TEXT NOT NULL,
        primary_diagnosis_name TEXT NOT NULL,
        secondary_diagnoses_json TEXT,
        clinical_notes TEXT NOT NULL,
        prescriptions_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        finalized_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_encounters_patient ON clinical_encounters(patient_id);
      CREATE INDEX IF NOT EXISTS idx_encounters_doctor ON clinical_encounters(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_encounters_date ON clinical_encounters(created_at);
    `);
  }

  private seed(): void {
    const check = (this.db.prepare(`SELECT COUNT(*) as cnt FROM clinical_encounters`).get() as { cnt: number }).cnt;
    if (check > 0) return;

    const vitals1: VitalSigns = {
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 82,
      heartRateBpm: 72,
      respiratoryRate: 16,
      bodyTemperatureCelsius: 36.8,
      oxygenSaturationSpO2: 99,
      recordedAt: new Date().toISOString()
    };

    const rx1: PrescriptionItem[] = [
      {
        medicineName: 'Amlodipine Besylate 5mg',
        dosage: '5mg Oral Tablet',
        frequency: 'OD (Once daily in the morning)',
        duration: '30 days',
        instructions: 'Take with or without food. Monitor resting blood pressure.'
      },
      {
        medicineName: 'Atorvastatin 20mg',
        dosage: '20mg Oral Tablet',
        frequency: 'HS (At bedtime)',
        duration: '30 days',
        instructions: 'Lipid stabilization therapy.'
      }
    ];

    this.insertLocal({
      patientId: 'pat_1',
      doctorId: 'doc_sarah',
      doctorName: 'Dr. Sarah Patel',
      appointmentId: 'apt_1',
      type: 'OPD',
      chiefComplaint: 'Follow-up for mild exertional chest pressure and hypertension monitoring.',
      vitals: vitals1,
      primaryDiagnosisCode: 'I10',
      primaryDiagnosisName: 'Essential (primary) hypertension',
      secondaryDiagnoses: ['E78.0 - Pure hypercholesterolemia'],
      clinicalNotes: 'Patient appears well-hydrated and in no acute distress. Heart sounds regular S1/S2 without murmurs. Lungs clear to auscultation bilaterally. EKG reveals normal sinus rhythm with no ST changes.',
      prescriptions: rx1,
      status: 'FINALIZED'
    });
  }

  private insertLocal(data: {
    patientId: string;
    doctorId: string;
    doctorName: string;
    appointmentId?: string;
    type: 'OPD' | 'IPD' | 'EMERGENCY';
    chiefComplaint: string;
    vitals: VitalSigns;
    primaryDiagnosisCode: string;
    primaryDiagnosisName: string;
    secondaryDiagnoses?: string[];
    clinicalNotes: string;
    prescriptions: PrescriptionItem[];
    status?: 'OPEN' | 'FINALIZED' | 'AMENDED';
  }): ClinicalEncounter {
    const count = (this.db.prepare(`SELECT COUNT(*) as cnt FROM clinical_encounters`).get() as { cnt: number }).cnt;
    const encounterNumber = `ENC-2026-${(100 + count + 1).toString()}`;
    const id = `enc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const enc: ClinicalEncounter = {
      id,
      encounterNumber,
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      type: data.type,
      chiefComplaint: data.chiefComplaint,
      vitals: data.vitals,
      primaryDiagnosisCode: data.primaryDiagnosisCode,
      primaryDiagnosisName: data.primaryDiagnosisName,
      secondaryDiagnoses: data.secondaryDiagnoses,
      clinicalNotes: data.clinicalNotes,
      prescriptions: data.prescriptions,
      status: data.status || 'FINALIZED',
      createdAt: now,
      finalizedAt: data.status === 'FINALIZED' ? now : undefined
    };

    this.db.prepare(`
      INSERT INTO clinical_encounters (
        id, encounter_number, appointment_id, patient_id, doctor_id, doctor_name,
        type, chief_complaint, vitals_json, primary_diagnosis_code, primary_diagnosis_name,
        secondary_diagnoses_json, clinical_notes, prescriptions_json, status,
        created_at, finalized_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      enc.id, enc.encounterNumber, enc.appointmentId || null, enc.patientId, enc.doctorId, enc.doctorName,
      enc.type, enc.chiefComplaint, JSON.stringify(enc.vitals), enc.primaryDiagnosisCode, enc.primaryDiagnosisName,
      JSON.stringify(enc.secondaryDiagnoses || []), enc.clinicalNotes, JSON.stringify(enc.prescriptions),
      enc.status, enc.createdAt, enc.finalizedAt || null
    );

    return enc;
  }

  public async create(data: {
    patientId: string;
    doctorId: string;
    doctorName: string;
    appointmentId?: string;
    type: 'OPD' | 'IPD' | 'EMERGENCY';
    chiefComplaint: string;
    vitals: VitalSigns;
    primaryDiagnosisCode: string;
    primaryDiagnosisName: string;
    secondaryDiagnoses?: string[];
    clinicalNotes: string;
    prescriptions: PrescriptionItem[];
    status?: 'OPEN' | 'FINALIZED' | 'AMENDED';
  }): Promise<ClinicalEncounter> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.createClinicalEncounter(data);
      } catch (err) {
        console.error('[ClinicalDatabase] Neon create error, using local fallback:', err);
      }
    }
    return this.insertLocal(data);
  }

  public async getByPatientId(patientId: string): Promise<ClinicalEncounter[]> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.getEncountersByPatient(patientId);
      } catch (err) {
        console.error('[ClinicalDatabase] Neon query error, using local fallback:', err);
      }
    }
    const rows = this.db.prepare(`
      SELECT * FROM clinical_encounters WHERE patient_id = ? ORDER BY created_at DESC
    `).all(patientId) as any[];

    return rows.map(r => this.mapRow(r));
  }

  public async getById(id: string): Promise<ClinicalEncounter | null> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.getEncounterById(id);
      } catch (err) {
        console.error('[ClinicalDatabase] Neon getById error, using local fallback:', err);
      }
    }
    const row = this.db.prepare(`SELECT * FROM clinical_encounters WHERE id = ?`).get(id) as any;
    if (!row) return null;
    return this.mapRow(row);
  }

  private mapRow(r: any): ClinicalEncounter {
    return {
      id: r.id,
      encounterNumber: r.encounter_number,
      appointmentId: r.appointment_id || undefined,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      doctorName: r.doctor_name,
      type: r.type,
      chiefComplaint: r.chief_complaint,
      vitals: JSON.parse(r.vitals_json),
      primaryDiagnosisCode: r.primary_diagnosis_code,
      primaryDiagnosisName: r.primary_diagnosis_name,
      secondaryDiagnoses: JSON.parse(r.secondary_diagnoses_json || '[]'),
      clinicalNotes: r.clinical_notes,
      prescriptions: JSON.parse(r.prescriptions_json || '[]'),
      status: r.status,
      createdAt: r.created_at,
      finalizedAt: r.finalized_at || undefined
    };
  }
}
