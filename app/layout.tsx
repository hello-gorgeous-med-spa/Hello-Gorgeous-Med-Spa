import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { organizationJsonLd, siteJsonLd, SITE, websiteJsonLd } from "@/lib/seo";
import { getDefaultSEO, getSiteSettings } from "@/lib/cms-readers";
import { AuthWrapper } from "@/components/AuthWrapper";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ConsultationRequestPopup } from "@/components/ConsultationRequestPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const DEFAULT_TITLE = `${SITE.name} | Botox, Fillers & Weight Loss in Oswego, IL`;
const DEFAULT_DESCRIPTION = `${SITE.description} Serving Naperville, Aurora, Plainfield. Book your free consultation today!`;

export async function generateMetadata(): Promise<Metadata> {
  const cmsSEO = await getDefaultSEO();
  const title = cmsSEO?.title?.trim() || DEFAULT_TITLE;
  const description = cmsSEO?.description?.trim() || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      template: `%s | ${SITE.name} - Oswego, IL Med Spa`,
    },
    description,
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
    title: title,
    description,
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
    title,
    description,
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
}

export const viewport: Viewport = {
  themeColor: "#FDF7FA",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect to Google Maps for faster embed load */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        {/* PWA Support */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hello Gorgeous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <GoogleAnalytics />
        <ConsultationRequestPopup />
        <AuthWrapper>
          <ConditionalLayout siteSettings={siteSettings ?? undefined}>
            {children}
          </ConditionalLayout>
        </AuthWrapper>
      </body>
    </html>
  );
}

