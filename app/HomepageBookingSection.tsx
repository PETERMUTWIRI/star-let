'use client';

import { motion } from 'framer-motion';
import { 
  FaCalendarCheck,
  FaEnvelope,
  FaArrowRight,
  FaCalendarAlt
} from 'react-icons/fa';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

const services = [
  {
    title: 'Live Performances',
    description: 'High-energy concerts and live shows featuring original music and traditional Kenyan elements.',
  },
  {
    title: 'Worship Services',
    description: 'Soul-stirring gospel performances for churches, conferences, and spiritual gatherings.',
  },
  {
    title: 'Community Events',
    description: 'Cultural celebrations, fundraisers, and community-building events with authentic Maasai heritage.',
  },
  {
    title: 'Corporate Functions',
    description: 'Professional entertainment for corporate events, galas, and private celebrations.',
  },
  {
    title: 'Healing & Hope Events',
    description: 'Inspirational speaking and performances focused on resilience, cancer survival, and overcoming adversity.',
  },
  {
    title: 'Cultural Education',
    description: 'Interactive workshops and presentations sharing Kenyan culture, traditions, and storytelling.',
  },
];

export default function HomepageBookingSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <FaCalendarCheck className="w-4 h-4" />
            Available for Bookings
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bring the <span className="text-gradient">Experience</span> to Your Event
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Rahab Kinity brings energy, inspiration, and an unforgettable performance to events of all kinds.
          </p>
        </ScrollReveal>

        {/* Main Content - Services Left, Video Right */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Services List - Left Side */}
          <ScrollReveal>
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-amber-500/30 hover:bg-slate-900/60 transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* YouTube Video - Right Side */}
          <ScrollReveal>
            <div className="relative h-full min-h-[350px] lg:min-h-full rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.youtube.com/embed/UApoQM5A7vI?autoplay=1&mute=1&loop=1&playlist=UApoQM5A7vI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                title="Rahab Kinity Performance"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-3xl blur opacity-30" />
            <div className="relative p-8 md:p-12 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Book?
              </h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Whether it&apos;s a concert, worship service, or corporate event—let&apos;s make it unforgettable. 
                Reach out to discuss your event needs.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
              >
                <FaCalendarAlt className="w-6 h-6" />
                Book Now
                <FaArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
