import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import type { Appointment } from "@hospital/contracts"
import { STATUS_TONE_CLASSES } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { WAIT_AMBER_MIN, WAIT_RED_MIN, waitInfo } from "./queue-model"

/** Current time, refreshed every `intervalMs` so wait badges stay current without a reload. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

/** Wait-time badge from the slot time: neutral, then amber, then red past the thresholds. */
export function WaitBadge({ appointment, now, className }: { appointment: Appointment; now: Date; className?: string }) {
  const info = waitInfo(appointment, now)
  if (!info) return null
  const tone = STATUS_TONE_CLASSES[info.tone]
  return (
    <span
      title={info.description}
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 text-[11px] font-medium tabular-nums",
        tone.pill,
        className
      )}
    >
      <Clock className="size-3" aria-hidden="true" />
      {info.label}
      <span className="sr-only">({info.description})</span>
    </span>
  )
}

/** Legend explaining the wait badge thresholds. */
export function WaitLegend({ className }: { className?: string }) {
  const items = [
    { tone: "neutral" as const, text: `Under ${WAIT_AMBER_MIN} min` },
    { tone: "warning" as const, text: `${WAIT_AMBER_MIN}–${WAIT_RED_MIN - 1} min` },
    { tone: "danger" as const, text: `${WAIT_RED_MIN} min or more` },
  ]
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", className)}>
      <span className="font-medium text-foreground">Wait since slot time:</span>
      {items.map((item) => (
        <span key={item.tone} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={cn("size-2 rounded-full", STATUS_TONE_CLASSES[item.tone].dot)} />
          {item.text}
        </span>
      ))}
      <span>· shown for waiting and confirmed patients</span>
    </p>
  )
}
