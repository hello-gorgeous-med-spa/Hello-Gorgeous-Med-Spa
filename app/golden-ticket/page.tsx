import type { Metadata } from "next";

import { GoldenTicketPageContent } from "@/components/golden-ticket/GoldenTicketPageContent";
import {
  GOLDEN_TICKET_FAQS,
  GOLDEN_TICKET_PACKAGES,
  GOLDEN_TICKET_PATH,
  GOLDEN_TICKET_SEO,
} from "@/lib/campaigns/golden-ticket-2026";
import { SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${GOLDEN_TICKET_PATH}`;

const FAQS = GOLDEN_TICKET_FAQS.map((f) => ({ question: f.q, answer: f.a }));

const baseMeta = pageMetadata({
  title: GOLDEN_TICKET_SEO.title,
  description: GOLDEN_TICKET_SEO.description,
  path: GOLDEN_TICKET_PATH,
  keywords: [
    "Golden Ticket Hello Gorgeous",
    "Mommy Makeover Oswego",
    "Morpheus8 package Oswego",
    "Quantum RF package Naperville",
    "Solaria CO2 Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/quantum-rf/clinic-results/dr-arora-treating-1.jpg`,
        width: 1200,
        height: 800,
        alt: GOLDEN_TICKET_SEO.ogAlt,
      },
    ],
  },
};

function offerListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "VIP Golden Ticket — Mommy Makeover Collection",
    url: PAGE_URL,
    numberOfItems: GOLDEN_TICKET_PACKAGES.length,
    itemListElement: GOLDEN_TICKET_PACKAGES.map((pkg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: pkg.flyerName,
        price: pkg.ticketPriceUsd,
        priceCurrency: "USD",
        url: `${PAGE_URL}#${pkg.id}`,
        availability: "https://schema.org/InStock",
        description: pkg.inclusions.map((inc) => inc.label).join("; "),
      },
    })),
  };
}

export default function GoldenTicketPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Specials", url: `${SITE.url}/specials` },
              { name: "Golden Ticket", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, PAGE_URL)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerListJsonLd()) }} />
      <GoldenTicketPageContent />
    </>
  );
}
