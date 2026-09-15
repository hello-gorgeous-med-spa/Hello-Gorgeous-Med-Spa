import Link from "next/link";

import { FormulationPartnerShell } from "@/components/regen/FormulationPartnerShell";
import { FORMULATION_PARTNER_NAME } from "@/lib/regen/formulation-partner";
import {
  FORMULATION_SEXUAL_HEALTH_SOURCE,
  ICI_LADDER,
  SEXUAL_HEALTH_GAPS,
  SEXUAL_HEALTH_ROUTES,
  SEXUAL_HEALTH_STATS,
  WOMENS_SEXUAL_CARDS,
} from "@/lib/regen/formulation-sexual-health";

export function FormulationSexualHealthPageContent() {
  return (
    <FormulationPartnerShell
      active="sexual-health"
      startHref="/start?goal=sexual-health"
      closingHeadline="Give every patient a real option — not just the default pill."
      sourceLabel="formulationrx.com/sexual-health"
      sourceHref={FORMULATION_SEXUAL_HEALTH_SOURCE}
    >
      <section className="relative overflow-hidden bg-[#0c1613] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(15,118,110,0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(233,30,140,0.18), transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#c4a36a]">
              RE GEN RX · in partnership with {FORMULATION_PARTNER_NAME}
            </p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Intimate health, individualized — for{" "}
              <em className="text-[#8fd4c4]">men and women.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              The standard pill helps some people and fails others — wrong dose, wrong side effects,
              or simply not made for them. Compounding opens custom strengths, combinations,
              injectable and topical routes, and options for women that barely exist commercially.
              Discreet. Illinois clinician first. Formulation fills what is prescribed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start?goal=sexual-health"
                className="rounded-full bg-[#c4a36a] px-5 py-3 text-sm font-bold text-[#0c1613]"
              >
                Start a visit →
              </Link>
              <a
                href="#formulary"
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"
              >
                See the routes
              </a>
            </div>
            <p className="mt-6 text-xs text-white/45">
              503A compounding · patient-specific prescriptions · custom strengths &amp; combinations
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <dl className="space-y-6">
              {SEXUAL_HEALTH_STATS.map((s) => (
                <div key={s.title}>
                  <dt className="font-serif text-2xl text-[#8fd4c4]">{s.title}</dt>
                  <dd className="mt-1 text-sm text-white/70">{s.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-3xl border border-[#d9d2c4] border-l-4 border-l-[#0f766e] bg-white px-8 py-8 shadow-[0_20px_50px_rgba(19,36,31,0.06)]">
          <p className="font-serif text-2xl leading-snug sm:text-3xl">
            Fixed-dose commercial products leave real gaps: people who don’t respond, people who
            can’t tolerate the dose, people who want a faster or needle-free route — and{" "}
            <em className="text-[#0f766e]">women</em>, for whom the commercial shelf is nearly empty.
            Formulation fills those gaps. RE GEN decides if any of it is clinically right.
          </p>
        </div>
      </section>

      <section id="formulary" className="scroll-mt-24 mx-auto max-w-6xl px-5 pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c4a36a]">
          When the standard option isn’t enough
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          A route for the person in front of you.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SEXUAL_HEALTH_GAPS.map((card) => (
            <article key={card.title} className="rounded-3xl bg-white p-6 ring-1 ring-[#e7e0d4]">
              <h3 className="font-serif text-2xl">{card.title}</h3>
              <p className="mt-3 text-[#3d524c]">{card.body}</p>
              <p className="mt-4 text-sm font-semibold text-[#13241f]">{card.forms}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f5ee] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            BiMix · TriMix · QuadMix — titrated to response.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-[#3d524c]">
            Intracavernosal combinations are not sold commercially — they are compounded.
            Formulation prepares the full ladder in sterile multi-strength vials so a clinician can
            start conservative and step up. Alprostadil alone is also available, with phenylephrine
            as a compounded reversal agent for prolonged response. Every injectable is sterile and
            potency-tested.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ICI_LADDER.map((rung) => (
              <div key={rung.name} className="rounded-3xl bg-white p-6 ring-1 ring-[#e7e0d4]">
                <h3 className="font-serif text-2xl text-[#0f766e]">{rung.name}</h3>
                <p className="mt-2 text-[#3d524c]">{rung.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          Women’s options that barely exist on a commercial shelf.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {WOMENS_SEXUAL_CARDS.map((card) => (
            <article key={card.title} className="rounded-3xl bg-white p-6 ring-1 ring-[#e7e0d4]">
              <h3 className="font-serif text-2xl">{card.title}</h3>
              <p className="mt-3 text-[#3d524c]">{card.body}</p>
              <p className="mt-4 text-sm font-semibold text-[#13241f]">{card.forms}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0c1613] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            Needle-free options, and a form the patient will actually use.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-white/70">
            PT-141 (the molecule behind an FDA-approved women’s product) and oxytocin work on desire
            centrally rather than on blood flow — available as nasal sprays, sublingual tablets, and
            troches for men and women alike.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {SEXUAL_HEALTH_ROUTES.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-[#8fd4c4]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ee] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight">
              Discreet visit. Real prescription. Shipped when it is appropriate.
            </h2>
            <p className="mt-4 text-lg text-[#3d524c]">
              Start with RE GEN. A licensed Illinois clinician reviews history and goals. If a
              compound is appropriate, the order goes to FormuConnect — oral, injectable, topical, or
              needle-free, for men and women. If it is not carried, we will say so.
            </p>
            <ul className="mt-6 space-y-3 font-semibold text-[#13241f]">
              <li>✓ Strength, combination, and route — live catalog, discreet delivery.</li>
              <li>✓ Injectable therapies are potency-tested.</li>
              <li>✓ No gray-market “research” vials. No guaranteed outcome.</li>
            </ul>
            <Link
              href="/start?goal=sexual-health"
              className="mt-8 inline-block rounded-full bg-[#E91E8C] px-6 py-3 text-sm font-bold text-white"
            >
              Start a discreet visit
            </Link>
          </div>
          <div className="rounded-3xl bg-[#0c1613] p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8fd4c4]">
              How we answer it
            </p>
            <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
              Oral therapy isn’t working. What TriMix strengths does Formulation carry?
            </p>
            <p className="mt-3 rounded-2xl bg-[#8fd4c4]/15 p-4 text-sm leading-relaxed text-white/90">
              Formulation compounds TriMix (papaverine / phentolamine / alprostadil) across a wide
              alprostadil potency range, plus BiMix and QuadMix, in 2.5, 5, and 10 mL sterile vials.
              A conservative starting strength is typical, titrated to response — that call stays with
              the licensed Illinois clinician. We confirm the live catalog before anything is sent.
            </p>
            <p className="mt-4 text-[11px] text-white/40">
              General reference only · not individualized medical advice · confirm with the pharmacist
            </p>
          </div>
        </div>
      </section>
    </FormulationPartnerShell>
  );
}
