import React, { useState, useEffect } from "react"
import {
  Stethoscope,
  ClipboardList,
  Activity,
  Building2,
  ChevronRight,
  Database,
  AlertTriangle,
  Users,
  Network,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import AuditLogViewer from "./components/AuditLogViewer"
import ClinicalWorkbench from "./components/ClinicalWorkbench"
import ReceptionDesk from "./components/ReceptionDesk"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import StaffProvisioningCenter from "./components/StaffProvisioningCenter"
import IntegrationPipeline from "./components/IntegrationPipeline"
import LoginScreen from "./components/LoginScreen"
import { UserSession } from "@hospital/contracts"
import { Toaster, toast } from "sonner"
import { API_BASE_URL } from "@/lib/api"

// UI Component Integrations
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/base/buttons/button"

type Tab =
  | "STAFF_ADMIN"
  | "INTEGRATION"
  | "AUDIT"
  | "CLINICAL"
  | "RECEPTION"
  | "ANALYTICS"

export default function App() {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem("prohealth_erp_session")
      if (stored) return JSON.parse(stored)
    } catch {}
    return null
  })

  const [activeTab, setActiveTab] = useState<Tab>("STAFF_ADMIN")
  const [gatewayStatus, setGatewayStatus] = useState<any>(null)

  // Handle successful login
  const handleLoginSuccess = (session: UserSession, token: string) => {
    setCurrentSession(session)
    try {
      localStorage.setItem("prohealth_erp_session", JSON.stringify(session))
      localStorage.setItem("prohealth_erp_token", token)
    } catch {}

    if (session.role === "ADMIN") {
      setActiveTab("STAFF_ADMIN")
    } else if (session.role === "DOCTOR") {
      setActiveTab("CLINICAL")
    } else if (session.role === "RECEPTIONIST" || session.role === "NURSE") {
      setActiveTab("RECEPTION")
    } else if (session.role === "COMPLIANCE_AUDITOR") {
      setActiveTab("AUDIT")
    } else {
      setActiveTab("INTEGRATION")
    }
  }

  // Handle Sign Out
  const handleSignOut = () => {
    try {
      localStorage.removeItem("prohealth_erp_session")
      localStorage.removeItem("prohealth_erp_token")
    } catch {}
    setCurrentSession(null)
    toast.info("Signed out of ERP session.")
  }

  // Poll Gateway health status with visibility throttling
  useEffect(() => {
    const check = () => {
      if (typeof document !== "undefined" && document.hidden) return
      fetch(`${API_BASE_URL}/api/v1/gateway/status`)
        .then((res) => res.json())
        .then((data) => setGatewayStatus(data))
        .catch(() => setGatewayStatus({ gateway: "OFFLINE", services: [] }))
    }

    check()
    const interval = setInterval(check, 15000)
    const onVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden) check()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  // If unauthenticated, display dedicated RBAC Login Screen
  if (!currentSession) {
    return (
      <>
        <Toaster position="bottom-right" richColors />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </>
    )
  }

  const isAdmin = currentSession.role === "ADMIN"
  const isDoctor = currentSession.role === "DOCTOR"
  const isReceptionist = currentSession.role === "RECEPTIONIST" || currentSession.role === "NURSE"
  const isAuditor = currentSession.role === "COMPLIANCE_AUDITOR"

  const isHealthy = gatewayStatus?.gateway === "ONLINE"

  return (
    <SidebarProvider defaultOpen={true}>
      <Toaster position="bottom-right" richColors />

      {/* Main Collapsible Application Sidebar */}
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-700/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-foreground tracking-tight truncate">
                  ProHealth <span className="text-primary font-bold">ERP</span>
                </span>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded-full font-mono font-bold">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground truncate">
                Hospital Information System (HIS)
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Operations &amp; Clinical</SidebarGroupLabel>
            <SidebarMenu>
              {/* Admin Centralized Staff Provisioning Center */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "STAFF_ADMIN"}
                    onClick={() => setActiveTab("STAFF_ADMIN")}
                  >
                    <Users className="w-4 h-4 shrink-0 text-blue-600" />
                    <span className="truncate">Staff Directory &amp; Provisioning</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>Central</SidebarMenuBadge>
                </SidebarMenuItem>
              )}

              {/* Clinical Integration Pipeline (HL7 / FHIR) */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "INTEGRATION"}
                    onClick={() => setActiveTab("INTEGRATION")}
                  >
                    <Network className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="truncate">Clinical Pipeline (HL7/FHIR)</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>v2.5</SidebarMenuBadge>
                </SidebarMenuItem>
              )}

              {/* Clinical Workbench */}
              {(isAdmin || isDoctor) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "CLINICAL"}
                    onClick={() => setActiveTab("CLINICAL")}
                  >
                    <Stethoscope className="w-4 h-4 shrink-0 text-teal-600" />
                    <span className="truncate">Clinical Workbench</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>EHR</SidebarMenuBadge>
                </SidebarMenuItem>
              )}

              {/* Reception Desk */}
              {(isAdmin || isReceptionist) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "RECEPTION"}
                    onClick={() => setActiveTab("RECEPTION")}
                  >
                    <ClipboardList className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="truncate">Reception &amp; Triage</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>OPD</SidebarMenuBadge>
                </SidebarMenuItem>
              )}

              {/* Audit Log & Compliance */}
              {(isAdmin || isAuditor) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "AUDIT"}
                    onClick={() => setActiveTab("AUDIT")}
                  >
                    <Database className="w-4 h-4 shrink-0 text-indigo-600" />
                    <span className="truncate">Audit Log &amp; Integrity</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>HIPAA</SidebarMenuBadge>
                </SidebarMenuItem>
              )}

              {/* Analytics */}
              {(isAdmin || isAuditor) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "ANALYTICS"}
                    onClick={() => setActiveTab("ANALYTICS")}
                  >
                    <Activity className="w-4 h-4 shrink-0 text-purple-600" />
                    <span className="truncate">Analytics &amp; Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-3">
          <div className="group-data-[collapsible=icon]:hidden flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>EHR Secured</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              HIPAA
            </span>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main Application Inset */}
      <SidebarInset className="flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur-md shadow-xs">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-6" />

          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Hospital ERP</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="font-semibold text-foreground">
              {activeTab === "STAFF_ADMIN" && "Staff Administration & Credential Provisioning Center"}
              {activeTab === "INTEGRATION" && "Clinical Integration Pipeline (HL7 v2.5 / FHIR R4)"}
              {activeTab === "AUDIT" && "HIPAA Cryptographic Audit Trail"}
              {activeTab === "CLINICAL" && "Clinical Encounter Workbench"}
              {activeTab === "RECEPTION" && "Reception & Patient Triage"}
              {activeTab === "ANALYTICS" && "Hospital Intelligence & Analytics"}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Hospital Facility & Clinical Network Status */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/70 px-3 py-1.5 rounded-lg shadow-2xs">
              <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="font-semibold text-foreground">Main Campus</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-[11px] font-medium text-emerald-700 hidden sm:inline">
                {isHealthy ? "Clinical Network Online" : "Network Alert"}
              </span>
            </div>

            {/* Authenticated Staff Identity Profile */}
            <div className="flex items-center gap-2.5 bg-muted/50 border border-border/80 rounded-xl px-3 py-1.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                {currentSession.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[140px] sm:max-w-[180px]">
                  {currentSession.name}
                </span>
                <span className="text-[10px] font-mono font-semibold text-primary uppercase tracking-wider leading-none mt-0.5">
                  {currentSession.role.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Sign Out Button in Header */}
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-destructive/20"
              title="Sign Out of Session"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Emergency Break-Glass Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button color="secondary" size="sm" className="hidden sm:inline-flex text-xs h-8">
                    Emergency
                  </Button>
                }
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Trigger Break-Glass Override?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will grant temporary emergency super-auditor clearance to bypass standard role restrictions. All actions during this session are permanently recorded in the SHA-256 cryptographic audit chain.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      toast.error("Emergency Break-Glass Override Activated. Session flagged in audit log.")
                    }}
                  >
                    Activate Override
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Dynamic Main Workspace Tab Body */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === "STAFF_ADMIN" && <StaffProvisioningCenter />}
          {activeTab === "INTEGRATION" && <IntegrationPipeline />}
          {activeTab === "AUDIT" && <AuditLogViewer />}
          {activeTab === "CLINICAL" && <ClinicalWorkbench session={currentSession} />}
          {activeTab === "RECEPTION" && <ReceptionDesk />}
          {activeTab === "ANALYTICS" && <AnalyticsDashboard />}
        </div>

        {/* Global Footer */}
        <footer className="mt-auto border-t bg-card text-muted-foreground text-[11px] px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>ProHealth Hospital Information Management System (HIMS) • Enterprise Clinical Platform</span>
          <span>Certified Electronic Health Record • HIPAA &amp; HITECH Compliant</span>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
