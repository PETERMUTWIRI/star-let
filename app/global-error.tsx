'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-bold mb-4">Critical Error</h1>
          <p className="text-slate-400 mb-8">
            A critical error has occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={reset}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
