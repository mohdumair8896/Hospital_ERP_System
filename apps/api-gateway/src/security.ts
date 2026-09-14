import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { UserRole, UserSession } from '@hospital/contracts';

// =======================================================
// 1. ZOD VALIDATION SCHEMAS
// =======================================================

export const LoginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required').max(100),
});

export const CreateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum([
    'ADMIN',
    'CHIEF_MEDICAL_OFFICER',
    'DOCTOR',
    'NURSE',
    'RECEPTIONIST',
    'PHARMACIST',
    'LAB_TECHNICIAN',
    'COMPLIANCE_AUDITOR',
    'PATIENT',
  ]),
  departmentId: z.string().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
});

export const AppointmentBookingSchema = z
  .object({
    doctorId: z.string().min(1, 'Doctor ID is required'),
    departmentId: z.string().min(1, 'Department ID is required'),
    slotDate: z.string().optional(),
    date: z.string().optional(),
    slotTime: z.string().optional(),
    timeSlot: z.string().optional(),
    type: z.string().optional().default('OPD_IN_PERSON'),
    symptoms: z.string().max(1000).optional(),
    reason: z.string().max(1000).optional(),
    patientId: z.string().optional(),
    patientName: z.string().max(100).optional(),
    phone: z.string().max(25).optional(),
    patientPhone: z.string().max(25).optional(),
    email: z.string().optional(),
    patientEmail: z.string().optional(),
    consentToTreatment: z.boolean().optional(),
    newPatient: z
      .object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        phoneNumber: z.string().min(4, 'Phone number is required'),
        email: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    data => {
      return !!((data.slotDate || data.date) && (data.slotTime || data.timeSlot));
    },
    {
      message: 'Appointment slot date and time are required',
      path: ['slotDate'],
    }
  )
  .refine(
    data => {
      const hasPhone = data.phone || data.patientPhone;
      return !!(
        data.patientId ||
        (data.newPatient && data.newPatient.firstName && data.newPatient.phoneNumber) ||
        (data.patientName && hasPhone)
      );
    },
    {
      message: 'Patient details (name and contact) or patientId must be provided',
      path: ['patientName'],
    }
  )
  .transform(data => {
    const slotDate = data.slotDate || data.date!;
    const slotTime = data.slotTime || data.timeSlot!;
    const symptoms = data.symptoms || data.reason || 'General Medical Consultation';
    const contactPhone = data.phone || data.patientPhone || '+1 (555) 000-0000';
    const contactEmail = data.email || data.patientEmail || 'patient@hospital.com';

    let newPatient = data.newPatient;
    if (!newPatient && data.patientName) {
      const parts = data.patientName.trim().split(' ');
      newPatient = {
        firstName: parts[0] || 'Guest',
        lastName: parts.slice(1).join(' ') || 'Patient',
        phoneNumber: contactPhone,
        email: contactEmail,
      };
    }

    return {
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      slotDate,
      slotTime,
      type: data.type || 'OPD_IN_PERSON',
      symptoms,
      patientId: data.patientId,
      newPatient,
      patientName: data.patientName,
      patientPhone: contactPhone,
      patientEmail: contactEmail,
    };
  });

export const CreatePatientSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  phoneNumber: z.string().trim().min(6, 'Valid phone number is required').max(25),
  email: z.string().trim().email('Valid email is required'),
  street: z.string().trim().min(1, 'Street is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  postalCode: z.string().trim().min(2, 'Postal code is required'),
  emergencyContactName: z.string().trim().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().trim().min(6, 'Emergency contact phone is required'),
  emergencyContactRelation: z.string().trim().min(1, 'Emergency contact relationship is required'),
  allergies: z.array(z.string()).optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
});

export const CreateEncounterSchema = z.object({
  patientId: z.string().min(1, 'patientId is required'),
  doctorId: z.string().min(1, 'doctorId is required'),
  doctorName: z.string().optional(),
  appointmentId: z.string().optional(),
  type: z.enum(['OPD', 'IPD', 'EMERGENCY']),
  chiefComplaint: z.string().min(2, 'Chief complaint must be at least 2 characters'),
  vitals: z.object({
    bloodPressureSystolic: z.number().int().min(50).max(260),
    bloodPressureDiastolic: z.number().int().min(30).max(180),
    heartRateBpm: z.number().int().min(30).max(240),
    temperatureCelsius: z.number().min(30).max(45),
    respiratoryRate: z.number().int().min(5).max(60),
    oxygenSaturationPercent: z.number().int().min(50).max(100),
    recordedAt: z.string().optional(),
  }),
  primaryDiagnosisCode: z.string().min(2, 'ICD-10 code is required'),
  primaryDiagnosisName: z.string().min(2, 'Diagnosis description is required'),
  secondaryDiagnoses: z.array(z.string()).optional(),
  clinicalNotes: z.string().min(2, 'Clinical notes are required'),
  prescriptions: z.array(z.object({
    medicationName: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    durationDays: z.number().int().positive(),
    instructions: z.string(),
  })).optional(),
});

// =======================================================
// 2. XSS & INPUT SANITIZATION
// =======================================================

function sanitizeString(str: string): string {
  // Disarm HTML/JS script injection, javascript: pseudo-protocols, and inline event handlers
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

export function sanitizeInput(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizeInput(value);
    }
    return cleaned;
  }
  return obj;
}

