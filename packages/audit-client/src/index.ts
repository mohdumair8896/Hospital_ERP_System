import { createHash } from 'node:crypto';
import { 
  AuditRecord, 
  AuditAction, 
  AuditResourceType, 
  UserRole,
  BaseDomainEvent,
  AuditLogEmittedEvent
} from '@hospital/contracts';
import { IEventBus, EventSubjects } from '@hospital/events';

/**
 * Calculates a deterministic SHA-256 hash for a given audit record
 * chained to the previous record hash.
 * Tamper-evident cryptographic guarantee.
 */
export function computeRecordHash(
  payload: Omit<AuditRecord, 'recordHash'>,
  prevHash: string
): string {
  const serialized = [
    payload.id,
    payload.sequenceNumber,
    payload.timestamp,
    payload.traceId,
    payload.actorId,
    payload.actorRole,
    payload.action,
    payload.resourceType,
    payload.resourceId,
    payload.clientIp,
    payload.statusCode,
    payload.endpoint,
    prevHash
  ].join('|');

  return createHash('sha256').update(serialized).digest('hex');
}

export interface EmitAuditOptions {
  traceId?: string;
  actorId?: string;
  actorName?: string;
  actorRole?: UserRole;
  clientIp?: string;
  userAgent?: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  description: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  executionTimeMs: number;
  clinicalReason?: string;
  diff?: { previous?: any; new?: any };
}

export class AuditClient {
  private auditUrl: string;

  constructor(
    private serviceName: string,
    private eventBus: IEventBus,
    auditServiceUrl?: string
  ) {
    this.auditUrl = auditServiceUrl || process.env.AUDIT_SERVICE_URL || 'http://127.0.0.1:4005';
  }

  /**
   * Emits an audit event asynchronously.
   * Primary: NATS JetStream event bus.
   * Fallback / Direct: Asynchronous HTTP dispatch to Audit Service.
   * Never blocks the caller or interrupts clinical requests.
   */
  async log(options: EmitAuditOptions): Promise<void> {
    const payload = {
      traceId: options.traceId || `tr_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: options.actorId || 'system-anonymous',
      actorName: options.actorName || 'Anonymous User',
      actorRole: options.actorRole || 'PATIENT',
      clientIp: options.clientIp || '127.0.0.1',
      userAgent: options.userAgent || 'unknown',
      action: options.action,
      resourceType: options.resourceType,
      resourceId: options.resourceId,
      description: options.description,
      endpoint: options.endpoint,
      httpMethod: options.httpMethod,
      statusCode: options.statusCode,
      executionTimeMs: options.executionTimeMs,
      clinicalReason: options.clinicalReason,
      diffJson: options.diff ? JSON.stringify(options.diff) : undefined,
    };

    // 1. Publish to NATS Event Bus
    try {
      const event: AuditLogEmittedEvent = {
        eventId: `audit_evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        eventType: 'AuditLogEmitted',
        version: 1,
        occurredAt: new Date().toISOString(),
        sourceService: this.serviceName,
        traceId: payload.traceId,
        actorId: options.actorId,
        data: payload
      };
      await this.eventBus.publish(EventSubjects.AUDIT_LOG_EMITTED, event);
    } catch {
      // Non-fatal
    }

    // 2. Direct HTTP dispatch fallback when running independent multi-process without NATS broker
    if (!process.env.NATS_URL && this.serviceName !== 'audit-service') {
      queueMicrotask(async () => {
        try {
          await fetch(`${this.auditUrl}/api/v1/audit/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(1500)
          });
        } catch {
          // Non-blocking
        }
      });
    }
  }
}

/**
 * Universal HTTP Middleware for Express/Fastify/Node HTTP servers.
 * Transparently captures request start, response finish, timing, and emits an audit entry.
 */
export function createAuditMiddleware(auditClient: AuditClient) {
  return (req: any, res: any, next: () => void) => {
    const startTime = Date.now();
    const traceId = (req.headers['x-correlation-id'] || req.headers['x-trace-id'] || `trace_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`) as string;
    
    // Attach trace ID to response
    res.setHeader('X-Trace-Id', traceId);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const user = req.user || {
        id: (req.headers['x-user-id'] as string) || 'anonymous',
        name: (req.headers['x-user-name'] as string) || 'Public User',
        role: (req.headers['x-user-role'] as UserRole) || 'PATIENT'
      };

      // Determine resource type by path
      let resourceType: AuditResourceType = 'SYSTEM_CONFIG';
      const path = req.originalUrl || req.url || '';
      if (path.includes('/patient')) resourceType = 'PATIENT';
      else if (path.includes('/appointment')) resourceType = 'APPOINTMENT';
      else if (path.includes('/clinical') || path.includes('/encounter')) resourceType = 'CLINICAL_ENCOUNTER';
      else if (path.includes('/prescription')) resourceType = 'PRESCRIPTION';
      else if (path.includes('/auth') || path.includes('/user')) resourceType = 'USER_ACCOUNT';

      let action: AuditAction = 'READ';
      if (req.method === 'POST') action = 'CREATE';
      else if (req.method === 'PUT' || req.method === 'PATCH') action = 'UPDATE';
      else if (req.method === 'DELETE') action = 'DELETE';

      const clinicalReason = req.headers['x-clinical-reason'] as string | undefined;

      auditClient.log({
        traceId,
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        clientIp: req.ip || req.socket?.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'unknown',
        action,
        resourceType,
        resourceId: req.params?.id || req.body?.id || 'collection',
        description: `HTTP ${req.method} ${path} -> ${res.statusCode} in ${duration}ms`,
        endpoint: path,
        httpMethod: req.method,
        statusCode: res.statusCode,
        executionTimeMs: duration,
        clinicalReason,
      });
    });

    next();
  };
}
