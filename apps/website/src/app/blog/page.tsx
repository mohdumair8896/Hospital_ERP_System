import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { BookOpen, ShieldCheck } from 'lucide-react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { BLOG_POSTS, DOCTORS } from '../../data/hospitalData';
import { LISTING_CONTAINER, PageHeader } from '../../components/listing/PageHeader';
import { BlogExplorer } from '../../components/listing/blog/BlogExplorer';
import type { BlogCardPost } from '../../components/listing/blog/PostCards';

export const metadata: Metadata = {
  title: 'Health Insights & Clinical Articles',
  description:
    'Physician-written, peer-reviewed articles from ProHealth specialists on heart health, stroke, joint replacement and childhood immunization.',
};

/** "September 8, 2026" -> "2026-09-08" (local date, no time-zone shift). */
function toIsoDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Newest first; only the fields the cards need go to the client. */
const POSTS: BlogCardPost[] = [...BLOG_POSTS]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(({ slug, title, excerpt, category, authorName, authorTitle, date, readTime, imageUrl, tags }) => ({
    slug,
    title,
    excerpt,
    category,
    authorName,
    authorTitle,
    date,
    isoDate: toIsoDate(date),
    readTime,
    imageUrl,
    tags,
  }));

const AUTHORS = Array.from(new Set(BLOG_POSTS.map((p) => p.authorDoctorId)))
  .map((id) => DOCTORS.find((d) => d.id === id))
  .filter((d): d is (typeof DOCTORS)[number] => Boolean(d));

const REVIEW_BOARD = BLOG_POSTS[0]?.reviewedBy ?? 'ProHealth Clinical Quality & Ethics Board';

function ReviewNote() {
  return (
    <div className="rounded-card border border-border bg-background/90 p-5 shadow-soft">
      <p className="flex items-center gap-2 text-sm font-semibold text-care">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Clinically reviewed
      </p>
      <p className="mt-2 text-sm leading-relaxed text-prohealth-body">
        Every article is written by a ProHealth specialist and reviewed by the {REVIEW_BOARD}.
      </p>
      {AUTHORS.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <ul className="flex -space-x-2" aria-label="Authors">
            {AUTHORS.map((doc) => (
              <li key={doc.id} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-muted">
                <Image src={doc.avatarUrl} alt={doc.name} fill sizes="36px" className="object-cover object-top" />
              </li>
            ))}
          </ul>
          <p className="text-sm text-prohealth-muted">
            {AUTHORS.length} physician {AUTHORS.length === 1 ? 'author' : 'authors'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BlogCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      <PageHeader
        breadcrumb={[{ label: 'Health insights' }]}
        eyebrow="Medical knowledge & research"
        eyebrowIcon={BookOpen}
        title="Health insights from our specialists"
        intro="Clear, evidence-based guides on prevention, treatment and recovery, written by the physicians who treat these conditions every day."
        aside={<ReviewNote />}
      />

      <main className="flex-1 bg-background py-12 sm:py-16" aria-labelledby="articles-heading">
        <div className={LISTING_CONTAINER}>
          <h2 id="articles-heading" className="sr-only">
            Articles
          </h2>
          <BlogExplorer posts={POSTS} />
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
