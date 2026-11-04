'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { EASE_OUT_SOFT, REVEAL_DURATION, REVEAL_Y, STAGGER_STEP } from './constants';

const CONTAINER_TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
} as const;

const ITEM_TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
} as const;

const itemVariants: Variants = {
  hidden: (y: number) => ({ opacity: 0, y }),
  show: { opacity: 1, y: 0, transition: { duration: REVEAL_DURATION, ease: EASE_OUT_SOFT } },
};

type A11yProps = Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'role' | 'aria-label' | 'aria-labelledby'>;

export type StaggerProps = {
  children: React.ReactNode;
  /** Element to render. Default 'div'. Use 'ul'/'ol' with `StaggerItem as="li"`. */
  as?: keyof typeof CONTAINER_TAGS;
  /** Seconds before the first child starts. Default 0. */
  delay?: number;
  /** Seconds between children. Default 0.06. */
  stagger?: number;
  /** Animate only the first time it enters the viewport. Default true. */
  once?: boolean;
  /** Fraction (0-1) of the container that must be visible to trigger. Default 0.2. */
  amount?: number;
  className?: string;
} & A11yProps;

/**
 * Container that reveals its `StaggerItem` children one after another when it
 * scrolls into view (pattern C01). Children must be `StaggerItem`s (direct or
 * nested); other elements render normally.
 *
 * @example
 * <Stagger as="ul" className="grid gap-6 md:grid-cols-3">
 *   {items.map((i) => <StaggerItem as="li" key={i.id}>...</StaggerItem>)}
 * </Stagger>
 */
export function Stagger({
  children,
  as = 'div',
  delay = 0,
  stagger = STAGGER_STEP,
  once = true,
  amount = 0.2,
  className,
  ...rest
}: StaggerProps) {
  const Component = CONTAINER_TAGS[as] as typeof motion.div;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <Component
      {...rest}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </Component>
  );
}

export type StaggerItemProps = {
  children: React.ReactNode;
  /** Element to render. Default 'div'. */
  as?: keyof typeof ITEM_TAGS;
  /** Rise distance in px. Default 16. Skipped under reduced motion. */
  y?: number;
  className?: string;
} & A11yProps;

/**
 * One child of `Stagger`: fades in and rises 16px (0.45s) on its turn.
 * Under reduced motion only the opacity animates.
 */
export function StaggerItem({ children, as = 'div', y = REVEAL_Y, className, ...rest }: StaggerItemProps) {
  const Component = ITEM_TAGS[as] as typeof motion.div;

  return (
    <Component {...rest} className={className} variants={itemVariants} custom={y}>
      {children}
    </Component>
  );
}
