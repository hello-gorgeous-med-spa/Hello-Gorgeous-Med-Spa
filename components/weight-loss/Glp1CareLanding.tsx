import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { glp1LowestSemaglutideUsd, glp1LowestTirzepatideUsd } from "@/lib/glp1-dose-tiers";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";
import { SITE } from "@/lib/seo";

const SEMA_FROM = glp1LowestSemaglutideUsd();
const TIRZ_FROM = glp1LowestTirzepatideUsd();
const BOOK = PRIMARY_BOOKING_CTA.href;

const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#tirzepatide", label: "Tirzepatide" },
  { href: "#semaglutide", label: "Semaglutide" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const MARQUEE =
  "Online intake · Clear starting prices · Shipped after the clinic invoice · Licensed Illinois clinician · Cash pay · Screened like a medical practice · Treated like family · ";

export function Glp1CareLanding() {
  return (
    <div className="bg-[#FFFBF9] pb-24 text-[#0A0A0A] lg:pb-0">
      <style>{`@keyframes hg-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.hg-marquee{animation:hg-marquee 40s linear infinite}`}</style>

      <div className="sticky top-[4.25rem] z-30 border-b border-[#FFE4EC] bg-[#FFFBF9]/95 backdrop-blur lg:top-[7.75rem]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <p className="font-serif text-sm tracking-tight">
            Weight loss <span className="ml-2 rounded-full bg-black px-2 py-1 align-middle font-sans text-[9px] font-bold tracking-[0.16em] text-white">MED SPA · RX</span>
          </p>
          <nav className="hidden items-center gap-6 text-[13px] font-medium lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:opacity-60">
                {item.label}
              </a>
            ))}
          </nav>
          <Link href={BOOK} className="rounded-full bg-[#E91E63] px-5 py-2.5 text-[13px] font-semibold text-white">
            {PRIMARY_BOOKING_CTA.shortLabel} →
          </Link>
        </div>
      </div>

      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-12 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <p className="inline-flex rounded-full border border-[#FFE4EC] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]">
            Clinician-guided GLP-1 care · Illinois
          </p>
          <h1 className="mt-6 font-serif text-[44px] font-semibold leading-[0.9] tracking-tight md:text-[68px]">
            Weight loss,
            <br />
            simplified with
            <br />
            <span className="font-normal italic">personalized care.</span>
          </h1>
          <p className="mt-5 max-w-[540px] text-[18px] leading-[1.6] text-black/60">
            A smarter approach to GLP-1 therapy, built around your day in Oswego. A licensed Illinois clinician decides whether semaglutide or tirzepatide is appropriate.
          </p>
          <ul className="mt-8 space-y-3 text-[14px] font-medium">
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>
                <b>If prescribed:</b> compounded semaglutide or tirzepatide
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>Ryan Kent, FNP-BC reviews every request</span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>${REGEN_SHIPPING_USD} shipping on the clinic invoice. Nothing renews by itself.</span>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={BOOK} className="rounded-full bg-black px-8 py-4 text-[14px] font-semibold text-white">
              {PRIMARY_BOOKING_CTA.label} →
            </Link>
            <a href="#pricing" className="rounded-full border border-black/15 px-8 py-4 text-[14px] font-semibold">
              See pricing
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
            <span>★ {SITE.reviewRating}/5 · Google</span>
            <span>✓ {SITE.visitReviewCount} verified visits</span>
            <span>✓ Dr. Arora, MD · medical director</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-8 h-[280px] w-[280px] rounded-full bg-pink-500/20 blur-[80px]" />
          <div className="relative grid grid-cols-2 gap-4">
            <VialCard
              src="/images/weight-loss/tirzepatide-vial.png"
              alt="REGEN tirzepatide vial labeled sterile for subcutaneous use"
              name="Tirzepatide"
              line={`Dual GIP and GLP-1 · from $${TIRZ_FROM}/mo`}
            />
            <VialCard
              src="/images/weight-loss/semaglutide-vial.png"
              alt="REGEN semaglutide vial labeled sterile for subcutaneous use"
              name="Semaglutide"
              line={`GLP-1 · from $${SEMA_FROM}/mo`}
              className="mt-8"
            />
          </div>
          <p className="relative mt-4 flex items-center justify-between rounded-full bg-black px-6 py-3 text-[12px] font-bold text-white">
            <span>GORGEOUS20 · 20% off the first medication</span>
            <span>Shipping not included</span>
          </p>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[#FFE4EC] bg-white py-3">
        <div className="hg-marquee flex w-max gap-12 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.18em] text-black/60">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>

      <section id="how-it-works" className="mx-auto max-w-[1440px] px-5 py-20 md:px-8">
        <h2 className="font-serif text-[40px] font-semibold">Three steps from consult to doorstep.</h2>
        <p className="mt-3 max-w-2xl text-[15px] text-black/60">No card on this page. A request is not a prescription.</p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Step n="01" title="Book a consult" body="Share your health history and goals. You are not charged for medication on this website." />
          <Step n="02" title="A licensed clinician reviews" body="Ryan Kent, FNP-BC reviews the request. Dr. Mukesh Arora, MD is the medical director. Medication is prescribed only if it is appropriate." />
          <Step n="03" title="Pharmacy ships after you pay" body={`If a plan is approved, you pay the clinic invoice. A U.S. pharmacy then compounds and ships. Shipping is $${REGEN_SHIPPING_USD}.`} />
        </div>
      </section>

      <section id="tirzepatide" className="border-y border-[#FFE4EC] bg-white py-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white">COMPOUNDED · NOT FDA-APPROVED</span>
              <span className="rounded-full bg-[#FFE4EC] px-3 py-1 text-[10px] font-bold tracking-[0.14em]">NOT THE SAME AS ZEPBOUND®</span>
            </div>
            <h2 className="font-serif text-[46px] font-semibold leading-[0.9]">
              Tirzepatide
              <br />
              weight loss
            </h2>
            <p className="mt-4 max-w-xl text-[18px] text-black/60">
              Compounded tirzepatide is a dual GIP and GLP-1 medication prepared for one patient. A licensed Illinois clinician prescribes it. A U.S. pharmacy ships it after the clinic invoice is paid.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Fact title="Licensed Illinois clinician" body="Ryan reviews the request. It is not an automatic approval." />
              <Fact title="U.S. pharmacy" body="Compounded for one patient after the prescription and the invoice." />
              <Fact title={`$${REGEN_SHIPPING_USD} shipping`} body="Charged on the clinic invoice. Not free." />
              <Fact title="Nothing auto-renews" body="A refill is another review and a new invoice." />
            </div>
            <div className="mt-10 space-y-8 text-[14px] leading-[1.7]">
              <CopyBlock title="What it is" body="A compounded tirzepatide plan, titrated over weeks if prescribed. The compounded preparation is not FDA-approved. It is not a generic, and it is not the same as Mounjaro or Zepbound." />
              <CopyBlock title="How it works" body="It acts on GIP and GLP-1 receptors that influence appetite, fullness, insulin, and how quickly the stomach empties. Published studies of FDA-approved tirzepatide reported average weight change with diet and activity. Those averages are not a promise, and compounded tirzepatide was not the product in those trials. Results vary." />
              <CopyBlock title="Who it may be for" body="Adults in Illinois. Typical labeling looks at a BMI of 30 or higher, or 27 or higher with a weight-related condition. It is not for pregnancy, a plan to become pregnant, or breastfeeding. It is not for a personal or family history of medullary thyroid carcinoma or MEN2, or for a history of pancreatitis. The clinician decides." />
              <CopyBlock title="What to expect" body="If prescribed, it is usually a once-weekly subcutaneous injection, started low and increased only as tolerated. Nausea, constipation, reflux, diarrhea, and fatigue are common while the dose changes and are often mild. Tell the clinician if they are not." />
            </div>
            <Link href={BOOK} className="mt-10 inline-flex rounded-full bg-[#E91E63] px-8 py-4 font-semibold text-white">
              Book tirzepatide consult · from ${TIRZ_FROM}/mo →
            </Link>
          </div>
          <div>
            <div className="sticky top-[8.5rem] rounded-[32px] border border-[#FFE4EC] bg-[#FFFBF9] p-8 text-center lg:top-[12rem]">
              <Image src="/images/weight-loss/tirzepatide-vial.png" alt="REGEN tirzepatide vial" width={640} height={800} className="mx-auto h-[420px] w-full object-contain md:h-[520px]" />
              <div className="mt-6 rounded-2xl border border-[#FFE4EC] bg-white p-4 text-left">
                <p className="text-[10px] font-bold tracking-[0.16em] text-black/50">REGEN · TIRZEPATIDE GLP-1 / GIP</p>
                <p className="mt-1 font-serif">Sterile · for subcutaneous use</p>
                <p className="text-[12px] text-black/60">Tirzepatide / glycine · compounded, not FDA-approved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="semaglutide" className="py-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <div className="sticky top-[8.5rem] rounded-[32px] border border-[#FFE4EC] bg-white p-8 text-center lg:top-[12rem]">
              <Image src="/images/weight-loss/semaglutide-vial.png" alt="REGEN semaglutide vial" width={640} height={800} className="mx-auto h-[420px] w-full object-contain md:h-[520px]" />
              <div className="mt-6 rounded-2xl border border-[#FFE4EC] bg-[#FFFBF9] p-4 text-left">
                <p className="text-[10px] font-bold tracking-[0.16em] text-black/50">REGEN · SEMAGLUTIDE GLP-1</p>
                <p className="mt-1 font-serif">Sterile · for subcutaneous use</p>
                <p className="text-[12px] text-black/60">Semaglutide / B6 · compounded, not FDA-approved</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white">COMPOUNDED · NOT FDA-APPROVED</span>
              <span className="rounded-full bg-[#FFE4EC] px-3 py-1 text-[10px] font-bold tracking-[0.14em]">NOT THE SAME AS WEGOVY®</span>
            </div>
            <h2 className="font-serif text-[46px] font-semibold leading-[0.9]">
              Semaglutide
              <br />
              weight loss
            </h2>
            <p className="mt-4 text-[18px] text-black/60">
              Compounded semaglutide is a GLP-1 medication prepared for one patient. The lowest weekly dose starts at ${SEMA_FROM} a month. The clinician chooses the dose, or may decide medication is not appropriate.
            </p>
            <div className="mt-10 space-y-8 text-[14px] leading-[1.7]">
              <CopyBlock title="What it is" body="A single GLP-1 receptor agonist, started low and increased only as tolerated. The compounded version is not FDA-approved and is not a generic of Wegovy or Ozempic." />
              <CopyBlock title="How it works" body="It mimics GLP-1, a signal the gut releases after eating. That can support insulin release, slow the stomach, and reduce appetite. Published studies of FDA-approved semaglutide reported average weight change with diet and activity. Those averages are not a Hello Gorgeous result. Compounded semaglutide was not the product in those trials." />
              <CopyBlock title="Safety" body="This class has warnings for pancreatitis, gallbladder disease, kidney injury from dehydration, allergic reactions, and a boxed warning about thyroid C-cell tumors in rodent studies. Tell the clinician every medication and supplement you take." />
            </div>
            <Link href={BOOK} className="mt-10 inline-flex rounded-full bg-black px-8 py-4 font-semibold text-white">
              Book semaglutide consult · from ${SEMA_FROM}/mo →
            </Link>

            <div id="nad" className="mt-16 flex flex-col items-center gap-6 rounded-[24px] bg-[#0A0A0A] p-8 text-white sm:flex-row">
              <Image src="/images/weight-loss/nad-vial.png" alt="REGEN NAD+ vial, 100 mg per mL, sterile for subcutaneous use" width={240} height={280} className="h-[140px] w-[120px] rounded-2xl bg-white object-contain p-2" />
              <div>
                <p className="text-[11px] tracking-[0.16em] text-white/50">REGEN RX · LONGEVITY</p>
                <p className="mt-1 font-serif text-[22px]">NAD+ 100 mg/mL</p>
                <p className="mt-2 text-[13px] text-white/60">
                  Sterile, for subcutaneous use, if a clinician adds it to the plan. Compounded NAD+ is not FDA-approved. The price is on the invoice after review. It is not a weight-loss drug.
                </p>
                <Link href={BOOK} className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-[12px] font-bold text-black">
                  Ask about NAD+ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="border-t border-[#FFE4EC] bg-white py-16">
        <div className="mx-auto max-w-[900px] px-5 md:px-8">
          <h2 className="font-serif text-[36px] font-semibold">Tirzepatide and semaglutide</h2>
          <p className="mt-3 text-[14px] text-black/60">Different mechanisms. The clinician chooses, or may choose neither. Trial averages are not a promise for a compounded prescription.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#FFE4EC]">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#FFFBF9] text-[12px] uppercase tracking-wide text-black/50">
                <tr>
                  <th className="px-4 py-3 font-semibold" />
                  <th className="px-4 py-3 font-semibold">Semaglutide</th>
                  <th className="px-4 py-3 font-semibold">Tirzepatide</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#FFE4EC]">
                  <td className="px-4 py-3 font-medium">Class</td>
                  <td className="px-4 py-3">GLP-1</td>
                  <td className="px-4 py-3">GLP-1 and GIP</td>
                </tr>
                <tr className="border-t border-[#FFE4EC]">
                  <td className="px-4 py-3 font-medium">Starting price</td>
                  <td className="px-4 py-3">${SEMA_FROM}/mo</td>
                  <td className="px-4 py-3">${TIRZ_FROM}/mo</td>
                </tr>
                <tr className="border-t border-[#FFE4EC]">
                  <td className="px-4 py-3 font-medium">Same as the brand?</td>
                  <td className="px-4 py-3">No. Not Wegovy or Ozempic.</td>
                  <td className="px-4 py-3">No. Not Mounjaro or Zepbound.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#0A0A0A] py-20 text-white">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8">
          <h2 className="font-serif text-[44px]">Starting prices. No card on this page.</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            The number is the lowest weekly dose. Higher doses cost more and are priced on the clinic invoice after a clinician approves a plan. Shipping is ${REGEN_SHIPPING_USD}. Nothing renews automatically.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <PriceCard
              src="/images/weight-loss/semaglutide-vial.png"
              alt="Semaglutide vial"
              kicker="GLP-1 · weight loss"
              name="Semaglutide"
              price={`$${SEMA_FROM}`}
              blurb="Lowest weekly dose, 0.25–0.5 mg. Starter dosing only if prescribed."
              points={["Clinician review before any invoice", `$${REGEN_SHIPPING_USD} shipping`, "Nothing renews automatically"]}
              tone="light"
            />
            <PriceCard
              src="/images/weight-loss/tirzepatide-vial.png"
              alt="Tirzepatide vial"
              kicker="GLP-1 and GIP · weight loss"
              name="Tirzepatide"
              price={`$${TIRZ_FROM}`}
              blurb="2.5 mg weekly start. Higher doses cost more."
              points={["Clinician review before any invoice", `$${REGEN_SHIPPING_USD} shipping`, "Dose set by the clinician"]}
              tone="pink"
              badge="Most popular"
            />
            <div className="rounded-[24px] border border-white/20 bg-white/10 p-8">
              <Image src="/images/weight-loss/nad-vial.png" alt="NAD+ vial" width={240} height={280} className="mx-auto h-[180px] w-auto rounded-2xl bg-white object-contain p-3" />
              <p className="mt-6 text-[10px] font-bold tracking-[0.16em] text-white/50">LONGEVITY · NAD+</p>
              <p className="mt-1 font-serif text-[24px] font-semibold">NAD+ support</p>
              <p className="mt-2 text-[20px] font-bold">Priced after review</p>
              <p className="mt-3 text-[13px] text-white/70">100 mg/mL on the vial render. Not a weight-loss medication. Not FDA-approved.</p>
              <Link href={BOOK} className="mt-8 flex justify-center rounded-full bg-white py-3 font-semibold text-black">
                Ask about NAD+
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-[11px] text-white/40">
            ${REGEN_SHIPPING_USD} shipping · cash pay · GORGEOUS20 is 20% off the first medication, not shipping · Illinois patients · a request is not a prescription
          </p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[900px] px-5 py-20 md:px-8">
        <h2 className="text-center font-serif text-[36px] font-semibold">Common questions</h2>
        <div className="mt-12 space-y-4">
          <Faq q="Where is Hello Gorgeous Med Spa?">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}. Call {SITE.phone}. The REGEN RX line is {SITE.tollFree}. Patients come from Naperville, Aurora, Plainfield, Yorkville, and Montgomery. There is no second office.
          </Faq>
          <Faq q="Is this FDA-approved or compounded?">
            Compounded semaglutide and tirzepatide on this page are not FDA-approved. They are not generics, and they are not the same as Wegovy, Ozempic, Mounjaro, or Zepbound. This page does not sell those brand-name pens.
          </Faq>
          <Faq q="Who provides oversight?">
            Dr. Mukesh Arora, MD is the medical director. Ryan Kent, FNP-BC reviews every GLP-1 request. Danielle leads the practice. She does not prescribe.
          </Faq>
          <Faq q="What is the difference between tirzepatide and semaglutide?">
            Semaglutide acts on GLP-1. Tirzepatide acts on GLP-1 and GIP. That difference does not mean one is right for every person. The clinician chooses, or may decide medication is not appropriate.
          </Faq>
          <Faq q="Do I pay on this page?">
            No. Book a consult. You are not charged for medication until a clinician approves a plan and you pay the clinic invoice.
          </Faq>
        </div>
      </section>

      <div className="border-y border-[#FFE4EC] bg-[#FFE4EC]/50 px-5 py-10 text-[11px] leading-[1.7] text-black/60 md:px-8">
        <p className="mx-auto max-w-[1440px]">
          <b>Safety.</b> Compounded semaglutide, tirzepatide, and NAD+ are prepared for one patient by a licensed U.S. pharmacy. They are not FDA-approved, not generics, and not substitutes for Wegovy, Ozempic, Mounjaro, or Zepbound. A prescription is written only if a licensed Illinois clinician decides it is appropriate. Do not use GLP-1 medicines if you or a family member has had medullary thyroid carcinoma, or if you have MEN2. This class has a boxed warning about thyroid C-cell tumors in rodent studies, and warnings for pancreatitis, gallbladder disease, kidney injury from dehydration, and allergic reactions. Get urgent care for severe abdominal pain, vomiting that will not stop, or signs of an allergic reaction. Published SURMOUNT and STEP results are about the FDA-approved products used with lifestyle changes. Compounded medication was not studied in those trials. This page is not medical advice.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-[#FFE4EC] bg-white p-4 lg:hidden">
        <div className="text-[12px]">
          <p className="font-bold">{PRIMARY_BOOKING_CTA.shortLabel}</p>
          <p className="text-black/60">
            From ${SEMA_FROM} · ${TIRZ_FROM}/mo · ${REGEN_SHIPPING_USD} shipping
          </p>
        </div>
        <Link href={BOOK} className="rounded-full bg-[#E91E63] px-6 py-3 text-[13px] font-bold text-white">
          Book →
        </Link>
      </div>
    </div>
  );
}

