import { AlertTriangle, CheckCircle2, Clock, Network, Server, ShieldCheck } from "lucide-react"
import { EmptyState, KpiCard, SkeletonRows, StatusPill } from "@/components/primitives"
import { buttonClass } from "../audit/controls"
import type { Resource } from "../analytics/useApiResource"
import { serviceLabel, type GatewayHealth } from "./gateway"

const SECURITY_LABELS: Record<string, string> = {
  rlsEnabled: "Record-level security",
  idorDefense: "IDOR defence",
  zodValidation: "Request validation",
  helmetProtection: "Security headers",
  cryptographicAudit: "Cryptographic audit",
}

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
const fmtTime = (t: number | string | null | undefined) => (t ? timeFmt.format(new Date(t)) : "—")

type Res = Resource<GatewayHealth> & { reload: () => void }

/** Live service health from GET /api/v1/gateway/status (P-DASH-1 KPI strip + status pills). */
export function ServiceHealthPanel({ health, pollSeconds }: { health: Res; pollSeconds: number }) {
  const data = health.data
  const services = data?.services ?? []
  const online = services.filter((s) => s.status === "ONLINE").length
  const degraded = services.filter((s) => s.status === "DEGRADED").length
  const offline = services.filter((s) => s.status !== "ONLINE" && s.status !== "DEGRADED").length
  const loading = health.status === "loading" && !data
  const unreachable = health.status === "error"
  const gatewayLabel = unreachable ? "Unreachable" : data ? (data.gateway === "ONLINE" ? "Online" : data.gateway) : "Checking"

  return (
    <section aria-labelledby="service-health-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="service-health-title" className="text-sm font-semibold text-foreground">Live service health</h2>
          <p className="text-xs text-muted-foreground">
            Polled every {pollSeconds} s while this screen is visible. Last checked{" "}
            <span className="font-medium text-foreground tabular-nums">{fmtTime(health.updatedAt)}</span>
            {data?.timestamp && <> (gateway clock {fmtTime(data.timestamp)})</>}.
          </p>
        </div>
        <button type="button" onClick={health.reload} disabled={health.status === "loading"} className={buttonClass("secondary", "sm")}>
          {health.status === "loading" && data ? "Checking…" : "Check now"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Services online" icon={Server} loading={loading} value={unreachable && !data ? "—" : `${online} / ${services.length}`} caption={offline || degraded ? `${offline} offline · ${degraded} degraded` : "All reporting healthy"} />
        <KpiCard label="API gateway" icon={Network} loading={loading} value={gatewayLabel} caption={unreachable ? "No response from :4000" : "Routes and RBAC"} />
        <KpiCard label="Security controls" icon={ShieldCheck} loading={loading} value={data ? `${Object.values(data.security).filter(Boolean).length} / ${Object.keys(data.security).length}` : "—"} caption="Reported by the gateway" />
        <KpiCard label="Last checked" icon={Clock} loading={loading} value={fmtTime(health.updatedAt)} caption={`Every ${pollSeconds} s`} />
      </div>

      {unreachable && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-alert/25 bg-alert-soft px-4 py-3 text-sm text-alert sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold">{data ? "Latest check failed; showing the previous result." : "The API gateway is not responding."}</span> {health.error}
            </span>
          </p>
          <button type="button" onClick={health.reload} className={buttonClass("secondary", "sm")}>Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-soft lg:col-span-2">
          {loading ? (
            <div className="px-4"><SkeletonRows count={5} avatar={false} label="Checking services…" /></div>
          ) : services.length === 0 ? (
            <EmptyState compact icon={Server} title={unreachable ? "No service data" : "No services reported"} description={unreachable ? "Nothing is shown until the gateway answers." : undefined} />
          ) : (
            <ul className="divide-y divide-border" aria-label="Backend services">
              {services.map((s) => (
                <li key={s.service} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{serviceLabel(s.service)}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground" title={s.url}>{s.url || "No URL reported"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">Checked {fmtTime(data?.timestamp ?? health.updatedAt)}</span>
                  <StatusPill status={s.status} size="md" className="self-start sm:self-auto" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <h3 className="text-sm font-semibold text-foreground">Gateway security controls</h3>
          {data && Object.keys(data.security).length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {Object.entries(data.security).map(([key, on]) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <span className="text-foreground">{SECURITY_LABELS[key] ?? key}</span>
                  {on ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-care">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" /> On
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-alert">Off</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">{loading ? "Checking…" : "Not reported."}</p>
          )}
        </div>
      </div>
    </section>
  )
}
