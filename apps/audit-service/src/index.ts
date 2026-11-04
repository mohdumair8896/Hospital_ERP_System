import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuditDatabase } from './database.js';
import { createEventBus, EventSubjects } from '@hospital/events';
import { AuditLogEmittedEvent, AuditSearchQuery } from '@hospital/contracts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4005;
const NATS_URL = process.env.NATS_URL;

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const auditDb = new AuditDatabase();
  const eventBus = await createEventBus(NATS_URL);

  // Subscribe to asynchronous audit events from NATS / EventBus
  await eventBus.subscribe<AuditLogEmittedEvent>(
    EventSubjects.AUDIT_LOG_EMITTED,
    async (event) => {
      try {
        await auditDb.appendRecord(event.data);
      } catch (err) {
        console.error('[AuditService] Failed to ingest audit event:', err);
      }
    }
  );

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'audit-service', time: new Date().toISOString() });
  });

  // Query audit records with filters
  app.get('/api/v1/audit/records', async (req: Request, res: Response) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    // Reject bad input up front: a failed DB cast would otherwise fall back to the local store.
    const invalid: string[] = [];
    if (startDate && Number.isNaN(Date.parse(startDate))) invalid.push('startDate');
    if (endDate && Number.isNaN(Date.parse(endDate))) invalid.push('endDate');
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) invalid.push('limit (1-1000)');
    if (!Number.isInteger(offset) || offset < 0) invalid.push('offset');
    if (invalid.length) {
      return res.status(400).json({ error: `Invalid audit query parameters: ${invalid.join(', ')}` });
    }

    const query: AuditSearchQuery = {
      actorId: req.query.actorId as string | undefined,
      action: req.query.action as any,
      resourceType: req.query.resourceType as any,
      resourceId: req.query.resourceId as string | undefined,
      startDate,
      endDate,
      limit,
      offset,
    };

    const result = await auditDb.query(query);
    res.json(result);
  });

  // Cryptographic integrity verification endpoint
  app.get('/api/v1/audit/verify-integrity', async (req: Request, res: Response) => {
    const result = await auditDb.verifyIntegrity();
    res.json(result);
  });

  // Aggregated system statistics for compliance dashboard
  app.get('/api/v1/audit/stats', async (req: Request, res: Response) => {
    const stats = await auditDb.getStats();
    res.json(stats);
  });

  // HIPAA § 164.528: Accounting of Disclosures for a specific patient MRN / ID
  app.get('/api/v1/audit/patient/:id/disclosures', async (req: Request, res: Response) => {
    const patientId = req.params.id;
    const result = await auditDb.query({
      resourceType: 'PATIENT',
      resourceId: patientId,
      limit: 100
    });
    res.json({
      patientId,
      disclosuresCount: result.total,
      records: result.records
    });
  });

  // Direct ingestion endpoint (for services calling synchronously or over HTTP)
  app.post('/api/v1/audit/log', async (req: Request, res: Response) => {
    const entry = req.body;
    if (!entry.actorId || !entry.action || !entry.resourceType) {
      return res.status(400).json({ error: 'Missing required audit fields' });
    }

    const saved = await auditDb.appendRecord({
      timestamp: entry.timestamp || new Date().toISOString(),
      traceId: entry.traceId || `tr_${Date.now()}`,
      actorId: entry.actorId,
      actorName: entry.actorName || 'Unknown Actor',
      actorRole: entry.actorRole || 'PATIENT',
      clientIp: entry.clientIp || req.ip || '127.0.0.1',
      userAgent: entry.userAgent || req.headers['user-agent'] || 'unknown',
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId || 'unknown',
      description: entry.description || 'Direct audit entry',
      endpoint: entry.endpoint || req.path,
      httpMethod: entry.httpMethod || 'POST',
      statusCode: entry.statusCode || 200,
      executionTimeMs: entry.executionTimeMs || 0,
      clinicalReason: entry.clinicalReason,
      diffJson: entry.diffJson,
    });

    res.status(201).json(saved);
  });

  const server = app.listen(PORT, () => {
    console.log(`[AuditService] Running on port ${PORT}`);
  });

  return { app, server, auditDb, eventBus };
}

bootstrap().catch(err => {
  console.error('[AuditService] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
