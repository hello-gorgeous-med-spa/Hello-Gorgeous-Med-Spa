import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PeptideTherapyPageContent } from "@/components/peptides/PeptideTherapyPageContent";
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
import { PEPTIDES_HUB_FAQS } from "@/lib/peptide-seo-faqs";

const RX_PATH = "/rx";
const RX_TITLE = "Peptide Therapy | Hello Gorgeous RX | Oswego, IL";
const RX_DESCRIPTION =
  "Medically supervised peptide therapy from Hello Gorgeous RX in Oswego, IL — GLP-1 weight loss, recovery peptides, hormones, and vitality protocols. NP consult with Ryan Kent, FNP-BC. Pickup in Oswego or ship across Illinois.";

const baseMetadata = pageMetadata({
  title: RX_TITLE,
  description: RX_DESCRIPTION,
  path: RX_PATH,
  keywords: [
    "peptide therapy Oswego",
    "Hello Gorgeous RX",
    "RE GEN peptides",
    "online medical weight loss Illinois",
    "compounded semaglutide Oswego",
    "compounded tirzepatide Illinois",
    "GLP-1 telehealth Oswego IL",
    "peptide therapy online Illinois",
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
        alt: "Hello Gorgeous RX — Peptide Therapy, Medically Supervised | Oswego, IL",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: ["https://www.hellogorgeousmedspa.com/images/regen/regen-og-image.jpg"],
  },
};

const seenFaq = new Set<string>();
const REGEN_FAQS: readonly FAQ[] = [
  ...PEPTIDES_HUB_FAQS,
  ...HG_CORE_AEO_FAQS.filter((f) =>
    /weight loss|GLP-1|medical practice|prescription/i.test(f.question),
  ),
].filter((faq) => {
  if (seenFaq.has(faq.question)) return false;
  seenFaq.add(faq.question);
  return true;
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "Hello Gorgeous RX", url: `${SITE.url}${RX_PATH}` },
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

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isRxShopView(params: Record<string, string | string[] | undefined>): boolean {
  return Boolean(
    firstParam(params.browse) ||
      firstParam(params.goal) ||
      firstParam(params.q)?.trim() ||
      firstParam(params.cat) ||
      firstParam(params.product),
  );
}

export default async function RxShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const showShop = isRxShopView(params);

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

      {showShop ? (
        <Suspense
          fallback={
            <div className="flex min-h-[100dvh] items-center justify-center bg-[#FFF9FB] text-black/50">
              Loading RE GEN shop…
            </div>
          }
        >
          <RegenCatalogClient />
        </Suspense>
      ) : (
        <PeptideTherapyPageContent />
      )}

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

      <nav
        aria-label="RE GEN goals and categories"
        className="border-t border-black/10 bg-white px-6 py-8"
      >
        <ul className="mx-auto flex max-w-[1200px] flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-black/50">
          <li>
            <Link href="/rx?browse=all" className="hover:text-[#E6007E] hover:underline">
              Shop all
            </Link>
          </li>
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
          <li>
            <Link href="/peptides" className="hover:text-[#E6007E] hover:underline">
              Peptide therapy
            </Link>
          </li>
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
