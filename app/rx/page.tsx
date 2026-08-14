import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RegenCatalogClient } from "@/components/regen/catalog/RegenCatalogClient";
import { CLIENT_SHOP_GOALS, goalSlug } from "@/lib/regen/catalog";
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
import { HG_ABOUT_EXTRACT, HG_CORE_AEO_FAQS } from "@/lib/aeo-canonical";
import { medicalWebPageJsonLd } from "@/lib/founder-credentials";

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
    "shop peptides Illinois",
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
  ...HG_CORE_AEO_FAQS.filter((f) =>
    /weight loss|GLP-1|medical practice|prescription/i.test(f.question),
  ),
  {
    question: "What is RE GEN by Hello Gorgeous Med Spa?",
    answer:
      "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. Shop by goal — GLP-1 weight loss, peptides, hormones, sexual health, and more — with plans reviewed by Ryan Kent, FNP-BC and eligible medications shipped to your home.",
  },
  {
    question: "How does telehealth medical weight loss work in Illinois with Hello Gorgeous?",
    answer:
      "You start with goals and intake, then an Illinois NP reviews your history (telehealth when required). Prescriptions require provider approval before a US-licensed pharmacy ships eligible orders — consult-framed care, not drug sales without review.",
  },
  {
    question: "How does RE GEN work?",
    answer:
      "Pick a protocol, then start intake — free to submit. A $49 fee reserves your consult with a nurse practitioner, who reviews your history and sets your protocol. You are invoiced for medication only after approval, then pick it up in Oswego or have it shipped for a flat $30.",
  },
  {
    question: "Who oversees RE GEN treatment plans?",
    answer:
      "Every RE GEN protocol is supervised in Illinois by Ryan Kent, FNP-BC, a board-certified family nurse practitioner — not an out-of-state medical director. Provider review is required before fulfillment.",
  },
  {
    question: "Where is RE GEN available?",
    answer:
      "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
  {
    question: "What can I shop for on RE GEN?",
    answer:
      "The shop lists our peptide protocols, medical weight loss (GLP-1), and hormone therapy — the programs Ryan Kent, FNP-BC prescribes most. Other compounded options, including sexual health, hair and skin, and wellness injections, are still available; ask about them at your consult or start at the RX request portal. Approval is never automatic.",
  },
  {
    question: "How much does RE GEN shipping cost?",
    answer:
      "Eligible prescriptions ship with a flat $30 shipping fee. Program pricing varies by treatment and is shown on each protocol before you start intake.",
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

const medicalWebPage = medicalWebPageJsonLd({
  url: `${SITE.url}${RX_PATH}`,
  name: RX_TITLE,
  lastReviewed: "2026-07-13",
});

const catalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "RE GEN shop by goal",
  itemListElement: CLIENT_SHOP_GOALS.map((goalId, index) => ({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPage) }}
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

      {/*
        Crawlable copy for bots and screen readers. This repeats the on-page FAQ
        accordion, so it is sr-only rather than rendered — the text stays in the DOM
        (no display:none) and the FAQPage JSON-LD above is unchanged.
      */}
      <section className="sr-only" aria-label="About Hello Gorgeous RX and frequently asked questions">
        <div>
          <h2>About Hello Gorgeous RX / RE GEN</h2>
          <p>{HG_ABOUT_EXTRACT}</p>
          <p>{RX_DESCRIPTION}</p>
          <h2>RE GEN FAQ</h2>
          <dl>
            {REGEN_FAQS.map((f) => (
              <div key={f.question}>
                <dt>{f.question}</dt>
                <dd>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Goal and category links stay visible in the footer to keep internal crawl depth. */}
      <nav
        aria-label="RE GEN goals and categories"
        className="border-t border-black/10 bg-white px-6 py-8"
      >
        <ul className="mx-auto flex max-w-[1200px] flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-black/50">
          {CLIENT_SHOP_GOALS.map((goalId) => (
            <li key={goalId}>
              <Link href={`/rx?goal=${goalSlug(goalId)}`} className="hover:text-[#E6007E] hover:underline">
                Shop {goalId}
              </Link>
            </li>
          ))}
          {REGEN_CATEGORY_HUBS.map((hub) => (
            <li key={hub.id}>
              <Link href={hub.hubPath} className="hover:text-[#E6007E] hover:underline">
                {hub.navLabel}
              </Link>
            </li>
          ))}
          {/* The peptide/hormone primers moved off this page — keep them linked from it. */}
          <li>
            <Link href="/rx/learn/what-are-peptides" className="hover:text-[#E6007E] hover:underline">
              What are peptides?
            </Link>
          </li>
          <li>
            <Link
              href="/rx/learn/what-is-hormone-therapy"
              className="hover:text-[#E6007E] hover:underline"
            >
              What is hormone therapy?
            </Link>
          </li>
          <li>
            <Link href="/rx/learn" className="hover:text-[#E6007E] hover:underline">
              RE GEN Learn
            </Link>
          </li>
          <li>
            <Link href="/rx/request" className="hover:text-[#E6007E] hover:underline">
              Start RE GEN intake
            </Link>
          </li>
          <li>
            <Link href="/book" className="hover:text-[#E6007E] hover:underline">
              Book an in-person consult
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
