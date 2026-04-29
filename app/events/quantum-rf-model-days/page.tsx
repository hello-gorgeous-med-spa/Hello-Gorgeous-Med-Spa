import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CopyPageUrlButton } from "@/components/patient/CopyPageUrlButton";
import { BOOKING_URL } from "@/lib/flows";
import { QUANTUM_RF_MODEL } from "@/lib/quantum-rf-clinical-model";
import { SITE, pageMetadata } from "@/lib/seo";

const pagePath = "/events/quantum-rf-model-days";
const pageUrl = `${SITE.url}${pagePath}`;

/** Serves PDF from /public/events/ — same graphic clients can save or print. */
const FLYER_PDF_HREF = "/events/quantum-rf-model-days-flyer.pdf";

/** On-page + Open Graph / SMS link preview — screenshot of the approved Model Days flyer (kept in repo). */
const PREVIEW_IMAGE_PATH = "/images/events/quantum-rf-model-days-preview.png";
const PREVIEW_IMAGE_WIDTH = 1024;
const PREVIEW_IMAGE_HEIGHT = 602;
const previewImageAbsoluteUrl = `${SITE.url}${PREVIEW_IMAGE_PATH}`;

const BOOK_WITH_UTM = `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}utm_source=sms&utm_medium=friendly_link&utm_campaign=quantum_rf_model_days_flyer`;

const smsStaffShareBody = encodeURIComponent(
  `Quantum RF Model Days — flyer & details: ${pageUrl}`
);

const smsClientPresetBody = encodeURIComponent(
  `${SITE.name}: Quantum RF Model Days (limited spots). Flyer & how to apply: ${pageUrl}`
);

const smsStaffHref = `sms:&body=${smsStaffShareBody}`;
const smsClientHref = `sms:${SITE.phone.replace(/\D/g, "")}?body=${smsClientPresetBody}`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Quantum RF Model Days — Flyer & SMS Share Link",
    description: `Official flyer for Quantum RF Model Days (${QUANTUM_RF_MODEL.display.dateLine}). Download the PDF, save or print, or share this page link for a rich preview in text messages. Hello Gorgeous Med Spa, Oswego, IL. ${SITE.phone}`,
    path: pagePath,
    keywords: [
      "Quantum RF model days",
      "InMode Quantum RF Oswego",
      "Hello Gorgeous Med Spa flyer",
      "clinical model body contouring Illinois",
    ],
  }),
  openGraph: {
    type: "website",
    url: pageUrl,
    title: `Quantum RF Model Days Flyer | ${SITE.name}`,
    description: `Limited model spots · ${QUANTUM_RF_MODEL.display.dateLine}. Download PDF or share this page for a preview card in SMS/iMessage.`,
    siteName: SITE.name,
    images: [
      {
        url: previewImageAbsoluteUrl,
        width: PREVIEW_IMAGE_WIDTH,
        height: PREVIEW_IMAGE_HEIGHT,
        alt: "Quantum RF Model Days flyer — Hello Gorgeous Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Quantum RF Model Days Flyer | ${SITE.name}`,
    description: `Limited model spots · ${QUANTUM_RF_MODEL.display.dateLine}. Download PDF or share this link.`,
    images: [previewImageAbsoluteUrl],
  },
};

export default function QuantumRFModelDaysFlyerPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/10 bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(230,0,126,0.3),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-14 text-center md:pt-18">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E6007E]">Shareable flyer · SMS-ready</p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight md:text-5xl">Quantum RF Model Days</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 md:text-lg">
            Same professional flyer as in clinic—<strong className="text-white">download the PDF</strong> below, or send
            clients <strong className="text-white">this page link</strong> so phones can show a preview image before they
            tap (works best with a page link, not the raw PDF).
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Featured date:{" "}
            <span className="text-white/90 font-semibold">{QUANTUM_RF_MODEL.display.dateLine}</span>
            {" · "}
            <span className="text-white/80">{QUANTUM_RF_MODEL.spots} model spots</span> on the clinical model program.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="overflow-hidden rounded-2xl border-2 border-black bg-zinc-50 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
          <Image
            src={PREVIEW_IMAGE_PATH}
            alt="Quantum RF Model Days flyer — Hello Gorgeous Med Spa"
            width={PREVIEW_IMAGE_WIDTH}
            height={PREVIEW_IMAGE_HEIGHT}
            priority
            className="h-auto w-full"
          />
        </div>
        <p className="mt-4 text-center text-xs text-black/55">
          Preview image used for iMessage / link cards when you share{" "}
          <span className="break-all font-mono text-[11px]">{pageUrl}</span>.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href={FLYER_PDF_HREF}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#E6007E]"
          >
            Download PDF flyer
          </a>
          <Link
            href="/events/quantum-rf-clinical-model"
            className="inline-flex items-center justify-center rounded-full border-2 border-black px-8 py-3.5 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Clinical model details &amp; how to apply
          </Link>
          <a
            href={BOOK_WITH_UTM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border-2 border-black px-8 py-3.5 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Book consultation
          </a>
        </div>
      </section>

      <section className="border-y border-black/10 bg-zinc-50 py-12">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-center font-serif text-xl font-bold md:text-2xl">Send by text (staff)</h2>
          <p className="mt-3 text-center text-sm text-black/75">
            Copy the link and paste into SMS, or open a blank text with the message prefilled for you.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <CopyPageUrlButton url={pageUrl} label="Copy flyer page link" />
            <p className="break-all text-center font-mono text-xs text-black/50">{pageUrl}</p>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={smsStaffHref}
                className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-6 py-3 text-sm font-semibold hover:border-[#E6007E]"
              >
                Open SMS (link only)
              </a>
              <a
                href={smsClientHref}
                className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-6 py-3 text-sm font-semibold hover:border-[#E6007E]"
              >
                Open SMS to client ({SITE.phone})
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-black/55">
            Individual results vary. Candidates are selected after medical evaluation. References the same Quantum RF
            clinical model program — see{" "}
            <Link href="/events/quantum-rf-clinical-model" className="font-semibold text-[#E6007E] underline">
              full event page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-10 text-center">
        <Link
          href="/services/quantum-rf"
          className="text-sm font-semibold text-[#E6007E] underline underline-offset-4 hover:text-black"
        >
          Learn about Quantum RF →
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Quantum RF Model Days Flyer",
            url: pageUrl,
            description:
              "Official downloadable flyer and share link for Quantum RF Model Days at Hello Gorgeous Med Spa, Oswego.",
            inLanguage: "en-US",
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
          }),
        }}
      />
    </main>
  );
}
