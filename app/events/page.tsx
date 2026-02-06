'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTicketAlt,
  FaExternalLinkAlt,
  FaArrowRight
} from 'react-icons/fa';
import ScrollReveal from '@/components/ScrollReveal';

// Event data
const events = [
  {
    id: 1,
    date: '2024-03-15',
    time: '8:00 PM',
    venue: 'The Fillmore',
    city: 'San Francisco, CA',
    price: 45,
    status: 'on_sale',
    image: '/events/fillmore.jpg',
  },
  {
    id: 2,
    date: '2024-03-22',
    time: '9:00 PM',
    venue: 'The Troubadour',
    city: 'Los Angeles, CA',
    price: 50,
    status: 'selling_fast',
    image: '/events/troubadour.jpg',
  },
  {
    id: 3,
    date: '2024-04-05',
    time: '7:30 PM',
    venue: 'The Sinclair',
    city: 'Boston, MA',
    price: 35,
    status: 'on_sale',
    image: '/events/sinclair.jpg',
  },
  {
    id: 4,
    date: '2024-04-12',
    time: '8:00 PM',
    venue: 'Brooklyn Bowl',
    city: 'New York, NY',
    price: 40,
    status: 'sold_out',
    image: '/events/brooklyn-bowl.jpg',
  },
  {
    id: 5,
    date: '2024-04-20',
    time: '9:00 PM',
    venue: 'The Crocodile',
    city: 'Seattle, WA',
    price: 38,
    status: 'on_sale',
    image: '/events/crocodile.jpg',
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
};

export default function EventsPage() {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="relative min-h-screen">
      {/* Subtle Gradient Overlay on White Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6"
              >
                On Tour 2024
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">
                Upcoming <span className="text-gradient">Shows</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Experience the music live. Get your tickets now before they sell out.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="relative py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-4">
            {(['upcoming', 'past'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  filter === type
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {type === 'upcoming' ? 'Upcoming Shows' : 'Past Shows'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="relative py-12 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {events.map((event, index) => {
              const date = formatDate(event.date);
              return (
                <ScrollReveal key={event.id} delay={index * 0.1}>
                  <motion.div
                    className="relative bg-white rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-blue-200 transition-all group hover:shadow-xl hover:shadow-blue-500/10"
                    whileHover={{ y: -4 }}
                  >
                    {/* Gradient Accent on Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Date */}
                      <div className="flex-shrink-0 text-center md:text-left">
                        <div className="inline-flex md:block items-center gap-3">
                          <span className="text-sm font-bold text-blue-600 tracking-wider">{date.month}</span>
                          <span className="text-4xl font-black text-slate-900">{date.day}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{date.weekday}</p>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

                      {/* Event Info */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {event.venue}
                        </h3>
                        <p className="text-slate-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />
                          {event.city}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <FaClock className="w-4 h-4" /> {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTicketAlt className="w-4 h-4" /> ${event.price}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0">
                        {event.status === 'sold_out' ? (
                          <span className="inline-flex items-center px-6 py-3 rounded-full bg-slate-100 text-slate-500 font-medium cursor-not-allowed">
                            Sold Out
                          </span>
                        ) : event.status === 'selling_fast' ? (
                          <Link 
                            href={`/events/${event.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                          >
                            Selling Fast
                            <FaArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link 
                            href={`/events/${event.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all group/btn"
                          >
                            Get Tickets
                            <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-12 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
              {/* Background Gradient Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Don&apos;t Miss a <span className="text-gradient">Show</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Get notified when new dates are added and be the first to know about presales.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    Notify Me
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
