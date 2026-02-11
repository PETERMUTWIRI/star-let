'use client';

import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaClock, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface BlogPost {
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

interface HomepageBlogSectionProps {
  latestPost: BlogPost | null;
}

export default function HomepageBlogSection({ latestPost }: HomepageBlogSectionProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };
  };

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  if (!latestPost) {
    return (
      <section className="relative py-24 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6">
              <FaBookOpen className="w-4 h-4" />
              Latest Story
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              From the <span className="text-gradient">Blog</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Check back soon for inspiring stories and updates!
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6">
            <FaBookOpen className="w-4 h-4" />
            Latest Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From the <span className="text-gradient">Blog</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            className="relative group max-w-4xl mx-auto"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
              <div className="grid md:grid-cols-2">
                {/* Image Side */}
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]">
                  {latestPost.cover ? (
                    <Image
                      src={latestPost.cover}
                      alt={latestPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                      <span className="text-8xl">✍️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold border border-white/20">
                      {latestPost.category}
                    </span>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                    <div className="text-3xl font-black text-white">
                      {formatDate(latestPost.publishedAt).day}
                    </div>
                    <div className="text-sm font-bold text-blue-400 uppercase">
                      {formatDate(latestPost.publishedAt).month}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <FaUser className="text-blue-400" />
                      {latestPost.author || 'Staff Writer'}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-blue-400" />
                      {getReadingTime(latestPost.content)} min read
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-400" />
                      {formatDate(latestPost.publishedAt).fullDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 leading-tight">
                    {latestPost.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-400 leading-relaxed mb-6 line-clamp-4">
                    {latestPost.excerpt}
                  </p>

                  {/* Read More Button */}
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 w-fit"
                  >
                    Read More
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
