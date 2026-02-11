'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaYoutube, 
  FaPlay,
  FaExternalLinkAlt,
  FaMusic,
  FaHeart
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import Image from 'next/image';

interface Music {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail?: string;
  order: number;
  createdAt: string;
}

interface MusicClientProps {
  music: Music[];
}

const categories = ['All', 'Single', 'Music Video', 'Live Performance', 'Worship', 'Cover', 'Reel/Short'];

export default function MusicClient({ music }: MusicClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const filteredMusic = activeCategory === 'All' 
    ? music 
    : music.filter(m => m.category === activeCategory);

  const featuredMusic = music[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 lg:pb-18 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6"
              >
                Music & Videos
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Rahab Kinity <span className="text-gradient">Music</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Experience worship, live performances, and music videos. Stream on YouTube.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Video */}
      {featuredMusic && (
        <section className="relative py-10 px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-6 text-center">Featured</h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${featuredMusic.youtubeId}`}
                  title={featuredMusic.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white">{featuredMusic.title}</h3>
                <p className="text-slate-400">{featuredMusic.description}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="relative py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/30'
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
      <section className="relative py-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredMusic.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMusic.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div
                    className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                    whileHover={{ y: -8 }}
                  >
                    {/* Thumbnail / Video */}
                    <div className="aspect-video relative overflow-hidden">
                      {playingVideo === item.youtubeId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      ) : (
                        <>
                          <img
                            src={item.thumbnail || `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => setPlayingVideo(item.youtubeId)}
                              className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                              <FaPlay className="w-6 h-6 text-white ml-1" />
                            </button>
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <a
                          href={item.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaYoutube className="w-4 h-4" />
                          Watch on YouTube
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">No music found</h3>
              <p className="text-slate-400">Check back soon for new releases!</p>
            </div>
          )}
        </div>
      </section>

      {/* YouTube Channel CTA */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 text-center overflow-hidden bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/20">
              <div className="relative z-10">
                <FaYoutube className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Subscribe on <span className="text-red-400">YouTube</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Get notified when new music videos, live performances, and worship sessions are released.
                </p>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-600/25"
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
