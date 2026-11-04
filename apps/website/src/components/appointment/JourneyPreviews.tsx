import React from 'react';
import { Bell, Check, Clock, FileText, MapPin, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Small static mock-ups of our own UI for the journey stages (pattern C24).
 * They are decorative (aria-hidden); the checklist next to them carries the
 * real information.
 */

const CARD = 'rounded-card border border-border bg-card p-3.5 shadow-soft text-[13px] text-foreground';

export function BookPreview() {
  const days = [
    { d: 'Mon', n: 26 },
    { d: 'Tue', n: 27, on: true },
    { d: 'Wed', n: 28 },
  ];
  return (
    <div className={CARD} aria-hidden="true">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dept-blue-bg text-xs font-bold text-dept-blue-fg">
          SP
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">Dr. Sarah Patel</p>
          <p className="text-xs text-muted-foreground">Cardiology</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {days.map((day) => (
          <span
            key={day.n}
            className={cn(
              'rounded-lg border py-1 text-center text-xs',
              day.on ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
            )}
          >
            {day.d} {day.n}
          </span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 tabular-nums">
        {['09:00', '10:30', '14:00'].map((t) => (
          <span
            key={t}
            className={cn(
              'rounded-lg border py-1 text-center text-xs',
              t === '10:30' ? 'border-primary bg-dept-blue-bg font-semibold text-primary' : 'border-border'
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <span className="mt-3 block rounded-lg bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground">
        Confirm Tue 27, 10:30 AM
      </span>
    </div>
  );
}

export function PreparePreview() {
  const items = [
    { label: 'Photo ID', done: true },
    { label: 'Insurance card', done: true },
    { label: 'Current medicines list', done: false },
  ];
  return (
    <div className={CARD} aria-hidden="true">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-dept-amber-fg">
        <Bell className="h-3.5 w-3.5" /> Reminder · tomorrow
      </p>
      <p className="mt-1 font-semibold">Before your visit</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border',
                item.done ? 'border-care bg-care text-white' : 'border-slate-300'
              )}
            >
              {item.done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
            </span>
            <span className={item.done ? 'text-muted-foreground line-through' : ''}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VisitPreview() {
  return (
    <div className={CARD} aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Your token</p>
          <p className="font-display text-2xl font-bold tabular-nums text-primary">A-12</p>
        </div>
        <span className="rounded-pill bg-care-soft px-2 py-0.5 text-xs font-semibold text-care">Checked in</span>
      </div>
      <div className="mt-2 flex gap-1" role="presentation">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn('h-1.5 flex-1 rounded-pill', i < 3 ? 'bg-primary' : 'bg-muted')} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Now serving A-09</p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" /> About 10 min
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Pavilion A, Room 304
        </span>
      </div>
    </div>
  );
}

export function FollowUpPreview() {
  return (
    <div className={cn(CARD, 'space-y-2')} aria-hidden="true">
      <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-2">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">Lipid panel</p>
          <p className="truncate text-xs text-muted-foreground">Reviewed by Dr. Patel</p>
        </div>
        <span className="rounded-pill bg-care-soft px-2 py-0.5 text-xs font-semibold text-care">Normal</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-2">
        <Pill className="h-4 w-4 shrink-0 text-primary" />
        <p className="min-w-0 flex-1 truncate">e-Prescription renewed</p>
      </div>
      <span className="block rounded-lg border border-primary/30 py-1.5 text-center text-xs font-semibold text-primary">
        Book a follow-up
      </span>
    </div>
  );
}
