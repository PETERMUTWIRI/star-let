'use client';

import '@neondatabase/auth/ui/css';
import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { AuthView } from '@neondatabase/auth/react/ui';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { FaMusic, FaArrowLeft } from 'react-icons/fa';

export default function SignUpPage() {
  return (
    <NeonAuthUIProvider
      authClient={authClient as any}
      emailOTP
      redirectTo="/admin"
    >
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background with site theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-md px-4">
          {/* Back to site link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            <FaArrowLeft /> Back to website
          </Link>
          
          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaMusic className="text-white text-lg" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-white">Create Admin Account</h1>
              <p className="text-white/80 text-sm mt-1">Sign up to manage blog posts and events</p>
            </div>
            
            {/* Auth Form */}
            <div className="p-6">
              <AuthView path="sign-up" />
            </div>
          </div>
          
          {/* Sign in link */}
          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </NeonAuthUIProvider>
  );
}
