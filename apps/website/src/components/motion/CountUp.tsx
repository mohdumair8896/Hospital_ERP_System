'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useInView, useReducedMotionConfig } from 'framer-motion';
import { EASE_OUT_SOFT } from './constants';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type CountUpProps = {
  /** Final number to show. */
  value: number;
  /** Digits after the decimal point. Default 0. */
  decimals?: number;
  /** Text before the number, e.g. '$'. */
  prefix?: string;
  /** Text after the number, e.g. '+', '%', 'k'. */
  suffix?: string;
  /** Count duration in seconds. Default 1.6. */
  duration?: number;
  /** Classes for the wrapping inline `<span>` (font, size, colour). */
  className?: string;
};

function formatNumber(n: number, decimals: number, prefix: string, suffix: string) {
  const formatted = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${formatted}${suffix}`;
}

/** True when any part of the element is inside the viewport right now. */
function isOnScreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
}

/**
 * Write digits into the React-owned text node instead of replacing it, so a
 * later re-render still updates the visible text.
 */
function setDigits(el: HTMLElement, text: string) {
  const node = el.firstChild;
  if (node && node.nodeType === Node.TEXT_NODE) node.nodeValue = text;
  else el.textContent = text;
}

/**
 * Counts from 0 up to `value` once it scrolls into view (pattern C05), using
 * framer-motion's `animate()`. Renders an inline `<span>`, so it can sit in a
 * heading or a `<dd>`.
 *
 * The final value is always in the DOM: the server HTML shows it, and a
 * `sr-only` copy holds it for screen readers while the animated digits are
 * `aria-hidden`.
 *
 * No flash: if the number is already on screen when it mounts (above the fold
 * at hydration), it keeps the final value and never animates. Only a number
 * that starts off screen is reset to 0 (invisibly) and counts up when it
 * enters view. Under reduced motion it simply shows the final value.
 *
 * @example
 * <CountUp value={98.6} decimals={1} suffix="%" className="text-display-md" />
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  /** Set when the digits were reset to 0 off screen and still need to count. */
  const armedRef = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotionConfig();
  const finalText = formatNumber(value, decimals, prefix, suffix);

  // Runs once, before the browser paints the hydrated tree.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (reduce || !el || isOnScreen(el)) return;
    setDigits(el, formatNumber(0, decimals, prefix, suffix));
    armedRef.current = true;
    // Mount only: later prop changes simply render the new final value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armedRef.current) return;
    if (reduce) {
      armedRef.current = false;
      setDigits(el, finalText);
      return;
    }
    if (!inView) return;

    armedRef.current = false;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT_SOFT,
      onUpdate: (latest) => setDigits(el, formatNumber(latest, decimals, prefix, suffix)),
      onComplete: () => setDigits(el, finalText),
    });
    return () => {
      controls.stop();
      setDigits(el, finalText);
    };
  }, [inView, reduce, value, decimals, prefix, suffix, duration, finalText]);

  return (
    <span className={className}>
      <span className="sr-only">{finalText}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {finalText}
      </span>
    </span>
  );
}
