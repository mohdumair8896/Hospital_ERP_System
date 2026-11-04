import * as React from "react"
import type { AuditRecord } from "@hospital/contracts"
import { FileSearch } from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { actorDisplay, describeEvent, formatDate, formatTime } from "./audit-format"
import { buttonClass, fieldClass, labelClass } from "./controls"

interface DisclosureResult {
  patientId: string
  /** `disclosuresCount` as reported by the audit service. */
  reported: number
  /** Returned records that actually reference this patient. */
  matches: AuditRecord[]
}

/** HIPAA §164.528 accounting of disclosures for one patient ID. */
export function DisclosuresLookup() {
  const [patientId, setPatientId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<DisclosureResult | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = patientId.trim()
    if (!id) {
      setError("Enter a patient ID, for example pat_1.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/v1/audit/patient/${encodeURIComponent(id)}/disclosures`)
      if (!res.ok) throw new Error(`The audit service responded with HTTP ${res.status}.`)
      const data = await res.json()
      const records: AuditRecord[] = Array.isArray(data?.records) ? data.records : []
      const matches = records.filter((r) => r.resourceType === "PATIENT" && r.resourceId === id)
      setResult({ patientId: id, reported: Number(data?.disclosuresCount) || 0, matches })
      toast.success(`${matches.length} disclosure ${matches.length === 1 ? "record" : "records"} found for ${id}`)
    } catch (err) {
      setResult(null)
      setError(err instanceof TypeError ? "Could not reach the audit service. Retry in a moment." : (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="disclosures-title" className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <h2 id="disclosures-title" className="text-sm font-semibold text-foreground">Accounting of disclosures</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Who accessed one patient's record (HIPAA §164.528).</p>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-1.5" noValidate>
        <label htmlFor="disclosure-patient" className={labelClass}>
          Patient ID
        </label>
        <div className="flex gap-2">
          <input
            id="disclosure-patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="pat_1"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "disclosure-error" : undefined}
            className={cn(fieldClass, "font-mono")}
          />
          <button type="submit" disabled={loading} className={buttonClass("secondary")}>
            <FileSearch className="size-4" aria-hidden="true" />
            {loading ? "Looking up…" : "Look up"}
          </button>
        </div>
        {error && (
          <p id="disclosure-error" role="alert" className="text-xs text-alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="mt-4 border-t border-border pt-3" aria-live="polite">
          <p className="text-sm text-foreground">
            <span className="text-lg font-semibold tabular-nums">{result.matches.length}</span>{" "}
            {result.matches.length === 1 ? "access" : "accesses"} of <span className="font-mono">{result.patientId}</span> in the returned window
          </p>
          {result.reported > result.matches.length && (
            <p className="mt-1 text-xs text-muted-foreground">
              Showing the latest {result.matches.length.toLocaleString()} of {result.reported.toLocaleString()} recorded accesses (the service returns at most 100 per lookup).
            </p>
          )}
          <ul className="mt-2 divide-y divide-border">
            {result.matches.slice(0, 6).map((r) => (
              <li key={r.id} className="py-2 text-xs">
                <p className="font-medium text-foreground">{actorDisplay(r).name}</p>
                <p className="text-muted-foreground">
                  {describeEvent(r)} · {formatDate(r.timestamp)}, {formatTime(r.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
