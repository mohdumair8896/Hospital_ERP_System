import * as React from "react"
import { CalendarCheck, CalendarDays, RefreshCw, Server, Users } from "lucide-react"
import { KpiCard } from "@/components/primitives"
import { setUrlParam, useUrlParam } from "@/components/shell/url-state"
import { buttonClass } from "./audit/controls"
import { RangeControl } from "./analytics/RangeControl"
import { BedOccupancyWidget, RevenueWidget } from "./analytics/DemoWidgets"
import {
  AppointmentStatusWidget,
  AppointmentsTrendWidget,
  AuditActivityWidget,
  DepartmentWidget,
  ServiceHealthWidget,
  parseAuditStats,
} from "./analytics/LiveWidgets"
import {
  RANGES,
  bucketAppointments,
  describeWindow,
  inRange,
  parseRange,
  type AppointmentSummary,
  type RangeKey,
} from "./analytics/analytics-utils"
import { useApiResource } from "./analytics/useApiResource"
import { GATEWAY_STATUS_PATH, parseGatewayStatus } from "./integration/gateway"

// Count-only and de-identified endpoints: the dashboard never downloads patient records.
const parsePatientCount = (body: unknown) => {
  const b = (body ?? {}) as { total?: unknown }
  return { total: Number(b.total) || 0 }
}
const parseAppointments = (body: unknown): AppointmentSummary[] => {
  const b = (body ?? {}) as { appointments?: unknown }
  return Array.isArray(b.appointments) ? (b.appointments as AppointmentSummary[]) : []
}

/** Hospital analytics: live KPIs and a bento grid of widgets, each with its own states. */
export default function AnalyticsDashboard() {
  const range = parseRange(useUrlParam("range"))
  const setRange = (next: RangeKey) => setUrlParam("range", next)
  const rangeMeta = RANGES.find((r) => r.key === range)!

  const patients = useApiResource("/api/v1/patients/count", parsePatientCount)
  const appointments = useApiResource("/api/v1/appointments/summary", parseAppointments)
  const auditStats = useApiResource("/api/v1/audit/stats", parseAuditStats)
  const gateway = useApiResource(GATEWAY_STATUS_PATH, parseGatewayStatus, { pollMs: 15_000 })

  const inWindow = React.useMemo(() => (appointments.data ?? []).filter((a) => inRange(a, range)), [appointments.data, range])
  const completed = inWindow.filter((a) => a.status === "COMPLETED").length
  const completionPct = inWindow.length ? Math.round((completed / inWindow.length) * 100) : 0
  const spark = React.useMemo(() => bucketAppointments(inWindow, range).map((b) => b.count), [inWindow, range])
  const services = gateway.data?.services ?? []
  const online = services.filter((s) => s.status === "ONLINE").length

  const apptLoading = appointments.status === "loading" && !appointments.data
  const apptFailed = appointments.status === "error" && !appointments.data
  const refreshing = [patients, appointments, auditStats].some((r) => r.status === "loading" && r.data)
  const refreshAll = () => {
    patients.reload()
    appointments.reload()
    auditStats.reload()
    gateway.reload()
  }

  const apptProps = {
    source: appointments,
    list: inWindow,
    range,
    rangeText: rangeMeta.long,
    onShowAll: () => setRange("all"),
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live figures from the patient, appointment, audit and gateway services. Tiles tagged “Demo data” have no API source yet.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <RangeControl value={range} onChange={setRange} />
          <button type="button" onClick={refreshAll} className={buttonClass("secondary", "sm")}>
            <RefreshCw className={`size-3.5 ${refreshing ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </header>

      <p className="-mt-3 text-xs text-muted-foreground" aria-live="polite">
        Currently viewing <span className="font-medium text-foreground">{rangeMeta.long}</span> ({describeWindow(range)}). The range applies to
        appointment widgets.
      </p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Registered patients"
          icon={Users}
          loading={patients.status === "loading" && !patients.data}
          value={patients.status === "error" && !patients.data ? "—" : patients.data?.total ?? 0}
          caption={patients.status === "error" && !patients.data ? "Patient service unavailable" : "All time"}
        />
        <KpiCard
          label="Appointments"
          icon={CalendarDays}
          loading={apptLoading}
          value={apptFailed ? "—" : inWindow.length}
          caption={apptFailed ? "Appointment service unavailable" : describeWindow(range)}
          sparkline={spark.length > 1 && inWindow.length > 0 ? spark : undefined}
        />
        <KpiCard
          label="Completed"
          icon={CalendarCheck}
          loading={apptLoading}
          value={apptFailed ? "—" : completed}
          caption={apptFailed ? "Appointment service unavailable" : inWindow.length ? `${completionPct}% of appointments in range` : "No appointments in range"}
        />
        <KpiCard
          label="Services online"
          icon={Server}
          loading={gateway.status === "loading" && !gateway.data}
          value={gateway.status === "error" && !gateway.data ? "—" : `${online} / ${services.length}`}
          caption={gateway.data ? `Gateway ${gateway.data.gateway.toLowerCase()}` : "Gateway unreachable"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <AppointmentsTrendWidget {...apptProps} className="lg:col-span-4" />
        <AppointmentStatusWidget {...apptProps} className="lg:col-span-2" />
        <DepartmentWidget {...apptProps} className="lg:col-span-2" />
        <AuditActivityWidget source={auditStats} className="lg:col-span-2" />
        <ServiceHealthWidget source={gateway} className="lg:col-span-2" />
      </div>

      <section aria-labelledby="demo-metrics-title" className="flex flex-col gap-3">
        <div>
          <h2 id="demo-metrics-title" className="text-sm font-semibold text-foreground">Demo metrics</h2>
          <p className="text-xs text-muted-foreground">Illustrative numbers for capabilities with no backend yet (bed management, billing). Not live data.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BedOccupancyWidget />
          <RevenueWidget />
        </div>
      </section>
    </div>
  )
}
