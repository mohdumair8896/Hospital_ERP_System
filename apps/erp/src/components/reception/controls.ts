import { cn } from "@/lib/utils"

/** Token-only control styles shared by the Reception Desk (no slate or hex classes). */

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export const inputClass = cn(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs",
  "placeholder:text-muted-foreground transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/40",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

export const selectClass = cn(inputClass, "appearance-none pr-8")

type ButtonIntent = "primary" | "secondary" | "ghost" | "danger"

const INTENTS: Record<ButtonIntent, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "border border-alert/30 bg-alert-soft text-alert hover:bg-alert/10",
}

export function buttonClass(intent: ButtonIntent = "secondary", size: "sm" | "md" = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium shadow-xs transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    size === "sm" ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
    INTENTS[intent],
    focusRing,
    className
  )
}

/** Small keyboard hint, e.g. <kbd className={kbdClass}>Esc</kbd>. */
export const kbdClass =
  "inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
