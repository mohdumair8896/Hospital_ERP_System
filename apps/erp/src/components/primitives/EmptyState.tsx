import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EmptyStateAction {
  label: string
  onClick: () => void
  icon?: LucideIcon
}

export interface EmptyStateProps {
  /** A lucide icon component (e.g. `Inbox`) or any node. */
  icon?: LucideIcon | React.ReactNode
  title: string
  /** One line that names the scope, e.g. "No appointments for today". */
  description?: React.ReactNode
  /** Optional call to action rendered as a primary button. */
  action?: EmptyStateAction
  /** Tighter padding for popovers and small cards. */
  compact?: boolean
  className?: string
}

function isComponent(icon: unknown): icon is LucideIcon {
  return typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)
}

/** Friendly placeholder for an empty list, search or widget. Keeps the surrounding frame intact. */
export function EmptyState({ icon, title, description, action, compact = false, className }: EmptyStateProps) {
  const Icon = isComponent(icon) ? icon : null
  const ActionIcon = action?.icon
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-6" : "gap-3 px-6 py-12",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
            compact ? "size-10" : "size-12"
          )}
        >
          {Icon ? <Icon className={compact ? "size-5" : "size-6"} aria-hidden="true" /> : (icon as React.ReactNode)}
        </div>
      )}
      <div className="flex max-w-sm flex-col gap-1">
        <p className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {ActionIcon && <ActionIcon className="size-4" aria-hidden="true" />}
          {action.label}
        </button>
      )}
    </div>
  )
}
