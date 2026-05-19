import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Package & Pre-Paid Services Policy | Hello Gorgeous Med Spa",
  description:
    "Treatment packages, prepaid memberships, injectable units on file, expiration, discontinued services, refunds, and transfers at Hello Gorgeous Med Spa in Oswego, IL.",
  alternates: { canonical: `${SITE.url}/package-policy` },
};

export default function PackagePolicyPage() {
  const effectiveDate = "May 18, 2026";
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
          <h1 className="text-4xl font-bold">Package &amp; Pre-Paid Services Policy</h1>
          <p className="text-pink-100 mt-2">
            Effective {effectiveDate} · Owner: Dani Alcala-Glazier · Medical Director: Ryan Kent, FNP-BC
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
            href="/policies/HG_Package_Policy.docx"
            className="inline-block mt-4 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
          >
            Download Word copy
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 text-black [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 space-y-2">
        <p className="text-lg font-medium text-neutral-800">
          Our standard: every dollar a client pays Hello Gorgeous is honored as value — not necessarily as
          the original service. Treatments change. Value remains.
        </p>

        <h2>Why this policy exists</h2>
        <p>
          Hello Gorgeous offers prepaid treatment packages so clients can save on series-based services.
          Because aesthetic medicine evolves quickly — new devices, new protocols, retired technology — we
          need a clear, fair policy that protects both our clients and the practice.
        </p>
        <p>
          This policy defines how packages work at the time of purchase, how long they remain valid, and
          what happens when a treatment is discontinued, upgraded, or unused for an extended period.
        </p>

        <h2>What this policy covers</h2>
        <ul>
          <li>Treatment packages (3-pack, 6-pack, custom series) for any service on our menu.</li>
          <li>Prepaid memberships and treatment plans.</li>
          <li>Pre-purchased units of injectables (Botox, Dysport, dermal fillers) held on file.</li>
          <li>Service credits applied to a client account from prior purchases, refunds, or goodwill.</li>
        </ul>
        <p>
          This policy does <strong>not</strong> cover retail product sales or Hello Gorgeous gift
          certificates, which are governed by Illinois gift card law (gift certificates do not expire).
        </p>

        <h2>Package expiration terms</h2>
        <p>
          All treatment packages purchased on or after the effective date of this policy are valid for{" "}
          <strong>18 months</strong> from the date of purchase. Clients are encouraged to schedule their
          full series within <strong>12 months</strong> for optimal clinical results.
        </p>

        <h3>Why 18 months</h3>
        <ul>
          <li>
            Clinical results from most series-based treatments (Morpheus8, laser, peels, body contouring)
            are most effective when sessions are completed within a defined window.
          </li>
          <li>
            Devices, consumables, and pricing change over time — 18 months keeps the package tied to the
            value it was purchased at.
          </li>
          <li>This window is consistent with industry standard for medical aesthetics.</li>
        </ul>

        <h3>Expiration disclosure at purchase</h3>
        <p>Every client signs a package agreement at checkout that clearly states:</p>
        <ul>
          <li>The package name and number of sessions.</li>
          <li>The total amount paid.</li>
          <li>The expiration date (18 months from purchase).</li>
          <li>
            That the package may be transferred to a current-menu service at full dollar value if the
            original service is discontinued.
          </li>
        </ul>

        <h2>When a treatment is discontinued or upgraded</h2>
        <p>
          If Hello Gorgeous discontinues a treatment, retires a device, or replaces a service with a
          clinically superior alternative, clients with remaining sessions on the original package will be
          offered the following:
        </p>

        <h3>Option 1 — Dollar credit toward current services</h3>
        <p>
          The remaining package value (sessions remaining × original per-session price) is applied as a
          credit toward any current-menu service at today&apos;s pricing. The client pays the difference if
          the new service costs more, or retains the remaining credit if it costs less.
        </p>

        <h3>Option 2 — Refund of unused portion</h3>
        <p>
          The client may request a refund of the unused dollar amount via the original payment method
          (where supported by the processor) or by company check. Refunds are processed within{" "}
          <strong>14 business days</strong>.
        </p>

        <h3>Option 3 — Goodwill transfer (discretionary)</h3>
        <p>
          In some cases — long-standing clients, clinical fit, or service relationships we want to honor —
          the owner or medical director may approve a session-for-session transfer to the replacement
          treatment at no additional cost. This is a goodwill decision, not a client entitlement, and is
          approved case-by-case.
        </p>
        <p className="text-sm text-neutral-600 italic">
          Goodwill transfers are a gift, not a right. They are documented in the client file and authorized
          by Dani or Ryan only.
        </p>

        <h2>Expired packages</h2>
        <p>
          A package is considered expired <strong>18 months</strong> after the date of purchase. After
          expiration, the package is no longer redeemable as a series.
        </p>

        <h3>What we will do for expired packages</h3>
        <ul>
          <li>
            Honor the original dollar value as a credit toward any current-menu service for{" "}
            <strong>12 months past the expiration date</strong>. This is a courtesy, not a contractual
            obligation.
          </li>
          <li>Document the credit and expiration in the client&apos;s file.</li>
          <li>Communicate the credit value clearly to the client at the time of redemption.</li>
        </ul>

        <h3>What we will not do for expired packages</h3>
        <ul>
          <li>Honor original service pricing if that pricing no longer reflects our cost of delivery.</li>
          <li>
            Apply the credit to retail products, gratuity, or services performed by an outside provider.
          </li>
          <li>
            Extend the courtesy credit window beyond <strong>30 months</strong> from original purchase (18
            month package + 12 month courtesy).
          </li>
        </ul>
        <p>
          Past 30 months from original purchase, the package and any associated credit are considered
          closed. Exceptions require written approval from the owner.
        </p>

        <h2>Unused sessions due to no-shows or late cancellations</h2>
        <p>
          Hello Gorgeous reserves time and prepares product, consumables, and provider availability for every
          booked session. Sessions forfeited due to repeated no-shows or late cancellations (less than 24
          hours notice, three or more occurrences) may be deducted from the package per the{" "}
          <Link href="/cancellation-policy" className="text-[#FF2D8E] font-semibold underline">
            cancellation policy
          </Link>{" "}
          signed at intake.
        </p>

        <h2>Transfers, refunds, and pauses</h2>

        <h3>Transfers between clients</h3>
        <p>
          Packages are <strong>non-transferable between clients</strong>. Remaining package value belongs to
          the original purchaser only. Exceptions for immediate family members may be approved by the owner.
        </p>

        <h3>Refund requests</h3>
        <p>
          Clients may request a refund of the unused dollar portion of an active (non-expired) package at
          any time, less a <strong>10% administrative fee</strong> covering booking, consultation, and chart
          preparation already performed. The administrative fee is waived if the refund is requested due to
          a medical contraindication identified during consultation.
        </p>

        <h3>Medical pauses</h3>
        <p>
          Clients who become medically ineligible for their purchased treatment (pregnancy, new medication,
          medical condition) may pause their package for up to <strong>12 months</strong>. The expiration
          date is extended by the documented pause window. A note from the client&apos;s physician may be
          requested.
        </p>

        <h2>Quick reference</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10 my-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-pink-50 border-b border-black/10">
                <th className="p-3 font-semibold">Situation</th>
                <th className="p-3 font-semibold">Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              <tr>
                <td className="p-3">Active package (within 18 months)</td>
                <td className="p-3">Redeem sessions per original agreement</td>
              </tr>
              <tr>
                <td className="p-3">Treatment discontinued</td>
                <td className="p-3">Dollar credit, refund, or discretionary goodwill transfer</td>
              </tr>
              <tr>
                <td className="p-3">Expired (18–30 months from purchase)</td>
                <td className="p-3">Courtesy dollar credit toward current menu (12 months past expiration)</td>
              </tr>
              <tr>
                <td className="p-3">Past 30 months from purchase</td>
                <td className="p-3">Package closed; owner approval required for exceptions</td>
              </tr>
              <tr>
                <td className="p-3">Refund (active package)</td>
                <td className="p-3">Unused dollar portion minus 10% admin fee (waived for medical contraindication)</td>
              </tr>
              <tr>
                <td className="p-3">Transfer to another person</td>
                <td className="p-3">Not permitted (immediate family exceptions at owner discretion)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Authorization and documentation</h2>
        <ul>
          <li>
            All package sales, redemptions, refunds, and credit adjustments are logged in Fresha (and Square
            Appointments after launch) with date, staff member, and notes.
          </li>
          <li>Refunds over $250 require approval from the owner or medical director.</li>
          <li>
            Goodwill upgrades require written documentation in the client file and approval from the owner
            or medical director.
          </li>
          <li>
            This policy is reviewed annually and may be updated. Clients with active packages at the time
            of an update will be governed by the policy in effect at the date of their purchase.
          </li>
        </ul>

        <section className="mt-10 p-6 bg-neutral-50 rounded-xl border border-black/10">
          <h2 className="!mt-0 text-base uppercase tracking-wide text-neutral-600">In-office acknowledgment</h2>
          <p className="text-sm text-neutral-700">
            For paper intake and package checkout, the original document includes signature lines for the
            owner and medical director. You can{" "}
            <a href="/policies/HG_Package_Policy.docx" className="text-[#FF2D8E] underline font-medium">
              download the Word version
            </a>{" "}
            for printing. Package purchase constitutes agreement to this policy.
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
          <Link href="/service-policy" className="text-[#FF2D8E] font-medium underline">
            Service &amp; Refund Policy
          </Link>
          {" · "}
          <Link href="/cancellation-policy" className="text-[#FF2D8E] font-medium underline">
            Cancellation Policy
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
