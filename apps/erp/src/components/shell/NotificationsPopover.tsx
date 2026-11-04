import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import type { Appointment } from "@hospital/contracts"
import { AlertTriangle, Bell, BellOff, CalendarPlus } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/primitives/EmptyState"
import { StatusPill } from "@/components/primitives/StatusPill"

/** Shape of GET /api/v1/gateway/status (as polled by App.tsx). */
export interface GatewayStatus {
  gateway?: string
  timestamp?: string
  services?: { service: string; status: "ONLINE" | "DEGRADED" | "OFFLINE" | string; url?: string }[]
}

interface NotificationItem {
  id: string
  kind: "alert" | "appointment"
  title: string
  detail?: string
  time: string
  status?: string
}

export interface NotificationsPopoverProps {
  gatewayStatus: GatewayStatus | null
  /** Scopes the "read" state per signed-in user. */
  userId: string
  /** Include the new-appointments feed (patient names); only for roles that work the reception queue. */
  showAppointments: boolean
}

const APPOINTMENT_POLL_MS = 60_000
const MAX_APPOINTMENTS = 5

function readKey(userId: string) {
  return `prohealth_erp_notifications_read:${userId}`
}

function loadRead(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(readKey(userId))
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveRead(userId: string, ids: Set<string>) {
  try {
    localStorage.setItem(readKey(userId), JSON.stringify(Array.from(ids).slice(-200)))
  } catch {}
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

function relativeTime(iso: string) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const minutes = Math.round((then - Date.now()) / 60_000)
  if (Math.abs(minutes) < 1) return "just now"
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute")
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour")
  return rtf.format(Math.round(hours / 24), "day")
}

function isToday(iso: string) {
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) && d.toDateString() === new Date().toDateString()
}

/** Newest appointments, refreshed every minute while the tab is visible. Fetches nothing when disabled. */
function useRecentAppointments(enabled: boolean) {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  React.useEffect(() => {
    if (!enabled) {
      setAppointments([])
      return
    }
    let cancelled = false
    const load = () => {
      if (document.hidden) return
      apiFetch("/api/v1/appointments")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled || !data) return
          const list: Appointment[] = Array.isArray(data.appointments) ? data.appointments : []
          const newest = [...list]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, MAX_APPOINTMENTS)
          setAppointments(newest)
        })
        .catch(() => {})
    }
    load()
    const timer = window.setInterval(load, APPOINTMENT_POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [enabled])
  return appointments
}

/** Bell button + popover listing service alerts and new appointments (read-only, P-NOTIF-1). */
export function NotificationsPopover({ gatewayStatus, userId, showAppointments }: NotificationsPopoverProps) {
  const appointments = useRecentAppointments(showAppointments)
  const [readIds, setReadIds] = React.useState<Set<string>>(() => loadRead(userId))

  React.useEffect(() => setReadIds(loadRead(userId)), [userId])

  const items = React.useMemo<NotificationItem[]>(() => {
    const now = new Date().toISOString()
    const checkedAt = gatewayStatus?.timestamp ?? now
    const alerts: NotificationItem[] = []
    if (gatewayStatus?.gateway === "OFFLINE" && !gatewayStatus.services?.length) {
      alerts.push({ id: "gateway:OFFLINE", kind: "alert", title: "API gateway unreachable", detail: "Live data may be out of date.", time: checkedAt, status: "OFFLINE" })
    }
    for (const svc of gatewayStatus?.services ?? []) {
      if (svc.status === "OFFLINE" || svc.status === "DEGRADED") {
        alerts.push({
          id: `svc:${svc.service}:${svc.status}`,
          kind: "alert",
          title: `${svc.service} is ${svc.status === "OFFLINE" ? "offline" : "degraded"}`,
          detail: svc.status === "OFFLINE" ? "Requests to this service are failing." : "Responses may be slow or partial.",
          time: checkedAt,
          status: svc.status,
        })
      }
    }
    const appts: NotificationItem[] = appointments.map((a) => ({
      id: `appt:${a.id}`,
      kind: "appointment",
      title: `New appointment: ${a.patientName} with ${a.doctorName}`,
      detail: [a.departmentName, [a.slotDate, a.slotTime].filter(Boolean).join(" ")].filter(Boolean).join(" · "),
      time: a.createdAt,
      status: a.status,
    }))
    return [...alerts, ...appts]
  }, [gatewayStatus, appointments])

  const unread = items.filter((i) => !readIds.has(i.id)).length
  const today = items.filter((i) => isToday(i.time))
  const earlier = items.filter((i) => !isToday(i.time))

  const markAllRead = () => {
    const next = new Set(readIds)
    items.forEach((i) => next.add(i.id))
    setReadIds(next)
    saveRead(userId, next)
  }

  const renderGroup = (label: string, group: NotificationItem[]) =>
    group.length > 0 && (
      <section aria-label={label}>
        <h3 className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
        <ul className="px-2 pb-1">
          {group.map((item) => {
            const isUnread = !readIds.has(item.id)
            const Icon = item.kind === "alert" ? AlertTriangle : CalendarPlus
            return (
              <li key={item.id} className="flex gap-3 rounded-lg px-2 py-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    item.kind === "alert" ? "bg-alert-soft text-alert" : "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm leading-snug text-foreground", isUnread && "font-semibold")}>
                    {isUnread && <span className="sr-only">Unread: </span>}
                    {item.title}
                  </p>
                  {item.detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.detail}</p>}
                  <div className="mt-1 flex items-center gap-2">
                    {item.status && <StatusPill status={item.status} />}
                    <time dateTime={item.time} className="text-[11px] text-muted-foreground">
                      {relativeTime(item.time)}
                    </time>
                  </div>
                </div>
                {isUnread && <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
              </li>
            )
          })}
        </ul>
      </section>
    )

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-2xs transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-card bg-alert px-1 text-[10px] font-bold leading-none text-white tabular-nums"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-[min(24rem,calc(100vw-2rem))] origin-[var(--radix-popover-content-transform-origin)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lift outline-none duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Notifications
              {unread > 0 && <span className="ml-1.5 font-normal text-muted-foreground">({unread} new)</span>}
            </h2>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unread === 0}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors duration-150 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-muted-foreground"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-[min(70vh,420px)] overflow-y-auto overscroll-contain pb-2">
            {items.length === 0 ? (
              <EmptyState compact icon={BellOff} title="All clear" description="No service alerts or new appointments." />
            ) : (
              <>
                {renderGroup("Today", today)}
                {renderGroup("Earlier", earlier)}
              </>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
