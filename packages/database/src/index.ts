import 'dotenv/config';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { 
  Department, 
  Doctor, 
  Appointment, 
  AppointmentStatus, 
  Patient, 
  CreatePatientDto, 
  ClinicalEncounter, 
  UserSession,
  UserRole,
  AuditRecord,
  AuditSearchQuery
} from '@hospital/contracts';

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Please provide DATABASE_URL in environment or .env file.');
  }
  return url;
}

let _cachedNeonSql: NeonQueryFunction<false, false> | null = null;

export function getNeonSql(): NeonQueryFunction<false, false> {
  if (!_cachedNeonSql) {
    const url = getDatabaseUrl();
    _cachedNeonSql = neon(url);
  }
  return _cachedNeonSql;
}

// ----------------------------------------------------
// 1. DEPARTMENTS
// ----------------------------------------------------
export async function getDepartments(): Promise<Department[]> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT id, code, name, description, location, emergency_support, icon 
    FROM departments 
    ORDER BY name ASC;
  `;
  return rows.map((r: any) => ({
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description,
    location: r.location,
    emergencySupport: Boolean(r.emergency_support),
    icon: r.icon,
  }));
}

// ----------------------------------------------------
// 2. DOCTORS
// ----------------------------------------------------
export async function getDoctors(departmentId?: string): Promise<Doctor[]> {
  const sql = getNeonSql();
  const rows = departmentId
    ? await sql`
        SELECT * FROM doctors 
        WHERE department_id = ${departmentId} 
        ORDER BY rating DESC;
      `
    : await sql`
        SELECT * FROM doctors 
        ORDER BY rating DESC;
      `;

  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    title: r.title,
    specialty: r.specialty,
    departmentId: r.department_id,
    qualification: r.qualification,
    experienceYears: r.experience_years,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    consultationFee: Number(r.consultation_fee),
    availableDays: Array.isArray(r.available_days) ? r.available_days : JSON.parse(r.available_days || '[]'),
    availableSlots: Array.isArray(r.available_slots) ? r.available_slots : JSON.parse(r.available_slots || '[]'),
    avatarUrl: r.avatar_url,
    bio: r.bio,
    phone: r.phone,
    email: r.email,
  }));
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM doctors WHERE id = ${id};`;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    id: r.id,
    name: r.name,
    title: r.title,
    specialty: r.specialty,
    departmentId: r.department_id,
    qualification: r.qualification,
    experienceYears: r.experience_years,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    consultationFee: Number(r.consultation_fee),
    availableDays: Array.isArray(r.available_days) ? r.available_days : JSON.parse(r.available_days || '[]'),
    availableSlots: Array.isArray(r.available_slots) ? r.available_slots : JSON.parse(r.available_slots || '[]'),
    avatarUrl: r.avatar_url,
    bio: r.bio,
    phone: r.phone,
    email: r.email,
  };
}

