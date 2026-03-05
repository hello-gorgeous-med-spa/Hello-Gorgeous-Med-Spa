'use client';

// Catches client-side errors in the app tree and shows a friendly recovery UI
// instead of the generic "Application error: a client-side exception has occurred"

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary:', error?.message || error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-black/80">
          We&apos;re sorry — the page couldn&apos;t load properly. This has been logged. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
          >
            Go home
          </Link>
        </div>
        <p className="text-xs text-black/60">
          If this keeps happening, try a hard refresh or clear your browser cache.
        </p>
      </div>
    </div>
  );
}
