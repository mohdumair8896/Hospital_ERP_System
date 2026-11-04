'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { UserSearch } from 'lucide-react';
import type { Doctor } from '@hospital/contracts';
import { EASE_OUT_SOFT } from '@/components/motion';
import { useDoctors } from '@/components/sections/discovery/data';
import { DoctorCard, DoctorCardSkeleton } from '@/components/sections/discovery/DoctorCard';
import { bookingHref } from '@/components/appointment/DoctorBookingCard';
import { EmptyState, FilterChips, ResetButton, SearchField, focusActiveChip, focusLater, type ChipOption } from '../FilterChips';

const ALL = 'ALL';

function matches(doc: Doctor, q: string) {
  if (!q) return true;
  const haystack = [doc.name, doc.specialty, doc.qualification, doc.bio].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/**
 * Doctor directory for /doctors: search (name, specialty, qualification or
 * bio) plus specialty chips with a sliding active pill, a live result count,
 * skeleton cards while the list loads and an empty state with resets.
 *
 * Cards are the shared C13 `DoctorCard`, which links a profile only when a
 * static `/doctors/[id]` page exists for that doctor. "Book" opens the booking
 * wizard with the doctor preselected.
 */
export function DoctorsExplorer() {
  const router = useRouter();
  const { items: doctors, loading } = useDoctors();
  const [specialty, setSpecialty] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const q = query.trim();

  const options: ChipOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    doctors.forEach((d) => counts.set(d.specialty, (counts.get(d.specialty) ?? 0) + 1));
    return [
      { value: ALL, label: 'All specialties', count: doctors.length },
      ...Array.from(counts, ([value, count]) => ({ value, label: value, count })),
    ];
  }, [doctors]);

  const shown = doctors.filter((d) => (specialty === ALL || d.specialty === specialty) && matches(d, q));
  const scope = [specialty !== ALL && `matching ${specialty}`, q && `for “${q}”`].filter(Boolean).join(' ');

  return (
    <div>
      <div className="space-y-5">
        {loading ? (
          <div className="flex flex-wrap gap-2" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-10 w-32 rounded-pill bg-muted motion-safe:animate-pulse" />
            ))}
          </div>
        ) : (
          <FilterChips
            id="doctor-specialties"
            label="Filter doctors by specialty"
            options={options}
            value={specialty}
            onChange={setSpecialty}
            layoutId="doctors-specialty-pill"
            countNoun="doctor"
          />
        )}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-prohealth-muted" aria-live="polite">
            {loading
              ? 'Loading doctors…'
              : shown.length === 0
                ? `No doctors found${scope ? ` ${scope}` : ''}.`
                : `Showing ${shown.length} of ${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctors'}${scope ? ` ${scope}` : ''}.`}
          </p>
          <SearchField
            id="doctor-search"
            label="Search doctors"
            placeholder="Search by name, specialty or condition"
            value={query}
            onChange={setQuery}
            className="w-full sm:w-80 lg:w-96"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading doctors">
          {Array.from({ length: 6 }, (_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<UserSearch className="h-6 w-6" aria-hidden="true" />}
            title="No doctors found"
            description="Try a broader search such as a specialty (“cardio”) or a condition, or clear the filters to see every specialist."
          >
            {q && (
              <ResetButton
                onClick={() => {
                  setQuery('');
                  focusLater('#doctor-search');
                }}
              >
                Clear search
              </ResetButton>
            )}
            {specialty !== ALL && (
              <ResetButton
                onClick={() => {
                  setSpecialty(ALL);
                  focusActiveChip('doctor-specialties');
                }}
              >
                Show all specialties
              </ResetButton>
            )}
          </EmptyState>
        </div>
      ) : (
        <motion.ul layout className="relative mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <DoctorCard doc={doc} onBook={(id) => router.push(bookingHref(id))} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
