import { useState } from "react"
import { ChevronRight, ClipboardList, Pill, RotateCw } from "lucide-react"
import { EmptyState, SkeletonRows, StatusPill } from "@/components/primitives"
import type { LoadStatus, StoredEncounter } from "./useClinicalData"
import { ENCOUNTER_TONES, EncounterDetailSheet, formatWhen, storedVitals } from "./EncounterDetailSheet"

interface EncounterHistoryProps {
  status: LoadStatus
  encounters: StoredEncounter[]
  error?: string
  onRetry: () => void
}

/** Past encounters as cards; each opens the full record in a side sheet. */
export function EncounterHistory({ status, encounters, error, onRetry }: EncounterHistoryProps) {
  const [selected, setSelected] = useState<StoredEncounter | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Encounter history</h3>
        <p className="text-xs text-muted-foreground">Newest first. Open an encounter to see the full record.</p>
      </div>

      {(status === "loading" || status === "idle") && <SkeletonRows count={3} avatar={false} label="Loading encounter history…" />}

      {status === "error" && (
        <div role="alert" className="flex flex-col items-start gap-2 rounded-lg border border-alert/25 bg-alert-soft p-3 text-sm">
          <p className="font-medium text-alert">Couldn't load encounter history.</p>
          {error && <p className="text-xs text-muted-foreground">{error}</p>}
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCw className="size-3.5" aria-hidden="true" /> Try again
          </button>
        </div>
      )}

      {status === "ready" && encounters.length === 0 && (
        <EmptyState
          compact
          icon={ClipboardList}
          title="No previous encounters"
          description="Signed encounters for this patient will appear here."
          className="rounded-lg border border-dashed border-border"
        />
      )}

      {status === "ready" && encounters.length > 0 && (
        <ul className="space-y-2">
          {encounters.map((e) => {
            const v = storedVitals(e)
            const rxCount = e.prescriptions?.length ?? 0
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(e)
                    setOpen(true)
                  }}
                  aria-haspopup="dialog"
                  className="group flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-foreground">{formatWhen(e.createdAt)}</span>
                      <span className="rounded-full border border-border bg-muted px-2 text-[11px] font-medium leading-5 text-foreground">
                        {e.type}
                      </span>
                      <StatusPill status={e.status ?? "UNKNOWN"} toneMap={ENCOUNTER_TONES} />
                    </div>
                    <p className="truncate text-sm text-foreground">
                      <span className="mr-1.5 font-mono font-semibold">{e.primaryDiagnosisCode}</span>
                      {e.primaryDiagnosisName}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span className="font-mono">{e.encounterNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{e.doctorName || "Unknown clinician"}</span>
                      {v.bpSys !== undefined && v.bpDia !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">BP {v.bpSys}/{v.bpDia}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Pill className="size-3" aria-hidden="true" />
                        {rxCount} {rxCount === 1 ? "medication" : "medications"}
                      </span>
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <EncounterDetailSheet encounter={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}
