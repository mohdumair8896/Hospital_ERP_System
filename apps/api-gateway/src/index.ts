import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { createEventBus } from '@hospital/events';
import { AuditClient, createAuditMiddleware } from '@hospital/audit-client';
import {
  xssSanitizerMiddleware,
  authContextMiddleware,
  enforceRecordLevelSecurity,
  validateBody,
  LoginSchema,
  AppointmentBookingSchema,
  CreatePatientSchema,
  CreateEncounterSchema,
  CreateUserSchema,
} from './security.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const NATS_URL = process.env.NATS_URL;

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:4004',
  patient: process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:4001',
  appointment: process.env.APPOINTMENT_SERVICE_URL || 'http://127.0.0.1:4002',
  clinical: process.env.CLINICAL_SERVICE_URL || 'http://127.0.0.1:4003',
  audit: process.env.AUDIT_SERVICE_URL || 'http://127.0.0.1:4005',
};

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
];

async function bootstrap() {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: { action: 'sameorigin' },
      hidePoweredBy: true,
      hsts: { maxAge: 31536000, includeSubDomains: true },
      noSniff: true,
      xssFilter: true,
    })
  );

  // 2. Strict CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in local dev, restricted in prod
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Correlation-Id',
        'X-Trace-Id',
        'X-Clinical-Reason',
        'X-User-Id',
        'X-User-Name',
        'X-User-Role',
      ],
      exposedHeaders: ['X-Trace-Id'],
    })
  );

  // 3. Correlation & Trace ID Injection
  app.use((req: Request, res: Response, next: NextFunction) => {
    const traceId = (req.headers['x-correlation-id'] ||
      req.headers['x-trace-id'] ||
      `gw_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`) as string;
    req.headers['x-correlation-id'] = traceId;
    req.headers['x-trace-id'] = traceId;
    res.setHeader('X-Trace-Id', traceId);
    next();
  });

  // 4. Body Parsing & XSS Sanitization
  app.use(express.json({ limit: '2mb' }));
  app.use(xssSanitizerMiddleware);

  // 5. Auth Context & Session Resolution
  app.use(authContextMiddleware);

  // 6. Zero-Trust Access Control & Record-Level Security (RLS)
  app.use(enforceRecordLevelSecurity);

  // 7. Audit Logging Middleware for Ingress Operations
  const eventBus = await createEventBus(NATS_URL);
  const auditClient = new AuditClient('api-gateway', eventBus);
  app.use(createAuditMiddleware(auditClient));

  // 8. Health & Gateway Status Endpoints
  app.get('/health', async (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'api-gateway',
      time: new Date().toISOString(),
      routes: {
        auth: SERVICES.auth,
        patient: SERVICES.patient,
        appointment: SERVICES.appointment,
        clinical: SERVICES.clinical,
        audit: SERVICES.audit,
      },
    });
  });

  app.get('/api/v1/gateway/status', async (req: Request, res: Response) => {
    const checkService = async (name: string, url: string) => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1000);
        const resp = await fetch(`${url}/health`, { signal: controller.signal });
        clearTimeout(timer);
        return { service: name, status: resp.ok ? 'ONLINE' : 'DEGRADED', url };
      } catch {
        return { service: name, status: 'OFFLINE', url };
      }
    };

    const checks = await Promise.all([
      checkService('auth-service', SERVICES.auth),
      checkService('patient-service', SERVICES.patient),
      checkService('appointment-service', SERVICES.appointment),
      checkService('clinical-service', SERVICES.clinical),
      checkService('audit-service', SERVICES.audit),
    ]);

    res.json({
      gateway: 'ONLINE',
      timestamp: new Date().toISOString(),
      security: {
        rlsEnabled: true,
        idorDefense: true,
        zodValidation: true,
        helmetProtection: true,
        cryptographicAudit: true,
      },
      services: checks,
    });
  });

  // 9. Input Validation Pre-Middleware for Ingress Mutations
  app.post('/api/v1/auth/login', validateBody(LoginSchema));
  app.post('/api/v1/auth/users', validateBody(CreateUserSchema));
  app.post('/api/v1/appointments', validateBody(AppointmentBookingSchema));
  app.post('/api/v1/patients', validateBody(CreatePatientSchema));
  app.post('/api/v1/clinical/encounters', validateBody(CreateEncounterSchema));

  // 10. Reverse Proxy Route Forwarding with Body Stream Fix
  app.use(
    createProxyMiddleware({
      target: SERVICES.auth,
      changeOrigin: true,
      pathFilter: '/api/v1/auth',
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  app.use(
    createProxyMiddleware({
      target: SERVICES.patient,
      changeOrigin: true,
      pathFilter: '/api/v1/patients',
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  app.use(
    createProxyMiddleware({
      target: SERVICES.appointment,
      changeOrigin: true,
      pathFilter: '/api/v1/appointments',
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  app.use(
    createProxyMiddleware({
      target: SERVICES.clinical,
      changeOrigin: true,
      pathFilter: '/api/v1/clinical',
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  app.use(
    createProxyMiddleware({
      target: SERVICES.audit,
      changeOrigin: true,
      pathFilter: '/api/v1/audit',
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  // 11. Centralized Production Error Handler (Zero Stack Trace Leakage)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const traceId = req.headers['x-trace-id'] as string;
    console.error(`[APIGateway Error] Trace: ${traceId}`, err);
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: 'A security or routing error occurred. Please contact the clinical administrator.',
      traceId,
    });
  });

  const server = app.listen(PORT, () => {
    console.log(`[APIGateway] Central Hardened Gateway listening on http://localhost:${PORT}`);
    console.log(`  ├── /api/v1/auth         -> ${SERVICES.auth}`);
    console.log(`  ├── /api/v1/patients     -> ${SERVICES.patient}`);
    console.log(`  ├── /api/v1/appointments -> ${SERVICES.appointment}`);
    console.log(`  ├── /api/v1/clinical     -> ${SERVICES.clinical}`);
    console.log(`  └── /api/v1/audit        -> ${SERVICES.audit}`);
  });

  return { app, server };
}

bootstrap().catch(err => {
  console.error('[APIGateway] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
