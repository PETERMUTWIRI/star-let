'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaPlay,
  FaHeadphones,
  FaArrowRight,
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { Equalizer } from '@/components/MusicVisualizer';
import { GlowButton } from '@/components/MagneticButton';

export default function HomepageHero() {
  return (
    <>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <StaggerContainer className="space-y-6">
            {/* Pre-title */}
            <StaggerItem>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-amber-400 font-medium tracking-[0.2em] uppercase text-sm"
              >
                Singer, Writer and Actor
              </motion.p>
            </StaggerItem>

            {/* Main Title */}
            <StaggerItem>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
              >
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                  RAHAB KINITY
                </span>
              </motion.h1>
            </StaggerItem>

            {/* Tagline */}
            <StaggerItem>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl lg:text-3xl text-white font-light tracking-wide"
              >
                Heritage. Healing. Hope.
              </motion.p>
            </StaggerItem>

            {/* Description */}
            <StaggerItem>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
              >
                Crafting performances that move the soul and transcend boundaries.
              </motion.p>
            </StaggerItem>

            {/* CTA Buttons */}
            <StaggerItem>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
              >
                <Link href="/music">
                  <GlowButton variant="primary" className="group">
                    <FaHeadphones className="w-5 h-5 inline mr-2" />
                    Listen Now
                    <FaArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
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
                transition={{ duration: 0.8, delay: 0.7 }}
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
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-700 flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-gradient-to-b from-amber-400 to-purple-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
