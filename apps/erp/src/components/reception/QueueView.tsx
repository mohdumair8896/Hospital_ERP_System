import { useEffect, useMemo, useState } from "react"
import { CalendarX2, CircleAlert, RefreshCw, SearchX } from "lucide-react"
import { EmptyState, SkeletonRows } from "@/components/primitives"
import { setUrlParam, useUrlParam } from "@/components/shell/url-state"
import { apiFetch } from "@/lib/api"
import { buttonClass } from "./controls"
import { AppointmentsTable } from "./AppointmentsTable"
import { PatientCheckInSheet } from "./PatientCheckInSheet"
import { QueueBoard } from "./QueueBoard"
import { QueueToolbar, type QueueView as View } from "./QueueToolbar"
import { useAppointments } from "./useAppointments"
import { useNow, WaitLegend } from "./WaitBadge"
import {
  EMPTY_FILTERS,
  WAIT_AMBER_MIN,
  bySlot,
  distinctOptions,
  filterAppointments,
  formatSlotDate,
  todayIso,
  waitInfo,
  type QueueFilters,
} from "./queue-model"

/** Appointments queue: toolbar, status board or table, and the check-in side panel. */
export function QueueView() {
  const { appointments, status, error, refreshing, pendingId, reload, updateStatus } = useAppointments()
  const [filters, setFilters] = useState<QueueFilters>(EMPTY_FILTERS)
  const [view, setView] = useState<View>("board")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const now = useNow()

  // `?patient=<id>` (from the command palette) narrows the queue to that patient.
  const patientParam = useUrlParam("patient")
  useEffect(() => {
    setFilters((f) => ({ ...f, patientId: patientParam ?? "" }))
  }, [patientParam])

  const changeFilters = (next: QueueFilters) => {
    if (!next.patientId && patientParam) setUrlParam("patient", null)
    setFilters(next)
  }

  const sorted = useMemo(() => [...appointments].sort(bySlot), [appointments])
  const visible = useMemo(() => filterAppointments(sorted, filters), [sorted, filters])
  const doctors = useMemo(() => distinctOptions(appointments, "doctorId", "doctorName"), [appointments])
  const departments = useMemo(() => distinctOptions(appointments, "departmentId", "departmentName"), [appointments])
  const selected = appointments.find((a) => a.id === selectedId) ?? null
  const today = todayIso(now)
  const longWaits = visible.filter((a) => {
    if (a.slotDate !== today) return false
    const info = waitInfo(a, now)
    return info && (info.tone === "warning" || info.tone === "danger")
  }).length
  // Name for the patient filter chip: from the queue, else looked up once from the registry.
  const [registryNames, setRegistryNames] = useState<Record<string, string>>({})
  const queueName = appointments.find((a) => a.patientId === filters.patientId)?.patientName
  useEffect(() => {
    const id = filters.patientId
    if (!id || queueName || registryNames[id] || status !== "ready") return
    let cancelled = false
    apiFetch(`/api/v1/patients/${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((p) => {
        if (!cancelled && p?.firstName) setRegistryNames((m) => ({ ...m, [id]: `${p.firstName} ${p.lastName}` }))
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [filters.patientId, queueName, registryNames, status])
  const patientLabel = filters.patientId ? queueName ?? registryNames[filters.patientId] ?? "Selected patient" : undefined

  const open = (id: string) => {
    setSelectedId(id)
    setSheetOpen(true)
  }

  // A status change can move the opener card to another column (a new element), so the Sheet
  // cannot return focus to it. Once the panel has unmounted, focus the card's current element.
  const onSheetOpenChange = (next: boolean) => {
    setSheetOpen(next)
    if (next || !selectedId) return
    const id = selectedId
    window.setTimeout(() => {
      const active = document.activeElement
      if (active && active !== document.body) return
      document.querySelector<HTMLElement>(`[data-appt-open="${CSS.escape(id)}"]`)?.focus()
    }, 320)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Outpatient queue</h2>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {status === "ready"
              ? `${visible.length} of ${appointments.length} appointments shown${longWaits ? ` · ${longWaits} waiting ${WAIT_AMBER_MIN}+ min past their slot today` : ""}`
              : "Walk-ins and booked appointments in one worklist."}
          </p>
        </div>
      </div>

      <QueueToolbar
        filters={filters}
        onFiltersChange={changeFilters}
        doctors={doctors}
        departments={departments}
        view={view}
        onViewChange={setView}
        onRefresh={reload}
        refreshing={refreshing || status === "loading"}
        patientLabel={patientLabel}
      />
      <WaitLegend />

      {status === "loading" && (
        <div className="rounded-xl border border-border bg-card px-4 shadow-xs">
          <SkeletonRows count={6} label="Loading appointments…" />
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="rounded-xl border border-alert/25 bg-card shadow-xs">
          <EmptyState
            icon={CircleAlert}
            title="Couldn't load the queue"
            description={error ?? "The appointment service did not respond."}
            action={{ label: "Try again", onClick: reload, icon: RefreshCw }}
          />
        </div>
      )}

      {status === "ready" && appointments.length === 0 && (
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <EmptyState
            icon={CalendarX2}
            title="No appointments booked"
            description="Bookings from the patient website and the desk will appear here."
            action={{ label: "Refresh", onClick: reload, icon: RefreshCw }}
          />
        </div>
      )}

      {status === "ready" && appointments.length > 0 && visible.length === 0 && (
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <EmptyState
            icon={SearchX}
            title="No appointments match these filters"
            description={filters.patientId ? `${patientLabel} has no appointments matching these filters.` : filters.date ?`Nothing scheduled for ${filters.date === today ? "today" : formatSlotDate(filters.date)} with the current filters.` : "Try another name, doctor or department."}
          />
          <div className="-mt-6 flex justify-center pb-8">
            <button type="button" onClick={() => changeFilters(EMPTY_FILTERS)} className={buttonClass("secondary", "sm")}>
              Clear filters
            </button>
          </div>
        </div>
      )}

      {status === "ready" && visible.length > 0 &&
        (view === "board" ? (
          <QueueBoard appointments={visible} now={now} selectedId={sheetOpen ? selectedId : null} onOpen={(a) => open(a.id)} />
        ) : (
          <AppointmentsTable appointments={visible} now={now} selectedId={sheetOpen ? selectedId : null} onOpen={(a) => open(a.id)} />
        ))}

      <PatientCheckInSheet
        appointment={selected}
        open={sheetOpen}
        onOpenChange={onSheetOpenChange}
        now={now}
        pending={pendingId !== null && pendingId === selectedId}
        onChangeStatus={updateStatus}
      />
    </div>
  )
}
