// ==========================================
// HOSPITAL PLATFORM ENTERPRISE CONTRACTS
// ==========================================

export type UserRole = 
  | 'ADMIN'
  | 'CHIEF_MEDICAL_OFFICER'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'COMPLIANCE_AUDITOR'
  | 'PATIENT';

export interface UserSession {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  doctorId?: string;
  patientId?: string;
}

// ------------------------------------------
// Patient Domain
// ------------------------------------------
export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g., MRN-2026-00412)
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNDISCLOSED';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phoneNumber: string;
  email: string;
  address: PatientAddress;
  emergencyContact: EmergencyContact;
  allergies: string[];
  activeMedications: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNDISCLOSED';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  allergies?: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

// ------------------------------------------
// Doctor & Department Domain
// ------------------------------------------
export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  headDoctorId?: string;
  location: string;
  emergencySupport: boolean;
  icon: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "Dr. Sarah Patel, MD, FACC"
  specialty: string;
  departmentId: string;
  qualification: string;
  experienceYears: number;
  rating: number; // e.g., 4.9
  reviewCount: number;
  consultationFee: number;
  availableDays: string[]; // ["Monday", "Tuesday", "Thursday"]
  availableSlots: string[]; // ["09:00 AM", "10:30 AM", "02:00 PM"]
  avatarUrl: string;
  bio: string;
  phone: string;
  email: string;
}

// ------------------------------------------
// Appointment Domain
// ------------------------------------------
export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentType = 
  | 'OPD_IN_PERSON'
  | 'TELEHEALTH_VIRTUAL'
  | 'EMERGENCY_TRAUMA'
  | 'FOLLOW_UP';

export interface Appointment {
  id: string;
  appointmentNumber: string; // e.g. "APT-2026-8841"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  slotDate: string; // YYYY-MM-DD
  slotTime: string; // "10:00 AM"
  type: AppointmentType;
  status: AppointmentStatus;
  symptoms: string;
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookAppointmentDto {
  patientId?: string;
  // If guest/new patient
  newPatient?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
  };
  doctorId: string;
  departmentId: string;
  slotDate: string;
  slotTime: string;
  type: AppointmentType;
  symptoms: string;
}

// ------------------------------------------
// Clinical & Encounter Domain
// ------------------------------------------
export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRateBpm: number;
  respiratoryRate: number;
  bodyTemperatureCelsius: number;
  oxygenSaturationSpO2: number;
  bloodGlucoseMgDl?: number;
  recordedAt: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string; // e.g. "TDS (3 times daily)"
  duration: string;  // e.g. "7 days"
  instructions: string;
}

export interface ClinicalEncounter {
  id: string;
  encounterNumber: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  type: 'OPD' | 'IPD' | 'EMERGENCY';
  chiefComplaint: string;
  vitals: VitalSigns;
  primaryDiagnosisCode: string; // e.g. "I10" (Essential hypertension)
  primaryDiagnosisName: string;
  secondaryDiagnoses?: string[];
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  labOrders?: string[];
  status: 'OPEN' | 'FINALIZED' | 'AMENDED';
  createdAt: string;
  finalizedAt?: string;
}

// ------------------------------------------
// AUDIT LOGGING & GOVERNANCE CONTRACT
// Mandatory for HIPAA § 164.312(b), JCI, NABH
// ------------------------------------------
export type AuditAction = 
  | 'READ'
  | 'SEARCH'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'PRINT'
  | 'BREAK_GLASS_OVERRIDE';

export type AuditResourceType = 
  | 'PATIENT'
  | 'APPOINTMENT'
  | 'CLINICAL_ENCOUNTER'
  | 'PRESCRIPTION'
  | 'LAB_RESULT'
  | 'BILLING_INVOICE'
  | 'USER_ACCOUNT'
  | 'SYSTEM_CONFIG';

export interface AuditRecord {
  id: string;
  sequenceNumber: number;
  timestamp: string; // ISO 8601 UTC with microsecond precision
  traceId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  clientIp: string;
  userAgent: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  description: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  executionTimeMs: number;
  clinicalReason?: string; // Mandatory for BREAK_GLASS or sensitive reads
  previousStateHash?: string;
  newStateHash?: string;
  diffJson?: string; // JSON diff of changes
  prevRecordHash: string; // SHA-256 of the prior audit record (blockchain-style tamper evidence)
  recordHash: string; // SHA-256 of (id + sequenceNumber + timestamp + actorId + action + resourceId + prevRecordHash)
}

export interface AuditSearchQuery {
  startDate?: string;
  endDate?: string;
  actorId?: string;
  resourceType?: AuditResourceType;
  resourceId?: string;
  action?: AuditAction;
  limit?: number;
  offset?: number;
}

export interface AuditIntegrityVerificationResult {
  verified: boolean;
  totalRecordsChecked: number;
  tamperedRecordIds: string[];
  genesisHash: string;
  latestHash: string;
  verifiedAt: string;
}

// ------------------------------------------
// Standardized Event Bus Schemas (NATS JetStream)
// ------------------------------------------
export interface BaseDomainEvent<T = any> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  sourceService: string;
  traceId: string;
  actorId?: string;
  data: T;
}

export type AppointmentCreatedEvent = BaseDomainEvent<{
  appointmentId: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  slotDate: string;
  slotTime: string;
  type: AppointmentType;
  symptoms: string;
}>;

export type PatientCreatedEvent = BaseDomainEvent<{
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}>;

export type ClinicalEncounterFinalizedEvent = BaseDomainEvent<{
  encounterId: string;
  patientId: string;
  doctorId: string;
  primaryDiagnosisCode: string;
  primaryDiagnosisName: string;
  prescriptionsCount: number;
}>;

export type AuditLogEmittedEvent = BaseDomainEvent<Omit<AuditRecord, 'id' | 'sequenceNumber' | 'prevRecordHash' | 'recordHash'>>;

// Canonical platform seed data
import { PRESET_STAFF_USERS as _PRESET, SEED_DEPARTMENTS as _DEPTS, SEED_DOCTORS as _DOCS } from './seed-data.js';
export const PRESET_STAFF_USERS = _PRESET;
export const SEED_DEPARTMENTS = _DEPTS;
export const SEED_DOCTORS = _DOCS;
export * from './seed-data.js';
