'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../data/hospitalData';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Latest three articles (patterns C13 + C16), CSS only.
 *
 * Each card is one link (the title, stretched over the card). Hover and keyboard
 * focus get the same treatment: the card lifts 4px with a soft tinted shadow, the
 * image zooms to 1.04 on a slower curve, a "Read" chip slides up, and the title
 * turns primary. Movement sits behind `motion-safe:`; on touch screens
 * (`hover: none`) the chip is simply shown.
 */
export default function HealthInsights() {
  const displayedPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section id="insights" aria-labelledby="insights-heading" className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <p className="inline-flex items-center gap-1.5 text-prohealth-primary text-eyebrow uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Medical knowledge &amp; research</span>
            </p>
            <h2 id="insights-heading" className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
              Latest Health Insights &amp; Clinical Articles
            </h2>
            <p className="text-sm sm:text-base text-prohealth-body mt-3 max-w-2xl">
              Written and peer-reviewed by board-certified hospital physicians to empower patient health literacy.
            </p>
          </div>
          <Link
            href="/blog"
            className={`self-start md:self-auto inline-flex items-center gap-2 text-sm font-bold text-prohealth-primary hover:text-prohealth-primary-hover bg-prohealth-ice hover:bg-prohealth-tint px-5 py-2.5 rounded-full border border-blue-100 transition-colors shadow-sm ${FOCUS_RING}`}
          >
            <span>View All Medical Articles</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <Stagger as="ul" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPosts.map((art) => (
            <StaggerItem as="li" key={art.slug} className="flex">
              <article
                className={[
                  'group relative flex flex-1 flex-col overflow-hidden rounded-card bg-white border border-prohealth-border shadow-soft',
                  'transition-[transform,box-shadow,border-color] duration-500 ease-out-soft',
                  'hover:border-prohealth-secondary/40 hover:shadow-lift motion-safe:hover:-translate-y-1',
                  'has-[a:focus-visible]:border-prohealth-secondary/40 has-[a:focus-visible]:shadow-lift motion-safe:has-[a:focus-visible]:-translate-y-1',
                  'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2',
                ].join(' ')}
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.04] motion-safe:group-has-[a:focus-visible]:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-prohealth-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {art.category}
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      'absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-prohealth-primary shadow-sm',
                      'opacity-0 transition-[opacity,transform] duration-400 ease-out-soft motion-safe:translate-y-2',
                      'group-hover:opacity-100 motion-safe:group-hover:translate-y-0',
                      'group-has-[a:focus-visible]:opacity-100 motion-safe:group-has-[a:focus-visible]:translate-y-0',
                      '[@media(hover:none)]:opacity-100',
                    ].join(' ')}
                  >
                    Read
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 gap-3">
                  <div className="flex items-center gap-3 text-xs text-prohealth-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-prohealth-secondary" aria-hidden="true" />
                      <span>{art.date}</span>
                    </span>
                    <span aria-hidden="true">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-prohealth-secondary" aria-hidden="true" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-prohealth-heading leading-snug transition-colors duration-250 group-hover:text-primary group-has-[a:focus-visible]:text-primary">
                    <Link
                      href={`/blog/${art.slug}`}
                      className="focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-prohealth-body line-clamp-2 leading-relaxed">{art.excerpt}</p>

                  <p className="text-xs text-prohealth-muted font-medium">By {art.authorName}</p>

                  <span
                    aria-hidden="true"
                    className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-bold text-prohealth-primary"
                  >
                    Read Full Clinical Guide
                    <ArrowRight className="w-4 h-4 transition-transform duration-400 ease-out-soft motion-safe:group-hover:translate-x-1 motion-safe:group-has-[a:focus-visible]:translate-x-1" />
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
