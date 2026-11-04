import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface DepartmentServiceStackProps {
  services: string[];
  location: string;
  headingId: string;
}

/**
 * Stacked service cards (pattern C04). From lg up each card is CSS `sticky`
 * with a slightly larger `top`, so the next card slides over the previous one
 * and the pile shows progress. Each card is a deeper shade of the brand blue.
 * Below lg, and under reduced motion, it is a plain stacked list.
 */
export default function DepartmentServiceStack({ services, location, headingId }: DepartmentServiceStackProps) {
  const total = String(services.length).padStart(2, '0');

  return (
    <ol aria-labelledby={headingId} className="space-y-4 lg:space-y-6">
      {services.map((service, i) => (
        <li
          key={service}
          className="lg:sticky motion-reduce:lg:static"
          style={{ top: `calc(6.5rem + ${i * 1.25}rem)` }}
        >
          <article
            className="flex min-h-[10.5rem] flex-col justify-between gap-6 rounded-panel border border-border p-6 shadow-soft sm:p-8"
            // Opaque tint, so the card underneath never shows through the pile.
            style={{ backgroundColor: `color-mix(in srgb, hsl(var(--primary)) ${3 + i * 3}%, white)` }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-display text-sm font-semibold tabular-nums text-primary">
                {String(i + 1).padStart(2, '0')} <span className="text-muted-foreground">/ {total}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-care/20 bg-care-soft px-2.5 py-1 text-xs font-semibold text-care">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Certified care path
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">{service}</h3>
              <p className="text-sm text-muted-foreground">
                Offered at {location}. Your specialist will explain at your first consultation whether it suits you.
              </p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
