import { useState } from "react"
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import type { Appointment } from "@hospital/contracts"
import { StatusPill } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { focusRing } from "./controls"
import { ROW_TRANSITION } from "./QueueBoard"
import { STATUS_LABELS, formatSlotDate, slotDateTime } from "./queue-model"
import { WaitBadge } from "./WaitBadge"

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

const STATUS_ORDER: Record<string, number> = { CONFIRMED: 0, SCHEDULED: 1, IN_PROGRESS: 2, COMPLETED: 3, NO_SHOW: 4, CANCELLED: 5 }

const col = createColumnHelper<typeof features, Appointment>()

interface AppointmentsTableProps {
  appointments: Appointment[]
  now: Date
  selectedId: string | null
  onOpen: (appointment: Appointment) => void
}

/** Dense worklist view of the queue (TanStack Table v9), sortable, rows animate on change. */
export function AppointmentsTable({ appointments, now, selectedId, onOpen }: AppointmentsTableProps) {
  const reduce = useReducedMotionConfig()
  const [sorting, setSorting] = useState<any>([{ id: "slot", desc: false }])

  const columns = [
    col.accessor("appointmentNumber", {
      header: "Ref no.",
      sortFn: "alphanumeric",
      cell: (info) => <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>,
    }),
    col.accessor("patientName", {
      header: "Patient",
      sortFn: "text",
      cell: (info) => {
        const a = info.row.original
        return (
          <div className="min-w-0">
            <button
              type="button"
              data-appt-open={a.id}
              onClick={(e) => {
                e.stopPropagation()
                onOpen(a)
              }}
              className={cn("rounded text-left text-sm font-semibold text-foreground hover:text-primary hover:underline", focusRing)}
              aria-label={`Open check-in panel for ${a.patientName}, ${a.appointmentNumber}`}
            >
              {a.patientName}
            </button>
            <div className="text-xs text-muted-foreground">{a.patientPhone || "No phone on file"}</div>
          </div>
        )
      },
    }),
    col.accessor("doctorName", {
      header: "Doctor / department",
      sortFn: "text",
      cell: (info) => (
        <div className="min-w-0">
          <div className="text-xs font-medium text-foreground">{info.getValue()}</div>
          <div className="text-xs text-muted-foreground">{info.row.original.departmentName}</div>
        </div>
      ),
    }),
    col.accessor((row) => slotDateTime(row)?.getTime() ?? Number.MAX_SAFE_INTEGER, {
      id: "slot",
      header: "Slot",
      sortFn: "alphanumeric",
      cell: (info) => (
        <div className="whitespace-nowrap">
          <div className="text-xs font-semibold tabular-nums text-foreground">{info.row.original.slotTime}</div>
          <div className="text-xs text-muted-foreground">{formatSlotDate(info.row.original.slotDate)}</div>
        </div>
      ),
    }),
    col.accessor((row) => STATUS_ORDER[row.status] ?? 9, {
      id: "status",
      header: "Status",
      sortFn: "alphanumeric",
      cell: (info) => <StatusPill status={info.row.original.status} label={STATUS_LABELS[info.row.original.status]} />,
    }),
    col.display({
      id: "wait",
      header: "Wait",
      cell: (info) => <WaitBadge appointment={info.row.original} now={now} />,
    }),
  ]

  const table = useTable({
    features,
    data: appointments,
    columns: columns as any,
    getRowId: (row: Appointment) => row.id,
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Appointment queue. Select a patient to open the check-in panel.</caption>
          <thead className="border-b border-border bg-muted/60">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                      className="h-10 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn("-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 uppercase hover:text-foreground", focusRing)}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout={reduce ? false : "position"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={ROW_TRANSITION}
                  onClick={() => onOpen(row.original)}
                  data-state={row.original.id === selectedId ? "selected" : undefined}
                  className="cursor-pointer border-b border-border last:border-0 transition-colors duration-150 hover:bg-muted/50 data-[state=selected]:bg-primary/5"
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5 align-middle">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
