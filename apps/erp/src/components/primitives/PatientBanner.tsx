import * as React from "react"
import type { Patient } from "@hospital/contracts"
import { AlertTriangle, Droplet, Phone, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusPill } from "./StatusPill"

export interface PatientBannerProps {
  patient: Patient
  /** e.g. "IN_PROGRESS", "DRAFT", "SIGNED"; rendered as a StatusPill next to the name. */
  encounterStatus?: string
  /** Attending clinician's display name. */
  attending?: string
  /** Primary actions, right-aligned (buttons, menus). */
  actions?: React.ReactNode
  className?: string
}

const SEX_LABEL: Record<Patient["gender"], string> = {
  MALE: "M",
  FEMALE: "F",
  OTHER: "Other",
  UNDISCLOSED: "Undisclosed",
}

/** Whole years between `dob` (YYYY-MM-DD) and today; null when unparseable. */
export function ageFromDob(dob: string | undefined): number | null {
  if (!dob) return null
  const birth = new Date(`${dob.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age >= 0 ? age : null
}

function initials(first?: string, last?: string) {
  return `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase() || "?"
}

/**
 * Sticky identity strip for the patient in context: name, MRN, age/sex, blood group,
 * allergies (alert chip, or "No known allergies"), contact, attending and encounter status.
 * Sticks under the 56px app header (`top-14`); override with `className` if needed.
 */
export function PatientBanner({ patient, encounterStatus, attending, actions, className }: PatientBannerProps) {
  const name = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim() || "Unnamed patient"
  const age = ageFromDob(patient.dateOfBirth)
  const sex = SEX_LABEL[patient.gender] ?? patient.gender
  const allergies = (patient.allergies ?? []).filter(Boolean)

  return (
    <section
      aria-label={`Patient: ${name}`}
      className={cn(
        "sticky top-14 z-10 rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-soft backdrop-blur-sm sm:px-4 sm:py-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:size-11 sm:text-base"
          >
            {initials(patient.firstName, patient.lastName)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="truncate text-base font-semibold leading-tight text-foreground sm:text-lg">{name}</h2>
              {encounterStatus && <StatusPill status={encounterStatus} />}
            </div>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="font-mono font-medium text-foreground">{patient.mrn}</span>
              <span aria-hidden="true">·</span>
              <span>
                {age !== null ? `${age} y` : "Age unknown"} · {sex}
              </span>
              {patient.dateOfBirth && (
                <span className="hidden sm:inline">
                  <span aria-hidden="true">· </span>DOB {patient.dateOfBirth.slice(0, 10)}
                </span>
              )}
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Clinical flags">
          {patient.bloodGroup && (
            <li className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-muted px-2 text-xs font-medium text-foreground">
              <Droplet className="size-3 text-alert" aria-hidden="true" />
              <span className="sr-only">Blood group</span>
              {patient.bloodGroup}
            </li>
          )}
          {allergies.length > 0 ? (
            <li
              title={allergies.join(", ")}
              className="inline-flex h-6 max-w-[16rem] items-center gap-1 rounded-full border border-alert/30 bg-alert-soft px-2 text-xs font-semibold text-alert"
            >
              <AlertTriangle className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">Allergies: {allergies.join(", ")}</span>
            </li>
          ) : (
            <li className="inline-flex h-6 items-center rounded-full border border-border bg-muted px-2 text-xs font-medium text-muted-foreground">
              No known allergies
            </li>
          )}
        </ul>

        {(attending || patient.phoneNumber) && (
          <dl className="hidden items-center gap-x-4 text-xs text-muted-foreground md:flex">
            {attending && (
              <div className="flex items-center gap-1.5">
                <UserRound className="size-3.5" aria-hidden="true" />
                <dt className="sr-only">Attending</dt>
                <dd className="font-medium text-foreground">{attending}</dd>
              </div>
            )}
            {patient.phoneNumber && (
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5" aria-hidden="true" />
                <dt className="sr-only">Contact</dt>
                <dd className="tabular-nums">{patient.phoneNumber}</dd>
              </div>
            )}
          </dl>
        )}

        {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </section>
  )
}
