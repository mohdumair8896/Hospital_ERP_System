import { cn } from "@/lib/utils"

/**
 * Token-based control classes shared by the oversight screens (audit, analytics, staff,
 * integration). Every control has a visible focus ring.
 */
export const fieldClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-alert"

export const selectClass = cn(fieldClass, "cursor-pointer pr-8")

export const labelClass = "text-xs font-medium text-foreground"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground shadow-2xs hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-alert text-white shadow-xs hover:bg-alert-strong",
}

export function buttonClass(variant: ButtonVariant = "secondary", size: "sm" | "md" = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
    size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
    VARIANTS[variant],
    className
  )
}

/** Small "Demo data" / "Illustrative" tag for metrics without an API source. */
export const demoTagClass =
  "inline-flex items-center gap-1 rounded-full border border-dept-amber-fg/25 bg-dept-amber-bg px-2 py-0.5 text-[11px] font-medium text-dept-amber-fg"
