import Link from "next/link";

import { GLP1_INTAKE_PATH } from "@/lib/flows";
import { GLP1_SEMAGLUTIDE_DOSE_TIERS, GLP1_TIRZEPATIDE_DOSE_TIERS } from "@/lib/glp1-dose-tiers";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

const SEMA_FROM = GLP1_SEMAGLUTIDE_DOSE_TIERS[0].priceUsd;
const TIRZ_FROM = GLP1_TIRZEPATIDE_DOSE_TIERS[0].priceUsd;

const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#tirzepatide", label: "Tirzepatide" },
  { href: "#semaglutide", label: "Semaglutide" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const FAQS = [
  {
    q: "Where are you located?",
    a: `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. Call ${SITE.phone}. The REGEN RX line is ${SITE.tollFree}.`,
  },
  {
    q: "Is this a medical practice?",
    a: "Hello Gorgeous is a medical spa and medical practice in downtown Oswego. GLP-1 care is reviewed by a licensed Illinois clinician. Dr. Mukesh Arora, MD is the medical director.",
  },
  {
    q: "Who decides if I get medication?",
    a: "Ryan Kent, FNP-BC reviews the intake. A request is not a prescription. If a plan is approved, Hello Gorgeous sends a clinic invoice. The pharmacy compounds only after that invoice is paid.",
  },
  {
    q: "Is compounded semaglutide the same as Wegovy or Ozempic?",
    a: "No. Compounded semaglutide and tirzepatide are prepared by a licensed pharmacy for one patient. They are not FDA-approved and are not the same as Wegovy, Ozempic, Mounjaro, or Zepbound.",
  },
  {
    q: "Do I pay on this page?",
    a: "No. Start the intake or book a consult. You are not charged for medication until a clinician approves a plan and you pay the clinic invoice.",
  },
  {
    q: "Can I pause?",
    a: "Nothing renews by itself. A refill is another clinical review and a new invoice. Shipping is $30 on that invoice.",
  },
];

export function Glp1CareLanding() {
  return (
    <div className="bg-[#FFFBF9] text-[#0A0A0A]">
      <header className="sticky top-0 z-40 border-b border-[#FFE4EC] bg-[#FFFBF9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="font-serif text-lg tracking-tight">
            HELLO GORGEOUS <span className="ml-2 rounded-full bg-[#0A0A0A] px-2 py-1 align-middle text-[9px] font-sans font-bold tracking-[0.18em] text-white">MED SPA · RX</span>
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] font-medium lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:opacity-60">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="hidden rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold md:inline-flex">
              Call {SITE.phone}
            </a>
            <Link href={GLP1_INTAKE_PATH} className="inline-flex rounded-full bg-[#E91E8C] px-4 py-2 text-[13px] font-semibold text-white">
              Start intake
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-black/50">DOCTOR-GUIDED GLP-1 CARE · ILLINOIS LICENSED · SCREENED LIKE A MEDICAL PRACTICE</p>
          <h1 className="mt-6 font-serif text-[40px] font-semibold leading-[0.95] tracking-tight md:text-[68px]">
            Weight loss,<br />simplified with<br /><span className="font-normal italic">personalized care.</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-black/60">
            A smarter approach to GLP-1 therapy, built around your day in Oswego. A licensed Illinois clinician decides whether semaglutide or tirzepatide is appropriate. The price is on the clinic invoice after approval.
          </p>
          <ul className="mt-8 grid max-w-[520px] gap-3 text-sm font-medium">
            {[
              "Semaglutide and tirzepatide, only if prescribed",
              "1:1 Illinois clinician review",
              "Care stays with the same practice",
              "Discreet shipping from a U.S. pharmacy",
              "$30 shipping on the clinic invoice",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0A0A0A] text-[11px] text-white">✓</span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={GLP1_INTAKE_PATH} className="rounded-full bg-[#0A0A0A] px-8 py-4 text-sm font-semibold text-white">
              Start intake
            </Link>
            <a href="#pricing" className="rounded-full border border-black/15 bg-white px-8 py-4 text-sm font-semibold">
              See pricing
            </a>
          </div>
          <p className="mt-6 text-[13px]">
            <span className="font-semibold">{SITE.reviewRating}/5</span>
            <span className="text-black/50"> · {SITE.reviewCount} Google reviews · {SITE.visitReviewCount} verified visits</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ProductCard name="Tirzepatide" price={`From $${TIRZ_FROM}/mo`} image="/images/gentlemens-club/tirzepatide-weight-loss.png" href="#tirzepatide" />
          <ProductCard name="Semaglutide" price={`From $${SEMA_FROM}/mo`} image="/images/gentlemens-club/semaglutide-weight-loss.png" href="#semaglutide" />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-4xl leading-none md:text-6xl">How it works</h2>
          <p className="max-w-sm text-sm text-black/60">No card on this page. A licensed Illinois clinician reviews the intake before any medication invoice.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["01", "Start your intake", "A short health history and your goals. This does not charge you for medication."],
            ["02", "A licensed clinician reviews", "Ryan Kent, FNP-BC reviews the request, with Dr. Arora as medical director. A request is not a prescription."],
            ["03", "Pharmacy ships after you pay", "If approved, you pay the clinic invoice. A U.S. pharmacy then compounds and ships. Shipping is $30."],
          ].map(([n, title, body]) => (
            <div key={n} className="rounded-[28px] border border-[#FFE4EC] bg-white p-8">
              <div className="font-serif text-6xl leading-none text-black/10">{n}</div>
              <h3 className="mt-3 font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tirzepatide" className="border-y border-[#FFE4EC] bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-[#0A0A0A] px-3 py-1 text-[11px] font-bold text-white">From ${TIRZ_FROM}/mo</span>
            <h2 className="mt-6 font-serif text-5xl leading-[0.9] md:text-6xl">Tirzepatide</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/70">
              Compounded tirzepatide is a dual GLP-1 and GIP medication prepared for one patient. It is not FDA-approved and is not the same as Mounjaro or Zepbound. Your clinician sets the dose. The 2.5 mg weekly start is ${TIRZ_FROM} a month. Higher doses cost more and are confirmed on the invoice.
            </p>
          </div>
          <img src="/images/gentlemens-club/tirzepatide-weight-loss.png" alt="Compounded tirzepatide at Hello Gorgeous" className="mx-auto h-80 w-full object-contain" />
        </div>
      </section>

      <section id="semaglutide" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
        <img src="/images/gentlemens-club/semaglutide-weight-loss.png" alt="Compounded semaglutide at Hello Gorgeous" className="mx-auto h-80 w-full object-contain" />
        <div>
          <span className="rounded-full border border-black/15 px-3 py-1 text-[11px] font-bold">From ${SEMA_FROM}/mo</span>
          <h2 className="mt-6 font-serif text-5xl leading-[0.9] md:text-6xl">Semaglutide</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/70">
            Compounded semaglutide is a GLP-1 medication prepared for one patient. It is not FDA-approved and is not the same as Ozempic or Wegovy. The lowest weekly dose starts at ${SEMA_FROM} a month. The clinician confirms the dose before you are invoiced.
          </p>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <h2 className="text-center font-serif text-4xl md:text-5xl">Tirzepatide vs semaglutide</h2>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-[#FFE4EC] bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-[#FFFBF9] text-left">
              <tr>
                <th className="p-5">Feature</th>
                <th className="p-5">Tirzepatide</th>
                <th className="p-5">Semaglutide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFE4EC]">
              <tr>
                <td className="p-5 text-black/60">Pathway</td>
                <td className="p-5">GLP-1 and GIP</td>
                <td className="p-5">GLP-1</td>
              </tr>
              <tr>
                <td className="p-5 text-black/60">How it is given</td>
                <td className="p-5">Once weekly, if prescribed</td>
                <td className="p-5">Once weekly, if prescribed</td>
              </tr>
              <tr>
                <td className="p-5 text-black/60">Starting monthly price</td>
                <td className="p-5">${TIRZ_FROM}</td>
                <td className="p-5">${SEMA_FROM}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-black/50">
          Brand-name study averages are not a promise for a compounded prescription. Results vary. Your clinician chooses the medication, or may decide medication is not appropriate.
        </p>
      </section>

      <section id="pricing" className="border-y border-[#FFE4EC] bg-white">
        <div className="mx-auto max-w-[1120px] px-5 py-16 text-center md:px-8 md:py-24">
          <h2 className="font-serif text-4xl md:text-6xl">Clear pricing. No surprises.</h2>
          <p className="mt-4 text-sm text-black/60">Illinois patients. Shipping is $30 on the invoice. GORGEOUS20 is 20% off the first medication, not shipping. Nothing renews automatically.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <PriceCard name="Semaglutide" price={SEMA_FROM} note="Lowest weekly dose. Higher doses are priced on the invoice." />
            <PriceCard name="Tirzepatide" price={TIRZ_FROM} note="2.5 mg weekly start. Higher doses cost more." featured />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[1040px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-center font-serif text-4xl md:text-6xl">Frequently asked</h2>
        <div className="mt-10 divide-y divide-[#FFE4EC] overflow-hidden rounded-3xl border border-[#FFE4EC] bg-white">
          {FAQS.map((item) => (
            <details key={item.q} className="p-5">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href={PRIMARY_BOOKING_CTA.href} className="rounded-full bg-[#E91E8C] px-8 py-4 text-sm font-semibold text-white">
            {PRIMARY_BOOKING_CTA.label}
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-black/50">
          Compounded semaglutide and tirzepatide are not FDA-approved. GLP-1 medicines have a boxed warning about thyroid C-cell tumors in rodents. Tell your clinician about a personal or family history of medullary thyroid carcinoma or Multiple Endocrine Neoplasia syndrome type 2. This page is not a complete list of risks.
        </p>
      </section>
    </div>
  );
}

function ProductCard({ name, price, image, href }: { name: string; price: string; image: string; href: string }) {
  return (
    <a href={href} className="rounded-[28px] border border-[#FFE4EC] bg-white p-4 shadow-sm">
      <img src={image} alt="" className="h-56 w-full object-contain" />
      <div className="mt-3 text-center">
        <div className="text-xs font-bold tracking-widest">{name.toUpperCase()}</div>
        <div className="text-sm text-black/60">{price}</div>
      </div>
    </a>
  );
}

function PriceCard({ name, price, note, featured = false }: { name: string; price: number; note: string; featured?: boolean }) {
  return (
    <div className={`rounded-[28px] border p-8 text-left ${featured ? "border-[#E91E8C] bg-[#FFFBF9]" : "border-[#FFE4EC]"}`}>
      <h3 className="font-serif text-3xl">{name}</h3>
      <p className="mt-2 text-4xl font-bold">${price}<span className="text-sm font-normal text-black/50">/mo</span></p>
      <p className="mt-4 text-sm text-black/60">{note}</p>
      <Link href={GLP1_INTAKE_PATH} className="mt-8 inline-flex rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white">
        Start intake
      </Link>
    </div>
  );
}
