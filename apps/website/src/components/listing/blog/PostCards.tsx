import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Calendar, Clock } from 'lucide-react';

/** The fields a listing card needs (the article body stays on the server). */
export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorTitle: string;
  date: string;
  /** yyyy-mm-dd for <time dateTime>. */
  isoDate: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
};

export const postHref = (slug: string) => `/blog/${slug}`;

/** Pattern C13 card shell: lift, tinted shadow and a focus ring that mirror hover. */
const CARD_SHELL = [
  'group relative flex h-full w-full overflow-hidden border border-border bg-card shadow-soft',
  'transition-[transform,box-shadow,border-color] duration-500 ease-out-soft',
  'hover:border-prohealth-secondary/40 hover:shadow-lift motion-safe:hover:-translate-y-1',
  'has-[a:focus-visible]:border-prohealth-secondary/40 has-[a:focus-visible]:shadow-lift motion-safe:has-[a:focus-visible]:-translate-y-1',
  'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2',
].join(' ');

const IMAGE_ZOOM =
  'object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.04] motion-safe:group-has-[a:focus-visible]:scale-[1.04]';

const TITLE_ACCENT = 'transition-colors duration-250 group-hover:text-primary group-has-[a:focus-visible]:text-primary';

/** Stretched link: the title link covers the whole card. */
const STRETCHED_LINK = "focus-visible:outline-none after:absolute after:inset-0 after:content-['']";

function ReadChip() {
  return (
    <span
      aria-hidden="true"
      className={[
        'absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-pill bg-background/95 px-3 py-1.5 text-xs font-bold text-primary shadow-soft',
        'opacity-0 transition-[opacity,transform] duration-400 ease-out-soft motion-safe:translate-y-2',
        'group-hover:opacity-100 motion-safe:group-hover:translate-y-0',
        'group-has-[a:focus-visible]:opacity-100 motion-safe:group-has-[a:focus-visible]:translate-y-0',
        '[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0',
      ].join(' ')}
    >
      Read
      <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  );
}

function Meta({ post }: { post: BlogCardPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-prohealth-muted">
      <span className="inline-flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5 text-prohealth-secondary" aria-hidden="true" />
        <time dateTime={post.isoDate}>{post.date}</time>
      </span>
      <span aria-hidden="true">•</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-prohealth-secondary" aria-hidden="true" />
        {post.readTime}
      </span>
    </p>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-pill bg-background/95 px-3 py-1 text-xs font-bold text-primary shadow-soft">
      {category}
    </span>
  );
}

/** Large split card for the newest matching article. */
export function FeaturedPostCard({ post }: { post: BlogCardPost }) {
  return (
    <article className={`${CARD_SHELL} flex-col rounded-panel lg:flex-row`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[22rem] lg:w-[55%]">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className={IMAGE_ZOOM}
        />
        <CategoryBadge category={post.category} />
        <ReadChip />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8 lg:p-10">
        <p className="text-eyebrow uppercase text-care">Featured article</p>
        <h3 className={`font-display text-2xl font-bold leading-tight text-prohealth-heading sm:text-3xl ${TITLE_ACCENT}`}>
          <Link href={postHref(post.slug)} className={STRETCHED_LINK}>
            {post.title}
          </Link>
        </h3>
        <p className="text-base leading-relaxed text-prohealth-body">{post.excerpt}</p>
        <Meta post={post} />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <p className="text-sm">
            <span className="block font-semibold text-prohealth-heading">{post.authorName}</span>
            <span className="text-prohealth-muted">{post.authorTitle}</span>
          </p>
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-out-soft motion-safe:group-hover:translate-x-1 motion-safe:group-has-[a:focus-visible]:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Grid card, same look as the home page HealthInsights cards. */
export function PostCard({ post }: { post: BlogCardPost }) {
  return (
    <article className={`${CARD_SHELL} flex-col rounded-card`}>
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={IMAGE_ZOOM}
        />
        <CategoryBadge category={post.category} />
        <ReadChip />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <Meta post={post} />
        <h3 className={`text-lg font-bold leading-snug text-prohealth-heading ${TITLE_ACCENT}`}>
          <Link href={postHref(post.slug)} className={STRETCHED_LINK}>
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-prohealth-body">{post.excerpt}</p>
        <p className="mt-auto pt-2 text-xs font-medium text-prohealth-muted">By {post.authorName}</p>
      </div>
    </article>
  );
}
