'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { FaPlay, FaClock, FaEye, FaHeart, FaShareAlt, FaYoutube } from 'react-icons/fa';

// Video data
const videos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Midnight Dreams - Official Video',
    category: 'Music Video',
    views: '12M',
    duration: '3:42',
    date: 'Jan 2024',
    description: 'Official music video for the hit single Midnight Dreams. Shot in Los Angeles.',
  },
  {
    id: 'abc123def',
    title: 'Live at The Fillmore',
    category: 'Live Performance',
    views: '2.5M',
    duration: '45:30',
    date: 'Dec 2023',
    description: 'Full live performance from the Golden Hour tour.',
  },
  {
    id: 'xyz789abc',
    title: 'Behind the Scenes: Making of Midnight Dreams',
    category: 'Behind the Scenes',
    views: '850K',
    duration: '12:15',
    date: 'Jan 2024',
    description: 'An exclusive look at the creative process behind the album.',
  },
  {
    id: 'def456ghi',
    title: 'Acoustic Sessions: Golden Hour',
    category: 'Live Performance',
    views: '1.8M',
    duration: '4:20',
    date: 'Nov 2023',
    description: 'Stripped down acoustic version of Golden Hour.',
  },
  {
    id: 'ghi789jkl',
    title: 'Rahab Kinity - Interview with MTV',
    category: 'Interview',
    views: '500K',
    duration: '8:45',
    date: 'Oct 2023',
    description: 'Deep dive into the inspiration behind the latest album.',
  },
  {
    id: 'jkl012mno',
    title: 'Electric Soul - Lyric Video',
    category: 'Music Video',
    views: '3.2M',
    duration: '3:30',
    date: 'Sep 2023',
    description: 'Official lyric video with stunning visuals.',
  },
];

const categories = ['All', 'Music Video', 'Live Performance', 'Behind the Scenes', 'Interview'];

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6"
              >
                Visual Experience
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Watch & <span className="text-gradient">Experience</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Official music videos, live performances, and exclusive behind-the-scenes content.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Video */}
      <section className="relative py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden glow-mixed group cursor-pointer" onClick={() => setSelectedVideo(videos[0].id)}>
              {/* Thumbnail Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <FaPlay className="w-10 h-10 text-white ml-2" />
                  </motion.div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/30 text-blue-300 border border-blue-500/40 mb-3">
                    Featured
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{videos[0].title}</h2>
                  <p className="text-slate-300 mb-4 max-w-2xl">{videos[0].description}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <FaEye className="w-4 h-4" /> {videos[0].views} views
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" /> {videos[0].duration}
                    </span>
                    <span>{videos[0].date}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:border-blue-500/30 hover:text-white'
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
      <section className="relative py-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredVideos.slice(1).map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <div className="card-premium overflow-hidden">
                    {/* Thumbnail */}
                    <div className="aspect-video relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                          <FaPlay className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-xs text-white">
                        {video.duration}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/80 text-white backdrop-blur-sm">
                          {video.category}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{video.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaEye className="w-3 h-3" /> {video.views}
                        </span>
                        <span>{video.date}</span>
                      </div>
                      <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <FaShareAlt className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden glow-mixed"
            onClick={(e) => e.stopPropagation()}
          >
            {/* YouTube Embed Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="text-center">
                <FaYoutube className="w-20 h-20 text-red-600 mx-auto mb-4" />
                <p className="text-slate-400">YouTube Video: {selectedVideo}</p>
                <p className="text-sm text-slate-600 mt-2">Click outside to close</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Subscribe CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-purple-600/20 to-blue-600/20" />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" />
              
              <div className="relative z-10">
                <FaYoutube className="w-16 h-16 text-red-600 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Subscribe on <span className="text-gradient">YouTube</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Get notified when new videos drop. Join 500K+ subscribers for exclusive content.
                </p>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
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
