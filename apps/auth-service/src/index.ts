import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuthDatabase } from './database.js';
import { createEventBus } from '@hospital/events';
import { AuditClient, createAuditMiddleware } from '@hospital/audit-client';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4004;
const NATS_URL = process.env.NATS_URL;

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const authDb = new AuthDatabase();
  const eventBus = await createEventBus(NATS_URL);
  const auditClient = new AuditClient('auth-service', eventBus);

  app.use(createAuditMiddleware(auditClient));

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', service: 'auth-service', time: new Date().toISOString() });
  });

  // Login
  app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const session = await authDb.authenticate(username, password);
    if (!session) {
      // Audit failed login attempt (Security audit)
      auditClient.log({
        traceId: req.headers['x-trace-id'] as string,
        actorId: 'anonymous',
        actorName: username,
        actorRole: 'PATIENT',
        clientIp: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'unknown',
        action: 'LOGIN',
        resourceType: 'USER_ACCOUNT',
        resourceId: username,
        description: `Failed login attempt for username: ${username}`,
        endpoint: req.originalUrl,
        httpMethod: 'POST',
        statusCode: 401,
        executionTimeMs: 8
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Audit successful login
    auditClient.log({
      traceId: req.headers['x-trace-id'] as string,
      actorId: session.id,
      actorName: session.name,
      actorRole: session.role,
      clientIp: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown',
      action: 'LOGIN',
      resourceType: 'USER_ACCOUNT',
      resourceId: session.id,
      description: `User authenticated successfully: ${session.name} (${session.role})`,
      endpoint: req.originalUrl,
      httpMethod: 'POST',
      statusCode: 200,
      executionTimeMs: 6
    });

    const token = `tok_${Buffer.from(JSON.stringify(session)).toString('base64')}`;
    res.json({
      token,
      user: session
    });
  });

  // Get current user session
  app.get('/api/v1/auth/me', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = JSON.parse(Buffer.from(token.replace('tok_', ''), 'base64').toString('utf-8'));
      const user = await authDb.getById(decoded.id);
      if (!user) return res.status(401).json({ error: 'User not found' });
      res.json(user);
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // List all users (convenience for demo exploration and role switcher)
  app.get('/api/v1/auth/users', async (req: Request, res: Response) => {
    const users = await authDb.getAll();
    res.json(users);
  });

  const server = app.listen(PORT, () => {
    console.log(`[AuthService] Running on port ${PORT}`);
  });

  return { app, server, authDb, eventBus };
}

bootstrap().catch(err => {
  console.error('[AuthService] Failed to start:', err);
  process.exit(1);
});

export { bootstrap };
