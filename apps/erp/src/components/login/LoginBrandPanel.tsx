import React, { useEffect, useState } from 'react';
import { Building2, KeyRound, Search, ShieldCheck, type LucideIcon } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import { GATEWAY_STATUS_PATH, parseGatewayStatus, serviceLabel, type GatewayHealth } from '../integration/gateway';

type HealthState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'ready'; health: GatewayHealth; checkedAt: Date };

/** Polls the public gateway status endpoint (no token needed) while the login screen is visible. */
function useGatewayHealth(pollMs = 30_000): HealthState {
  const [state, setState] = useState<HealthState>({ kind: 'loading' });

  useEffect(() => {
    let controller: AbortController | null = null;
    const load = () => {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      apiFetch(GATEWAY_STATUS_PATH, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((body) => setState({ kind: 'ready', health: parseGatewayStatus(body), checkedAt: new Date() }))
        .catch((err) => {
          if (err?.name !== 'AbortError') setState({ kind: 'error' });
        });
    };
    load();
    const timer = window.setInterval(load, pollMs);
    return () => {
      window.clearInterval(timer);
      controller?.abort();
    };
  }, [pollMs]);

  return state;
}

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: 'Ctrl+K command palette', text: 'Jump to any screen or patient record from the keyboard.' },
  { icon: ShieldCheck, title: 'Tamper-evident audit trail', text: 'Every record access is chained with SHA-256 and can be verified.' },
  { icon: KeyRound, title: 'Role-based access', text: 'Each staff role sees only the screens it needs.' },
];

const DOT_TONE: Record<string, string> = {
  ONLINE: 'bg-emerald-300',
  DEGRADED: 'bg-amber-300',
  OFFLINE: 'bg-rose-300',
};

function SystemStatus() {
  const state = useGatewayHealth();

  let headline = 'Checking hospital systems…';
  let tone = 'bg-primary-foreground/50 motion-safe:animate-pulse';
  if (state.kind === 'error') {
    headline = "Can't reach the API gateway";
    tone = 'bg-rose-300';
  } else if (state.kind === 'ready') {
    const { services, gateway } = state.health;
    const online = services.filter((s) => s.status === 'ONLINE').length;
    const allUp = gateway === 'ONLINE' && services.length > 0 && online === services.length;
    headline = allUp ? `All ${services.length} services online` : `${online} of ${services.length} services online`;
    tone = allUp ? 'bg-emerald-300' : online > 0 ? 'bg-amber-300' : 'bg-rose-300';
  }

  return (
    <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/15">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">System status</p>
        {state.kind === 'ready' && (
          <p className="text-xs text-primary-foreground/75">
            Checked {state.checkedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      <p className="mt-2 flex items-center gap-2 text-sm font-medium" aria-live="polite">
        <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', tone)} />
        {headline}
      </p>
      {state.kind === 'ready' && state.health.services.length > 0 && (
        <ul className="mt-3 flex gap-1.5" aria-label="Service health">
          {state.health.services.map((s) => (
            <li
              key={s.service}
              title={`${serviceLabel(s.service)}: ${s.status.toLowerCase()}`}
              className={cn('h-1.5 flex-1 rounded-full', DOT_TONE[s.status] ?? 'bg-rose-300')}
            >
              <span className="sr-only">
                {serviceLabel(s.service)}: {s.status.toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Left side of the sign-in screen: brand, what the workspace offers, and live system status. */
export function LoginBrandPanel({ className }: { className?: string }) {
  return (
    <section
      aria-label="About ProHealth ERP"
      className={cn(
        'relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lift sm:gap-8 sm:p-8',
        className
      )}
    >
      {/* Decoration only: a soft top-right glow, a fading dot grid and a low blurred orb. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgb(255_255_255/0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold tracking-tight">ProHealth ERP</p>
          <p className="text-xs text-primary-foreground/80">Hospital Information Management System</p>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Clinical operations,
          <span className="block text-sky-200">one workspace.</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-primary-foreground/85">
          Registration, encounters, the reception queue and compliance audits for clinical staff, physicians and administrators.
        </p>
      </div>

      <ul className="hidden space-y-3 sm:block">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/15">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-sm text-primary-foreground/80">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <SystemStatus />
    </section>
  );
}
