import { AlertTriangle, ShieldCheck, ShieldQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatTime } from "./audit-format"
import type { VerifyState } from "./useAuditData"

/** Result badge for "Verify chain": verified count, tampered ids, or the failure reason. */
export function IntegrityStatus({ state }: { state: VerifyState }) {
  if (state.status === "idle") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldQuestion className="size-4 shrink-0" aria-hidden="true" />
        The hash chain has not been verified in this session.
      </p>
    )
  }
  if (state.status === "running") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-busy="true">
        <ShieldCheck className="size-4 shrink-0 motion-safe:animate-pulse" aria-hidden="true" />
        Recomputing every record hash against its predecessor…
      </p>
    )
  }
  if (state.status === "error") {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-alert/25 bg-alert-soft px-3 py-2 text-sm text-alert">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Verification could not run.</span> {state.error}
        </p>
      </div>
    )
  }

  const { result } = state
  const ok = result.verified
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        ok ? "border-care/25 bg-care-soft text-care" : "border-alert/25 bg-alert-soft text-alert"
      )}
    >
      {ok ? <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
      <div className="min-w-0">
        <p className="font-semibold">
          {ok
            ? `Chain verified: ${result.totalRecordsChecked.toLocaleString()} records, no tampering`
            : `Tampering detected in ${result.tamperedRecordIds.length.toLocaleString()} of ${result.totalRecordsChecked.toLocaleString()} records`}
        </p>
        {!ok && result.tamperedRecordIds.length > 0 && (
          <p className="mt-0.5 break-all font-mono text-xs">
            {result.tamperedRecordIds.slice(0, 8).join(", ")}
            {result.tamperedRecordIds.length > 8 && ` and ${result.tamperedRecordIds.length - 8} more`}
          </p>
        )}
        <p className="mt-0.5 text-xs opacity-90">Checked at {formatTime(result.verifiedAt)}</p>
      </div>
    </div>
  )
}
