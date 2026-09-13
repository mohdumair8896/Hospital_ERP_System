import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppointmentDatabase } from './database.js';
import { createEventBus, EventSubjects } from '@hospital/events';
import { AuditClient, createAuditMiddleware } from '@hospital/audit-client';
import { 
  AppointmentCreatedEvent, 
  BookAppointmentDto, 
  AppointmentStatus 
} from '@hospital/contracts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4002;
const NATS_URL = process.env.NATS_URL;

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const apptDb = new AppointmentDatabase();
  const eventBus = await createEventBus(NATS_URL);
  const auditClient = new AuditClient('appointment-service', eventBus);

  app.use(createAuditMiddleware(auditClient));

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'appointment-service', time: new Date().toISOString() });
  });

  // Get departments
  app.get('/api/v1/appointments/departments', async (req: Request, res: Response) => {
    const departments = await apptDb.getDepartments();
    res.json(departments);
  });

  // Get doctors (optionally filtered by department)
  app.get('/api/v1/appointments/doctors', async (req: Request, res: Response) => {
    const deptId = req.query.departmentId as string | undefined;
    const doctors = await apptDb.getDoctors(deptId);
    res.json(doctors);
  });

  // Get doctor by ID
  app.get('/api/v1/appointments/doctors/:id', async (req: Request, res: Response) => {
    const doc = await apptDb.getDoctorById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doc);
  });

  // Get appointments
  app.get('/api/v1/appointments', async (req: Request, res: Response) => {
    const appointments = await apptDb.getAppointments({
      doctorId: req.query.doctorId as string | undefined,
      patientId: req.query.patientId as string | undefined,
      date: req.query.date as string | undefined,
      status: req.query.status as string | undefined,
    });
    res.json({ total: appointments.length, appointments });
  });

  // Book appointment
  app.post('/api/v1/appointments', async (req: Request, res: Response) => {
    const body = req.body || {};
    const doctorId = body.doctorId;
    const departmentId = body.departmentId;
    const slotDate = body.slotDate || body.appointmentDate;
    const slotTime = body.slotTime || body.startTime;

    if (!doctorId || !departmentId || !slotDate || !slotTime) {
      return res.status(400).json({ error: 'Missing mandatory appointment booking fields' });
    }

    const doctor = await apptDb.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Selected doctor not found' });
    }

    const departments = await apptDb.getDepartments();
    const dept = departments.find(d => d.id === departmentId) || {
      id: departmentId,
      name: body.departmentName || 'General Consultation'
    };

    let patientId = body.patientId || `guest_${Date.now()}`;
    let patientName = body.patientName || (body.newPatient ? `${body.newPatient.firstName} ${body.newPatient.lastName}` : 'Registered Patient');
    let patientPhone = body.patientPhone || (body.newPatient ? body.newPatient.phoneNumber : '+1 (555) 000-0000');
    let patientEmail = body.patientEmail || (body.newPatient ? body.newPatient.email : 'patient@hospital.com');

    const appointment = await apptDb.create({
      patientId,
      patientName,
      patientPhone,
      patientEmail,
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: dept.id,
      departmentName: dept.name,
      slotDate,
      slotTime,
      type: body.careMode === 'IN_PERSON' ? 'OPD_IN_PERSON' : (body.type || 'OPD_IN_PERSON'),
      status: 'CONFIRMED',
      symptoms: body.reason || body.symptoms || 'General clinical consultation',
      consultationFee: doctor.consultationFee
    });

    // Emit asynchronous domain event to NATS JetStream
    const event: AppointmentCreatedEvent = {
      eventId: `evt_apt_${Date.now()}`,
      eventType: 'AppointmentCreated',
      version: 1,
      occurredAt: new Date().toISOString(),
      sourceService: 'appointment-service',
      traceId: (req.headers['x-trace-id'] as string) || `tr_${Date.now()}`,
      data: {
        appointmentId: appointment.id,
        appointmentNumber: appointment.appointmentNumber,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        type: appointment.type,
        symptoms: appointment.symptoms
      }
    };

    await eventBus.publish(EventSubjects.APPOINTMENT_CREATED, event);

    res.status(201).json(appointment);
  });

  // Update appointment status (check-in, complete, cancel)
  app.patch('/api/v1/appointments/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body as { status: AppointmentStatus };
    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }

    const updated = await apptDb.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updated);
  });

  const server = app.listen(PORT, () => {
    console.log(`[AppointmentService] Running on port ${PORT}`);
  });

  return { app, server, apptDb, eventBus };
}

bootstrap().catch(err => {
  console.error('[AppointmentService] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
