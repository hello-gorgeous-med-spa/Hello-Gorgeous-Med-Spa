import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { MascotChat } from "@/components/MascotChat";
import { EmailCapture } from "@/components/EmailCapture";
import { VoiceConcierge } from "@/components/VoiceConcierge";
import { SITE } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  alternates: {
    canonical: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white min-h-screen antialiased">
        <Header />
        <main className="pt-16">
          <div className="min-h-screen bg-black text-white overflow-x-hidden pb-20 md:pb-0">
            {children}
            <Footer />
          </div>
        </main>
        <StickyMobileCTA />
        <MascotChat />
        <EmailCapture />
        <VoiceConcierge />
      </body>
    </html>
  );
}

