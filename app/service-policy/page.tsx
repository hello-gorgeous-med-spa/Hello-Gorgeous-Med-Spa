import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Service & Refund Policy | Hello Gorgeous Med Spa",
  description:
    "Botox, filler, laser, packages, deposits, retail returns, safety, and refund guidelines for Hello Gorgeous Med Spa in Oswego, IL.",
  alternates: { canonical: `${SITE.url}/service-policy` },
};

export default function ServicePolicyPage() {
  const telDigits = SITE.phone.replace(/\D/g, "");
  const phoneDisplay =
    telDigits.length === 10
      ? `(${telDigits.slice(0, 3)}) ${telDigits.slice(3, 6)}-${telDigits.slice(6)}`
      : SITE.phone;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-pink-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Service &amp; Refund Policy</h1>
          <p className="text-pink-100 mt-2">Please review at intake · Oswego, IL</p>
          <p className="text-pink-100/90 text-sm mt-4">
            {SITE.name} · {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
            {SITE.address.addressRegion} ·{" "}
            <a href={`tel:${telDigits}`} className="underline hover:text-white">
              {phoneDisplay}
            </a>{" "}
            ·{" "}
            <a href={SITE.url} className="underline hover:text-white">
              hellogorgeousmedspa.com
            </a>
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href="/policies/HG_Service_Policy_OnePager.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
            >
              Download PDF
            </a>
            <a
              href="/policies/HG_Service_Policy_OnePager.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
            >
              Open HTML one-pager
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 text-black [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-2 space-y-2">
        <p className="text-lg text-neutral-800 border-l-4 border-[#FF2D8E] pl-4 py-2 bg-pink-50/50 rounded-r-lg">
          We believe in clear expectations, honest conversations, and excellent clinical care. Please take a
          moment to read this before your appointment so we&apos;re on the same page.{" "}
          <strong>
            If anything here doesn&apos;t make sense, ask us. We&apos;d rather answer now than have a
            misunderstanding later.
          </strong>
        </p>

        <h2>Botox &amp; neuromodulators</h2>
        <ul>
          <li>Results take 7–14 days to fully appear — please wait the full two weeks before judging your result.</li>
          <li>At day 14, if there&apos;s true asymmetry, we&apos;ll do a complimentary touch-up through day 21.</li>
          <li>No refunds on Botox or other neuromodulators once injected. Product cannot be returned.</li>
          <li>Pre-purchased units expire 6 months from purchase.</li>
        </ul>

        <h2>Dermal filler</h2>
        <ul>
          <li>Filler results are immediate but continue to settle for 2–4 weeks.</li>
          <li>Filler is priced by syringe, not by area. Additional product needed = additional cost.</li>
          <li>True clinical asymmetry is corrected complimentary at the 2-week follow-up.</li>
          <li>
            No refunds on filler once injected. Dissolving by request (not complication) is a separate paid
            service.
          </li>
        </ul>

        <h2>All other services</h2>
        <ul>
          <li>
            Facials, lasers, RF, microneedling, body contouring, IV therapy, weight loss visits — once a
            service is rendered, it&apos;s non-refundable.
          </li>
          <li>Concerns about your result are addressed clinically at a complimentary follow-up.</li>
          <li>Service credit toward future visits may be offered at our medical director&apos;s discretion.</li>
        </ul>

        <h2>Packages &amp; deposits</h2>
        <ul>
          <li>Treatment packages are valid 18 months from purchase.</li>
          <li>Deposits are fully refundable if you cancel 24+ hours before your appointment.</li>
          <li>Retail products: unopened only, 14 days, exchange or store credit (no cash refunds).</li>
          <li>
            Pre-paid services not yet rendered follow our{" "}
            <Link href="/package-policy" className="text-[#FF2D8E] font-semibold underline">
              Package Policy
            </Link>
            .
          </li>
        </ul>

        <section className="my-8 p-6 rounded-xl border-2 border-[#FF2D8E] bg-gradient-to-br from-rose-50 to-amber-50">
          <h2 className="!mt-0 text-[#8B4A4A] italic">If something feels wrong, call us immediately</h2>
          <p className="!mb-0">
            Severe pain, skin color changes (white, dusky, blue), vision changes, eyelid drooping, signs of
            infection, or any new concern after your treatment — call{" "}
            <a href={`tel:${telDigits}`} className="text-[#FF2D8E] font-bold underline">
              {phoneDisplay}
            </a>{" "}
            right away. Clinical complications are managed at no charge. Your safety is our priority. Always.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-neutral-900 text-white">
          <h2 className="!mt-0 text-[#FF2D8E] italic">The bottom line</h2>
          <p className="!mb-0 text-neutral-200">
            Aesthetic medicine is not retail. Once a treatment is performed, we can&apos;t return it — but we
            can absolutely take care of you. Every concern gets a follow-up. Every complication gets clinical
            care. Every client is treated like family. We&apos;ve been in Oswego for 10+ years because we mean
            that.
          </p>
        </section>

        <section className="mt-10 p-6 bg-neutral-50 rounded-xl border border-black/10">
          <h2 className="!mt-0 text-base uppercase tracking-wide text-neutral-600">In-office acknowledgment</h2>
          <p className="text-sm text-neutral-700">
            By signing at intake, clients confirm they have read and understand this policy. For a
            print-friendly layout with signature lines, download the{" "}
            <a
              href="/policies/HG_Service_Policy_OnePager.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF2D8E] underline font-medium"
            >
              PDF one-pager
            </a>{" "}
            or open the{" "}
            <a
              href="/policies/HG_Service_Policy_OnePager.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF2D8E] underline font-medium"
            >
              HTML version
            </a>
            .
          </p>
        </section>

        <p className="pt-8 text-sm">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF2D8E] font-medium underline"
          >
            Book an appointment
          </a>
          {" · "}
          <Link href="/cancellation-policy" className="text-[#FF2D8E] font-medium underline">
            Cancellation Policy
          </Link>
          {" · "}
          <Link href="/package-policy" className="text-[#FF2D8E] font-medium underline">
            Package Policy
          </Link>
          {" · "}
          <Link href="/terms" className="text-[#FF2D8E] font-medium underline">
            Terms of Service
          </Link>
        </p>
      </main>
    </div>
  );
}
