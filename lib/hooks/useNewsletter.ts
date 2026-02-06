'use client';

import { useState } from 'react';

interface UseNewsletterReturn {
  subscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  unsubscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
}

export function useNewsletter(): UseNewsletterReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      return { success: true, message: data.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      return { success: true, message: data.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, unsubscribe, loading, error };
}
