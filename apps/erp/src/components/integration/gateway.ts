/** Parsed GET /api/v1/gateway/status. */
export interface ServiceHealth {
  service: string
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | string
  url: string
}

export interface GatewayHealth {
  gateway: string
  timestamp: string | null
  security: Record<string, boolean>
  services: ServiceHealth[]
}

export const GATEWAY_STATUS_PATH = "/api/v1/gateway/status"

export function parseGatewayStatus(body: unknown): GatewayHealth {
  const b = (body ?? {}) as Record<string, unknown>
  const services = Array.isArray(b.services) ? b.services : []
  const security = b.security && typeof b.security === "object" ? (b.security as Record<string, unknown>) : {}
  return {
    gateway: typeof b.gateway === "string" ? b.gateway : "UNKNOWN",
    timestamp: typeof b.timestamp === "string" ? b.timestamp : null,
    security: Object.fromEntries(Object.entries(security).map(([k, v]) => [k, Boolean(v)])),
    services: services.map((s: any) => ({
      service: String(s?.service ?? "unknown"),
      status: String(s?.status ?? "OFFLINE").toUpperCase(),
      url: String(s?.url ?? ""),
    })),
  }
}

/** "patient-service" → "Patient service" */
export function serviceLabel(name: string) {
  const words = name.replace(/[-_]+/g, " ").trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
