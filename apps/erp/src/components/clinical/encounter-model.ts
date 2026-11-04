import type { UserSession } from "@hospital/contracts"

/**
 * Draft model for one clinical encounter, its validation and the POST payload.
 * Form inputs are kept as strings so a field can be empty (no pre-filled vitals).
 */

export type EncounterType = "OPD" | "IPD" | "EMERGENCY"
export const ENCOUNTER_TYPES: { value: EncounterType; label: string }[] = [
  { value: "OPD", label: "OPD" },
  { value: "IPD", label: "IPD" },
  { value: "EMERGENCY", label: "Emergency" },
]

export type VitalKey = "bpSys" | "bpDia" | "heartRate" | "oxygen" | "temp" | "respRate"

export interface VitalSpec {
  key: VitalKey
  label: string
  unit: string
  /** Accepted range; matches the gateway CreateEncounterSchema. */
  min: number
  max: number
  integer: boolean
  placeholder: string
  /** Adult reference range; outside it the value is flagged. */
  normal: [number, number]
  /** Outside this range the flag is critical rather than a warning. */
  critical: [number, number]
}

export const VITAL_SPECS: VitalSpec[] = [
  { key: "bpSys", label: "BP systolic", unit: "mmHg", min: 50, max: 260, integer: true, placeholder: "120", normal: [90, 139], critical: [80, 179] },
  { key: "bpDia", label: "BP diastolic", unit: "mmHg", min: 30, max: 180, integer: true, placeholder: "80", normal: [60, 89], critical: [45, 119] },
  { key: "heartRate", label: "Heart rate", unit: "bpm", min: 30, max: 240, integer: true, placeholder: "72", normal: [60, 100], critical: [40, 130] },
  { key: "oxygen", label: "SpO₂", unit: "%", min: 50, max: 100, integer: true, placeholder: "98", normal: [95, 100], critical: [90, 100] },
  { key: "temp", label: "Temperature", unit: "°C", min: 30, max: 45, integer: false, placeholder: "36.8", normal: [36.1, 37.9], critical: [35, 39.4] },
  { key: "respRate", label: "Respiratory rate", unit: "/min", min: 5, max: 60, integer: true, placeholder: "16", normal: [12, 20], critical: [8, 30] },
]

export type SoapSectionKey = "subjective" | "objective" | "assessment" | "plan"
export const SOAP_SECTIONS: { key: SoapSectionKey; letter: string; label: string; hint: string }[] = [
  { key: "subjective", letter: "S", label: "Subjective", hint: "History and symptoms in the patient's words" },
  { key: "objective", letter: "O", label: "Objective", hint: "Examination findings and results" },
  { key: "assessment", letter: "A", label: "Assessment", hint: "Clinical impression and differentials" },
  { key: "plan", letter: "P", label: "Plan", hint: "Treatment, investigations, follow-up" },
]

export const COMMON_ICD10_DIAGNOSES = [
  { code: "I10", name: "Essential (primary) hypertension" },
  { code: "E11.9", name: "Type 2 diabetes mellitus without complications" },
  { code: "J06.9", name: "Acute upper respiratory infection, unspecified" },
  { code: "I20.9", name: "Angina pectoris, unspecified" },
  { code: "M54.5", name: "Low back pain, unspecified" },
  { code: "K21.9", name: "Gastro-esophageal reflux disease without esophagitis" },
  { code: "G43.909", name: "Migraine, unspecified, not intractable" },
  { code: "J45.909", name: "Unspecified asthma, uncomplicated" },
]

export interface SoapDraft extends Record<SoapSectionKey, string> {
  chiefComplaint: string
  diagnosisCode: string
  diagnosisName: string
}

export interface RxRow {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  durationDays: string
  instructions: string
}

export interface EncounterDraft {
  type: EncounterType
  vitals: Record<VitalKey, string>
  soap: SoapDraft
  rx: RxRow[]
}

export function emptyDraft(): EncounterDraft {
  return {
    type: "OPD",
    vitals: { bpSys: "", bpDia: "", heartRate: "", oxygen: "", temp: "", respRate: "" },
    soap: { chiefComplaint: "", subjective: "", objective: "", assessment: "", plan: "", diagnosisCode: "", diagnosisName: "" },
    rx: [],
  }
}

let rxSeq = 0
export function newRxRow(): RxRow {
  rxSeq += 1
  return { id: `rx_${Date.now()}_${rxSeq}`, medicineName: "", dosage: "", frequency: "", durationDays: "", instructions: "" }
}

const rxHasContent = (r: RxRow) => [r.medicineName, r.dosage, r.frequency, r.durationDays, r.instructions].some((v) => v.trim() !== "")

export function isDraftDirty(d: EncounterDraft) {
  return (
    Object.values(d.vitals).some((v) => v.trim() !== "") ||
    Object.values(d.soap).some((v) => v.trim() !== "") ||
    d.rx.some(rxHasContent)
  )
}

// ---------- vitals ----------

export function vitalError(spec: VitalSpec, raw: string): string | null {
  if (raw.trim() === "") return "Required"
  const n = Number(raw)
  if (!Number.isFinite(n)) return "Enter a number"
  if (spec.integer && !Number.isInteger(n)) return "Use a whole number"
  if (n < spec.min || n > spec.max) return `Must be ${spec.min}–${spec.max} ${spec.unit}`
  return null
}

