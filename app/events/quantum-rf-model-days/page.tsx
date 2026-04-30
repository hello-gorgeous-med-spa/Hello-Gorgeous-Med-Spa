import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CopyPageUrlButton } from "@/components/patient/CopyPageUrlButton";
import { BOOKING_URL } from "@/lib/flows";
import { QUANTUM_RF_MODEL } from "@/lib/quantum-rf-clinical-model";
import { SITE, pageMetadata } from "@/lib/seo";

const pagePath = "/events/quantum-rf-model-days";
const pageUrl = `${SITE.url}${pagePath}`;

const FLYER_PDF_HREF = "/events/quantum-rf-model-days-flyer.pdf";

/** On-page hero + Open Graph (SMS / iMessage rich preview when this URL is shared). */
const PREVIEW_IMAGE_PATH = "/images/events/quantum-rf-model-days-preview.png";
const PREVIEW_IMAGE_WIDTH = 1024;
const PREVIEW_IMAGE_HEIGHT = 602;
const previewImageAbsoluteUrl = `${SITE.url}${PREVIEW_IMAGE_PATH}`;

const BOOK_WITH_UTM = `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}utm_source=website&utm_medium=model_days_landing&utm_campaign=quantum_rf_model_days`;

const PINK = "#E6007E";

const CLIENT_DESCRIPTION = `Limited Quantum RF model program in Oswego, IL — ${QUANTUM_RF_MODEL.display.dateLine}. Minimally invasive InMode body contouring with ${QUANTUM_RF_MODEL.spots} model spots. Medical evaluation required. Book or download the official flyer (PDF).`;

