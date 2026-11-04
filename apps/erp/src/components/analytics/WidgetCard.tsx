import * as React from "react"
import { AlertTriangle, FlaskConical, type LucideIcon } from "lucide-react"
import { EmptyState, Skeleton } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { buttonClass, demoTagClass } from "../audit/controls"

export interface WidgetCardProps {
  title: string
  description?: React.ReactNode
  /** Marks a metric with no API source. */
  demo?: boolean
  /** Source note shown in the footer, e.g. "GET /api/v1/appointments". */
  source?: string
  loading?: boolean
  error?: string | null
  /** A refresh failed but older data is still shown. */
  stale?: string | null
  onRetry?: () => void
  empty?: { icon?: LucideIcon; title: string; description?: string; action?: { label: string; onClick: () => void } } | null
  /** Height of the skeleton / empty area. */
  minHeight?: string
  className?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}

/** Bento tile that owns its loading, error and empty states (P-DASH-4). */
export function WidgetCard({
  title,
  description,
  demo,
  source,
  loading,
  error,
  stale,
  onRetry,
  empty,
  minHeight = "min-h-[180px]",
  className,
  actions,
  children,
}: WidgetCardProps) {
  const headingId = React.useId()
  let body: React.ReactNode
  if (loading) {
    body = (
      <div role="status" aria-busy="true" className={cn("flex flex-col justify-end gap-2", minHeight)}>
        <span className="sr-only">Loading {title}</span>
        <Skeleton className="h-full min-h-24 w-full flex-1" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    )
  } else if (error) {
    body = (
      <div role="alert" className={cn("flex flex-col items-center justify-center gap-2 px-4 text-center", minHeight)}>
        <span className="flex size-10 items-center justify-center rounded-full bg-alert-soft text-alert">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-foreground">Couldn't load this widget</p>
        <p className="max-w-xs text-xs text-muted-foreground">{error}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className={buttonClass("secondary", "sm", "mt-1")}>
            Retry
          </button>
        )}
      </div>
    )
  } else if (empty) {
    body = (
      <div className={cn("flex items-center justify-center", minHeight)}>
        <EmptyState compact icon={empty.icon} title={empty.title} description={empty.description} action={empty.action} />
      </div>
    )
  } else {
    body = children
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-soft motion-safe:animate-in motion-safe:fade-in-0 duration-150",
        className
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={headingId} className="text-sm font-semibold text-foreground">
              {title}
            </h2>
            {demo && (
              <span className={demoTagClass}>
                <FlaskConical className="size-3" aria-hidden="true" />
                Demo data
              </span>
            )}
          </div>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="flex-1">{body}</div>
      {stale && !loading && !error && (
        <p role="status" className="mt-3 flex items-center gap-1.5 text-xs text-alert">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
          Refresh failed, showing earlier data. {stale}
        </p>
      )}
      {source && <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">Source: {source}</p>}
    </section>
  )
}
