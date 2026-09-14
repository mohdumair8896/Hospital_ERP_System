import * as React from "react";
import { ArrowUpRight } from "@/components/base/icons/untitledui";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { cn } from "@/lib/utils";

export interface ArticleAuthor {
  name: string;
  href?: string;
  avatarUrl: string;
}

export interface ArticleTag {
  name: string;
  color?: string;
  href?: string;
}

export interface ArticleCategory {
  name: string;
  href?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  href: string;
  category: ArticleCategory;
  thumbnailUrl: string;
  publishedAt: string;
  readingTime?: string;
  author: ArticleAuthor;
  tags?: ArticleTag[];
  isFeatured?: boolean;
}

export interface Simple01VerticalProps {
  article: Article;
  className?: string;
}

export function Simple01Vertical({ article, className }: Simple01VerticalProps) {
  return (
    <article className={cn("group flex flex-col items-start gap-4", className)}>
      <a
        href={article.href}
        className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
      >
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge color="brand" size="sm">
            {article.category.name}
          </Badge>
        </div>
      </a>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span>{article.category.name}</span>
          {article.readingTime && (
            <>
              <span>•</span>
              <span className="text-slate-500">{article.readingTime}</span>
            </>
          )}
        </div>

        <a href={article.href} className="group/title flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover/title:text-blue-600 dark:text-slate-100 dark:group-hover/title:text-blue-400 line-clamp-2">
            {article.title}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-blue-600" />
        </a>

        <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {article.summary}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Avatar src={article.author.avatarUrl} alt={article.author.name} size="sm" />
        <div className="text-xs">
          <p className="font-semibold text-slate-900 dark:text-slate-200">{article.author.name}</p>
          <p className="text-slate-500">{article.publishedAt}</p>
        </div>
      </div>
    </article>
  );
}

export default Simple01Vertical;
