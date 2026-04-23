import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";
import { QUANTUM_RF_MODEL } from "@/lib/quantum-rf-clinical-model";
import { SITE, breadcrumbJsonLd, eventJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

const PINK = "#E6007E";
const pagePath = "/events/quantum-rf-clinical-model";
const pageUrl = `${SITE.url}${pagePath}`;

const APPLY_UTM = "utm_source=website&utm_medium=event&utm_campaign=quantum_rf_model_may4";

const bookApplyUrl = `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}${APPLY_UTM}`;

const smsBody = encodeURIComponent("MODEL — interested in the Quantum RF clinical model date (May 4).");
const SMS_HREF = `sms:${SITE.phone.replace(/\D/g, "")}?body=${smsBody}`;

const EVENT_FAQS = [
  {
    question: "What is a clinical model spot?",
    answer:
      "We reserve a very limited number of model appointments for advanced contouring so selected patients can access the procedure with a reduced model investment, in exchange for documentation and case use consistent with our clinical protocols. It is not a free treatment.",
  },
  {
    question: "How do I know if I’m a candidate?",
    answer:
      "Candidacy is determined only after medical evaluation. Quantum RF is a minimally invasive subdermal procedure; not every patient is appropriate. We’ll be direct with you if another approach is a better fit.",
  },
  {
    question: "What should I do to apply?",
    answer:
      `Comment MODEL on our recent social posts, send us a text with the word MODEL (${SITE.phone}), or book a consultation online and reference “Quantum RF model” in your message.`,
  },
] as const;

const PAGE_LONG_DESCRIPTION = `3 model spots: Quantum RF clinical experience May 4, 2026 at Hello Gorgeous Med Spa, Oswego. ${QUANTUM_RF_MODEL.provider.primary}, ${QUANTUM_RF_MODEL.provider.supervision}. Reduced model investment — not a giveaway. Apply: comment MODEL or message. ${SITE.phone}`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Quantum RF Clinical Model — 3 Spots, May 4 | Hello Gorgeous | Oswego, IL",
    description: PAGE_LONG_DESCRIPTION,
    path: pagePath,
  }),
  keywords: [
    "Quantum RF model",
    "InMode Quantum RF Oswego",
    "clinical model med spa",
    "non-surgical body contouring Illinois",
    "Hello Gorgeous Med Spa",
    "Ryan Kent FNP-BC",
  ],
};

