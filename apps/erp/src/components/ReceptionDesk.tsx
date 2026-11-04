import { useEffect, useId, useRef, useState } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, useReducedMotionConfig } from "framer-motion"
import { CalendarClock, ClipboardList, HeartPulse, UserPlus, Users, type LucideIcon } from "lucide-react"
import type { Patient } from "@hospital/contracts"
import { setUrlParam, useUrlParam } from "@/components/shell/url-state"
import { cn } from "@/lib/utils"
import { BillingPanel, StaffRosterPanel } from "./reception/BillingPanel"
import { QueueView } from "./reception/QueueView"
import { RegistrationPanel } from "./reception/RegistrationPanel"
import { TriageScreener } from "./reception/TriageScreener"

type DeskTab = "queue" | "register" | "triage" | "billing" | "roster"

const TABS: { value: DeskTab; label: string; icon: LucideIcon }[] = [
  { value: "queue", label: "Appointments queue", icon: CalendarClock },
  { value: "register", label: "Register patient", icon: UserPlus },
  { value: "triage", label: "Triage questionnaire", icon: HeartPulse },
  { value: "billing", label: "Billing & invoices", icon: ClipboardList },
  { value: "roster", label: "Staff roster", icon: Users },
]

const contentClass =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background data-[state=inactive]:hidden"

export default function ReceptionDesk() {
  const [tab, setTab] = useState<DeskTab>("queue")
  const [focusSignal, setFocusSignal] = useState(0)
  const underlineId = `${useId()}-tab-underline`
  const reduceMotion = useReducedMotionConfig()

  // `?action=register` (command palette) opens the registration flow, then clears the action.
  const action = useUrlParam("action")
  useEffect(() => {
    if (action !== "register") return
    setTab("register")
    setFocusSignal((n) => n + 1)
    setUrlParam("action", null)
  }, [action])

  const tabListRef = useRef<HTMLDivElement>(null)
  const viewInQueue = (patient: Patient) => {
    setTab("queue")
    setUrlParam("patient", patient.id)
    // The clicked button is now hidden with its panel; keep keyboard focus on the active tab.
    window.setTimeout(() => tabListRef.current?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')?.focus(), 0)
  }

  return (
    <TabsPrimitive.Root value={tab} onValueChange={(v) => setTab(v as DeskTab)} className="flex flex-col gap-5">
      <div className="-mx-1 overflow-x-auto px-1">
        <TabsPrimitive.List ref={tabListRef} aria-label="Reception desk sections" className="flex min-w-max gap-1 border-b border-border">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsPrimitive.Trigger
              key={value}
              value={value}
              className={cn(
                "relative -mb-px inline-flex h-10 items-center gap-2 rounded-t-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150",
                "hover:text-foreground data-[state=active]:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
              {tab === value && (
                <motion.span
                  layoutId={underlineId}
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>

      <TabsPrimitive.Content value="queue" forceMount className={contentClass}>
        <QueueView />
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="register" forceMount className={contentClass}>
        <RegistrationPanel focusSignal={focusSignal} onViewInQueue={viewInQueue} />
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="triage" className={contentClass}>
        <TriageScreener onDone={() => setTab("queue")} />
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="billing" className={contentClass}>
        <BillingPanel />
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="roster" className={contentClass}>
        <StaffRosterPanel />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  )
}
