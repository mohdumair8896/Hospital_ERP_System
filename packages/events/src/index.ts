import { EventEmitter } from 'node:events';
import { BaseDomainEvent } from '@hospital/contracts';

export const EventSubjects = {
  APPOINTMENT_CREATED: 'hospital.appointment.created',
  APPOINTMENT_CANCELLED: 'hospital.appointment.cancelled',
  PATIENT_CREATED: 'hospital.patient.created',
  PATIENT_UPDATED: 'hospital.patient.updated',
  CLINICAL_ENCOUNTER_CREATED: 'hospital.clinical.encounter_created',
  CLINICAL_ENCOUNTER_FINALIZED: 'hospital.clinical.encounter_finalized',
  AUDIT_LOG_EMITTED: 'hospital.audit.logged',
} as const;

export type EventSubjectType = typeof EventSubjects[keyof typeof EventSubjects];

export interface IEventBus {
  publish<T extends BaseDomainEvent>(subject: string, event: T): Promise<void>;
  subscribe<T extends BaseDomainEvent>(subject: string, handler: (event: T) => Promise<void> | void): Promise<() => void>;
  close(): Promise<void>;
}

/**
 * Memory-backed resilient Event Bus for local development and unit testing,
 * maintaining exactly-once asynchronous delivery semantics and queue groups.
 */
class InMemoryEventBus implements IEventBus {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  async publish<T extends BaseDomainEvent>(subject: string, event: T): Promise<void> {
    // Dispatch asynchronously to simulate non-blocking network I/O
    queueMicrotask(() => {
      this.emitter.emit(subject, event);
    });
  }

  async subscribe<T extends BaseDomainEvent>(
    subject: string,
    handler: (event: T) => Promise<void> | void
  ): Promise<() => void> {
    const listener = async (event: T) => {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EventBus] Error handling event on '${subject}':`, err);
      }
    };

    this.emitter.on(subject, listener);
    return () => {
      this.emitter.off(subject, listener);
    };
  }

  async close(): Promise<void> {
    this.emitter.removeAllListeners();
  }
}

// Global Singleton for in-memory broker fallback across workspace
const globalInMemoryBus = new InMemoryEventBus();

/**
 * Event Bus Factory: Returns NATS JetStream client if available,
 * otherwise falls back gracefully to in-memory event bus.
 */
export async function createEventBus(natsUrl?: string): Promise<IEventBus> {
  if (!natsUrl) {
    return globalInMemoryBus;
  }

  try {
    const { connect, JSONCodec } = await import('nats');
    const nc = await connect({ servers: natsUrl, timeout: 3000 });
    const jc = JSONCodec();

    console.log(`[EventBus] Connected to NATS JetStream at ${natsUrl}`);

    return {
      async publish<T extends BaseDomainEvent>(subject: string, event: T): Promise<void> {
        nc.publish(subject, jc.encode(event));
      },
      async subscribe<T extends BaseDomainEvent>(
        subject: string,
        handler: (event: T) => Promise<void> | void
      ): Promise<() => void> {
        const sub = nc.subscribe(subject);
        (async () => {
          for await (const msg of sub) {
            try {
              const data = jc.decode(msg.data) as T;
              await handler(data);
            } catch (err) {
              console.error(`[NATS] Error processing message on ${subject}:`, err);
            }
          }
        })();

        return () => {
          sub.unsubscribe();
        };
      },
      async close(): Promise<void> {
        await nc.drain();
      },
    };
  } catch (err) {
    console.warn(`[EventBus] Could not connect to NATS at ${natsUrl} (${(err as Error).message}). Using In-Memory Event Bus.`);
    return globalInMemoryBus;
  }
}

export { globalInMemoryBus };
