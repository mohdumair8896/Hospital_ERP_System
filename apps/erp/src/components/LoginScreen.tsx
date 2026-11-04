import React, { useId, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Building2,
  ClipboardList,
  Eye,
  EyeOff,
  LifeBuoy,
  Lock,
  ShieldCheck,
  Stethoscope,
  User,
  type LucideIcon,
} from 'lucide-react';
import { UserRole, UserSession } from '@hospital/contracts';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LoginBrandPanel } from './login/LoginBrandPanel';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession, token: string) => void;
}

interface DemoCredential {
  role: UserRole;
  label: string;
  name: string;
  username: string;
  passwordHint: string;
  icon: LucideIcon;
  tint: string;
}

const viteEnv = (import.meta as any).env ?? {};
/** Demo accounts show in dev builds, or when a demo deployment sets VITE_SHOW_DEMO_ACCOUNTS=true. */
const SHOW_DEMO_ACCOUNTS = Boolean(viteEnv.DEV) || viteEnv.VITE_SHOW_DEMO_ACCOUNTS === 'true';

/**
 * Seeded local-development accounts (apps/auth-service). They still sign in through the gateway.
 * Only list accounts that exist in the seed data, or the card leads to a failed sign-in.
 */
const DEMO_CREDENTIALS: DemoCredential[] = [
  { role: 'ADMIN', label: 'Hospital director', name: 'Dr. Arthur Vance', username: 'admin', passwordHint: 'admin123', icon: Building2, tint: 'bg-dept-blue-bg text-dept-blue-fg' },
  { role: 'DOCTOR', label: 'Consultant cardiologist', name: 'Dr. Sarah Patel, MD', username: 'dr_sarah', passwordHint: 'doctor123', icon: Stethoscope, tint: 'bg-dept-green-bg text-dept-green-fg' },
  { role: 'RECEPTIONIST', label: 'Outpatient registration', name: 'Samuel Rivera', username: 'reception', passwordHint: 'desk123', icon: ClipboardList, tint: 'bg-dept-amber-bg text-dept-amber-fg' },
  { role: 'COMPLIANCE_AUDITOR', label: 'Privacy & compliance officer', name: 'Eleanor Campbell', username: 'auditor', passwordHint: 'audit123', icon: ShieldCheck, tint: 'bg-dept-blue-bg text-dept-blue-fg' },
  { role: 'NURSE', label: 'Charge nurse', name: 'Jane Miller, RN', username: 'nurse_jane', passwordHint: 'nurse123', icon: Activity, tint: 'bg-dept-green-bg text-dept-green-fg' },
];

const UNREACHABLE =
  "Can't reach the hospital sign-in service. Check your network connection or that the API gateway is running, then try again.";

/** Turns a failed /auth/login response into a message a person can act on. */
async function loginError(resp: Response): Promise<string> {
  let serverMessage = '';
  try {
    const body = await resp.json();
    serverMessage = typeof body?.error === 'string' ? body.error : '';
  } catch {}
  if (resp.status === 401) return 'Incorrect username or password. Check both and try again.';
  if (resp.status === 400 || resp.status === 422) return serverMessage || 'Enter a valid username and password.';
  if (resp.status === 429) return 'Too many sign-in attempts. Wait a minute, then try again.';
  if (resp.status >= 500) return `The sign-in service is unavailable right now (HTTP ${resp.status}). Try again shortly or contact the IT service desk.`;
  return serverMessage || `Sign-in failed (HTTP ${resp.status}).`;
}

const inputClass =
  'h-11 w-full rounded-lg border border-input bg-background pl-10 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 aria-[invalid=true]:border-alert';

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const ids = { user: useId(), pass: useId(), error: useId(), caps: useId() };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter both your username and your password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let resp: Response;
      try {
        resp = await apiFetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password }),
        });
      } catch {
        setError(UNREACHABLE);
        return;
      }
      if (!resp.ok) {
        setError(await loginError(resp));
        if (resp.status === 401) {
          setPassword('');
          passwordRef.current?.focus();
        }
        return;
      }
      const data = await resp.json().catch(() => null);
      if (!data?.token || !data?.user) {
        setError('The sign-in service sent an unexpected response. Try again or contact the IT service desk.');
        return;
      }
      toast.success(`Welcome back, ${data.user.name}`);
      onLoginSuccess(data.user, data.token);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (demo: DemoCredential) => {
    setUsername(demo.username);
    setPassword(demo.passwordHint);
    setError(null);
  };

  const trackCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.('CapsLock') ?? false);
  const describedBy = (extra?: string) => [error ? ids.error : '', extra ?? ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-muted px-4 py-8 font-sans text-foreground sm:px-6 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_70%)]"
      />
      <div className="relative grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <LoginBrandPanel className="lg:col-span-5" />

        {/* Sign-in card */}
        <main className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:col-span-7">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your hospital staff account.</p>

          <div id={ids.error} role="alert" className="empty:hidden mt-5">
            {error && (
              <p className="flex items-start gap-2.5 rounded-lg border border-alert/25 bg-alert-soft px-3.5 py-3 text-sm text-alert motion-safe:animate-in motion-safe:fade-in-0 duration-150">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate aria-busy={loading}>
            <div className="space-y-1.5">
              <label htmlFor={ids.user} className="block text-sm font-medium text-foreground">
                Username or staff email
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id={ids.user}
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr_sarah"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy()}
                  className={cn(inputClass, 'pr-4')}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={ids.pass} className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  ref={passwordRef}
                  id={ids.pass}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy(capsLock ? ids.caps : undefined)}
                  className={cn(inputClass, 'pr-11')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  aria-controls={ids.pass}
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {capsLock && (
                <p id={ids.caps} className="text-xs text-dept-amber-fg">
                  Caps Lock is on.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : (
                <>
                  Sign in
                  <ArrowRight className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <LifeBuoy className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Locked out or forgot your password? Contact the IT service desk, ext. 4357 (24/7). Passwords are never reset by email.
            </span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>Authorised hospital staff only. Every sign-in attempt is recorded in the audit log.</span>
          </p>

          {/* Demo accounts (local development seed data); hidden in production builds */}
          {SHOW_DEMO_ACCOUNTS && (
          <section aria-labelledby="demo-accounts-title" className="mt-6 border-t border-border pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 id="demo-accounts-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Demo accounts
              </h3>
              <p className="text-xs text-muted-foreground">Fills the form; you still sign in through the gateway.</p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEMO_CREDENTIALS.map((demo) => {
                const Icon = demo.icon;
                const selected = username === demo.username;
                return (
                  <button
                    key={demo.username}
                    type="button"
                    onClick={() => handleSelectDemoUser(demo)}
                    aria-pressed={selected}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                      selected ? 'border-primary bg-accent' : 'border-border hover:border-primary/30 hover:bg-muted'
                    )}
                  >
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', demo.tint)}>
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug text-foreground">{demo.name}</span>
                      <span className="block text-xs leading-snug text-muted-foreground">{demo.label}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{demo.username}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          )}
        </main>
      </div>
    </div>
  );
}
