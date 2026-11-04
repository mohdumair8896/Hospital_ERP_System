import { useEffect, useRef } from "react"
import { AlertTriangle, Pill, Plus, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { fieldClass } from "./DiagnosisPicker"
import { newRxRow, visibleError, type DraftIssues, type RxRow } from "./encounter-model"

interface PrescriptionEditorProps {
  rows: RxRow[]
  errors: DraftIssues["rx"]
  showAllErrors: boolean
  allergies: string[]
  onChange: (rows: RxRow[]) => void
}

const FREQUENCIES = ["OD (once daily)", "BD (twice daily)", "TDS (3x daily)", "QID (4x daily)", "HS (at bedtime)", "SOS (as needed)"]

type TextKey = "medicineName" | "dosage" | "frequency" | "durationDays" | "instructions"
const COLUMNS: { key: TextKey; label: string; placeholder: string; className: string }[] = [
  { key: "medicineName", label: "Medicine", placeholder: "Amlodipine 5mg", className: "min-w-[11rem]" },
  { key: "dosage", label: "Dose", placeholder: "1 tablet", className: "min-w-[7rem]" },
  { key: "frequency", label: "Frequency", placeholder: "OD", className: "min-w-[9rem]" },
  { key: "durationDays", label: "Days", placeholder: "30", className: "w-20" },
  { key: "instructions", label: "Instructions", placeholder: "After food", className: "min-w-[9rem]" },
]

function allergyMatch(name: string, allergies: string[]) {
  const n = name.trim().toLowerCase()
  if (n.length < 3) return null
  return allergies.find((a) => {
    const al = a.trim().toLowerCase()
    const first = n.split(/\s+/)[0]
    return al.length >= 3 && (n.includes(al) || (first.length >= 4 && al.includes(first)))
  }) ?? null
}

/** e-Prescription table: labelled cells, add/remove rows, allergy cross-check. */
export function PrescriptionEditor({ rows, errors, showAllErrors, allergies, onChange }: PrescriptionEditorProps) {
  const addRef = useRef<HTMLButtonElement>(null)
  const focusRowId = useRef<string | null>(null)

  useEffect(() => {
    if (!focusRowId.current) return
    document.getElementById(`rx-${focusRowId.current}-medicineName`)?.focus()
    focusRowId.current = null
  }, [rows.length])

  const add = () => {
    const row = newRxRow()
    focusRowId.current = row.id
    onChange([...rows, row])
  }
  const remove = (id: string) => {
    onChange(rows.filter((r) => r.id !== id))
    addRef.current?.focus()
  }
  const update = (id: string, key: TextKey, value: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Prescription</h3>
          <p className="text-xs text-muted-foreground">Rows without a medicine name are left out.</p>
        </div>
        <button
            ref={addRef}
            type="button"
            onClick={add}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-3.5" aria-hidden="true" /> Add medication
          </button>
      </div>

      {allergies.length > 0 && (
        <p className="flex items-center gap-1.5 rounded-md border border-alert/25 bg-alert-soft px-3 py-2 text-xs font-medium text-alert">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
          Documented allergies: {allergies.join(", ")}. Check every medication against them.
        </p>
      )}

      {rows.length === 0 ? (
        <EmptyState
          compact
          icon={Pill}
          title="No medications prescribed"
          description="Use Add medication, or sign the encounter without one."
          className="rounded-lg border border-dashed border-border"
        />
      ) : (
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <table className="w-full min-w-[46rem] border-separate border-spacing-y-1.5 text-sm">
            <caption className="sr-only">Medications for this encounter</caption>
            <thead>
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th scope="col" className="w-8 px-1 font-medium">#</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} scope="col" className="px-1 font-medium">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="w-10 px-1">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const rowErrors = errors[row.id] ?? {}
                const allergy = allergyMatch(row.medicineName, allergies)
                return (
                  <tr key={row.id} className="align-top">
                    <td className="px-1 pt-2.5 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                    {COLUMNS.map((c) => {
                      const id = `rx-${row.id}-${c.key}`
                      const err = c.key === "medicineName" || c.key === "durationDays"
                        ? visibleError(row[c.key], rowErrors[c.key], showAllErrors || row.medicineName.trim() !== "")
                        : undefined
                      const note = c.key === "medicineName" && allergy ? `Matches documented allergy: ${allergy}` : undefined
                      const describedBy = [err && `${id}-error`, note && `${id}-allergy`].filter(Boolean).join(" ") || undefined
                      return (
                        <td key={c.key} className={cn("px-1", c.className)}>
                          <label htmlFor={id} className="sr-only">
                            {c.label}, row {i + 1}
                          </label>
                          <input
                            id={id}
                            value={row[c.key]}
                            onChange={(e) => update(row.id, c.key, e.target.value)}
                            placeholder={c.placeholder}
                            autoComplete="off"
                            list={c.key === "frequency" ? "rx-frequencies" : undefined}
                            type={c.key === "durationDays" ? "number" : "text"}
                            min={c.key === "durationDays" ? 1 : undefined}
                            max={c.key === "durationDays" ? 365 : undefined}
                            inputMode={c.key === "durationDays" ? "numeric" : undefined}
                            aria-invalid={err ? true : undefined}
                            aria-describedby={describedBy}
                            className={cn(fieldClass, "h-9 px-2.5", err || note ? "border-alert" : "border-input")}
                          />
                          {err && (
                            <p id={`${id}-error`} className="mt-1 text-xs font-medium text-alert">
                              {err}
                            </p>
                          )}
                          {note && (
                            <p id={`${id}-allergy`} className="mt-1 text-xs font-medium text-alert">
                              {note}
                            </p>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-1">
                      <button
                        type="button"
                        onClick={() => remove(row.id)}
                        aria-label={`Remove ${row.medicineName.trim() || `row ${i + 1}`}`}
                        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-alert-soft hover:text-alert focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <datalist id="rx-frequencies">
            {FREQUENCIES.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>
      )}
    </div>
  )
}
