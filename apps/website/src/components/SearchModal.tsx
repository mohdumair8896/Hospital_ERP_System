'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Stethoscope, Building2, BookOpen, ArrowRight, User } from 'lucide-react';
import { DEPARTMENTS, DOCTORS, BLOG_POSTS } from '../data/hospitalData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredDoctors = query
    ? DOCTORS.filter(
        (doc) =>
          doc.name.toLowerCase().includes(normalizedQuery) ||
          doc.specialty.toLowerCase().includes(normalizedQuery) ||
          doc.departmentName.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const filteredDepartments = query
    ? DEPARTMENTS.filter(
        (dept) =>
          dept.name.toLowerCase().includes(normalizedQuery) ||
          dept.shortDesc.toLowerCase().includes(normalizedQuery) ||
          dept.conditionsTreated.some((c) => c.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const filteredPosts = query
    ? BLOG_POSTS.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.category.toLowerCase().includes(normalizedQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const totalResults = filteredDoctors.length + filteredDepartments.length + filteredPosts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-prohealth-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, departments, conditions, or medical articles..."
            className="w-full text-slate-800 placeholder:text-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Type to search ProHealth specialists and clinical institutes</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Cardiology', 'Neurology', 'Dr. Sarah', 'Pediatrics', 'Heart Attack'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs bg-slate-100 hover:bg-prohealth-ice hover:text-prohealth-primary text-slate-600 px-3 py-1 rounded-full font-medium transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="text-base font-semibold">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400">
                Please check the spelling or search for general specialties like Cardiology or Pediatrics.
              </p>
            </div>
          ) : (
            <>
              {/* Doctors Match */}
              {filteredDoctors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <User className="w-3.5 h-3.5 text-prohealth-primary" />
                    <span>Specialist Doctors ({filteredDoctors.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredDoctors.map((doc) => (
                      <Link
                        key={doc.id}
                        href={`/doctors/${doc.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-prohealth-ice/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-prohealth-primary/10 text-prohealth-primary flex items-center justify-center font-bold text-xs">
                            {doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-prohealth-primary transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate-500">{doc.title} • {doc.departmentName}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-prohealth-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Departments Match */}
              {filteredDepartments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Building2 className="w-3.5 h-3.5 text-prohealth-primary" />
                    <span>Departments & Centers ({filteredDepartments.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredDepartments.map((dept) => (
                      <Link
                        key={dept.id}
                        href={`/departments/${dept.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-prohealth-ice/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-sky-50 text-prohealth-secondary flex items-center justify-center font-bold text-xs">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-prohealth-primary transition-colors">
                              {dept.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-md">{dept.shortDesc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-prohealth-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts Match */}
              {filteredPosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-prohealth-primary" />
                    <span>Health Articles & Clinical Insights ({filteredPosts.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-prohealth-ice/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-prohealth-primary transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-slate-500">{post.category} • {post.readTime}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-prohealth-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>ProHealth Academic Search</span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
}
