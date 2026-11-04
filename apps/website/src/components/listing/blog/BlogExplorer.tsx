'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { EASE_OUT_SOFT } from '@/components/motion';
import { EmptyState, FilterChips, ResetButton, SearchField, focusActiveChip, focusLater, type ChipOption } from '../FilterChips';
import { FeaturedPostCard, PostCard, type BlogCardPost } from './PostCards';

const ALL = 'ALL';
const ITEM_MOTION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.4, ease: EASE_OUT_SOFT },
} as const;

function matches(post: BlogCardPost, q: string) {
  if (!q) return true;
  const haystack = [post.title, post.excerpt, post.category, post.authorName, ...post.tags].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/**
 * Article library: topic chips (built from the real categories) and a search
 * box filter the posts; the newest match is shown as the featured card and
 * the rest reflow in a grid. Every card links to its `/blog/<slug>` page.
 */
export function BlogExplorer({ posts }: { posts: BlogCardPost[] }) {
  const [topic, setTopic] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const q = query.trim();

  const options: ChipOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [
      { value: ALL, label: 'All topics', count: posts.length },
      ...Array.from(counts, ([category, count]) => ({ value: category, label: category, count })),
    ];
  }, [posts]);

  const shown = posts.filter((p) => (topic === ALL || p.category === topic) && matches(p, q));
  const [featured, ...rest] = shown;
  const topicLabel = topic === ALL ? null : topic;

  const summary =
    shown.length === 0
      ? 'No articles found'
      : `Showing ${shown.length} of ${posts.length} ${posts.length === 1 ? 'article' : 'articles'}`;
  const scope = [topicLabel && `in ${topicLabel}`, q && `for “${q}”`].filter(Boolean).join(' ');

  return (
    <div>
      <div className="space-y-5">
        <FilterChips
          id="blog-topics"
          label="Filter articles by topic"
          options={options}
          value={topic}
          onChange={setTopic}
          layoutId="blog-topic-pill"
          countNoun="article"
        />
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-prohealth-muted" aria-live="polite">
            {summary}
            {scope && ` ${scope}`}.
          </p>
          <SearchField
            id="blog-search"
            label="Search articles"
            placeholder="Search by topic, condition or author"
            value={query}
            onChange={setQuery}
            className="w-full sm:w-80 lg:w-96"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
            title="No articles found"
            description={
              <>
                Nothing matches {q ? <>“{q}”</> : 'this filter'}
                {topicLabel ? <> in {topicLabel}</> : null}. Try a broader word, or browse every topic.
              </>
            }
          >
            {q && (
              <ResetButton
                onClick={() => {
                  setQuery('');
                  focusLater('#blog-search');
                }}
              >
                Clear search
              </ResetButton>
            )}
            {topic !== ALL && (
              <ResetButton
                onClick={() => {
                  setTopic(ALL);
                  focusActiveChip('blog-topics');
                }}
              >
                Show all topics
              </ResetButton>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={featured.slug} layout {...ITEM_MOTION}>
              <FeaturedPostCard post={featured} />
            </motion.div>
          </AnimatePresence>

          {rest.length > 0 && (
            <motion.ul layout className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {rest.map((post) => (
                  <motion.li key={post.slug} layout className="flex" {...ITEM_MOTION}>
                    <PostCard post={post} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      )}
    </div>
  );
}
