import { SEED_DEPARTMENTS, type UserRole, type UserSession } from "@hospital/contracts"

/** HR-style fields with no API source yet. Merged by username and always labelled "demo". */
export interface DemoProfile {
  employeeId: string
  licenseNumber?: string
  shift: "ACTIVE" | "ON_DUTY" | "ON_CALL"
  joinedDate: string
}

const DEMO_PROFILES: Record<string, DemoProfile> = {
  admin: { employeeId: "ADM-001", licenseNumber: "MD-NY-89102", shift: "ACTIVE", joinedDate: "2015-04-12" },
  auditor: { employeeId: "AUD-004", licenseNumber: "JD-CHC-4912", shift: "ACTIVE", joinedDate: "2018-09-01" },
  dr_sarah: { employeeId: "DOC-102", licenseNumber: "MD-CARD-91024", shift: "ON_DUTY", joinedDate: "2019-01-15" },
  dr_elena: { employeeId: "DOC-108", licenseNumber: "MD-NEUR-84192", shift: "ON_DUTY", joinedDate: "2017-11-20" },
  nurse_jane: { employeeId: "NRS-204", licenseNumber: "RN-CCRN-91823", shift: "ON_DUTY", joinedDate: "2021-06-01" },
  reception: { employeeId: "REC-301", shift: "ON_DUTY", joinedDate: "2022-02-15" },
}

export interface StaffRow extends UserSession {
  departmentName: string | null
  /** Present only for seeded demo accounts. */
  demo: DemoProfile | null
}

export const DEPARTMENTS: { id: string; name: string }[] = SEED_DEPARTMENTS.map((d) => ({ id: d.id, name: d.name }))

export function departmentName(id: string | undefined | null) {
  if (!id) return null
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? id
}

/** Staff accounts only (patient-portal accounts are listed separately as a count). */
export function toStaffRows(users: UserSession[]): StaffRow[] {
  return users
    .filter((u) => u.role !== "PATIENT")
    .map((u) => ({ ...u, departmentName: departmentName(u.departmentId), demo: DEMO_PROFILES[u.username] ?? null }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function parseUsers(body: unknown): UserSession[] {
  const list = Array.isArray(body) ? body : Array.isArray((body as any)?.users) ? (body as any).users : []
  return list
    .filter((u: any) => u && typeof u.username === "string")
    .map((u: any) => ({
      id: String(u.id ?? u.username),
      username: String(u.username),
      email: String(u.email ?? ""),
      name: String(u.name ?? u.username),
      role: String(u.role ?? "PATIENT") as UserRole,
      departmentId: u.departmentId || undefined,
      doctorId: u.doctorId || undefined,
      patientId: u.patientId || undefined,
    }))
}

/** Roles an administrator can provision here (PATIENT accounts come from the website). */
export const STAFF_ROLES: { role: UserRole; label: string; prefix: string; licensed: boolean }[] = [
  { role: "DOCTOR", label: "Doctor", prefix: "dr_", licensed: true },
  { role: "NURSE", label: "Nurse", prefix: "nurse_", licensed: true },
  { role: "RECEPTIONIST", label: "Receptionist", prefix: "rec_", licensed: false },
  { role: "PHARMACIST", label: "Pharmacist", prefix: "pharm_", licensed: true },
  { role: "LAB_TECHNICIAN", label: "Lab technician", prefix: "lab_", licensed: true },
  { role: "COMPLIANCE_AUDITOR", label: "Compliance auditor", prefix: "aud_", licensed: false },
  { role: "CHIEF_MEDICAL_OFFICER", label: "Chief medical officer", prefix: "cmo_", licensed: true },
  { role: "ADMIN", label: "Administrator", prefix: "adm_", licensed: false },
]

export function roleLabel(role: string) {
  return STAFF_ROLES.find((r) => r.role === role)?.label ?? role.charAt(0) + role.slice(1).toLowerCase().replace(/_/g, " ")
}

export function suggestUsername(name: string, role: UserRole) {
  const prefix = STAFF_ROLES.find((r) => r.role === role)?.prefix ?? "usr_"
  const clean = name
    .toLowerCase()
    .replace(/^(dr|mr|mrs|ms|sister)\.?\s+/, "")
    .split(/[\s,]+/)[0]
    ?.replace(/[^a-z0-9]/g, "")
  return `${prefix}${(clean || "staff").slice(0, 12)}`
}

/** 14-character temporary password from the Web Crypto RNG (no ambiguous characters). */
export function generateTemporaryPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%"
  const bytes = new Uint32Array(14)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join("")
}
