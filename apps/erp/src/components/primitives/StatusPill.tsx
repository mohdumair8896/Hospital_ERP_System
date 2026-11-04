import * as React from "react"
import { cn } from "@/lib/utils"

/** Visual tones a status can map to. */
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral"

/** Token classes per tone (bg / text / border / dot). Every pair passes WCAG AA. */
export const STATUS_TONE_CLASSES: Record<StatusTone, { pill: string; dot: string }> = {
  success: { pill: "bg-care-soft text-care border-care/25", dot: "bg-care" },
  warning: { pill: "bg-dept-amber-bg text-dept-amber-fg border-dept-amber-fg/25", dot: "bg-dept-amber-fg" },
  danger: { pill: "bg-alert-soft text-alert border-alert/25", dot: "bg-alert" },
  info: { pill: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary" },
  neutral: { pill: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
}

/**
 * Default status → tone map. Keys are normalised (upper case, spaces/dashes → `_`).
 * Extend per call with the `toneMap` prop, or spread it: `{ ...STATUS_TONES, TRIAGED: "info" }`.
 */
export const STATUS_TONES: Record<string, StatusTone> = {
  // services / integrations
  ONLINE: "success",
  HEALTHY: "success",
  UP: "success",
  DEGRADED: "warning",
  OFFLINE: "danger",
  DOWN: "danger",
  // appointments and queue
  SCHEDULED: "info",
  CONFIRMED: "info",
  CHECKED_IN: "info",
  WAITING: "warning",
  TRIAGE: "info",
  IN_PROGRESS: "warning",
  WITH_DOCTOR: "info",
  COMPLETED: "success",
  DONE: "success",
  CANCELLED: "neutral",
  NO_SHOW: "danger",
  // encounters
  DRAFT: "neutral",
  OPEN: "info",
  ACTIVE: "success",
  SIGNED: "success",
  CLOSED: "neutral",
  // staff accounts
  PENDING: "warning",
  INACTIVE: "neutral",
  SUSPENDED: "danger",
  LOCKED: "danger",
  // audit
  CREATE: "success",
  READ: "info",
  UPDATE: "warning",
  DELETE: "danger",
  LOGIN: "neutral",
  LOGOUT: "neutral",
  EXPORT: "warning",
  VERIFIED: "success",
  TAMPERED: "danger",
  FAILED: "danger",
}

/** Normalise a raw status into a map key ("in progress" → "IN_PROGRESS"). */
export function normalizeStatus(status: string) {
  return status.trim().toUpperCase().replace(/[\s-]+/g, "_")
}

/** Resolve the tone for a status, falling back to "neutral". */
export function toneForStatus(status: string, toneMap?: Record<string, StatusTone>): StatusTone {
  const key = normalizeStatus(status)
  return toneMap?.[key] ?? STATUS_TONES[key] ?? "neutral"
}

/** "IN_PROGRESS" → "In progress" */
export function humanizeStatus(status: string) {
  const words = status.trim().replace(/[_-]+/g, " ").toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export interface StatusPillProps {
  /** Raw status, e.g. "IN_PROGRESS" or "Offline". */
  status: string
  /** Display text (defaults to the humanised status). Text is always shown. */
  label?: React.ReactNode
  /** Force a tone instead of looking it up. */
  tone?: StatusTone
  /** Extra status → tone entries, merged over STATUS_TONES. */
  toneMap?: Record<string, StatusTone>
  /** Leading dot (default true). */
  dot?: boolean
  size?: "sm" | "md"
  className?: string
}

/** Soft-tinted status pill: tone colour plus a text label, never colour alone. */
export function StatusPill({ status, label, tone, toneMap, dot = true, size = "sm", className }: StatusPillProps) {
  const resolved = tone ?? toneForStatus(status, toneMap)
  const classes = STATUS_TONE_CLASSES[resolved]
  return (
    <span
      data-tone={resolved}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium",
        size === "sm" ? "h-5 px-2 text-[11px]" : "h-6 px-2.5 text-xs",
        classes.pill,
        className
      )}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", classes.dot)} />}
      {label ?? humanizeStatus(status)}
    </span>
  )
}
