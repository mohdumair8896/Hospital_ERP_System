'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { BLOG_POSTS } from '../../data/hospitalData';
import { Search, ChevronRight, Clock, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';

export default function BlogCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Cardiovascular Health', 'Neurology & Stroke', 'Orthopedic Surgery', 'Pediatrics'];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || post.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="relative py-16 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Health Insights</span>
          </nav>
          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1F5084] bg-[#1F5084]/10 px-3 py-1 rounded border border-[#1F5084]/20">
              Evidence-Based Clinical Education
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              Health Insights &amp; Medical Research
            </h1>
            <p className="text-sm text-[#475467] leading-relaxed">
              Curated clinical articles and wellness guidance written by our attending medical specialists, verified by the ProHealth Medical Review Committee.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="py-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medical articles or topics..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL' ? 'All Topics' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-[#1F5084]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{post.date}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{post.authorName}</div>
                      <div className="text-[10px] text-slate-400">{post.authorTitle}</div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
