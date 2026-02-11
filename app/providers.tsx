import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient as any} emailOTP redirectTo="/account/settings">
      {children}
    </NeonAuthUIProvider>
  );
}