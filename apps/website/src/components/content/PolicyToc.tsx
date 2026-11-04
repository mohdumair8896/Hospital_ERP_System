'use client';

import React, { useEffect, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PolicyTocItem = { id: string; title: string };

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Top of the scroll-spy band in px: below the 80px sticky navbar (matches scroll-mt-28). */
const BAND_TOP = 112;

/**
 * Table of contents for the policy pages (Diffusion LE1 pattern).
 *
 * - Built from the same list that renders the page's h2 sections.
 * - Scroll-spy: an IntersectionObserver watches each section inside a band
 *   just below the sticky navbar; the first section in that band is active
 *   and its link gets `aria-current="true"`.
 * - Desktop: sticky sidebar. Mobile: a collapsed disclosure showing the
 *   current section; opening it lists every section.
 */
export function PolicyToc({ items }: { items: PolicyTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const listId = useId();
  const idsKey = items.map((i) => i.id).join('|');

  useEffect(() => {
    const ids = idsKey.split('|').filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const first = ids.find((id) => visible.has(id));
        if (first) setActiveId(first);
        // Scrolled back above the first section: highlight it again.
        else if (sections[0].getBoundingClientRect().top > BAND_TOP) setActiveId(ids[0]);
      },
      // Band from just under the sticky navbar to 45% down the viewport.
      { rootMargin: `-${BAND_TOP}px 0px -55% 0px`, threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [idsKey]);

  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeId),
  );
  const activeItem = items[activeIndex];

  return (
    <nav
      aria-label="On this page"
      className="mb-10 lg:mb-0 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
    >
      <div className="rounded-card border border-prohealth-border bg-white lg:rounded-none lg:border-0 lg:bg-transparent">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
          className={cn('lg:hidden flex w-full items-center justify-between gap-3 rounded-card px-4 py-3 text-left', FOCUS_RING)}
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wider text-prohealth-muted">On this page</span>
            <span className="block truncate text-sm font-semibold text-prohealth-heading">
              {activeItem ? `${activeIndex + 1}. ${activeItem.title}` : ''}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'w-5 h-5 shrink-0 text-prohealth-primary motion-safe:transition-transform motion-safe:duration-250',
              open && 'rotate-180',
            )}
          />
        </button>

        <p className="hidden lg:block text-eyebrow uppercase text-prohealth-muted mb-3 px-3">On this page</p>

        <ol
          id={listId}
          className={cn(
            'space-y-0.5 border-t border-prohealth-border p-2 lg:block lg:border-t-0 lg:border-l lg:p-0',
            open ? 'block' : 'hidden',
          )}
        >
          {items.map((item, idx) => {
            const isActive = item.id === activeItem?.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    setActiveId(item.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex gap-2 rounded-lg px-3 py-2 text-sm leading-snug transition-colors',
                    'lg:-ml-px lg:rounded-none lg:rounded-r-lg lg:border-l-2',
                    FOCUS_RING,
                    isActive
                      ? 'bg-muted text-prohealth-primary font-semibold lg:border-prohealth-primary'
                      : 'text-prohealth-body hover:bg-muted/60 hover:text-prohealth-heading lg:border-transparent',
                  )}
                >
                  <span className="tabular-nums" aria-hidden="true">
                    {idx + 1}.
                  </span>
                  <span>{item.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