function VialCard({ src, alt, name, line, className }: { src: string; alt: string; name: string; line: string; className?: string }) {
  return (
    <div className={`rounded-[24px] border border-[#FFE4EC] bg-white p-4 shadow-xl md:p-6 ${className ?? ""}`}>
      <Image src={src} alt={alt} width={480} height={640} className="h-[220px] w-full object-contain md:h-[280px]" />
      <p className="mt-4 font-serif font-semibold">{name}</p>
      <p className="text-[12px] text-black/60">{line}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-[#FFE4EC] bg-white p-8">
      <p className="font-serif text-[48px] leading-none text-black/10">{n}</p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-black/70">{body}</p>
    </div>
  );
}

function Fact({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#FFE4EC] p-5">
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="mt-1 text-[12px] text-black/60">{body}</p>
    </div>
  );
}

function CopyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-black/70">{body}</p>
    </div>
  );
}

function PriceCard({
  src,
  alt,
  kicker,
  name,
  price,
  blurb,
  points,
  tone,
  badge,
}: {
  src: string;
  alt: string;
  kicker: string;
  name: string;
  price: string;
  blurb: string;
  points: string[];
  tone: "light" | "pink";
  badge?: string;
}) {
  return (
    <div className={`relative rounded-[24px] p-8 text-black ${tone === "pink" ? "border-2 border-[#E91E63] bg-[#FFE4EC]" : "bg-white"}`}>
      {badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E91E63] px-4 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
          {badge}
        </span>
      ) : null}
      <Image src={src} alt={alt} width={320} height={400} className={`mx-auto h-[180px] w-auto object-contain ${badge ? "mt-4" : ""}`} />
      <p className="mt-6 text-[10px] font-bold tracking-[0.16em] text-black/50">{kicker}</p>
      <p className="mt-1 font-serif text-[24px] font-semibold">{name}</p>
      <p className="mt-2 text-[32px] font-bold">
        {price} <span className="text-[14px] font-normal text-black/60">/mo to start</span>
      </p>
      <p className="mt-3 text-[13px] text-black/70">{blurb}</p>
      <ul className="mt-6 space-y-2 text-[13px]">
        {points.map((point) => (
          <li key={point}>✓ {point}</li>
        ))}
      </ul>
      <Link href={BOOK} className={`mt-8 flex justify-center rounded-full py-3 font-semibold text-white ${tone === "pink" ? "bg-[#E91E63]" : "bg-black"}`}>
        {PRIMARY_BOOKING_CTA.shortLabel}
      </Link>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="rounded-2xl border border-[#FFE4EC] bg-white p-6 open:bg-[#FFFBF9]">
      <summary className="cursor-pointer font-semibold">{q}</summary>
      <p className="mt-3 text-[14px] leading-relaxed text-black/70">{children}</p>
    </details>
  );
}
