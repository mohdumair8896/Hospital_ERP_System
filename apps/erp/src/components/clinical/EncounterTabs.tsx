import type { ReactNode } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, useReducedMotionConfig } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EncounterTabDef<T extends string> {
  value: T
  label: string
  icon: LucideIcon
  /** Small count after the label (omitted when undefined). */
  count?: number
  /** Accessible wording for the count, e.g. "2 medications". */
  countLabel?: string
  countTone?: "neutral" | "warning"
  /** Shows an alert dot: the panel has fields that need attention. */
  hasError?: boolean
  panel: ReactNode
}

interface EncounterTabsProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  tabs: EncounterTabDef<T>[]
}

/**
 * Radix Tabs with a sliding underline (framer `layoutId`). Every panel is force-mounted and
 * hidden when inactive, so form state, scroll position and local UI state survive tab switches.
 */
export function EncounterTabs<T extends string>({ value, onValueChange, tabs }: EncounterTabsProps<T>) {
  // Under reduced motion (MotionConfig or OS setting) the underline jumps instead of sliding.
  const reduceMotion = useReducedMotionConfig()
  return (
    <TabsPrimitive.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsPrimitive.List
        aria-label="Encounter sections"
        className="flex gap-0.5 overflow-x-auto border-b border-border px-2 [scrollbar-width:none] sm:gap-1 sm:px-4 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => {
          const active = t.value === value
          const Icon = t.icon
          return (
            <TabsPrimitive.Trigger
              key={t.value}
              value={t.value}
              className={cn(
                "relative my-1 inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150 sm:px-3",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("hidden size-4 min-[420px]:block", active ? "text-primary" : "")} aria-hidden="true" />
              {t.label}
              {t.count !== undefined && (
                <span
                  className={cn(
                    "min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold tabular-nums leading-5",
                    t.countTone === "warning" ? "bg-dept-amber-bg text-dept-amber-fg" : "bg-muted text-muted-foreground"
                  )}
                >
                  <span aria-hidden="true">{t.count}</span>
                  <span className="sr-only">, {t.countLabel ?? t.count}</span>
                </span>
              )}
              {t.hasError && (
                <span className="size-2 rounded-full bg-alert">
                  <span className="sr-only">, needs attention</span>
                </span>
              )}
              {active && (
                <motion.span
                  layoutId={reduceMotion ? undefined : "clinical-tab-underline"}
                  aria-hidden="true"
                  className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary"
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>
      {tabs.map((t) => (
        <TabsPrimitive.Content
          key={t.value}
          value={t.value}
          forceMount
          className="p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[state=inactive]:hidden sm:p-6"
        >
          {t.panel}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
