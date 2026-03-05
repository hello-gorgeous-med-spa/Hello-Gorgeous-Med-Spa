'use client';

// Catches client-side errors in the tree so we show a friendly UI instead of
// "Application error: a client-side exception has occurred".
// Error boundaries only catch errors during render, not in event handlers or async code.

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ClientErrorBoundary caught:', error?.message ?? error, errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-black">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-black/80">
              We&apos;re sorry — the page couldn&apos;t load properly. Please try again or call us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-4 py-2 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors text-center"
              >
                Go home
              </a>
            </div>
            <p className="text-xs text-black/60">
              Need help? Call us at{' '}
              <a href="tel:6306366193" className="text-[#E6007E] font-semibold underline">
                (630) 636-6193
              </a>
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
