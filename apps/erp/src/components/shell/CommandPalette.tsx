import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import type { Patient, UserRole } from "@hospital/contracts"
import { CornerDownLeft, Loader2, LogOut, Search, SearchX, ShieldCheck, UserPlus, type LucideIcon } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"
import { NAV_BY_TAB, tabsForRole, type Tab } from "./navigation"
import { navigateTo } from "./url-state"

/**
 * Global Cmd/Ctrl+K palette (P-CMD-1): jump to a screen, find a patient, run a quick action.
 * Renders its own header trigger button. Patient picks navigate with
 * `?tab=CLINICAL&patient=<id>` (or RECEPTION for roles without CLINICAL).
 */
export interface CommandPaletteProps {
  role: UserRole
  activeTab: Tab
  onSignOut: () => void
  className?: string
}

type SearchState = { status: "idle" | "loading" | "done" | "error"; patients: Patient[] }

const MIN_QUERY = 2
const DEBOUNCE_MS = 250

/** Debounced patient search against the gateway; aborts stale requests. */
function usePatientSearch(query: string, enabled: boolean): SearchState {
  const [state, setState] = React.useState<SearchState>({ status: "idle", patients: [] })
  const q = query.trim()

  React.useEffect(() => {
    if (!enabled || q.length < MIN_QUERY) {
      setState({ status: "idle", patients: [] })
      return
    }
    // Drop the previous query's rows so Enter can't open a patient from a stale search.
    setState({ status: "loading", patients: [] })
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      apiFetch(`/api/v1/patients?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => setState({ status: "done", patients: (data?.patients ?? []).slice(0, 8) }))
        .catch((err) => {
          if (err?.name !== "AbortError") setState({ status: "error", patients: [] })
        })
    }, DEBOUNCE_MS)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [q, enabled])

  return state
}

function matches(query: string, ...fields: string[]) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return true
  const haystack = fields.join(" ").toLowerCase()
  return tokens.every((t) => haystack.includes(t))
}

const isMacPlatform = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  )
}

const itemClass =
  "group/item flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50"

function EnterHint() {
  return (
    <CornerDownLeft
      aria-hidden="true"
      className="ml-auto size-3.5 shrink-0 text-muted-foreground opacity-0 group-data-[selected=true]/item:opacity-100"
    />
  )
}

interface ActionDef {
  id: string
  label: string
  keywords: string
  icon: LucideIcon
  run: () => void
}

export function CommandPalette({ role, activeTab, onSignOut, className }: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  const isMac = React.useMemo(isMacPlatform, [])

  const tabs = tabsForRole(role)
  const patientTab: Tab | null = tabs.includes("CLINICAL") ? "CLINICAL" : tabs.includes("RECEPTION") ? "RECEPTION" : null
  // Only roles with a patient screen may query patient records.
  const search = usePatientSearch(query, open && patientTab !== null)

  const openPalette = React.useCallback(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpen(true)
  }, [])

  const handleOpenChange = (next: boolean) => {
    if (next) openPalette()
    else {
      setOpen(false)
      setQuery("")
    }
  }

  const openRef = React.useRef(open)
  openRef.current = open

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (openRef.current) {
          setOpen(false)
          setQuery("")
        } else openPalette()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openPalette])

  const run = (fn: () => void) => {
    setOpen(false)
    setQuery("")
    fn()
  }

  const actions: ActionDef[] = [
    ...(tabs.includes("RECEPTION")
      ? [{ id: "register", label: "Register new patient", keywords: "add create new patient registration admit", icon: UserPlus, run: () => navigateTo("RECEPTION", { action: "register" }) }]
      : []),
    ...(tabs.includes("AUDIT")
      ? [{ id: "verify", label: "Verify audit chain", keywords: "integrity hash hipaa tamper check", icon: ShieldCheck, run: () => navigateTo("AUDIT", { action: "verify" }) }]
      : []),
    { id: "signout", label: "Sign out", keywords: "logout log out exit session", icon: LogOut, run: onSignOut },
  ]

  const navItems = tabs.map((t) => NAV_BY_TAB[t]).filter((item) => matches(query, item.label, item.title, ...item.keywords))
  const actionItems = actions.filter((a) => matches(query, a.label, a.keywords))
  const searching = query.trim().length >= MIN_QUERY && patientTab !== null
  const pending = search.status === "loading" || search.status === "idle"
  // Hide an empty, finished patient search so it doesn't push real matches down.
  const showPatients = searching && (pending || search.status === "error" || search.patients.length > 0)
  const nothing = !navItems.length && !actionItems.length && !showPatients

  // Controlled selection: always keep a visible row selected (cmdk can keep a stale value
  // when rows unmount with shouldFilter={false}); typing re-selects the first row.
  const [selected, setSelected] = React.useState("")
  const visibleValues = [
    ...(showPatients ? search.patients.map((p) => `patient:${p.id}`) : []),
    ...navItems.map((item) => `nav:${item.tab}`),
    ...actionItems.map((a) => `action:${a.id}`),
  ]
  const visibleKey = visibleValues.join("|")
  const lastQueryRef = React.useRef(query)
  React.useEffect(() => {
    const queryChanged = lastQueryRef.current !== query
    lastQueryRef.current = query
    if (queryChanged || !visibleValues.includes(selected)) setSelected(visibleValues[0] ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey, query])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPalette}
        aria-label="Search or jump to"
        aria-keyshortcuts="Control+K Meta+K"
        aria-haspopup="dialog"
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm text-muted-foreground shadow-2xs transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:w-56 xl:justify-start xl:px-2.5 2xl:w-64",
          className
        )}
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden truncate text-xs xl:inline 2xl:text-sm">Search or jump to…</span>
        <Kbd className="ml-auto hidden xl:inline-flex">{isMac ? "⌘K" : "Ctrl K"}</Kbd>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              const previous = restoreFocusRef.current
              if (previous && previous.isConnected && previous !== document.body) previous.focus()
              else triggerRef.current?.focus()
            }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lift outline-none duration-150 ease-out-soft data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]"
          >
            <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
            <Command
              label="Command palette"
              value={selected}
              onValueChange={setSelected}
              shouldFilter={false}
              loop
              className="flex flex-col [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={patientTab ? "Search patients by name or MRN, or jump to…" : "Jump to a screen or action…"}
                  className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {search.status === "loading" && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
              </div>

              <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2">
                {showPatients && (
                  <Command.Group heading="Patients">
                    {pending && !search.patients.length && (
                      <Command.Loading>
                        <p className="px-3 py-2 text-sm text-muted-foreground">Searching patients…</p>
                      </Command.Loading>
                    )}
                    {search.status === "error" && (
                      <p className="px-3 py-2 text-sm text-alert">Patient search is unavailable right now.</p>
                    )}
                    {search.patients.map((p) => (
                      <Command.Item
                        key={p.id}
                        value={`patient:${p.id}`}
                        onSelect={() => run(() => navigateTo(patientTab!, { patient: p.id }))}
                        className={itemClass}
                      >
                        <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                          {`${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase()}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">{p.firstName} {p.lastName}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            <span className="font-mono">{p.mrn}</span> · DOB {p.dateOfBirth?.slice(0, 10)}
                          </span>
                        </span>
                        <EnterHint />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {navItems.length > 0 && (
                  <Command.Group heading="Navigation">
                    {navItems.map((item) => (
                      <Command.Item key={item.tab} value={`nav:${item.tab}`} onSelect={() => run(() => navigateTo(item.tab))} className={itemClass}>
                        <item.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                        {item.tab === activeTab && <span className="shrink-0 text-xs text-muted-foreground">Current</span>}
                        <EnterHint />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {actionItems.length > 0 && (
                  <Command.Group heading="Actions">
                    {actionItems.map((a) => (
                      <Command.Item key={a.id} value={`action:${a.id}`} onSelect={() => run(a.run)} className={itemClass}>
                        <a.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span className="truncate">{a.label}</span>
                        <EnterHint />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {nothing && (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <SearchX className="size-6 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">No results for “{query.trim()}”</p>
                    <p className="text-xs text-muted-foreground">Try a patient name, an MRN such as MRN-2026-00412, or a screen name.</p>
                  </div>
                )}

                {!query.trim() && patientTab && (
                  <p className="px-3 pb-1 pt-3 text-xs text-muted-foreground">Type at least 2 characters to search patients by name, MRN or phone.</p>
                )}
              </Command.List>

              <div className="flex items-center gap-4 border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> Navigate</span>
                <span className="flex items-center gap-1"><Kbd>↵</Kbd> Open</span>
                <span className="flex items-center gap-1"><Kbd>Esc</Kbd> Close</span>
                <span className="ml-auto hidden items-center gap-1 sm:flex"><Kbd>{isMac ? "⌘K" : "Ctrl K"}</Kbd> Toggle</span>
              </div>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
