import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { MascotChat } from "@/components/MascotChat";
import { EmailCapture } from "@/components/EmailCapture";
import { VoiceConcierge } from "@/components/VoiceConcierge";
import { SITE, organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Botox, Fillers & Weight Loss in Oswego, IL`,
    template: `%s | ${SITE.name} - Oswego, IL Med Spa`,
  },
  description: `${SITE.description} Serving Naperville, Aurora, Plainfield. Book your free consultation today!`,
  keywords: [
    "med spa oswego il",
    "botox oswego",
    "botox naperville",
    "dermal fillers oswego",
    "lip filler naperville",
    "weight loss clinic oswego",
    "semaglutide oswego il",
    "tirzepatide naperville",
    "hormone therapy oswego",
    "biote oswego il",
    "iv therapy oswego",
    "med spa naperville",
    "med spa aurora il",
    "med spa plainfield",
    "botox near me",
    "fillers near me",
    "weight loss near me",
    "hello gorgeous med spa",
  ],
  authors: [{ name: "Hello Gorgeous Med Spa", url: SITE.url }],
  creator: "Hello Gorgeous Med Spa",
  publisher: "Hello Gorgeous Med Spa",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: `${SITE.name} | Premier Med Spa in Oswego, IL`,
    description: `${SITE.description} ⭐ 5-Star Rated. Serving Naperville, Aurora, Plainfield.`,
    siteName: SITE.name,
    images: [
      {
        url: `${SITE.url}/images/hero-banner.png`,
        width: 1200,
        height: 630,
        alt: "Hello Gorgeous Med Spa - Botox, Fillers, Weight Loss in Oswego IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Botox, Fillers & Weight Loss`,
    description: SITE.description,
    images: [`${SITE.url}/images/hero-banner.png`],
  },
  alternates: {
    canonical: SITE.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "Medical Spa",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
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

