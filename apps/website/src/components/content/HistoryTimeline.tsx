'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Reveal, EASE_OUT_SOFT } from '@/components/motion';

type Chapter = { label: string; title: string; body: string };

/*
 * Every fact below already appears on the About page (hero, stats strip,
 * campus photo caption, leadership bios, accreditations). We have no dated
 * milestones, so chapters are named instead of given invented years.
 */
const CHAPTERS: Chapter[] = [
  {
    label: 'Our foundation',
    title: 'An integrated academic health system',
    body: 'Built around three commitments: healing, innovative scientific discovery, and educating the next generation of healthcare leaders.',
  },
  {
    label: 'Our campus',
    title: '123 Healthcare Boulevard, Medical District',
    body: '450+ licensed inpatient beds, 8 specialized surgical theatres and a rooftop helipad.',
  },
  {
    label: 'Specialist care',
    title: 'Faster stroke and trauma response',
    body: 'Rapid endovascular thrombectomy protocols cut door-to-recanalization times by 35%, and trauma triage averages 4.2 minutes from the door.',
  },
  {
    label: 'Recognized quality',
    title: 'Independently accredited',
    body: 'JCI Gold Seal of Approval, Magnet Recognition for nursing, and the Malcolm Baldrige National Quality Award.',
  },
  {
    label: 'Digital records',
    title: 'HIMSS Stage 7 certified EHR',
    body: 'Fully paperless clinical operations, with a tamper-evident audit log of every access to a patient record.',
  },
  {
    label: 'Today',
    title: '18,000+ surgical procedures a year',
    body: 'Delivered with a 99.4% clinical satisfaction score across our departments.',
  },
];

/**
 * History timeline (pattern C11). Semantically an ordered list, which is also
 * the static fallback. With motion allowed, the axis fills as the list scrolls
 * through the viewport and each marker settles in as it arrives. Under
 * reduced motion the axis is simply drawn in full.
 */
export function HistoryTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <section aria-labelledby="history-heading" className="space-y-10">
      <Reveal className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-100">
          Our Journey
        </span>
        <h2 id="history-heading" className="text-3xl font-extrabold text-slate-900 font-display">
          How ProHealth Has Grown
        </h2>
        <p className="text-sm text-slate-600">
          The milestones behind our campus, our specialist services and our accreditations.
        </p>
      </Reveal>

      <ol ref={listRef} className="relative max-w-4xl mx-auto">
        {/* Axis: a faint track plus the filled part */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[11px] lg:left-[223px] w-0.5 rounded-full bg-slate-200"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : progress }}
          className="absolute top-2 bottom-2 left-[11px] lg:left-[223px] w-0.5 origin-top rounded-full bg-prohealth-primary"
        />

        {CHAPTERS.map((chapter, idx) => (
          <li
            key={chapter.label}
            className="relative grid grid-cols-[24px_minmax(0,1fr)] lg:grid-cols-[180px_24px_minmax(0,1fr)] gap-x-5 lg:gap-x-8 pb-10 last:pb-0"
          >
            <p className="col-start-2 lg:col-start-1 lg:row-start-1 lg:text-right lg:pt-0.5 text-xs font-bold uppercase tracking-wider text-prohealth-primary">
              {chapter.label}
            </p>

            <motion.span
              aria-hidden="true"
              initial={{ scale: 0.6, opacity: 0.4 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
              className="col-start-1 row-start-1 lg:col-start-2 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-prohealth-primary bg-white"
            >
              <span className="h-2 w-2 rounded-full bg-prohealth-primary" />
            </motion.span>

            <Reveal y={12} delay={idx === 0 ? 0 : 0.05} className="col-start-2 lg:col-start-3 lg:row-start-1 mt-1 lg:mt-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug">{chapter.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1.5 max-w-xl">{chapter.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
