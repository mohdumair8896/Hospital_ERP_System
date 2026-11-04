'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowDown, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_SOFT } from '@/components/motion';
import { BookPreview, FollowUpPreview, PreparePreview, VisitPreview } from './JourneyPreviews';

const STAGES = [
  {
    id: 'book',
    num: '01',
    title: 'Book',
    line: 'Pick a department, a doctor and a time that suits you.',
    checklist: ['In-person or video visit', 'Live clinic slots', 'Booking ID straight away'],
    Preview: BookPreview,
  },
  {
    id: 'prepare',
    num: '02',
    title: 'Prepare',
    line: 'Gather a few things so the visit goes smoothly.',
    checklist: ['Photo ID and insurance card', 'List of current medicines', 'Recent reports or scans'],
    Preview: PreparePreview,
  },
  {
    id: 'visit',
    num: '03',
    title: 'Visit',
    line: 'Check in with your booking ID and we guide you from there.',
    checklist: ['Arrive 15 minutes early', 'Check in at the front desk', 'Video visits: join from your link'],
    Preview: VisitPreview,
  },
  {
    id: 'follow-up',
    num: '04',
    title: 'Follow-up',
    line: 'Results, prescriptions and next steps from your care team.',
    checklist: ['Reports reviewed by your doctor', 'Prescription renewals', 'Follow-up visits when needed'],
    Preview: FollowUpPreview,
  },
] as const;

type Stage = (typeof STAGES)[number];

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-care" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StageDetail({ stage, bookHref }: { stage: Stage; bookHref: string }) {
  const { Preview } = stage;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start">
      <div className="space-y-4">
        <Checklist items={stage.checklist} />
        {stage.id === 'book' ? (
          <a
            href={bookHref}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors duration-250 hover:bg-prohealth-primary-hover',
              FOCUS_RING
            )}
          >
            Start booking <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <Preview />
    </div>
  );
}

/**
 * Visit journey in four stages (pattern C24). From md up, a row of columns
 * where the active one widens on hover, focus or click (framer `layout`, so
 * only transforms animate; skipped under reduced motion) and reveals a
 * checklist plus a mini preview of our UI. Below md it is a Radix Accordion.
 */
export default function AppointmentJourney({ bookHref = '#book-online' }: { bookHref?: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Desktop and tablet: horizontal hover accordion */}
      <div className="hidden h-[440px] gap-3 md:flex lg:h-[380px]">
        {STAGES.map((stage, i) => {
          const isActive = i === active;
          const panelId = `journey-panel-${stage.id}`;
          return (
            <motion.div
              key={stage.id}
              layout
              transition={{ layout: { duration: 0.45, ease: EASE_OUT_SOFT } }}
              style={{ borderRadius: 20 }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                'relative flex min-w-0 flex-col overflow-hidden border p-4 lg:p-6',
                isActive
                  ? 'flex-[3_1_0%] border-primary/20 bg-card shadow-lift'
                  : 'flex-[1_1_0%] border-border bg-muted/60 hover:bg-muted'
              )}
            >
              <motion.h3 layout="position" className="font-display">
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={isActive ? panelId : undefined}
                  onClick={() => setActive(i)}
                  className={cn('flex w-full flex-col items-start gap-1 rounded-lg text-left', FOCUS_RING)}
                >
                  <span className="text-eyebrow uppercase tabular-nums text-primary">Stage {stage.num}</span>
                  <span className="text-lg font-bold text-foreground lg:text-2xl">{stage.title}</span>
                </button>
              </motion.h3>
              <motion.p
                layout="position"
                className={cn(
                  'mt-2 text-sm leading-relaxed text-muted-foreground',
                  !isActive && 'hidden lg:block'
                )}
              >
                {stage.line}
              </motion.p>

              <AnimatePresence initial={false}>
                {isActive ? (
                  <motion.div
                    key="detail"
                    id={panelId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.15, ease: EASE_OUT_SOFT } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="relative z-10 mt-5"
                  >
                    <StageDetail stage={stage} bookHref={bookHref} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {isActive ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/10 to-transparent"
                />
              ) : (
                <motion.span
                  layout="position"
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 right-4 font-display text-7xl font-bold tabular-nums text-primary/10"
                >
                  {stage.num}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: vertical accordion */}
      <Accordion.Root type="single" collapsible defaultValue="book" className="space-y-3 md:hidden">
        {STAGES.map((stage) => (
          <Accordion.Item
            key={stage.id}
            value={stage.id}
            className="overflow-hidden rounded-card border border-border bg-card shadow-soft"
          >
            <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    'group flex w-full items-center gap-4 p-4 text-left',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring'
                  )}
                >
                  <span className="font-display text-2xl font-bold tabular-nums text-primary/40">{stage.num}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold text-foreground">{stage.title}</span>
                    <span className="block text-sm text-muted-foreground">{stage.line}</span>
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-250 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="px-4 pb-5">
                <StageDetail stage={stage} bookHref={bookHref} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
