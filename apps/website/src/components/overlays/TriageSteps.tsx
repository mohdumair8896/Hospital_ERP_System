'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, CheckCircle2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DURATION_OPTIONS, RED_FLAG_SIGNS, SYMPTOM_OPTIONS, TONE_TILE, type SymptomOption, type TriageCategory } from './triageData';

export const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Primary and secondary pill buttons shared by the triage footer and match step. */
export const PRIMARY_PILL = cn(
  'inline-flex items-center justify-center gap-2 rounded-pill bg-primary text-primary-foreground text-sm font-semibold',
  'transition-colors duration-250 ease-out-soft hover:bg-prohealth-primary-hover active:scale-[0.98]',
  RING,
);
export const QUIET_PILL = cn(
  'inline-flex items-center justify-center gap-2 rounded-pill border border-border bg-card text-sm font-semibold text-prohealth-heading',
  'transition-colors duration-250 ease-out-soft hover:bg-muted',
  RING,
);

const FIELD = cn(
  'w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-prohealth-heading',
  'placeholder:text-prohealth-muted transition-colors duration-250 hover:border-primary/30',
  RING,
);

const LEGEND = 'block text-sm font-semibold text-prohealth-heading';

/* ------------------------------------------------------------------ */
/* Step 1: chief concern                                               */
/* ------------------------------------------------------------------ */

