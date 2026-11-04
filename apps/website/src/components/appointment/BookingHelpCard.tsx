import React from 'react';
import Link from 'next/link';
import { Ambulance, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { AMBULANCE_PHONE, HOSPITAL_PHONE } from './wizardModel';

const LINK_CLASS =
  'inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Side card for the booking page (pattern C38): three help tiles (call,
 * location, hours) and the ambulance line. Static, so it shows on first paint.
 */
export default function BookingHelpCard() {
  return (
    <div className="space-y-4">
      <div className="rounded-panel border border-border bg-card p-5 shadow-soft sm:p-6">
        <p className="text-eyebrow uppercase text-muted-foreground">Need a hand?</p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">Prefer to book with a person?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Our front desk can book, move or cancel a visit for you.
        </p>

        <ul className="mt-5 space-y-3">
          <li className="flex gap-3 rounded-card bg-muted/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dept-blue-bg text-dept-blue-fg">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-sm font-semibold text-foreground">Call the booking desk</h3>
              <a href={HOSPITAL_PHONE.href} className={LINK_CLASS}>
                {HOSPITAL_PHONE.label}
              </a>
              <p className="text-[13px] text-muted-foreground">Open during outpatient hours.</p>
            </div>
          </li>

          <li className="flex gap-3 rounded-card bg-muted/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dept-green-bg text-dept-green-fg">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-sm font-semibold text-foreground">Visit us</h3>
              <p className="text-sm text-foreground">123 Medical Boulevard, New York, NY 10016</p>
              <Link href="/contact" className={LINK_CLASS}>
                Directions and parking <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </li>

          <li className="flex gap-3 rounded-card bg-muted/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dept-amber-bg text-dept-amber-fg">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">Outpatient hours</h3>
              <dl className="mt-1 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Mon – Fri</dt>
                  <dd className="font-medium tabular-nums text-foreground">8:00 AM – 8:00 PM</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Sat – Sun</dt>
                  <dd className="font-medium tabular-nums text-foreground">9:00 AM – 5:00 PM</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Emergency</dt>
                  <dd className="font-semibold text-care">Open 24/7</dd>
                </div>
              </dl>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-alert/20 bg-alert-soft p-4">
        <Ambulance className="mt-0.5 h-5 w-5 shrink-0 text-alert" aria-hidden="true" />
        <p className="text-sm text-alert-strong">
          <span className="font-semibold">Is it an emergency?</span> Don&apos;t wait for an appointment. Call{' '}
          <a
            href={AMBULANCE_PHONE.href}
            className="rounded-sm font-bold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {AMBULANCE_PHONE.label}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
