import React, { useState, useEffect } from "react"
import { Building2, ChevronRight, AlertTriangle, LogOut, ShieldCheck } from "lucide-react"
import AuditLogViewer from "./components/AuditLogViewer"
import ClinicalWorkbench from "./components/ClinicalWorkbench"
import ReceptionDesk from "./components/ReceptionDesk"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import StaffProvisioningCenter from "./components/StaffProvisioningCenter"
import IntegrationPipeline from "./components/IntegrationPipeline"
import LoginScreen from "./components/LoginScreen"
import { UserSession } from "@hospital/contracts"
import { Toaster, toast } from "sonner"
import { apiFetch, AUTH_TOKEN_KEY } from "@/lib/api"
import { NAV_BY_TAB, defaultTabForRole, tabsForRole, validTab } from "@/components/shell/navigation"
import { clearUrlParams, navigateTo, useUrlParam } from "@/components/shell/url-state"
import { CommandPalette } from "@/components/shell/CommandPalette"
import { NotificationsPopover, type GatewayStatus } from "@/components/shell/NotificationsPopover"

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

export default function App() {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem("prohealth_erp_session")
      if (stored) return JSON.parse(stored)
    } catch {}
    return null
  })

  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(null)

  // The active screen lives in the URL (?tab=), validated against the role's screens.
  // Without a valid ?tab the role's default screen is used, including after a reload.
  const urlTab = useUrlParam("tab")
  const role = currentSession?.role
  const activeTab = role ? validTab(urlTab, role) ?? defaultTabForRole(role) : null

  useEffect(() => {
    if (role && urlTab !== activeTab && activeTab) navigateTo(activeTab)
  }, [role, urlTab, activeTab])

  // Handle successful login (the effect above then applies the role's default tab)
  const handleLoginSuccess = (session: UserSession, token: string) => {
    setCurrentSession(session)
    try {
      localStorage.setItem("prohealth_erp_session", JSON.stringify(session))
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } catch {}
  }

  // Handle Sign Out
  const handleSignOut = () => {
    try {
      localStorage.removeItem("prohealth_erp_session")
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch {}
    clearUrlParams()
    setCurrentSession(null)
    toast.info("Signed out of ERP session.")
  }

  // Poll Gateway health status with visibility throttling
  useEffect(() => {
    const check = () => {
      if (typeof document !== "undefined" && document.hidden) return
      apiFetch("/api/v1/gateway/status")
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
  if (!currentSession || !activeTab) {
    return (
      <>
        <Toaster position="bottom-right" richColors />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </>
    )
  }

  const visibleTabs = tabsForRole(currentSession.role)
  const activeNav = NAV_BY_TAB[activeTab]
  const isHealthy = gatewayStatus?.gateway === "ONLINE"
  const networkLabel = !gatewayStatus ? "Checking network" : isHealthy ? "Clinical Network Online" : "Network Alert"

  return (
    <SidebarProvider defaultOpen={true}>
      <Toaster position="bottom-right" richColors />

      {/* Main Collapsible Application Sidebar */}
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0">
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
          {/* Main Navigation Group (role-gated, see components/shell/navigation.ts) */}
          <SidebarGroup>
            <SidebarGroupLabel>Operations &amp; Clinical</SidebarGroupLabel>
            <SidebarMenu>
              {visibleTabs.map((tab) => {
                const item = NAV_BY_TAB[tab]
                const isActive = activeTab === tab
                return (
                  <SidebarMenuItem key={tab}>
                    <SidebarMenuButton isActive={isActive} onClick={() => navigateTo(tab)} title={item.label}>
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "" : item.iconClass}`} aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-3">
          <div className="group-data-[collapsible=icon]:hidden flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-4 h-4 text-care shrink-0" />
              <span>EHR Secured</span>
            </span>
            <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              HIPAA
            </span>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main Application Inset */}
      <SidebarInset className="flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-card/95 px-3 backdrop-blur-md shadow-xs sm:px-4">
          <SidebarTrigger className="shrink-0" />

          <Separator orientation="vertical" className="hidden h-6 sm:block" />

          {/* Breadcrumb / Title */}
          <div className="flex min-w-0 flex-1 items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="hidden shrink-0 2xl:inline">Hospital ERP</span>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 opacity-50 2xl:block" aria-hidden="true" />
            <span className="truncate font-semibold text-foreground" title={activeNav.title}>
              <span className="2xl:hidden">{activeNav.label}</span>
              <span className="hidden 2xl:inline">{activeNav.title}</span>
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <CommandPalette role={currentSession.role} activeTab={activeTab} onSignOut={handleSignOut} />
            <NotificationsPopover
              gatewayStatus={gatewayStatus}
              userId={currentSession.id}
              showAppointments={visibleTabs.includes("RECEPTION")}
            />

            {/* Hospital Facility & Clinical Network Status */}
            <div
              className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/70 px-3 py-1.5 rounded-lg shadow-2xs"
              title={networkLabel}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${!gatewayStatus ? "bg-muted-foreground" : isHealthy ? "bg-care motion-safe:animate-pulse" : "bg-alert"}`}
              />
              <span className="font-semibold text-foreground">Main Campus</span>
              <span className="sr-only 2xl:not-sr-only 2xl:flex 2xl:items-center 2xl:gap-2">
                <span className="text-muted-foreground/50" aria-hidden="true">•</span>
                <span className={`text-[11px] font-medium ${isHealthy ? "text-care" : "text-alert"}`}>{networkLabel}</span>
              </span>
            </div>

            {/* Authenticated Staff Identity Profile */}
            <div
              className="flex items-center gap-2.5 bg-muted/50 border border-border/80 rounded-xl px-1.5 py-1.5 shadow-2xs xl:px-3"
              title={`${currentSession.name} (${currentSession.role.replace(/_/g, " ")})`}
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0" aria-hidden="true">
                {currentSession.name.charAt(0)}
              </div>
              <div className="sr-only xl:not-sr-only xl:flex xl:flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px] 2xl:max-w-[180px]">
                  {currentSession.name}
                </span>
                <span className="text-[10px] font-mono font-semibold text-primary uppercase tracking-wider leading-none mt-0.5">
                  {currentSession.role.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Sign Out Button in Header */}
            <button
              type="button"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Sign Out of Session"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden 2xl:inline">Sign Out</span>
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
                  <AlertDialogTitle>Break-glass override is not available yet</AlertDialogTitle>
                  <AlertDialogDescription>
                    Emergency access overrides (reason prompt, time-boxed access and an audited compliance review) are on the roadmap. In this build nothing changes your access and no audit entry is written.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
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
