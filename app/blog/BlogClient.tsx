// app/blog/BlogClient.tsx - ENTERPRISE SPLIT-VIEW + CAROUSEL + KEYBOARD + SHALLOW-URL
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReadingProgressBar from '@/components/ReadingProgressBar';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  cover: string | null;
  category: string;
  author: string | null;
  publishedAt: string;
  slug: string;
}

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [idx, setIdx] = useState(0);
  const [imgErr, setImgErr] = useState<Set<number>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---------- hydration guard ---------- */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---------- keyboard nav ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx]);

  /* ---------- shallow url update ---------- */
  useEffect(() => {
    if (!mounted) return;
    window.history.replaceState(null, '', `/blog#${posts[idx].slug}`);
  }, [idx, mounted, posts]);

  /* ---------- scroll content to top ---------- */
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [idx]);

  /* ---------- helpers ---------- */
  const navigate = (dir: 'prev' | 'next') =>
    setIdx((i) => (dir === 'prev' ? (i - 1 + posts.length) % posts.length : (i + 1) % posts.length));

  const select = (i: number) => {
    setIdx(i);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (!mounted || !posts.length) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  const active = posts[idx];

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Our Stories</h1>
        </div>
      </header>

      {/* split view */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* left: teaser (sticky on desktop) */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200 p-8 flex flex-col justify-center lg:sticky lg:top-[73px] lg:h-screen lg:overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <span className="inline-block bg-brand-primary/20 text-brand-text px-3 py-1 rounded-full text-sm font-semibold mb-4">{active.category}</span>

            {/* image with fallback */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100">
              {active.cover && !imgErr.has(active.id) ? (
                <Image
                  src={active.cover}
                  alt={active.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImgErr((s) => new Set(s).add(active.id))}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">📰</span>
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{active.title}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <FaUser className="text-gray-400" />
              <span>{active.author || 'Staff Writer'}</span>
              <FaCalendarAlt className="text-gray-400" />
              <span>{formatDate(active.publishedAt)}</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{active.excerpt}</p>

            {/* prev/next */}
            <div className="flex gap-4 mt-8">
              <button onClick={() => navigate('prev')} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition">
                <FaChevronLeft /> Previous
              </button>
              <button onClick={() => navigate('next')} className="flex-1 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-brand-text px-4 py-3 rounded-lg font-semibold transition">
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* right: full content (scrollable) */}
        <div className="w-full lg:w-1/2 bg-white" ref={contentRef}>
          <div className="h-full overflow-y-auto p-8" style={{ maxHeight: 'calc(100vh - 73px)' }}>
            <div className="max-w-2xl mx-auto">
              <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: active.content }} />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this story</h3>
                <div className="flex gap-4">
                  <button className="bg-brand-primary text-brand-text px-4 py-2 rounded-lg hover:bg-brand-dark font-semibold transition">Share on Facebook</button>
                  <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 font-semibold transition">Share on Twitter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* carousel: ALL posts */}
      <div className="bg-gray-100 border-t border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Stories</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {posts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => select(i)}
                className={`flex-shrink-0 group relative w-48 h-32 rounded-lg overflow-hidden transition-all ${
                  i === idx ? 'ring-2 ring-brand-primary scale-105' : 'hover:scale-105 hover:ring-2 hover:ring-brand-primary/50'
                }`}
              >
                {p.cover && !imgErr.has(p.id) ? (
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImgErr((s) => new Set(s).add(p.id))}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white text-sm font-medium line-clamp-2">{p.title}</h4>
                  <p className="text-white/80 text-xs mt-1">{new Date(p.publishedAt).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}