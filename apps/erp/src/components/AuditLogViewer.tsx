import React, { useEffect, useMemo, useRef, useState } from "react"
import { AlertTriangle, Database, FileWarning, LogIn, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react"
import type { AuditRecord } from "@hospital/contracts"
import { toast } from "sonner"
import { EmptyState, KpiCard, SkeletonRows } from "@/components/primitives"
import { setUrlParam, useUrlParam } from "@/components/shell/url-state"
import { AuditToolbar } from "./audit/AuditToolbar"
import { AuditTable } from "./audit/AuditTable"
import { AuditRecordSheet } from "./audit/AuditRecordSheet"
import { IntegrityStatus } from "./audit/IntegrityStatus"
import { DisclosuresLookup } from "./audit/DisclosuresLookup"
import { EMPTY_FILTERS, matchesFilters, type AuditFilters } from "./audit/audit-format"
import { buttonClass } from "./audit/controls"
import { MAX_LIMIT, PAGE_SIZE, useAuditRecords, useAuditStats, useChainVerification } from "./audit/useAuditData"

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}

/** HIPAA audit trail: readable events, filters, record side panel and hash-chain verification. */
export default function AuditLogViewer() {
  const [filters, setFilters] = useState<AuditFilters>(EMPTY_FILTERS)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const serverFilters = useDebounced(filters, 300)

  const records = useAuditRecords(serverFilters, limit)
  const [statsKey, setStatsKey] = useState(0)
  const stats = useAuditStats(statsKey)
  const { state: verifyState, verify } = useChainVerification()

  const loaded = records.data?.records ?? []
  const visible = useMemo(() => loaded.filter((r) => matchesFilters(r, filters)), [loaded, filters])
  const selected = loaded.find((r) => r.id === selectedId) ?? null
  const previous = selected ? loaded.find((r) => r.sequenceNumber === selected.sequenceNumber - 1) ?? null : null
  const tamperedIds = useMemo(
    () => new Set(verifyState.status === "done" ? verifyState.result.tamperedRecordIds : []),
    [verifyState]
  )

  const runVerify = async () => {
    const next = await verify()
    if (next.status === "done") {
      const r = next.result
      if (r.verified) toast.success(`Audit chain verified: ${r.totalRecordsChecked.toLocaleString()} records, no tampering.`)
      else toast.error(`Tampering detected in ${r.tamperedRecordIds.length} record(s).`)
    } else if (next.status === "error") {
      toast.error("Chain verification could not run. See the details on the Audit screen.")
    }
  }

  // `?action=verify` (from the command palette) runs the check once, then clears the param.
  const urlAction = useUrlParam("action")
  const handledAction = useRef(false)
  useEffect(() => {
    if (urlAction !== "verify") {
      handledAction.current = false
      return
    }
    if (handledAction.current) return
    handledAction.current = true
    setUrlParam("action", null)
    void runVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlAction])

  const changeFilters = (next: AuditFilters) => {
    setFilters(next)
    setLimit(PAGE_SIZE)
  }
  const refresh = () => {
    records.reload()
    setStatsKey((k) => k + 1)
  }

  const statsData = stats.data
  const logins = statsData?.actionDistribution.find((a) => a.action === "LOGIN")?.count ?? 0
  const statsError = stats.status === "error" && !statsData
  const chainValue =
    verifyState.status === "done" ? (verifyState.result.verified ? "Verified" : "Tampered") : verifyState.status === "running" ? "Checking…" : "Not checked"

  const total = records.data?.total ?? 0
  const initialLoading = records.status === "loading" && !records.data
  const refreshing = records.status === "loading" && !!records.data
  const hasMore = loaded.length < total && loaded.length >= limit && limit < MAX_LIMIT

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Audit log</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every chart access, order and sign-in is hashed with SHA-256 and chained to the event before it (HIPAA §164.312(b)).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={refresh} disabled={records.status === "loading"} className={buttonClass("secondary")}>
            <RefreshCw className={`size-4 ${refreshing ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
          <button type="button" onClick={() => void runVerify()} disabled={verifyState.status === "running"} className={buttonClass("primary")}>
            <ShieldCheck className="size-4" aria-hidden="true" />
            {verifyState.status === "running" ? "Verifying…" : "Verify chain"}
          </button>
        </div>
      </header>

      <div aria-live="polite">
        <IntegrityStatus state={verifyState} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Events recorded" value={statsError ? "—" : statsData?.totalRecords ?? 0} loading={stats.status === "loading" && !statsData} icon={Database} caption={statsError ? "Stats unavailable" : "All time"} />
        <KpiCard label="Sign-ins" value={statsError ? "—" : logins} loading={stats.status === "loading" && !statsData} icon={LogIn} caption="Successful and failed" />
        <KpiCard label="Break-glass overrides" value={statsError ? "—" : statsData?.breakGlassCount ?? 0} loading={stats.status === "loading" && !statsData} icon={ShieldAlert} caption="Emergency access events" />
        <KpiCard label="Chain status" value={chainValue} icon={ShieldCheck} caption={verifyState.status === "done" ? `${verifyState.result.totalRecordsChecked.toLocaleString()} records checked` : "Run Verify chain"} />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_320px] 2xl:items-start">
        <section aria-labelledby="audit-events-title" className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <h2 id="audit-events-title" className="sr-only">Audit events</h2>
          <AuditToolbar filters={filters} onChange={changeFilters} shown={visible.length} loaded={loaded.length} total={total} />

          {records.status === "error" && (
            <div role="alert" className="flex flex-col gap-3 border-b border-border bg-alert-soft px-4 py-3 text-sm text-alert sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{records.data ? "Refresh failed; showing the last loaded events." : "Audit events could not be loaded."}</span>{" "}
                  {records.error}
                </span>
              </p>
              <button type="button" onClick={records.reload} className={buttonClass("secondary", "sm")}>
                Retry
              </button>
            </div>
          )}

          {initialLoading ? (
            <div className="px-4">
              <SkeletonRows count={8} label="Loading audit events…" />
            </div>
          ) : records.status === "error" && !records.data ? (
            <EmptyState icon={FileWarning} title="No audit data to show" description="Nothing is displayed until the audit service responds, so you never see stale or sample events." />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No events match these filters"
              description={`None of the ${loaded.length.toLocaleString()} loaded events match. Clear the filters or load more events.`}
              action={{ label: "Clear filters", onClick: () => changeFilters(EMPTY_FILTERS) }}
            />
          ) : (
            <AuditTable records={visible} selectedId={selectedId} tamperedIds={tamperedIds} onSelect={(r: AuditRecord) => setSelectedId(r.id)} />
          )}

          {hasMore && (
            <div className="flex justify-center border-t border-border p-3">
              <button type="button" onClick={() => setLimit((l) => Math.min(l + PAGE_SIZE, MAX_LIMIT))} disabled={records.status === "loading"} className={buttonClass("ghost", "sm")}>
                {refreshing ? "Loading…" : `Load ${PAGE_SIZE} older events`}
              </button>
            </div>
          )}
        </section>

        <DisclosuresLookup />
      </div>

      <AuditRecordSheet
        record={selected}
        previous={previous}
        verify={verifyState}
        onVerify={() => void runVerify()}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  )
}