export function xssSanitizerMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  next();
}

// =======================================================
// 3. AUTHENTICATION & SESSION PARSING
// =======================================================

export interface AuthenticatedRequest extends Request {
  user?: UserSession;
}

export function decodeSession(token: string): UserSession | null {
  try {
    const raw = token.startsWith('tok_') ? token.slice(4) : token;
    const jsonStr = Buffer.from(raw, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.id && parsed.role) {
      return parsed as UserSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function authContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = decodeSession(token);
    if (session) {
      (req as AuthenticatedRequest).user = session;
      req.headers['x-user-id'] = session.id;
      req.headers['x-user-name'] = session.name;
      req.headers['x-user-role'] = session.role;
      if (session.patientId) req.headers['x-patient-id'] = session.patientId;
      if (session.doctorId) req.headers['x-doctor-id'] = session.doctorId;
      if (session.departmentId) req.headers['x-department-id'] = session.departmentId;
    }
  }
  next();
}

// =======================================================
// 4. ROUTE LOCKS & RECORD-LEVEL SECURITY (RLS)
// =======================================================

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication token is required to access this healthcare resource',
      code: 'AUTH_REQUIRED',
    });
  }
  next();
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized: Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden: Role '${user.role}' does not possess required privileges (${allowedRoles.join(', ')})`,
        code: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    next();
  };
}

/**
 * Enforce strict Record-Level Security (RLS) and IDOR defense:
 * 1. Admin & Compliance Auditor routes (/api/v1/audit/*) locked to ADMIN and COMPLIANCE_AUDITOR.
 * 2. Clinical routes (/api/v1/clinical/*) locked to authenticated clinical staff or matching patient.
 * 3. Patient record access: A PATIENT can ONLY access their own patient ID. Attempting to view another
 *    patient's ID triggers an immediate 403 Forbidden with IDOR alert.
 * 4. Patient registry listing (/api/v1/patients without ID): Patients cannot list all patients.
 */
export function enforceRecordLevelSecurity(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const user = (req as AuthenticatedRequest).user;

  // 0. Staff Provisioning Lockdown: ONLY ADMIN can create users
  if (path === '/api/v1/auth/users' && req.method === 'POST') {
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized: Staff credential provisioning requires administrative authentication',
        code: 'AUTH_REQUIRED',
      });
    }
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden: Only hospital administrators can provision staff credentials',
        code: 'ADMIN_REQUIRED',
      });
    }
    return next();
  }

  // 1. Audit route lockdown: ONLY ADMIN & COMPLIANCE_AUDITOR
  if (path.startsWith('/api/v1/audit')) {
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized: Audit and compliance logs require authentication',
        code: 'AUDIT_AUTH_REQUIRED',
      });
    }
    if (user.role !== 'ADMIN' && user.role !== 'COMPLIANCE_AUDITOR') {
      return res.status(403).json({
        error: 'Forbidden: Access to cryptographic audit logs and compliance trails is strictly restricted to ADMIN and COMPLIANCE_AUDITOR roles',
        code: 'AUDIT_ACCESS_DENIED',
      });
    }
    return next();
  }

  // 2. Clinical routes lockdown: MUST be authenticated
  if (path.startsWith('/api/v1/clinical')) {
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized: Clinical encounter and diagnostic data requires an authenticated medical session',
        code: 'CLINICAL_AUTH_REQUIRED',
      });
    }

    // If a patient is querying encounters, enforce patient isolation
    if (user.role === 'PATIENT') {
      const queryPatientId = req.query.patientId as string;
      if (queryPatientId && queryPatientId !== user.patientId) {
        return res.status(403).json({
          error: 'Forbidden: Record-level isolation enforced. Patients are strictly prohibited from viewing encounters of other patients (IDOR blocked).',
          code: 'IDOR_PREVENTED',
          requestedId: queryPatientId,
        });
      }
    }

    return next();
  }

  // 3. Patient directory & record access
  if (path.startsWith('/api/v1/patients')) {
    // Creating patient on registration is public (for appointment booking)
    if (req.method === 'POST') {
      return next();
    }

    // Specific patient ID query: /api/v1/patients/:id
    const parts = path.split('/');
    const requestedPatientId = parts.length >= 5 ? parts[4] : undefined;

    if (requestedPatientId) {
      if (user && user.role === 'PATIENT') {
        // Enforce IDOR protection: patient can ONLY read their own record!
        if (user.patientId && requestedPatientId !== user.patientId) {
          return res.status(403).json({
            error: 'Forbidden: IDOR attack blocked. You do not have permission to view this medical record.',
            code: 'IDOR_PREVENTED',
            requestedRecord: requestedPatientId,
          });
        }
      }
    } else if (req.method === 'GET') {
      // General list of patients: /api/v1/patients
      if (user && user.role === 'PATIENT') {
        return res.status(403).json({
          error: 'Forbidden: Patients cannot view the global hospital patient registry.',
          code: 'PATIENT_DIRECTORY_RESTRICTED',
        });
      }
    }
  }

  next();
}

// =======================================================
// 5. REQUEST BODY VALIDATION MIDDLEWARE HELPER
// =======================================================

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Failed: Input parameters violate clinical data contract',
          code: 'INPUT_VALIDATION_ERROR',
          details: err.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  };
}
