import type { Metadata } from "next";
import Link from "next/link";

import {
  CANCELLATION_POLICY,
  CANCELLATION_POLICY_DOCX_PATH,
  CANCELLATION_POLICY_HTML_PATH,
  CANCELLATION_POLICY_PATH,
  CANCELLATION_POLICY_UPDATED,
} from "@/lib/cancellation-policy";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const P = CANCELLATION_POLICY;

export const metadata: Metadata = {
  title: "Cancellation, No-Show & Late Policy | Hello Gorgeous Med Spa",
  description:
    "24–48 hour cancellation notice, late-cancel and no-show fees, card on file, deposits, and Hello Gorgeous RX prescription refund rules — Oswego, IL.",
  alternates: { canonical: `${SITE.url}${CANCELLATION_POLICY_PATH}` },
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-[#e9e9ee]">
      <header className="bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <Link href="/" className="text-sm text-white/60 transition hover:text-[#FF2D8E]">
            ← Back to Home
          </Link>
          <p className="mt-6 font-serif text-2xl font-extrabold tracking-wide">Hello Gorgeous Med Spa</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">
            Medical Aesthetics · Oswego, IL
          </p>
          <h1 className="mt-6 font-serif text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            Cancellation, No-Show
            <br />
            &amp; Late Policy
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            We screen you like a medical practice, because we are one. Your appointment reserves dedicated
            provider time — this policy keeps our schedule fair for every client.
          </p>
          <p className="mt-4 text-sm text-white/55">
            Effective immediately · All clients · Last updated {CANCELLATION_POLICY_UPDATED}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={CANCELLATION_POLICY_HTML_PATH}
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              View printable HTML
            </a>
            <a
              href={CANCELLATION_POLICY_DOCX_PATH}
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              Download Word copy
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-10 [&_h2]:mt-10 [&_h2]:border-t-2 [&_h2]:border-[#FF2D8E] [&_h2]:pt-5 [&_h2]:text-[19px] [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-black [&_li]:mb-1.5 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-black/85 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          <p>
            Because we are a nurse-practitioner-directed medical practice, every appointment reserves
            licensed-provider time, a treatment room, and often pre-ordered product specifically for you.
            When an appointment is missed or cancelled last-minute, that time can&apos;t be offered to another
            client. The following policy applies to all services booked at Hello Gorgeous Med Spa and through
            our Hello Gorgeous RX / RE GEN telehealth line.
          </p>

          <h2>
            <span className="mr-2 text-[#E6007E]">1.</span>
            Notice required to cancel or reschedule
          </h2>
          <p>
            We kindly ask for advance notice to cancel or reschedule any appointment. This gives us the
            opportunity to offer your spot to another client.
          </p>
          <ul>
            <li>
              <strong>Standard treatments</strong> (injectables, facials, laser, body):{" "}
              <strong>{P.noticeHoursStandard} hours</strong> notice.
            </li>
            <li>
              <strong>Extended or advanced services</strong> ({P.advancedServiceExamples}):{" "}
              <strong>{P.noticeHoursAdvanced} hours</strong> notice, as these reserve significant provider
              time.
            </li>
            <li>
              Cancel or reschedule by phone at{" "}
              <a href={P.phoneHref} className="font-semibold text-[#E6007E] underline">
                {P.phoneDisplay}
              </a>
              , or through your Square booking confirmation.
            </li>
          </ul>

          <h2>
            <span className="mr-2 text-[#E6007E]">2.</span>
            Late-cancellation &amp; no-show fees
          </h2>
          <p>
            Cancellations made with less than the required notice, and missed appointments, are subject to
            the following fees:
          </p>
          <div className="my-4 overflow-x-auto rounded-xl border border-black/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 font-bold">Situation</th>
                  <th className="px-4 py-3 font-bold">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 text-black/85">
                <tr>
                  <td className="px-4 py-3">Cancel/reschedule with less than the required notice</td>
                  <td className="px-4 py-3 font-semibold">
                    ${P.lateCancelFeeUsd} or {P.lateCancelFeePercent}% of the service price, whichever is
                    greater
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">No-show (missed appointment, no contact)</td>
                  <td className="px-4 py-3 font-semibold">
                    ${P.noShowFeeUsd} or {P.noShowFeePercent}% of the service price, whichever is greater
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    Arriving more than {P.lateGraceMinutes} minutes late (may require rescheduling)
                  </td>
                  <td className="px-4 py-3">May be treated as a late cancellation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Fees may be charged to the card on file. We&apos;re human — genuine emergencies happen, and fees may
            be waived at our discretion on a first occurrence.
          </p>

          <h2>
            <span className="mr-2 text-[#E6007E]">3.</span>
            Deposits &amp; booking holds
          </h2>
          <p>
            Certain appointments require a deposit to book. This deposit is applied to the cost of your
            service on the day of your visit.
          </p>
          <ul>
            <li>
              A <strong>${P.depositUsd} deposit</strong> (or card on file) may be required for new clients,
              advanced treatments, and longer bookings.
            </li>
            <li>
              Deposits are <strong>fully refundable / transferable</strong> when you cancel with the required
              notice.
            </li>
            <li>
              Deposits are <strong>forfeited</strong> for late cancellations and no-shows and applied toward
              the fees above.
            </li>
          </ul>

          <h2>
            <span className="mr-2 text-[#E6007E]">4.</span>
            Card on file
          </h2>
          <p>
            To reserve your appointment, we require a valid credit or debit card on file. Storing your card
            does not charge you at booking — it is only used for the fees described in this policy, or with
            your authorization at checkout. Your payment information is stored securely and handled in
            accordance with our{" "}
            <Link href="/privacy" className="font-semibold text-[#E6007E] underline">
              privacy practices
            </Link>
            .
          </p>

          <h2>
            <span className="mr-2 text-[#E6007E]">5.</span>
            Memberships &amp; prepaid packages
          </h2>
          <ul>
            <li>
              A no-show or late cancellation against a <strong>membership or prepaid package</strong> may
              forfeit that session/credit.
            </li>
            <li>
              Monthly membership terms, pauses, and cancellations are governed by your membership agreement.
              See also our{" "}
              <Link href="/package-policy" className="font-semibold text-[#E6007E] underline">
                Package Policy
              </Link>
              .
            </li>
          </ul>

          <h2>
            <span className="mr-2 text-[#E6007E]">6.</span>
            Hello Gorgeous RX / RE GEN (telehealth &amp; prescriptions)
          </h2>
          <div className="mb-4 rounded-xl border border-[#FFD8EC] bg-[#FFF5F9] p-5 text-sm leading-relaxed text-black/85">
            <p className="mb-3">
              <strong>Telehealth consultations</strong> follow the same notice and no-show terms as in-clinic
              visits.
            </p>
            <p className="mb-0">
              <strong>
                Prescription &amp; compounded medication orders are non-refundable once filled or shipped.
              </strong>{" "}
              Because these are made or dispensed specifically for you, they cannot be returned or resold. If
              your provider does not approve an item during review, that item is fully refunded. Shipping fees
              are non-refundable once an order has shipped.
            </p>
          </div>

          <h2>
            <span className="mr-2 text-[#E6007E]">7.</span>
            Our commitment to you
          </h2>
          <p>
            If <em>we</em> ever need to cancel or reschedule your appointment, we&apos;ll give you as much notice
            as possible and will not charge you. Any deposit you&apos;ve paid will be honored toward your
            rescheduled visit or refunded in full.
          </p>

          <div className="mt-8 rounded-xl bg-black p-5 text-white md:p-6">
            <p className="mb-0 text-[15px] leading-relaxed text-white/85">
              <strong className="text-white">Questions?</strong> We&apos;re happy to help. Call or text{" "}
              <a href={P.phoneHref} className="font-semibold text-[#FF2D8E] underline">
                {P.phoneDisplay}
              </a>
              , or ask our front desk at your next visit. By booking an appointment with Hello Gorgeous Med
              Spa, you acknowledge and agree to this policy.
            </p>
          </div>

          <p className="mt-8 text-sm text-black/55">
            Related:{" "}
            <Link href="/service-policy" className="text-[#E6007E] underline">
              Service &amp; Refund Policy
            </Link>
            {" · "}
            <Link href="/package-policy" className="text-[#E6007E] underline">
              Package Policy
            </Link>
            {" · "}
            <Link href="/terms" className="text-[#E6007E] underline">
              Terms of Service
            </Link>
            {" · "}
            <a href={BOOKING_URL} className="text-[#E6007E] underline" target="_blank" rel="noopener noreferrer">
              Book online
            </a>
          </p>
        </article>
      </main>
    </div>
  );
}
