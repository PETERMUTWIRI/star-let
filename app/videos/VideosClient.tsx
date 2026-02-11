'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaArrowUpRightFromSquare, FaXmark, FaYoutube, FaEye, FaClock } from 'react-icons/fa6';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  category: string;
  thumbnail?: string;
  published: boolean;
  order: number;
  createdAt: string;
}

interface VideosClientProps {
  initialVideos: Video[];
}

const categories = ['All', 'Music Video', 'Live Performance', 'Behind the Scenes', 'Interview', 'Lyric Video'];

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') return initialVideos;
    return initialVideos.filter((v) => v.category === activeCategory);
  }, [activeCategory, initialVideos]);

  const featuredVideo = initialVideos[0];

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section with YouTube Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/LWJn-p6c7IM?autoplay=1&mute=1&loop=1&playlist=LWJn-p6c7IM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute w-full h-full object-cover"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '100vh',
              transform: 'translate(-50%, -50%) scale(1.2)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950" />
        
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" />

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-20">
          <StaggerContainer className="space-y-8">
            <StaggerItem>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-red-400 text-sm font-medium"
              >
                <FaYoutube className="w-4 h-4" />
                Watch & Experience
              </motion.span>
            </StaggerItem>

            <StaggerItem>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight"
              >
                Visual{' '}
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Stories
                </span>
              </motion.h1>
            </StaggerItem>

            <StaggerItem>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
              >
                Official music videos, live performances, and behind-the-scenes moments. 
                Experience the energy, the culture, and the message that moves hearts across continents.
              </motion.p>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <a
                  href="https://www.youtube.com/@RahabKinity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
                >
                  <FaYoutube className="w-5 h-5" />
                  Subscribe on YouTube
                </a>
                <button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Explore Videos
                </button>
              </motion.div>
            </StaggerItem>

            {/* Stats */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center gap-8 pt-8"
              >
                {[
                  { value: initialVideos.length, label: 'Videos' },
                  { value: '500K+', label: 'Views' },
                  { value: '50K+', label: 'Subscribers' },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-gradient-to-b from-red-400 to-purple-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-semibold uppercase tracking-wider text-sm">Featured</span>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <motion.div
                className="relative group cursor-pointer"
                onClick={() => setSelectedVideo(featuredVideo)}
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                  <div className="grid lg:grid-cols-2">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[300px]">
                      <Image
                        src={featuredVideo.thumbnail || getThumbnailUrl(featuredVideo.youtubeId)}
                        alt={featuredVideo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                          whileHover={{ scale: 1.1 }}
                        >
                          <FaPlay className="w-10 h-10 text-white ml-1" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4 w-fit">
                        {featuredVideo.category}
                      </span>
                      
                      <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                        {featuredVideo.title}
                      </h2>
                      
                      {featuredVideo.description && (
                        <p className="text-slate-400 text-lg mb-6">
                          {featuredVideo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <button className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all">
                          <FaPlay className="w-4 h-4" />
                          Watch Now
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaYoutube className="w-5 h-5" />
                          Open on YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="relative sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredVideos.length > 0 ? (
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video, index) => (
                    <StaggerItem key={video.id}>
                      <motion.div
                        className="group h-full cursor-pointer"
                        onClick={() => setSelectedVideo(video)}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative h-full bg-slate-900/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10">
                          {/* Thumbnail */}
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                              alt={video.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                            
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                                <FaPlay className="w-6 h-6 text-white ml-1" />
                              </div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                                {video.category}
                              </span>
                            </div>

                            {/* YouTube Icon */}
                            <div className="absolute bottom-4 right-4">
                              <FaYoutube className="w-8 h-8 text-red-500" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                {video.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                Watch on YouTube
                              </span>
                              <FaArrowUpRightFromSquare className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="text-8xl mb-6">🎬</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No videos found
                  </h3>
                  <p className="text-slate-400">
                    Check back soon for new {activeCategory !== 'All' ? activeCategory.toLowerCase() : ''} content!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
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
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2 z-10"
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
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedVideo.title}
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaYoutube className="w-5 h-5" />
                  Watch on YouTube
                  <FaArrowUpRightFromSquare className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscribe CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-pink-600/20 to-purple-600/20" />
              <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/50" />
              <div className="absolute inset-0 rounded-3xl border border-white/10" />
              
              <div className="relative z-10 text-center">
                <FaYoutube className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Never Miss a Video
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Subscribe to the channel for exclusive behind-the-scenes content, 
                  live performance highlights, and new music video premieres.
                </p>
                <a
                  href="https://www.youtube.com/@RahabKinity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
                >
                  <FaYoutube className="w-5 h-5" />
                  Subscribe Now
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

// Stagger Container and Item components
function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
