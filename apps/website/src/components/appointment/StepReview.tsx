'use client';

import React from 'react';
import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import type { Department, Doctor } from '@hospital/contracts';
import { cn } from '@/lib/utils';
import { type CareType, type PatientFormValues, formatLongDate } from './wizardModel';
import { FieldMessage, FOCUS_RING, StepHeading, describedBy } from './WizardUi';

interface StepReviewProps {
  idPrefix: string;
  department?: Department;
  doctor?: Doctor;
  careType: CareType;
  slotDate: string;
  slotTime: string;
  form: UseFormReturn<PatientFormValues>;
  onEdit: (step: number) => void;
  submitError?: string;
  autoFocus: boolean;
}

type Row = { term: string; value: React.ReactNode };

function SummaryGroup({
  title,
  rows,
  editLabel,
  onEdit,
}: {
  title: string;
  rows: Row[];
  editLabel: string;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-card border border-border bg-muted/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-eyebrow uppercase text-muted-foreground">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className={cn('rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-background', FOCUS_RING)}
        >
          Edit
        </button>
      </div>
      <dl className="space-y-1.5 text-sm">
        {rows.map((row) => (
          <div key={row.term} className="grid grid-cols-[7.5rem_1fr] gap-3">
            <dt className="text-muted-foreground">{row.term}</dt>
            <dd className="min-w-0 break-words font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Step 5: summary of every choice, consent (unchecked by default), then submit. */
export default function StepReview({
  idPrefix,
  department,
  doctor,
  careType,
  slotDate,
  slotTime,
  form,
  onEdit,
  submitError,
  autoFocus,
}: StepReviewProps) {
  const {
    register,
    getValues,
    formState: { errors },
  } = form;
  const values = getValues();
  const consentId = `${idPrefix}-consent`;
  const consentError = errors.consent?.message;

  return (
    <div className="space-y-5">
      <StepHeading
        id={`${idPrefix}-review-heading`}
        step={5}
        title="Check and confirm"
        description="Nothing is booked until you confirm."
        autoFocus={autoFocus}
      />

      <div className="grid grid-cols-1 gap-3">
        <SummaryGroup
          title="Visit"
          editLabel="Edit department and doctor"
          onEdit={() => onEdit(1)}
          rows={[
            { term: 'Department', value: department?.name ?? 'General outpatient care' },
            { term: 'Doctor', value: doctor?.name ?? 'Assigned specialist' },
            ...(doctor ? [{ term: 'Fee', value: `$${doctor.consultationFee}` }] : []),
          ]}
        />
        <SummaryGroup
          title="When"
          editLabel="Edit date, time and visit type"
          onEdit={() => onEdit(3)}
          rows={[
            { term: 'Date', value: formatLongDate(slotDate) },
            { term: 'Time', value: slotTime },
            { term: 'Type', value: careType === 'TELEHEALTH_VIRTUAL' ? 'Video visit' : 'In person' },
          ]}
        />
        <SummaryGroup
          title="Patient"
          editLabel="Edit patient details"
          onEdit={() => onEdit(4)}
          rows={[
            { term: 'Name', value: `${values.firstName.trim()} ${values.lastName.trim()}` },
            { term: 'Phone', value: values.phone.trim() },
            { term: 'Email', value: values.email.trim() || 'Not given' },
            { term: 'Reason', value: values.symptoms.trim() || 'Not given' },
          ]}
        />
      </div>

      <div className="space-y-2 rounded-card border border-border p-4">
        <div className="flex items-start gap-3">
          <input
            id={consentId}
            type="checkbox"
            aria-invalid={consentError ? true : undefined}
            aria-describedby={describedBy(consentId, { hint: true, error: Boolean(consentError) })}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-400 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register('consent')}
          />
          <label htmlFor={consentId} className="cursor-pointer text-sm leading-relaxed text-foreground">
            I agree that ProHealth may use these details to schedule and prepare for my care.{' '}
            <span className="text-muted-foreground">(required)</span>
          </label>
        </div>
        <p id={`${consentId}-hint`} className="pl-8 text-[13px] text-muted-foreground">
          We handle health information under HIPAA. Read our{' '}
          <Link href="/privacy-policy" className={cn('rounded-sm font-semibold text-primary underline underline-offset-2', FOCUS_RING)}>
            privacy policy
          </Link>
          .
        </p>
        <div className="pl-8">
          <FieldMessage id={`${consentId}-error`} message={consentError} />
        </div>
      </div>

      <FieldMessage id={`${idPrefix}-submit-error`} message={submitError} />
    </div>
  );
}
