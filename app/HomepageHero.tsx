'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaPlay,
  FaHeadphones,
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { Equalizer } from '@/components/MusicVisualizer';
import { GlowButton } from '@/components/MagneticButton';

// Animated floating orbs component
const FloatingOrbs = () => (
  <>
    <div className="orb orb-blue w-96 h-96 -top-48 -left-48 animate-float" style={{ animationDelay: '0s' }} />
    <div className="orb orb-purple w-80 h-80 top-1/4 -right-40 animate-float" style={{ animationDelay: '2s' }} />
    <div className="orb orb-mixed w-64 h-64 bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '4s' }} />
  </>
);

export default function HomepageHero() {
  return (
    <>
      {/* Background Effects */}
      <FloatingOrbs />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <StaggerContainer className="space-y-8">
            {/* Pre-title */}
            <StaggerItem>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-blue-400 font-medium tracking-[0.3em] uppercase text-sm"
              >
                Kenyan Singer • Songwriter • Performer
              </motion.p>
            </StaggerItem>

            {/* Main Title */}
            <StaggerItem>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
              >
                <span className="text-gradient text-glow">RAHAB KINITY</span>
              </motion.h1>
            </StaggerItem>

            {/* Subtitle */}
            <StaggerItem>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
              >
                From Kenya to America—bringing unity, hope & healing through 
                <span className="text-purple-400">high-energy performances that move the soul</span>
              </motion.p>
            </StaggerItem>

            {/* Streaming Links */}
            <StaggerItem>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center gap-6 pt-8"
              >
                {[
                  { icon: FaSpotify, label: 'Spotify', href: '#' },
                  { icon: FaApple, label: 'Apple Music', href: '#' },
                  { icon: FaYoutube, label: 'YouTube', href: '#' },
                ].map((platform) => (
                  <a
                    key={platform.label}
                    href={platform.href}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-all duration-300"
                  >
                    <platform.icon className="w-5 h-5 text-blue-400 group-hover:text-purple-400 transition-colors" />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {platform.label}
                    </span>
                  </a>
                ))}
              </motion.div>
            </StaggerItem>

            {/* CTA Buttons */}
            <StaggerItem>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
              >
                <Link href="/music">
                  <GlowButton variant="primary">
                    <FaHeadphones className="w-5 h-5 inline mr-2" />
                    Listen Now
                  </GlowButton>
                </Link>
                <Link href="/videos">
                  <GlowButton variant="secondary">
                    <FaPlay className="w-4 h-4 inline mr-2" />
                    Watch Videos
                  </GlowButton>
                </Link>
              </motion.div>
            </StaggerItem>
            
            {/* Equalizer Visual */}
            <StaggerItem>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex justify-center pt-12"
              >
                <Equalizer />
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
