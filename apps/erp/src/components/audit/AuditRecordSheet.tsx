import * as React from "react"
import type { AuditRecord } from "@hospital/contracts"
import { Copy, Link2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Sheet, StatusPill } from "@/components/primitives"
import { ACTION_LABELS, ACTION_TONES, actorDisplay, describeEvent, formatDate, formatTime, outcomeOf, relativeTime } from "./audit-format"
import { buttonClass } from "./controls"
import type { VerifyState } from "./useAuditData"

interface AuditRecordSheetProps {
  record: AuditRecord | null
  /** The event with sequenceNumber - 1, when it is in the loaded page. */
  previous: AuditRecord | null
  verify: VerifyState
  onVerify: () => void
  onOpenChange: (open: boolean) => void
}

function Field({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs leading-5 text-foreground" : "min-w-0 break-words text-foreground"}>{children}</dd>
    </div>
  )
}

function HashField({ label, value }: { label: string; value: string | undefined }) {
  const copy = () => {
    if (!value) return
    navigator.clipboard?.writeText(value).then(
      () => toast.success(`${label} copied`),
      () => toast.error("Could not copy to the clipboard")
    )
  }
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <button type="button" onClick={copy} disabled={!value} className={buttonClass("ghost", "sm", "h-7 px-2")} aria-label={`Copy ${label.toLowerCase()}`}>
          <Copy className="size-3.5" aria-hidden="true" />
          Copy
        </button>
      </div>
      <dd className="break-all rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs leading-5 text-foreground">
        {value || "—"}
      </dd>
    </div>
  )
}

function VerificationBadge({ record, verify, onVerify }: { record: AuditRecord; verify: VerifyState; onVerify: () => void }) {
  if (verify.status === "done") {
    const tampered = verify.result.tamperedRecordIds.includes(record.id)
    return (
      <div className="flex flex-wrap items-center gap-2">
        {tampered ? (
          <StatusPill status="TAMPERED" label="Tampered: hash mismatch" size="md" />
        ) : new Date(record.timestamp) > new Date(verify.result.verifiedAt) ? (
          <StatusPill status="PENDING" label="Recorded after the last chain check" tone="neutral" size="md" />
        ) : verify.result.verified ? (
          <StatusPill status="VERIFIED" label="Verified in the last chain check" size="md" />
        ) : (
          <StatusPill status="PENDING" label="Not flagged; the chain has other mismatches" tone="warning" size="md" />
        )}
        <span className="text-xs text-muted-foreground">Checked {formatTime(verify.result.verifiedAt)}</span>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill status="PENDING" label={verify.status === "error" ? "Last check failed" : "Not checked this session"} tone="neutral" size="md" />
      <button type="button" onClick={onVerify} disabled={verify.status === "running"} className={buttonClass("secondary", "sm")}>
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        {verify.status === "running" ? "Verifying…" : "Verify chain"}
      </button>
    </div>
  )
}

/** Side panel with the full audit record, its hashes and the verification state (C31). */
export function AuditRecordSheet({ record, previous, verify, onVerify, onOpenChange }: AuditRecordSheetProps) {
  // Keep the last record while the sheet animates closed.
  const [shown, setShown] = React.useState<AuditRecord | null>(record)
  React.useEffect(() => {
    if (record) setShown(record)
  }, [record])
  const r = record ?? shown
  if (!r) return null

  const actor = actorDisplay(r)
  const outcome = outcomeOf(r)
  const linkOk = previous ? previous.recordHash === r.prevRecordHash : null
  const raw = JSON.stringify(r, null, 2)

  return (
    <Sheet
      open={record !== null}
      onOpenChange={onOpenChange}
      width="lg"
      title={`Event #${r.sequenceNumber}`}
      description={describeEvent(r)}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={r.action} label={ACTION_LABELS[r.action] ?? r.action} toneMap={ACTION_TONES} size="md" />
          <StatusPill status={outcome.ok ? "ONLINE" : "FAILED"} label={outcome.label} size="md" />
          <span className="text-xs text-muted-foreground">
            {formatDate(r.timestamp)}, {formatTime(r.timestamp)} ({relativeTime(r.timestamp)})
          </span>
        </div>

        <section aria-labelledby="audit-sheet-integrity">
          <h3 id="audit-sheet-integrity" className="text-sm font-semibold text-foreground">Integrity</h3>
          <div className="mt-2">
            <VerificationBadge record={r} verify={verify} onVerify={onVerify} />
          </div>
          <dl className="mt-2 divide-y divide-border">
            <Field label="Sequence number">
              <span className="font-mono tabular-nums">#{r.sequenceNumber}</span>
            </Field>
            <HashField label="Record hash" value={r.recordHash} />
            <HashField label="Previous hash" value={r.prevRecordHash} />
            <Field label="Chain link">
              {linkOk === null ? (
                <span className="text-muted-foreground">Event #{r.sequenceNumber - 1} is not in the loaded page.</span>
              ) : linkOk ? (
                <span className="inline-flex items-center gap-1.5 text-care">
                  <Link2 className="size-4" aria-hidden="true" />
                  Matches the hash of event #{previous!.sequenceNumber}
                </span>
              ) : (
                <span className="font-medium text-alert">Does not match the hash of event #{previous!.sequenceNumber}</span>
              )}
            </Field>
          </dl>
        </section>

        <section aria-labelledby="audit-sheet-who">
          <h3 id="audit-sheet-who" className="text-sm font-semibold text-foreground">Who and where</h3>
          <dl className="mt-1 divide-y divide-border">
            <Field label="Actor">
              {actor.name} <span className="text-muted-foreground">({actor.role})</span>
            </Field>
            <Field label="Actor ID" mono>{r.actorId}</Field>
            <Field label="Client IP" mono>{r.clientIp || "—"}</Field>
            <Field label="User agent">{r.userAgent || "—"}</Field>
          </dl>
        </section>

        <section aria-labelledby="audit-sheet-what">
          <h3 id="audit-sheet-what" className="text-sm font-semibold text-foreground">What</h3>
          <dl className="mt-1 divide-y divide-border">
            <Field label="Description">{r.description}</Field>
            {r.clinicalReason && <Field label="Clinical reason">{r.clinicalReason}</Field>}
            <Field label="Resource">
              {r.resourceType} <span className="font-mono text-xs text-muted-foreground">{r.resourceId}</span>
            </Field>
            <Field label="Request" mono>{`${r.httpMethod} ${r.endpoint}`}</Field>
            <Field label="Response">{`${r.statusCode} in ${r.executionTimeMs} ms`}</Field>
            <Field label="Trace ID" mono>{r.traceId || "—"}</Field>
            <Field label="Timestamp (UTC)" mono>{r.timestamp}</Field>
          </dl>
        </section>

        <details className="group rounded-lg border border-border">
          <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Raw record (JSON)
          </summary>
          <pre className="max-h-72 overflow-auto border-t border-border bg-muted px-3 py-2 font-mono text-[11px] leading-5 text-foreground">{raw}</pre>
        </details>
      </div>
    </Sheet>
  )
}
