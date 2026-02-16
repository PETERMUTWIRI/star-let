'use client';

import Link from 'next/link';
import { FaTimesCircle, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaTimesCircle className="w-10 h-10 text-red-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Checkout Cancelled
          </h1>

          {/* Description */}
          <p className="text-slate-400 mb-8">
            Your payment was cancelled. No charges were made to your account. 
            You can try again whenever you&apos;re ready.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <FaRedo className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/events"
              className="w-full py-3 px-6 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>

          {/* Support */}
          <p className="mt-6 text-sm text-slate-500">
            Need help?{' '}
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
