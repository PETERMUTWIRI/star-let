'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaEnvelope, 
  FaRedoAlt, 
  FaExclamationTriangle,
  FaMusic,
  FaHeadphonesAlt,
  FaBug
} from 'react-icons/fa';

/**
 * Error Boundary Component for Rahab Kinity Music Website
 * 
 * This client component catches runtime errors in the app directory
 * and displays a user-friendly error page with music-themed messaging.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

interface ErrorProps {
  /** The error object with optional digest for server-side error tracking */
  error: Error & { digest?: string };
  /** Function to reset the error boundary and retry rendering */
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Log error to monitoring service (in production, this would send to Sentry, LogRocket, etc.)
  useEffect(() => {
    // Log to console in development
    console.error('Application Error:', error);
    
    // In production, you would send this to your error tracking service:
    // Sentry.captureException(error);
    // or
    // logErrorToService({
    //   message: error.message,
    //   digest: error.digest,
    //   stack: error.stack,
    //   timestamp: new Date().toISOString(),
    // });
  }, [error]);

  // Handle reset with loading state
  const handleReset = () => {
    setIsResetting(true);
    
    // Small delay to show loading state for better UX
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 300);
  };

  // Determine if this is a network error or server error based on message
  const isNetworkError = 
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('fetch') ||
    error.message?.toLowerCase().includes('connection');

  const isServerError = error.digest || error.message?.includes('500');

  // Get appropriate error message based on error type
  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'We\'re having trouble connecting to the music stream. Please check your connection and try again.';
    }
    if (isServerError) {
      return 'Our sound system is experiencing some technical difficulties. We\'re working to get back in tune.';
    }
    return 'Something unexpected interrupted the rhythm. Let\'s try getting back on beat.';
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16">
      {/* Background Effects - Matching the site's mesh gradient style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Error-themed red accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Main Content Card */}
      <motion.div 
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-purple-500/30 to-blue-500/30 rounded-3xl blur opacity-50" />
        
        <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 overflow-hidden">
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 shimmer pointer-events-none" />
          
          {/* Error Icon */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Icon container */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/30 flex items-center justify-center">
                <FaExclamationTriangle className="w-10 h-10 text-red-400" />
              </div>
              
              {/* Floating music notes decoration */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaMusic className="w-5 h-5 text-purple-400/60" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-3"
                animate={{ y: [2, -2, 2], rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <FaHeadphonesAlt className="w-4 h-4 text-blue-400/60" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Title - Music Themed */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
              Something Went{' '}
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Off-Key
              </span>
            </h1>
            <p className="text-lg text-slate-400">
              Error Code: {error.digest || 'OFFKEY-404'}
            </p>
          </motion.div>

          {/* Error Message */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-slate-300 leading-relaxed">
                {getErrorMessage()}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Try Again Button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-purple-500/30" />
              
              <span className="relative flex items-center gap-2">
                <motion.span
                  animate={isResetting ? { rotate: 360 } : { rotate: 0 }}
                  transition={isResetting ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <FaRedoAlt className="w-4 h-4" />
                </motion.span>
                {isResetting ? 'Tuning Up...' : 'Try Again'}
              </span>
            </button>

            {/* Home Button */}
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
            >
              <FaHome className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-slate-300 group-hover:text-white transition-colors">
                Back to Home
              </span>
            </Link>
          </motion.div>

          {/* Report Error Link */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-400 transition-colors group"
            >
              <FaBug className="w-4 h-4" />
              <span>Report this issue</span>
              <FaEnvelope className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Quick Navigation Links */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-slate-500">Quick links:</span>
            {[
              { label: 'Music', href: '/music' },
              { label: 'Events', href: '/events' },
              { label: 'Videos', href: '/videos' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* Technical Details (Expandable - for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2"
              >
                {showDetails ? 'Hide' : 'Show'} technical details
                <span className={`transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showDetails && (
                <motion.div 
                  className="mt-4 p-4 rounded-lg bg-black/50 overflow-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-xs text-red-400 font-mono mb-2">Error: {error.message}</p>
                  {error.digest && (
                    <p className="text-xs text-purple-400 font-mono mb-2">Digest: {error.digest}</p>
                  )}
                  {error.stack && (
                    <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Decorative bottom text */}
        <motion.p 
          className="text-center mt-6 text-sm text-slate-500 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          &ldquo;Even the best performers hit a wrong note sometimes.&rdquo;
        </motion.p>
      </motion.div>
    </div>
  );
}
