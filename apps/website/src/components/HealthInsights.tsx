'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen, Clock, User, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../data/hospitalData';

export default function HealthInsights() {
  const displayedPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section id="insights" className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MEDICAL KNOWLEDGE & RESEARCH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
              Latest Health Insights & Clinical Articles
            </h2>
            <p className="text-sm sm:text-base text-prohealth-body mt-2 max-w-2xl">
              Written and peer-reviewed by board-certified hospital physicians to empower patient health literacy.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-prohealth-primary hover:text-prohealth-secondary bg-prohealth-ice px-5 py-2.5 rounded-full border border-blue-100 transition-all shadow-sm"
            >
              <span>View All Medical Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPosts.map((art) => (
            <div
              key={art.slug}
              className="prohealth-card bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-prohealth-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {art.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-prohealth-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-prohealth-secondary" />
                      <span>{art.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-prohealth-secondary" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-prohealth-heading group-hover:text-prohealth-primary transition-colors leading-snug">
                    <Link href={`/blog/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-prohealth-body line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-400 font-medium">
                    By {art.authorName}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${art.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-prohealth-primary hover:text-prohealth-secondary transition-colors"
                >
                  <span>Read Full Clinical Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

