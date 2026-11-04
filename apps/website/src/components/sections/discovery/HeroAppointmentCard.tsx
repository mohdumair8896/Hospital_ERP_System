'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Clock3, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDoctors, doctorPhoto, findNextOpening, formatWait, dayLabel, type NextOpening } from './data';

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

/**
 * The next open OPD slot (computed client side from the doctors API, or the
 * bundled data when it is down) plus how far away it is. Both come from the
 * published timetable, so the copy says "published schedule", never "live".
 * Returns `[now, opening]`; both are null until mounted to avoid a hydration
 * mismatch from `new Date()`.
 */
function useNextOpening(): { opening: NextOpening | null; now: Date | null; loading: boolean } {
  const { items, loading } = useDoctors();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const opening = now && !loading ? findNextOpening(items, now) : null;
  return { opening, now, loading: loading || !now };
}

/** Booking page with this doctor, their department and the slot time preselected. */
function openingHref(opening: NextOpening) {
  const params = new URLSearchParams({ doc: opening.doctor.id, slot: opening.slot });
  if (opening.doctor.departmentId) params.set('dept', opening.doctor.departmentId);
  return `/appointments?${params.toString()}`;
}

/** Floating "next available appointment" card for the hero (pattern C42). */
export function HeroAppointmentCard({ className = '' }: { className?: string }) {
  const { opening, loading } = useNextOpening();

  return (
    <div
      className={`w-full max-w-[20rem] rounded-card border border-border bg-white/95 p-4 shadow-lift backdrop-blur-md ${className}`}
      aria-busy={loading}
    >
      <p className="flex items-center gap-1.5 text-eyebrow uppercase text-care">
        <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Next available appointment
      </p>

      {loading ? (
        <div className="mt-3 space-y-2.5" aria-hidden="true">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted motion-safe:animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-3/4 rounded bg-muted motion-safe:animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
            </div>
          </div>
          <div className="h-9 rounded-pill bg-muted motion-safe:animate-pulse" />
        </div>
      ) : opening ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <Avatar size="md">
              <AvatarImage src={doctorPhoto(opening.doctor)} alt="" />
              <AvatarFallback>{initials(opening.doctor.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-prohealth-heading">{opening.doctor.name}</p>
              <p className="truncate text-sm text-prohealth-muted">{opening.doctor.specialty}</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-primary">
            <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {dayLabel(opening)}, {opening.slot}
            </span>
          </p>
          <Link
            href={openingHref(opening)}
            className={`group mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-250 hover:bg-prohealth-primary-hover ${RING}`}
          >
            Book with {opening.doctor.name.replace(/,.*$/, '')}
            <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-out-soft group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <p className="mt-2 text-xs text-prohealth-muted">
            From the published OPD timetable. You confirm the date and availability when booking.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-prohealth-body">
          No open OPD slots in the next 7 days. Call the front desk to be waitlisted.
        </p>
      )}
    </div>
  );
}

/** Small chip: how long until that next published slot. */
export function HeroWaitChip({ className = '' }: { className?: string }) {
  const { opening, now, loading } = useNextOpening();
  const wait = opening && now ? formatWait(now, opening.at) : null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-pill border border-border bg-white/95 py-2 pl-2 pr-4 shadow-soft backdrop-blur-md ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-care-soft text-care">
        <Clock3 className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-xs text-prohealth-muted">Next OPD opening</span>
        {loading ? (
          <span className="mt-1 block h-3.5 w-20 rounded bg-muted motion-safe:animate-pulse" aria-hidden="true" />
        ) : (
          <span className="block text-sm font-semibold text-prohealth-heading">
            {opening ? (wait ?? `${dayLabel(opening)}, ${opening.slot}`) : 'Call to book'}
          </span>
        )}
      </span>
    </div>
  );
}
