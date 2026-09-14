import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { UserRole, UserSession } from '@hospital/contracts';
import * as neonDb from '@hospital/database';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string; // Demo hash
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  doctorId?: string;
  patientId?: string;
  active: boolean;
  createdAt: string;
}

export class AuthDatabase {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const defaultPath = typeof __dirname !== 'undefined'
      ? path.resolve(__dirname, '../auth.db')
      : path.resolve(process.cwd(), 'auth.db');
    const resolvedPath = dbPath || process.env.AUTH_DB_PATH || defaultPath;

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

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        department_id TEXT,
        doctor_id TEXT,
        patient_id TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
  }

  private seed(): void {
    const count = (this.db.prepare(`SELECT COUNT(*) as cnt FROM users`).get() as { cnt: number }).cnt;
    if (count > 0) return;

    const seedUsers: Omit<UserAccount, 'createdAt'>[] = [
      {
        id: 'usr_admin',
        username: 'admin',
        passwordHash: 'admin123',
        name: 'Dr. Arthur Vance (Hospital Director)',
        email: 'arthur.vance@hospital.com',
        role: 'ADMIN',
        active: true
      },
      {
        id: 'usr_auditor',
        username: 'auditor',
        passwordHash: 'audit123',
        name: 'Eleanor Campbell (Chief Compliance Officer)',
        email: 'eleanor.compliance@hospital.com',
        role: 'COMPLIANCE_AUDITOR',
        active: true
      },
      {
        id: 'usr_sarah',
        username: 'dr_sarah',
        passwordHash: 'doctor123',
        name: 'Dr. Sarah Patel, MD, FACC',
        email: 'sarah.patel@hospital.com',
        role: 'DOCTOR',
        departmentId: 'dept_card',
        doctorId: 'doc_sarah',
        active: true
      },
      {
        id: 'usr_nurse',
        username: 'nurse_jane',
        passwordHash: 'nurse123',
        name: 'Jane Miller, RN (Charge Nurse)',
        email: 'jane.miller@hospital.com',
        role: 'NURSE',
        departmentId: 'dept_card',
        active: true
      },
      {
        id: 'usr_reception',
        username: 'reception',
        passwordHash: 'desk123',
        name: 'Samuel Rivera (Reception OPD Desk)',
        email: 'sam.reception@hospital.com',
        role: 'RECEPTIONIST',
        active: true
      },
      {
        id: 'usr_paulo',
        username: 'paulo',
        passwordHash: 'patient123',
        name: 'Paulo Hubert',
        email: 'paulo.hubert@example.com',
        role: 'PATIENT',
        patientId: 'pat_1',
        active: true
      }
    ];

    const now = new Date().toISOString();
    for (const u of seedUsers) {
      this.db.prepare(`
        INSERT INTO users (
          id, username, password_hash, name, email, role, department_id, doctor_id, patient_id, active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        u.id, u.username, u.passwordHash, u.name, u.email, u.role,
        u.departmentId || null, u.doctorId || null, u.patientId || null,
        u.active ? 1 : 0, now
      );
    }
  }

  public async authenticate(username: string, password: string): Promise<UserSession | null> {
    if (process.env.DATABASE_URL) {
      try {
        const session = await neonDb.authenticateUser(username, password);
        if (session) return session;
      } catch (err) {
        console.error('[AuthDatabase] Neon authenticate error, using local fallback:', err);
      }
    }
    const row = this.db.prepare(`
      SELECT * FROM users WHERE (username = ? OR email = ?) AND password_hash = ? AND active = 1
    `).get(username, username, password) as any;

    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      departmentId: row.department_id || undefined,
      doctorId: row.doctor_id || undefined,
      patientId: row.patient_id || undefined
    };
  }

  public async getById(id: string): Promise<UserSession | null> {
    if (process.env.DATABASE_URL) {
      try {
        const session = await neonDb.getUserById(id);
        if (session) return session;
      } catch (err) {
        console.error('[AuthDatabase] Neon getById error, using local fallback:', err);
      }
    }
    const row = this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      departmentId: row.department_id || undefined,
      doctorId: row.doctor_id || undefined,
      patientId: row.patient_id || undefined
    };
  }

  public async getAll(): Promise<UserSession[]> {
    if (process.env.DATABASE_URL) {
      try {
        const users = await neonDb.getAllUsers();
        if (users && users.length > 0) return users;
      } catch (err) {
        console.error('[AuthDatabase] Neon getAll error, using local fallback:', err);
      }
    }
    const rows = this.db.prepare(`SELECT * FROM users ORDER BY name ASC`).all() as any[];
    return rows.map(row => ({
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      departmentId: row.department_id || undefined,
      doctorId: row.doctor_id || undefined,
      patientId: row.patient_id || undefined
    }));
  }

  public async createUser(userData: {
    id?: string;
    username: string;
    password: string;
    name: string;
    email: string;
    role: UserRole;
    departmentId?: string;
    doctorId?: string;
    patientId?: string;
  }): Promise<UserSession> {
    const id = userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    // Mirror to local SQLite
    try {
      this.db.prepare(`
        INSERT INTO users (
          id, username, password_hash, name, email, role, department_id, doctor_id, patient_id, active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, userData.username, userData.password, userData.name, userData.email, userData.role,
        userData.departmentId || null, userData.doctorId || null, userData.patientId || null,
        1, now
      );
    } catch (err) {
      console.warn('[AuthDatabase] Local SQLite insert warning:', err);
    }

    // Persist to Neon Postgres if available
    if (process.env.DATABASE_URL) {
      try {
        return await (neonDb as any).createUser({
          id,
          username: userData.username,
          password: userData.password,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          departmentId: userData.departmentId,
          doctorId: userData.doctorId,
          patientId: userData.patientId,
        });
      } catch (err) {
        console.error('[AuthDatabase] Neon createUser error, falling back to local:', err);
      }
    }

    return {
      id,
      username: userData.username,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      departmentId: userData.departmentId,
      doctorId: userData.doctorId,
      patientId: userData.patientId,
    };
  }
}
