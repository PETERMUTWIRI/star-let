'use client';

import { motion } from 'framer-motion';
import { 
  FaMicrophone, 
  FaChurch, 
  FaUsers, 
  FaBuilding, 
  FaHeart,
  FaStar,
  FaCalendarCheck,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

const services = [
  {
    icon: FaMicrophone,
    title: 'Live Performances',
    description: 'High-energy concerts and live shows featuring original music and traditional Kenyan elements.',
  },
  {
    icon: FaChurch,
    title: 'Worship Services',
    description: 'Soul-stirring gospel performances for churches, conferences, and spiritual gatherings.',
  },
  {
    icon: FaUsers,
    title: 'Community Events',
    description: 'Cultural celebrations, fundraisers, and community-building events with authentic Maasai heritage.',
  },
  {
    icon: FaBuilding,
    title: 'Corporate Functions',
    description: 'Professional entertainment for corporate events, galas, and private celebrations.',
  },
  {
    icon: FaHeart,
    title: 'Healing & Hope Events',
    description: 'Inspirational speaking and performances focused on resilience, cancer survival, and overcoming adversity.',
  },
  {
    icon: FaStar,
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

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <StaggerItem key={service.title}>
              <motion.div
                className="relative group h-full"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur" />
                <div className="relative h-full p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                    <service.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                >
                  <FaEnvelope className="w-5 h-5" />
                  Contact for Booking
                  <FaArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:booking@rahabkinity.com"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  booking@rahabkinity.com
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
