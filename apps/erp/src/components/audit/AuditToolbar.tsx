import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ACTION_LABELS, AUDIT_ACTIONS, AUDIT_RESOURCES, EMPTY_FILTERS, resourceLabel, type AuditFilters } from "./audit-format"
import { buttonClass, fieldClass, labelClass, selectClass } from "./controls"

interface AuditToolbarProps {
  filters: AuditFilters
  onChange: (next: AuditFilters) => void
  shown: number
  loaded: number
  total: number
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Filter row above the audit table (P-TBL-1): action, resource type and actor search. */
export function AuditToolbar({ filters, onChange, shown, loaded, total }: AuditToolbarProps) {
  const active = filters.action !== "ALL" || filters.resourceType !== "ALL" || filters.actor.trim() !== ""
  const set = (patch: Partial<AuditFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="flex flex-col gap-3 border-b border-border p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-filter-action" className={labelClass}>
            Action
          </label>
          <select
            id="audit-filter-action"
            value={filters.action}
            onChange={(e) => set({ action: e.target.value })}
            className={selectClass}
          >
            <option value="ALL">All actions</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {ACTION_LABELS[a] ?? a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-filter-resource" className={labelClass}>
            Resource
          </label>
          <select
            id="audit-filter-resource"
            value={filters.resourceType}
            onChange={(e) => set({ resourceType: e.target.value })}
            className={selectClass}
          >
            <option value="ALL">All resources</option>
            {AUDIT_RESOURCES.map((r) => (
              <option key={r} value={r}>
                {capital(resourceLabel(r, true))}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-filter-actor" className={labelClass}>
            Actor
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="audit-filter-actor"
              type="search"
              value={filters.actor}
              onChange={(e) => set({ actor: e.target.value })}
              placeholder="Name, role or usr_ id"
              aria-describedby="audit-filter-actor-hint"
              className={cn(fieldClass, "pl-9")}
            />
          </div>
          <span id="audit-filter-actor-hint" className="sr-only">
            Filters the loaded events by actor name, role or user ID. An exact user ID is also sent to the server.
          </span>
        </div>
      </div>
      <div className="flex min-h-8 items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {shown.toLocaleString()} shown · {loaded.toLocaleString()} loaded of {total.toLocaleString()}
        </p>
        {active && (
          <button type="button" onClick={() => onChange(EMPTY_FILTERS)} className={buttonClass("ghost", "sm")}>
            <X className="size-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
