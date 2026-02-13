'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <FaExclamationTriangle className="w-12 h-12 text-red-400" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Something Went Wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-400 mb-4 max-w-md mx-auto"
        >
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </motion.p>

        {/* Error Code (for debugging) */}
        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-sm text-slate-600 mb-8 font-mono"
          >
            Error ID: {error.digest}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
          >
            <FaRedo className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
          >
            <FaHome className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Support Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-slate-500 text-sm">
            Need help?{' '}
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
