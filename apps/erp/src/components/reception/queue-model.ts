import type { Appointment, AppointmentStatus } from "@hospital/contracts"
import type { StatusTone } from "@/components/primitives"

/**
 * Queue model for the Reception Desk.
 *
 * The contract (`AppointmentStatus`) has no separate CHECKED_IN state, so checking a patient in
 * moves a CONFIRMED appointment to IN_PROGRESS (the same transition the desk always used).
 */

export type QueueColumnId = "SCHEDULED" | "CONFIRMED" | "IN_CONSULT" | "DONE"

export interface QueueColumn {
  id: QueueColumnId
  title: string
  hint: string
  statuses: AppointmentStatus[]
}

export const QUEUE_COLUMNS: QueueColumn[] = [
  { id: "SCHEDULED", title: "Waiting", hint: "Booked, not yet confirmed", statuses: ["SCHEDULED"] },
  { id: "CONFIRMED", title: "Confirmed", hint: "Expected at the desk", statuses: ["CONFIRMED"] },
  { id: "IN_CONSULT", title: "Checked in · In consult", hint: "With the doctor", statuses: ["IN_PROGRESS"] },
  { id: "DONE", title: "Done / No-show", hint: "Completed, no-show or cancelled", statuses: ["COMPLETED", "NO_SHOW", "CANCELLED"] },
]

/** Short labels used on pills and in toasts. */
export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "Waiting",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In consultation",
  COMPLETED: "Done",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
}

export interface StatusTransition {
  to: AppointmentStatus
  label: string
  intent: "primary" | "secondary" | "danger"
}

/** The only next statuses the desk may set from each status. Terminal states have none. */
export const NEXT_STATUSES: Record<AppointmentStatus, StatusTransition[]> = {
  SCHEDULED: [
    { to: "CONFIRMED", label: "Confirm appointment", intent: "primary" },
    { to: "CANCELLED", label: "Cancel appointment", intent: "danger" },
  ],
  CONFIRMED: [
    { to: "IN_PROGRESS", label: "Check in · start consult", intent: "primary" },
    { to: "NO_SHOW", label: "Mark no-show", intent: "danger" },
    { to: "CANCELLED", label: "Cancel appointment", intent: "secondary" },
  ],
  IN_PROGRESS: [{ to: "COMPLETED", label: "Mark consultation done", intent: "primary" }],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export const TYPE_LABELS: Record<string, string> = {
  OPD_IN_PERSON: "OPD · in person",
  TELEHEALTH_VIRTUAL: "Telehealth",
  EMERGENCY_TRAUMA: "Emergency",
  FOLLOW_UP: "Follow-up",
}

/* ---------- slot time and wait time ---------- */

/** Minutes past the slot before the wait badge turns amber, then red. */
export const WAIT_AMBER_MIN = 15
export const WAIT_RED_MIN = 30

/** Parse `slotDate` (YYYY-MM-DD) + `slotTime` ("10:30 AM" or "14:00") as local time. */
export function slotDateTime(appt: Pick<Appointment, "slotDate" | "slotTime">): Date | null {
  const date = /^(\d{4})-(\d{2})-(\d{2})/.exec(appt.slotDate ?? "")
  if (!date) return null
  const time = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?/.exec((appt.slotTime ?? "").trim())
  let hours = time ? Number(time[1]) : 0
  const minutes = time ? Number(time[2]) : 0
  const meridiem = time?.[3]?.toUpperCase()
  if (meridiem === "PM" && hours < 12) hours += 12
  if (meridiem === "AM" && hours === 12) hours = 0
  return new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]), hours, minutes)
}

export function formatDuration(totalMinutes: number) {
  const m = Math.max(0, Math.round(totalMinutes))
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${m % 60}m`
  return `${Math.floor(h / 24)}d`
}

export interface WaitInfo {
  label: string
  /** Full sentence for screen readers and the tooltip. */
  description: string
  tone: Extract<StatusTone, "neutral" | "warning" | "danger" | "info">
}

/** Wait badge for appointments still waiting (SCHEDULED / CONFIRMED); null otherwise. */
export function waitInfo(appt: Appointment, now: Date): WaitInfo | null {
  if (appt.status !== "SCHEDULED" && appt.status !== "CONFIRMED") return null
  const at = slotDateTime(appt)
  if (!at) return null
  const diff = (now.getTime() - at.getTime()) / 60000
  if (diff < 0) {
    const sameDay = at.toDateString() === now.toDateString()
    return sameDay
      ? { label: `Due in ${formatDuration(-diff)}`, description: `Slot starts in ${formatDuration(-diff)}`, tone: "info" }
      : { label: `Due ${formatSlotDate(appt.slotDate)}`, description: `Slot on ${formatSlotDate(appt.slotDate)}`, tone: "neutral" }
  }
  const tone = diff >= WAIT_RED_MIN ? "danger" : diff >= WAIT_AMBER_MIN ? "warning" : "neutral"
  if (diff >= 24 * 60) {
    return { label: `Overdue ${formatDuration(diff)}`, description: `${formatDuration(diff)} past the ${appt.slotTime} slot`, tone }
  }
  return { label: `Wait ${formatDuration(diff)}`, description: `${formatDuration(diff)} since the ${appt.slotTime} slot`, tone }
}

/* ---------- dates and filters ---------- */

export function todayIso(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function formatSlotDate(iso: string) {
  const at = slotDateTime({ slotDate: iso, slotTime: "00:00" })
  if (!at) return iso
  if (iso === todayIso()) return "Today"
  return at.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

export interface QueueFilters {
  search: string
  doctorId: string
  departmentId: string
  /** YYYY-MM-DD, or "" for all dates. */
  date: string
  patientId: string
}

export const EMPTY_FILTERS: QueueFilters = { search: "", doctorId: "", departmentId: "", date: "", patientId: "" }

export function hasActiveFilters(f: QueueFilters) {
  return Boolean(f.search.trim() || f.doctorId || f.departmentId || f.date || f.patientId)
}

export function filterAppointments(list: Appointment[], f: QueueFilters) {
  const q = f.search.trim().toLowerCase()
  const digits = q.replace(/\D/g, "")
  return list.filter((a) => {
    if (f.doctorId && a.doctorId !== f.doctorId) return false
    if (f.departmentId && a.departmentId !== f.departmentId) return false
    if (f.date && a.slotDate !== f.date) return false
    if (f.patientId && a.patientId !== f.patientId) return false
    if (!q) return true
    const text = `${a.patientName} ${a.appointmentNumber} ${a.patientEmail ?? ""}`.toLowerCase()
    const phone = (a.patientPhone ?? "").replace(/\D/g, "")
    return text.includes(q) || (digits.length >= 3 && phone.includes(digits))
  })
}

/** Distinct options for a select, sorted by label. */
export function distinctOptions(list: Appointment[], id: "doctorId" | "departmentId", label: "doctorName" | "departmentName") {
  const map = new Map<string, string>()
  for (const a of list) if (a[id]) map.set(a[id], a[label] || a[id])
  return [...map.entries()].map(([value, text]) => ({ value, label: text })).sort((x, y) => x.label.localeCompare(y.label))
}

/** Chronological order by slot; unparsable slots go last. */
export function bySlot(a: Appointment, b: Appointment) {
  return (slotDateTime(a)?.getTime() ?? Infinity) - (slotDateTime(b)?.getTime() ?? Infinity)
}
