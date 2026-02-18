'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaInstagram, 
  FaTwitter,
  FaMicrophone,
  FaHeart,
  FaQuoteLeft,
  FaStar,
  FaRibbon,
  FaFlag
} from 'react-icons/fa';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import HomepageBookingSection from '../HomepageBookingSection';
import { MusicGroupSchema, BreadcrumbSchema } from '@/components/StructuredData';

const journeyMilestones = [
  {
    year: 'Today',
    title: 'Thriving in America',
    description: 'Based in the United States, performing at venues across the country while maintaining deep connections to Kenyan heritage.',
  },
  {
    year: '2021',
    title: 'World Refugee Day Recognition',
    description: 'Highlighted in New Haven for using music to connect communities and share her powerful story of resilience.',
  },
  {
    year: '2020',
    title: 'Cancer Victory',
    description: 'Emerging as a survivor, her music took on even deeper meaning—becoming a beacon of hope for those facing battles.',
  },
  {
    year: '2018',
    title: 'The Journey to America',
    description: 'Building a new life while carrying the vibrant traditions of Kenya in her heart and her art.',
  },
  {
    year: 'Early Years',
    title: 'Gospel & Acting Roots',
    description: 'Discovered her voice in church choirs and on stage, developing the high-energy performance style that defines her today.',
  },
];

const pressQuotes = [
  {
    source: 'World Refugee Day, New Haven',
    quote: 'Ray Armillion embodies the spirit of resilience. Her performances bring communities together, celebrating both Kenyan heritage and American dreams.',
    rating: 5,
  },
  {
    source: 'Community Voice',
    quote: 'Watching her perform in traditional Maasai attire while singing about hope and unity—it\'s more than music. It\'s healing.',
    rating: 5,
  },
  {
    source: 'Fellow Artist',
    quote: 'She doesn\'t just sing. She tells stories. She dances. She brings the full Kenyan experience to every stage.',
    rating: 5,
  },
];

export default function AboutPage() {
  return (
    <>
      <MusicGroupSchema />
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]} />
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Side */}
              <ScrollReveal>
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-8 -left-8 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
                  
                  {/* Main Image */}
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glow-mixed">
                    <Image
                      src="/images/about/Rahab.jpeg"
                      alt="Ray Armillion - Kenyan Singer & Performer"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Floating Badge */}
                  <motion.div 
                    className="absolute -bottom-6 -right-6 bg-gradient-card rounded-2xl p-6 glow-amber"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <FaRibbon className="w-8 h-8 text-pink-400" />
                      <div>
                        <div className="text-sm text-slate-400">Cancer</div>
                        <div className="text-xl font-bold text-white">Survivor</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>

              {/* Content Side */}
              <div className="space-y-8">
                <ScrollReveal>
                  <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <FaFlag className="w-3 h-3 inline mr-2" />
                    Kenyan-American Artist
                  </span>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <h1 className="text-5xl md:text-6xl font-bold">
                    A Voice of <span className="text-gradient">Resilience</span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                    <p>
                      Born in Kenya and now calling America home, <span className="text-amber-400 font-medium">Ray Armillion</span> brings 
                      a unique fusion of traditional Kenyan culture and contemporary performance to every stage she touches.
                    </p>
                    <p>
                      Her journey—from refugee to cancer survivor to celebrated performer—is woven into every song she writes. 
                      Known for her <span className="text-cyan-400">high-energy performances</span> that often feature traditional{' '}
                      <span className="text-cyan-400">Maasai attire</span> and dance, Rahab creates original music focused on{' '}
                      <span className="text-purple-400">unity</span>, <span className="text-purple-400">community</span>, and{' '}
                      <span className="text-purple-400">hope</span>.
                    </p>
                    <p className="border-l-4 border-amber-500/50 pl-4 italic text-slate-400">
                      "When I step on stage wearing my Maasai shuka, I&apos;m not just performing—I&apos;m honoring where I came from. 
                      Every dance move, every note, is a celebration of survival and a promise that no matter your struggle, 
                      you can rise."
                    </p>
                  </div>
                </ScrollReveal>
                
                {/* Heritage Tags */}
                <ScrollReveal delay={0.25}>
                  <div className="flex flex-wrap gap-2">
                    {['Refugee Story', 'Cancer Survivor', 'Maasai Heritage', 'Gospel Roots', 'Community Builder'].map((tag) => (
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
                      { icon: FaInstagram, href: 'https://instagram.com/rayarmillion', label: 'Instagram' },
                      { icon: FaTwitter, href: 'https://twitter.com/rayarmillion', label: 'Twitter' },
                      { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCBoBfckNNdCS7joUqClADbA?sub_confirmation=1', label: 'YouTube' },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
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

        {/* Journey Timeline */}
        <section className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  A Journey of <span className="text-gradient">Courage</span>
                </h2>
                <p className="text-slate-400">From Kenya to the world stage</p>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 via-green-500 to-transparent" />

              {journeyMilestones.map((milestone, index) => (
                <ScrollReveal key={milestone.year} delay={index * 0.15}>
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
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center z-10 shadow-lg shadow-amber-500/25">
                      <span className="text-xs font-bold text-white text-center leading-tight">{milestone.year}</span>
                    </div>

                    {/* Content */}
                    <div className={`ml-24 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'
                    }`}>
                      <div className="card-premium">
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-slate-400">{milestone.description}</p>
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

        {/* Performance Style Section */}
        <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-6">
                    Performance Style
                  </span>
                  <h2 className="text-4xl font-bold mb-6">
                    More Than Music—<span className="text-gradient">An Experience</span>
                  </h2>
                  <div className="space-y-4 text-slate-300">
                    <p>
                      Rahab doesn&apos;t just sing—she <span className="text-amber-400">performs</span>. Her shows are high-energy 
                      celebrations where traditional Kenyan dance meets contemporary stagecraft.
                    </p>
                    <p>
                      Often performing in authentic <span className="text-cyan-400">Maasai attire</span>, she brings visual 
                      storytelling to every performance. The vibrant shukas, the beadwork, the movement—all pay homage to her roots.
                    </p>
                    <ul className="space-y-3 pt-4">
                      {[
                        'Original songs about unity and hope',
                        'Traditional Maasai dance elements',
                        'Interactive audience engagement',
                        'Bilingual performances (English & Swahili)',
                        'Stories of resilience between songs',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-green-500/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-slate-900/50 rounded-3xl p-8 border border-white/10">
                    <FaQuoteLeft className="w-12 h-12 text-amber-500/30 mb-4" />
                    <p className="text-xl text-slate-300 italic leading-relaxed mb-6">
                      &ldquo;I want every person in the audience to leave feeling like they can overcome anything. 
                      Because if a girl from a refugee camp can stand here, in her traditional dress, 
                      having beaten cancer—then whatever you&apos;re facing, you can beat it too.&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center">
                        <FaMicrophone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Ray Armillion</div>
                        <div className="text-sm text-slate-500">On her performance philosophy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Press Quotes */}
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  Words of <span className="text-gradient">Praise</span>
                </h2>
                <p className="text-slate-400">What communities are saying</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {pressQuotes.map((item, index) => (
                <ScrollReveal key={item.source} delay={index * 0.1}>
                  <div className="card-premium relative">
                    <FaQuoteLeft className="w-10 h-10 text-amber-500/30 mb-4" />
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

        {/* Booking Section - Same as Homepage */}
        <HomepageBookingSection />
      </div>
    </>
  );
}
