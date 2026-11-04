'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_SOFT } from '@/components/motion';
import { TOTAL_STEPS, WIZARD_STEPS } from './wizardModel';

/**
 * "Step n of 5" counter, a progress bar that grows with scaleX, and a step
 * list with the current step marked aria-current="step" (patterns P-FORM-3, C40).
 * Under reduced motion MotionConfig skips the scale animation, so the bar jumps.
 */
export default function WizardProgress({ step }: { step: number }) {
  const current = WIZARD_STEPS[step - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          Step {step} of {TOTAL_STEPS}
          <span className="font-normal text-muted-foreground"> · {current?.label}</span>
        </p>
        <p className="text-eyebrow uppercase text-muted-foreground tabular-nums" aria-hidden="true">
          {String(step).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Booking progress"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of ${TOTAL_STEPS}: ${current?.label ?? ''}`}
        className="h-1.5 overflow-hidden rounded-pill bg-muted"
      >
        <motion.div
          className="h-full w-full origin-left rounded-pill bg-primary"
          initial={false}
          animate={{ scaleX: step / TOTAL_STEPS }}
          transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
        />
      </div>

      <ol className="hidden grid-cols-5 gap-2 sm:grid" aria-label="Booking steps">
        {WIZARD_STEPS.map((item) => {
          const done = step > item.num;
          const active = step === item.num;
          return (
            <li
              key={item.num}
              aria-current={active ? 'step' : undefined}
              className="flex items-center gap-2 text-[13px]"
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-250',
                  active && 'bg-primary text-primary-foreground shadow-soft',
                  done && 'bg-care text-white',
                  !active && !done && 'bg-muted text-muted-foreground'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : item.num}
              </span>
              <span
                className={cn(
                  'truncate',
                  active ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.label}
                {done ? <span className="sr-only"> (completed)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
