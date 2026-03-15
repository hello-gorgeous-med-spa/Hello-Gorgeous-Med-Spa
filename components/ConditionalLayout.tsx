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
import { VoiceConcierge } from "@/components/VoiceConcierge";
import { EmailCapture } from "@/components/EmailCapture";
import { HelloGorgeousAssistant } from "@/components/HelloGorgeousAssistant";
import { ImmediateCareStrip } from "@/components/ImmediateCareBanner";
import BookingTransitionBanner from "@/components/BookingTransitionBanner";
import type { SiteSettings } from "@/lib/cms-readers";

// Routes that should NOT show website navigation (minimal layout: no header/footer/chat/CTA)
const ADMIN_ROUTES = [
  '/admin',
  '/pos',
  '/charting',
  '/kiosk',
  '/portal',
  '/login',
  '/auth',
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
  
  // Admin/auth routes - no website chrome, just the content (clean for mobile/PWA)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen min-h-[100dvh]">
        {children}
      </div>
    );
  }
  
  // Public website - full chrome with header, footer, etc. White bg, hot pink + black text.
  return (
    <ChatOpenProvider>
      <div className="bg-white text-black" data-site="public">
        <BookingTransitionBanner />
        <ImmediateCareStrip />
        <Header />
        <main className="pt-16 w-full min-w-0 overflow-x-hidden">
          <div className="min-h-screen w-full max-w-full min-w-0 bg-white overflow-x-hidden pb-20 md:pb-0">
            {children}
            <Footer siteSettings={siteSettings} />
          </div>
        </main>
        <StickyMobileCTA />
        <MascotChat />
        <VoiceConcierge />
        <EmailCapture />
        <HelloGorgeousAssistant />
      </div>
    </ChatOpenProvider>
  );
}
