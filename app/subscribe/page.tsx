import { Metadata } from "next";
import { SubscribeContent } from "./SubscribeContent";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FREE $75 Med Spa Service | Subscribe to No Prior Authorization | Hello Gorgeous",
  description: "Join No Prior Authorization and get a FREE service up to $75 at Hello Gorgeous Med Spa in Oswego, IL. No insurance hassles, no waiting, no referrals needed. Same-day appointments available. B12, vitamin injections, consultations & more - completely FREE for new subscribers.",
  keywords: [
    "no prior authorization",
    "free med spa service",
    "free B12 injection",
    "free vitamin injection",
    "med spa membership",
    "healthcare subscription",
    "no insurance needed",
    "same day appointments",
    "immediate care Oswego IL",
    "free consultation med spa",
    "Hello Gorgeous Med Spa",
    "Oswego med spa",
    "free glutathione injection",
    "free trigger point injection",
    "healthcare without insurance",
    "transparent healthcare pricing",
    "direct access healthcare",
    "med spa deals Oswego",
    "free aesthetic consultation",
    "wellness membership Illinois",
  ].join(", "),
  
  // OpenGraph for social sharing
  openGraph: {
    title: "🎁 FREE $75 Med Spa Service | No Prior Authorization",
    description: "Subscribe FREE and get a complimentary service up to $75 at Hello Gorgeous Med Spa. No insurance, no referrals, no waiting. Choose from B12, vitamins, consultations & more!",
    url: `${SITE.url}/subscribe`,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE.url}/og-subscribe.jpg`,
        width: 1200,
        height: 630,
        alt: "Free $75 Med Spa Service - No Prior Authorization Subscription",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "🎁 FREE $75 Med Spa Service | Subscribe Now",
    description: "Join No Prior Authorization - Get a FREE service up to $75. No insurance needed, no waiting!",
    images: [`${SITE.url}/og-subscribe.jpg`],
  },
  
  // Additional SEO
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  
  alternates: {
    canonical: `${SITE.url}/subscribe`,
  },
  
  // Category
  category: "Healthcare",
};

// Structured Data for SEO
const subscribeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Main Offer
    {
      "@type": "Offer",
      "@id": `${SITE.url}/subscribe#offer`,
      "name": "Free $75 Med Spa Service for New Subscribers",
      "description": "Subscribe to No Prior Authorization and receive a complimentary service up to $75 at Hello Gorgeous Med Spa. Choose from B12 injections, vitamin injections, consultations, and more.",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${SITE.url}/subscribe`,
      "validFrom": "2026-01-01",
      "seller": {
        "@type": "MedicalBusiness",
        "name": "Hello Gorgeous Med Spa",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "74 W. Washington St",
          "addressLocality": "Oswego",
          "addressRegion": "IL",
          "postalCode": "60543",
          "addressCountry": "US",
        },
      },
      "itemOffered": {
        "@type": "Service",
        "name": "Med Spa Services",
        "description": "Professional aesthetic and wellness services including vitamin injections, consultations, and treatments",
      },
    },
    // Organization
    {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
      "name": "No Prior Authorization",
      "description": "Healthcare membership program providing direct access to medical services without insurance hassles, referrals, or waiting periods.",
      "url": SITE.url,
      "logo": `${SITE.url}/logo.png`,
      "sameAs": [
        "https://nopriorauthorization.com",
      ],
      "parentOrganization": {
        "@type": "MedicalBusiness",
        "name": "Hello Gorgeous Med Spa",
      },
    },
    // Service
    {
      "@type": "Service",
      "@id": `${SITE.url}/subscribe#service`,
      "name": "No Prior Authorization Membership",
      "serviceType": "Healthcare Membership",
      "description": "A membership program that provides immediate access to healthcare services without insurance pre-approvals, referrals, or waiting periods. Members receive a free service up to $75 and ongoing benefits including 10% off all services.",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "Hello Gorgeous Med Spa",
        "telephone": "+1-630-636-6193",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "74 W. Washington St",
          "addressLocality": "Oswego",
          "addressRegion": "IL",
          "postalCode": "60543",
          "addressCountry": "US",
        },
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 41.6828,
          "longitude": -88.3515,
        },
        "geoRadius": "50000",
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Free Services for New Subscribers",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "B12 Injection",
              "description": "Vitamin B12 energy boost injection",
            },
            "price": "0",
            "priceCurrency": "USD",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Vitamin D Injection",
              "description": "Vitamin D supplementation injection",
            },
            "price": "0",
            "priceCurrency": "USD",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Lipotropic Injection",
              "description": "Fat-burning metabolism boost injection",
            },
            "price": "0",
            "priceCurrency": "USD",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Glutathione Injection",
              "description": "Antioxidant and skin brightening injection",
            },
            "price": "0",
            "priceCurrency": "USD",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Trigger Point Injection",
              "description": "Pain relief trigger point injection",
            },
            "price": "0",
            "priceCurrency": "USD",
          },
        ],
      },
    },
    // FAQ Page
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/subscribe#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is No Prior Authorization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No Prior Authorization is a membership program that gives you direct access to healthcare services without the traditional insurance hassles, referrals, or waiting periods. We believe everyone deserves immediate access to quality care.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I claim my free $75 service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "After subscribing, you'll receive a welcome email with your member code. Simply mention your membership when booking at Hello Gorgeous Med Spa and choose any service up to $75 value - it's completely free!",
          },
        },
        {
          "@type": "Question",
          "name": "Is this really free? What's the catch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, it's truly free! We want you to experience the quality of care at Hello Gorgeous Med Spa. We're confident you'll love it and become a returning client. Think of it as our way of saying 'welcome to the family.'",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use insurance with No Prior Authorization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No Prior Authorization operates independently of insurance. This gives you freedom to access services without pre-approvals, referrals, or coverage limitations. You pay transparent, upfront prices.",
          },
        },
        {
          "@type": "Question",
          "name": "What happens after my free service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You'll continue enjoying member benefits including 10% off all services, priority booking, and exclusive perks. There's no obligation to continue, but most members love the convenience!",
          },
        },
        {
          "@type": "Question",
          "name": "Who are the providers at Hello Gorgeous Med Spa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hello Gorgeous Med Spa is staffed by board-certified nurse practitioners including Danielle Glazier, FNP-BC (founder) and Ryan Kent, FNP-BC, both with Full Practice Authority credentials.",
          },
        },
      ],
    },
    // Breadcrumb
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE.url}/subscribe#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE.url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Subscribe - Free $75 Service",
          "item": `${SITE.url}/subscribe`,
        },
      ],
    },
    // WebPage
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/subscribe#webpage`,
      "url": `${SITE.url}/subscribe`,
      "name": "Subscribe to No Prior Authorization | FREE $75 Med Spa Service",
      "description": "Join No Prior Authorization and get a FREE service up to $75 at Hello Gorgeous Med Spa. No insurance hassles, no waiting, no referrals needed.",
      "isPartOf": {
        "@id": `${SITE.url}#website`,
      },
      "about": {
        "@id": `${SITE.url}/subscribe#service`,
      },
      "breadcrumb": {
        "@id": `${SITE.url}/subscribe#breadcrumb`,
      },
      "mainEntity": {
        "@id": `${SITE.url}/subscribe#offer`,
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".hero-description"],
      },
    },
  ],
};

export default function SubscribePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subscribeJsonLd) }}
      />
      <SubscribeContent />
    </>
  );
}
