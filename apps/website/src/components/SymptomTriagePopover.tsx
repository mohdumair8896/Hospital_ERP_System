'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Sparkles, Stethoscope, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { TRIAGE_REASON_KEY } from './appointment/wizardModel';
import { STEP_TITLES, SYMPTOM_OPTIONS, type TriageCategory, type TriageStep } from './overlays/triageData';
import { CategoryStep, DetailsStep, PRIMARY_PILL, RING, RedFlagStep } from './overlays/TriageSteps';
import { TriageMatch } from './overlays/TriageMatch';
import { TriageProgress, TriageSafetyNote } from './overlays/TriageProgress';

export interface SymptomTriagePopoverProps {
  onScheduleDirectly?: (doctorId: string, departmentId: string, symptomsText: string) => void;
}

/**
 * Floating symptom checker: a launcher stacked above the EmergencyFAB opens a
 * four-step modal (concern, red-flag check, details, suggested specialist).
 * It is guidance only and keeps the ambulance number in view on every step.
 */
export default function SymptomTriagePopover({ onScheduleDirectly }: SymptomTriagePopoverProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Questionnaire state
  const [step, setStep] = useState<TriageStep>(1);
  const [selectedCategory, setSelectedCategory] = useState<TriageCategory | null>(null);
  const [hasRedFlags, setHasRedFlags] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('2_to_7_days');
  const [severity, setSeverity] = useState<number>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Focus management: focus moves into the dialog on open; closing with Escape
  // or the X button returns focus to the floating launcher.
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef(false);

  const closeTriage = () => {
    returnFocusRef.current = true;
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      if (returnFocusRef.current) {
        returnFocusRef.current = false;
        launcherRef.current?.focus();
      }
      return;
    }
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTriage();
        return;
      }
      // aria-modal promises an inert background, so keep Tab cycling inside the dialog.
      const dialog = dialogRef.current;
      if (e.key !== 'Tab' || !dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Auto-prompt subtle invitation on initial visit after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasPrompted && !isOpen) {
        setHasPrompted(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasPrompted, isOpen]);

  const activeOption = SYMPTOM_OPTIONS.find((opt) => opt.id === selectedCategory);
  const matchedDoctor = activeOption ? DOCTORS.find((d) => d.id === activeOption.matchedDocId) : null;
  const matchedDept = activeOption ? DEPARTMENTS.find((d) => d.id === activeOption.deptId) : null;

  const handleSelectCategory = (cat: TriageCategory) => {
    setSelectedCategory(cat);
    setSelectedSymptoms([]);
    setStep(2);
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleProceedToMatch = () => {
    setStep(4);
  };

  const handleBookAppointment = () => {
    if (!matchedDoctor || !matchedDept) return;

    const reasonsList = [
      ...selectedSymptoms,
      customNotes.trim() ? `Notes: ${customNotes.trim()}` : '',
      `Duration: ${duration.replace(/_/g, ' ')}`,
      `Severity: ${severity}/10`
    ].filter(Boolean).join(' • ');

    if (onScheduleDirectly) {
      onScheduleDirectly(matchedDoctor.id, matchedDept.id, reasonsList);
      setIsOpen(false);
    } else {
      // Symptoms are health information: hand them over in sessionStorage, never in the URL
      // (which lands in browser history and server logs).
      try {
        sessionStorage.setItem(TRIAGE_REASON_KEY, reasonsList);
      } catch {
        // Storage unavailable: the booking form simply starts without a prefilled reason.
      }
      router.push(`/appointments?dept=${matchedDept.id}&doc=${matchedDoctor.id}`);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory(null);
    setHasRedFlags(false);
    setSelectedSymptoms([]);
    setCustomNotes('');
    setSeverity(5);
  };

  return (
    <>
      {/* Floating launcher: stacked above the EmergencyFAB (bottom-6 right-6, 56px), never over it */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
        {/* Subtle welcome balloon on first visit */}
        {hasPrompted && !isOpen && (
          <div className="relative max-w-xs rounded-card border border-border bg-card p-4 pr-9 shadow-lift animate-in fade-in slide-in-from-bottom-3 duration-250">
            <button
              type="button"
              onClick={() => setHasPrompted(false)}
              className={cn('absolute right-2 top-2 rounded-full p-1.5 text-prohealth-muted hover:bg-muted hover:text-prohealth-heading', RING)}
              aria-label="Close tip"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-prohealth-heading">Unsure which doctor to see?</p>
                <p className="text-sm leading-relaxed text-prohealth-body">
                  Take our 60-second symptom questionnaire to match with the right board-certified specialist.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(true);
                    setHasPrompted(false);
                  }}
                  className={cn('group mt-1.5 inline-flex items-center gap-1 rounded text-sm font-semibold text-primary hover:text-prohealth-primary-hover', RING)}
                >
                  <span>Start Free Symptom Check</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform duration-250 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Persistent floating button */}
        <button
          ref={launcherRef}
          type="button"
          onClick={() => {
            setIsOpen(true);
            setHasPrompted(false);
            setShowNotificationBadge(false);
          }}
          aria-haspopup="dialog"
          className={cn(
            'group relative flex items-center gap-2.5 rounded-pill border border-white/20 bg-primary px-4 py-3 text-primary-foreground shadow-lift',
            'transition-[background-color,box-shadow,transform] duration-250 ease-out-soft hover:bg-prohealth-primary-hover hover:shadow-glow-primary active:scale-95',
            RING,
          )}
          aria-label="Open Symptom Questionnaire & Doctor Matcher"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-250 motion-safe:group-hover:rotate-12">
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[0.6875rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white/80">
              Clinical Triage
            </span>
            <span className="block text-sm font-bold leading-tight">Symptom Checker</span>
          </span>
          {showNotificationBadge && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-care ring-2 ring-white motion-safe:animate-ping"
            />
          )}
        </button>
      </div>

      {/* Questionnaire modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-xs animate-in fade-in duration-250 sm:p-6">
          <div
            ref={dialogRef}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-border bg-card shadow-lift animate-in zoom-in-95 duration-250 sm:rounded-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="symptom-triage-title"
          >
            {/* Header with progress */}
            <div className="shrink-0 space-y-4 border-b border-border px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-eyebrow uppercase text-primary">
                      <span className="hidden sm:inline">Symptom checker · </span>Step {step} of 4
                    </p>
                    <h2 id="symptom-triage-title" className="mt-1.5 font-display text-lg font-bold leading-snug text-prohealth-heading sm:text-xl">
                      {STEP_TITLES[step]}
                    </h2>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeTriage}
                  className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-prohealth-heading transition-colors hover:bg-muted', RING)}
                  aria-label="Close symptom checker"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <TriageProgress step={step} />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {step === 1 && <CategoryStep selected={selectedCategory} onSelect={handleSelectCategory} />}

              {step === 2 && activeOption && (
                <RedFlagStep hasRedFlags={hasRedFlags} onChange={setHasRedFlags} onLeave={() => setIsOpen(false)} />
              )}

              {step === 3 && activeOption && (
                <DetailsStep
                  option={activeOption}
                  selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={toggleSymptom}
                  duration={duration}
                  onDurationChange={setDuration}
                  severity={severity}
                  onSeverityChange={setSeverity}
                  notes={customNotes}
                  onNotesChange={setCustomNotes}
                />
              )}

              {step === 4 && activeOption && matchedDoctor && matchedDept && (
                <TriageMatch doctor={matchedDoctor} department={matchedDept} onBook={handleBookAppointment} onReset={handleReset} />
              )}
            </div>

            {/* Footer: step controls, plus the safety note on every step */}
            <div className="shrink-0 space-y-3 border-t border-border bg-muted/50 px-5 py-4 sm:px-7">
              {step > 1 && step < 4 && (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as TriageStep)}
                    className={cn('inline-flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-sm font-semibold text-prohealth-body transition-colors hover:bg-card hover:text-prohealth-heading', RING)}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Back</span>
                  </button>

                  {step === 2 && !hasRedFlags && (
                    <button type="button" onClick={() => setStep(3)} className={cn(PRIMARY_PILL, 'px-5 py-2.5')}>
                      <span>Continue Assessment</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}

                  {step === 3 && (
                    <button type="button" onClick={handleProceedToMatch} className={cn(PRIMARY_PILL, 'px-5 py-2.5')}>
                      <span>Find Matching Specialist</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
              <TriageSafetyNote />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
