import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RegenCatalogClient } from "@/components/regen/catalog/RegenCatalogClient";
import { SHOP_GOALS, goalSlug } from "@/lib/regen/catalog";
import { REGEN_CATEGORY_HUBS } from "@/lib/rx-category-hubs";
import {
  type FAQ,
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const RX_PATH = "/rx";
const RX_TITLE =
  "RE GEN | Peptide & Medical Programs | Hello Gorgeous Oswego IL";
const RX_DESCRIPTION =
  "Science-driven peptide and medical programs from Hello Gorgeous RX™ in Oswego, IL — NP-supervised recovery, hormones, GLP-1, and longevity protocols. Learn what peptides are, then shop RE GEN by goal with flat $30 Illinois shipping.";

const baseMetadata = pageMetadata({
  title: RX_TITLE,
  description: RX_DESCRIPTION,
  path: RX_PATH,
  keywords: [
    "RE GEN shop",
    "RE GEN catalog",
    "online medical weight loss Illinois",
    "compounded semaglutide Oswego",
    "compounded tirzepatide Illinois",
    "GLP-1 telehealth Oswego IL",
    "peptide therapy online Illinois",
    "hormone therapy telehealth Oswego",
    "RE GEN Hello Gorgeous",
    "NP-directed weight loss Naperville Aurora",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: "https://www.hellogorgeousmedspa.com/images/regen/regen-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RE GEN Shop — Medical Weight Loss, Peptides & Hormones | Hello Gorgeous",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: ["https://www.hellogorgeousmedspa.com/images/regen/regen-og-image.jpg"],
  },
};

const REGEN_FAQS: readonly FAQ[] = [
  {
    question: "What is RE GEN by Hello Gorgeous Med Spa?",
    answer:
      "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. Shop by goal — GLP-1 weight loss, peptides, hormones, sexual health, and more — with plans reviewed by Ryan Kent, FNP-BC and eligible medications shipped to your home.",
  },
  {
    question: "How does RE GEN work?",
    answer:
      "Browse the catalog by goal, add items to your cart, complete checkout, then finish your health intake. A nurse practitioner reviews your information (with telehealth when required) before pharmacy fulfillment. Shipping is a flat $30 per order.",
  },
  {
    question: "Who oversees RE GEN treatment plans?",
    answer:
      "Every RE GEN protocol is supervised in Illinois by Ryan Kent, FNP-BC, a board-certified family nurse practitioner — not an out-of-state medical director.",
  },
  {
    question: "Where is RE GEN available?",
    answer:
      "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
  {
    question: "What can I shop for on RE GEN?",
    answer:
      "Medical weight loss (GLP-1), peptide protocols, hormone therapy, sexual health, hair & skin, energy & longevity, lab panels, and wellness injections — browse the full catalog online.",
  },
  {
    question: "How much does RE GEN shipping cost?",
    answer:
      "Eligible prescriptions ship with a flat $30 shipping fee. Program pricing varies by treatment and is shown in the catalog before checkout.",
  },
];

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "RE GEN Shop", url: `${SITE.url}${RX_PATH}` },
]);

const webPage = webPageJsonLd({
  title: RX_TITLE,
  description: RX_DESCRIPTION,
  path: RX_PATH,
});

const faqStructured = faqJsonLd(REGEN_FAQS, `${SITE.url}${RX_PATH}`);

const catalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "RE GEN shop by goal",
  itemListElement: SHOP_GOALS.map((goalId, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: goalId,
    url: `${SITE.url}/rx?goal=${goalSlug(goalId)}`,
  })),
};

export default function RxShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructured) }}
      />

      <Suspense
        fallback={
          <div className="flex min-h-[100dvh] items-center justify-center bg-[#FFF9FB] text-black/50">
            Loading RE GEN shop…
          </div>
        }
      >
        <RegenCatalogClient />
      </Suspense>

      {/* Crawlable copy — portal UI is client-heavy; keep indexable anchors */}
      <section className="sr-only" aria-label="RE GEN shop categories">
        <h1>RE GEN — Peptide & Medical Programs | Hello Gorgeous Oswego IL</h1>
        <p>{RX_DESCRIPTION}</p>
        <ul>
          {SHOP_GOALS.map((goalId) => (
            <li key={goalId}>
              <Link href={`/rx?goal=${goalSlug(goalId)}`}>Shop {goalId}</Link>
            </li>
          ))}
          {REGEN_CATEGORY_HUBS.map((hub) => (
            <li key={hub.id}>
              <Link href={hub.hubPath}>{hub.navLabel}</Link>
            </li>
          ))}
          <li>
            <Link href="/rx/request">Start RE GEN intake</Link>
          </li>
          <li>
            <Link href="/book">Book an in-person consult</Link>
          </li>
        </ul>
      </section>
    </>
  );
}
