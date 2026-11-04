import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BedDouble, CalendarPlus, MapPin, Phone, Siren, UserRound } from 'lucide-react';
import type { DepartmentData } from '@/data/hospitalData';
import { themeFor } from '@/components/sections/discovery/departmentThemes';
import { FOCUS_RING } from '../PageHeader';

/** Static department page id -> theme code used by departmentThemes. */
const CODE_BY_STATIC_ID: Record<string, string> = {
  dept_card: 'CARDIOLOGY',
  dept_neuro: 'NEUROLOGY',
  dept_peds: 'PEDIATRICS',
  dept_ortho: 'ORTHOPEDICS',
  dept_emrg: 'EMERGENCY',
  dept_obgyn: 'GYNECOLOGY',
};

/**
 * Booking-wizard department id for a static page id. The wizard loads
 * departments from the API (or its fallback), whose ids differ from the static
 * pages; only ids present in both the API and the fallback are listed, so a
 * "Book" link never lands on an empty doctor step.
 */
const BOOKING_DEPT_ID: Record<string, string> = {
  dept_card: 'dept_card',
  dept_neuro: 'dept_neuro',
  dept_peds: 'dept_ped',
  dept_ortho: 'dept_ortho',
};

export const EMERGENCY_PHONE = '876-256-876';

/**
 * Department card on its pastel tint (pattern C13, CSS only): the card lifts
 * 4px with a soft shadow, the icon badge zooms to 1.04 and an "Explore" chip
 * slides in. Keyboard focus on the card link mirrors all of it, and touch
 * screens show the chip by default. The department name is a stretched link
 * to `/departments/<id>`; the secondary action sits above it.
 */
export function DepartmentCard({ dept, index }: { dept: DepartmentData; index: number }) {
  const theme = themeFor(CODE_BY_STATIC_ID[dept.id] ?? '', dept.name, index);
  const Icon = theme.icon;
  const bookingId = BOOKING_DEPT_ID[dept.id];
  const isEmergency = dept.id === 'dept_emrg';

  return (
    <article
      className={[
        'group relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-soft',
        'transition-[transform,box-shadow,border-color] duration-500 ease-out-soft',
        'hover:border-primary/25 hover:shadow-lift motion-safe:hover:-translate-y-1',
        'has-[a.card-link:focus-visible]:shadow-lift motion-safe:has-[a.card-link:focus-visible]:-translate-y-1',
        'has-[a.card-link:focus-visible]:ring-2 has-[a.card-link:focus-visible]:ring-ring has-[a.card-link:focus-visible]:ring-offset-2',
      ].join(' ')}
    >
      <div className={`relative flex items-start justify-between gap-3 px-6 pb-5 pt-6 ${theme.bg}`}>
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-soft transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.04] motion-safe:group-has-[a.card-link:focus-visible]:scale-[1.04] ${theme.fg}`}
          aria-hidden="true"
        >
          <Icon className="h-7 w-7" />
        </span>
        {dept.emergencySupport && (
          <span className="inline-flex items-center gap-1 rounded-pill bg-background px-2.5 py-1 text-xs font-semibold text-alert shadow-soft">
            <Siren className="h-3.5 w-3.5" aria-hidden="true" />
            Emergency 24/7
          </span>
        )}
        <span
          aria-hidden="true"
          className={[
            'absolute bottom-0 right-6 inline-flex translate-y-1/2 items-center gap-1 rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft',
            'opacity-0 transition-[opacity,transform] duration-400 ease-out-soft',
            'group-hover:opacity-100 group-has-[a.card-link:focus-visible]:opacity-100',
            '[@media(hover:none)]:opacity-100',
          ].join(' ')}
        >
          Explore
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-bold leading-snug text-prohealth-heading transition-colors duration-250 group-hover:text-primary group-has-[a.card-link:focus-visible]:text-primary">
          <Link
            href={`/departments/${dept.id}`}
            className="card-link focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
          >
            {dept.name}
          </Link>
        </h3>
        <p className="flex items-start gap-1.5 text-sm text-prohealth-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {dept.location}
        </p>
        <p className="line-clamp-3 text-sm leading-relaxed text-prohealth-body">{dept.shortDesc}</p>

        <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <dt className="flex items-center gap-1 text-xs text-prohealth-muted">
              <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
              Beds
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-prohealth-heading">{dept.beds}</dd>
          </div>
          <div>
            <dt className="text-xs text-prohealth-muted">Annual cases</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-prohealth-heading">{dept.annualProcedures}</dd>
          </div>
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-xs text-prohealth-muted">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              Lead physician
            </dt>
            <dd className="mt-0.5 font-medium text-prohealth-heading">{dept.leadPhysician}</dd>
          </div>
        </dl>

        {(bookingId || isEmergency) && (
          <div className="relative z-10 pt-1">
            {isEmergency ? (
              <a
                href={`tel:${EMERGENCY_PHONE.replace(/-/g, '')}`}
                className={`inline-flex items-center gap-1.5 rounded-pill bg-alert-soft px-3.5 py-2 text-sm font-semibold text-alert transition-colors duration-250 hover:bg-alert hover:text-white ${FOCUS_RING}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Walk in or call {EMERGENCY_PHONE}
              </a>
            ) : (
              <Link
                href={`/appointments?dept=${bookingId}`}
                className={`inline-flex items-center gap-1.5 rounded-pill border border-border bg-background px-3.5 py-2 text-sm font-semibold text-primary transition-colors duration-250 hover:border-primary/30 hover:bg-secondary ${FOCUS_RING}`}
              >
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                Book a visit
                <span className="sr-only"> in {dept.name}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
