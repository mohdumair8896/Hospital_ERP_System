'use client';

import React from 'react';
import { Calendar, ChevronRight, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DepartmentData, DoctorData } from '../../data/hospitalData';
import { PRIMARY_PILL, QUIET_PILL } from './TriageSteps';

type TriageMatchProps = {
  doctor: DoctorData;
  department: DepartmentData;
  onBook: () => void;
  onReset: () => void;
};

/** Step 4: the suggested specialist, with the booking hand-off and a restart. */
export function TriageMatch({ doctor, department, onBook, onReset }: TriageMatchProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-250">
      <div className="flex flex-col gap-3 rounded-card border border-care/20 bg-care-soft p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-care text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-care">Suggested match for your answers</p>
            <p className="text-sm text-prohealth-body">Based on your symptom inputs, we recommend an outpatient consult with:</p>
          </div>
        </div>
        <span className="shrink-0 self-start whitespace-nowrap rounded-pill border border-care/25 bg-white px-3 py-1 text-xs font-semibold text-care sm:self-auto">
          Accredited specialist
        </span>
      </div>

      <article className="space-y-4 rounded-card border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="h-16 w-16 shrink-0 rounded-card border border-border object-cover"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-pill bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">{department.name}</span>
              <span className="inline-flex items-center gap-1 text-sm text-prohealth-muted">
                <Star className="h-3.5 w-3.5 fill-current text-dept-amber-fg" aria-hidden="true" />
                <span>
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </span>
              </span>
            </div>
            <h4 className="font-display text-lg font-bold text-prohealth-heading">{doctor.title}</h4>
            <p className="text-sm text-prohealth-body">{doctor.specialty}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold text-prohealth-muted">Experience</dt>
            <dd className="font-bold text-prohealth-heading">{doctor.experienceYears} Years</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-prohealth-muted">Next available</dt>
            <dd className="font-bold text-care">
              {doctor.availableDays[0]} at {doctor.availableSlots[0]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-prohealth-muted">Consultation fee</dt>
            <dd className="font-bold text-prohealth-heading">${doctor.consultationFee}</dd>
          </div>
        </dl>

        <div className="rounded-xl bg-muted p-3 text-sm leading-relaxed text-prohealth-body">
          <span className="mb-0.5 block font-semibold text-prohealth-heading">Clinical care plan</span>
          {doctor.bio.slice(0, 160)}...
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onBook} className={cn(PRIMARY_PILL, 'flex-1 px-6 py-3.5 shadow-lift')}>
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Schedule Consult with {doctor.name}</span>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
        <button type="button" onClick={onReset} className={cn(QUIET_PILL, 'px-5 py-3.5')}>
          Retake Check
        </button>
      </div>
    </div>
  );
}