export function CategoryStep({ selected, onSelect }: { selected: TriageCategory | null; onSelect: (cat: TriageCategory) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-prohealth-body leading-relaxed">
        Select the category that best describes your primary health concern. We will guide you through a few short questions to
        pair you with an accredited specialist.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SYMPTOM_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <li key={opt.id} className="flex">
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  'group flex flex-1 items-start gap-3.5 rounded-card border p-4 text-left',
                  'transition-[border-color,box-shadow,background-color] duration-250 ease-out-soft',
                  isSelected
                    ? 'border-primary bg-secondary shadow-soft'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/60 hover:shadow-soft',
                  RING,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-250 ease-out-soft motion-safe:group-hover:scale-105',
                    TONE_TILE[opt.tone],
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="block text-sm font-bold text-prohealth-heading group-hover:text-primary">{opt.title}</span>
                  <span className="text-sm text-prohealth-muted leading-snug line-clamp-2">{opt.subtitle}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2: emergency red flags                                         */
/* ------------------------------------------------------------------ */

type RedFlagStepProps = {
  hasRedFlags: boolean;
  onChange: (value: boolean) => void;
  /** Closes the checker when the visitor follows the directions link. */
  onLeave: () => void;
};

export function RedFlagStep({ hasRedFlags, onChange, onLeave }: RedFlagStepProps) {
  const questionId = useId();

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-card border border-dept-amber-fg/20 bg-dept-amber-bg p-4 text-dept-amber-fg">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="space-y-1 text-sm">
          <p className="font-bold">Patient safety first</p>
          <p className="leading-relaxed">
            Before recommending an outpatient appointment, we must ensure you do not have acute symptoms that require immediate
            Emergency Room attention.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p id={questionId} className={LEGEND}>
          Are you currently experiencing any of the following acute symptoms?
        </p>
        <ul className="space-y-2 rounded-xl border border-border bg-muted p-4 text-sm text-prohealth-body">
          {RED_FLAG_SIGNS.map((sign) => (
            <li key={sign} className="flex items-start gap-2.5">
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-alert" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>

        <div role="group" aria-labelledby={questionId} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            aria-pressed={!hasRedFlags}
            onClick={() => onChange(false)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-card border p-4 text-left transition-[border-color,background-color,box-shadow] duration-250',
              !hasRedFlags ? 'border-care bg-care-soft ring-2 ring-care/20' : 'border-border bg-card hover:bg-muted/60',
              RING,
            )}
          >
            <span>
              <span className={cn('block text-sm font-bold', !hasRedFlags ? 'text-care' : 'text-prohealth-heading')}>
                No acute red flags
              </span>
              <span className="block text-sm text-prohealth-body">My symptoms are stable for outpatient consult</span>
            </span>
            {!hasRedFlags && <CheckCircle2 className="h-5 w-5 shrink-0 text-care" aria-hidden="true" />}
          </button>

          <button
            type="button"
            aria-pressed={hasRedFlags}
            onClick={() => onChange(true)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-card border p-4 text-left transition-[border-color,background-color,box-shadow] duration-250',
              hasRedFlags ? 'border-alert bg-alert-soft ring-2 ring-alert/20' : 'border-border bg-card hover:bg-muted/60',
              RING,
            )}
          >
            <span>
              <span className="block text-sm font-bold text-alert">Yes, I have severe symptoms</span>
              <span className="block text-sm text-prohealth-body">I require emergency medical triage</span>
            </span>
            {hasRedFlags && <AlertTriangle className="h-5 w-5 shrink-0 text-alert" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {hasRedFlags && (
        <div role="alert" className="space-y-3 rounded-card bg-alert p-5 text-white shadow-lift animate-in fade-in duration-250">
          <p className="flex items-center gap-2 text-sm font-bold">
            <AlertTriangle className="h-5 w-5 shrink-0 motion-safe:animate-bounce" aria-hidden="true" />
            <span>Critical medical alert: immediate action required</span>
          </p>
          <p className="text-sm leading-relaxed text-white/90">
            Based on your reported symptoms, you should not wait for an outpatient appointment. Please call our 24/7 Level 1
            Trauma Center immediately or proceed directly to the Emergency Room.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="tel:876256876"
              className={cn(
                'inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 text-sm font-bold text-alert shadow-soft transition-colors hover:bg-alert-soft',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alert',
              )}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>Call Ambulance Hotline: 876-256-876</span>
            </a>
            <Link
              href="/contact"
              onClick={onLeave}
              className={cn(
                'inline-flex items-center rounded-pill border border-white/40 bg-alert-strong px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-alert-strong/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alert',
              )}
            >
              Emergency Room Directions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3: symptoms, duration, severity and notes                      */
/* ------------------------------------------------------------------ */

type DetailsStepProps = {
  option: SymptomOption;
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  severity: number;
  onSeverityChange: (value: number) => void;
  notes: string;
  onNotesChange: (value: string) => void;
};

export function DetailsStep({
  option,
  selectedSymptoms,
  onToggleSymptom,
  duration,
  onDurationChange,
  severity,
  onSeverityChange,
  notes,
  onNotesChange,
}: DetailsStepProps) {
  const ids = useId();
  const symptomsLabel = `${ids}-symptoms`;
  const durationId = `${ids}-duration`;
  const severityId = `${ids}-severity`;
  const notesId = `${ids}-notes`;

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <p id={symptomsLabel} className={LEGEND}>
            Select all symptoms that apply to you
          </p>
          <span className="shrink-0 text-sm text-prohealth-muted" aria-live="polite">
            {selectedSymptoms.length} selected
          </span>
        </div>
        <div role="group" aria-labelledby={symptomsLabel} className="flex flex-wrap gap-2">
          {option.commonSymptoms.map((sym) => {
            const isSelected = selectedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleSymptom(sym)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-2 text-left text-sm font-medium',
                  'transition-[background-color,border-color,color] duration-250 ease-out-soft',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                    : 'border-border bg-card text-prohealth-heading hover:border-primary/40 hover:bg-muted',
                  RING,
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor={durationId} className={LEGEND}>
            How long have you had these symptoms?
          </label>
          <select id={durationId} value={duration} onChange={(e) => onDurationChange(e.target.value)} className={FIELD}>
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={severityId} className={LEGEND}>
              Discomfort severity
            </label>
            <span className="rounded-pill bg-secondary px-2.5 py-0.5 text-sm font-bold text-primary">{severity}/10</span>
          </div>
          <input
            id={severityId}
            type="range"
            min="1"
            max="10"
            value={severity}
            aria-valuetext={`${severity} out of 10`}
            onChange={(e) => onSeverityChange(parseInt(e.target.value, 10))}
            className={cn('h-2 w-full cursor-pointer accent-primary rounded-pill', RING)}
          />
          <div aria-hidden="true" className="flex justify-between text-xs text-prohealth-muted">
            <span>1 (Mild)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={notesId} className={LEGEND}>
          Additional details / medical history <span className="font-normal text-prohealth-muted">(optional)</span>
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Previous cardiac stent, taking blood pressure medication, symptoms worse in the morning..."
          rows={2}
          className={cn(FIELD, 'resize-y')}
        />
      </div>
    </div>
  );
}
