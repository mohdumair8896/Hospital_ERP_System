import { StatusPill, type StatusTone } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { demoTagClass } from "../audit/controls"
import { initials } from "../audit/audit-format"
import { roleLabel, type StaffRow } from "./staff-data"

const ROLE_TONES: Record<string, StatusTone> = {
  ADMIN: "danger",
  CHIEF_MEDICAL_OFFICER: "info",
  DOCTOR: "info",
  NURSE: "success",
  RECEPTIONIST: "warning",
  PHARMACIST: "success",
  LAB_TECHNICIAN: "success",
  COMPLIANCE_AUDITOR: "neutral",
}

const SHIFT_LABELS = { ACTIVE: "Active", ON_DUTY: "On duty", ON_CALL: "On call" } as const

const th = "sticky top-0 z-10 border-b border-border bg-card px-4 py-2.5 text-left text-xs font-medium text-muted-foreground"

/** Staff directory: live accounts from the auth service, plus demo HR fields where seeded. */
export function StaffTable({ rows, highlight }: { rows: StaffRow[]; highlight?: string | null }) {
  return (
    <div className="max-h-[min(64vh,680px)] overflow-auto overscroll-contain">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Staff accounts from the auth service</caption>
        <thead>
          <tr>
            <th scope="col" className={th}>Staff member</th>
            <th scope="col" className={th}>Role</th>
            <th scope="col" className={th}>Department</th>
            <th scope="col" className={th}>Username</th>
            <th scope="col" className={th}>
              <span className="inline-flex items-center gap-1.5">
                HR record <span className={demoTagClass}>Demo</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className={cn(
                "transition-colors duration-150 hover:bg-muted/60 [&>td]:border-b [&>td]:border-border",
                highlight === r.username && "bg-care-soft"
              )}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {initials(r.name, r.id)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.email || "No email"}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusPill status={r.role} label={roleLabel(r.role)} toneMap={ROLE_TONES} dot={false} />
              </td>
              <td className="px-4 py-3 text-foreground">{r.departmentName ?? <span className="text-muted-foreground">None</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-foreground">{r.username}</td>
              <td className="px-4 py-3 text-xs">
                {r.demo ? (
                  <div className="text-muted-foreground">
                    <p className="font-mono text-foreground">{r.demo.employeeId}</p>
                    <p>
                      {r.demo.licenseNumber ? `${r.demo.licenseNumber} · ` : ""}
                      {SHIFT_LABELS[r.demo.shift]}
                    </p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not on file</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
