'use client';

import React from 'react';
import { CalendarDays, Star, UserRound } from 'lucide-react';
import type { Department, Doctor } from '@hospital/contracts';
import { HOSPITAL_PHONE, shortDayList } from './wizardModel';
import { ChoiceCard, ChoiceSkeleton, FieldMessage, StepHeading } from './WizardUi';

interface StepDoctorProps {
  idPrefix: string;
  department?: Department;
  doctors: Doctor[] | null;
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
  autoFocus: boolean;
}

/** Step 2: choose a doctor in the selected department. */
export default function StepDoctor({
  idPrefix,
  department,
  doctors,
  selectedId,
  onSelect,
  error,
  autoFocus,
}: StepDoctorProps) {
  const headingId = `${idPrefix}-doctor-heading`;
  const errorId = `${idPrefix}-doctor-error`;

  return (
    <div className="space-y-5">
      <StepHeading
        id={headingId}
        step={2}
        title="Choose your doctor"
        description={
          department ? (
            <>
              Specialists in <span className="font-semibold text-foreground">{department.name}</span>.
            </>
          ) : (
            'Specialists in your chosen department.'
          )
        }
        autoFocus={autoFocus}
      />

      {doctors === null ? (
        <>
          <p className="sr-only" role="status">
            Loading doctors
          </p>
          <ChoiceSkeleton count={2} />
        </>
      ) : doctors.length === 0 ? (
        <div className="flex items-start gap-3 rounded-card border border-dashed border-border bg-muted/50 p-5">
          <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            No doctors in this department take online bookings yet. Go back to pick another department, or call{' '}
            <a
              href={HOSPITAL_PHONE.href}
              className="rounded-sm font-semibold text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {HOSPITAL_PHONE.label}
            </a>{' '}
            and we will book you in.
          </p>
        </div>
      ) : (
        <div
          role="group"
          aria-labelledby={headingId}
          aria-describedby={error ? errorId : undefined}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {doctors.map((doc) => (
            <ChoiceCard key={doc.id} pressed={selectedId === doc.id} onClick={() => onSelect(doc.id)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120'}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
              />
              <span className="min-w-0 flex-1 pr-6">
                <span className="block truncate text-sm font-semibold text-foreground">{doc.name}</span>
                <span className="block text-[13px] font-medium text-primary">{doc.specialty}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{doc.rating}</span>
                    <span className="sr-only">out of 5 rating</span>
                  </span>
                  <span>Fee ${doc.consultationFee}</span>
                  {doc.availableDays?.length ? (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {shortDayList(doc.availableDays)}
                    </span>
                  ) : null}
                </span>
              </span>
            </ChoiceCard>
          ))}
        </div>
      )}

      <FieldMessage id={errorId} message={error} />
    </div>
  );
}
