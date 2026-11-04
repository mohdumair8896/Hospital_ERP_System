import { CheckCircle2, AlertTriangle } from "lucide-react"
import { StatusPill } from "@/components/primitives"
import { cn } from "@/lib/utils"
import {
  VITAL_SPECS,
  abnormalVitals,
  vitalFlag,
  visibleError,
  type VitalKey,
  type VitalSpec,
} from "./encounter-model"

interface VitalsPanelProps {
  vitals: Record<VitalKey, string>
  errors: Partial<Record<VitalKey, string>>
  showAllErrors: boolean
  onChange: (key: VitalKey, value: string) => void
  /** Last recorded values (from the newest encounter), shown for comparison. */
  previous?: Partial<Record<VitalKey, number>>
  previousDate?: string
}

function VitalField({
  spec,
  value,
  error,
  previous,
  onChange,
}: {
  spec: VitalSpec
  value: string
  error?: string
  previous?: number
  onChange: (value: string) => void
}) {
  const id = `vital-${spec.key}`
  const flag = vitalFlag(spec, value)
  const describedBy = [`${id}-range`, error ? `${id}-error` : null].filter(Boolean).join(" ")

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-colors duration-150",
        error ? "border-alert/40" : flag ? "border-dept-amber-fg/30" : "border-border"
      )}
    >
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-foreground">
          {spec.label}
          <span className="sr-only"> ({spec.unit})</span>
        </label>
        {flag && (
          <StatusPill
            status={flag.direction}
            label={flag.critical ? `Critical ${flag.direction === "HIGH" ? "high" : "low"}` : flag.direction === "HIGH" ? "High" : "Low"}
            tone={flag.critical ? "danger" : "warning"}
          />
        )}
      </div>
      <div
        className={cn(
          "mt-2 flex items-center rounded-md border bg-background transition-shadow duration-150 focus-within:ring-2 focus-within:ring-ring",
          error ? "border-alert" : "border-input"
        )}
      >
        <input
          id={id}
          type="number"
          inputMode={spec.integer ? "numeric" : "decimal"}
          step={spec.integer ? 1 : 0.1}
          min={spec.min}
          max={spec.max}
          value={value}
          placeholder={`e.g. ${spec.placeholder}`}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-10 w-full min-w-0 bg-transparent px-3 text-base font-semibold tabular-nums text-foreground placeholder:font-normal placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <span aria-hidden="true" className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
          {spec.unit}
        </span>
      </div>
      <p id={`${id}-range`} className="mt-1.5 text-[11px] text-muted-foreground">
        Normal {spec.normal[0]}–{spec.normal[1]}
        {previous !== undefined && <> · Last {previous}</>}
      </p>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Six labelled vital-sign inputs with units, range validation and abnormal flags. */
export function VitalsPanel({ vitals, errors, showAllErrors, onChange, previous, previousDate }: VitalsPanelProps) {
  const abnormal = abnormalVitals(vitals)
  const filled = VITAL_SPECS.filter((s) => vitals[s.key].trim() !== "").length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Vital signs</h3>
          <p className="text-xs text-muted-foreground">
            {previousDate ? `Last recorded ${previousDate}. ` : ""}All six are required to sign the encounter.
          </p>
        </div>
        <p aria-live="polite" className="text-xs">
          {abnormal.length > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-dept-amber-fg">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              {abnormal.length} outside normal range
            </span>
          ) : filled === VITAL_SPECS.length ? (
            <span className="inline-flex items-center gap-1 font-medium text-care">
              <CheckCircle2 className="size-3.5" aria-hidden="true" /> All within normal range
            </span>
          ) : (
            <span className="text-muted-foreground">
              {filled} of {VITAL_SPECS.length} recorded
            </span>
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">
        {VITAL_SPECS.map((spec) => (
          <VitalField
            key={spec.key}
            spec={spec}
            value={vitals[spec.key]}
            error={visibleError(vitals[spec.key], errors[spec.key], showAllErrors)}
            previous={previous?.[spec.key]}
            onChange={(v) => onChange(spec.key, v)}
          />
        ))}
      </div>
    </div>
  )
}
