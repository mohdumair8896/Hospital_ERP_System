/**
 * Shared motion tokens for the website. They mirror `ease-out-soft` in
 * tailwind.preset.cjs so CSS and framer-motion animations feel the same.
 */

/** Calm "ease out" curve used by every reveal and entrance. */
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/** Reveal duration in seconds (the plan allows 400-450ms). */
export const REVEAL_DURATION = 0.45;

/** Default rise distance in px for reveals (the plan allows 12-16px). */
export const REVEAL_Y = 16;

/** Delay between staggered children, in seconds. */
export const STAGGER_STEP = 0.06;
