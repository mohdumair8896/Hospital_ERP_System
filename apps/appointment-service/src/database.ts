import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { 
  Appointment, 
  BookAppointmentDto, 
  Doctor, 
  Department, 
  AppointmentStatus 
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
      const departments: Department[] = [
        {
          id: 'dept_emg',
          code: 'EMERGENCY',
          name: 'Emergency & Trauma Department',
          description: '24/7 acute emergency medical and surgical triage care with Level 1 trauma facilities.',
          location: 'Building A, Ground Floor',
          emergencySupport: true,
          icon: 'Flame'
        },
        {
          id: 'dept_card',
          code: 'CARDIOLOGY',
          name: 'Cardiology & Heart Center',
          description: 'Comprehensive cardiovascular diagnostics, cath lab, interventional cardiology, and cardiac surgery.',
          location: 'Building B, 3rd Floor',
          emergencySupport: true,
          icon: 'HeartPulse'
        },
        {
          id: 'dept_ped',
          code: 'PEDIATRICS',
          name: 'Pediatrics & Neonatology',
          description: 'Child-centered healthcare from newborn care and immunizations to adolescent medicine.',
          location: 'Building C, 2nd Floor',
          emergencySupport: false,
          icon: 'Baby'
        },
        {
          id: 'dept_neur',
          code: 'NEUROLOGY',
          name: 'Neurology & Neurosurgery',
          description: 'Advanced brain and nervous system care, stroke unit, epilepsy management, and spinal surgery.',
          location: 'Building B, 4th Floor',
          emergencySupport: true,
          icon: 'Brain'
        },
        {
          id: 'dept_gyn',
          code: 'GYNECOLOGY',
          name: 'Gynecology & Obstetrics',
          description: 'Maternal health, prenatal care, high-risk pregnancy management, and minimally invasive surgery.',
          location: 'Building C, 3rd Floor',
          emergencySupport: true,
          icon: 'HeartHandshake'
        },
        {
          id: 'dept_orth',
          code: 'ORTHOPEDICS',
          name: 'Orthopedics & Joint Replacement',
          description: 'Specialized bone, joint, and sports injury recovery with robotic arthroplasty programs.',
          location: 'Building A, 2nd Floor',
          emergencySupport: false,
          icon: 'Bone'
        }
      ];

      for (const d of departments) {
        this.db.prepare(`
          INSERT INTO departments (id, code, name, description, location, emergency_support, icon)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(d.id, d.code, d.name, d.description, d.location, d.emergencySupport ? 1 : 0, d.icon);
      }
    }

    const docCount = (this.db.prepare(`SELECT COUNT(*) as cnt FROM doctors`).get() as { cnt: number }).cnt;
    if (docCount === 0) {
      const doctors: Doctor[] = [
        {
          id: 'doc_sarah',
          name: 'Dr. Sarah Patel',
          title: 'Dr. Sarah Patel, MD, FACC',
          specialty: 'Cardiologist',
          departmentId: 'dept_card',
          qualification: 'MD (Harvard), Fellowship Interventional Cardiology (Johns Hopkins)',
          experienceYears: 16,
          rating: 4.96,
          reviewCount: 248,
          consultationFee: 150,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM'],
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          bio: 'Dr. Sarah Patel is a world-renowned interventional cardiologist specializing in coronary artery disease and non-invasive valve repair with over 16 years of clinical excellence.',
          phone: '+1 (555) 123-4567',
          email: 'sarah.patel@hospital.com'
        },
        {
          id: 'doc_michael',
          name: 'Dr. Michael Chang',
          title: 'Dr. Michael Chang, MD, FAAP',
          specialty: 'Pediatric Specialist',
          departmentId: 'dept_ped',
          qualification: 'MD (Stanford), Board Certified Pediatrician',
          experienceYears: 12,
          rating: 4.92,
          reviewCount: 194,
          consultationFee: 120,
          availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          availableSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:15 PM'],
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          bio: 'Dr. Chang brings a compassionate, whole-child approach to pediatric medicine, comforting parents while delivering evidence-based pediatric care.',
          phone: '+1 (555) 234-5678',
          email: 'michael.chang@hospital.com'
        },
        {
          id: 'doc_elena',
          name: 'Dr. Elena Rostova',
          title: 'Dr. Elena Rostova, MD, PhD',
          specialty: 'Senior Neurologist',
          departmentId: 'dept_neur',
          qualification: 'MD, PhD in Neurobiology (Columbia University)',
          experienceYears: 19,
          rating: 4.98,
          reviewCount: 312,
          consultationFee: 180,
          availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
          availableSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'],
          avatarUrl: 'https://images.unsplash.com/photo-1594824813576-a364802c63ef?auto=format&fit=crop&q=80&w=400',
          bio: 'Leader in neuro-degenerative diagnostics, complex migraine therapies, and cerebrovascular rehabilitation.',
          phone: '+1 (555) 345-6789',
          email: 'elena.rostova@hospital.com'
        },
        {
          id: 'doc_david',
          name: 'Dr. David Rodriguez',
          title: 'Dr. David Rodriguez, MD, FACS',
          specialty: 'Orthopedic Surgeon',
          departmentId: 'dept_orth',
          qualification: 'MD (UCLA), Sports Medicine Fellowship (Cedars-Sinai)',
          experienceYears: 14,
          rating: 4.89,
          reviewCount: 180,
          consultationFee: 160,
          availableDays: ['Monday', 'Tuesday', 'Friday'],
          availableSlots: ['08:30 AM', '10:00 AM', '01:00 PM', '03:30 PM'],
          avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
          bio: 'Specialist in minimally invasive joint preservation, ligament reconstruction, and rapid-recovery sports traumatology.',
          phone: '+1 (555) 456-7890',
          email: 'david.rodriguez@hospital.com'
        }
      ];

      for (const doc of doctors) {
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
        return await neonDb.getDepartments();
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
        return await neonDb.getDoctors(departmentId);
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
        return await neonDb.getDoctorById(id);
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
    const count = (this.db.prepare(`SELECT COUNT(*) as cnt FROM appointments`).get() as { cnt: number }).cnt;
    const appointmentNumber = `APT-2026-${(8800 + count + 1).toString()}`;
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
