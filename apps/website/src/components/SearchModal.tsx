'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, BookOpen, Building2, Search, SearchX, Stethoscope, User, X, type LucideIcon } from 'lucide-react';
import { DEPARTMENTS, DOCTORS, BLOG_POSTS } from '../data/hospitalData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When set, Ctrl+K / Cmd+K anywhere on the page calls it to open the dialog. */
  onOpen?: () => void;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const RESULT_LINK = `group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-250 hover:bg-muted focus-visible:bg-muted ${FOCUS_RING}`;
const RESULT_ARROW =
  'h-4 w-4 shrink-0 text-prohealth-muted transition-[color,transform] duration-250 ease-out-soft group-hover:text-primary motion-safe:group-hover:translate-x-0.5';
const SUGGESTIONS = ['Cardiology', 'Neurology', 'Dr. Sarah', 'Pediatrics', 'Heart Attack'];

/**
 * Site search dialog built on Radix Dialog: role="dialog", aria-modal, labelled
 * by a visually hidden title, Escape or an outside click closes it, and Tab
 * stays inside. Focus goes to the search input on open and back to whatever
 * opened it on close. Arrow keys move between the input, suggestions and results.
 */
export default function SearchModal({ isOpen, onClose, onOpen }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Navbar opens this with its own buttons (not a Dialog.Trigger), so Radix
  // cannot restore focus by itself. Remember the opener instead.
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!onOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onOpen]);

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

  /** Up/Down arrows step through suggestions and results; Up from the first returns to the input. */
  const handleArrowKeys = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-search-item]') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      items[index === -1 ? 0 : Math.min(index + 1, items.length - 1)].focus();
    } else if (index <= 0) {
      inputRef.current?.focus();
    } else {
      items[index - 1].focus();
    }
  };

  const suggestionChips = (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          type="button"
          key={s}
          data-search-item
          onClick={() => {
            setQuery(s);
            inputRef.current?.focus();
          }}
          className={`rounded-pill border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-prohealth-heading transition-colors duration-250 hover:border-primary/40 hover:bg-secondary hover:text-primary ${FOCUS_RING}`}
        >
          {s}
        </button>
      ))}
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-xs animate-in fade-in duration-250" />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
          <Dialog.Content
            aria-modal="true"
            onKeyDown={handleArrowKeys}
            onOpenAutoFocus={(e) => {
              // Fires before Radix moves focus, so activeElement is still the opener.
              openerRef.current = document.activeElement as HTMLElement | null;
              e.preventDefault();
              inputRef.current?.focus();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              openerRef.current?.focus();
            }}
            className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-card border border-border bg-card shadow-lift animate-in fade-in zoom-in-95 duration-250 focus:outline-none"
          >
            <Dialog.Title className="sr-only">Search ProHealth</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search doctors, departments, conditions and health articles. Results update as you type.
            </Dialog.Description>

            {/* Search field */}
            <div className="flex items-center gap-2 border-b border-border p-3 sm:p-4">
              <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-pill border border-input bg-muted/60 px-4 transition-colors duration-250 has-[input:focus-visible]:bg-background has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2">
                <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search the site"
                  placeholder="Search doctors, departments, conditions, or articles..."
                  className="h-full w-full min-w-0 bg-transparent text-base text-prohealth-heading placeholder:text-prohealth-muted focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className={`shrink-0 rounded-full p-1 text-prohealth-muted hover:bg-card hover:text-prohealth-heading ${FOCUS_RING}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <Dialog.Close
                aria-label="Close search"
                className={`flex h-10 shrink-0 items-center justify-center rounded-pill border border-border px-3 text-xs font-semibold text-prohealth-body transition-colors hover:bg-muted hover:text-prohealth-heading ${FOCUS_RING}`}
              >
                <X className="h-4 w-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">Esc</span>
              </Dialog.Close>
            </div>

            {/* Results */}
            <p className="sr-only" aria-live="polite">
              {query ? `${totalResults} ${totalResults === 1 ? 'result' : 'results'} for ${query}` : ''}
            </p>
            <div ref={listRef} className="max-h-[60vh] space-y-5 overflow-y-auto p-3 sm:p-4">
              {!query ? (
                <div className="space-y-4 px-2 py-8 text-center">
                  <span aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                    <Search className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-prohealth-heading">Search specialists, departments and articles</p>
                    <p className="text-sm text-prohealth-muted">Try one of these popular searches:</p>
                  </div>
                  {suggestionChips}
                </div>
              ) : totalResults === 0 ? (
                <div className="space-y-4 px-2 py-10 text-center">
                  <span aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-prohealth-muted">
                    <SearchX className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-prohealth-heading">No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm text-prohealth-body">
                      Please check the spelling or search for general specialties like Cardiology or Pediatrics.
                    </p>
                  </div>
                  {suggestionChips}
                </div>
              ) : (
                <>
                  {filteredDoctors.length > 0 && (
                    <ResultGroup id="search-group-doctors" icon={User} label="Doctors" count={filteredDoctors.length}>
                      {filteredDoctors.map((doc) => (
                        <li key={doc.id}>
                          <Link href={`/doctors/${doc.id}`} onClick={onClose} data-search-item className={RESULT_LINK}>
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary"
                              >
                                {doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-prohealth-heading group-hover:text-primary">
                                  {doc.name}
                                </span>
                                <span className="block truncate text-sm text-prohealth-body">
                                  {doc.title} • {doc.departmentName}
                                </span>
                              </span>
                            </span>
                            <ArrowRight className={RESULT_ARROW} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ResultGroup>
                  )}

                  {filteredDepartments.length > 0 && (
                    <ResultGroup id="search-group-departments" icon={Building2} label="Departments" count={filteredDepartments.length}>
                      {filteredDepartments.map((dept) => (
                        <li key={dept.id}>
                          <Link href={`/departments/${dept.id}`} onClick={onClose} data-search-item className={RESULT_LINK}>
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dept-green-bg text-dept-green-fg"
                              >
                                <Stethoscope className="h-4 w-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-prohealth-heading group-hover:text-primary">
                                  {dept.name}
                                </span>
                                <span className="block truncate text-sm text-prohealth-body">{dept.shortDesc}</span>
                              </span>
                            </span>
                            <ArrowRight className={RESULT_ARROW} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ResultGroup>
                  )}

                  {filteredPosts.length > 0 && (
                    <ResultGroup id="search-group-articles" icon={BookOpen} label="Articles" count={filteredPosts.length}>
                      {filteredPosts.map((post) => (
                        <li key={post.slug}>
                          <Link href={`/blog/${post.slug}`} onClick={onClose} data-search-item className={RESULT_LINK}>
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dept-amber-bg text-dept-amber-fg"
                              >
                                <BookOpen className="h-4 w-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-prohealth-heading group-hover:text-primary">
                                  {post.title}
                                </span>
                                <span className="block truncate text-sm text-prohealth-body">
                                  {post.category} • {post.readTime}
                                </span>
                              </span>
                            </span>
                            <ArrowRight className={RESULT_ARROW} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ResultGroup>
                  )}
                </>
              )}
            </div>

            {/* Keyboard hints (keyboard users only need them on wider screens) */}
            <div className="hidden items-center justify-between gap-3 border-t border-border bg-muted/50 px-4 py-2.5 text-xs text-prohealth-body sm:flex">
              <span className="flex items-center gap-4">
                <KeyHint keys={['↑', '↓']} label="to move" />
                <KeyHint keys={['Enter']} label="to open" />
                <KeyHint keys={['Esc']} label="to close" />
              </span>
              <span className="text-prohealth-muted">ProHealth search</span>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type ResultGroupProps = {
  id: string;
  icon: LucideIcon;
  label: string;
  count: number;
  children: React.ReactNode;
};

/** One labelled block of results (Doctors / Departments / Articles). */
function ResultGroup({ id, icon: Icon, label, count, children }: ResultGroupProps) {
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="mb-1.5 flex items-center gap-2 px-3 text-eyebrow uppercase text-prohealth-muted">
        <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span>{label}</span>
        <span className="rounded-pill bg-muted px-1.5 py-0.5 text-xs font-semibold tracking-normal text-prohealth-body">
          <span className="sr-only">(</span>
          {count}
          <span className="sr-only">{count === 1 ? ' result)' : ' results)'}</span>
        </span>
      </h3>
      <ul className="space-y-0.5">{children}</ul>
    </section>
  );
}

function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {keys.map((k) => (
        <kbd
          key={k}
          className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-border bg-card px-1.5 py-0.5 font-sans text-xs font-semibold text-prohealth-heading shadow-2xs"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}
