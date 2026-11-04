import React from 'react';
import Link from 'next/link';
import { Ambulance, ArrowRight, CalendarClock, Clock, Mail, MapPin, Phone } from 'lucide-react';

const RING =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

/**
 * Slim contact bar above the navbar. Always one row:
 * - every width: hotline and the ambulance number (urgent, never hidden)
 * - md+: the OPD timetable link
 * - lg+: email and the "Emergency care 24/7" note
 * - xl+: street address (truncates rather than wrapping)
 *
 * The ambulance pulse is a small decorative dot behind `motion-safe:`, so the
 * number itself never fades.
 */
export default function TopEmergencyBar() {
  return (
    <div className="border-b border-prohealth-primary-hover bg-primary text-xs text-primary-foreground">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-10 items-center justify-between gap-3 sm:gap-4">
          <ul className="flex min-w-0 items-center gap-x-5 whitespace-nowrap">
            <li className="flex shrink-0 items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary-foreground/70" aria-hidden="true" />
              <span className="hidden text-primary-foreground/80 sm:inline">Hotline</span>
              <a href="tel:1234567890" className={`font-semibold hover:underline ${RING}`}>
                <span className="sr-only sm:hidden">Hotline </span>
                123-456-7890
              </a>
            </li>
            <li className="hidden shrink-0 items-center gap-1.5 lg:flex">
              <Mail className="h-3.5 w-3.5 text-primary-foreground/70" aria-hidden="true" />
              <a href="mailto:care@prohealth.hospital" className={`hover:underline ${RING}`}>
                care@prohealth.hospital
              </a>
            </li>
            <li className="hidden shrink-0 items-center gap-1.5 text-primary-foreground/80 lg:flex">
              <Clock className="h-3.5 w-3.5 text-primary-foreground/70" aria-hidden="true" />
              Emergency care 24/7
            </li>
            <li className="hidden min-w-0 items-center gap-1.5 text-primary-foreground/80 xl:flex">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-foreground/70" aria-hidden="true" />
              <span className="truncate">123 Medical Boulevard, New York, NY 10016</span>
            </li>
          </ul>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="tel:876256876"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill bg-alert px-2.5 py-1 sm:px-3 font-semibold text-white shadow-soft transition-colors duration-250 hover:bg-alert-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-white/70 motion-safe:animate-pulse" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <Ambulance className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" />
              <span>
                Ambulance<span className="hidden sm:inline">:</span> 876-256-876
              </span>
            </a>

            <Link
              href="/timetable"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-pill border border-white/25 bg-white/10 px-3 py-1 font-medium transition-colors duration-250 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:inline-flex"
            >
              <CalendarClock className="h-3.5 w-3.5 text-primary-foreground/70" aria-hidden="true" />
              OPD timetable
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
