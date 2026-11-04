'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_SOFT, REVEAL_DURATION, REVEAL_Y } from './constants';

const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
} as const;

export type RevealProps = {
  children: React.ReactNode;
  /** Seconds to wait after the element enters the viewport. Default 0. */
  delay?: number;
  /** Rise distance in px (start offset below the final position). Default 16. */
  y?: number;
  /** Element to render. Default 'div'. Use 'li' inside a list. */
  as?: keyof typeof TAGS;
  /** Animate only the first time it enters the viewport. Default true. */
  once?: boolean;
  /** Fraction (0-1) of the element that must be visible to trigger. Default 0.25. */
  amount?: number;
  className?: string;
} & Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'role' | 'aria-label' | 'aria-labelledby'>;

/**
 * Fades an element in and lifts it into place when it scrolls into view
 * (pattern C01). 0.45s, ease [0.22, 1, 0.36, 1].
 *
 * Under reduced motion (via `MotionProvider`) the rise is skipped and only the
 * opacity fades. Content is hidden until hydration, so never wrap urgent
 * content (emergency numbers, the booking CTA) or above-the-fold hero text.
 *
 * @example
 * <Reveal as="section" delay={0.1} className="py-section">...</Reveal>
 */
export function Reveal({
  children,
  delay = 0,
  y = REVEAL_Y,
  as = 'div',
  once = true,
  amount = 0.25,
  className,
  ...rest
}: RevealProps) {
  const Component = TAGS[as] as typeof motion.div;

  return (
    <Component
      {...rest}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: REVEAL_DURATION, ease: EASE_OUT_SOFT, delay }}
    >
      {children}
    </Component>
  );
}
