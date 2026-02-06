'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaInstagram, 
  FaTwitter,
  FaMusic,
  FaMicrophone,
  FaChurch,
  FaGlobeAfrica,
  FaHeart,
  FaHands,
  FaQuoteLeft,
  FaStar,
  FaCross
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

const musicalInfluences = [
  { name: 'Gospel', icon: FaChurch },
  { name: 'Worship', icon: FaHands },
  { name: 'African Traditional', icon: FaGlobeAfrica },
  { name: 'Contemporary', icon: FaMusic },
  { name: 'Soul', icon: FaHeart },
];

const careerHighlights = [
  {
    year: '2024',
    title: 'Imani Yangu Album',
    description: 'Released multilingual gospel album featuring songs in English and Swahili, touching hearts across continents.',
  },
  {
    year: '2023',
    title: 'East African Tour',
    description: 'Blessed audiences in Kenya, Tanzania, and Uganda with powerful worship experiences.',
  },
  {
    year: '2022',
    title: 'Gospel Music Award',
    description: 'Recognized for Excellence in Multilingual Worship Music at the African Gospel Awards.',
  },
  {
    year: '2021',
    title: 'YouTube Breakthrough',
    description: 'Worship medley "Mungu Mkuu" reached 5M+ views, inspiring believers worldwide.',
  },
  {
    year: '2020',
    title: 'Ministry Begins',
    description: 'Answered the call to gospel music ministry, dedicating her voice to spreading faith and hope.',
  },
];

const pressQuotes = [
  {
    source: 'Gospel Today Magazine',
    quote: 'A powerful voice that bridges cultures through worship. Starlet embodies the universal language of faith.',
    rating: 5,
  },
  {
    source: 'African Christian Voice',
    quote: 'Her Swahili worship songs have become anthems in churches across East Africa and beyond.',
    rating: 5,
  },
  {
    source: 'Christian Music Weekly',
    quote: 'One of the most authentic gospel voices of our time, delivering messages that truly awaken the soul.',
    rating: 5,
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <ScrollReveal>
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                
                {/* Main Image */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glow-mixed">
                  <Image
                    src="/images/about/Rahab.jpeg"
                    alt="Starlet - Gospel Artist"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats */}
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-gradient-card rounded-2xl p-6 glow-purple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-bold text-gradient">2M+</div>
                  <div className="text-sm text-slate-400">Souls Reached</div>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Content Side */}
            <div className="space-y-8">
              <ScrollReveal>
                <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <FaCross className="w-3 h-3 inline mr-2" />
                  Gospel Artist & Worship Leader
                </span>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-5xl md:text-6xl font-bold">
                  The Voice of <span className="text-gradient">Faith</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                  <p>
                    <span className="text-amber-400 font-medium">Starlet</span> is more than a musician—she is a 
                    vessel of divine inspiration, called to spread the gospel through the universal language of music. 
                    Singing fluently in both <span className="text-cyan-400">English</span> and{' '}
                    <span className="text-cyan-400">Swahili</span>, she bridges cultures and continents, 
                    touching souls from Nairobi to New York.
                  </p>
                  <p>
                    Her journey began in the church choir, where the power of worship first stirred her spirit. 
                    Today, her music blends traditional African gospel with contemporary worship, creating a sound 
                    that is both deeply rooted and refreshingly modern.
                  </p>
                  <p className="border-l-4 border-amber-500/50 pl-4 italic text-slate-400">
                    "When I stand before an audience, I don&apos;t see strangers—I see souls seeking connection 
                    with the divine. My purpose is to be that bridge, to help every listener find their way home 
                    through worship."
                  </p>
                </div>
              </ScrollReveal>
              
              {/* Ministry Focus */}
              <ScrollReveal delay={0.25}>
                <div className="flex flex-wrap gap-2">
                  {['Soul Healing', 'Faith Building', 'Multilingual Worship', 'Community Upliftment'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex gap-4">
                  {[
                    { icon: FaInstagram, href: '#', label: 'Instagram' },
                    { icon: FaTwitter, href: '#', label: 'Twitter' },
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
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Musical Influences */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Musical <span className="text-gradient">Influences</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                A fusion of genres that creates the unique Starlet sound
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {musicalInfluences.map((influence, index) => (
              <ScrollReveal key={influence.name} delay={index * 0.1}>
                <motion.div 
                  className="card-premium text-center group cursor-default"
                  whileHover={{ y: -8 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
                    <influence.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">{influence.name}</h3>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career Highlights Timeline */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Career <span className="text-gradient">Highlights</span>
              </h2>
              <p className="text-slate-400">The journey so far</p>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent" />

            {careerHighlights.map((highlight, index) => (
              <ScrollReveal key={highlight.year} delay={index * 0.15}>
                <motion.div 
                  className={`relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Year Bubble */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-10 shadow-lg shadow-purple-500/25">
                    <span className="text-sm font-bold text-white">{highlight.year}</span>
                  </div>

                  {/* Content */}
                  <div className={`ml-24 md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'
                  }`}>
                    <div className="card-premium">
                      <h3 className="text-xl font-bold text-white mb-2">{highlight.title}</h3>
                      <p className="text-slate-400">{highlight.description}</p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-5/12" />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Press Quotes */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Press <span className="text-gradient">Reviews</span>
              </h2>
              <p className="text-slate-400">What the critics are saying</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {pressQuotes.map((item, index) => (
              <ScrollReveal key={item.source} delay={index * 0.1}>
                <div className="card-premium relative">
                  <FaQuoteLeft className="w-10 h-10 text-blue-500/30 mb-4" />
                  <p className="text-slate-300 mb-6 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.source}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating) 
                              ? 'text-yellow-500' 
                              : 'text-slate-700'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Booking Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20" />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient" style={{ backgroundSize: '200% 100%' }} />

              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Partner in <span className="text-gradient">Ministry</span>
                </h2>
                <p className="text-slate-400 mb-12 max-w-xl mx-auto">
                  For ministry invitations, event bookings, or to connect. Let&apos;s spread the gospel together.
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <a 
                    href="mailto:booking@starletmusic.com"
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <MdEmail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Booking</p>
                      <p className="text-white font-medium">booking@starletmusic.com</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:press@starletmusic.com"
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <MdEmail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Press</p>
                      <p className="text-white font-medium">press@starletmusic.com</p>
                    </div>
                  </a>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-slate-500 mb-4">Ministry Base</p>
                  <p className="text-white">Starlet Gospel Ministry</p>
                  <p className="text-slate-400 text-sm mt-1">Reaching souls worldwide 🌍</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
