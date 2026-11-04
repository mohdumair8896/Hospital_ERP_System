'use client';

import React, { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronDown, Sparkles, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal, EASE_OUT_SOFT } from '@/components/motion';

type Review = {
  name: string;
  location: string;
  treatment: string;
  headline: string;
  comment: string;
  rating: number;
  recoveryDays: string;
  avatarInitials: string;
};

const REVIEWS: Review[] = [
  {
    name: 'Paulo Hubert',
    location: 'New York, NY',
    treatment: 'Interventional Cardiology',
    headline: 'Exceptional cardiac care that gave me my life back',
    comment:
      'I recently had to visit ProHealth for cardiac evaluation and catheterization. Dr. Sarah Patel and the intensive care nursing team were extraordinarily thorough, compassionate, and attentive. The procedure was explained in calm detail, and my recovery timeline was halved thanks to their robotic guidance protocol.',
    rating: 5,
    recoveryDays: 'Recovered in 14 days',
    avatarInitials: 'PH',
  },
  {
    name: 'Laurence Vendetta',
    location: 'San Francisco, CA',
    treatment: 'Pediatric Care & Allergy Clinic',
    headline: 'Gentle, comforting doctors who truly care for children',
    comment:
      'I brought my 5-year-old son to ProHealth for severe acute allergy and respiratory care. Dr. Michael Chang was fantastic with him, using games and warm communication to calm his anxiety. The pediatric floor is bright, comforting, and sparkling clean. I wouldn’t trust anyone else with my family.',
    rating: 5,
    recoveryDays: 'Same-day stabilization',
    avatarInitials: 'LV',
  },
  {
    name: 'Cassandra Raul',
    location: 'Miami, FL',
    treatment: 'Neurology Consultation & Spine Health',
    headline: 'Flawless digital coordination and world-class neurology',
    comment:
      'From the seamless digital appointment booking to meeting Dr. Elena Rostova, the experience exceeded every standard. My MRI imaging was reviewed within hours, and the non-surgical spinal decompression therapy resolved a 2-year struggle with chronic nerve pain. Truly world-class medicine.',
    rating: 5,
    recoveryDays: 'Back to work in 3 weeks',
    avatarInitials: 'CR',
  },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Width/height changes are animated by framer `layout` (transform only). */
const LAYOUT_TRANSITION = { duration: 0.45, ease: EASE_OUT_SOFT };

const NAV_KEYS = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];

/**
 * Patient stories as an expanding-card carousel (pattern C21).
 *
 * Desktop: one wide card (quote, person, outcome facts) beside narrow tiles.
 * Mobile: the same items stack as a vertical accordion. One story is always
 * open; each tile is a real button with `aria-expanded`. No autoplay.
 * Arrow keys / Home / End move focus between the tiles.
 */
