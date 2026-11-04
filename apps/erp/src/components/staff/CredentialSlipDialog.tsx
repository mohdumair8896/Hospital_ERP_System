import * as DialogPrimitive from "@radix-ui/react-dialog"
import { CheckCircle2, Copy, X } from "lucide-react"
import { toast } from "sonner"
import { buttonClass } from "../audit/controls"
import { departmentName, roleLabel } from "./staff-data"

export interface CredentialSlip {
  name: string
  username: string
  role: string
  departmentId?: string
  licenseNumber?: string
  tempPassword: string
}

/** One-time hand-off slip shown after an account is created (Radix Dialog: focus trap, Escape). */
export function CredentialSlipDialog({ slip, onClose }: { slip: CredentialSlip | null; onClose: () => void }) {
  const rows: [string, string][] = slip
    ? [
        ["Staff member", slip.name],
        ["Role", roleLabel(slip.role)],
        ["Department", departmentName(slip.departmentId) ?? "None"],
        ...(slip.licenseNumber ? ([["Licence", slip.licenseNumber]] as [string, string][]) : []),
        ["Username", slip.username],
        ["Temporary password", slip.tempPassword],
      ]
    : []

  const copy = () => {
    if (!slip) return
    const text = [
      "PROHEALTH ERP: STAFF CREDENTIAL HAND-OFF (CONFIDENTIAL)",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      "Sign in to the ProHealth ERP and change this password at first sign-in.",
      "All access is recorded in the HIPAA audit trail.",
    ].join("\n")
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Hand-off slip copied"),
      () => toast.error("Could not copy to the clipboard")
    )
  }

  return (
    <DialogPrimitive.Root open={slip !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-lift outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-care-soft text-care">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title className="text-base font-semibold text-foreground">Account created</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                Give these credentials to {slip?.name ?? "the staff member"} in person. The password is not shown again.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close aria-label="Close" className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <dl className="mt-4 divide-y divide-border rounded-lg border border-border text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 px-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className={k === "Username" || k === "Temporary password" ? "break-all font-mono text-foreground" : "break-words text-foreground"}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={copy} className={buttonClass("secondary")}>
              <Copy className="size-4" aria-hidden="true" />
              Copy slip
            </button>
            <DialogPrimitive.Close className={buttonClass("primary")}>Done</DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
