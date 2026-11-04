import { useCallback, useEffect, useRef, useState } from "react"
import { CheckCircle, CircleAlert, UserRoundSearch, X } from "lucide-react"
import { toast } from "sonner"
import type { Patient } from "@hospital/contracts"
import { ageFromDob } from "@/components/primitives"
import { apiFetch } from "@/lib/api"
import { buttonClass, kbdClass } from "./controls"
import { RegistrationForm } from "./RegistrationForm"
import { findPossibleDuplicates, toCreatePatientDto, type DuplicateMatch, type RegistrationValues } from "./registration-schema"

type Phase =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "review"; values: RegistrationValues; matches: DuplicateMatch[]; checkFailed?: string }
  | { kind: "creating" }

interface RegistrationPanelProps {
  focusSignal: number
  /** Show a registered patient's appointments in the queue. */
  onViewInQueue: (patient: Patient) => void
}

/** Registration flow: validate → duplicate check → create (POST /api/v1/patients) → success. */
export function RegistrationPanel({ focusSignal, onViewInQueue }: RegistrationPanelProps) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" })
  const [created, setCreated] = useState<Patient | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const reviewRef = useRef<HTMLElement>(null)

  // Move focus to the duplicate review when it appears (it sits above the submit button).
  useEffect(() => {
    if (phase.kind === "review") reviewRef.current?.focus()
  }, [phase.kind])

  const create = async (values: RegistrationValues) => {
    setPhase({ kind: "creating" })
    try {
      const res = await apiFetch("/api/v1/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toCreatePatientDto(values)),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        const detail = Array.isArray(body?.details) ? body.details.map((d: any) => d.message).join("; ") : body?.error
        throw new Error(detail || `Registration failed (${res.status})`)
      }
      const saved = body as Patient
      setCreated(saved)
      setResetSignal((n) => n + 1)
      setPhase({ kind: "idle" })
      toast.success(`${saved.firstName} ${saved.lastName} registered`, { description: `MRN ${saved.mrn}`, position: "bottom-center" })
    } catch (err) {
      setPhase({ kind: "idle" })
      toast.error("Patient not registered", { description: err instanceof Error ? err.message : "Try again.", position: "bottom-center" })
    }
  }

  const onValidSubmit = async (values: RegistrationValues) => {
    setPhase({ kind: "checking" })
    try {
      const matches = await findPossibleDuplicates(values)
      if (matches.length === 0) return create(values)
      setPhase({ kind: "review", values, matches })
    } catch (err) {
      setPhase({ kind: "review", values, matches: [], checkFailed: err instanceof Error ? err.message : "Duplicate check failed" })
    }
  }

  const dismissReview = useCallback(() => setPhase((p) => (p.kind === "review" ? { kind: "idle" } : p)), [])

  const review =
    phase.kind === "review" ? (
      <section ref={reviewRef} tabIndex={-1} role="alert" aria-label="Possible duplicate patients" className="flex flex-col gap-3 rounded-lg border border-dept-amber-fg/30 bg-dept-amber-bg p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-start gap-2 text-dept-amber-fg">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">
              {phase.checkFailed ? "Couldn't check for duplicates" : `${phase.matches.length} possible match${phase.matches.length === 1 ? "" : "es"} already registered`}
            </p>
            <p className="text-xs">
              {phase.checkFailed ? `${phase.checkFailed}. Register only if you're sure this is a new patient.` : "Check these records before creating a new one."}
            </p>
          </div>
        </div>
        {phase.matches.length > 0 && (
          <ul className="flex flex-col divide-y divide-border rounded-md border border-border bg-card">
            {phase.matches.map(({ patient: p, reasons }) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{p.mrn}</span> · {ageFromDob(p.dateOfBirth) ?? "?"} y · {p.phoneNumber}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {reasons.map((r) => (
                    <span key={r} className="rounded-full border border-dept-amber-fg/25 bg-dept-amber-bg px-2 py-0.5 text-[11px] font-medium text-dept-amber-fg">{r}</span>
                  ))}
                  <button type="button" onClick={() => onViewInQueue(p)} className={buttonClass("secondary", "sm")}>
                    View in queue
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={dismissReview} className={buttonClass("ghost", "sm")}>Back to form</button>
          <button type="button" onClick={() => create(phase.values)} className={buttonClass("primary", "sm")}>
            Register as new patient
          </button>
        </div>
      </section>
    ) : null

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6 lg:col-span-2">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRoundSearch className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Register a new patient</h2>
            <p className="text-sm text-muted-foreground">We check the registry for duplicates before an MRN is created.</p>
          </div>
        </div>
        <RegistrationForm
          onValidSubmit={onValidSubmit}
          busy={phase.kind === "checking" || phase.kind === "creating"}
          locked={phase.kind === "review"}
          busyLabel={phase.kind === "checking" ? "Checking for duplicates…" : "Registering…"}
          focusSignal={focusSignal}
          resetSignal={resetSignal}
          review={review}
          onEdit={dismissReview}
        />
      </div>

      <aside className="flex flex-col gap-4">
        {created && (
          <div role="status" className="rounded-xl border border-care/25 bg-care-soft p-4 text-care">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Patient registered</p>
                <p className="text-sm">
                  {created.firstName} {created.lastName} · MRN <span className="font-mono font-semibold">{created.mrn}</span>
                </p>
              </div>
              <button type="button" onClick={() => setCreated(null)} className={buttonClass("ghost", "sm", "-mr-2 -mt-1 size-8 px-0 text-care")}>
                <X aria-hidden="true" />
                <span className="sr-only">Dismiss</span>
              </button>
            </div>
          </div>
        )}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">How registration works</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Fill in the required fields; errors show as you leave each field.</li>
            <li>We search the registry by last name and phone for existing records.</li>
            <li>If nothing matches, the patient is created and an MRN assigned.</li>
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            Shortcut: <kbd className={kbdClass}>Ctrl</kbd> / <kbd className={kbdClass}>⌘</kbd> + <kbd className={kbdClass}>Enter</kbd> submits when the form is valid.
          </p>
        </div>
      </aside>
    </div>
  )
}
