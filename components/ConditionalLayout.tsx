'use client';

// ============================================================
// CONDITIONAL LAYOUT
// Shows website components (header, footer, etc) only on public pages
// Hides them on admin/pos/charting/kiosk pages
// ============================================================

import { usePathname } from 'next/navigation';
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ChatOpenProvider } from "@/components/ChatOpenContext";
import { MascotChat } from "@/components/MascotChat";
import { EmailCapture } from "@/components/EmailCapture";
import { HelloGorgeousAssistant } from "@/components/HelloGorgeousAssistant";
import { ImmediateCareStrip } from "@/components/ImmediateCareBanner";
import BookingTransitionBanner from "@/components/BookingTransitionBanner";
import type { SiteSettings } from "@/lib/cms-readers";

// Routes that should NOT show website navigation
const ADMIN_ROUTES = [
  '/admin',
  '/pos',
  '/charting',
  '/kiosk',
  '/portal',
  '/consents/wizard',
  '/consents/kiosk',
];

export function ConditionalLayout({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings?: SiteSettings | null;
}) {
  const pathname = usePathname();
  
  // Check if current path is an admin/internal route
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname?.startsWith(route));
  
  // Admin routes - no website chrome, just the content
  if (isAdminRoute) {
    return (
      <div className="bg-gray-50 text-gray-900">
        {children}
      </div>
    );
  }
  
  // Public website - full chrome with header, footer, etc.
  return (
    <ChatOpenProvider>
      <div className="bg-black text-white">
        <BookingTransitionBanner />
        <ImmediateCareStrip />
        <Header />
        <main className="pt-16 w-full min-w-0 overflow-x-hidden">
          <div className="min-h-screen w-full max-w-full min-w-0 bg-black text-white overflow-x-hidden pb-20 md:pb-0">
            {children}
            <Footer siteSettings={siteSettings} />
          </div>
        </main>
        <StickyMobileCTA />
        <MascotChat />
        <EmailCapture />
        <HelloGorgeousAssistant />
      </div>
    </ChatOpenProvider>
  );
}
