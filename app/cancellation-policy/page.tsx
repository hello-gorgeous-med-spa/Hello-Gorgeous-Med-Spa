import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Appointment & Cancellation Policy | Hello Gorgeous Med Spa",
  description:
    "Card on file, 24-hour cancellation, no-show and late arrival fees, refunds, and quick reference for Hello Gorgeous Med Spa in Oswego, IL.",
  alternates: { canonical: `${SITE.url}/cancellation-policy` },
};

export default function CancellationPolicyPage() {
  const lastUpdated = "April 9, 2026";
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
          <h1 className="text-4xl font-bold">Appointment &amp; Cancellation Policy</h1>
          <p className="text-pink-100 mt-2">
            Effective immediately · All clients · Last updated {lastUpdated}
          </p>
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
          <a
            href="/policies/HelloGorgeous-CancellationPolicy.docx"
            className="inline-block mt-4 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
          >
            Download Word copy
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 text-black [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 space-y-2">
        <p>
          At Hello Gorgeous, every appointment is a commitment — yours to us, and ours to you. When you
          book, we reserve that time exclusively for you, turn away other clients, and prepare everything
          specifically for your treatment. Our team arrives ready.
        </p>
        <p>
          This policy exists to protect your time, our team&apos;s time, and the clients on our waitlist who
          deserve that spot if you can&apos;t make it. We appreciate your understanding and respect.
        </p>

        <h2>1. Card on File Requirement</h2>
        <p>
          A valid credit or debit card is required to hold every appointment at Hello Gorgeous. Your card
          will not be charged at the time of booking. It is kept securely on file solely to enforce this
          cancellation policy if needed.
        </p>
        <p>
          By booking an appointment, you authorize Hello Gorgeous Med Spa to charge your card on file in
          accordance with the terms below.
        </p>

        <h2>2. Cancellation &amp; Rescheduling</h2>
        <p>
          <strong>Cancellations made more than 24 hours</strong> before your scheduled appointment: No charge.
          No questions asked.
        </p>
        <p>
          <strong>Cancellations made less than 24 hours</strong> before your appointment: A{" "}
          <strong>$50 cancellation fee</strong> will be charged to your card on file.
        </p>
        <p>
          To cancel or reschedule, contact us at{" "}
          <a href="tel:6306366193" className="text-[#FF2D8E] font-semibold underline">
            (630) 636-6193
          </a>{" "}
          or reply to your appointment confirmation text.
        </p>

        <h2>3. No-Shows</h2>
        <p>
          Clients who do not show up to their appointment without any notice will be charged a{" "}
          <strong>$50 no-show fee</strong> to the card on file. This fee is non-negotiable and non-refundable.
        </p>
        <p>
          Clients with two or more no-shows may be required to prepay in full before future appointments can
          be confirmed.
        </p>

        <h2>4. Late Arrivals</h2>
        <p>
          We understand that life happens. If you are running late, please call or text us as soon as
          possible so we can do our best to accommodate you.
        </p>
        <p>
          Clients arriving <strong>more than 15 minutes late</strong> may need to be rescheduled if the
          remaining time is insufficient to safely complete your service. In this case, a{" "}
          <strong>$50 late cancellation fee</strong> applies.
        </p>

        <h2>5. Medical &amp; Emergency Exceptions</h2>
        <p>
          We are people first. Documented medical emergencies or serious unforeseen circumstances will be
          reviewed on a case-by-case basis. Please reach out to us directly and we will always do our best to
          work with you. We believe in treating every client the way we would want to be treated.
        </p>

        <h2>6. Refund Policy</h2>
        <p>
          <strong>Services rendered are non-refundable.</strong> If you have a concern about your results,
          please contact us within <strong>72 hours</strong> of your appointment so we can make it right.
        </p>
        <p>Retail products may be exchanged within 14 days if unopened.</p>
        <p>Gift cards and packages are non-refundable but are transferable to another person.</p>

        <h2>Quick reference</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10 my-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-pink-50 border-b border-black/10">
                <th className="p-3 font-semibold">Situation</th>
                <th className="p-3 font-semibold">Fee</th>
                <th className="p-3 font-semibold">How charged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              <tr>
                <td className="p-3">Cancel 24+ hours before</td>
                <td className="p-3">No charge</td>
                <td className="p-3">—</td>
              </tr>
              <tr>
                <td className="p-3">Cancel within 24 hours</td>
                <td className="p-3">$50 fee</td>
                <td className="p-3">Card on file</td>
              </tr>
              <tr>
                <td className="p-3">No-show</td>
                <td className="p-3">$50 fee</td>
                <td className="p-3">Card on file</td>
              </tr>
              <tr>
                <td className="p-3">Late arrival (15+ min)</td>
                <td className="p-3">$50 fee</td>
                <td className="p-3">Card on file</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium">Thank you for choosing Hello Gorgeous.</p>
        <p>
          We are a small, family-owned med spa and every appointment matters deeply to us. Questions? Call or
          text us anytime at{" "}
          <a href="tel:6306366193" className="text-[#FF2D8E] font-semibold underline">
            (630) 636-6193
          </a>
          .
        </p>

        <section className="mt-10 p-6 bg-neutral-50 rounded-xl border border-black/10">
          <h2 className="!mt-0 text-base uppercase tracking-wide text-neutral-600">In-office acknowledgment</h2>
          <p className="text-sm text-neutral-700">
            For paper intake, the original document includes signature lines. You can{" "}
            <a href="/policies/HelloGorgeous-CancellationPolicy.docx" className="text-[#FF2D8E] underline font-medium">
              download the Word version
            </a>{" "}
            for printing. Online booking constitutes agreement to this policy.
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
          <Link href="/terms" className="text-[#FF2D8E] font-medium underline">
            Terms of Service
          </Link>
        </p>
      </main>
    </div>
  );
}
