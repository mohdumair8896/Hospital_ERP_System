'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, HeartPulse, Stethoscope, Sparkles, Building2 } from 'lucide-react';
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/motion';

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Figures already published elsewhere on the site; final values stay in the DOM. */
const STATS = [
  { value: 45, suffix: '+', label: 'Years of compassionate care' },
  { value: 450, suffix: '+', label: 'Inpatient hospital beds' },
  { value: 18, suffix: 'K+', label: 'Successful surgeries a year' },
  { value: 870, suffix: '+', label: 'Specialist doctors' },
];

const HIGHLIGHTS = [
  { title: '24/7 Level 1 emergency trauma:', text: 'dedicated rapid-triage bays and acute resuscitation protocols.' },
  { title: 'Qualified, board-certified specialists:', text: 'fellows from Harvard, Johns Hopkins and other top academic institutions.' },
  { title: 'Cutting-edge robotic technologies:', text: 'da Vinci Xi surgical system and a robotic catheterization lab.' },
];

/**
 * Only four awards, so they sit in a static grid with a calm hover (pattern
 * C27 calls for a marquee only with 8+ logos). Nothing here moves on its own.
 */
const AWARDS = [
  {
    title: 'Malcolm Baldrige',
    subtitle: 'National Quality Award',
    desc: 'Recognized as a premier benchmark for healthcare operational performance and clinical safety.',
    icon: Award,
    badge: 'Gold tier',
    tone: 'bg-dept-amber-bg text-dept-amber-fg',
  },
  {
    title: 'HIMSS Davies',
    subtitle: 'Stage 7 Digital Health',
    desc: 'Highest global level for digital EHR integration, closed-loop medication and paperless clinical workflows.',
    icon: HeartPulse,
    badge: 'Stage 7',
    tone: 'bg-dept-blue-bg text-dept-blue-fg',
  },
  {
    title: 'Healthgrades Best',
    subtitle: "America's 50 Best Hospitals",
    desc: 'Top 1% in the nation for clinical outcomes in complex surgeries and critical emergency care.',
    icon: Building2,
    badge: 'Top 1%',
    tone: 'bg-dept-rose-bg text-dept-rose-fg',
  },
  {
    title: 'Joint Commission',
    subtitle: 'Gold Seal of Approval',
    desc: 'Accredited for exceeding international standards in patient safety, infection control and clinical governance.',
    icon: ShieldCheck,
    badge: 'Accredited',
    tone: 'bg-dept-green-bg text-dept-green-fg',
  },
];

export default function StatsAndTrust() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-white py-section">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* About split */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 xl:gap-16">
          <Reveal className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-panel border border-border bg-prohealth-ice p-4 sm:p-6">
              <div className="space-y-5 rounded-card bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Stethoscope className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-prohealth-heading">ProHealth clinical faculty</h3>
                    <p className="text-sm text-prohealth-muted">Over 45 years of compassionate healing</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-prohealth-body sm:text-base">
                  Our multidisciplinary departments unite board-certified physicians, trauma surgeons and compassionate
                  nurses. Every patient receives a tailored diagnostic protocol supported by high-definition 3T MRI,
                  hybrid surgery suites and robotic navigation.
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-care text-white">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-prohealth-heading">
                    High-quality medical professionals
                    <span className="block font-normal text-care">Board-certified, peer-reviewed every year</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6 lg:col-span-6">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-pill bg-secondary px-3.5 py-1.5 text-eyebrow uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                About ProHealth
              </p>
              <h2 id="about-title" className="mt-4 font-display text-display-md text-prohealth-heading">
                A team of experienced medical professionals dedicated to top-quality care
              </h2>
              <p className="mt-4 text-base leading-relaxed text-prohealth-body">
                Seeking medical care can feel vulnerable. That is why our care is built around clear communication,
                transparent treatment plans and continuous clinical oversight.
              </p>
            </Reveal>

            <Stagger as="ul" className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <StaggerItem as="li" key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-care" aria-hidden="true" />
                  <p className="text-sm text-prohealth-body sm:text-base">
                    <strong className="font-semibold text-prohealth-heading">{item.title}</strong> {item.text}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            <Link
              href="/about"
              className={`group inline-flex items-center gap-2 rounded-pill bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors duration-250 hover:bg-prohealth-primary-hover ${RING}`}
            >
              <span>Learn more about us</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Count-up stats (pattern C05) */}
        <Stagger as="div" className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-24 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="rounded-card border border-border bg-prohealth-tint p-5 sm:p-6">
              <dl className="flex flex-col-reverse gap-1">
                <dt className="text-sm font-medium text-prohealth-body">{stat.label}</dt>
                <dd>
                  <CountUp value={stat.value} suffix={stat.suffix} className="font-display text-display-md text-primary" />
                </dd>
              </dl>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Awards and accreditation: static grid with hover (fewer than 8 items) */}
        <div className="mt-section">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-primary">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Awards and recognitions
            </p>
            <h2 className="mt-3 font-display text-display-md text-prohealth-heading">
              Excellence benchmarked by global healthcare standards
            </h2>
          </Reveal>

          <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map((a) => {
              const Icon = a.icon;
              return (
                <StaggerItem as="li" key={a.title} className="flex">
                  {/* Hover lives on an inner box: the motion item owns its own transform. */}
                  <div className="group w-full rounded-card border border-border bg-white p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-400 ease-out-soft hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.tone}`}>
                        <Icon className="h-6 w-6 transition-transform duration-400 ease-out-soft group-hover:scale-[1.04]" aria-hidden="true" />
                      </div>
                      <span className="rounded-pill bg-muted px-2.5 py-1 text-xs font-semibold text-prohealth-heading">{a.badge}</span>
                    </div>
                    <h3 className="mb-1 font-display text-base font-bold text-prohealth-heading">{a.title}</h3>
                    <p className="mb-2 text-sm font-semibold text-primary">{a.subtitle}</p>
                    <p className="text-sm leading-relaxed text-prohealth-body">{a.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
