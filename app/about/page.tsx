'use client';

import { motion } from 'framer-motion';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaInstagram, 
  FaTwitter,
  FaMusic,
  FaMicrophone,
  FaGuitar,
  FaDrum,
  FaHeadphones,
  FaQuoteLeft,
  FaStar
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

const musicalInfluences = [
  { name: 'Alternative Rock', icon: FaGuitar },
  { name: 'Indie Pop', icon: FaMusic },
  { name: 'Electronic', icon: FaHeadphones },
  { name: 'R&B', icon: FaMicrophone },
  { name: 'Folk', icon: FaDrum },
];

const careerHighlights = [
  {
    year: '2024',
    title: 'Midnight Dreams Release',
    description: 'Debuted at #3 on Billboard Indie Charts with over 50M streams worldwide.',
  },
  {
    year: '2023',
    title: 'Sold-Out Tour',
    description: 'Golden Hour Tour sold out 25 shows across North America and Europe.',
  },
  {
    year: '2023',
    title: 'Award Nomination',
    description: 'Nominated for Best New Artist at the Independent Music Awards.',
  },
  {
    year: '2022',
    title: 'Viral Breakthrough',
    description: 'First single "Electric" went viral on TikTok with 10M+ views.',
  },
  {
    year: '2021',
    title: 'First Release',
    description: 'Released debut EP "Beginnings" independently, gaining 100K+ streams.',
  },
];

const pressQuotes = [
  {
    source: 'Rolling Stone',
    quote: 'A voice that captures the essence of a generation. Starlet is the real deal.',
    rating: 5,
  },
  {
    source: 'Billboard',
    quote: 'Midnight Dreams is a masterpiece of modern indie pop. Pure sonic beauty.',
    rating: 5,
  },
  {
    source: 'Pitchfork',
    quote: 'One of the most exciting new artists to emerge in 2024.',
    rating: 4.5,
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
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                
                {/* Main Image */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glow-mixed">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <FaMusic className="w-32 h-32 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-600">Artist Photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats */}
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-gradient-card rounded-2xl p-6 glow-purple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-bold text-gradient">5M+</div>
                  <div className="text-sm text-slate-400">Monthly Listeners</div>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Content Side */}
            <div className="space-y-8">
              <ScrollReveal>
                <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  About the Artist
                </span>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-5xl md:text-6xl font-bold">
                  The Story of <span className="text-gradient">Starlet</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                  <p>
                    Born from the quiet streets of a small town and raised by the rhythm of city lights, 
                    Starlet emerged as a voice for those who dream in melodies. What started as late-night 
                    songwriting sessions in a bedroom studio has evolved into a global phenomenon.
                  </p>
                  <p>
                    With a sound that blends alternative rock, indie pop, and electronic elements, 
                    Starlet creates music that resonates with authenticity and raw emotion. Each song 
                    is a chapter, each album a journey through the human experience.
                  </p>
                  <p>
                    From viral TikTok moments to sold-out tours, the journey has been nothing short 
                    of extraordinary. But at the heart of it all remains the same passion that started 
                    it all - creating music that touches souls.
                  </p>
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
                  Get in <span className="text-gradient">Touch</span>
                </h2>
                <p className="text-slate-400 mb-12 max-w-xl mx-auto">
                  For booking inquiries, press, or just to say hello. We&apos;d love to hear from you.
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
                  <p className="text-slate-500 mb-4">Management</p>
                  <p className="text-white">Starlet Music Management LLC</p>
                  <p className="text-slate-400 text-sm mt-1">Los Angeles, CA</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
