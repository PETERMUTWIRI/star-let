'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal, { StaggerContainer, StaggerItem, ScaleIn } from '@/components/ScrollReveal';
import { StatCard } from '@/components/AnimatedCounter';
import { GradientText } from '@/components/TextScramble';
import { Equalizer } from '@/components/MusicVisualizer';
import { GlowButton } from '@/components/MagneticButton';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaInstagram, 
  FaTwitter, 
  FaTiktok,
  FaPlay,
  FaHeadphones,
  FaCalendar,
  FaArrowRight,
  FaMusic,
  FaUsers,
  FaCompactDisc
} from 'react-icons/fa';

// Animated floating orbs component
const FloatingOrbs = () => (
  <>
    <div className="orb orb-blue w-96 h-96 -top-48 -left-48 animate-float" style={{ animationDelay: '0s' }} />
    <div className="orb orb-purple w-80 h-80 top-1/4 -right-40 animate-float" style={{ animationDelay: '2s' }} />
    <div className="orb orb-mixed w-64 h-64 bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '4s' }} />
  </>
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
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
      <section className="relative min-h-screen flex items-center justify-center px-6">
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
                Gospel Artist • Worship Leader • Multilingual (English & Swahili)
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
                Awakening souls through worship in English & Swahili, 
                <span className="text-purple-400"> spreading faith across continents</span>
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

      {/* Latest Release Section - Soul Awakening */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Artist Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-3xl opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glow-mixed">
                  <Image
                    src="/images/about/Rahab.jpeg"
                    alt="Rahab Kinity - Gospel Artist"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                  
                  {/* Quote Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/90 text-sm italic font-light">
                      "Music that transcends boundaries, touching souls in every language"
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Soul Awakening Message */}
              <div className="space-y-6">
                <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🙏 Gospel • Multilingual • Soul-Stirring
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="text-gradient">Awaken Your Spirit</span>
                  <span className="block text-2xl md:text-3xl text-amber-400 mt-2 font-light italic">
                    "Imani Yangu" / My Faith
                  </span>
                </h2>
                
                <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                  <p>
                    Through the power of gospel music, <span className="text-amber-400 font-medium">Rahab Kinity</span> bridges 
                    cultures and languages—singing in both <span className="text-cyan-400">English</span> and{' '}
                    <span className="text-cyan-400">Swahili</span> to reach hearts across the world.
                  </p>
                  
                  <p className="border-l-4 border-amber-500/50 pl-4 italic text-slate-400">
                    "My music is not just entertainment—it is a calling to heal, uplift, and awaken 
                    the divine spirit within every listener. From the villages of Kenya to the cities 
                    of America, we are all united by faith."
                  </p>
                  
                  <p>
                    Whether you understand every word or simply feel the melody, her voice carries 
                    a message of <span className="text-purple-400">hope</span>,{' '}
                    <span className="text-purple-400">love</span>, and{' '}
                    <span className="text-purple-400">spiritual transformation</span>.
                  </p>
                </div>
                
                {/* Language Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['English', 'Swahili', 'Gospel', 'Worship', 'Inspirational'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Streaming Platforms */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    { icon: FaSpotify, name: 'Spotify' },
                    { icon: FaApple, name: 'Apple Music' },
                    { icon: FaYoutube, name: 'YouTube' },
                  ].map((platform) => (
                    <a
                      key={platform.name}
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all"
                    >
                      <platform.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{platform.name}</span>
                    </a>
                  ))}
                </div>

                <Link 
                  href="/music" 
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-purple-400 transition-colors pt-4 group"
                >
                  Experience The Music
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>By The Numbers</GradientText>
            </h2>
            <p className="text-slate-400">Our journey in music so far</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FaHeadphones}
              value={50}
              label="Million Streams"
              suffix="M+"
            />
            <StatCard
              icon={FaCompactDisc}
              value={3}
              label="Albums Released"
            />
            <StatCard
              icon={FaCalendar}
              value={156}
              label="Shows Performed"
              suffix="+"
            />
            <StatCard
              icon={FaUsers}
              value={1.2}
              decimals={1}
              label="Million Followers"
              suffix="M+"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Shows Preview */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-4">
                On Tour
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Upcoming <span className="text-gradient">Shows</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Experience the music live. Get your tickets now before they sell out.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { date: 'MAR 15', venue: 'The Fillmore', city: 'San Francisco, CA', status: 'On Sale' },
              { date: 'MAR 22', venue: 'The Troubadour', city: 'Los Angeles, CA', status: 'Selling Fast' },
              { date: 'APR 05', venue: 'The Sinclair', city: 'Boston, MA', status: 'On Sale' },
            ].map((show, index) => (
              <ScrollReveal key={show.date} delay={index * 0.1}>
                <div className="card-premium group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gradient">{show.date}</span>
                      <span className="block text-sm text-slate-400">2024</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      show.status === 'Selling Fast' 
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {show.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {show.venue}
                  </h3>
                  <p className="text-slate-400 mb-4">{show.city}</p>
                  <Link 
                    href="/events" 
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Get Tickets
                    <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events" className="btn-secondary">
              View All Shows
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20" />
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xl" />
              
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-3xl border border-gradient p-[1px]" 
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.5))',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Stay in the <span className="text-gradient">Loop</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Get exclusive access to new releases, behind-the-scenes content, 
                  and early ticket announcements.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Subscribe
                  </button>
                </form>

                <p className="text-xs text-slate-500 mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Social Links */}
      <section className="relative py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-slate-400">Follow the journey</p>
            <div className="flex items-center gap-6">
              {[
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaTiktok, href: '#', label: 'TikTok' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
