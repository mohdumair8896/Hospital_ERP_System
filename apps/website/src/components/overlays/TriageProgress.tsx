import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_LABELS, type TriageStep } from './triageData';

const STEPS: TriageStep[] = [1, 2, 3, 4];

/**
 * Four-segment progress indicator. Each segment carries its state in text for
 * screen readers; the bar colours are decoration on top of that.
 */
export function TriageProgress({ step }: { step: TriageStep }) {
  return (
    <ol aria-label="Symptom check progress" className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {STEPS.map((s) => {
        const state = s < step ? 'done' : s === step ? 'current' : 'upcoming';
        return (
          <li key={s} aria-current={state === 'current' ? 'step' : undefined} className="min-w-0 space-y-1.5">
            <span
              aria-hidden="true"
              className={cn(
                'block h-1.5 rounded-pill transition-colors duration-400 ease-out-soft',
                state === 'upcoming' ? 'bg-border' : 'bg-primary',
              )}
            />
            <span
              className={cn(
                'block truncate text-xs',
                state === 'current' && 'font-semibold text-primary',
                state === 'done' && 'text-prohealth-heading',
                state === 'upcoming' && 'text-prohealth-muted',
              )}
            >
              <span className="sr-only">
                Step {s}
                {state === 'done' ? ' (completed)' : state === 'current' ? ' (current)' : ''}:{' '}
              </span>
              {STEP_LABELS[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Persistent reminder that this is guidance, not a diagnosis, with the ambulance number. */
export function TriageSafetyNote() {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-prohealth-body">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>
        This checker suggests a specialist; it is not a diagnosis. In an emergency, call the ambulance on{' '}
        <a
          href="tel:876256876"
          className="whitespace-nowrap rounded font-bold text-alert underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          876-256-876
        </a>
        .
      </span>
    </p>
  );
}
