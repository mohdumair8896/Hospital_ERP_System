'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { EASE_OUT_SOFT } from '@/components/motion';

export type ChipOption = {
  value: string;
  label: string;
  /** Optional count shown beside the label. */
  count?: number;
};

type FilterChipsProps = {
  /** id of the chip group, used by focusActiveChip(). */
  id: string;
  /** Accessible name of the chip group, e.g. "Filter articles by topic". */
  label: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  /** Unique per page section, so the active pill slides only between these chips. */
  layoutId: string;
  /** Noun for the screen-reader count, e.g. "article" -> "3 articles". */
  countNoun?: string;
  className?: string;
};

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Toggle-button chips (aria-pressed) whose active pill slides between them
 * with a framer `layoutId`. Under reduced motion (MotionProvider) the pill
 * simply jumps. Tab moves between chips; Enter or Space selects one. Below
 * the sm breakpoint the chips form one row that scrolls sideways.
 */
export function FilterChips({ id, label, options, value, onChange, layoutId, countNoun, className }: FilterChipsProps) {
  return (
    // layoutScroll: the row scrolls sideways on phones, so framer measures the pill inside it correctly.
    <motion.div
      layoutScroll
      id={id}
      role="group"
      aria-label={label}
      className={`flex gap-2 sm:flex-wrap max-sm:-mx-4 max-sm:overflow-x-auto max-sm:px-4 max-sm:py-1 max-sm:[scrollbar-width:none] ${className ?? ''}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`relative isolate inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-semibold transition-colors duration-250 ${
              active
                ? 'border-primary text-primary-foreground'
                : 'border-border bg-background text-prohealth-body hover:border-primary/30 hover:bg-secondary hover:text-primary'
            } ${RING}`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-pill bg-primary"
                transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
                aria-hidden="true"
              />
            )}
            {opt.label}
            {typeof opt.count === 'number' && (
              <>
                <span
                  aria-hidden="true"
                  className={`rounded-pill px-1.5 text-xs tabular-nums ${
                    active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-prohealth-muted'
                  }`}
                >
                  {opt.count}
                </span>
                {countNoun && (
                  <span className="sr-only">
                    , {opt.count} {opt.count === 1 ? countNoun : `${countNoun}s`}
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

/**
 * Move focus after a reset button removes itself (empty states), so keyboard
 * users are not dropped on <body>. Runs after React commits the new state.
 */
export function focusLater(selector: string) {
  window.setTimeout(() => document.querySelector<HTMLElement>(selector)?.focus(), 0);
}

/** Focus the pressed chip of a FilterChips group. */
export const focusActiveChip = (groupId: string) => focusLater(`#${groupId} [aria-pressed="true"]`);

/** Search field with a visible icon, an accessible label and a clear button. */
export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={`relative ${className ?? ''}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-prohealth-muted"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-pill border border-border bg-background pl-10 pr-10 text-sm text-prohealth-heading shadow-soft outline-none transition-[border-color,box-shadow] duration-250 placeholder:text-prohealth-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className={`absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-prohealth-muted transition-colors duration-250 hover:bg-muted hover:text-prohealth-heading ${RING}`}
        >
          <span className="sr-only">Clear search</span>
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Calm empty state with an icon, a message and reset actions. */
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary shadow-soft">{icon}</span>
      <p className="text-lg font-semibold text-prohealth-heading">{title}</p>
      {description && <p className="max-w-md text-sm text-prohealth-body">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

/** Text-style button used inside empty states. */
export function ResetButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill border border-border bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors duration-250 hover:border-primary/30 hover:bg-secondary ${RING}`}
    >
      {children}
    </button>
  );
}
