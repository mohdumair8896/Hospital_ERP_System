'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Ambulance, CheckCircle2, Stethoscope, ArrowRight } from 'lucide-react';
import { BadgeGroup } from '@/components/base/badges/badge-groups';
import HeroVideoDialog from '@/components/sections/discovery/HeroVideoDialog';
import { HeroAppointmentCard, HeroWaitChip } from '@/components/sections/discovery/HeroAppointmentCard';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Headline words; `accent` marks the single accent word (pattern C41). */
const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: 'Your' },
  { text: 'partner' },
  { text: 'in' },
  { text: 'health' },
  { text: 'and' },
  { text: 'wellness', accent: true },
];

const TRUST_POINTS = ['870+ specialist doctors', 'Instant digital booking', '24/7 Level 1 trauma care'];

/**
 * Staggered entrance via CSS (`motion-safe:animate-fade-up`), so the words
 * start animating on first paint without waiting for hydration, and are
 * simply static under reduced motion.
 */
function stagger(index: number, base = 0): React.CSSProperties {
  return { animationDelay: `${base + index * 60}ms` };
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-prohealth-tint via-prohealth-ice/70 to-white pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12"
    >
      <div className="pointer-events-none absolute right-0 top-0 -mr-32 -mt-32 h-[32rem] w-[32rem] rounded-full bg-blue-100/50 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 xl:gap-16">
          {/* Copy */}
          <div className="space-y-6 lg:col-span-7">
            <BadgeGroup addonText="Verified" color="success" theme="light" align="trailing" size="md">
              All solutions for your health • Level 1 trauma care
            </BadgeGroup>

            <h1 id="hero-title" className="max-w-3xl font-display text-display-lg text-prohealth-heading xl:text-[4.25rem]">
              {HEADLINE.map((word, i) => (
                <React.Fragment key={word.text}>
                  <span
                    className={`inline-block motion-safe:animate-fade-up ${word.accent ? 'text-prohealth-secondary' : ''}`}
                    style={stagger(i)}
                  >
                    {word.text}
                  </span>
                  {i < HEADLINE.length - 1 ? ' ' : null}
                </React.Fragment>
              ))}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-prohealth-body motion-safe:animate-fade-up sm:text-lead" style={stagger(HEADLINE.length)}>
              World-class specialty care, robotic surgery and round-the-clock emergency support, with clear plans and
              people who listen.
            </p>

            {/* CTAs: no entrance animation, so the booking button is there on first paint */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className={`group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-pill bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow-primary before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:rounded-pill before:bg-prohealth-primary-hover before:transition-transform before:duration-400 before:ease-out-soft hover:before:scale-x-100 focus-visible:before:scale-x-100 ${RING}`}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Book an appointment</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-out-soft group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
              <HeroVideoDialog onOpenBooking={onOpenBooking} />
            </div>

            <ul className="grid grid-cols-1 gap-2.5 border-t border-border pt-5 sm:grid-cols-3">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm font-medium text-prohealth-body">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-care" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: clinic photo with real UI floating over it (pattern C42) */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/70 bg-prohealth-ice shadow-lift sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[34rem]">
                <Image
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Bright reception area at the ProHealth outpatient center"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-prohealth-heading/40 via-transparent to-transparent" aria-hidden="true" />
              </div>

              <HeroWaitChip className="absolute right-3 top-3 motion-safe:animate-fade-up sm:right-4 sm:top-4 lg:-right-4 lg:top-8" />
              <div className="relative -mt-16 px-3 motion-safe:animate-fade-up sm:px-6 lg:absolute lg:-left-10 lg:bottom-8 lg:mt-0 lg:px-0" style={stagger(0, 250)}>
                <HeroAppointmentCard />
              </div>
            </div>
          </div>
        </div>

        {/* Quick feature cards (static: the hotline must never wait on an animation) */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-20">
          <FeatureCard
            icon={<Calendar className="h-6 w-6" aria-hidden="true" />}
            iconClass="bg-dept-blue-bg text-dept-blue-fg"
            title="Easy appointment"
            text="Schedule a consultation in under a minute with instant digital confirmation and real-time slot availability."
          >
            <button type="button" onClick={onOpenBooking} className={`${LINK} text-primary`}>
              <span>Book online now</span>
              <ArrowRight className={LINK_ARROW} aria-hidden="true" />
            </button>
          </FeatureCard>

          <FeatureCard
            icon={<Ambulance className="h-6 w-6" aria-hidden="true" />}
            iconClass="bg-alert-soft text-alert"
            title="24/7 emergency service"
            text="Round-the-clock Level 1 trauma care, acute cardiac interventions and a dedicated ambulance dispatch network."
          >
            <a href="tel:876256876" className={`${LINK} text-alert`}>
              <span>Call hotline: 876-256-876</span>
              <ArrowRight className={LINK_ARROW} aria-hidden="true" />
            </a>
          </FeatureCard>

          <FeatureCard
            icon={<Stethoscope className="h-6 w-6" aria-hidden="true" />}
            iconClass="bg-dept-green-bg text-dept-green-fg"
            title="Expert specialists"
            text="Board-certified physicians, clinical researchers and surgeons trained at world-renowned university hospitals."
          >
            <a href="#doctors" className={`${LINK} text-care`}>
              <span>Browse doctor catalog</span>
              <ArrowRight className={LINK_ARROW} aria-hidden="true" />
            </a>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

const LINK = `group/link inline-flex items-center gap-1.5 rounded-md text-sm font-semibold ${RING}`;
const LINK_ARROW = 'h-4 w-4 transition-transform duration-250 ease-out-soft group-hover/link:translate-x-1';

function FeatureCard({
  icon,
  iconClass,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-card border border-border bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-400 ease-out-soft hover:-translate-y-1 hover:shadow-lift">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}>{icon}</div>
      <h2 className="mb-2 font-display text-lg font-bold text-prohealth-heading">{title}</h2>
      <p className="mb-4 text-sm leading-relaxed text-prohealth-body">{text}</p>
      {children}
    </div>
  );
}
