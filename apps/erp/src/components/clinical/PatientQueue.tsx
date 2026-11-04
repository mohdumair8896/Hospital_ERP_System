import { useMemo, useState } from "react"
import type { Patient } from "@hospital/contracts"
import { AlertTriangle, RotateCw, Search, Users, X } from "lucide-react"
import { EmptyState, SkeletonRows, ageFromDob } from "@/components/primitives"
import { cn } from "@/lib/utils"
import type { LoadStatus } from "./useClinicalData"

interface PatientQueueProps {
  status: LoadStatus
  patients: Patient[]
  error?: string
  selectedId: string | null
  /** Patients with unsaved encounter drafts (shown with a dot). */
  draftIds: Set<string>
  onSelect: (id: string) => void
  onRetry: () => void
}

const SEX: Record<string, string> = { MALE: "M", FEMALE: "F", OTHER: "Other", UNDISCLOSED: "Undiscl." }

function matches(p: Patient, q: string) {
  const hay = `${p.firstName} ${p.lastName} ${p.mrn}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => hay.includes(part))
}

/** Keyboard-accessible worklist of patients with search, loading, error and empty states. */
export function PatientQueue({ status, patients, error, selectedId, draftIds, onSelect, onRetry }: PatientQueueProps) {
  const [query, setQuery] = useState("")
  const visible = useMemo(() => (query.trim() ? patients.filter((p) => matches(p, query)) : patients), [patients, query])

  return (
    <section aria-labelledby="clinical-queue-heading" className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 id="clinical-queue-heading" className="text-sm font-semibold text-foreground">
          Patient queue
        </h2>
        {status === "ready" && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {query.trim() ? `${visible.length} of ${patients.length}` : `${patients.length} patients`}
          </span>
        )}
      </div>

      <div className="relative mb-3">
        <label htmlFor="clinical-queue-search" className="sr-only">
          Search patients by name or MRN
        </label>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="clinical-queue-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or MRN"
          disabled={status !== "ready" || patients.length === 0}
          className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        />
      </div>

      {status === "loading" && <SkeletonRows count={5} label="Loading patient queue…" />}

      {status === "error" && (
        <div role="alert" className="flex flex-col items-start gap-2 rounded-lg border border-alert/25 bg-alert-soft p-3 text-sm">
          <p className="font-medium text-alert">Couldn't load the patient queue.</p>
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

      {status === "ready" && patients.length === 0 && (
        <EmptyState compact icon={Users} title="No patients yet" description="Registered patients appear here." />
      )}

      {status === "ready" && patients.length > 0 && visible.length === 0 && (
        <EmptyState
          compact
          icon={Search}
          title="No matching patients"
          description={`Nothing matches "${query.trim()}".`}
          action={{ label: "Clear search", onClick: () => setQuery(""), icon: X }}
        />
      )}

      {status === "ready" && visible.length > 0 && (
        <ul aria-label="Patients" className="-m-1 max-h-64 space-y-1 overflow-y-auto p-1 lg:max-h-[22rem]">
          {visible.map((p) => {
            const selected = p.id === selectedId
            const age = ageFromDob(p.dateOfBirth)
            const hasAllergies = (p.allergies ?? []).filter(Boolean).length > 0
            const hasDraft = draftIds.has(p.id)
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary/40 bg-primary/10"
                      : "border-transparent hover:bg-muted"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {`${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {p.firstName} {p.lastName}
                      </span>
                      {hasAllergies && (
                        <span className="shrink-0" title="Has documented allergies">
                          <AlertTriangle className="size-3.5 text-alert" aria-hidden="true" />
                          <span className="sr-only">Has documented allergies</span>
                        </span>
                      )}
                      {hasDraft && (
                        <span className="size-2 shrink-0 rounded-full bg-dept-amber-fg" title="Unsaved draft">
                          <span className="sr-only">Unsaved draft</span>
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      <span className="font-mono">{p.mrn}</span>
                      {" · "}
                      {age !== null ? `${age} y` : "Age ?"} · {SEX[p.gender] ?? p.gender}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
