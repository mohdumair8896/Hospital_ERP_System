"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "@/components/base/icons/untitledui";
import { PaginationPageDefault } from "@/components/application/pagination/pagination";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select } from "@/components/base/select/select";
import { type Article, Simple01Vertical } from "@/components/marketing/blog/base-components/blog-cards";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx } from "@/utils/cx";

const articles: Article[] = [
  {
    id: "article-1",
    title: "Understanding Cardiovascular Risk Factors: Prevention & Early Intervention",
    summary: "How modern cardiology protocols and proactive lipid management save lives and enhance longevity.",
    href: "#",
    category: {
      name: "Cardiology",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    publishedAt: "20 Jan 2026",
    readingTime: "8 min read",
    author: {
      name: "Dr. Sarah Patel",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Cardiology", color: "brand", href: "#" },
      { name: "Research", color: "indigo", href: "#" },
      { name: "Clinical Trials", color: "pink", href: "#" },
    ],
    isFeatured: true,
  },
  {
    id: "article-2",
    title: "Robotic Joint Replacement: Breakthroughs in Minimally Invasive Orthopedics",
    summary: "Sub-millimeter precision in knee and hip arthroplasty enables rapid recovery and superior mobility.",
    href: "#",
    category: {
      name: "Orthopedics",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    publishedAt: "19 Jan 2026",
    readingTime: "6 min read",
    author: {
      name: "Dr. Marcus Vance",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Surgery", color: "blue-light", href: "#" },
      { name: "Robotics", color: "pink", href: "#" },
      { name: "Arthroplasty", color: "pink", href: "#" },
    ],
  },
  {
    id: "article-3",
    title: "Targeted Immunotherapy in Oncology: Shifting Paradigms in Cancer Care",
    summary: "How CAR-T cells and checkpoint inhibitors are reshaping outcomes for refractory hematologic malignancies.",
    href: "#",
    category: {
      name: "Oncology",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    publishedAt: "18 Jan 2026",
    readingTime: "10 min read",
    author: {
      name: "Dr. Priya Nair",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Immunotherapy", color: "success", href: "#" },
      { name: "Oncology", color: "pink", href: "#" },
    ],
  },
  {
    id: "article-3.5",
    title: "Rapid Stroke Recognition: BE-FAST Protocols in Emergency Neurology",
    summary: "Every minute counts in acute cerebral ischemia. How door-to-needle time is minimized in modern ERs.",
    href: "#",
    category: {
      name: "Neurology",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    publishedAt: "17 Jan 2026",
    readingTime: "7 min read",
    author: {
      name: "Dr. James Wilson",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Emergency", color: "brand", href: "#" },
      { name: "Neurology", color: "gray-blue", href: "#" },
    ],
  },
  {
    id: "article-4",
    title: "Childhood Immunizations: Protecting Pediatric Populations Against Outbreaks",
    summary: "Evidence-based pediatric vaccination guidelines for parents and clinicians.",
    href: "#",
    category: {
      name: "Pediatrics",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80",
    publishedAt: "16 Jan 2026",
    readingTime: "5 min read",
    author: {
      name: "Dr. Aisha Al-Mansoor",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Pediatrics", color: "blue-light", href: "#" },
      { name: "Vaccines", color: "indigo", href: "#" },
      { name: "Prevention", color: "orange", href: "#" },
    ],
  },
  {
    id: "article-5",
    title: "Optimizing ICU Nurse-to-Patient Ratios and Reducing Burnout",
    summary: "How clinical workload balancing and automated telemetry reduce cognitive overload in intensive care.",
    href: "#",
    category: {
      name: "Nursing & Operations",
      href: "#",
    },
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    publishedAt: "15 Jan 2026",
    readingTime: "9 min read",
    author: {
      name: "Elena Rostova, RN",
      href: "#",
      avatarUrl: "https://images.unsplash.com/photo-1594824813682-14c1d4a3e7e8?w=150&auto=format&fit=crop&q=80",
    },
    tags: [
      { name: "Operations", color: "brand", href: "#" },
      { name: "Critical Care", color: "indigo", href: "#" },
    ],
  },
];

const tabs = [
  { id: "all", label: "View all" },
  { id: "cardiology", label: "Cardiology" },
  { id: "oncology", label: "Oncology" },
  { id: "surgery", label: "Surgery & Trauma" },
  { id: "pediatrics", label: "Pediatrics" },
];

const sortByOptions = [
  { id: "recent", label: "Most recent" },
  { id: "popular", label: "Most popular" },
  { id: "viewed", label: "Most viewed" },
];

const featuredArticle: Article = {
  id: "article-001",
  category: {
    name: "Medical Innovation",
    href: "#",
  },
  thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&auto=format&fit=crop&q=80",
  title: "Next-Generation Hospital Systems: Cryptographic Integrity & Real-Time Patient Safety",
  summary:
    "How immutable audit logging, enterprise interoperability standards, and real-time FHIR messaging are defining modern clinical infrastructure.",
  href: "#",
  publishedAt: "10 April 2026",
  readingTime: "8 min read",
  author: {
    name: "Dr. Sarah Patel",
    href: "#",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
  },
  tags: [
    { name: "Digital Health", color: "gray", href: "#" },
    { name: "HIPAA Security", color: "gray", href: "#" },
    { name: "Clinical Infrastructure", color: "gray", href: "#" },
  ],
};

export const BlogHeaderFeaturedPost01 = () => {
  const isDesktop = useBreakpoint("lg");
  const [sortBy, setSortBy] = useState(sortByOptions[0].id);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === "all") return true;
    return art.category.name.toLowerCase().includes(selectedCategory);
  });

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="bg-slate-50 dark:bg-slate-900/50 py-12 md:py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex w-full max-w-3xl flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              ProHealth Insights
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              Clinical Resources & Medical Insights
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-slate-400">
              The latest medical discoveries, surgical techniques, hospital leadership, and patient care guides.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 md:gap-14 md:px-8">
        {/* Featured Post Hero */}
        <a
          href={featuredArticle.href}
          className="relative hidden w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md select-none focus-visible:outline-2 focus-visible:outline-blue-600 md:block md:h-[420px] lg:h-[480px] dark:border-slate-800"
        >
          <img
            src={featuredArticle.thumbnailUrl}
            alt={featuredArticle.title}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-24">
            <div className="flex w-full flex-col gap-4 p-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="flex-1 text-xl font-bold text-white md:text-2xl lg:text-3xl">
                    {featuredArticle.title}
                  </p>
                  <ArrowUpRight className="size-6 shrink-0 text-white" />
                </div>
                <p className="line-clamp-2 text-xs text-slate-200 md:text-sm">
                  {featuredArticle.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/20">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm" src={featuredArticle.author.avatarUrl} alt={featuredArticle.author.name} />
                    <p className="text-xs font-semibold text-white">{featuredArticle.author.name}</p>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span>Published: {featuredArticle.publishedAt}</span>
                  </div>
                </div>
                <ul className="flex items-center gap-1.5">
                  {featuredArticle.tags?.map((tag) => (
                    <li
                      key={tag.name}
                      className="rounded-full bg-white/10 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-white ring-1 ring-white/20"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </a>

        {/* Mobile View of Featured Article */}
        <div className="md:hidden">
          <Simple01Vertical article={featuredArticle} />
        </div>

        {/* Categories Tab and Sort Selector */}
        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          <Tabs
            defaultTab="all"
            onTabChange={setSelectedCategory}
            className="w-full md:max-w-2xl"
          >
            <TabList type="underline" size="md" items={tabs} className="overflow-x-auto" />
          </Tabs>

          <div className="w-full sm:w-48 self-end md:self-auto">
            <Select
              aria-label="Sort by"
              size="sm"
              selectedKey={sortBy}
              onSelectionChange={(value) => setSortBy(value as string)}
              items={sortByOptions}
            >
              {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>
        </div>

        {/* Grid of Articles */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <li
              key={article.id}
              className={cx(!isDesktop && index >= 4 && "hidden")}
            >
              <Simple01Vertical article={article} />
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <PaginationPageDefault rounded total={5} page={1} />
      </main>
    </div>
  );
};

export default BlogHeaderFeaturedPost01;