export default function PatientReviews() {
  const [activeIdx, setActiveIdx] = useState(0);
  const baseId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!NAV_KEYS.includes(e.key)) return;
    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-review-trigger]') ?? [],
    );
    const current = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    e.preventDefault();
    const last = triggers.length - 1;
    let next = current;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current === last ? 0 : current + 1;
    else next = current === 0 ? last : current - 1;
    triggers[next]?.focus();
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <Reveal className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <p className="inline-flex items-center gap-1.5 text-prohealth-primary text-eyebrow uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Patient testimonials</span>
          </p>
          <h2 id="reviews-heading" className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
            Trusted by Thousands of Recovered Patients
          </h2>
          <p className="text-sm sm:text-base text-prohealth-body mt-3">
            Real stories, clinical outcomes, and verified healing experiences from ProHealth Medical Centers.
          </p>
        </Reveal>

        <Reveal y={12}>
          <ul
            ref={listRef}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:min-h-[460px]"
          >
            {REVIEWS.map((r, idx) => {
              const isActive = idx === activeIdx;
              const triggerId = `${baseId}-trigger-${idx}`;
              const panelId = `${baseId}-panel-${idx}`;

              return (
                <motion.li
                  key={r.name}
                  layout
                  transition={LAYOUT_TRANSITION}
                  style={{ borderRadius: 24 }}
                  className={cn(
                    'relative overflow-hidden border',
                    isActive
                      ? 'lg:flex-1 border-prohealth-secondary/30 bg-gradient-to-br from-prohealth-tint via-white to-white shadow-lift'
                      : 'lg:w-32 lg:flex-none border-prohealth-border bg-white hover:bg-muted transition-colors',
                  )}
                >
                  {isActive && (
                    <Quote
                      className="hidden sm:block absolute top-6 right-6 w-20 h-20 text-prohealth-secondary/10 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  <h3 className="relative">
                    <button
                      id={triggerId}
                      type="button"
                      data-review-trigger
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      aria-disabled={isActive || undefined}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        'flex w-full items-center gap-4 p-5 text-left rounded-3xl',
                        FOCUS_RING,
                        isActive
                          ? 'cursor-default sm:px-8 sm:pt-8 lg:px-10 lg:pt-10'
                          : 'lg:h-full lg:flex-col lg:justify-start lg:gap-6 lg:px-3 lg:py-8',
                      )}
                    >
                      <motion.span
                        layout="position"
                        transition={LAYOUT_TRANSITION}
                        aria-hidden="true"
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors',
                          isActive ? 'bg-prohealth-primary text-white shadow-md' : 'bg-prohealth-ice text-prohealth-primary',
                        )}
                      >
                        {r.avatarInitials}
                      </motion.span>
                      <motion.span
                        layout="position"
                        transition={LAYOUT_TRANSITION}
                        className={cn(
                          'min-w-0 flex-1',
                          !isActive && 'lg:flex-none lg:whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180',
                        )}
                      >
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base font-bold text-prohealth-heading">
                          <span className="whitespace-nowrap">{r.name}</span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-full bg-care-soft text-care border border-care/20">
                              <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                              Verified patient
                            </span>
                          )}
                        </span>
                        <span className={cn('block text-xs sm:text-sm text-prohealth-muted', isActive ? '' : 'truncate lg:overflow-visible')}>
                          {r.treatment}
                          {isActive && <span className="hidden sm:inline"> · {r.location}</span>}
                        </span>
                      </motion.span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'lg:hidden w-5 h-5 shrink-0 text-prohealth-primary motion-safe:transition-transform motion-safe:duration-250',
                          isActive && 'rotate-180',
                        )}
                      />
                    </button>
                  </h3>

                  <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!isActive}>
                    {isActive && (
                      <motion.figure
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ opacity: { duration: 0.35, delay: 0.15, ease: EASE_OUT_SOFT }, layout: LAYOUT_TRANSITION }}
                        className="relative px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 space-y-5"
                      >
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400" aria-hidden="true" />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-2">
                            {r.rating}.0 / 5.0 Clinical Review
                          </span>
                        </div>

                        <blockquote className="space-y-3 max-w-3xl">
                          <p className="text-xl sm:text-2xl font-extrabold text-prohealth-heading font-display leading-snug">
                            &ldquo;{r.headline}&rdquo;
                          </p>
                          <p className="text-sm sm:text-base text-prohealth-body leading-relaxed">{r.comment}</p>
                        </blockquote>

                        <figcaption className="sr-only">
                          {r.name}, {r.location}
                        </figcaption>

                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/80">
                          <OutcomeFact label="Care received" value={r.treatment} />
                          <OutcomeFact label="Outcome" value={r.recoveryDays} />
                          <OutcomeFact label="Patient from" value={r.location} />
                        </dl>
                      </motion.figure>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function OutcomeFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 border border-slate-200/80 px-4 py-3">
      <dt className="text-xs font-semibold text-prohealth-muted">{label}</dt>
      <dd className="text-sm font-bold text-prohealth-primary mt-0.5">{value}</dd>
    </div>
  );
}
