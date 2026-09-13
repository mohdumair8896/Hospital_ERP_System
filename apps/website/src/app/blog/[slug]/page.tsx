import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopEmergencyBar from '../../../components/TopEmergencyBar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmergencyFAB from '../../../components/EmergencyFAB';
import { BLOG_POSTS, DOCTORS } from '../../../data/hospitalData';
import { 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  BookOpen, 
  Stethoscope 
} from 'lucide-react';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: `${post.title} | ProHealth Health Insights`,
    description: post.excerpt,
  };
}

export default function BlogPostReaderPage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const authorDoc = DOCTORS.find((d) => d.id === post.authorDoctorId);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Article Header */}
      <header className="relative py-16 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-4 relative">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-[#1F5084]">Health Insights</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084]">{post.category}</span>
          </nav>

          <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#1F5084] bg-[#1F5084]/10 px-2.5 py-1 rounded border border-[#1F5084]/20">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-[#1D2939] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
            <div>Authored by: <strong className="text-[#1D2939]">{post.authorName}</strong></div>
            <span>•</span>
            <div>{post.date}</div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1F5084]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Reader Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-14 flex-1 w-full space-y-10">
        {/* Cover Photo */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        {/* Medically Reviewed Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Medically Reviewed & Fact-Checked:</strong> This clinical guidance was peer-reviewed by the{' '}
            <span className="font-semibold">{post.reviewedBy}</span> to ensure adherence to contemporary medical evidence.
          </div>
        </div>

        {/* Article Body Paragraphs */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          {post.content.map((para, i) => (
            <p key={i} className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Topics:</span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Physician Author Card & Booking CTA */}
        {authorDoc && (
          <div className="bg-[#1F5084] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
            <img
              src={authorDoc.avatarUrl}
              alt={authorDoc.name}
              className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-white/20"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-sky-200">
                Author &amp; Specialist
              </div>
              <h3 className="text-lg font-bold font-display">{authorDoc.title}</h3>
              <p className="text-xs text-sky-100 leading-relaxed line-clamp-2">
                {authorDoc.bio}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  href={`/appointments?doc=${authorDoc.id}`}
                  className="bg-white hover:bg-sky-50 text-[#1F5084] font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  Book with {authorDoc.name}
                </Link>
                <Link
                  href={`/doctors/${authorDoc.id}`}
                  className="text-xs font-semibold text-sky-200 hover:text-white underline"
                >
                  View Full Credentials
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Health Insights</span>
          </Link>
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
