'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Moon, Sun, Sunrise } from 'lucide-react';
import { bookingHref } from '@/components/appointment/DoctorBookingCard';
import { doctorHref, doctorPhoto } from '@/components/sections/discovery/data';
import { FOCUS_RING } from '../PageHeader';
import type { Period, ScheduleRow } from './schedule-model';

const PERIOD_ICON: Record<Period, typeof Sun> = { Morning: Sunrise, Afternoon: Sun, Evening: Moon };

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/, '')
    .split(' ')
    .map((n) => n[0])
    .join('');

/**
 * One doctor's clinic on the selected day: photo, name (a profile link only
 * when a static profile page exists), specialty, department tint and room,
 * then the bookable times as chips. Each chip opens the booking wizard with
 * the doctor and time preselected (`/appointments?doc=<id>&slot=<time>`).
 */
export function DoctorScheduleRow({ row, day }: { row: ScheduleRow; day: string }) {
  const { doctor, department, theme, room, location, groups } = row;
  const profile = doctorHref(doctor);
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <article className="grid gap-5 rounded-card border border-border bg-card p-5 shadow-soft transition-[border-color,box-shadow] duration-250 hover:border-primary/25 hover:shadow-lift sm:p-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-8">
      <div className="flex items-start gap-4">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
          {photoFailed ? (
            <span className="flex h-full items-center justify-center font-display text-lg font-bold text-primary/60" aria-hidden="true">
              {initials(doctor.name)}
            </span>
          ) : (
            <Image
              src={doctorPhoto(doctor)}
              alt=""
              fill
              sizes="56px"
              onError={() => setPhotoFailed(true)}
              className="object-cover object-top"
            />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug text-prohealth-heading">
            {profile ? (
              <Link href={profile} className={`rounded-sm transition-colors duration-250 hover:text-primary ${FOCUS_RING}`}>
                {doctor.name}
                <span className="sr-only">, view profile</span>
              </Link>
            ) : (
              doctor.name
            )}
          </h3>
          <p className="text-sm text-prohealth-body">{doctor.specialty}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {department && (
              <span className={`rounded-pill px-2.5 py-1 font-semibold ${theme.bg} ${theme.fg}`}>{theme.label}</span>
            )}
            {(room || location) && (
              <span className="inline-flex items-center gap-1 text-prohealth-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                {[room, location].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map(({ period, slots }) => {
          const Icon = PERIOD_ICON[period];
          return (
            <div key={period}>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-prohealth-muted">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {period}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${period} times with ${doctor.name} on ${day}`}>
                {slots.map((slot) => (
                  <li key={slot}>
                    <Link
                      href={bookingHref(doctor.id, slot)}
                      aria-label={`Book ${slot} with ${doctor.name}`}
                      className={`inline-flex min-w-[5.5rem] justify-center rounded-pill border border-border bg-background px-3.5 py-2 text-sm font-medium tabular-nums text-prohealth-heading transition-colors duration-250 hover:border-primary/40 hover:bg-dept-blue-bg hover:text-dept-blue-fg ${FOCUS_RING}`}
                    >
                      {slot}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function ScheduleRowSkeleton() {
  return (
    <div className="grid gap-5 rounded-card border border-border bg-card p-6 lg:grid-cols-[20rem_1fr]" aria-hidden="true">
      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-2xl bg-muted motion-safe:animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-muted motion-safe:animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 w-24 rounded-pill bg-muted motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}
