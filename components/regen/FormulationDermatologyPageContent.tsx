import Link from "next/link";

import { FormulationPartnerShell } from "@/components/regen/FormulationPartnerShell";
import { FormulationShopCta } from "@/components/regen/FormulationShopCta";
import {
  DERM_CATEGORIES,
  DERM_FORMS,
  DERM_QUALITY,
  DERM_STATS,
} from "@/lib/regen/formulation-dermatology";
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from "@/lib/regen/telehealth-consult";

export function FormulationDermatologyPageContent() {
  return (
    <FormulationPartnerShell
      active="dermatology"
      startHref="/start?goal=skincare"
      closingHeadline="Dermatology compounding, written by your clinician — filled to that prescription."
    >
      <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(15,118,110,0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(233,30,140,0.18), transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#0D9488]">
              RE GEN RX · prescription skin &amp; hair
            </p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Dermatology, compounded to your{" "}
              <em className="text-[#E91E8C]">exact prescription.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Specify the active, the strength, and the base — a licensed 503A pharmacy compounds
              it. From Kligman-style brightening creams and multi-agent hair formulas to procedural
              anesthetics and rosacea care. Illinois clinician writes it. Pharmacy fills it. Shipped
              to Oswego or to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start?goal=skincare"
                className="rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
              >
                Start a visit →
              </Link>
              <Link
                href={REGEN_TELEHEALTH_PATH}
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"
              >
                Book a consult · {regenTelehealthPriceLabel()}
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/45">
              503A compounding · patient-specific prescriptions · from-prices plus shipping
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <dl className="space-y-6">
              {DERM_STATS.map((s) => (
                <div key={s.title}>
                  <dt className="font-serif text-2xl text-[#2DD4BF]">{s.title}</dt>
                  <dd className="mt-1 text-sm text-white/70">{s.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section id="formulary" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
          The formulary · real formulations, not filler
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          What we actually compound for dermatology.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
          A working snapshot of what dermatology and aesthetics clinicians order today. Every formula
          is compounded to a valid, patient-specific prescription — and every strength here can be
          adjusted. Confirm at prescribing time. Prices are starting points plus shipping.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {DERM_CATEGORIES.map((cat) => (
            <article key={cat.title} className="rounded-3xl bg-white p-6 ring-1 ring-[#0D9488]/20">
              <h3 className="font-serif text-2xl">{cat.title}</h3>
              <p className="mt-3 text-[#4B5563]">{cat.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#111111]">
                {cat.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#0D9488]">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#0D9488]">{cat.note}</p>
              {cat.shopId ? <FormulationShopCta id={cat.shopId} /> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            One active is a product. The right combination, strength, and base is a{" "}
            <em className="text-[#E91E8C]">compound.</em>
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-white/70">
            Commercial products come in fixed strengths and vehicles. We build the medication around
            the patient — combining actives into a single application, tuning concentrations, and
            selecting the base that gets the drug where it needs to go.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {DERM_FORMS.map((f) => (
              <div key={f.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-bold text-[#2DD4BF]">{f.name}</p>
                <p className="mt-1 text-sm text-white/65">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          The equipment and testing behind a clean compound.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {DERM_QUALITY.map((q) => (
            <article key={q.title} className="rounded-3xl bg-white p-6 ring-1 ring-[#0D9488]/20">
              <h3 className="font-serif text-2xl">{q.title}</h3>
              <p className="mt-3 text-[#4B5563]">{q.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F0FDFA] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight">
              Request what’s carried — after the clinician writes it.
            </h2>
            <p className="mt-4 text-lg text-[#4B5563]">
              RE GEN starts the visit. A licensed Illinois clinician chooses the active, strength,
              and plan. If it is appropriate, you pay the invoice and a licensed 503A pharmacy
              compounds it. If an active is not compoundable, we will not pretend it is.
            </p>
            <ul className="mt-6 space-y-3 font-semibold text-[#111111]">
              <li>✓ Live catalog: patient, product, strength, ship-to.</li>
              <li>✓ COAs on file for sterile lines.</li>
              <li>✓ In-office BLT for Hello Gorgeous device days, when prescribed.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start?goal=skincare"
                className="rounded-full bg-[#E91E8C] px-6 py-3 text-sm font-bold text-white"
              >
                Start a skin visit
              </Link>
              <Link
                href="/start?goal=hair"
                className="rounded-full border-2 border-[#0D9488] px-6 py-3 text-sm font-bold text-[#0D9488]"
              >
                Hair restoration
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-[#0A0A0A] p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2DD4BF]">
              How we answer it
            </p>
            <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
              What hydroquinone strengths do you carry for melasma, and what’s a good base?
            </p>
            <p className="mt-3 rounded-2xl bg-[#0D9488]/20 p-4 text-sm leading-relaxed text-white/90">
              We compound hydroquinone from 2% up to 13%, including tri-agent brightening creams with
              tretinoin, azelaic, and kojic acid. For melasma, an elegant milled cream base is
              typical. The licensed Illinois clinician picks the regimen — we confirm the live
              catalog and the base before it ships.
            </p>
            <p className="mt-4 text-[11px] text-white/40">
              General reference only · not individualized medical advice · confirm at prescribing
            </p>
          </div>
        </div>
      </section>
    </FormulationPartnerShell>
  );
}
