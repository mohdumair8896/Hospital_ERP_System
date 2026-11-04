'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { PatientFormValues } from './wizardModel';
import { Field, INPUT_CLASS, StepHeading, describedBy } from './WizardUi';

interface StepDetailsProps {
  idPrefix: string;
  form: UseFormReturn<PatientFormValues>;
  autoFocus: boolean;
}

/** Step 4: patient name and contact details, validated with zod via react-hook-form. */
export default function StepDetails({ idPrefix, form, autoFocus }: StepDetailsProps) {
  const {
    register,
    formState: { errors },
  } = form;
  const id = (name: string) => `${idPrefix}-${name}`;
  const aria = (name: keyof PatientFormValues, hint: boolean) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': describedBy(id(name), { hint, error: Boolean(errors[name]) }),
  });

  return (
    <div className="space-y-5">
      <StepHeading
        id={`${idPrefix}-details-heading`}
        step={4}
        title="Who is the appointment for?"
        description="We only use these details to arrange this visit."
        autoFocus={autoFocus}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={id('firstName')} label="First name" required error={errors.firstName?.message}>
          <input
            id={id('firstName')}
            type="text"
            autoComplete="given-name"
            className={cn(INPUT_CLASS, 'h-11')}
            {...aria('firstName', false)}
            {...register('firstName')}
          />
        </Field>
        <Field id={id('lastName')} label="Last name" required error={errors.lastName?.message}>
          <input
            id={id('lastName')}
            type="text"
            autoComplete="family-name"
            className={cn(INPUT_CLASS, 'h-11')}
            {...aria('lastName', false)}
            {...register('lastName')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id={id('phone')}
          label="Phone number"
          required
          hint="Why we ask: we text your booking ID, and call only if the time has to change."
          error={errors.phone?.message}
        >
          <input
            id={id('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 555 234 5678"
            className={cn(INPUT_CLASS, 'h-11')}
            {...aria('phone', true)}
            {...register('phone')}
          />
        </Field>
        <Field
          id={id('email')}
          label="Email"
          hint="For your confirmation and preparation notes."
          error={errors.email?.message}
        >
          <input
            id={id('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={cn(INPUT_CLASS, 'h-11')}
            {...aria('email', true)}
            {...register('email')}
          />
        </Field>
      </div>

      <Field
        id={id('symptoms')}
        label="Reason for visit"
        hint="Why we ask: it helps your doctor prepare. Only your care team can read it."
        error={errors.symptoms?.message}
      >
        <textarea
          id={id('symptoms')}
          rows={3}
          placeholder="For example: chest tightness when climbing stairs, for two weeks"
          className={cn(INPUT_CLASS, 'min-h-[96px] py-2.5 leading-relaxed')}
          {...aria('symptoms', true)}
          {...register('symptoms')}
        />
      </Field>
    </div>
  );
}
