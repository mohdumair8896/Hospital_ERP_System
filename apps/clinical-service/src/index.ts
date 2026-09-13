import express, { Request, Response } from 'express';
import cors from 'cors';
import { ClinicalDatabase } from './database.js';
import { createEventBus, EventSubjects } from '@hospital/events';
import { AuditClient, createAuditMiddleware } from '@hospital/audit-client';
import { ClinicalEncounterFinalizedEvent, VitalSigns, PrescriptionItem } from '@hospital/contracts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4003;
const NATS_URL = process.env.NATS_URL;

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const clinicalDb = new ClinicalDatabase();
  const eventBus = await createEventBus(NATS_URL);
  const auditClient = new AuditClient('clinical-service', eventBus);

  app.use(createAuditMiddleware(auditClient));

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'clinical-service', time: new Date().toISOString() });
  });

  // Get encounters for patient
  app.get('/api/v1/clinical/encounters', async (req: Request, res: Response) => {
    const patientId = req.query.patientId as string;
    if (!patientId) {
      return res.status(400).json({ error: 'patientId query parameter is required' });
    }

    const encounters = await clinicalDb.getByPatientId(patientId);
    res.json({ total: encounters.length, encounters });
  });

  // Get encounter by ID
  app.get('/api/v1/clinical/encounters/:id', async (req: Request, res: Response) => {
    const enc = await clinicalDb.getById(req.params.id);
    if (!enc) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    // High-sensitivity audit log for full clinical record viewing
    auditClient.log({
      traceId: req.headers['x-trace-id'] as string,
      actorId: (req.headers['x-user-id'] as string) || 'doc_sarah',
      actorName: (req.headers['x-user-name'] as string) || 'Dr. Sarah Patel',
      actorRole: (req.headers['x-user-role'] as any) || 'DOCTOR',
      clientIp: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'clinical-workstation',
      action: 'READ',
      resourceType: 'CLINICAL_ENCOUNTER',
      resourceId: enc.id,
      description: `Read sensitive clinical chart for Encounter ${enc.encounterNumber} (Patient: ${enc.patientId})`,
      endpoint: req.originalUrl,
      httpMethod: 'GET',
      statusCode: 200,
      executionTimeMs: 5,
      clinicalReason: (req.headers['x-clinical-reason'] as string) || 'Clinical care delivery'
    });

    res.json(enc);
  });

  // Create new clinical encounter
  app.post('/api/v1/clinical/encounters', async (req: Request, res: Response) => {
    const {
      patientId,
      doctorId,
      doctorName,
      appointmentId,
      type,
      chiefComplaint,
      vitals,
      primaryDiagnosisCode,
      primaryDiagnosisName,
      secondaryDiagnoses,
      clinicalNotes,
      prescriptions
    } = req.body as {
      patientId: string;
      doctorId: string;
      doctorName: string;
      appointmentId?: string;
      type: 'OPD' | 'IPD' | 'EMERGENCY';
      chiefComplaint: string;
      vitals: VitalSigns;
      primaryDiagnosisCode: string;
      primaryDiagnosisName: string;
      secondaryDiagnoses?: string[];
      clinicalNotes: string;
      prescriptions: PrescriptionItem[];
    };

    if (!patientId || !doctorId || !chiefComplaint || !vitals || !primaryDiagnosisCode) {
      return res.status(400).json({ error: 'Missing mandatory clinical encounter fields' });
    }

    const enc = await clinicalDb.create({
      patientId,
      doctorId,
      doctorName: doctorName || 'Physician',
      appointmentId,
      type: type || 'OPD',
      chiefComplaint,
      vitals,
      primaryDiagnosisCode,
      primaryDiagnosisName,
      secondaryDiagnoses,
      clinicalNotes: clinicalNotes || 'Examination completed. Plan initiated.',
      prescriptions: prescriptions || [],
      status: 'FINALIZED'
    });

    // Emit asynchronous domain event
    const event: ClinicalEncounterFinalizedEvent = {
      eventId: `evt_enc_${Date.now()}`,
      eventType: 'ClinicalEncounterFinalized',
      version: 1,
      occurredAt: new Date().toISOString(),
      sourceService: 'clinical-service',
      traceId: (req.headers['x-trace-id'] as string) || `tr_${Date.now()}`,
      data: {
        encounterId: enc.id,
        patientId: enc.patientId,
        doctorId: enc.doctorId,
        primaryDiagnosisCode: enc.primaryDiagnosisCode,
        primaryDiagnosisName: enc.primaryDiagnosisName,
        prescriptionsCount: enc.prescriptions.length
      }
    };

    await eventBus.publish(EventSubjects.CLINICAL_ENCOUNTER_FINALIZED, event);

    res.status(201).json(enc);
  });

  const server = app.listen(PORT, () => {
    console.log(`[ClinicalService] Running on port ${PORT}`);
  });

  return { app, server, clinicalDb, eventBus };
}

bootstrap().catch(err => {
  console.error('[ClinicalService] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
