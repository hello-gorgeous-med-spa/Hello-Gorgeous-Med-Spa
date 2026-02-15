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
      themeColor.content = '#E6007E';
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
  { href: '/portal/appointments', label: 'Appts', icon: '📅' },
  { href: '/portal/documents', label: 'Docs', icon: '📁' },
  { href: '/portal/notifications', label: 'Alerts', icon: '🔔' },
  { href: '/portal/account', label: 'Me', icon: '👤' },
];

const FULL_NAV_ITEMS = [
  { href: '/portal', label: 'Dashboard', icon: '🏠' },
  { href: '/portal/appointments', label: 'Appointments', icon: '📅' },
  { href: '/portal/book', label: 'Book Now', icon: '✨' },
  { href: '/portal/documents', label: 'Documents', icon: '📁' },
  { href: '/portal/receipts', label: 'Receipts', icon: '🧾' },
  { href: '/portal/wallet', label: 'Wallet', icon: '💳' },
  { href: '/portal/consents', label: 'Consent Forms', icon: '📝' },
  { href: '/portal/timeline', label: 'My Progress', icon: '📸' },
  { href: '/portal/aftercare', label: 'Aftercare', icon: '📋' },
  { href: '/portal/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/portal/membership', label: 'Membership', icon: '💎' },
  { href: '/portal/account', label: 'Account', icon: '⚙️' },
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
    <div data-portal className="min-h-screen bg-gradient-to-br from-white via-white to-white">
      {/* HIPAA Trust Banner - Shows on first load */}
      <div className="bg-black text-white text-center py-2 text-xs">
        <span className="inline-flex items-center gap-2">
          <span>🔒</span>
          <span>HIPAA Compliant • 256-bit Encryption • Your data is secure</span>
        </span>
      </div>

      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E6007E]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/portal" className="flex items-center gap-2">
              <span className="text-2xl">💗</span>
              <span className="font-semibold text-[#111111]">
                Hello Gorgeous
              </span>
              <span className="text-xs bg-[#E6007E]/10 text-[#E6007E] px-2 py-0.5 rounded-full font-medium">
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
                      ? 'text-[#E6007E] bg-[#E6007E]/10'
                      : 'text-[#111111]/80 hover:text-[#E6007E] hover:bg-[#E6007E]/10'
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
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#E6007E] text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <span>✨</span>
                Book Now
              </Link>
              <Link 
                href="/portal/profile"
                className="w-10 h-10 rounded-full bg-[#E6007E]/10 flex items-center justify-center text-[#E6007E] hover:bg-[#E6007E]/20 transition-colors"
              >
                <span className="text-lg">👤</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#111111]/15 z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive(item.href) ? 'text-[#E6007E]' : 'text-[#111111]/70'
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
      <footer className="hidden md:block bg-white border-t border-[#111111]/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-sm text-[#111111]/70">
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
            <Link href="/privacy" className="text-[#E6007E] hover:underline">
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
