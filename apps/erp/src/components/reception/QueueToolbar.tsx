import { useId } from "react"
import { ChevronDown, Columns3, RefreshCw, Rows3, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonClass, focusRing, inputClass, selectClass } from "./controls"
import { EMPTY_FILTERS, hasActiveFilters, todayIso, type QueueFilters } from "./queue-model"

export type QueueView = "board" | "table"

interface Option {
  value: string
  label: string
}

interface QueueToolbarProps {
  filters: QueueFilters
  onFiltersChange: (next: QueueFilters) => void
  doctors: Option[]
  departments: Option[]
  view: QueueView
  onViewChange: (view: QueueView) => void
  onRefresh: () => void
  refreshing: boolean
  patientLabel?: string
}

function FilterSelect({ id, label, value, options, allLabel, onChange }: {
  id: string
  label: string
  value: string
  options: Option[]
  allLabel: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(selectClass, "sm:w-48")}>
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  )
}

/** Search, doctor / department / date filters, board-table toggle and refresh (P-TBL-1 toolbar). */
export function QueueToolbar({
  filters,
  onFiltersChange,
  doctors,
  departments,
  view,
  onViewChange,
  onRefresh,
  refreshing,
  patientLabel,
}: QueueToolbarProps) {
  const id = useId()
  const set = (patch: Partial<QueueFilters>) => onFiltersChange({ ...filters, ...patch })
  const today = todayIso()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <div className="flex min-w-0 flex-col gap-1 sm:col-span-2 lg:flex-1">
          <label htmlFor={`${id}-search`} className="text-xs font-medium text-muted-foreground">Search queue</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden="true" />
            <input
              id={`${id}-search`}
              type="search"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Patient name, ref no. or phone"
              className={cn(inputClass, "pl-8")}
            />
          </div>
        </div>
        <FilterSelect id={`${id}-doctor`} label="Doctor" value={filters.doctorId} options={doctors} allLabel="All doctors" onChange={(v) => set({ doctorId: v })} />
        <FilterSelect id={`${id}-dept`} label="Department" value={filters.departmentId} options={departments} allLabel="All departments" onChange={(v) => set({ departmentId: v })} />
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={`${id}-date`} className="text-xs font-medium text-muted-foreground">Date</label>
          <div className="flex gap-2">
            <input
              id={`${id}-date`}
              type="date"
              value={filters.date}
              onChange={(e) => set({ date: e.target.value })}
              className={cn(inputClass, "min-w-0 sm:w-40")}
            />
            <button
              type="button"
              aria-pressed={filters.date === today}
              onClick={() => set({ date: filters.date === today ? "" : today })}
              className={buttonClass(filters.date === today ? "primary" : "secondary", "md", "px-3")}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {patientLabel && (
            <button
              type="button"
              onClick={() => set({ patientId: "" })}
              className={cn("inline-flex h-7 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 text-xs font-medium text-primary hover:bg-primary/15", focusRing)}
            >
              Patient: {patientLabel}
              <X className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Remove patient filter</span>
            </button>
          )}
          {hasActiveFilters(filters) && (
            <button type="button" onClick={() => onFiltersChange(EMPTY_FILTERS)} className={buttonClass("ghost", "sm")}>
              <X aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="Queue layout" className="inline-flex rounded-md border border-border bg-muted p-0.5">
            {([
              { value: "board", label: "Board", icon: Columns3 },
              { value: "table", label: "Table", icon: Rows3 },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={view === opt.value}
                onClick={() => onViewChange(opt.value)}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors duration-150",
                  view === opt.value ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                  focusRing
                )}
              >
                <opt.icon className="size-3.5" aria-hidden="true" />
                {opt.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={onRefresh} disabled={refreshing} className={buttonClass("secondary", "sm")}>
            <RefreshCw className={cn(refreshing && "motion-safe:animate-spin")} aria-hidden="true" />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  )
}
