import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { organizationJsonLd, siteJsonLd, SITE, SITE_OG_IMAGE, SITE_OG_IMAGE_ALT, websiteJsonLd } from "@/lib/seo";
import { getGooglePlace, getLiveAggregateRating } from "@/lib/seo/google-places";
import { getDefaultSEO, getSiteSettings } from "@/lib/cms-readers";
import { AuthWrapper } from "@/components/AuthWrapper";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { UtmSessionCapture } from "@/components/marketing/UtmSessionCapture";
import { ContourLiftPageView } from "@/components/marketing/ContourLiftPageView";
import { ConsultationRequestPopup } from "@/components/ConsultationRequestPopup";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";

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

// Homepage default title — used only when a child page does NOT set its own title.
// Sub-pages set their own titles which already include the brand, so no template suffix.
const DEFAULT_TITLE = `Hello Gorgeous Med Spa — #1 Med Spa in Oswego, IL | Botox, Weight Loss, Morpheus8`;
const DEFAULT_DESCRIPTION = `${SITE.description} Serving Naperville, Aurora, Plainfield. Book your free consultation today!`;

export async function generateMetadata(): Promise<Metadata> {
  const cmsSEO = await getDefaultSEO();
  const title = cmsSEO?.title?.trim() || DEFAULT_TITLE;
  const description = cmsSEO?.description?.trim() || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      // No suffix template — pages already include the brand name in their own titles.
      // Setting the template to '%s' is a passthrough so child page titles render as-is.
      template: `%s`,
    },
    description,
    keywords: [
    "hello gorgeous med spa",
    "hello gorgeous oswego il",
    "hello gorgeous oswego",
    "med spa oswego il",
    "best med spa oswego",
    "class 4 laser oswego",
    "Quantum RF oswego",
    "Morpheus8 Burst face body oswego",
    "Morpheus8 Burst oswego",
    "Solaria CO2 laser oswego",
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
    "botox near me aurora",
    "med spa plainfield",
    "botox near me",
    "fillers near me",
    "weight loss near me",
    "Hello Gorgeous story",
    "Danielle Alcala med spa Oswego",
    "family owned med spa Oswego",
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
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [SITE_OG_IMAGE],
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
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      SITE.googleSiteVerification ||
      undefined,
  },
  category: "Medical Spa",
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteSettings: Awaited<ReturnType<typeof getSiteSettings>> = null;
  try {
    siteSettings = await getSiteSettings();
  } catch {
    // CMS/Supabase unavailable — render site with defaults so live site never goes fully down
  }

  // Live Google rating for AggregateRating schema. Falls back to SITE static
  // values silently if the Places API is unreachable so we never break a render.
  // The Places API call is cached for 24h (one fetch per region per day).
  const [liveRating, livePlace] = await Promise.all([
    getLiveAggregateRating(),
    getGooglePlace(),
  ]);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Maps for faster embed load */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        {/* Cherry financing widget font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200..900&display=swap" />
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              siteJsonLd({
                aggregateRating: {
                  ratingValue: liveRating.ratingValue,
                  reviewCount: liveRating.reviewCount,
                },
              }),
            ),
          }}
        />
      </head>
      <body className="min-h-screen antialiased font-sans" suppressHydrationWarning>
        <ClientErrorBoundary>
          <GoogleAnalytics />
          <UtmSessionCapture />
          <ContourLiftPageView />
          <ConsultationRequestPopup />
          <ExitIntentPopup />
          <AuthWrapper>
            <ConditionalLayout siteSettings={siteSettings ?? undefined} livePlace={livePlace}>
              {children}
            </ConditionalLayout>
          </AuthWrapper>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}

