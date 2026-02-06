'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaLocationDot, FaTicket, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Image from 'next/image';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import type { Event } from './page';

interface EventsClientProps {
  initialEvents: Event[];
}

type FilterType = 'upcoming' | 'past';

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [filter, setFilter] = useState<FilterType>('upcoming');

  const now = new Date();

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      if (filter === 'upcoming') {
        return eventDate >= now;
      }
      return eventDate < now;
    });
  }, [initialEvents, filter]);

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
    // Mock logic - in real app, check actual ticket sales against maxAttendees
    return false;
  };

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center">
            <span className="inline-block text-cyan-600 font-semibold tracking-wider uppercase text-sm mb-4">
              Live Performances
            </span>
            <h1 className="text-display text-brand-text mb-6">
              Upcoming Shows
            </h1>
            <p className="text-body-large text-brand-text/70 max-w-2xl mx-auto">
              Catch Starlet Music live at a venue near you. Get your tickets now before they sell out!
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-30 bg-brand-background/80 backdrop-blur-md border-b border-brand-text/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  filter === 'upcoming'
                    ? 'bg-brand-primary text-brand-text shadow-lg scale-105'
                    : 'bg-white/50 text-brand-text/70 hover:bg-white hover:text-brand-text'
                }`}
              >
                Upcoming Shows
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-6 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  filter === 'past'
                    ? 'bg-brand-primary text-brand-text shadow-lg scale-105'
                    : 'bg-white/50 text-brand-text/70 hover:bg-white hover:text-brand-text'
                }`}
              >
                Past Shows
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredEvents.length > 0 ? (
                <StaggerContainer className="space-y-6">
                  {filteredEvents.map((event) => {
                    const date = formatDate(event.startDate);
                    const soldOut = isSoldOut(event);

                    return (
                      <StaggerItem key={event.id}>
                        <motion.div
                          className="group bg-white rounded-2xl shadow-md overflow-hidden card-lift"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Date Block */}
                            <div className="md:w-32 bg-brand-primary flex flex-col items-center justify-center p-6 md:p-4 shrink-0">
                              <span className="text-3xl md:text-4xl font-black text-brand-text">
                                {date.day}
                              </span>
                              <span className="text-sm font-bold text-brand-text/80 uppercase tracking-wider">
                                {date.month}
                              </span>
                              <span className="text-xs text-brand-text/60 mt-1">
                                {date.year}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                              {/* Event Image (if available) */}
                              {event.cover && (
                                <div className="relative w-full md:w-24 h-32 md:h-24 rounded-xl overflow-hidden shrink-0">
                                  <Image
                                    src={event.cover}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                  />
                                </div>
                              )}

                              {/* Event Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-title text-brand-text mb-2 group-hover:text-cyan-600 transition-colors">
                                  {event.title}
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-text/60">
                                  <span className="flex items-center gap-1.5">
                                    <FaLocationDot className="text-cyan-600" />
                                    <span className="font-medium">{event.venue}</span>
                                  </span>
                                  <span className="text-brand-text/30">•</span>
                                  <span>{event.location}</span>
                                  <span className="text-brand-text/30">•</span>
                                  <span className="flex items-center gap-1.5">
                                    <FaCalendar className="text-cyan-600" />
                                    {date.time}
                                  </span>
                                </div>

                                {/* Ticket Price */}
                                {!soldOut && filter === 'upcoming' && (
                                  <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                                      <FaTicket className="text-brand-primary" />
                                      {event.isFree 
                                        ? 'Free Entry' 
                                        : event.ticketPrice 
                                          ? `$${event.ticketPrice}`
                                          : 'Tickets Available'
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* CTA Button */}
                              <div className="shrink-0">
                                {filter === 'upcoming' ? (
                                  soldOut ? (
                                    <span className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-500 rounded-full font-semibold cursor-not-allowed">
                                      Sold Out
                                    </span>
                                  ) : event.registrationLink ? (
                                    <a
                                      href={event.registrationLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-text rounded-full font-semibold hover:bg-brand-dark transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                      Get Tickets
                                      <FaArrowUpRightFromSquare className="text-sm" />
                                    </a>
                                  ) : (
                                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold cursor-not-allowed">
                                      Coming Soon
                                    </button>
                                  )
                                ) : (
                                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-xl font-semibold text-brand-text mb-2">
                    {filter === 'upcoming' ? 'No upcoming shows' : 'No past shows'}
                  </h3>
                  <p className="text-brand-text/60">
                    {filter === 'upcoming' 
                      ? 'Check back soon for new tour dates!' 
                      : 'Stay tuned for future performances!'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Newsletter/Stay Updated Section */}
      <section className="py-16 md:py-24 bg-brand-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-headline text-brand-text mb-4">
              Never Miss a Show
            </h2>
            <p className="text-body-large text-brand-text/70 mb-8">
              Subscribe to get notified when new tour dates are announced in your area.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full border-2 border-brand-text/20 bg-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-brand-primary text-brand-text rounded-full font-semibold hover:bg-brand-dark transition-all duration-300 hover:scale-105 shadow-md"
              >
                Subscribe
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
