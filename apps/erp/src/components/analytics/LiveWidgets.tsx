import { CalendarX2, ServerCrash } from "lucide-react"
import { STATUS_TONE_CLASSES, StatusPill, humanizeStatus, toneForStatus } from "@/components/primitives"
import { AppointmentsBarChart } from "../charts/AppointmentsBarChart"
import { ACTION_LABELS } from "../audit/audit-format"
import { serviceLabel, type GatewayHealth } from "../integration/gateway"
import { BarList } from "./BarList"
import { WidgetCard } from "./WidgetCard"
import { bucketAppointments, countBy, type AppointmentSummary, type RangeKey } from "./analytics-utils"
import type { Resource } from "./useApiResource"

type Res<T> = Resource<T> & { reload: () => void }

interface ApptWidgetProps {
  source: Res<AppointmentSummary[]>
  list: AppointmentSummary[]
  range: RangeKey
  rangeText: string
  onShowAll: () => void
  className?: string
}

function apptStates(p: ApptWidgetProps) {
  const loading = p.source.status === "loading" && !p.source.data
  const error = p.source.status === "error" && !p.source.data ? p.source.error : null
  const empty =
    !loading && !error && p.list.length === 0
      ? {
          icon: CalendarX2,
          title: p.range === "today" ? "No appointments today" : `No appointments in ${p.rangeText}`,
          description: p.range === "all" ? "Nothing has been booked yet." : "Try a longer range.",
          action: p.range === "all" ? undefined : { label: "Show all time", onClick: p.onShowAll },
        }
      : null
  const stale = p.source.status === "error" && p.source.data ? p.source.error : null
  return { loading, error, stale, empty, onRetry: p.source.reload }
}

export function AppointmentsTrendWidget(p: ApptWidgetProps) {
  const data = bucketAppointments(p.list, p.range)
  const unit = p.range === "today" ? "hour" : data[0]?.label.startsWith("wk") ? "week" : "day"
  return (
    <WidgetCard
      title="Appointments over time"
      description={`Booked slots per ${unit}, ${p.rangeText}.`}
      source="GET /api/v1/appointments (slotDate)"
      minHeight="min-h-[240px]"
      className={p.className}
      {...apptStates(p)}
    >
      <AppointmentsBarChart data={data} />
    </WidgetCard>
  )
}

export function AppointmentStatusWidget(p: ApptWidgetProps) {
  const rows = countBy(p.list, (a) => a.status)
  return (
    <WidgetCard title="By status" description={`Share of ${p.list.length} ${p.list.length === 1 ? "appointment" : "appointments"}.`} className={p.className} {...apptStates(p)}>
      <BarList
        items={rows.map((r) => ({
          key: r.key,
          text: humanizeStatus(r.key),
          label: <StatusPill status={r.key} />,
          value: r.count,
          barClass: STATUS_TONE_CLASSES[toneForStatus(r.key)].dot,
        }))}
      />
    </WidgetCard>
  )
}

export function DepartmentWidget(p: ApptWidgetProps) {
  const rows = countBy(p.list, (a) => a.departmentName || a.departmentId).slice(0, 6)
  return (
    <WidgetCard title="By department" description="Top departments by booked appointments." className={p.className} {...apptStates(p)}>
      <BarList items={rows.map((r) => ({ key: r.key, text: r.key, label: r.key, value: r.count }))} />
    </WidgetCard>
  )
}

export interface AuditStatsData {
  totalRecords: number
  actionDistribution: { action: string; count: number }[]
  breakGlassCount: number
}

export function parseAuditStats(body: unknown): AuditStatsData {
  const b = (body ?? {}) as Record<string, any>
  return {
    totalRecords: Number(b.totalRecords) || 0,
    actionDistribution: Array.isArray(b.actionDistribution)
      ? b.actionDistribution.map((a: any) => ({ action: String(a?.action), count: Number(a?.count) || 0 }))
      : [],
    breakGlassCount: Number(b.breakGlassCount) || 0,
  }
}

export function AuditActivityWidget({ source, className }: { source: Res<AuditStatsData>; className?: string }) {
  const data = source.data
  const rows = [...(data?.actionDistribution ?? [])].sort((a, b) => b.count - a.count)
  return (
    <WidgetCard
      title="Audit activity"
      description={data ? `${data.totalRecords.toLocaleString()} events all time · ${data.breakGlassCount} break-glass` : "Events by action, all time."}
      source="GET /api/v1/audit/stats"
      className={className}
      loading={source.status === "loading" && !data}
      error={source.status === "error" && !data ? source.error : null}
      stale={source.status === "error" && data ? source.error : null}
      onRetry={source.reload}
      empty={data && rows.length === 0 ? { title: "No audit events yet" } : null}
    >
      <BarList items={rows.map((r) => ({ key: r.action, text: ACTION_LABELS[r.action] ?? r.action, label: ACTION_LABELS[r.action] ?? r.action, value: r.count }))} />
    </WidgetCard>
  )
}

export function ServiceHealthWidget({ source, className }: { source: Res<GatewayHealth>; className?: string }) {
  const data = source.data
  return (
    <WidgetCard
      title="Service health"
      description={source.updatedAt ? `Checked ${new Date(source.updatedAt).toLocaleTimeString()}` : "Live from the API gateway."}
      source="GET /api/v1/gateway/status"
      className={className}
      loading={source.status === "loading" && !data}
      error={source.status === "error" && !data ? source.error : null}
      stale={source.status === "error" && data ? source.error : null}
      onRetry={source.reload}
      empty={data && data.services.length === 0 ? { icon: ServerCrash, title: "No services reported" } : null}
    >
      <ul className="divide-y divide-border">
        {data?.services.map((s) => (
          <li key={s.service} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="min-w-0 truncate text-foreground">{serviceLabel(s.service)}</span>
            <StatusPill status={s.status} />
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
