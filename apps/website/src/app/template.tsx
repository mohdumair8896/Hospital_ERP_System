'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_SOFT } from '../components/motion';

// Flips to true after the first client render. It never changes on the server.
let hasHydrated = false;

/**
 * Calm page entrance (pattern C33): on client-side navigation each page fades
 * in from opacity 0 and rises 8px over 0.25s. There is no exit animation.
 *
 * The very first document load is not animated, so the server HTML is never
 * shipped at opacity 0 and emergency numbers show on first paint. Under
 * reduced motion only the fade runs.
 *
 * Note: while the 0.25s transform runs, `position: fixed` elements inside a
 * page are positioned against this wrapper. Bottom-anchored floating UI should
 * render through a portal (see EmergencyFAB).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animateEntrance] = useState(() => hasHydrated);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={animateEntrance ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT_SOFT }}
    >
      {children}
    </motion.div>
  );
}
