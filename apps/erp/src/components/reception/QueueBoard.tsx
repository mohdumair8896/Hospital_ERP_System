import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion"
import type { Appointment } from "@hospital/contracts"
import { StatusPill, toneForStatus } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { focusRing } from "./controls"
import { QUEUE_COLUMNS, STATUS_LABELS, formatSlotDate } from "./queue-model"
import { WaitBadge } from "./WaitBadge"

export const ROW_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }

interface QueueBoardProps {
  appointments: Appointment[]
  now: Date
  selectedId: string | null
  onOpen: (appointment: Appointment) => void
}

/** Status board: one column per queue stage; cards move between columns as statuses change. */
export function QueueBoard({ appointments, now, selectedId, onOpen }: QueueBoardProps) {
  // Under reduced motion: no layout (transform) animation, opacity fades only.
  const reduce = useReducedMotionConfig()
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {QUEUE_COLUMNS.map((column) => {
        const items = appointments.filter((a) => column.statuses.includes(a.status))
        const headingId = `queue-col-${column.id}`
        return (
          <section
            key={column.id}
            aria-labelledby={headingId}
            className="flex min-w-0 flex-col rounded-xl border border-border bg-muted/40"
          >
            <header className="flex items-start justify-between gap-2 border-b border-border px-3 py-2.5">
              <div className="min-w-0">
                <h3 id={headingId} className="text-sm font-semibold text-foreground">{column.title}</h3>
                <p className="truncate text-xs text-muted-foreground">{column.hint}</p>
              </div>
              <span
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-card px-1.5 text-xs font-semibold tabular-nums text-foreground shadow-xs"
                aria-label={`${items.length} appointments`}
              >
                {items.length}
              </span>
            </header>

            <ul className="flex min-h-24 flex-col gap-2 p-2 md:max-h-[36rem] md:overflow-y-auto" aria-label={`${column.title} appointments`}>
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((appt) => (
                  <motion.li
                    key={appt.id}
                    layout={!reduce}
                    initial={hidden}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={hidden}
                    transition={ROW_TRANSITION}
                  >
                    <QueueCard appointment={appt} now={now} selected={appt.id === selectedId} onOpen={onOpen} />
                  </motion.li>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <li className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  No appointments here
                </li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function QueueCard({ appointment: a, now, selected, onOpen }: {
  appointment: Appointment
  now: Date
  selected: boolean
  onOpen: (appointment: Appointment) => void
}) {
  const tone = toneForStatus(a.status)
  return (
    <button
      type="button"
      onClick={() => onOpen(a)}
      data-appt-open={a.id}
      className={cn(
        "group relative flex w-full flex-col gap-2 overflow-hidden rounded-lg border bg-card p-3 pl-4 text-left shadow-xs transition-colors duration-150 hover:border-primary/40",
        selected ? "border-primary" : "border-border",
        focusRing
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          tone === "success" ? "bg-care" : tone === "warning" ? "bg-dept-amber-fg" : tone === "danger" ? "bg-alert" : tone === "info" ? "bg-primary" : "bg-border"
        )}
      />
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">{a.patientName}</span>
          <span className="block font-mono text-[11px] text-muted-foreground">{a.appointmentNumber}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-sm font-semibold tabular-nums text-foreground">{a.slotTime}</span>
          <span className="block text-[11px] text-muted-foreground">{formatSlotDate(a.slotDate)}</span>
        </span>
      </span>
      <span className="block truncate text-xs text-muted-foreground">
        {a.doctorName} · {a.departmentName}
      </span>
      <span className="flex flex-wrap items-center gap-1.5">
        <StatusPill status={a.status} label={STATUS_LABELS[a.status]} />
        <WaitBadge appointment={a} now={now} />
      </span>
      <span className="sr-only">Open check-in panel</span>
    </button>
  )
}
