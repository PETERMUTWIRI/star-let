'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaMusic, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  const quickLinks = [
    { icon: FaHome, label: 'Home', href: '/' },
    { icon: FaMusic, label: 'Music', href: '/music' },
    { icon: FaCalendarAlt, label: 'Events', href: '/events' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            404
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-400 mb-8 max-w-md mx-auto"
        >
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved or doesn&apos;t exist.
        </motion.p>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Go Back
        </motion.button>

        {/* Fun Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-slate-500 text-sm italic">
            &ldquo;Even when the path seems lost, the music always finds its way home.&rdquo;
          </p>
          <p className="text-slate-600 text-xs mt-2">— Rahab Kinity</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
