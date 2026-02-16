'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaLocationDot, FaTicket, FaArrowUpRightFromSquare, FaClock, FaMapPin, FaUsers, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa6';
import Image from 'next/image';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import EventRegistrationModal from '@/components/EventRegistrationModal';

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
  registrationType?: 'native' | 'external' | 'email' | 'none';
  maxAttendees?: number;
  isFree?: boolean;
  ticketPrice?: string;
  ticketPriceCents?: number;
  registrationCount?: number;
  spotsLeft?: number | null;
  isSoldOut?: boolean;
}

interface EventsClientProps {
  initialEvents: Event[];
}

type FilterType = 'upcoming' | 'past';

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();

  const handleRegisterClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setRegistrationEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      if (filter === 'upcoming') {
        return eventDate >= now;
      }
      return eventDate < now;
    });
  }, [initialEvents, filter]);

  const featuredEvent = filter === 'upcoming' ? filteredEvents[0] : null;
  const otherEvents = filter === 'upcoming' && featuredEvent 
    ? filteredEvents.filter(e => e.id !== featuredEvent.id) 
    : filteredEvents;

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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Live Performances
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
                Experience{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  The Energy
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                From intimate worship nights to high-energy cultural celebrations—join Rahab for an 
                unforgettable blend of Kenyan heritage, soul-stirring music, and stories of hope.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            {[
              { value: filteredEvents.length, label: 'Upcoming Shows' },
              { value: 'USA', label: 'Touring' },
              { value: 'Kenya', label: 'Rooted In' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="relative sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === 'upcoming'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === 'past'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredEvents.length > 0 ? (
                <>
                  {/* Featured Event */}
                  {featuredEvent && filter === 'upcoming' && (
                    <ScrollReveal className="mb-12">
                      <motion.div
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedEvent(featuredEvent)}
                        whileHover={{ scale: 1.005 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                          <div className="grid lg:grid-cols-2">
                            {/* Image Side */}
                            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
                              {featuredEvent.cover ? (
                                <Image
                                  src={featuredEvent.cover}
                                  alt={featuredEvent.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                                  <FaCalendar className="w-24 h-24 text-white/20" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
                              
                              {/* Date Badge */}
                              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="text-3xl font-black text-white">
                                  {formatDate(featuredEvent.startDate).day}
                                </div>
                                <div className="text-sm font-semibold text-cyan-400 uppercase">
                                  {formatDate(featuredEvent.startDate).month}
                                </div>
                              </div>

                              {/* Featured Badge */}
                              <div className="absolute top-4 right-4">
                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg">
                                  Featured
                                </span>
                              </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                {featuredEvent.title}
                              </h2>
                              
                              {featuredEvent.description && (
                                <p className="text-slate-400 text-lg mb-6 line-clamp-3">
                                  {featuredEvent.description}
                                </p>
                              )}

                              <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-slate-300">
                                  <FaCalendar className="w-5 h-5 text-cyan-400" />
                                  <span>{formatDate(featuredEvent.startDate).fullDate}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                  <FaClock className="w-5 h-5 text-cyan-400" />
                                  <span>{formatDate(featuredEvent.startDate).time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                  <FaMapPin className="w-5 h-5 text-cyan-400" />
                                  <span>{featuredEvent.venue || featuredEvent.location}</span>
                                </div>
                                {featuredEvent.maxAttendees && (
                                  <div className="flex items-center gap-3 text-slate-300">
                                    <FaUsers className="w-5 h-5 text-cyan-400" />
                                    <span>
                                      {featuredEvent.spotsLeft !== null 
                                        ? `${featuredEvent.spotsLeft} spots left`
                                        : `${featuredEvent.maxAttendees} capacity`
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                {isSoldOut(featuredEvent) ? (
                                  <span className="px-8 py-4 rounded-full bg-slate-800 text-slate-500 font-bold cursor-not-allowed">
                                    Sold Out
                                  </span>
                                ) : featuredEvent.registrationType === 'external' ? (
                                  <a
                                    href={featuredEvent.registrationLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaExternalLinkAlt className="w-5 h-5" />
                                    Get Tickets
                                    <FaArrowUpRightFromSquare className="w-4 h-4" />
                                  </a>
                                ) : featuredEvent.registrationType === 'email' ? (
                                  <button
                                    onClick={(e) => handleRegisterClick(featuredEvent, e)}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                                  >
                                    <FaEnvelope className="w-5 h-5" />
                                    RSVP by Email
                                  </button>
                                ) : featuredEvent.registrationType === 'none' ? (
                                  <button className="px-8 py-4 rounded-full bg-slate-800 text-slate-400 font-bold cursor-not-allowed">
                                    Coming Soon
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => handleRegisterClick(featuredEvent, e)}
                                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                                      featuredEvent.isFree
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25'
                                    }`}
                                  >
                                    <FaTicket className="w-5 h-5" />
                                    {featuredEvent.isFree ? 'Register Free' : 'Get Tickets'}
                                  </button>
                                )}

                                {!featuredEvent.isFree && featuredEvent.ticketPrice && (
                                  <span className="text-2xl font-bold text-white">
                                    {featuredEvent.ticketPrice}
                                  </span>
                                )}
                                {featuredEvent.isFree && (
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
                  )}

                  {/* Events Grid */}
                  <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherEvents.map((event) => {
                      const date = formatDate(event.startDate);
                      const soldOut = isSoldOut(event);

                      return (
                        <StaggerItem key={event.id}>
                          <motion.div
                            className="group h-full cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative h-full bg-slate-900/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10">
                              {/* Image */}
                              <div className="relative aspect-[16/10] overflow-hidden">
                                {event.cover ? (
                                  <Image
                                    src={event.cover}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 flex items-center justify-center">
                                    <FaCalendar className="w-16 h-16 text-white/10" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                                
                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                  <div className="text-2xl font-black text-white">{date.day}</div>
                                  <div className="text-xs font-bold text-cyan-400 uppercase">{date.month}</div>
                                </div>

                                {/* Status Badge */}
                                {soldOut ? (
                                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-bold">
                                    Sold Out
                                  </div>
                                ) : event.isFree ? (
                                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/80 text-white text-xs font-bold">
                                    Free
                                  </div>
                                ) : null}
                              </div>

                              {/* Content */}
                              <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                  {event.title}
                                </h3>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <FaCalendar className="w-4 h-4 text-cyan-400" />
                                    <span>{date.fullDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <FaLocationDot className="w-4 h-4 text-cyan-400" />
                                    <span className="truncate">{event.venue || event.location}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                  {event.isFree ? (
                                    <span className="text-green-400 font-semibold">Free Entry</span>
                                  ) : (
                                    <span className="text-white font-bold">{event.ticketPrice || 'Tickets Available'}</span>
                                  )}
                                  
                                  <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium group-hover:gap-2 transition-all">
                                    Details
                                    <FaArrowUpRightFromSquare className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="text-8xl mb-6">🎤</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {filter === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    {filter === 'upcoming' 
                      ? 'Stay tuned! New events are being planned. Subscribe to get notified first.'
                      : 'Check back for highlights from past performances.'
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition flex items-center justify-center"
              >
                ×
              </button>

              {/* Image */}
              <div className="relative aspect-video">
                {selectedEvent.cover ? (
                  <Image
                    src={selectedEvent.cover}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                    <FaCalendar className="w-32 h-32 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                <h2 className="text-3xl font-black text-white mb-4">{selectedEvent.title}</h2>
                
                {selectedEvent.description && (
                  <p className="text-slate-300 mb-6 leading-relaxed">{selectedEvent.description}</p>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <FaCalendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm text-slate-500">Date</div>
                      <div className="text-white font-medium">{formatDate(selectedEvent.startDate).fullDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <FaClock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm text-slate-500">Time</div>
                      <div className="text-white font-medium">{formatDate(selectedEvent.startDate).time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <FaLocationDot className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm text-slate-500">Venue</div>
                      <div className="text-white font-medium">{selectedEvent.venue || selectedEvent.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <FaTicket className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm text-slate-500">Admission</div>
                      <div className="text-white font-medium">
                        {selectedEvent.isFree ? 'Free' : selectedEvent.ticketPrice || 'See details'}
                      </div>
                    </div>
                  </div>
                </div>

                {isSoldOut(selectedEvent) ? (
                  <button className="w-full px-8 py-4 rounded-full bg-slate-800 text-slate-500 font-bold cursor-not-allowed">
                    Sold Out
                  </button>
                ) : selectedEvent.registrationType === 'external' ? (
                  <a
                    href={selectedEvent.registrationLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <FaExternalLinkAlt className="w-5 h-5" />
                    Get Tickets
                    <FaArrowUpRightFromSquare className="w-4 h-4" />
                  </a>
                ) : selectedEvent.registrationType === 'email' ? (
                  <button
                    onClick={() => {
                      setRegistrationEvent(selectedEvent);
                      setIsModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    <FaEnvelope className="w-5 h-5" />
                    RSVP by Email
                  </button>
                ) : selectedEvent.registrationType === 'none' ? (
                  <button className="w-full px-8 py-4 rounded-full bg-slate-800 text-slate-400 font-bold cursor-not-allowed">
                    Registration Opening Soon
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setRegistrationEvent(selectedEvent);
                      setIsModalOpen(true);
                    }}
                    className={`w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all duration-300 ${
                      selectedEvent.isFree
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/25'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25'
                    }`}
                  >
                    <FaTicket className="w-5 h-5" />
                    {selectedEvent.isFree ? 'Register Now' : 'Get Tickets'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-green-600/10" />
              <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/50" />
              <div className="absolute inset-0 rounded-3xl border border-white/10" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Be Part of the Journey
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  From New Haven to nationwide tours—get first access to performances that celebrate 
                  resilience, heritage, and the power of music.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-green-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Stay Connected
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={registrationEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
