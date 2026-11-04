import * as React from "react"
import { cn } from "@/lib/utils"

export interface BarListItem {
  key: string
  label: React.ReactNode
  /** Plain-text label for the screen-reader summary. */
  text: string
  value: number
  /** Bar fill class (defaults to the primary hue). */
  barClass?: string
}

/**
 * Ranked horizontal bars in plain HTML: label left, value and share right, a thin bar under
 * each row. Values are always printed, so identity and magnitude never rely on colour.
 */
export function BarList({
  items,
  total,
  unit = "",
  share: showShare = true,
}: {
  items: BarListItem[]
  total?: number
  unit?: string
  /** Print each item's share of the total (off for values that are already percentages). */
  share?: boolean
}) {
  const max = Math.max(1, ...items.map((i) => i.value))
  const sum = total ?? items.reduce((s, i) => s + i.value, 0)
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const share = sum ? Math.round((item.value / sum) * 100) : 0
        return (
          <li key={item.key} aria-label={`${item.text}: ${item.value.toLocaleString()}${unit}${showShare ? ` (${share}%)` : ""}`}>
            <div className="flex items-center justify-between gap-3 text-sm" aria-hidden="true">
              <span className="min-w-0 truncate text-foreground">{item.label}</span>
              <span className="shrink-0 tabular-nums text-foreground">
                {item.value.toLocaleString()}
                {unit}
                {showShare && <span className="ml-1.5 text-xs text-muted-foreground">{share}%</span>}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className={cn("h-full origin-left rounded-full transition-transform duration-250 ease-out-soft", item.barClass ?? "bg-primary")}
                style={{ transform: `scaleX(${item.value / max})` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
