import type { AuditAction, AuditRecord, AuditResourceType } from "@hospital/contracts"
import type { StatusTone } from "@/components/primitives"

/** Every action and resource type the audit service records (contracts order). */
export const AUDIT_ACTIONS: AuditAction[] = [
  "READ",
  "SEARCH",
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "EXPORT",
  "PRINT",
  "BREAK_GLASS_OVERRIDE",
]

export const AUDIT_RESOURCES: AuditResourceType[] = [
  "PATIENT",
  "APPOINTMENT",
  "CLINICAL_ENCOUNTER",
  "PRESCRIPTION",
  "LAB_RESULT",
  "BILLING_INVOICE",
  "USER_ACCOUNT",
  "SYSTEM_CONFIG",
]

/** Action → pill tone (merged over STATUS_TONES). */
export const ACTION_TONES: Record<string, StatusTone> = {
  READ: "info",
  SEARCH: "info",
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "danger",
  LOGIN: "neutral",
  LOGOUT: "neutral",
  EXPORT: "warning",
  PRINT: "neutral",
  BREAK_GLASS_OVERRIDE: "danger",
}

export const ACTION_LABELS: Record<string, string> = {
  READ: "Viewed",
  SEARCH: "Searched",
  CREATE: "Created",
  UPDATE: "Updated",
  DELETE: "Deleted",
  LOGIN: "Sign-in",
  LOGOUT: "Sign-out",
  EXPORT: "Exported",
  PRINT: "Printed",
  BREAK_GLASS_OVERRIDE: "Break glass",
}

const RESOURCE_NOUNS: Record<string, [singular: string, plural: string]> = {
  PATIENT: ["patient record", "patient records"],
  APPOINTMENT: ["appointment", "appointments"],
  CLINICAL_ENCOUNTER: ["clinical encounter", "clinical encounters"],
  PRESCRIPTION: ["prescription", "prescriptions"],
  LAB_RESULT: ["lab result", "lab results"],
  BILLING_INVOICE: ["invoice", "invoices"],
  USER_ACCOUNT: ["user account", "user accounts"],
  SYSTEM_CONFIG: ["system setting", "system endpoints"],
}

export function resourceLabel(type: string, plural = false) {
  const nouns = RESOURCE_NOUNS[type]
  if (!nouns) return type.toLowerCase().replace(/_/g, " ")
  return plural ? nouns[1] : nouns[0]
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const isCollection = (r: AuditRecord) => !r.resourceId || r.resourceId === "collection"

/** Outcome of the request behind the event. */
export function outcomeOf(r: AuditRecord): { ok: boolean; label: string } {
  const code = Number(r.statusCode) || 0
  if (code === 401 || code === 403) return { ok: false, label: `Denied · ${code}` }
  if (code >= 400) return { ok: false, label: `Failed · ${code}` }
  return { ok: true, label: code ? `OK · ${code}` : "OK" }
}

/** One plain-language sentence per event ("Viewed patient record pat_1"). */
export function describeEvent(r: AuditRecord): string {
  const failed = !outcomeOf(r).ok
  const many = isCollection(r)
  const noun = resourceLabel(r.resourceType, many)
  const target = many ? noun : `${noun} ${r.resourceId}`

  if (r.action === "LOGIN" || /\/auth\/login$/.test(r.endpoint ?? "")) {
    if (failed) return `Failed sign-in attempt${r.resourceId && !many ? ` for “${r.resourceId}”` : ""}`
    return "Signed in to the ERP"
  }
  if (r.action === "LOGOUT") return "Signed out"
  if (r.action === "BREAK_GLASS_OVERRIDE") return `Emergency break-glass access to ${target}`
  if (r.resourceType === "SYSTEM_CONFIG" && r.action === "READ") {
    const sentence = /status|health/.test(r.endpoint ?? "") ? "Checked system status" : "Read system configuration"
    return failed ? `${sentence} (request ${r.statusCode >= 500 ? "failed" : "rejected"})` : sentence
  }

  let sentence: string
  switch (r.action) {
    case "READ":
      sentence = many ? `Viewed the ${noun} list` : `Opened ${target}`
      break
    case "SEARCH":
      sentence = `Searched ${resourceLabel(r.resourceType, true)}`
      break
    case "CREATE":
      sentence = many ? `Created a new ${resourceLabel(r.resourceType)}` : `Created ${target}`
      break
    case "UPDATE":
      sentence = `Updated ${many ? `a ${resourceLabel(r.resourceType)}` : target}`
      break
    case "DELETE":
      sentence = `Deleted ${many ? `a ${resourceLabel(r.resourceType)}` : target}`
      break
    case "EXPORT":
      sentence = `Exported ${target}`
      break
    case "PRINT":
      sentence = `Printed ${target}`
      break
    default:
      sentence = capitalize(`${String(r.action).toLowerCase().replace(/_/g, " ")} ${target}`)
  }
  return failed ? `${sentence} (request ${r.statusCode >= 500 ? "failed" : "rejected"})` : sentence
}

/** "Dr. Sarah Patel, MD, FACC" → "SP"; anonymous → "?" */
export function initials(name: string | undefined, id: string) {
  if (!name || id === "anonymous") return "?"
  const words = name.replace(/^(Dr|Mr|Mrs|Ms|Sister)\.?\s+/i, "").split(/[\s,()]+/).filter(Boolean)
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "?"
}

export function actorDisplay(r: AuditRecord) {
  if (r.actorId === "anonymous") return { name: "Anonymous request", role: "Not signed in" }
  return { name: r.actorName || r.actorId, role: humanRole(r.actorRole) }
}

export function humanRole(role: string | undefined) {
  if (!role) return "Unknown role"
  const words = role.toLowerCase().replace(/_/g, " ")
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const dateFmt = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" })
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

export function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d)
}

export function formatTime(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : timeFmt.format(d)
}

/** "just now", "5 minutes ago", "yesterday", "3 weeks ago" */
export function relativeTime(iso: string, now = Date.now()) {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ""
  const seconds = Math.round((t - now) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 45) return "just now"
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute")
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour")
  if (abs < 86400 * 30) return rtf.format(Math.round(seconds / 86400), "day")
  if (abs < 86400 * 365) return rtf.format(Math.round(seconds / (86400 * 30)), "month")
  return rtf.format(Math.round(seconds / (86400 * 365)), "year")
}

export interface AuditFilters {
  action: string
  resourceType: string
  actor: string
}

export const EMPTY_FILTERS: AuditFilters = { action: "ALL", resourceType: "ALL", actor: "" }

/** An actor search that looks like an exact user id is also sent to the server as `actorId`. */
export function looksLikeActorId(value: string) {
  const v = value.trim()
  return v === "anonymous" || /^usr_[\w-]+$/.test(v)
}

/**
 * Client-side filter, applied on top of the server query as a safety net so the list stays correct
 * even if a backend store ever ignores a filter param.
 */
export function matchesFilters(r: AuditRecord, f: AuditFilters) {
  if (f.action !== "ALL" && r.action !== f.action) return false
  if (f.resourceType !== "ALL" && r.resourceType !== f.resourceType) return false
  const q = f.actor.trim().toLowerCase()
  if (q) {
    const hay = `${r.actorName ?? ""} ${r.actorId} ${r.actorRole ?? ""}`.toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}
