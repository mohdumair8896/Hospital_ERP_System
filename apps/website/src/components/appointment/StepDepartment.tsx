'use client';

import React from 'react';
import { Building2, PhoneCall } from 'lucide-react';
import type { Department } from '@hospital/contracts';
import { AMBULANCE_PHONE } from './wizardModel';
import { ChoiceCard, ChoiceSkeleton, FieldMessage, StepHeading } from './WizardUi';

interface StepDepartmentProps {
  idPrefix: string;
  departments: Department[] | null;
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
  autoFocus: boolean;
}

/** Step 1: choose a clinical department. */
export default function StepDepartment({
  idPrefix,
  departments,
  selectedId,
  onSelect,
  error,
  autoFocus,
}: StepDepartmentProps) {
  const headingId = `${idPrefix}-dept-heading`;
  const errorId = `${idPrefix}-dept-error`;

  return (
    <div className="space-y-5">
      <StepHeading
        id={headingId}
        step={1}
        title="Which department do you need?"
        description="Choose the specialty that matches your concern. You can change it later."
        autoFocus={autoFocus}
      />

      <p className="flex items-start gap-2 rounded-xl border border-alert/20 bg-alert-soft px-3.5 py-2.5 text-sm text-alert-strong">
        <PhoneCall className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Chest pain, stroke signs or heavy bleeding? Don&apos;t book online. Call{' '}
          <a
            href={AMBULANCE_PHONE.href}
            className="font-bold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            {AMBULANCE_PHONE.label}
          </a>{' '}
          now.
        </span>
      </p>

      {departments === null ? (
        <>
          <p className="sr-only" role="status">
            Loading departments
          </p>
          <ChoiceSkeleton count={6} />
        </>
      ) : (
        <div
          role="group"
          aria-labelledby={headingId}
          aria-describedby={error ? errorId : undefined}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {departments.map((dept) => (
            <ChoiceCard key={dept.id} pressed={selectedId === dept.id} onClick={() => onSelect(dept.id)}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 pr-6">
                <span className="block text-sm font-semibold text-foreground">{dept.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground line-clamp-2">
                  {dept.description}
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
