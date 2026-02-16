'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTicket, FaEnvelope, FaArrowUpRightFromSquare, FaSpinner, FaCircleCheck, FaCreditCard } from 'react-icons/fa6';

interface Event {
  id: number;
  title: string;
  slug: string;
  description?: string;
  isFree?: boolean;
  ticketPrice?: string;
  ticketPriceCents?: number;
  registrationLink?: string;
  registrationType?: 'native' | 'external' | 'email' | 'none';
  maxAttendees?: number;
  spotsLeft?: number | null;
}

interface EventRegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

type RegistrationStep = 'form' | 'processing' | 'success' | 'error';

export default function EventRegistrationModal({ event, isOpen, onClose }: EventRegistrationModalProps) {
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  if (!event) return null;

  const isSoldOut = event.spotsLeft !== null && event.spotsLeft !== undefined && event.spotsLeft <= 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
    return '';
  };

  const handleNativeSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setStep('processing');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: String(event.id),
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.isFree) {
        // Free event - show success
        setStep('success');
      } else if (data.checkoutUrl) {
        // Paid event - redirect to Stripe
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  const handleExternalLink = () => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEmailRSVP = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const subject = encodeURIComponent(`RSVP: ${event.title}`);
    const body = encodeURIComponent(
      `Hello,\n\n` +
      `I would like to RSVP for the following event:\n\n` +
      `Event: ${event.title}\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Thank you!`
    );
    
    const email = event.registrationLink || 'newinternationalhope@gmail.com';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const resetAndClose = () => {
    setStep('form');
    setFormData({ name: '', email: '' });
    setError('');
    onClose();
  };

  const getButtonConfig = () => {
    switch (event.registrationType) {
      case 'external':
        return {
          icon: <FaArrowUpRightFromSquare className="w-5 h-5" />,
          text: 'Get Tickets',
          action: handleExternalLink,
          className: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/25',
        };
      case 'email':
        return {
          icon: <FaEnvelope className="w-5 h-5" />,
          text: 'Send RSVP Email',
          action: handleEmailRSVP,
          className: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/25',
        };
      case 'none':
        return null;
      case 'native':
      default:
        return {
          icon: event.isFree ? <FaTicket className="w-5 h-5" /> : <FaCreditCard className="w-5 h-5" />,
          text: event.isFree ? 'Register Free' : `Pay ${event.ticketPrice || ''}`,
          action: handleNativeSubmit,
          className: event.isFree 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/25'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25',
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-cyan-500 to-blue-600">
              <div className="absolute inset-0 bg-black/20" />
              <button
                onClick={resetAndClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 text-white hover:bg-black/50 transition flex items-center justify-center"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-black text-white">{event.title}</h2>
                {event.isFree ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/80 text-white text-sm font-semibold">
                    Free Event
                  </span>
                ) : event.ticketPrice ? (
                  <span className="text-white font-bold text-lg">{event.ticketPrice}</span>
                ) : null}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {event.registrationType === 'external' ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <FaArrowUpRightFromSquare className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-slate-300 mb-6">
                        Tickets for this event are handled by an external platform.
                      </p>
                      {buttonConfig && (
                        <button
                          onClick={buttonConfig.action}
                          className={`w-full py-4 px-6 rounded-full text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 ${buttonConfig.className}`}
                        >
                          {buttonConfig.icon}
                          {buttonConfig.text}
                        </button>
                      )}
                    </div>
                  ) : event.registrationType === 'email' ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FaEnvelope className="w-6 h-6 text-green-400" />
                        </div>
                        <p className="text-slate-400 text-sm">
                          Fill in your details to send an RSVP email
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}
                      {buttonConfig && (
                        <button
                          onClick={buttonConfig.action}
                          className={`w-full py-4 px-6 rounded-full text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${buttonConfig.className}`}
                        >
                          {buttonConfig.icon}
                          {buttonConfig.text}
                        </button>
                      )}
                    </>
                  ) : event.registrationType === 'none' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                        <FaTicket className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-300 text-lg font-semibold mb-2">Coming Soon</p>
                      <p className="text-slate-400">
                        Registration for this event has not opened yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          {event.isFree ? (
                            <FaTicket className="w-6 h-6 text-cyan-400" />
                          ) : (
                            <FaCreditCard className="w-6 h-6 text-cyan-400" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">
                          {event.isFree 
                            ? 'Secure your spot at this free event'
                            : 'Complete your purchase to secure your ticket'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}
                      {buttonConfig && (
                        <button
                          onClick={buttonConfig.action}
                          disabled={isSoldOut}
                          className={`w-full py-4 px-6 rounded-full text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed ${buttonConfig.className}`}
                        >
                          {isSoldOut ? (
                            'Sold Out'
                          ) : (
                            <>
                              {buttonConfig.icon}
                              {buttonConfig.text}
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4">
                    <FaSpinner className="w-16 h-16 text-cyan-500 animate-spin" />
                  </div>
                  <p className="text-white font-semibold text-lg">
                    {event.isFree ? 'Registering you...' : 'Preparing checkout...'}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Please don&apos;t close this window
                  </p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaCircleCheck className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">You&apos;re Registered!</h3>
                  <p className="text-slate-400 mb-6">
                    Check your email for your confirmation and ticket details.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="px-8 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-500 text-3xl">!</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Registration Failed</h3>
                  <p className="text-red-400 mb-6">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setStep('form')}
                      className="px-6 py-3 rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={resetAndClose}
                      className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
