'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';

/**
 * Client boundary that applies the site-wide framer-motion config.
 *
 * `reducedMotion="user"` follows the visitor's OS setting: when it asks for
 * reduced motion, transform animations (y, scale, layout) are skipped and only
 * opacity still animates. Mounted once in `app/layout.tsx`; you never need to
 * add it again.
 *
 * @param children Page content.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
