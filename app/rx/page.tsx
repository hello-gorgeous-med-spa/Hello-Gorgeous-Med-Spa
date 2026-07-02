import type { Metadata } from "next";
import Link from "next/link";

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
const RX_TITLE = "RE GEN by Hello Gorgeous Med Spa | Online Medical Weight Loss, Peptides & Hormones";
const RX_DESCRIPTION =
  "RE GEN is the telehealth arm of Hello Gorgeous Med Spa in Oswego, IL — NP-directed medical weight loss (GLP-1), peptides, hormone therapy, sexual health, and lab testing. Online intake, NP review, shipped to your door with flat $30 shipping.";

const baseMetadata = pageMetadata({
  title: RX_TITLE,
  description: RX_DESCRIPTION,
  path: RX_PATH,
  keywords: [
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
        alt: "RE GEN - Renew. Rebalance. Regenerate. | Medical Weight Loss, Peptides & Hormones",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: ["https://www.hellogorgeousmedspa.com/images/regen/regen-og-image.jpg"],
  },
};

/** Defensible, non-prescriptive FAQs — also emitted as FAQPage structured data. */
const REGEN_FAQS: readonly FAQ[] = [
  {
    question: "What is RE GEN by Hello Gorgeous Med Spa?",
    answer:
      "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. It offers nurse-practitioner-directed medical weight loss, peptides, hormone therapy, sexual health support, and lab testing, with plans reviewed by Ryan Kent, FNP-BC, and eligible medications shipped to your home.",
  },
  {
    question: "How does RE GEN work?",
    answer:
      "You complete a short online intake, a nurse practitioner reviews your information (with a telehealth visit when required), and approved prescriptions ship to your door. Shipping is a flat $30 per order.",
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
    question: "What treatments can I get through RE GEN?",
    answer:
      "Medical weight loss (compounded GLP-1 programs), peptide protocols, hormone therapy, sexual health support, prescription dermatology, testosterone optimization, lab panels, and everyday wellness injections.",
  },
  {
    question: "How much does RE GEN shipping cost?",
    answer:
      "Eligible prescriptions ship with a flat $30 shipping fee. Program pricing varies by treatment and is shown during intake.",
  },
];

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "RE GEN", url: `${SITE.url}${RX_PATH}` },
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
  name: "RE GEN treatment categories",
  itemListElement: REGEN_CATEGORY_HUBS.map((hub, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: hub.navLabel,
    description: hub.hero.subtitle,
    url: `${SITE.url}${hub.hubPath}`,
  })),
};

export default function RxPage() {
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

      {/* Interactive RE GEN storefront — full viewport on mobile, no site chrome (see ConditionalLayout). */}
      <div className="fixed inset-0 z-0 h-[100dvh] w-full bg-black">
        <iframe
          src="/regen-site/index.html"
          className="h-full w-full border-0"
          title="RE GEN by Hello Gorgeous Med Spa"
          allow="payment *"
        />
      </div>

      {/* Mobile-first crawlable copy — sr-only so storefront iframe stays full-screen */}
      <section className="sr-only" aria-label="RE GEN online medical weight loss peptides hormones Illinois">
        <h1>RE GEN by Hello Gorgeous Med Spa — Online Medical Weight Loss, Peptides and Hormones</h1>
        <p>
          RE GEN is the telehealth prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois.
          Nurse-practitioner-directed GLP-1 weight loss, peptide therapy, hormone optimization, sexual
          wellness, and lab testing. Online intake, provider review by Ryan Kent FNP-BC, prescriptions
          shipped to your door across Illinois with flat $30 shipping.
        </p>
        <ul>
          <li>
            <a href="/rx/weight-loss">Medical weight loss — compounded semaglutide and tirzepatide</a>
          </li>
          <li>
            <a href="/peptides">Peptide therapy — BPC-157, NAD+, recovery and longevity protocols</a>
          </li>
          <li>
            <a href="/rx/hormones">Hormone therapy — TRT and HRT</a>
          </li>
          <li>
            <a href="/rx/request">Start your RE GEN intake</a>
          </li>
        </ul>
      </section>

      {/* Crawlable SEO copy — desktop only; storefront iframe is the mobile experience */}
      <section
        className="hidden md:block relative z-10"
        aria-label="About RE GEN by Hello Gorgeous Med Spa"
        style={{
          background: "#000",
          color: "#fff",
          padding: "72px 24px",
          marginTop: "100dvh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#FF2D8E",
              margin: "0 0 14px",
            }}
          >
            RE GEN · The prescription arm of Hello Gorgeous Med Spa
          </p>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.08,
              margin: "0 0 18px",
              fontWeight: 700,
            }}
          >
            Online medical weight loss, peptides &amp; hormones — NP-directed in Illinois
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 760,
              margin: "0 0 14px",
            }}
          >
            RE GEN is the telehealth and prescription side of Hello Gorgeous Med Spa in Oswego, IL.
            Complete a short online intake, have your plan reviewed by Ryan Kent, FNP-BC, and get
            eligible medications shipped to your door with flat $30 shipping. Serving Oswego,
            Naperville, Aurora, Plainfield, Yorkville, and Montgomery.
          </p>

          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 24,
              margin: "40px 0 18px",
              fontWeight: 700,
            }}
          >
            Explore RE GEN treatments
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {REGEN_CATEGORY_HUBS.map((hub) => (
              <li key={hub.id}>
                <Link
                  href={hub.hubPath}
                  style={{
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 16,
                    padding: "18px 20px",
                    color: "#fff",
                    textDecoration: "none",
                    height: "100%",
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 700, display: "block", marginBottom: 6 }}>
                    {hub.navLabel}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.66)" }}>
                    {hub.hero.subtitle}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 24,
              margin: "48px 0 18px",
              fontWeight: 700,
            }}
          >
            RE GEN — frequently asked questions
          </h2>
          <div>
            {REGEN_FAQS.map((faq) => (
              <details
                key={faq.question}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.14)",
                  padding: "16px 0",
                }}
              >
                <summary
                  style={{ fontSize: 17, fontWeight: 600, cursor: "pointer", listStyle: "none" }}
                >
                  {faq.question}
                </summary>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                    margin: "12px 0 0",
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link
              href="/rx/request"
              style={{
                background: "#FF2D8E",
                color: "#fff",
                borderRadius: 28,
                padding: "14px 28px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start your RE GEN intake
            </Link>
            <Link
              href="/book"
              style={{
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                borderRadius: 28,
                padding: "14px 28px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Book an in-person consult
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
