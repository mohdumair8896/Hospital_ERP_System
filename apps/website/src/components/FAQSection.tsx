'use client';

import React from 'react';
import Link from 'next/link';
import * as Accordion from '@radix-ui/react-accordion';
import { HelpCircle, Headset, Phone, Mail, Ambulance, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion';

type Faq = { q: string; a: string };
type FaqGroup = { id: string; topic: string; summary: string; items: Faq[] };

/** The existing six questions, grouped by topic (pattern C25). */
const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'visits',
    topic: 'Appointments & visits',
    summary: 'Booking, preparing and rescheduling',
    items: [
      {
        q: 'How do I book an in-person or telehealth appointment with a ProHealth specialist?',
        a: 'You can book an appointment directly through our online scheduling portal in under 60 seconds, or by calling our appointments desk at 123-456-7890. Choose your preferred department, specialist physician, date, and convenient time slot. You will receive an immediate SMS and email booking confirmation with check-in instructions.',
      },
      {
        q: 'What should I bring with me to my first outpatient appointment?',
        a: 'Please bring a valid government-issued photo ID (Driver’s License or Passport), your active insurance card, any previous medical records or diagnostic imaging CDs (X-ray, MRI, CT), and a comprehensive list of current prescribed medications and dosages.',
      },
      {
        q: 'Can I cancel or reschedule my scheduled consultation?',
        a: 'Yes. Appointments can be rescheduled or cancelled online up to 24 hours prior to your scheduled time slot with zero cancellation fees. For cancellations made within 24 hours of scheduled clinic times, please contact our appointments desk directly.',
      },
    ],
  },
  {
    id: 'billing',
    topic: 'Billing & insurance',
    summary: 'Insurers, self-pay and payment plans',
    items: [
      {
        q: 'What health insurance and payment options are accepted at ProHealth?',
        a: 'ProHealth participates with all major national and regional commercial insurance providers, including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and Medicaid. For uninsured or self-pay patients, transparent fixed-fee consultation pricing and zero-interest clinical installment plans are available.',
      },
    ],
  },
  {
    id: 'emergency',
    topic: 'Emergency care',
    summary: 'When to use the Emergency Department',
    items: [
      {
        q: 'What is the difference between regular outpatient clinics and the Emergency Department?',
        a: 'Outpatient (OPD) clinics operate Monday through Saturday from 8:00 AM to 8:00 PM for scheduled consultations, preventive screenings, and routine follow-ups. Our Emergency & Trauma Center operates 24/7/365 with Level-1 acute resuscitation suites, cardiologists on standby, and immediate ambulance dispatch.',
      },
    ],
  },
  {
    id: 'records',
    topic: 'Records & privacy',
    summary: 'How your health data is protected',
    items: [
      {
        q: 'How does ProHealth protect my medical records and test results?',
        a: 'ProHealth employs enterprise clinical security and encrypted data protection. Every access to your Electronic Protected Health Information (ePHI) is logged into an immutable database audit engine secured with SHA-256 cryptographic verification in compliance with HIPAA § 164.312(b).',
      },
    ],
  },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Plus sign whose vertical bar turns flat when the row opens, leaving a minus. */
function PlusMinusIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-prohealth-ice text-prohealth-primary transition-colors group-data-[state=open]:bg-prohealth-primary group-data-[state=open]:text-white"
    >
      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
      <span className="absolute h-3.5 w-0.5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-250 motion-safe:ease-out-soft group-data-[state=open]:rotate-90" />
    </span>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-24 bg-prohealth-canvas">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <Reveal className="max-w-3xl mb-12 lg:mb-16">
          <p className="inline-flex items-center gap-1.5 text-prohealth-primary text-eyebrow uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Frequently asked questions</span>
          </p>
          <h2 id="faq-heading" className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
            Answers to Help You Navigate Your Care
          </h2>
          <p className="text-sm sm:text-base text-prohealth-body mt-3">
            Find immediate answers regarding scheduling, patient registration, insurance billing, and clinic operations.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 xl:gap-14 items-start">
          <Accordion.Root type="single" collapsible defaultValue="visits-0" className="border-b border-prohealth-border">
            {FAQ_GROUPS.map((group) => (
              <div
                key={group.id}
                className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-x-8 gap-y-3 border-t border-prohealth-border py-6 md:py-8"
              >
                <div>
                  <h3 id={`faq-topic-${group.id}`} className="text-base font-bold text-prohealth-heading font-display">
                    {group.topic}
                  </h3>
                  <p className="text-sm text-prohealth-muted mt-1">{group.summary}</p>
                </div>

                <div role="group" aria-labelledby={`faq-topic-${group.id}`} className="divide-y divide-prohealth-border/80">
                  {group.items.map((faq, idx) => (
                    <Accordion.Item key={faq.q} value={`${group.id}-${idx}`} className="first:-mt-3">
                      <Accordion.Header asChild>
                        <h4>
                          <Accordion.Trigger
                            className={cn(
                              'group flex w-[calc(100%+1.5rem)] items-center justify-between gap-4 rounded-xl px-3 py-4 -mx-3 text-left transition-colors hover:bg-white',
                              FOCUS_RING,
                            )}
                          >
                            <span className="text-sm sm:text-base font-semibold text-prohealth-heading group-data-[state=open]:text-prohealth-primary">
                              {faq.q}
                            </span>
                            <PlusMinusIcon />
                          </Accordion.Trigger>
                        </h4>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden motion-safe:data-[state=open]:animate-accordion-down motion-safe:data-[state=closed]:animate-accordion-up">
                        <p className="pb-5 pr-12 text-sm text-prohealth-body leading-relaxed">{faq.a}</p>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </div>
              </div>
            ))}
          </Accordion.Root>

          <HelpDeskCard />
        </div>
      </div>
    </section>
  );
}

/** "Talk to our help desk" card, using the contact details already on the site. */
function HelpDeskCard() {
  return (
    <aside
      aria-labelledby="faq-helpdesk-heading"
      className="lg:sticky lg:top-28 rounded-card bg-white border border-prohealth-border shadow-soft p-6 sm:p-7 space-y-5"
    >
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-full bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
          <Headset className="w-6 h-6" aria-hidden="true" />
        </span>
        <div>
          <h3 id="faq-helpdesk-heading" className="text-base font-bold text-prohealth-heading font-display">
            Talk to our help desk
          </h3>
          <p className="text-sm text-prohealth-muted">Didn’t find your answer? We can help.</p>
        </div>
      </div>

      <ul className="space-y-2">
        <li>
          <a
            href="tel:1234567890"
            className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 hover:bg-muted transition-colors', FOCUS_RING)}
          >
            <Phone className="w-4 h-4 text-prohealth-primary shrink-0" aria-hidden="true" />
            <span className="text-sm">
              <span className="block text-prohealth-muted">Appointments desk</span>
              <span className="font-bold text-prohealth-heading">123-456-7890</span>
            </span>
          </a>
        </li>
        <li>
          <a
            href="mailto:care@prohealth.hospital"
            className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 hover:bg-muted transition-colors', FOCUS_RING)}
          >
            <Mail className="w-4 h-4 text-prohealth-primary shrink-0" aria-hidden="true" />
            <span className="text-sm min-w-0">
              <span className="block text-prohealth-muted">Patient relations</span>
              <span className="font-bold text-prohealth-heading break-all">care@prohealth.hospital</span>
            </span>
          </a>
        </li>
      </ul>

      <Link
        href="/contact"
        className={cn(
          'flex items-center justify-center gap-2 w-full rounded-pill bg-prohealth-primary hover:bg-prohealth-primary-hover text-white text-sm font-bold py-3 px-5 transition-colors',
          FOCUS_RING,
        )}
      >
        <span>Contact &amp; directions</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>

      <p className="flex items-start gap-2 rounded-xl bg-alert-soft border border-alert/15 p-3 text-sm text-alert">
        <Ambulance className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          In an emergency, call{' '}
          <a href="tel:876256876" className={cn('font-bold underline underline-offset-2 rounded whitespace-nowrap', FOCUS_RING)}>
            876-256-876
          </a>
          .
        </span>
      </p>
    </aside>
  );
}
