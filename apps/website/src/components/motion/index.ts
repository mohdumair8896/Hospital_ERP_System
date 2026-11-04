/**
 * Motion primitives for the public website. Import from '@/components/motion'.
 *
 * - MotionProvider: site-wide `MotionConfig reducedMotion="user"` (already in app/layout.tsx).
 * - Reveal: fade and rise on scroll into view.
 * - Stagger / StaggerItem: reveal children one after another.
 * - CountUp: count a number up on scroll into view, final value always in the DOM.
 *
 * Named re-exports only (no `export *`) so server components can import from here.
 */
export { MotionProvider } from './MotionProvider';
export { Reveal } from './Reveal';
export type { RevealProps } from './Reveal';
export { Stagger, StaggerItem } from './Stagger';
export type { StaggerProps, StaggerItemProps } from './Stagger';
export { CountUp } from './CountUp';
export type { CountUpProps } from './CountUp';
export { EASE_OUT_SOFT, REVEAL_DURATION, REVEAL_Y, STAGGER_STEP } from './constants';
