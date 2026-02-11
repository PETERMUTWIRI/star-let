'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaPlay,
  FaCalendarAlt,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaUsers,
  FaMicrophone
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { GlowButton } from '@/components/MagneticButton';

export default function HomepageHero() {
  return (
    <>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/Rahab.jpeg"
          alt="Rahab Kinity"
          fill
          className="object-cover object-top opacity-40"
          priority
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10" />
      </div>

      {/* Animated Cultural Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" 
        />
      </div>

      {/* Hero Content */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-0 z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Side - Content */}
            <StaggerContainer className="space-y-6 text-center lg:text-left">
              {/* Badge */}
              <StaggerItem>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-400 text-sm font-medium tracking-wide">
                    Available for Bookings 2024/2025
                  </span>
                </motion.div>
              </StaggerItem>

              {/* Main Title */}
              <StaggerItem>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
                    <span className="block text-white mb-2">RAHAB</span>
                    <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                      KINITY
                    </span>
                  </h1>
                </motion.div>
              </StaggerItem>

              {/* Tagline */}
              <StaggerItem>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl md:text-2xl text-slate-300 font-light"
                >
                  <span className="text-amber-400 font-semibold">Singer.</span>{' '}
                  <span className="text-purple-400 font-semibold">Survivor.</span>{' '}
                  <span className="text-cyan-400 font-semibold">Storyteller.</span>
                </motion.p>
              </StaggerItem>

              {/* Description */}
              <StaggerItem>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-slate-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  High-energy performances that bridge cultures, heal hearts, and ignite souls. 
                  From intimate worship nights to stadium stages.
                </motion.p>
              </StaggerItem>

              {/* CTAs */}
              <StaggerItem>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-4"
                >
                  <Link href="/contact">
                    <GlowButton variant="primary" className="group">
                      <FaMicrophone className="w-5 h-5 inline mr-2" />
                      Book Now
                      <FaArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </GlowButton>
                  </Link>
                  <Link href="/videos">
                    <GlowButton variant="secondary">
                      <FaPlay className="w-4 h-4 inline mr-2" />
                      Watch Performances
                    </GlowButton>
                  </Link>
                </motion.div>
              </StaggerItem>

              {/* Quick Stats */}
              <StaggerItem>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-white/10 mt-8"
                >
                  {[
                    { icon: FaHeart, value: 'Cancer', label: 'Survivor' },
                    { icon: FaUsers, value: '100+', label: 'Shows' },
                    { icon: FaStar, value: '5★', label: 'Rated' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                        <stat.icon className="w-4 h-4" />
                        <span className="font-bold text-lg">{stat.value}</span>
                      </div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </StaggerItem>
            </StaggerContainer>

            {/* Right Side - Featured Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-2xl opacity-60" />
                
                {/* Image Container */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="/images/about/Rahab.jpeg"
                    alt="Rahab Kinity Performing"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <Link href="/videos" className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all"
                    >
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  </Link>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-sm italic">
                      &ldquo;Every performance is a celebration of survival.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-xl shadow-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="w-6 h-6 text-white" />
                    <div>
                      <p className="text-white/80 text-xs">Now Booking</p>
                      <p className="text-white font-bold">2024 / 2025</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500 tracking-widest uppercase">Discover</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-700 flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
