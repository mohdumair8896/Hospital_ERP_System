import { TableDemo } from "@/components/ui/table-demo"
import { Table01DividerLine } from "@/components/application/table/table-01-divider-line"
import { StatusPill } from "@/components/primitives"

/** Billing & invoices (demo ledger, content unchanged; moved out of ReceptionDesk). */
export function BillingPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Patient Billing Accounts &amp; Insurance Clearance</h2>
          <p className="text-xs text-muted-foreground">Active settlement records, outstanding copays, and claims processing ledger.</p>
        </div>
        <StatusPill status="DEMO" tone="neutral" label="Demo data" />
      </div>
      <TableDemo />
    </div>
  )
}

/** Staff roster (static table, content unchanged; moved out of ReceptionDesk). */
export function StaffRosterPanel() {
  return (
    <div className="space-y-4">
      <Table01DividerLine />
    </div>
  )
}
