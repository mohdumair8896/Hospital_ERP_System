import React from 'react';
import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export const LISTING_CONTAINER = 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20';
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export type Crumb = { label: string; href?: string };

export type PageHeaderProps = {
  /** Trail after "Home". The last item is the current page (no link). */
  breadcrumb: Crumb[];
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  intro: React.ReactNode;
  /** Optional slot beside the text on large screens (stats, a note) and below it on small ones. */
  aside?: React.ReactNode;
  /** Optional row of buttons or links under the intro. */
  actions?: React.ReactNode;
  /** id for the h1, so the page section can reference it. */
  titleId?: string;
};

/** Staggered CSS entrance with Reveal's timing (450ms, ease-out-soft, rise). */
const enter = (delayMs: number) => ({
  className: 'motion-safe:animate-fade-up',
  style: { animationDelay: `${delayMs}ms` } as React.CSSProperties,
});

/**
 * Shared header for the listing pages (/blog, /doctors, /departments,
 * /timetable): breadcrumb, eyebrow pill, display title, lead intro and an
 * optional actions row or aside slot, on a calm tint-to-background gradient.
 *
 * Server component. The entrance is a CSS fade-up with the same timing as
 * `Reveal`, not `Reveal` itself: Reveal ships opacity 0 until hydration, and
 * this is above-the-fold text that must show on first paint. Under reduced
 * motion there is no animation at all (`motion-safe:`).
 */
export function PageHeader({
  breadcrumb,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  intro,
  aside,
  actions,
  titleId,
}: PageHeaderProps) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...breadcrumb];

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-prohealth-tint via-prohealth-tint/50 to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-prohealth-ice/80 blur-3xl"
      />
      <div className={`${LISTING_CONTAINER} relative py-10 sm:py-14 lg:py-16`}>
        <nav aria-label="Breadcrumb" {...enter(0)}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-prohealth-muted">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  {last || !crumb.href ? (
                    <span aria-current={last ? 'page' : undefined} className="font-semibold text-prohealth-heading">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className={`rounded-sm transition-colors duration-250 hover:text-primary ${FOCUS_RING}`}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div
          className={
            aside
              ? 'mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]'
              : 'mt-6'
          }
        >
          <div className="max-w-3xl">
            <p
              className={`inline-flex items-center gap-1.5 rounded-pill border border-primary/15 bg-background/80 px-3 py-1.5 text-eyebrow uppercase text-primary shadow-soft ${enter(60).className}`}
              style={enter(60).style}
            >
              {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5" aria-hidden="true" />}
              {eyebrow}
            </p>
            <h1
              id={titleId}
              className={`mt-4 text-balance font-display text-display-lg text-prohealth-heading ${enter(120).className}`}
              style={enter(120).style}
            >
              {title}
            </h1>
            <p
              className={`mt-4 max-w-2xl text-base text-prohealth-body sm:text-lead ${enter(180).className}`}
              style={enter(180).style}
            >
              {intro}
            </p>
            {actions && (
              <div className={`mt-7 flex flex-wrap items-center gap-3 ${enter(240).className}`} style={enter(240).style}>
                {actions}
              </div>
            )}
          </div>

          {aside && (
            <div className={enter(260).className} style={enter(260).style}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Primary and secondary link buttons for the header actions slot. */
export function HeaderAction({
  href,
  children,
  variant = 'primary',
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'alert';
  icon?: LucideIcon;
}) {
  const tone = {
    primary: 'bg-primary text-primary-foreground shadow-soft hover:bg-prohealth-primary-hover',
    secondary: 'border border-border bg-background text-prohealth-heading hover:border-primary/30 hover:text-primary',
    alert: 'border border-alert/20 bg-alert-soft text-alert hover:bg-alert hover:text-white',
  }[variant];
  const className = `inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors duration-250 ${tone} ${FOCUS_RING}`;
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </>
  );
  return href.startsWith('tel:') ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
