'use client';

import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaMapPin, FaUsers, FaTicket, FaArrowUpRightFromSquare, FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface Event {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: string;
  cover?: string;
  location: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  address?: string;
  registrationLink?: string;
  maxAttendees?: number;
  isFree?: boolean;
  ticketPrice?: string;
  ticketPriceCents?: number;
  registrationCount?: number;
  spotsLeft?: number | null;
  isSoldOut?: boolean;
}

interface HomepageEventsSectionProps {
  upcomingEvents: Event[];
}

export default function HomepageEventsSection({ upcomingEvents }: HomepageEventsSectionProps) {
  const latestEvent = upcomingEvents[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };
  };

  const isSoldOut = (event: Event) => {
    return event.isSoldOut || (event.spotsLeft !== null && event.spotsLeft !== undefined && event.spotsLeft <= 0);
  };

  if (!latestEvent) {
    return (
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Upcoming Events
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Next <span className="text-gradient">Performance</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              No upcoming events scheduled at the moment. Check back soon or view past events!
            </p>
            <Link 
              href="/events?filter=past"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
              See Past Events
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Upcoming Event
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Next <span className="text-gradient">Performance</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
              <div className="grid lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
                  {latestEvent.cover ? (
                    <Image
                      src={latestEvent.cover}
                      alt={latestEvent.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 flex items-center justify-center">
                      <FaCalendar className="w-24 h-24 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="text-3xl font-black text-white">
                      {formatDate(latestEvent.startDate).day}
                    </div>
                    <div className="text-sm font-semibold text-amber-400 uppercase">
                      {formatDate(latestEvent.startDate).month}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg">
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                    {latestEvent.title}
                  </h3>
                  
                  {latestEvent.description && (
                    <p className="text-slate-400 text-lg mb-6 line-clamp-3">
                      {latestEvent.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-300">
                      <FaCalendar className="w-5 h-5 text-amber-400" />
                      <span>{formatDate(latestEvent.startDate).fullDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <FaClock className="w-5 h-5 text-amber-400" />
                      <span>{formatDate(latestEvent.startDate).time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <FaMapPin className="w-5 h-5 text-amber-400" />
                      <span>{latestEvent.venue || latestEvent.location}</span>
                    </div>
                    {latestEvent.maxAttendees && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <FaUsers className="w-5 h-5 text-amber-400" />
                        <span>
                          {latestEvent.spotsLeft !== null 
                            ? `${latestEvent.spotsLeft} spots left`
                            : `${latestEvent.maxAttendees} capacity`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {isSoldOut(latestEvent) ? (
                      <span className="px-8 py-4 rounded-full bg-slate-800 text-slate-500 font-bold cursor-not-allowed">
                        Sold Out
                      </span>
                    ) : latestEvent.registrationLink ? (
                      <a
                        href={latestEvent.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                      >
                        <FaTicket className="w-5 h-5" />
                        {latestEvent.isFree ? 'Register Free' : 'Get Tickets'}
                        <FaArrowUpRightFromSquare className="w-4 h-4" />
                      </a>
                    ) : (
                      <button className="px-8 py-4 rounded-full bg-slate-800 text-slate-400 font-bold cursor-not-allowed">
                        Coming Soon
                      </button>
                    )}

                    {!latestEvent.isFree && latestEvent.ticketPrice && (
                      <span className="text-2xl font-bold text-white">
                        {latestEvent.ticketPrice}
                      </span>
                    )}
                    {latestEvent.isFree && (
                      <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                        Free Event
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
          >
            See Past Events
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
