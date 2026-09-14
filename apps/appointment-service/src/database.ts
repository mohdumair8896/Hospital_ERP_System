import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { 
  Appointment, 
  BookAppointmentDto, 
  Doctor, 
  Department, 
  AppointmentStatus,
  SEED_DEPARTMENTS,
  SEED_DOCTORS
} from '@hospital/contracts';
import * as neonDb from '@hospital/database';

export class AppointmentDatabase {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const defaultPath = typeof __dirname !== 'undefined'
      ? path.resolve(__dirname, '../appointment.db')
      : path.resolve(process.cwd(), 'appointment.db');
    const resolvedPath = dbPath || process.env.APPOINTMENT_DB_PATH || defaultPath;

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

      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        emergency_support INTEGER NOT NULL DEFAULT 0,
        icon TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        specialty TEXT NOT NULL,
        department_id TEXT NOT NULL,
        qualification TEXT NOT NULL,
        experience_years INTEGER NOT NULL,
        rating REAL NOT NULL,
        review_count INTEGER NOT NULL,
        consultation_fee REAL NOT NULL,
        available_days_json TEXT NOT NULL,
        available_slots_json TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        bio TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        appointment_number TEXT UNIQUE NOT NULL,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        patient_phone TEXT NOT NULL,
        patient_email TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        department_id TEXT NOT NULL,
        department_name TEXT NOT NULL,
        slot_date TEXT NOT NULL,
        slot_time TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        consultation_fee REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(slot_date);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);
  }

  private seed(): void {
    const deptCount = (this.db.prepare(`SELECT COUNT(*) as cnt FROM departments`).get() as { cnt: number }).cnt;
    if (deptCount === 0) {
      for (const d of SEED_DEPARTMENTS) {
        this.db.prepare(`
          INSERT INTO departments (id, code, name, description, location, emergency_support, icon)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(d.id, d.code, d.name, d.description, d.location, d.emergencySupport ? 1 : 0, d.icon);
      }
    }

    const docCount = (this.db.prepare(`SELECT COUNT(*) as cnt FROM doctors`).get() as { cnt: number }).cnt;
    if (docCount === 0) {
      for (const doc of SEED_DOCTORS) {
        this.db.prepare(`
          INSERT INTO doctors (
            id, name, title, specialty, department_id, qualification, experience_years,
            rating, review_count, consultation_fee, available_days_json,
            available_slots_json, avatar_url, bio, phone, email
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?
          )
        `).run(
          doc.id, doc.name, doc.title, doc.specialty, doc.departmentId, doc.qualification,
          doc.experienceYears, doc.rating, doc.reviewCount, doc.consultationFee,
          JSON.stringify(doc.availableDays), JSON.stringify(doc.availableSlots),
          doc.avatarUrl, doc.bio, doc.phone, doc.email
        );
      }
    }

    const apptCount = (this.db.prepare(`SELECT COUNT(*) as cnt FROM appointments`).get() as { cnt: number }).cnt;
    if (apptCount === 0) {
      const today = new Date().toISOString().split('T')[0];
      const seedAppts = [
        {
          patientId: 'pat_1',
          patientName: 'Paulo Hubert',
          patientPhone: '+1 (555) 234-5678',
          patientEmail: 'paulo.hubert@example.com',
          doctorId: 'doc_sarah',
          doctorName: 'Dr. Sarah Patel',
          departmentId: 'dept_card',
          departmentName: 'Cardiology & Heart Center',
          slotDate: today,
          slotTime: '10:30 AM',
          type: 'OPD_IN_PERSON' as const,
          status: 'CONFIRMED' as const,
          symptoms: 'Mild chest pressure during morning exertion and fatigue.',
          consultationFee: 150
        },
        {
          patientId: 'pat_2',
          patientName: 'Laurence Vendetta',
          patientPhone: '+1 (555) 876-1234',
          patientEmail: 'laurence.v@example.com',
          doctorId: 'doc_michael',
          doctorName: 'Dr. Michael Chang',
          departmentId: 'dept_ped',
          departmentName: 'Pediatrics & Neonatology',
          slotDate: today,
          slotTime: '01:30 PM',
          type: 'OPD_IN_PERSON' as const,
          status: 'SCHEDULED' as const,
          symptoms: 'Child having low-grade fever and dry persistent cough.',
          consultationFee: 120
        }
      ];

      for (const sa of seedAppts) {
        this.create(sa);
      }
    }
  }

  public async getDepartments(): Promise<Department[]> {
    if (process.env.DATABASE_URL) {
      try {
        const depts = await neonDb.getDepartments();
        if (depts && depts.length > 0) return depts;
      } catch (err) {
        console.error('[AppointmentDatabase] Neon query error, using local fallback:', err);
      }
    }
    const rows = this.db.prepare(`SELECT * FROM departments ORDER BY name ASC`).all() as any[];
    return rows.map(r => ({
      id: r.id,
      code: r.code,
      name: r.name,
      description: r.description,
      location: r.location,
      emergencySupport: Boolean(r.emergency_support),
      icon: r.icon
    }));
  }

  public async getDoctors(departmentId?: string): Promise<Doctor[]> {
    if (process.env.DATABASE_URL) {
      try {
        const docs = await neonDb.getDoctors(departmentId);
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.error('[AppointmentDatabase] Neon query error, using local fallback:', err);
      }
    }
    let sql = `SELECT * FROM doctors`;
    const params: any[] = [];
    if (departmentId) {
      sql += ` WHERE department_id = ?`;
      params.push(departmentId);
    }
    sql += ` ORDER BY rating DESC`;

    const rows = this.db.prepare(sql).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      title: r.title,
      specialty: r.specialty,
      departmentId: r.department_id,
      qualification: r.qualification,
      experienceYears: r.experience_years,
      rating: r.rating,
      reviewCount: r.review_count,
      consultationFee: r.consultation_fee,
      availableDays: JSON.parse(r.available_days_json),
      availableSlots: JSON.parse(r.available_slots_json),
      avatarUrl: r.avatar_url,
      bio: r.bio,
      phone: r.phone,
      email: r.email
    }));
  }

  public async getDoctorById(id: string): Promise<Doctor | null> {
    if (process.env.DATABASE_URL) {
      try {
        const doc = await neonDb.getDoctorById(id);
        if (doc) return doc;
      } catch (err) {
        console.error('[AppointmentDatabase] Neon query error, using local fallback:', err);
      }
    }
    const row = this.db.prepare(`SELECT * FROM doctors WHERE id = ?`).get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      title: row.title,
      specialty: row.specialty,
      departmentId: row.department_id,
      qualification: row.qualification,
      experienceYears: row.experience_years,
      rating: row.rating,
      reviewCount: row.review_count,
      consultationFee: row.consultation_fee,
      availableDays: JSON.parse(row.available_days_json),
      availableSlots: JSON.parse(row.available_slots_json),
      avatarUrl: row.avatar_url,
      bio: row.bio,
      phone: row.phone,
      email: row.email
    };
  }

  public async create(data: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    doctorId: string;
    doctorName: string;
    departmentId: string;
    departmentName: string;
    slotDate: string;
    slotTime: string;
    type: any;
    status?: AppointmentStatus;
    symptoms: string;
    consultationFee: number;
  }): Promise<Appointment> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.createAppointment(data);
      } catch (err) {
        console.error('[AppointmentDatabase] Neon create error, using local fallback:', err);
      }
    }
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentNumber = `APT-2026-${suffix}`;
    const id = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const appt: Appointment = {
      id,
      appointmentNumber,
      patientId: data.patientId,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      slotDate: data.slotDate,
      slotTime: data.slotTime,
      type: data.type,
      status: data.status || 'CONFIRMED',
      symptoms: data.symptoms,
      consultationFee: data.consultationFee,
      createdAt: now,
      updatedAt: now
    };

    try {
      this.db.prepare(`
        INSERT INTO appointments (
          id, appointment_number, patient_id, patient_name, patient_phone, patient_email,
          doctor_id, doctor_name, department_id, department_name, slot_date, slot_time,
          type, status, symptoms, consultation_fee, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `).run(
        appt.id, appt.appointmentNumber, appt.patientId, appt.patientName, appt.patientPhone, appt.patientEmail,
        appt.doctorId, appt.doctorName, appt.departmentId, appt.departmentName, appt.slotDate, appt.slotTime,
        appt.type, appt.status, appt.symptoms, appt.consultationFee, appt.createdAt, appt.updatedAt
      );
    } catch (sqliteErr) {
      console.warn('[AppointmentDatabase] Local sqlite insert warning:', sqliteErr);
    }

    return appt;
  }

  public async getAppointments(filters?: {
    doctorId?: string;
    patientId?: string;
    date?: string;
    status?: string;
  }): Promise<Appointment[]> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.getAppointments(filters);
      } catch (err) {
        console.error('[AppointmentDatabase] Neon query error, using local fallback:', err);
      }
    }
    let sql = `SELECT * FROM appointments WHERE 1=1`;
    const params: any[] = [];

    if (filters?.doctorId) {
      sql += ` AND doctor_id = ?`;
      params.push(filters.doctorId);
    }
    if (filters?.patientId) {
      sql += ` AND patient_id = ?`;
      params.push(filters.patientId);
    }
    if (filters?.date) {
      sql += ` AND slot_date = ?`;
      params.push(filters.date);
    }
    if (filters?.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }

    sql += ` ORDER BY slot_date ASC, slot_time ASC`;
    const rows = this.db.prepare(sql).all(...params) as any[];

    return rows.map(r => ({
      id: r.id,
      appointmentNumber: r.appointment_number,
      patientId: r.patient_id,
      patientName: r.patient_name,
      patientPhone: r.patient_phone,
      patientEmail: r.patient_email,
      doctorId: r.doctor_id,
      doctorName: r.doctor_name,
      departmentId: r.department_id,
      departmentName: r.department_name,
      slotDate: r.slot_date,
      slotTime: r.slot_time,
      type: r.type,
      status: r.status,
      symptoms: r.symptoms,
      consultationFee: r.consultation_fee,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  public async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
    if (process.env.DATABASE_URL) {
      try {
        return await neonDb.updateAppointmentStatus(id, status);
      } catch (err) {
        console.error('[AppointmentDatabase] Neon update error, using local fallback:', err);
      }
    }
    const now = new Date().toISOString();
    const updated = this.db.prepare(`
      UPDATE appointments SET status = ?, updated_at = ? WHERE id = ? RETURNING *
    `).get(status, now, id) as any;
    if (!updated) return null;

    return {
      id: updated.id,
      appointmentNumber: updated.appointment_number,
      patientId: updated.patient_id,
      patientName: updated.patient_name,
      patientPhone: updated.patient_phone,
      patientEmail: updated.patient_email,
      doctorId: updated.doctor_id,
      doctorName: updated.doctor_name,
      departmentId: updated.department_id,
      departmentName: updated.department_name,
      slotDate: updated.slot_date,
      slotTime: updated.slot_time,
      type: updated.type,
      status: updated.status,
      symptoms: updated.symptoms,
      consultationFee: updated.consultation_fee,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }
}
