'use client';

// ============================================================
// CLIENT PORTAL LAYOUT
// Secure portal for Hello Gorgeous Med Spa clients
// ============================================================

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChatOpenProvider } from '@/components/ChatOpenContext';
import { MascotChat } from '@/components/MascotChat';

// Switch to client manifest for PWA install
function useClientManifest() {
  useEffect(() => {
    // Find existing manifest link or create one
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    const originalHref = manifestLink?.href;
    
    if (manifestLink) {
      manifestLink.href = '/client-manifest.json';
    } else {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/client-manifest.json';
      document.head.appendChild(manifestLink);
    }

    // Set theme color for portal
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#ec4899';
    }

    return () => {
      if (manifestLink && originalHref) {
        manifestLink.href = originalHref;
      }
    };
  }, []);
}

const NAV_ITEMS = [
  { href: '/portal', label: 'Home', icon: '🏠' },
  { href: '/portal/appointments', label: 'Appointments', icon: '📅' },
  { href: '/portal/book', label: 'Book', icon: '✨' },
  { href: '/portal/labs', label: 'Labs', icon: '🧪' },
  { href: '/portal/rewards', label: 'Rewards', icon: '🎁' },
];

const FULL_NAV_ITEMS = [
  { href: '/portal', label: 'Dashboard', icon: '🏠' },
  { href: '/portal/appointments', label: 'Appointments', icon: '📅' },
  { href: '/portal/book', label: 'Book Now', icon: '✨' },
  { href: '/portal/labs', label: 'Labs & AI', icon: '🧪' },
  { href: '/portal/medications', label: 'Medications', icon: '💊' },
  { href: '/portal/messaging', label: 'Messages', icon: '💬' },
  { href: '/portal/rewards', label: 'Rewards', icon: '🎁' },
  { href: '/portal/referrals', label: 'Refer Friends', icon: '💝' },
  { href: '/portal/journey', label: 'My Journey', icon: '📈' },
  { href: '/portal/history', label: 'History', icon: '📋' },
  { href: '/portal/intake', label: 'Forms', icon: '📝' },
  { href: '/portal/membership', label: 'Membership', icon: '💎' },
  { href: '/portal/account', label: 'Account', icon: '⚙️' },
  { href: '/memberships', label: 'Wellness Programs', icon: '⚖️' },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Use client manifest for PWA installation
  useClientManifest();

  const isActive = (href: string) => {
    if (href === '/portal') return pathname === '/portal';
    return pathname.startsWith(href);
  };

  return (
    <ChatOpenProvider>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* HIPAA Trust Banner - Shows on first load */}
      <div className="bg-slate-900 text-white text-center py-2 text-xs">
        <span className="inline-flex items-center gap-2">
          <span>🔒</span>
          <span>HIPAA Compliant • 256-bit Encryption • Your data is secure</span>
        </span>
      </div>

      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/portal" className="flex items-center gap-2">
              <span className="text-2xl">💗</span>
              <span className="font-semibold text-gray-900">
                Hello Gorgeous
              </span>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
                Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {FULL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/portal/book"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <span>✨</span>
                Book Now
              </Link>
              <Link 
                href="/portal/profile"
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
              >
                <span className="text-lg">👤</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive(item.href) ? 'text-pink-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Footer Trust Badges */}
      <footer className="hidden md:block bg-white border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🛡️</span>
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">✓</span>
              <span>SOC 2 Certified</span>
            </div>
            <Link href="/privacy" className="text-pink-500 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
    <MascotChat />
    </ChatOpenProvider>
  );
}
