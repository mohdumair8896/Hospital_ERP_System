import React, { useMemo, useState } from "react"
import { AlertTriangle, Building2, RefreshCw, Search, ShieldCheck, UserPlus, Users, UserX } from "lucide-react"
import { toast } from "sonner"
import { EmptyState, KpiCard, SkeletonRows } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { buttonClass, fieldClass, labelClass, selectClass } from "./audit/controls"
import { useApiResource } from "./analytics/useApiResource"
import { CredentialSlipDialog, type CredentialSlip } from "./staff/CredentialSlipDialog"
import { OnboardStaffSheet } from "./staff/OnboardStaffSheet"
import { StaffTable } from "./staff/StaffTable"
import { DEPARTMENTS, STAFF_ROLES, parseUsers, toStaffRows } from "./staff/staff-data"

/** Staff administration: live account directory (GET /api/v1/auth/users) and onboarding. */
export default function StaffProvisioningCenter() {
  const users = useApiResource("/api/v1/auth/users", parseUsers)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("ALL")
  const [dept, setDept] = useState("ALL")
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [slip, setSlip] = useState<CredentialSlip | null>(null)
  const [highlight, setHighlight] = useState<string | null>(null)

  const all = users.data ?? []
  const staff = useMemo(() => toStaffRows(all), [all])
  const patientAccounts = all.length - staff.length
  const taken = useMemo(() => new Set(all.map((u) => u.username)), [all])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return staff.filter((s) => {
      if (role !== "ALL" && s.role !== role) return false
      if (dept !== "ALL" && (s.departmentId ?? "") !== dept) return false
      if (!q) return true
      return `${s.name} ${s.username} ${s.email} ${s.role} ${s.demo?.employeeId ?? ""}`.toLowerCase().includes(q)
    })
  }, [staff, search, role, dept])

  const loading = users.status === "loading" && !users.data
  const failed = users.status === "error" && !users.data
  const roles = new Set(staff.map((s) => s.role)).size
  const departments = new Set(staff.map((s) => s.departmentId).filter(Boolean)).size
  const filtered = search.trim() !== "" || role !== "ALL" || dept !== "ALL"
  const clearFilters = () => {
    setSearch("")
    setRole("ALL")
    setDept("ALL")
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Staff & provisioning</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Accounts come from the auth service. Only administrators can create accounts, and every change is written to the audit trail.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={users.reload} disabled={users.status === "loading"} className={buttonClass("secondary")}>
            <RefreshCw className={cn("size-4", users.status === "loading" && users.data && "motion-safe:animate-spin")} aria-hidden="true" />
            Refresh
          </button>
          <button type="button" onClick={() => setOnboardOpen(true)} className={buttonClass("primary")}>
            <UserPlus className="size-4" aria-hidden="true" />
            Onboard staff
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Staff accounts" icon={Users} loading={loading} value={failed ? "—" : staff.length} caption={patientAccounts > 0 ? `${patientAccounts} patient-portal account${patientAccounts === 1 ? "" : "s"} not listed` : "From the auth service"} />
        <KpiCard label="Roles in use" icon={ShieldCheck} loading={loading} value={failed ? "—" : roles} caption={`of ${STAFF_ROLES.length} staff roles`} />
        <KpiCard label="Departments staffed" icon={Building2} loading={loading} value={failed ? "—" : departments} caption={`of ${DEPARTMENTS.length} departments`} />
        <KpiCard label="Without a department" icon={UserX} loading={loading} value={failed ? "—" : staff.filter((s) => !s.departmentId).length} caption="Administrative accounts" />
      </div>

      <section aria-labelledby="staff-directory-title" className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <h2 id="staff-directory-title" className="text-sm font-semibold text-foreground">Staff directory</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="staff-search" className={labelClass}>Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input id="staff-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, username or email" className={cn(fieldClass, "pl-9")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="staff-role" className={labelClass}>Role</label>
              <select id="staff-role" value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                <option value="ALL">All roles</option>
                {STAFF_ROLES.map((r) => <option key={r.role} value={r.role}>{r.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="staff-dept" className={labelClass}>Department</label>
              <select id="staff-dept" value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass}>
                <option value="ALL">All departments</option>
                <option value="">No department</option>
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {loading ? "Loading accounts…" : `${visible.length} of ${staff.length} staff accounts`}
          </p>
        </div>

        {users.status === "error" && (
          <div role="alert" className="flex flex-col gap-3 border-b border-border bg-alert-soft px-4 py-3 text-sm text-alert sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold">{users.data ? "Refresh failed; showing the last loaded list." : "Staff accounts could not be loaded."}</span> {users.error}
              </span>
            </p>
            <button type="button" onClick={users.reload} className={buttonClass("secondary", "sm")}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="px-4"><SkeletonRows count={6} label="Loading staff accounts…" /></div>
        ) : failed ? (
          <EmptyState icon={UserX} title="No staff list to show" description="The directory only shows accounts the auth service returns." />
        ) : staff.length === 0 ? (
          <EmptyState icon={Users} title="No staff accounts yet" description="Onboard the first staff member to get started." action={{ label: "Onboard staff", onClick: () => setOnboardOpen(true), icon: UserPlus }} />
        ) : visible.length === 0 ? (
          <EmptyState icon={Search} title="No staff match these filters" description={filtered ? "Change the search or filters." : undefined} action={{ label: "Clear filters", onClick: clearFilters }} />
        ) : (
          <StaffTable rows={visible} highlight={highlight} />
        )}
        <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          HR record columns (employee ID, licence, shift) are demo data for seeded accounts; the auth service does not store them yet.
        </p>
      </section>

      <OnboardStaffSheet
        open={onboardOpen}
        onOpenChange={setOnboardOpen}
        takenUsernames={taken}
        onCreated={(user, form) => {
          setOnboardOpen(false)
          setHighlight(user?.username ?? form.username)
          setSlip({
            name: user?.name ?? form.name,
            username: user?.username ?? form.username,
            role: user?.role ?? form.role,
            departmentId: user?.departmentId ?? (form.departmentId || undefined),
            licenseNumber: form.licenseNumber.trim() || undefined,
            tempPassword: form.tempPassword,
          })
          toast.success(`Account created for ${user?.name ?? form.name}`)
          users.reload()
        }}
      />
      <CredentialSlipDialog slip={slip} onClose={() => setSlip(null)} />
    </div>
  )
}
