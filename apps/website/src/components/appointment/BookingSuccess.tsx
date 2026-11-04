'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Appointment } from '@hospital/contracts';
import { formatLongDate } from './wizardModel';
import { GHOST_BUTTON, PRIMARY_BUTTON, StepHeading } from './WizardUi';
import { cn } from '@/lib/utils';

interface BookingSuccessProps {
  idPrefix: string;
  appointment: Appointment;
  onBookAnother: () => void;
  onClose?: () => void;
}

/** Confirmation shown after the API accepts the booking. */
export default function BookingSuccess({ idPrefix, appointment, onBookAnother, onClose }: BookingSuccessProps) {
  const rows = [
    { term: 'Doctor', value: appointment.doctorName },
    { term: 'Department', value: appointment.departmentName },
    { term: 'Date and time', value: `${formatLongDate(appointment.slotDate)} at ${appointment.slotTime}` },
    { term: 'Patient', value: appointment.patientName },
  ];

  return (
    <div className="space-y-6 py-2 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-care-soft text-care">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-md space-y-3">
        <span className="inline-block rounded-pill border border-care/20 bg-care-soft px-3 py-1 text-eyebrow uppercase text-care">
          Appointment confirmed
        </span>
        <div className="flex justify-center">
          <StepHeading
            id={`${idPrefix}-success-heading`}
            title={`Booking ID: ${appointment.appointmentNumber}`}
            description="Keep this ID handy. Please arrive 15 minutes early and bring a photo ID."
            autoFocus
          />
        </div>
      </div>

      <dl className="mx-auto max-w-md space-y-2 rounded-card border border-border bg-muted/40 p-4 text-left text-sm">
        {rows.map((row) => (
          <div key={row.term} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{row.term}</dt>
            <dd className="text-right font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBookAnother} className={cn(GHOST_BUTTON, 'border border-border')}>
          Book another
        </button>
        {onClose ? (
          <button type="button" onClick={onClose} className={PRIMARY_BUTTON}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
