import type { UserRole } from "@hospital/contracts"
import {
  Activity,
  ClipboardList,
  Database,
  Network,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react"

/** Every screen App.tsx can mount. */
export type Tab =
  | "STAFF_ADMIN"
  | "INTEGRATION"
  | "AUDIT"
  | "CLINICAL"
  | "RECEPTION"
  | "ANALYTICS"

export interface NavItem {
  tab: Tab
  /** Short label for the sidebar, breadcrumb and command palette. */
  label: string
  /** Long screen title (header on wide screens). */
  title: string
  /** Small inline sidebar badge. */
  badge?: string
  icon: LucideIcon
  /** Icon colour on the inactive item. */
  iconClass: string
  /** Extra words the command palette matches on. */
  keywords: string[]
  /** Role gate (unchanged from the original App.tsx rules). */
  allow: (role: UserRole) => boolean
}

const isAdmin = (r: UserRole) => r === "ADMIN"
const isDoctor = (r: UserRole) => r === "DOCTOR"
const isReception = (r: UserRole) => r === "RECEPTIONIST" || r === "NURSE"
const isAuditor = (r: UserRole) => r === "COMPLIANCE_AUDITOR"

/** Sidebar order. */
export const NAV_ITEMS: NavItem[] = [
  {
    tab: "STAFF_ADMIN",
    label: "Staff & Provisioning",
    title: "Staff Administration & Credential Provisioning Center",
    badge: "Central",
    icon: Users,
    iconClass: "text-primary",
    keywords: ["staff", "users", "accounts", "credentials", "roles"],
    allow: isAdmin,
  },
  {
    tab: "INTEGRATION",
    label: "Clinical Pipeline",
    title: "Clinical Integration Pipeline (HL7 v2.5 / FHIR R4)",
    badge: "HL7",
    icon: Network,
    iconClass: "text-care",
    keywords: ["integration", "hl7", "fhir", "interfaces", "services"],
    allow: isAdmin,
  },
  {
    tab: "CLINICAL",
    label: "Clinical Workbench",
    title: "Clinical Encounter Workbench",
    badge: "EHR",
    icon: Stethoscope,
    iconClass: "text-care",
    keywords: ["ehr", "encounter", "soap", "vitals", "prescription", "doctor"],
    allow: (r) => isAdmin(r) || isDoctor(r),
  },
  {
    tab: "RECEPTION",
    label: "Reception & Triage",
    title: "Reception & Patient Triage",
    badge: "OPD",
    icon: ClipboardList,
    iconClass: "text-dept-amber-fg",
    keywords: ["front desk", "queue", "check-in", "appointments", "opd", "registration"],
    allow: (r) => isAdmin(r) || isReception(r),
  },
  {
    tab: "AUDIT",
    label: "Audit Log & Integrity",
    title: "HIPAA Cryptographic Audit Trail",
    badge: "HIPAA",
    icon: Database,
    iconClass: "text-primary",
    keywords: ["audit", "hipaa", "compliance", "hash", "integrity", "log"],
    allow: (r) => isAdmin(r) || isAuditor(r),
  },
  {
    tab: "ANALYTICS",
    label: "Analytics & Reports",
    title: "Hospital Intelligence & Analytics",
    icon: Activity,
    iconClass: "text-dept-rose-fg",
    keywords: ["analytics", "reports", "kpi", "dashboard", "metrics"],
    allow: (r) => isAdmin(r) || isAuditor(r),
  },
]

export const NAV_BY_TAB = Object.fromEntries(NAV_ITEMS.map((item) => [item.tab, item])) as Record<Tab, NavItem>

/** The screen a role lands on when the URL has no valid `?tab`. */
export function defaultTabForRole(role: UserRole): Tab {
  if (isAdmin(role)) return "STAFF_ADMIN"
  if (isDoctor(role)) return "CLINICAL"
  if (isReception(role)) return "RECEPTION"
  if (isAuditor(role)) return "AUDIT"
  return "INTEGRATION"
}

/** Screens the role may open, in sidebar order (roles with no menu items keep their fallback screen). */
export function tabsForRole(role: UserRole): Tab[] {
  const tabs = NAV_ITEMS.filter((item) => item.allow(role)).map((item) => item.tab)
  return tabs.length ? tabs : [defaultTabForRole(role)]
}

/** Returns `value` when it is a tab the role may open, otherwise null. */
export function validTab(value: string | null, role: UserRole): Tab | null {
  if (!value) return null
  return (tabsForRole(role) as string[]).includes(value) ? (value as Tab) : null
}
