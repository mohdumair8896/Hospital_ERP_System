import type { ReactNode } from "react"
import { Sheet, StatusPill, type StatusTone } from "@/components/primitives"
import type { StoredEncounter } from "./useClinicalData"
import type { VitalKey } from "./encounter-model"

export const ENCOUNTER_TONES: Record<string, StatusTone> = { FINALIZED: "success", AMENDED: "warning", OPEN: "info" }

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" })
export function formatWhen(iso?: string) {
  if (!iso) return "Unknown date"
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : dateTime.format(d)
}

/** Vitals of a stored record, accepting both the contracts and the gateway key names. */
export function storedVitals(e: StoredEncounter): Partial<Record<VitalKey, number>> {
  const v = e.vitals ?? {}
  const out: Partial<Record<VitalKey, number>> = {
    bpSys: v.bloodPressureSystolic,
    bpDia: v.bloodPressureDiastolic,
    heartRate: v.heartRateBpm,
    oxygen: v.oxygenSaturationSpO2 ?? v.oxygenSaturationPercent,
    temp: v.bodyTemperatureCelsius ?? v.temperatureCelsius,
    respRate: v.respiratoryRate,
  }
  for (const k of Object.keys(out) as VitalKey[]) if (typeof out[k] !== "number") delete out[k]
  return out
}

export function storedRx(e: StoredEncounter) {
  return (e.prescriptions ?? []).map((p) => ({
    name: p.medicineName ?? p.medicationName ?? "Unnamed medicine",
    dosage: p.dosage ?? "",
    frequency: p.frequency ?? "",
    duration: p.duration ?? (p.durationDays ? `${p.durationDays} days` : ""),
    instructions: p.instructions ?? "",
  }))
}

const VITAL_ROWS: { label: string; value: (v: Partial<Record<VitalKey, number>>) => string | null }[] = [
  { label: "Blood pressure", value: (v) => (v.bpSys !== undefined && v.bpDia !== undefined ? `${v.bpSys}/${v.bpDia} mmHg` : null) },
  { label: "Heart rate", value: (v) => (v.heartRate !== undefined ? `${v.heartRate} bpm` : null) },
  { label: "SpO₂", value: (v) => (v.oxygen !== undefined ? `${v.oxygen} %` : null) },
  { label: "Temperature", value: (v) => (v.temp !== undefined ? `${v.temp} °C` : null) },
  { label: "Respiratory rate", value: (v) => (v.respRate !== undefined ? `${v.respRate} /min` : null) },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

interface EncounterDetailSheetProps {
  encounter: StoredEncounter | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Full read-only encounter record in a right-side sheet. */
export function EncounterDetailSheet({ encounter, open, onOpenChange }: EncounterDetailSheetProps) {
  const e = encounter
  const vitals = e ? storedVitals(e) : {}
  const rx = e ? storedRx(e) : []

  return (
    <Sheet
      open={open && e !== null}
      onOpenChange={onOpenChange}
      width="lg"
      title={e ? `Encounter ${e.encounterNumber ?? e.id}` : "Encounter"}
      description={e ? `${formatWhen(e.createdAt)} · ${e.doctorName || "Unknown clinician"}` : undefined}
    >
      {e && (
        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={e.status ?? "UNKNOWN"} toneMap={ENCOUNTER_TONES} size="md" />
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
              {e.type}
            </span>
            {e.finalizedAt && <span className="text-xs text-muted-foreground">Signed {formatWhen(e.finalizedAt)}</span>}
          </div>

          <Section title="Chief complaint">
            <p className="text-foreground">{e.chiefComplaint || "Not recorded"}</p>
          </Section>

          <Section title="Diagnosis">
            <p className="text-foreground">
              <span className="mr-2 font-mono font-semibold">{e.primaryDiagnosisCode}</span>
              {e.primaryDiagnosisName}
            </p>
            {e.secondaryDiagnoses && e.secondaryDiagnoses.length > 0 && (
              <p className="text-xs text-muted-foreground">Secondary: {e.secondaryDiagnoses.join(", ")}</p>
            )}
          </Section>

          <Section title="Vitals">
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VITAL_ROWS.map((row) => (
                <div key={row.label} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <dt className="text-[11px] text-muted-foreground">{row.label}</dt>
                  <dd className="font-semibold tabular-nums text-foreground">{row.value(vitals) ?? "—"}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Clinical notes">
            <p className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 leading-relaxed text-foreground">
              {e.clinicalNotes || "No notes"}
            </p>
          </Section>

          <Section title={`Prescriptions (${rx.length})`}>
            {rx.length === 0 ? (
              <p className="text-muted-foreground">No medications prescribed.</p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {rx.map((m, i) => (
                  <li key={`${m.name}-${i}`} className="px-3 py-2">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[m.dosage, m.frequency, m.duration, m.instructions].filter(Boolean).join(" · ") || "No directions"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}
    </Sheet>
  )
}
