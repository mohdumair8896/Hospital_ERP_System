import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Placeholder block for content that is loading. Size it with classes (`h-4 w-32`,
 * `size-9 rounded-full`). Pulses only under `motion-safe`; static otherwise.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
      {...props}
    />
  )
}

export interface SkeletonRowsProps {
  /** Number of placeholder rows (default 5). */
  count?: number
  /** Show a leading avatar circle on each row (default true). */
  avatar?: boolean
  /** Screen-reader text (default "Loading…"). */
  label?: string
  className?: string
}

/** A stack of list/table-shaped skeleton rows with `role="status"` and `aria-busy`. */
export function SkeletonRows({ count = 5, avatar = true, label = "Loading…", className }: SkeletonRowsProps) {
  return (
    <div role="status" aria-busy="true" className={cn("divide-y divide-border", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          {avatar && <Skeleton className="size-8 shrink-0 rounded-full" />}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className={cn("h-3.5", i % 3 === 0 ? "w-2/5" : i % 3 === 1 ? "w-1/2" : "w-1/3")} />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}
