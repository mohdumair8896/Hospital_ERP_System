import { z } from "zod"
import type { CreatePatientDto, Patient } from "@hospital/contracts"
import { apiFetch } from "@/lib/api"

/**
 * Client copy of the gateway's CreatePatientSchema (apps/api-gateway/src/security.ts), so the
 * form rejects exactly what the server rejects. Allergies are typed as a comma-separated list.
 */
export const GENDERS = ["MALE", "FEMALE", "OTHER", "UNDISCLOSED"] as const
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "Keep it under 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Keep it under 50 characters"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD"),
  gender: z.enum(GENDERS, { message: "Select a gender" }),
  bloodGroup: z.enum(BLOOD_GROUPS, { message: "Select a blood group" }),
  phoneNumber: z.string().trim().min(6, "Valid phone number is required").max(25, "Phone number is too long"),
  email: z.string().trim().email("Valid email is required"),
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(2, "Postal code is required"),
  emergencyContactName: z.string().trim().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().trim().min(6, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().trim().min(1, "Emergency contact relationship is required"),
  allergies: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
})

export type RegistrationInput = z.input<typeof registrationSchema>
export type RegistrationValues = z.output<typeof registrationSchema>

export const REGISTRATION_DEFAULTS: RegistrationInput = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "" as RegistrationInput["gender"],
  bloodGroup: "" as RegistrationInput["bloodGroup"],
  phoneNumber: "",
  email: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  allergies: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
}

/** Form values → the existing POST /api/v1/patients payload. */
export function toCreatePatientDto(v: RegistrationValues): CreatePatientDto {
  const allergies = (v.allergies ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  const insuranceProvider = v.insuranceProvider?.trim()
  const insurancePolicyNumber = v.insurancePolicyNumber?.trim()
  return {
    firstName: v.firstName,
    lastName: v.lastName,
    dateOfBirth: v.dateOfBirth,
    gender: v.gender,
    bloodGroup: v.bloodGroup,
    phoneNumber: v.phoneNumber,
    email: v.email,
    street: v.street,
    city: v.city,
    state: v.state,
    postalCode: v.postalCode,
    emergencyContactName: v.emergencyContactName,
    emergencyContactPhone: v.emergencyContactPhone,
    emergencyContactRelation: v.emergencyContactRelation,
    ...(allergies.length ? { allergies } : {}),
    ...(insuranceProvider ? { insuranceProvider } : {}),
    ...(insurancePolicyNumber ? { insurancePolicyNumber } : {}),
  }
}

export interface DuplicateMatch {
  patient: Patient
  reasons: string[]
}

const digitsOf = (s: string | undefined) => (s ?? "").replace(/\D/g, "")

/**
 * Duplicate check before create: searches the registry by last name and by phone digits, then
 * keeps records with the same last name or the same phone number (last 7 digits).
 */
export async function findPossibleDuplicates(v: Pick<RegistrationValues, "lastName" | "firstName" | "phoneNumber">) {
  const phone = digitsOf(v.phoneNumber)
  const terms = [v.lastName.trim(), phone.length >= 4 ? phone.slice(-4) : ""].filter(Boolean)
  const results = await Promise.all(
    terms.map(async (q) => {
      const res = await apiFetch(`/api/v1/patients?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error(`Duplicate check failed (${res.status})`)
      const data = await res.json()
      return (Array.isArray(data?.patients) ? data.patients : []) as Patient[]
    })
  )
  const byId = new Map<string, DuplicateMatch>()
  for (const p of results.flat()) {
    const reasons: string[] = []
    const sameLast = p.lastName?.trim().toLowerCase() === v.lastName.trim().toLowerCase()
    if (sameLast && p.firstName?.trim().toLowerCase() === v.firstName.trim().toLowerCase()) reasons.push("Same name")
    else if (sameLast) reasons.push("Same last name")
    const theirs = digitsOf(p.phoneNumber)
    if (phone.length >= 7 && theirs.length >= 7 && theirs.slice(-7) === phone.slice(-7)) reasons.push("Same phone")
    if (reasons.length && !byId.has(p.id)) byId.set(p.id, { patient: p, reasons })
  }
  return [...byId.values()].sort((a, b) => b.reasons.length - a.reasons.length).slice(0, 6)
}
