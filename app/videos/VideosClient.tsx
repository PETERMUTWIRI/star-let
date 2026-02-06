'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaExternalLinkAlt, FaXmark } from 'react-icons/fa6';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  category: string;
  thumbnail: string | null;
  published: boolean;
  order: number;
  createdAt: string;
}

interface VideosClientProps {
  initialVideos: Video[];
}

const categories = ['All', 'Music Video', 'Live Performance', 'Behind the Scenes'];

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') return initialVideos;
    return initialVideos.filter((v) => v.category === activeCategory);
  }, [activeCategory, initialVideos]);

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <span className="inline-block text-cyan-600 font-semibold tracking-wider uppercase text-sm mb-4">
              Watch & Listen
            </span>
            <h1 className="text-display text-brand-text mb-6">
              Videos
            </h1>
            <p className="text-body-large text-brand-text/70 max-w-2xl mx-auto">
              Experience the music through our official videos, live performances, and exclusive behind-the-scenes content.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-30 bg-brand-background/80 backdrop-blur-md border-b border-brand-text/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-brand-primary text-brand-text shadow-lg scale-105'
                      : 'bg-white/50 text-brand-text/70 hover:bg-white hover:text-brand-text'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div
                    className="group card-lift bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <FaPlay className="text-brand-text text-xl ml-1" />
                        </div>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-brand-primary/90 text-brand-text text-xs font-semibold rounded-full">
                          {video.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-title text-brand-text mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-brand-text/60 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">
                No videos found
              </h3>
              <p className="text-brand-text/60">
                Check back soon for new {activeCategory !== 'All' ? activeCategory.toLowerCase() : ''} content!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-brand-primary transition-colors p-2"
                aria-label="Close video"
              >
                <FaXmark className="text-3xl" />
              </button>

              {/* Video container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* Video info */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedVideo.title}
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-primary hover:text-white transition-colors"
                >
                  <FaExternalLinkAlt className="text-sm" />
                  Watch on YouTube
                </a>
              </div>

              {/* Caption */}
              <p className="text-white/60 text-center mt-4 text-sm">
                Press ESC or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
