'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

/**
 * Thin reading-progress bar pinned just under the sticky site header.
 *
 * Progress runs from 0 when the top of `#targetId` reaches the header to 1
 * when its end reaches the bottom of the viewport. It follows the user's own
 * scrolling (no autonomous motion) and only uses transforms: `y` for the
 * header offset and `scaleX` for the fill. Decorative, so hidden from AT.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const progress = useMotionValue(0);
  const offset = useMotionValue(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    // The Navbar's <header> is the sticky one (the article header is static).
    const header = Array.from(document.querySelectorAll('header')).find((el) =>
      ['sticky', 'fixed'].includes(getComputedStyle(el).position),
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - (window.innerHeight - headerBottom);
      const read = headerBottom - rect.top;
      const value = scrollable <= 0 ? (read > 0 ? 1 : 0) : Math.min(1, Math.max(0, read / scrollable));
      offset.set(headerBottom);
      progress.set(value);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId, offset, progress]);

  return (
    <motion.div
      aria-hidden="true"
      data-reading-progress=""
      style={{ y: offset, scaleX: progress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 origin-left rounded-r-full bg-prohealth-primary"
    />
  );
}