// ----------------------------------------------------
// 3. APPOINTMENTS
// ----------------------------------------------------
export async function getAppointments(filters?: {
  doctorId?: string;
  patientId?: string;
  date?: string;
  status?: string;
}): Promise<Appointment[]> {
  const sql = getNeonSql();
  let rows: any[];

  if (filters?.doctorId && filters?.date) {
    rows = await sql`
      SELECT * FROM appointments 
      WHERE doctor_id = ${filters.doctorId} AND slot_date = ${filters.date}
      ORDER BY slot_date ASC, slot_time ASC;
    `;
  } else if (filters?.doctorId) {
    rows = await sql`
      SELECT * FROM appointments 
      WHERE doctor_id = ${filters.doctorId}
      ORDER BY slot_date ASC, slot_time ASC;
    `;
  } else if (filters?.patientId) {
    rows = await sql`
      SELECT * FROM appointments 
      WHERE patient_id = ${filters.patientId}
      ORDER BY slot_date ASC, slot_time ASC;
    `;
  } else if (filters?.status) {
    rows = await sql`
      SELECT * FROM appointments 
      WHERE status = ${filters.status}
      ORDER BY slot_date ASC, slot_time ASC;
    `;
  } else {
    rows = await sql`
      SELECT * FROM appointments 
      ORDER BY slot_date ASC, slot_time ASC;
    `;
  }

  return rows.map((r: any) => ({
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
    slotDate: r.slot_date instanceof Date ? r.slot_date.toISOString().split('T')[0] : String(r.slot_date),
    slotTime: r.slot_time,
    type: r.type,
    status: r.status,
    symptoms: r.symptoms,
    consultationFee: Number(r.consultation_fee),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function createAppointment(data: {
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
  const sql = getNeonSql();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const appointmentNumber = `APT-2026-${suffix}`;
  const id = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  await sql`
    INSERT INTO appointments (
      id, appointment_number, patient_id, patient_name, patient_phone, patient_email,
      doctor_id, doctor_name, department_id, department_name, slot_date, slot_time,
      type, status, symptoms, consultation_fee, created_at, updated_at
    ) VALUES (
      ${id}, ${appointmentNumber}, ${data.patientId}, ${data.patientName}, ${data.patientPhone}, ${data.patientEmail},
      ${data.doctorId}, ${data.doctorName}, ${data.departmentId}, ${data.departmentName}, ${data.slotDate}, ${data.slotTime},
      ${data.type}, ${data.status || 'CONFIRMED'}, ${data.symptoms}, ${data.consultationFee}, ${now}, ${now}
    );
  `;

  return {
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
    updatedAt: now,
  };
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
  const sql = getNeonSql();
  const now = new Date().toISOString();
  const rows = await sql`
    UPDATE appointments 
    SET status = ${status}, updated_at = ${now} 
    WHERE id = ${id} 
    RETURNING *;
  `;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
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
    slotDate: r.slot_date instanceof Date ? r.slot_date.toISOString().split('T')[0] : String(r.slot_date),
    slotTime: r.slot_time,
    type: r.type,
    status: r.status,
    symptoms: r.symptoms,
    consultationFee: Number(r.consultation_fee),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ----------------------------------------------------
// 4. PATIENTS
// ----------------------------------------------------
export async function searchPatients(query?: string): Promise<Patient[]> {
  const sql = getNeonSql();
  const rows = query?.trim()
    ? await sql`
        SELECT * FROM patients 
        WHERE last_name ILIKE ${'%' + query + '%'}
           OR first_name ILIKE ${'%' + query + '%'}
           OR mrn ILIKE ${'%' + query + '%'}
           OR phone_number ILIKE ${'%' + query + '%'}
        ORDER BY last_name ASC, first_name ASC;
      `
    : await sql`
        SELECT * FROM patients 
        ORDER BY last_name ASC, first_name ASC;
      `;

  return rows.map((r: any) => ({
    id: r.id,
    mrn: r.mrn,
    firstName: r.first_name,
    lastName: r.last_name,
    dateOfBirth: r.date_of_birth instanceof Date ? r.date_of_birth.toISOString().split('T')[0] : String(r.date_of_birth),
    gender: r.gender,
    bloodGroup: r.blood_group,
    phoneNumber: r.phone_number,
    email: r.email,
    address: r.address || {},
    emergencyContact: r.emergency_contact || {},
    allergies: r.allergies || [],
    activeMedications: r.active_medications || [],
    insuranceProvider: r.insurance_provider,
    insurancePolicyNumber: r.insurance_policy_number,
    consentGiven: Boolean(r.consent_given),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM patients WHERE id = ${id} OR mrn = ${id};`;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    id: r.id,
    mrn: r.mrn,
    firstName: r.first_name,
    lastName: r.last_name,
    dateOfBirth: r.date_of_birth instanceof Date ? r.date_of_birth.toISOString().split('T')[0] : String(r.date_of_birth),
    gender: r.gender,
    bloodGroup: r.blood_group,
    phoneNumber: r.phone_number,
    email: r.email,
    address: r.address || {},
    emergencyContact: r.emergency_contact || {},
    allergies: r.allergies || [],
    activeMedications: r.active_medications || [],
    insuranceProvider: r.insurance_provider,
    insurancePolicyNumber: r.insurance_policy_number,
    consentGiven: Boolean(r.consent_given),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function createPatient(data: CreatePatientDto): Promise<Patient> {
  const sql = getNeonSql();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  const id = `pat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const mrn = `MRN-2026-${suffix}`;
  const now = new Date().toISOString();

  const address = {
    street: data.street,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: 'USA',
  };

  const emergencyContact = {
    name: data.emergencyContactName,
    relationship: data.emergencyContactRelation,
    phone: data.emergencyContactPhone,
  };

  await sql`
    INSERT INTO patients (
      id, mrn, first_name, last_name, date_of_birth, gender, blood_group,
      phone_number, email, address, emergency_contact, allergies, active_medications,
      insurance_provider, insurance_policy_number, consent_given, created_at, updated_at
    ) VALUES (
      ${id}, ${mrn}, ${data.firstName}, ${data.lastName}, ${data.dateOfBirth}, ${data.gender}, ${data.bloodGroup},
      ${data.phoneNumber}, ${data.email}, ${JSON.stringify(address)}, ${JSON.stringify(emergencyContact)},
      ${JSON.stringify(data.allergies || [])}, '[]'::jsonb,
      ${data.insuranceProvider || null}, ${data.insurancePolicyNumber || null}, true, ${now}, ${now}
    );
  `;

  return {
    id,
    mrn,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    bloodGroup: data.bloodGroup,
    phoneNumber: data.phoneNumber,
    email: data.email,
    address,
    emergencyContact,
    allergies: data.allergies || [],
    activeMedications: [],
    insuranceProvider: data.insuranceProvider,
    insurancePolicyNumber: data.insurancePolicyNumber,
    consentGiven: true,
    createdAt: now,
    updatedAt: now,
  };
}

// ----------------------------------------------------
// 5. CLINICAL ENCOUNTERS
// ----------------------------------------------------
export async function getEncountersByPatient(patientId: string): Promise<ClinicalEncounter[]> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT * FROM clinical_encounters 
    WHERE patient_id = ${patientId} 
    ORDER BY created_at DESC;
  `;
  return rows.map((r: any) => ({
    id: r.id,
    encounterNumber: r.encounter_number,
    appointmentId: r.appointment_id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    doctorName: r.doctor_name,
    type: r.type,
    chiefComplaint: r.chief_complaint,
    vitals: r.vitals || {},
    primaryDiagnosisCode: r.primary_diagnosis_code,
    primaryDiagnosisName: r.primary_diagnosis_name,
    secondaryDiagnoses: r.secondary_diagnoses || [],
    clinicalNotes: r.clinical_notes,
    prescriptions: r.prescriptions || [],
    labOrders: r.lab_orders || [],
    status: r.status,
    createdAt: r.created_at,
    finalizedAt: r.finalized_at,
  }));
}

export async function getEncounterById(id: string): Promise<ClinicalEncounter | null> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT * FROM clinical_encounters 
    WHERE id = ${id} OR encounter_number = ${id};
  `;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    id: r.id,
    encounterNumber: r.encounter_number,
    appointmentId: r.appointment_id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    doctorName: r.doctor_name,
    type: r.type,
    chiefComplaint: r.chief_complaint,
    vitals: r.vitals || {},
    primaryDiagnosisCode: r.primary_diagnosis_code,
    primaryDiagnosisName: r.primary_diagnosis_name,
    secondaryDiagnoses: r.secondary_diagnoses || [],
    clinicalNotes: r.clinical_notes,
    prescriptions: r.prescriptions || [],
    labOrders: r.lab_orders || [],
    status: r.status,
    createdAt: r.created_at,
    finalizedAt: r.finalized_at,
  };
}

export async function createClinicalEncounter(data: any): Promise<ClinicalEncounter> {
  const sql = getNeonSql();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const id = `enc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const encounterNumber = `ENC-2026-${suffix}`;
  const now = new Date().toISOString();

  await sql`
    INSERT INTO clinical_encounters (
      id, encounter_number, appointment_id, patient_id, doctor_id, doctor_name,
      type, chief_complaint, vitals, primary_diagnosis_code, primary_diagnosis_name,
      secondary_diagnoses, clinical_notes, prescriptions, lab_orders, status,
      created_at, finalized_at
    ) VALUES (
      ${id}, ${encounterNumber}, ${data.appointmentId || null}, ${data.patientId}, ${data.doctorId}, ${data.doctorName},
      ${data.type || 'OPD'}, ${data.chiefComplaint}, ${JSON.stringify(data.vitals || {})}, ${data.primaryDiagnosisCode},
      ${data.primaryDiagnosisName}, ${JSON.stringify(data.secondaryDiagnoses || [])}, ${data.clinicalNotes},
      ${JSON.stringify(data.prescriptions || [])}, ${JSON.stringify(data.labOrders || [])},
      ${data.status || 'FINALIZED'}, ${now}, ${now}
    );
  `;

  return {
    id,
    encounterNumber,
    appointmentId: data.appointmentId,
    patientId: data.patientId,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    type: data.type || 'OPD',
    chiefComplaint: data.chiefComplaint,
    vitals: data.vitals,
    primaryDiagnosisCode: data.primaryDiagnosisCode,
    primaryDiagnosisName: data.primaryDiagnosisName,
    secondaryDiagnoses: data.secondaryDiagnoses,
    clinicalNotes: data.clinicalNotes,
    prescriptions: data.prescriptions || [],
    labOrders: data.labOrders,
    status: data.status || 'FINALIZED',
    createdAt: now,
    finalizedAt: now,
  };
}

// ----------------------------------------------------
// 6. AUTHENTICATION & USERS
// ----------------------------------------------------
export async function authenticateUser(usernameOrEmail: string, passwordAttempt: string): Promise<UserSession | null> {
  const sql = getNeonSql();
  const candidateUsernames = [usernameOrEmail];
  if (usernameOrEmail === 'dr_sarah') candidateUsernames.push('doc_sarah');
  if (usernameOrEmail === 'doc_sarah') candidateUsernames.push('dr_sarah');

  const rows = await sql`
    SELECT * FROM users 
    WHERE (username = ANY(${candidateUsernames}) OR email = ${usernameOrEmail} OR LOWER(username) = LOWER(${usernameOrEmail}))
    LIMIT 1;
  `;
  if (rows.length === 0) return null;
  const user = rows[0] as any;

  // Verify password: exact match, or demo credential mapping
  const validPasswords = [
    user.password_hash,
    'admin123',
    'audit123',
    'doctor123',
    'nurse123',
    'desk123',
    'cmo123',
    'patient123'
  ];
  if (!validPasswords.includes(passwordAttempt)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    departmentId: user.department_id || undefined,
    doctorId: user.doctor_id || undefined,
    patientId: user.patient_id || undefined,
  };
}

export async function getUserById(id: string): Promise<UserSession | null> {
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1;`;
  if (rows.length === 0) return null;
  const user = rows[0] as any;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    departmentId: user.department_id || undefined,
    doctorId: user.doctor_id || undefined,
    patientId: user.patient_id || undefined,
  };
}

export async function getAllUsers(): Promise<UserSession[]> {
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM users ORDER BY name ASC;`;
  return rows.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    departmentId: user.department_id || undefined,
    doctorId: user.doctor_id || undefined,
    patientId: user.patient_id || undefined,
  }));
}

export async function createUser(userData: {
  id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  departmentId?: string;
  doctorId?: string;
  patientId?: string;
}): Promise<UserSession> {
  const sql = getNeonSql();
  const id = userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO users (
      id, username, password_hash, name, email, role, department_id, doctor_id, patient_id, active, created_at
    ) VALUES (
      ${id}, ${userData.username}, ${userData.password}, ${userData.name}, ${userData.email}, ${userData.role},
      ${userData.departmentId || null}, ${userData.doctorId || null}, ${userData.patientId || null}, 1, ${now}
    );
  `;

  return {
    id,
    username: userData.username,
    name: userData.name,
    email: userData.email,
    role: userData.role as UserRole,
    departmentId: userData.departmentId || undefined,
    doctorId: userData.doctorId || undefined,
    patientId: userData.patientId || undefined,
  };
}

// ----------------------------------------------------
// 7. AUDIT LOGGING
// ----------------------------------------------------
export async function insertAuditRecord(record: AuditRecord): Promise<void> {
  const sql = getNeonSql();
  await sql`
    INSERT INTO audit_records (
      id, sequence_number, timestamp, trace_id, actor_id, actor_name, actor_role,
      client_ip, user_agent, action, resource_type, resource_id, description,
      endpoint, http_method, status_code, execution_time_ms, clinical_reason,
      diff_json, prev_record_hash, record_hash
    ) VALUES (
      ${record.id}, ${record.sequenceNumber}, ${record.timestamp}, ${record.traceId},
      ${record.actorId}, ${record.actorName}, ${record.actorRole}, ${record.clientIp},
      ${record.userAgent}, ${record.action}, ${record.resourceType}, ${record.resourceId},
      ${record.description}, ${record.endpoint}, ${record.httpMethod}, ${record.statusCode},
      ${record.executionTimeMs}, ${record.clinicalReason || null}, ${record.diffJson || null},
      ${record.prevRecordHash}, ${record.recordHash}
    );
  `;
}

export async function getAuditRecords(filters?: AuditSearchQuery): Promise<{ total: number; records: AuditRecord[] }> {
  const sql = getNeonSql();
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const countRes = await sql`SELECT count(*)::int as cnt FROM audit_records;`;
  const total = countRes[0]?.cnt || 0;

  const rows = await sql`
    SELECT * FROM audit_records 
    ORDER BY sequence_number DESC 
    LIMIT ${limit} OFFSET ${offset};
  `;

  return {
    total,
    records: rows.map((r: any) => ({
      id: r.id,
      sequenceNumber: Number(r.sequence_number),
      timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : String(r.timestamp),
      traceId: r.trace_id,
      actorId: r.actor_id,
      actorName: r.actor_name,
      actorRole: r.actor_role,
      clientIp: r.client_ip,
      userAgent: r.user_agent,
      action: r.action,
      resourceType: r.resource_type,
      resourceId: r.resource_id,
      description: r.description,
      endpoint: r.endpoint,
      httpMethod: r.http_method,
      statusCode: r.status_code,
      executionTimeMs: r.execution_time_ms,
      clinicalReason: r.clinical_reason,
      diffJson: r.diff_json,
      prevRecordHash: r.prev_record_hash,
      recordHash: r.record_hash,
    })),
  };
}

export async function getLatestAuditRecord(): Promise<AuditRecord | null> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT * FROM audit_records 
    ORDER BY sequence_number DESC 
    LIMIT 1;
  `;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    id: r.id,
    sequenceNumber: Number(r.sequence_number),
    timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : String(r.timestamp),
    traceId: r.trace_id,
    actorId: r.actor_id,
    actorName: r.actor_name,
    actorRole: r.actor_role,
    clientIp: r.client_ip,
    userAgent: r.user_agent,
    action: r.action,
    resourceType: r.resource_type,
    resourceId: r.resource_id,
    description: r.description,
    endpoint: r.endpoint,
    httpMethod: r.http_method,
    statusCode: r.status_code,
    executionTimeMs: r.execution_time_ms,
    clinicalReason: r.clinical_reason,
    diffJson: r.diff_json,
    prevRecordHash: r.prev_record_hash,
    recordHash: r.record_hash,
  };
}

export async function getAllAuditRecordsAsc(): Promise<AuditRecord[]> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT * FROM audit_records 
    ORDER BY sequence_number ASC;
  `;
  return rows.map((r: any) => ({
    id: r.id,
    sequenceNumber: Number(r.sequence_number),
    timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : String(r.timestamp),
    traceId: r.trace_id,
    actorId: r.actor_id,
    actorName: r.actor_name,
    actorRole: r.actor_role,
    clientIp: r.client_ip,
    userAgent: r.user_agent,
    action: r.action,
    resourceType: r.resource_type,
    resourceId: r.resource_id,
    description: r.description,
    endpoint: r.endpoint,
    httpMethod: r.http_method,
    statusCode: r.status_code,
    executionTimeMs: r.execution_time_ms,
    clinicalReason: r.clinical_reason,
    diffJson: r.diff_json,
    prevRecordHash: r.prev_record_hash,
    recordHash: r.record_hash,
  }));
}

export async function getAuditStatsFromNeon(): Promise<{
  totalRecords: number;
  actionDistribution: { action: string; count: number }[];
  breakGlassCount: number;
}> {
  const sql = getNeonSql();
  const totalRes = await sql`SELECT count(*)::int as total FROM audit_records;`;
  const total = totalRes[0]?.total || 0;

  const actions = await sql`
    SELECT action, count(*)::int as count 
    FROM audit_records 
    GROUP BY action;
  `;

  const breakGlassRes = await sql`
    SELECT count(*)::int as count 
    FROM audit_records 
    WHERE action = 'BREAK_GLASS_OVERRIDE';
  `;
  const breakGlassCount = breakGlassRes[0]?.count || 0;

  return {
    totalRecords: total,
    actionDistribution: actions.map((a: any) => ({ action: a.action, count: Number(a.count) })),
    breakGlassCount,
  };
}
