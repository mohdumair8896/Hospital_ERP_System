import React from 'react';
import Link from 'next/link';
import { CalendarCheck, Mail, Phone } from 'lucide-react';
import type { DoctorData } from '@/data/hospitalData';

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Link into the booking wizard; `doc` and `slot` are the params /appointments reads. */
export function bookingHref(doctorId: string, slot?: string) {
  const params = new URLSearchParams({ doc: doctorId });
  if (slot) params.set('slot', slot);
  return `/appointments?${params.toString()}`;
}

/**
 * Booking card for a doctor profile (pattern C38): clinic days, usual times
 * and a "Book with" CTA. Server-rendered and static, so it is visible on first
 * paint. The parent makes it sticky beside the bio on large screens.
 */
export default function DoctorBookingCard({ doc }: { doc: DoctorData }) {
  const headingId = `book-${doc.id}-heading`;

  return (
    <div className="space-y-4">
      <section aria-labelledby={headingId} className="overflow-hidden rounded-panel border border-border bg-card shadow-lift">
        <div className="bg-primary p-6 text-primary-foreground">
          <p className="text-eyebrow uppercase text-sky-100">Book a consultation</p>
          <h2 id={headingId} className="mt-2 font-display text-xl font-bold">
            See {doc.name}
          </h2>
          <p className="mt-1 text-sm text-sky-100">
            {doc.specialty} · Consultation fee ${doc.consultationFee}
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Clinic days</h3>
            <ul className="mt-2 grid grid-cols-7 gap-1">
              {WEEK.map((day) => {
                const open = doc.availableDays.includes(day);
                return (
                  <li
                    key={day}
                    className={
                      open
                        ? 'rounded-lg bg-dept-blue-bg py-1.5 text-center text-xs font-semibold text-dept-blue-fg'
                        : 'rounded-lg py-1.5 text-center text-xs text-muted-foreground line-through decoration-slate-300'
                    }
                  >
                    <abbr title={day} className="no-underline">
                      {day.slice(0, 3)}
                    </abbr>
                    <span className="sr-only">{open ? ', clinic day' : ', no clinic'}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Usual appointment times</h3>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {doc.availableSlots.map((slot) => (
                <li key={slot}>
                  <Link
                    href={bookingHref(doc.id, slot)}
                    aria-label={`Book ${slot} with ${doc.name}`}
                    className={`block rounded-xl border border-border py-2.5 text-center text-sm font-medium tabular-nums text-foreground transition-colors duration-250 hover:border-primary/40 hover:bg-dept-blue-bg ${FOCUS_RING}`}
                  >
                    {slot}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] text-muted-foreground">You pick the date in the next step.</p>
          </div>

          <Link
            href={bookingHref(doc.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors duration-250 hover:bg-prohealth-primary-hover ${FOCUS_RING}`}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book with {doc.name}
          </Link>
        </div>
      </section>

      <section aria-label="Contact the clinic office" className="space-y-3 rounded-card border border-border bg-muted/50 p-5 text-sm">
        <h3 className="font-semibold text-foreground">Clinic office</h3>
        <a href={`tel:${doc.phone}`} className={`flex items-center gap-2 rounded-sm text-foreground hover:text-primary ${FOCUS_RING}`}>
          <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
          {doc.phone}
        </a>
        <a href={`mailto:${doc.email}`} className={`flex items-center gap-2 break-all rounded-sm text-foreground hover:text-primary ${FOCUS_RING}`}>
          <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {doc.email}
        </a>
      </section>
    </div>
  );
}
