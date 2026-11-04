import { cn } from "@/lib/utils"
import { RANGES, type RangeKey } from "./analytics-utils"

/** Segmented time-range control (P-DASH-3). Arrow keys move between options, like a radio group. */
export function RangeControl({ value, onChange }: { value: RangeKey; onChange: (next: RangeKey) => void }) {
  const move = (dir: 1 | -1) => {
    const i = RANGES.findIndex((r) => r.key === value)
    const next = RANGES[(i + dir + RANGES.length) % RANGES.length]
    onChange(next.key)
    document.getElementById(`range-${next.key}`)?.focus()
  }
  return (
    <div role="radiogroup" aria-label="Time range" className="inline-flex rounded-lg border border-border bg-muted p-0.5">
      {RANGES.map((r) => {
        const checked = r.key === value
        return (
          <button
            key={r.key}
            id={`range-${r.key}`}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(r.key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault()
                move(1)
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault()
                move(-1)
              }
            }}
            className={cn(
              "h-8 whitespace-nowrap rounded-md px-2.5 text-xs font-medium sm:px-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              checked ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r.label}
          </button>
        )
      })}
    </div>
  )
}