export type VitalFlag = { direction: "LOW" | "HIGH"; critical: boolean }

/** Flag a valid value outside the adult reference range; null when normal, empty or invalid. */
export function vitalFlag(spec: VitalSpec, raw: string): VitalFlag | null {
  if (vitalError(spec, raw)) return null
  const n = Number(raw)
  if (n < spec.normal[0]) return { direction: "LOW", critical: n < spec.critical[0] }
  if (n > spec.normal[1]) return { direction: "HIGH", critical: n > spec.critical[1] }
  return null
}

export function abnormalVitals(vitals: Record<VitalKey, string>) {
  return VITAL_SPECS.filter((s) => vitalFlag(s, vitals[s.key]) !== null)
}

// ---------- validation ----------

export type SoapIssueKey = "chiefComplaint" | "notes" | "diagnosisCode" | "diagnosisName"
export interface DraftIssues {
  vitals: Partial<Record<VitalKey, string>>
  soap: Partial<Record<SoapIssueKey, string>>
  rx: Record<string, Partial<Record<"medicineName" | "durationDays", string>>>
}

export function composeNotes(soap: SoapDraft) {
  return SOAP_SECTIONS.map((s) => ({ s, text: soap[s.key].trim() }))
    .filter(({ text }) => text !== "")
    .map(({ s, text }) => `${s.label}: ${text}`)
    .join("\n\n")
}

export function validateDraft(d: EncounterDraft): DraftIssues {
  const issues: DraftIssues = { vitals: {}, soap: {}, rx: {} }
  for (const spec of VITAL_SPECS) {
    const err = vitalError(spec, d.vitals[spec.key])
    if (err) issues.vitals[spec.key] = err
  }
  if (!issues.vitals.bpSys && !issues.vitals.bpDia && Number(d.vitals.bpDia) >= Number(d.vitals.bpSys)) {
    issues.vitals.bpDia = "Must be lower than systolic"
  }
  if (d.soap.chiefComplaint.trim().length < 2) issues.soap.chiefComplaint = "Enter the chief complaint (2+ characters)"
  if (composeNotes(d.soap).length < 2) issues.soap.notes = "Write at least one SOAP section"
  if (d.soap.diagnosisCode.trim().length < 2) issues.soap.diagnosisCode = "Enter an ICD-10 code"
  if (d.soap.diagnosisName.trim().length < 2) issues.soap.diagnosisName = "Enter the diagnosis name"
  for (const r of d.rx) {
    if (!rxHasContent(r)) continue
    const rowIssues: DraftIssues["rx"][string] = {}
    if (r.medicineName.trim() === "") rowIssues.medicineName = "Add a medicine name or remove the row"
    const days = Number(r.durationDays)
    if (r.durationDays.trim() === "" || !Number.isInteger(days) || days < 1 || days > 365) {
      rowIssues.durationDays = "1–365 days"
    }
    if (Object.keys(rowIssues).length) issues.rx[r.id] = rowIssues
  }
  return issues
}

export function issueCounts(i: DraftIssues) {
  const soap = Object.keys(i.soap).length
  const vitals = Object.keys(i.vitals).length
  const rx = Object.values(i.rx).reduce((n, r) => n + Object.keys(r).length, 0)
  return { soap, vitals, rx, total: soap + vitals + rx }
}

/** An error is shown once the field has a value, or after a save attempt. */
export function visibleError(raw: string, error: string | undefined | null, showAll: boolean) {
  return error && (showAll || raw.trim() !== "") ? error : undefined
}

// ---------- payload ----------

/**
 * POST /api/v1/clinical/encounters body, using the contracts VitalSigns / PrescriptionItem
 * field names that the gateway's CreateEncounterSchema validates and clinical-service stores.
 * `doctorId` is the signing physician; callers must not sign without one.
 */
export function buildEncounterPayload(d: EncounterDraft, patientId: string, doctorId: string, session: UserSession) {
  const n = (k: VitalKey) => Number(d.vitals[k])
  const prescriptions = d.rx
    .filter((r) => r.medicineName.trim() !== "")
    .map((r) => ({
      medicineName: r.medicineName.trim(),
      dosage: r.dosage.trim(),
      frequency: r.frequency.trim(),
      duration: `${Number(r.durationDays)} days`,
      instructions: r.instructions.trim(),
    }))
  return {
    patientId,
    doctorId,
    doctorName: session.name,
    type: d.type,
    chiefComplaint: d.soap.chiefComplaint.trim(),
    vitals: {
      bloodPressureSystolic: n("bpSys"),
      bloodPressureDiastolic: n("bpDia"),
      heartRateBpm: n("heartRate"),
      oxygenSaturationSpO2: n("oxygen"),
      bodyTemperatureCelsius: n("temp"),
      respiratoryRate: n("respRate"),
      recordedAt: new Date().toISOString(),
    },
    primaryDiagnosisCode: d.soap.diagnosisCode.trim(),
    primaryDiagnosisName: d.soap.diagnosisName.trim(),
    secondaryDiagnoses: [] as string[],
    clinicalNotes: composeNotes(d.soap),
    prescriptions,
  }
}
