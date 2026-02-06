'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // auto-redirect to sign-in if no session
    authClient.getSession().then((s) => {
      if (!s) router.replace('/admin/sign-in');
    });
  }, [router]);

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      emailOTP
      redirectTo="/admin/blog"
    >
      <div className="min-h-screen bg-gray-50">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-xl font-black text-brand-text">Starlet Admin</h1>
          {/* sign-out button */}
          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/admin/sign-in';
            }}
            className="btn-primary"
          >
            Sign out
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </NeonAuthUIProvider>
  );
}