const smsStaffShareBody = encodeURIComponent(`Quantum RF Model Days — details & flyer: ${pageUrl}`);
const smsClientPresetBody = encodeURIComponent(
  `${SITE.name}: Quantum RF Model Days (limited spots). Details & flyer: ${pageUrl}`
);
const smsStaffHref = `sms:&body=${smsStaffShareBody}`;
const smsClientHref = `sms:${SITE.phone.replace(/\D/g, "")}?body=${smsClientPresetBody}`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Quantum RF Model Days — InMode Body Contouring | Hello Gorgeous | Oswego, IL",
    description: CLIENT_DESCRIPTION,
    path: pagePath,
    keywords: [
      "Quantum RF model days Oswego",
      "InMode Quantum RF Illinois",
      "Hello Gorgeous Med Spa body contouring",
      "clinical model RF contouring",
    ],
  }),
  openGraph: {
    type: "website",
    url: pageUrl,
    title: `Quantum RF Model Days | ${SITE.name}`,
    description: `${QUANTUM_RF_MODEL.display.dateLine} · Limited model spots. Book a consultation or view the flyer — Oswego, IL.`,
    siteName: SITE.name,
    images: [
      {
        url: previewImageAbsoluteUrl,
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
        alt: "Quantum RF Model Days — Hello Gorgeous Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Quantum RF Model Days | ${SITE.name}`,
    description: `${QUANTUM_RF_MODEL.display.dateLine} · Limited model spots. Oswego, IL.`,
    images: [previewImageAbsoluteUrl],
  },
};

const highlights = [
  {
    title: "Subdermal RF contouring",
    body: "InMode Quantum RF targets stubborn areas with radiofrequency beneath the surface — designed for tightening and contour support, not as a substitute for surgical liposuction.",
  },
  {
    title: `${QUANTUM_RF_MODEL.spots} model spots`,
    body: "A constrained clinical-model window lets qualified candidates access the protocol with adjusted model investment — candidacy is decided only after medical evaluation.",
  },
  {
    title: "Licensed team · Oswego",
    body: `Care guided by ${QUANTUM_RF_MODEL.provider.primary}; ${QUANTUM_RF_MODEL.provider.supervision}. Same standards you expect at ${SITE.address.addressLocality}, ${SITE.address.addressRegion}.`,
  },
];

export default function QuantumRFModelDaysLandingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_0%,rgba(230,0,126,0.28),transparent_52%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-rose-950/25" />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-14 text-center md:pb-20 md:pt-20">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.38em]" style={{ color: PINK }}>
            InMode Quantum RF · Model program
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
            Quantum RF<br className="sm:hidden" /> Model Days
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/88 md:text-xl">
            Lipo-level contouring ambitions — <strong className="text-white">without the operating room.</strong> See
            package details on the flyer, then book your candidacy conversation.
          </p>
          <div className="mx-auto mt-8 max-w-xl space-y-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/90 md:text-base">
            <p>
              <span className="text-white/55">Featured block · </span>
              <strong className="text-white">{QUANTUM_RF_MODEL.display.dateLine}</strong>
            </p>
            <p className="text-white/75">{QUANTUM_RF_MODEL.display.timeNote}</p>
            <p className="text-sm text-white/60">
              {QUANTUM_RF_MODEL.investmentNote}. Not all inquiries are selected.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-2xl sm:flex-row sm:flex-wrap">
            <a
              href={BOOK_WITH_UTM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-95 sm:flex-1"
              style={{ backgroundColor: PINK }}
            >
              Book consultation
            </a>
            <a
              href={FLYER_PDF_HREF}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white/35 px-8 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 sm:flex-1"
            >
              Download flyer PDF
            </a>
            <Link
              href="/events/quantum-rf-clinical-model"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white/35 px-8 text-sm font-semibold text-white transition hover:border-white sm:flex-1"
            >
              How to apply · model details
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="hover:text-white">
              {SITE.phone}
            </a>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <span>
              {SITE.address.streetAddress}, {SITE.address.addressLocality}
            </span>
          </div>
        </div>
      </section>

      {/* Flyer */}
      <section className="border-b border-black/10 bg-gradient-to-b from-white to-pink-50/30 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">Model days packages</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-black/70 md:text-base">
              Official flyer — same pricing and details we use in clinic. Save the PDF to your phone or print before your
              visit.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.2)]">
            <Image
              src={PREVIEW_IMAGE_PATH}
              alt="Quantum RF Model Days — package overview, Hello Gorgeous Med Spa"
              width={PREVIEW_IMAGE_WIDTH}
              height={PREVIEW_IMAGE_HEIGHT}
              priority
              className="h-auto w-full bg-zinc-50"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={FLYER_PDF_HREF}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-[#E6007E]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Save PDF flyer
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-serif text-2xl font-bold md:text-3xl">What to expect from this window</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-black/65">
            Transparent model-program positioning — consult first, proceed only if medically appropriate.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border-2 border-black/10 bg-white p-6 shadow-sm transition hover:border-black/25"
              >
                <h3 className="font-serif text-lg font-bold">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/75">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t-2 border-black bg-black py-14 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">Ready to see if you qualify?</h2>
          <p className="mt-3 text-sm text-white/75">
            Book a consultation — we&apos;ll walk through the model program, pricing, and whether Quantum RF fits your
            goals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={BOOK_WITH_UTM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-8 text-sm font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: PINK }}
            >
              Book now
            </a>
            <Link
              href="/services/quantum-rf"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/35 px-8 text-sm font-semibold hover:border-white"
            >
              Quantum RF overview
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer + internal tools */}
      <section className="border-t border-black/10 px-6 py-10">
        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-black/55">
          Individual results vary. Quantum RF is a medical procedure with risks; suitability is assessed in person only.
          {QUANTUM_RF_MODEL.provider.primary}; {QUANTUM_RF_MODEL.provider.supervision}.{` `}
          <Link href="/events/quantum-rf-clinical-model" className="font-semibold text-[#E6007E] underline">
            Clinical model FAQs
          </Link>
          .
        </p>

        <details className="mx-auto mt-10 max-w-lg rounded-xl border border-black/10 bg-zinc-50 px-5 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-black/80">For our team · share this page</summary>
          <div className="mt-4 space-y-4 border-t border-black/10 pt-4">
            <p className="text-xs text-black/60">
              Send clients this URL for a clean landing page and link preview:{" "}
              <span className="break-all font-mono text-[11px]">{pageUrl}</span>
            </p>
            <CopyPageUrlButton url={pageUrl} label="Copy page link" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={smsStaffHref}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-black/15 bg-white py-2 text-xs font-semibold hover:border-[#E6007E]"
              >
                SMS (link prefilled)
              </a>
              <a
                href={smsClientHref}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-black/15 bg-white py-2 text-xs font-semibold hover:border-[#E6007E]"
              >
                SMS to {SITE.phone}
              </a>
            </div>
          </div>
        </details>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Quantum RF Model Days",
            url: pageUrl,
            description: CLIENT_DESCRIPTION,
            inLanguage: "en-US",
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          }),
        }}
      />
    </main>
  );
}
