'use client';

// Catches client-side exceptions in the root layout (including during hydration).
// Must define its own <html> and <body> — it replaces the root layout when active.

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary:', error?.message ?? error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#000' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: '#333', marginBottom: 24, maxWidth: 360 }}>
            We&apos;re sorry — the page couldn&apos;t load properly. Please try again or call us.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '10px 20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                border: '2px solid #000',
                color: '#000',
                borderRadius: 8,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#666', marginTop: 24 }}>
            Need help? Call us at{' '}
            <a href="tel:6306366193" style={{ color: '#E6007E', fontWeight: 600 }}>
              (630) 636-6193
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
