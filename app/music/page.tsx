'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaPlay, 
  FaPause,
  FaExternalLinkAlt,
  FaClock,
  FaHeart,
  FaShareAlt,
  FaMusic
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem, ScaleIn } from '@/components/ScrollReveal';
import { SoundWave } from '@/components/MusicVisualizer';
import { GradientText } from '@/components/TextScramble';
import { GlowButton } from '@/components/MagneticButton';
import { useState } from 'react';

// Album data
const albums = [
  {
    id: 1,
    title: 'Midnight Dreams',
    year: '2024',
    cover: '/albums/midnight-dreams.jpg',
    description: 'A dreamy exploration of late-night thoughts and emotions, blending indie pop with electronic elements.',
    tracks: [
      { title: 'Midnight Dreams', duration: '3:42', plays: '12M+' },
      { title: 'Neon Lights', duration: '3:15', plays: '8.5M+' },
      { title: 'City of Stars', duration: '4:01', plays: '6.2M+' },
      { title: 'Echoes', duration: '3:28', plays: '4.8M+' },
      { title: 'Falling', duration: '3:55', plays: '5.1M+' },
    ],
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Golden Hour',
    year: '2023',
    cover: '/albums/golden-hour.jpg',
    description: 'An acoustic journey through moments of reflection and discovery.',
    tracks: [
      { title: 'Golden Hour', duration: '3:20', plays: '15M+' },
      { title: 'Sunset Boulevard', duration: '3:45', plays: '9M+' },
      { title: 'Morning Light', duration: '3:10', plays: '7.5M+' },
      { title: 'Summer Breeze', duration: '3:33', plays: '6.8M+' },
    ],
    color: 'from-orange-400 to-pink-500',
  },
  {
    id: 3,
    title: 'Electric Soul',
    year: '2022',
    cover: '/albums/electric-soul.jpg',
    description: 'High-energy anthems that make you want to dance all night.',
    tracks: [
      { title: 'Electric', duration: '3:30', plays: '20M+' },
      { title: 'Pulse', duration: '3:15', plays: '14M+' },
      { title: 'Heartbeat', duration: '3:45', plays: '11M+' },
      { title: 'Energy', duration: '3:20', plays: '9M+' },
    ],
    color: 'from-purple-500 to-pink-600',
  },
];

const singles = [
  { title: 'Starlight', year: '2024', plays: '5M+' },
  { title: 'Ocean Eyes', year: '2023', plays: '8M+' },
  { title: 'Fireflies', year: '2023', plays: '6.5M+' },
  { title: 'Waves', year: '2022', plays: '4M+' },
];

export default function MusicPage() {
  const [activeAlbum, setActiveAlbum] = useState(albums[0]);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6"
              >
                Discography
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Music & <GradientText>Albums</GradientText>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Stream and download all releases. Available on all major platforms.
              </p>
              
              {/* Sound Wave Visual */}
              <div className="flex justify-center">
                <SoundWave />
              </div>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { label: 'Total Streams', value: '50M+' },
              { label: 'Albums', value: '3' },
              { label: 'Singles', value: '12' },
              { label: 'Countries', value: '180+' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-card"
              >
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Album */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Album Selector */}
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Featured Albums</h2>
                {albums.map((album) => (
                  <motion.div
                    key={album.id}
                    onClick={() => setActiveAlbum(album)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeAlbum.id === album.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${album.color} flex items-center justify-center`}>
                        <FaMusic className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${activeAlbum.id === album.id ? 'text-white' : 'text-slate-300'}`}>
                          {album.title}
                        </h3>
                        <p className="text-sm text-slate-500">{album.year}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-500">{album.tracks.length} tracks</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Active Album Detail */}
            <ScrollReveal delay={0.2}>
              <div className="sticky top-32">
                <div className="relative">
                  {/* Album Cover */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-8 glow-mixed">
                    <div className={`absolute inset-0 bg-gradient-to-br ${activeAlbum.color} flex items-center justify-center`}>
                      <FaMusic className="w-32 h-32 text-white/50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">{activeAlbum.title}</h3>
                      <p className="text-slate-300">{activeAlbum.description}</p>
                    </div>
                  </div>

                  {/* Streaming Links */}
                  <div className="flex gap-3 mb-8">
                    {[
                      { icon: FaSpotify, name: 'Spotify' },
                      { icon: FaApple, name: 'Apple Music' },
                      { icon: FaYoutube, name: 'YouTube' },
                    ].map((platform) => (
                      <a
                        key={platform.name}
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-sm"
                      >
                        <platform.icon className="w-4 h-4" />
                        <span className="text-slate-300">{platform.name}</span>
                      </a>
                    ))}
                  </div>

                  {/* Tracklist */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold mb-4 text-slate-300">Tracklist</h4>
                    {activeAlbum.tracks.map((track, index) => (
                      <motion.div
                        key={track.title}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group"
                        onMouseEnter={() => setHoveredTrack(index)}
                        onMouseLeave={() => setHoveredTrack(null)}
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          {hoveredTrack === index ? (
                            <FaPlay className="w-3 h-3 text-blue-400" />
                          ) : (
                            <span className="text-sm text-slate-500">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                            {track.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{track.plays}</span>
                          <span>{track.duration}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Singles Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular <span className="text-gradient">Singles</span>
              </h2>
              <p className="text-slate-400">Standalone releases that define the sound</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {singles.map((single, index) => (
              <ScrollReveal key={single.title} delay={index * 0.1}>
                <motion.div 
                  className="card-premium group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FaMusic className="w-16 h-16 text-slate-700 group-hover:text-blue-400 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
                        <FaPlay className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{single.title}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{single.year}</span>
                    <span>{single.plays}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Streaming Platforms CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 text-center overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30" />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient" style={{ backgroundSize: '200% 100%' }} />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Listen <span className="text-gradient">Everywhere</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Available on all major streaming platforms. Choose your favorite and start listening.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { icon: FaSpotify, name: 'Spotify', color: 'hover:bg-green-500/20 hover:border-green-500/50' },
                    { icon: FaApple, name: 'Apple Music', color: 'hover:bg-red-500/20 hover:border-red-500/50' },
                    { icon: FaYoutube, name: 'YouTube Music', color: 'hover:bg-red-600/20 hover:border-red-600/50' },
                  ].map((platform) => (
                    <a
                      key={platform.name}
                      href="#"
                      className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 ${platform.color} transition-all group`}
                    >
                      <platform.icon className="w-6 h-6" />
                      <span className="font-medium">{platform.name}</span>
                      <FaExternalLinkAlt className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
