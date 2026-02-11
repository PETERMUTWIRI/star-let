'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight, FaClock, FaTag, FaShare, FaBookmark, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

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

interface BlogClientProps {
  initialPosts: BlogPost[];
}

const categories = ['All', 'News', 'Impact Story', 'Event Recap', 'Advocacy', 'Opinion'];

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imgErr, setImgErr] = useState<Set<number>>(new Set());

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;
    
    if (activeCategory !== 'All') {
      posts = posts.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }
    
    return posts;
  }, [initialPosts, activeCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

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
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const handleImageError = (postId: number) => {
    setImgErr(prev => new Set(prev).add(postId));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Subtle Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-blue-600 text-sm font-medium mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Stories & Updates
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Stories
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Discover inspiring narratives of hope, transformation, and community impact. 
                Join us on a journey of faith and positive change.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative sticky top-0 z-40 bg-slate-50/95 backdrop-blur-xl border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredPosts.length > 0 ? (
                <>
                  {/* Featured Post */}
                  {featuredPost && !searchQuery && (
                    <ScrollReveal className="mb-16">
                      <motion.div
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedPost(featuredPost)}
                        whileHover={{ scale: 1.005 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                          <div className="grid lg:grid-cols-2">
                            {/* Image Side */}
                            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]">
                              {featuredPost.cover && !imgErr.has(featuredPost.id) ? (
                                <Image
                                  src={featuredPost.cover}
                                  alt={featuredPost.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  onError={() => handleImageError(featuredPost.id)}
                                  priority
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                  <span className="text-8xl">✍️</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:bg-gradient-to-r" />
                              
                              {/* Category Badge */}
                              <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-bold shadow-lg">
                                  {featuredPost.category}
                                </span>
                              </div>

                              {/* Date Badge */}
                              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                                <div className="text-3xl font-black text-slate-900">
                                  {formatDate(featuredPost.publishedAt).day}
                                </div>
                                <div className="text-sm font-bold text-blue-600 uppercase">
                                  {formatDate(featuredPost.publishedAt).month}
                                </div>
                              </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                              <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                                <span className="flex items-center gap-2">
                                  <FaUser className="text-blue-500" />
                                  {featuredPost.author || 'Staff Writer'}
                                </span>
                                <span className="flex items-center gap-2">
                                  <FaClock className="text-blue-500" />
                                  {getReadingTime(featuredPost.content)} min read
                                </span>
                              </div>

                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                                {featuredPost.title}
                              </h2>
                              
                              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                {featuredPost.excerpt}
                              </p>

                              <div className="flex items-center gap-4">
                                <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                                  Read Story
                                  <FaArrowRight />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                                  <FaBookmark />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </ScrollReveal>
                  )}

                  {/* Posts Grid */}
                  <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(searchQuery ? filteredPosts : otherPosts).map((post) => {
                      const date = formatDate(post.publishedAt);
                      
                      return (
                        <StaggerItem key={post.id}>
                          <motion.div
                            className="group h-full cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative h-full bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                              {/* Image */}
                              <div className="relative aspect-[16/10] overflow-hidden">
                                {post.cover && !imgErr.has(post.id) ? (
                                  <Image
                                    src={post.cover}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={() => handleImageError(post.id)}
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                    <span className="text-5xl">📰</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-sm">
                                    {post.category}
                                  </span>
                                </div>

                                {/* Date */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-sm">
                                  <FaCalendarAlt className="text-blue-300" />
                                  {date.fullDate}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {post.title}
                                </h3>
                                
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                  {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <FaUser className="text-blue-500" />
                                    <span className="truncate max-w-[100px]">
                                      {post.author || 'Staff Writer'}
                                    </span>
                                  </div>
                                  
                                  <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                                    Read
                                    <FaArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="text-8xl mb-6">✍️</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No stories found
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    {searchQuery 
                      ? 'Try a different search term or category'
                      : 'Check back soon for new stories and updates!'
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg text-slate-600 hover:text-slate-900 transition flex items-center justify-center"
              >
                ×
              </button>

              {/* Cover Image */}
              <div className="relative aspect-video">
                {selectedPost.cover && !imgErr.has(selectedPost.id) ? (
                  <Image
                    src={selectedPost.cover}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(selectedPost.id)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-8xl">✍️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-bold shadow-lg">
                    {selectedPost.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {formatDate(selectedPost.publishedAt).fullDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    {selectedPost.author || 'Staff Writer'}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    {getReadingTime(selectedPost.content)} min read
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-8 leading-tight">
                  {selectedPost.title}
                </h2>

                {/* Article Content */}
                <article 
                  className="prose prose-lg prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaShare className="text-blue-500" />
                    Share this story
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                      }}
                      className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition hover:shadow-lg"
                    >
                      Share on Facebook
                    </button>
                    <button 
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(selectedPost.title);
                        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                      }}
                      className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition hover:shadow-lg"
                    >
                      Share on Twitter
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-white border border-slate-200 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaBookmark className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                  Stay Updated
                </h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                  Subscribe to receive the latest stories, updates, and exclusive content 
                  delivered straight to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