export default function QuantumRFClinicalModelPage() {
  const eventLd = eventJsonLd({
    name: `${QUANTUM_RF_MODEL.headline} — ${QUANTUM_RF_MODEL.spots} model spots`,
    startDate: QUANTUM_RF_MODEL.startDateIso,
    endDate: QUANTUM_RF_MODEL.endDateIso,
    description: `Limited clinical model opportunity: InMode Quantum RF minimally invasive contouring. ${QUANTUM_RF_MODEL.spots} qualified candidates, reduced model investment. ${QUANTUM_RF_MODEL.provider.primary}; ${QUANTUM_RF_MODEL.provider.supervision}. ${SITE.name}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion}.`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Quantum RF clinical model", url: pageUrl },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Quantum RF Clinical Model Experience | Hello Gorgeous Med Spa",
            url: pageUrl,
            description: PAGE_LONG_DESCRIPTION,
            inLanguage: "en-US",
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
            about: { "@id": `${SITE.url}/services/quantum-rf#procedure` },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd([...EVENT_FAQS], pageUrl)) }}
      />

      <main className="min-h-screen bg-white text-black">
        <section className="relative overflow-hidden bg-black text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_0%,rgba(230,0,126,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-rose-950/30" />
          <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-14 text-center md:pb-20 md:pt-20">
            <p
              className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.35em] sm:text-xs"
              style={{ color: PINK }}
            >
              Limited model release · {QUANTUM_RF_MODEL.spots} spots
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {QUANTUM_RF_MODEL.headline}
            </h1>
            <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-left sm:mx-auto sm:max-w-lg sm:text-center">
              <p>
                <span className="text-white/50">📅 </span>
                <span className="font-semibold text-white">{QUANTUM_RF_MODEL.display.dateLine}</span>
              </p>
              <p>
                <span className="text-white/50">👩‍⚕️ </span>
                <span className="text-white/90">
                  Performed by {QUANTUM_RF_MODEL.provider.primary} — {QUANTUM_RF_MODEL.provider.supervision}
                </span>
              </p>
              <p className="text-sm text-white/60">{QUANTUM_RF_MODEL.display.timeNote}</p>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              We&apos;re opening <strong className="text-white">{QUANTUM_RF_MODEL.spots} model spots</strong> for an
              advanced subdermal contouring procedure. This is a{" "}
              <strong className="text-white">limited clinical opportunity</strong> — {QUANTUM_RF_MODEL.investmentNote.toLowerCase()}.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:gap-4">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-95"
                style={{ backgroundColor: PINK }}
              >
                Instagram — comment MODEL
              </a>
              <a
                href={SMS_HREF}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/40 px-6 text-sm font-semibold text-white transition hover:border-white"
                data-sms-click
              >
                Text us MODEL
              </a>
            </div>
            <a
              href={bookApplyUrl}
              className="mt-4 block text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white"
              data-book-now
            >
              Or book a consultation to apply
            </a>
          </div>
        </section>

        <section className="border-b-2 border-black py-14 px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-serif text-2xl font-bold md:text-3xl">What this procedure is for</h2>
            <p className="mt-3 text-center text-sm text-black/70">
              Minimally invasive InMode Quantum RF — subdermal radiofrequency, not a surface facial.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Improve the appearance of loose skin",
                "Help contour targeted areas",
                "Support collagen remodeling over time (results build over weeks to months)",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-base text-black/90 md:text-lg">
                  <span className="shrink-0" style={{ color: PINK }}>
                    ✨
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-xl border-2 border-black bg-black p-4 text-center text-sm font-semibold text-white">
              This is <span style={{ color: PINK }}>not a giveaway</span> — it&apos;s a selected clinical opportunity
              with a <strong>reduced model investment</strong> for patients who meet criteria.
            </p>
          </div>
        </section>

        <section className="py-14 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">How to apply</h2>
            <p className="mt-3 text-sm text-black/70">
              We&apos;re making this easy on social and by text.
            </p>
            <div className="mt-8 space-y-4 text-left sm:mx-auto sm:max-w-md">
              <div className="rounded-xl border-2 border-black p-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
                  Option 1
                </p>
                <p className="mt-1 font-medium">
                  On Instagram, comment <strong>MODEL</strong> on a recent Reel or post so our team can route your
                  interest.
                </p>
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold hover:underline"
                  style={{ color: PINK }}
                >
                  Open Instagram ↗
                </a>
              </div>
              <div className="rounded-xl border-2 border-black p-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>
                  Option 2
                </p>
                <p className="mt-1 font-medium">
                  Send a message: text <strong>MODEL</strong> to {SITE.phone} (opens SMS on your phone).
                </p>
                <a
                  href={SMS_HREF}
                  className="mt-2 inline-block text-sm font-semibold hover:underline"
                  style={{ color: PINK }}
                >
                  Text {SITE.phone} ↗
                </a>
              </div>
            </div>
            <p className="mt-6 text-xs text-black/50">
              Individual results may vary. A <strong>consultation is required</strong> to determine candidacy. Not all
              applicants will be selected.
            </p>
          </div>
        </section>

        <section className="bg-black py-12 px-6 text-white">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-serif text-2xl font-bold">Questions</h2>
            <div className="mt-8 space-y-6">
              {EVENT_FAQS.map((f) => (
                <div key={f.question}>
                  <h3 className="font-bold" style={{ color: PINK }}>
                    {f.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 px-6 text-center">
          <p className="text-sm text-black/70">
            Learn more about the procedure itself on our{" "}
            <Link href="/services/quantum-rf" className="font-semibold text-black underline decoration-black/20 underline-offset-2 hover:decoration-black">
              Quantum RF service page
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/events/vip-device-night" className="font-semibold hover:underline" style={{ color: PINK }}>
              VIP Device Night →
            </Link>
            <Link href="/" className="font-semibold hover:underline" style={{ color: PINK }}>
              ← Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
