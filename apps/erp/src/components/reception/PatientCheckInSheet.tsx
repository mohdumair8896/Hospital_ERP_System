import { useEffect, useRef, useState, type ReactNode } from "react"
import { CircleAlert, Loader2 } from "lucide-react"
import type { Appointment, AppointmentStatus, Patient } from "@hospital/contracts"
import { Sheet, Skeleton, StatusPill, ageFromDob, humanizeStatus } from "@/components/primitives"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { buttonClass } from "./controls"
import { NEXT_STATUSES, STATUS_LABELS, TYPE_LABELS, formatSlotDate } from "./queue-model"
import { WaitBadge } from "./WaitBadge"

type PatientState =
  | { status: "loading" }
  | { status: "ready"; patient: Patient }
  | { status: "missing" }
  | { status: "error"; message: string }

interface PatientCheckInSheetProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  now: Date
  pending: boolean
  onChangeStatus: (appointment: Appointment, next: AppointmentStatus) => Promise<boolean>
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium text-foreground">{children || "—"}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-border pt-4 first:border-0 first:pt-0">
      <h3 className="text-eyebrow uppercase text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

/** Side panel (C31 / P-CAL-2): patient + appointment details and the allowed status changes. */
export function PatientCheckInSheet({ appointment: a, open, onOpenChange, now, pending, onChangeStatus }: PatientCheckInSheetProps) {
  const [patient, setPatient] = useState<PatientState>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)
  const [confirming, setConfirming] = useState<AppointmentStatus | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const patientId = a?.patientId

  useEffect(() => setConfirming(null), [a?.id, a?.status])

  useEffect(() => {
    if (!open || !patientId) return
    let cancelled = false
    setPatient({ status: "loading" })
    apiFetch(`/api/v1/patients/${encodeURIComponent(patientId)}`)
      .then(async (res) => {
        if (cancelled) return
        if (res.status === 404) return setPatient({ status: "missing" })
        if (!res.ok) throw new Error(`Patient record unavailable (${res.status})`)
        const record = (await res.json()) as Patient
        // The sheet may have switched to another appointment while the body was read.
        if (!cancelled) setPatient({ status: "ready", patient: record })
      })
      .catch((err) => {
        if (!cancelled) setPatient({ status: "error", message: err instanceof Error && err.message !== "Failed to fetch" ? err.message : "The patient service could not be reached." })
      })
    return () => {
      cancelled = true
    }
  }, [open, patientId, attempt])

  const transitions = a ? NEXT_STATUSES[a.status] : []

  const footer = a ? (
    transitions.length === 0 ? (
      <p className="mr-auto text-xs text-muted-foreground">No further status changes from {STATUS_LABELS[a.status]}.</p>
    ) : (
      transitions.map((t) => {
        const needsConfirm = t.intent === "danger"
        const isConfirming = confirming === t.to
        return (
          <button
            key={t.to}
            type="button"
            data-checkin-action={t.intent}
            disabled={pending}
            onClick={async () => {
              if (needsConfirm && !isConfirming) return setConfirming(t.to)
              const ok = await onChangeStatus(a, t.to)
              // The clicked button is replaced by the next status's actions: keep focus in the panel.
              if (ok) {
                window.setTimeout(() => {
                  const next = document.querySelector<HTMLElement>('[data-checkin-action="primary"]:not(:disabled)')
                  ;(next ?? statusRef.current)?.focus()
                }, 50)
              }
            }}
            className={buttonClass(t.intent === "primary" ? "primary" : t.intent === "danger" ? "danger" : "secondary", "md", "w-full sm:w-auto")}
          >
            {pending && <Loader2 className="motion-safe:animate-spin" aria-hidden="true" />}
            {isConfirming ? `Confirm: ${t.label.toLowerCase()}` : t.label}
          </button>
        )
      })
    )
  ) : null

  return (
    <Sheet
      open={open && Boolean(a)}
      onOpenChange={onOpenChange}
      title={a ? a.patientName : "Appointment"}
      description={a ? `${a.appointmentNumber} · ${a.slotTime}, ${formatSlotDate(a.slotDate)}` : undefined}
      footer={footer}
    >
      {a && (
        <div className="flex flex-col gap-5">
          <div ref={statusRef} tabIndex={-1} className="flex flex-wrap items-center gap-2 outline-none" aria-live="polite">
            <StatusPill status={a.status} label={STATUS_LABELS[a.status]} size="md" />
            <WaitBadge appointment={a} now={now} />
          </div>
          {confirming && (
            <p role="alert" className="flex items-start gap-2 rounded-md border border-alert/25 bg-alert-soft px-3 py-2 text-xs text-alert">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              This can't be undone from the desk. Press the button again to confirm.
            </p>
          )}

          <Section title="Appointment">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Detail label="Doctor">{a.doctorName}</Detail>
              <Detail label="Department">{a.departmentName}</Detail>
              <Detail label="Slot">{`${a.slotTime}, ${formatSlotDate(a.slotDate)}`}</Detail>
              <Detail label="Visit type">{TYPE_LABELS[a.type] ?? humanizeStatus(a.type ?? "")}</Detail>
              <Detail label="Consultation fee">{typeof a.consultationFee === "number" ? `$${a.consultationFee}` : null}</Detail>
              <Detail label="Booked">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : null}</Detail>
            </dl>
            <div>
              <p className="text-xs text-muted-foreground">Reason for visit</p>
              <p className="text-sm text-foreground">{a.symptoms || "Not recorded"}</p>
            </div>
          </Section>

          <Section title="Patient">
            {patient.status === "loading" && (
              <div role="status" aria-label="Loading patient record" className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            )}
            {patient.status === "ready" && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Detail label="MRN"><span className="font-mono">{patient.patient.mrn}</span></Detail>
                <Detail label="Age / sex">
                  {`${ageFromDob(patient.patient.dateOfBirth) ?? "?"} y · ${humanizeStatus(patient.patient.gender ?? "")}`}
                </Detail>
                <Detail label="Date of birth">{patient.patient.dateOfBirth}</Detail>
                <Detail label="Blood group">{patient.patient.bloodGroup}</Detail>
                <Detail label="Phone">{patient.patient.phoneNumber || a.patientPhone}</Detail>
                <Detail label="Email">{patient.patient.email || a.patientEmail}</Detail>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Allergies</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {patient.patient.allergies?.length ? (
                      patient.patient.allergies.map((al) => (
                        <span key={al} className="rounded-full border border-alert/25 bg-alert-soft px-2 py-0.5 text-xs font-medium text-alert">{al}</span>
                      ))
                    ) : (
                      <span className="text-sm text-foreground">None recorded</span>
                    )}
                  </dd>
                </div>
              </dl>
            )}
            {(patient.status === "missing" || patient.status === "error") && (
              <>
                <p className={cn("rounded-md border px-3 py-2 text-xs", patient.status === "error" ? "border-alert/25 bg-alert-soft text-alert" : "border-border bg-muted text-muted-foreground")}>
                  {patient.status === "missing"
                    ? "No registered patient record matches this booking. Details below come from the booking."
                    : patient.message}
                  {patient.status === "error" && (
                    <button type="button" onClick={() => setAttempt((n) => n + 1)} className={buttonClass("secondary", "sm", "ml-2 align-middle")}>
                      Retry
                    </button>
                  )}
                </p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <Detail label="Phone">{a.patientPhone}</Detail>
                  <Detail label="Email">{a.patientEmail}</Detail>
                </dl>
              </>
            )}
          </Section>
        </div>
      )}
    </Sheet>
  )
}
