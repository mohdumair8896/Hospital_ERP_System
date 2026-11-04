import React from 'react';
import { Stagger, StaggerItem } from '@/components/motion';
import { AMBULANCE_PHONE, HOSPITAL_PHONE } from './wizardModel';

interface WhatToExpectProps {
  departmentId: string;
  location: string;
  headingId: string;
}

/**
 * "What to expect" as numbered steps (pattern C40): an ordered list with
 * oversized numerals, revealed one after another (opacity only under reduced
 * motion). The numerals are decorative; the <ol> carries the order.
 */
export default function WhatToExpect({ departmentId, location, headingId }: WhatToExpectProps) {
  const emergency = departmentId === 'dept_emrg';
  const steps = [
    emergency
      ? {
          title: 'Come straight in',
          copy: `No appointment is needed for emergencies. Use the ground-floor entrance or call ${AMBULANCE_PHONE.label}.`,
        }
      : {
          title: 'Book your visit',
          copy: `Book online in five short steps or call ${HOSPITAL_PHONE.label}. You get a booking ID straight away.`,
        },
    {
      title: 'Before you arrive',
      copy: 'Bring a photo ID, your insurance card, a list of current medicines and any recent reports or scans.',
    },
    {
      title: 'Your consultation',
      copy: `Check in at ${location}. Your specialist reviews your history, examines you and talks through the options.`,
    },
    {
      title: 'Your care plan',
      copy: 'Tests, treatment and follow-up are planned with you. Results are shared once your doctor has reviewed them.',
    },
  ];

  return (
    <Stagger as="ol" aria-labelledby={headingId} className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
      {steps.map((step, i) => (
        <StaggerItem as="li" key={step.title} className="flex items-start gap-5">
          <span
            aria-hidden="true"
            className="w-14 shrink-0 font-display text-6xl font-bold leading-none tabular-nums text-primary/90 sm:text-7xl"
          >
            {i + 1}
          </span>
          <div className="space-y-1.5 pt-1">
            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
