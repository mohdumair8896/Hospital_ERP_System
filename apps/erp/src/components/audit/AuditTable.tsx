import type { AuditRecord } from "@hospital/contracts"
import { StatusPill } from "@/components/primitives"
import { cn } from "@/lib/utils"
import {
  ACTION_LABELS,
  ACTION_TONES,
  actorDisplay,
  describeEvent,
  formatDate,
  formatTime,
  initials,
  outcomeOf,
  relativeTime,
} from "./audit-format"

interface AuditTableProps {
  records: AuditRecord[]
  selectedId: string | null
  tamperedIds: Set<string>
  onSelect: (record: AuditRecord) => void
}

const th = "sticky top-0 z-10 border-b border-border bg-card px-4 py-2.5 text-left text-xs font-medium text-muted-foreground"

/**
 * Readable audit rows (P-TBL-5): actor, action pill, plain-language sentence and time.
 * The sentence is a button, so every row is reachable by keyboard; the whole row is clickable.
 */
export function AuditTable({ records, selectedId, tamperedIds, onSelect }: AuditTableProps) {
  const now = Date.now()
  return (
    <div className="max-h-[min(68vh,720px)] overflow-auto overscroll-contain">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Audit events, newest first. Select an event to see the full record and its hashes.</caption>
        <thead>
          <tr>
            <th scope="col" className={cn(th, "w-[26%]")}>Actor</th>
            <th scope="col" className={cn(th, "w-[13%]")}>Action</th>
            <th scope="col" className={th}>What happened</th>
            <th scope="col" className={cn(th, "w-[17%] text-right")}>When</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const actor = actorDisplay(r)
            const outcome = outcomeOf(r)
            const selected = r.id === selectedId
            const tampered = tamperedIds.has(r.id)
            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r)}
                className={cn(
                  "group cursor-pointer transition-colors duration-150 [&>td]:border-b [&>td]:border-border",
                  selected ? "bg-accent" : "hover:bg-muted/60",
                  tampered && "bg-alert-soft hover:bg-alert-soft"
                )}
              >
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                        r.actorId === "anonymous" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                      )}
                    >
                      {initials(r.actorName, r.actorId)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground" title={actor.name}>
                        {actor.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{actor.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusPill status={r.action} label={ACTION_LABELS[r.action] ?? r.action} toneMap={ACTION_TONES} />
                </td>
                <td className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(r)
                    }}
                    aria-label={`${describeEvent(r)}. View event ${r.sequenceNumber} details`}
                    className="rounded text-left font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {describeEvent(r)}
                  </button>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">#{r.sequenceNumber}</span>
                    <span className="truncate font-mono" title={r.endpoint}>
                      {r.httpMethod} {r.endpoint}
                    </span>
                    {!outcome.ok && <StatusPill status="FAILED" label={outcome.label} tone="danger" dot={false} />}
                    {tampered && <StatusPill status="TAMPERED" label="Hash mismatch" />}
                  </p>
                </td>
                <td className="px-4 py-3 text-right align-top">
                  <time dateTime={r.timestamp} className="block whitespace-nowrap text-foreground tabular-nums">
                    {formatDate(r.timestamp)}, {formatTime(r.timestamp)}
                  </time>
                  <span className="text-xs text-muted-foreground">{relativeTime(r.timestamp, now)}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
