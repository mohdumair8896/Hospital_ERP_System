'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Reveal, EASE_OUT_SOFT } from '@/components/motion';
import { useDoctors, doctorPhoto } from '@/components/sections/discovery/data';
import { DoctorCard, DoctorCardSkeleton } from '@/components/sections/discovery/DoctorCard';

interface DoctorDirectoryProps {
  onSelectDoctor: (doctorId: string) => void;
}

const ALL = 'ALL';
const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Specialist directory: filter chips whose active pill slides between them
 * (`layoutId`), and a grid that reflows with `AnimatePresence` + `layout`
 * (pattern C13 cards). Under reduced motion only the opacity fades.
 */
export default function DoctorDirectory({ onSelectDoctor }: DoctorDirectoryProps) {
  const { items: doctors, loading } = useDoctors();
  const [filter, setFilter] = useState<string>(ALL);

  const specialties = [ALL, ...Array.from(new Set(doctors.map((d) => d.specialty)))];
  const shown = filter === ALL ? doctors : doctors.filter((d) => d.specialty === filter);
  const extra = doctors.length - 4;

  return (
    <section id="doctors" aria-labelledby="doctors-title" className="bg-prohealth-canvas py-section">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-primary">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            Qualified physicians
          </p>
          <h2 id="doctors-title" className="mt-3 font-display text-display-md text-prohealth-heading">
            Meet our senior medical specialists
          </h2>
          <p className="mt-3 text-base text-prohealth-body">
            Board-certified leaders recognized for clinical precision and compassionate patient outcomes.
          </p>
        </Reveal>

        {/* Specialty filter chips */}
        <div role="group" aria-label="Filter doctors by specialty" className="mt-8 flex flex-wrap justify-center gap-2">
          {loading
            ? Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-10 w-28 rounded-pill bg-white motion-safe:animate-pulse" aria-hidden="true" />
              ))
            : specialties.map((spec) => {
                const active = filter === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(spec)}
                    className={`relative isolate rounded-pill border px-5 py-2.5 text-sm font-semibold transition-colors duration-250 ${
                      active
                        ? 'border-primary text-primary-foreground'
                        : 'border-border bg-white text-prohealth-body hover:bg-secondary hover:text-primary'
                    } ${RING}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="doctor-filter-pill"
                        className="absolute inset-0 -z-10 rounded-pill bg-primary"
                        transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
                        aria-hidden="true"
                      />
                    )}
                    {spec === ALL ? 'All specialists' : spec}
                  </button>
                );
              })}
        </div>

        {/* Team strip */}
        {!loading && doctors.length > 0 && (
          <div className="mx-auto mb-10 mt-8 flex max-w-xl flex-col items-center justify-center gap-4 rounded-card border border-border bg-white/80 p-4 shadow-soft sm:flex-row">
            <AvatarGroup>
              {doctors.slice(0, 4).map((d) => (
                <Avatar key={d.id}>
                  <AvatarImage src={doctorPhoto(d)} alt="" />
                  <AvatarFallback>{d.name.replace(/^Dr\.?\s+/, '').split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
              {extra > 0 && <AvatarGroupCount>+{extra}</AvatarGroupCount>}
            </AvatarGroup>
            <p className="text-center text-sm sm:text-left">
              <span className="block font-semibold text-prohealth-heading">
                {doctors.length} attending specialists in {specialties.length - 1} specialties
              </span>
              <span className="text-prohealth-muted">Verified board certification</span>
            </p>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {loading ? 'Loading doctors' : `Showing ${shown.length} ${shown.length === 1 ? 'doctor' : 'doctors'}`}
        </p>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading doctors">
            {Array.from({ length: 3 }, (_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.ul layout className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((doc) => (
                <motion.li
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
                >
                  <DoctorCard doc={doc} onBook={onSelectDoctor} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}
