import express, { Request, Response } from 'express';
import cors from 'cors';
import { PatientDatabase } from './database.js';
import { createEventBus, EventSubjects } from '@hospital/events';
import { AuditClient } from '@hospital/audit-client';
import { PatientCreatedEvent, CreatePatientDto } from '@hospital/contracts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4001;
const NATS_URL = process.env.NATS_URL;

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const patientDb = new PatientDatabase();
  const eventBus = await createEventBus(NATS_URL);
  const auditClient = new AuditClient('patient-service', eventBus);

  // Domain & PHI-specific audits are logged explicitly per HIPAA § 164.312(b)

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'patient-service', time: new Date().toISOString() });
  });

  // Search patients
  app.get('/api/v1/patients', async (req: Request, res: Response) => {
    const q = req.query.q as string | undefined;
    const patients = await patientDb.search(q);
    res.json({ total: patients.length, patients });
  });

  // Get patient by ID or MRN
  app.get('/api/v1/patients/:id', async (req: Request, res: Response) => {
    const patient = await patientDb.getById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Explicit PHI Access Audit (HIPAA requirement)
    auditClient.log({
      traceId: req.headers['x-trace-id'] as string,
      actorId: (req.headers['x-user-id'] as string) || 'anonymous',
      actorName: (req.headers['x-user-name'] as string) || 'Public Clinician',
      actorRole: (req.headers['x-user-role'] as any) || 'DOCTOR',
      clientIp: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown',
      action: 'READ',
      resourceType: 'PATIENT',
      resourceId: patient.id,
      description: `Viewed patient demographic and medical profile for MRN: ${patient.mrn}`,
      endpoint: req.originalUrl,
      httpMethod: 'GET',
      statusCode: 200,
      executionTimeMs: 4,
      clinicalReason: (req.headers['x-clinical-reason'] as string) || 'Routine clinical chart review'
    });

    res.json(patient);
  });

  // Create new patient
  app.post('/api/v1/patients', async (req: Request, res: Response) => {
    const dto = req.body as CreatePatientDto;
    if (!dto.firstName || !dto.lastName || !dto.phoneNumber) {
      return res.status(400).json({ error: 'Missing mandatory patient fields (firstName, lastName, phoneNumber)' });
    }

    const patient = await patientDb.create(dto);

    // Emit asynchronous domain event to NATS JetStream
    const event: PatientCreatedEvent = {
      eventId: `evt_pat_${Date.now()}`,
      eventType: 'PatientCreated',
      version: 1,
      occurredAt: new Date().toISOString(),
      sourceService: 'patient-service',
      traceId: (req.headers['x-trace-id'] as string) || `tr_${Date.now()}`,
      data: {
        patientId: patient.id,
        mrn: patient.mrn,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phoneNumber: patient.phoneNumber,
        email: patient.email
      }
    };

    await eventBus.publish(EventSubjects.PATIENT_CREATED, event);

    res.status(201).json(patient);
  });

  const server = app.listen(PORT, () => {
    console.log(`[PatientService] Running on port ${PORT}`);
  });

  return { app, server, patientDb, eventBus };
}

bootstrap().catch(err => {
  console.error('[PatientService] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
