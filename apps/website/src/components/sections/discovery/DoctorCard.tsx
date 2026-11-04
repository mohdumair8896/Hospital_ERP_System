'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Doctor } from '@hospital/contracts';
import { ArrowUpRight, Calendar, Clock, Star } from 'lucide-react';
import { doctorHref, doctorPhoto } from './data';

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Doctor card with pattern C13: on hover the card lifts 4px and gains a soft
 * shadow, the photo zooms to 1.04 on a slower curve, and a "View profile"
 * chip slides up. Keyboard focus on the profile link mirrors all of it, and
 * touch devices (no hover) show the chip by default.
 *
 * The profile link only appears when a static profile page exists for this
 * doctor, so it never leads to a 404.
 */
export function DoctorCard({ doc, onBook }: { doc: Doctor; onBook: (id: string) => void }) {
  const href = doctorHref(doc);
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-white shadow-soft transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift ${
        href ? 'has-[a:focus-visible]:-translate-y-1 has-[a:focus-visible]:shadow-lift has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2' : ''
      }`}
    >
      <div className="relative h-64 overflow-hidden bg-muted">
        {photoFailed ? (
          <span className="flex h-full items-center justify-center font-display text-5xl font-bold text-primary/40" aria-hidden="true">
            {doc.name.replace(/^Dr\.?\s+/, '').split(' ').map((n) => n[0]).join('')}
          </span>
        ) : (
          <Image
            src={doctorPhoto(doc)}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            onError={() => setPhotoFailed(true)}
            className="object-cover object-top transition-transform duration-700 ease-out-soft group-hover:scale-[1.04] group-has-[a:focus-visible]:scale-[1.04]"
          />
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill bg-white/95 px-2.5 py-1 text-sm font-semibold text-prohealth-heading shadow-soft">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          {doc.rating}
          <span className="font-normal text-prohealth-muted">
            ({doc.reviewCount}
            <span className="sr-only"> reviews</span>)
          </span>
        </span>
        <span className="absolute bottom-3 left-3 rounded-pill bg-white/95 px-3 py-1 text-sm font-semibold text-primary shadow-soft">
          {doc.specialty}
        </span>
        {href && (
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 inline-flex translate-y-2 items-center gap-1 rounded-pill bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground opacity-0 shadow-soft transition-[transform,opacity] duration-400 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-has-[a:focus-visible]:translate-y-0 group-has-[a:focus-visible]:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
          >
            View profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-prohealth-heading transition-colors duration-250 group-hover:text-primary">
          {href ? (
            // Stretched link: the whole card opens the profile; the Book button sits above it.
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {doc.name}
              <span className="sr-only">, view profile</span>
            </Link>
          ) : (
            doc.name
          )}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-prohealth-muted">{doc.qualification}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-prohealth-body">{doc.bio}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-prohealth-body">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            {doc.experienceYears} years in practice
          </span>
          <span className="font-semibold text-prohealth-heading">
            Consultation <span className="text-primary">${doc.consultationFee}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBook(doc.id)}
          className={`relative z-10 mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-250 hover:bg-prohealth-primary-hover ${RING}`}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Book appointment
          <span className="sr-only"> with {doc.name}</span>
        </button>
      </div>
    </article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white" aria-hidden="true">
      <div className="h-64 bg-muted motion-safe:animate-pulse" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-muted motion-safe:animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
        <div className="h-4 w-full rounded bg-muted motion-safe:animate-pulse" />
        <div className="h-11 w-full rounded-pill bg-muted motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
