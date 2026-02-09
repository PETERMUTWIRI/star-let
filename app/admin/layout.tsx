'use client';

import '@neondatabase/auth/ui/css';
import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaMusic, FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // auto-redirect to sign-in if no session
    authClient.getSession().then((s) => {
      if (!s) {
        router.replace('/admin/sign-in');
      }
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      emailOTP
      redirectTo="/admin/blog"
    >
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FaMusic className="text-white" />
            </div>
            <h1 className="text-xl font-black text-white">Rahab Kinity Admin</h1>
          </Link>
          
          {/* sign-out button */}
          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/admin/sign-in';
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm font-semibold"
          >
            <FaSignOutAlt /> Sign out
          </button>
        </header>
        
        <main className="p-6">{children}</main>
      </div>
    </NeonAuthUIProvider>
  );
}
