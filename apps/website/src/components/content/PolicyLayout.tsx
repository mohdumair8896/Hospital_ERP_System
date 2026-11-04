import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { PolicyToc } from './PolicyToc';

export type PolicySection = {
  /** Anchor id, also used by the table of contents. */
  id: string;
  /** h2 text, without the number (numbers are added here and in the TOC). */
  title: string;
  content: React.ReactNode;
};

type PolicyLayoutProps = {
  /** Last breadcrumb item. */
  breadcrumb: string;
  badge: string;
  badgeTone?: 'primary' | 'care';
  title: string;
  /** Effective / revised dates line. */
  meta: string;
  /** Optional callout shown above the first section. */
  intro?: React.ReactNode;
  sections: PolicySection[];
};

const BADGE_TONES = {
  primary: 'text-prohealth-primary bg-prohealth-primary/10 border-prohealth-primary/20',
  care: 'text-care bg-care-soft border-care/20',
} as const;

/**
 * Shared server layout for the policy pages: header, then a sticky table of
 * contents (client leaf) beside the numbered h2 sections. Pages still render
 * TopEmergencyBar, Navbar, Footer and EmergencyFAB themselves.
 */
export function PolicyLayout({ breadcrumb, badge, badgeTone = 'primary', title, meta, intro, sections }: PolicyLayoutProps) {
  return (
    <>
      <section className="relative py-14 overflow-hidden bg-gradient-to-br from-prohealth-ice via-prohealth-tint to-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-sm text-prohealth-muted">
              <li>
                <Link
                  href="/"
                  className="rounded hover:text-prohealth-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-prohealth-primary font-semibold">
                {breadcrumb}
              </li>
            </ol>
          </nav>
          <div className="space-y-3">
            <span
              className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${BADGE_TONES[badgeTone]}`}
            >
              {badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-prohealth-heading">{title}</h1>
            <p className="text-sm text-prohealth-body">{meta}</p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <PolicyToc items={sections.map(({ id, title: t }) => ({ id, title: t }))} />

          <div className="min-w-0 max-w-3xl space-y-12 text-sm sm:text-base text-slate-700 leading-relaxed">
            {intro}
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-28 space-y-4"
              >
                <h2
                  id={`${section.id}-heading`}
                  className="text-lg sm:text-xl font-bold text-prohealth-heading font-display leading-snug"
                >
                  <span className="text-prohealth-primary">{idx + 1}.</span> {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
