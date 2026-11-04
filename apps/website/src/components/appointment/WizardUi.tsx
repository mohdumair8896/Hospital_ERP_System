'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOTAL_STEPS } from './wizardModel';

/** Small building blocks shared by the booking wizard steps. */

export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Soft filled input (pattern C38). Invalid fields get an alert border. */
export const INPUT_CLASS = cn(
  'w-full rounded-xl border border-input bg-muted/60 px-3.5 text-sm text-foreground',
  'placeholder:text-muted-foreground transition-colors duration-250',
  'hover:border-slate-300 focus:bg-background',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
  'aria-[invalid=true]:border-alert aria-[invalid=true]:bg-alert-soft/40'
);

export const PRIMARY_BUTTON = cn(
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground',
  'shadow-soft transition-colors duration-250 hover:bg-prohealth-primary-hover disabled:cursor-not-allowed disabled:opacity-60',
  FOCUS_RING
);

export const GHOST_BUTTON = cn(
  'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground',
  'transition-colors duration-250 hover:bg-muted hover:text-foreground',
  FOCUS_RING
);

/** Builds an aria-describedby value from the hint and error ids that are present. */
export function describedBy(id: string, opts: { hint?: boolean; error?: boolean }): string | undefined {
  const ids = [opts.hint && `${id}-hint`, opts.error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

interface StepHeadingProps {
  id: string;
  step?: number;
  title: string;
  description?: React.ReactNode;
  /** Move focus here when mounted (after the visitor changes step). */
  autoFocus?: boolean;
}

/**
 * Step title. It takes focus on mount when `autoFocus` is set, so keyboard and
 * screen reader users land on the new step instead of a removed button.
 */
export function StepHeading({ id, step, title, description, autoFocus }: StepHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!autoFocus || !el) return;
    // Never pull focus from something the visitor moved to on purpose (for
    // example the dialog's close button while a preselected step loads).
    const active = document.activeElement as HTMLElement | null;
    const free =
      !active ||
      active === document.body ||
      active.hasAttribute('data-step-heading') ||
      active.getAttribute('role') === 'dialog' ||
      Boolean(el.closest('form')?.contains(active));
    if (!free) return;
    el.focus({ preventScroll: true });
    const rect = el.getBoundingClientRect();
    if (rect.top < 96 || rect.bottom > window.innerHeight) {
      el.scrollIntoView({ block: 'nearest' });
    }
    // Focus only once, when this step first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-1.5">
      <h3
        ref={ref}
        id={id}
        tabIndex={-1}
        data-step-heading=""
        className="scroll-mt-28 rounded-md font-display text-xl font-bold tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:text-2xl"
      >
        {step ? <span className="sr-only">{`Step ${step} of ${TOTAL_STEPS}: `}</span> : null}
        {title}
      </h3>
      {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}

interface ChoiceCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  pressed: boolean;
}

/** Selectable card: a real button with aria-pressed and a visible check when chosen. */
export function ChoiceCard({ pressed, className, children, ...rest }: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-card border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-250 ease-out-soft',
        'motion-safe:hover:-translate-y-0.5',
        pressed
          ? 'border-primary bg-dept-blue-bg shadow-soft ring-1 ring-primary'
          : 'border-border bg-card hover:border-slate-300 hover:shadow-soft',
        FOCUS_RING,
        className
      )}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-250',
          pressed ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-300 bg-background text-transparent'
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}

/** Inline validation message, announced as it appears. */
export function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label, control, "why we ask" hint and error, wired by id. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}{' '}
        <span className="font-normal text-muted-foreground">{required ? '(required)' : '(optional)'}</span>
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <FieldMessage id={`${id}-error`} message={error} />
    </div>
  );
}

/** Back / Continue footer; the last step submits with "Confirm booking". */
export function WizardNav({ step, loading, onBack }: { step: number; loading: boolean; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
      {step > 1 ? (
        <button type="button" onClick={onBack} className={GHOST_BUTTON}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
      ) : (
        <span />
      )}
      <button type="submit" disabled={loading} className={PRIMARY_BUTTON}>
        {step < TOTAL_STEPS ? (
          <>
            Continue <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </>
        ) : loading ? (
          <>
            <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> Booking…
          </>
        ) : (
          'Confirm booking'
        )}
      </button>
    </div>
  );
}

/** Placeholder card shown while departments or doctors load. */
export function ChoiceSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-card border border-border p-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-muted motion-safe:animate-pulse" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 w-2/3 rounded bg-muted motion-safe:animate-pulse" />
            <div className="h-3 w-full rounded bg-muted motion-safe:animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
