import Link from "next/link";

import { FormulationPartnerShell } from "@/components/regen/FormulationPartnerShell";
import { FORMULATION_PARTNER_NAME } from "@/lib/regen/formulation-partner";
import {
  COPY_RULE_POINTS,
  FORMULATION_PEPTIDE_REVIEWED,
  FORMULATION_PEPTIDES_SOURCE,
  FORMULARY_MAINSTAYS,
  PCAC_JULY_2026,
  PEPTIDE_LEGAL_ROWS,
} from "@/lib/regen/formulation-peptide-formulary";

const STATUS_STYLE = {
  lawful: { bg: "bg-emerald-50", text: "text-emerald-800", mark: "✓" },
  review: { bg: "bg-amber-50", text: "text-amber-800", mark: "◷" },
  none: { bg: "bg-rose-50", text: "text-rose-800", mark: "✕" },
} as const;

export function FormulationPeptidesPageContent() {
  return (
    <FormulationPartnerShell
      active="peptides"
      startHref="/start?goal=energy"
      closingHeadline="Partnered with a compliance-first peptide pharmacy."
      sourceLabel="formulationrx.com/peptides"
      sourceHref="https://formulationrx.com/peptides/"
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
              Compounded peptides — with the{" "}
              <em className="text-[#8fd4c4]">legal basis</em> for every one.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Peptide therapy is the fastest-moving corner of compounding, and the most confused.
              RE GEN only sends Formulation a peptide where a documented §503A basis exists — and
              we will show you that basis. Research-chemical shops cannot. A real Illinois practice,
              filling through a LegitScript-certified 503A pharmacy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start?goal=energy"
                className="rounded-full bg-[#c4a36a] px-5 py-3 text-sm font-bold text-[#0c1613]"
              >
                Start a visit →
              </Link>
              <a
                href="#status"
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"
              >
                Where every peptide stands
              </a>
            </div>
            <p className="mt-6 text-xs text-white/45">
              Reviewed with Formulation’s public peptide grid · Updated {FORMULATION_PEPTIDE_REVIEWED}
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <dl className="space-y-6">
              <div>
                <dt className="font-serif text-2xl text-[#8fd4c4]">3 legal bases</dt>
                <dd className="mt-1 text-sm text-white/70">
                  Monograph · approved-drug component · 503A bulks list — nothing else qualifies
                </dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-[#8fd4c4]">{FORMULATION_PEPTIDE_REVIEWED}</dt>
                <dd className="mt-1 text-sm text-white/70">
                  PCAC recommended 6 of 7 reviewed peptides — Formulation adds on confirmation, not
                  on a vote
                </dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-[#8fd4c4]">Sterile &amp; tested</dt>
                <dd className="mt-1 text-sm text-white/70">
                  What they carry is potency-tested and defensible — never research-chemical sourced
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-3xl border border-[#d9d2c4] border-l-4 border-l-[#0f766e] bg-white px-8 py-8 shadow-[0_20px_50px_rgba(19,36,31,0.06)]">
          <p className="font-serif text-2xl leading-snug text-[#13241f] sm:text-3xl">
            Products sold online as “research peptides,” clinic vials of uncertain origin, and
            shifting FDA guidance have left people unsure what a pharmacy can{" "}
            <em className="text-[#0f766e]">lawfully</em> prepare. Formulation compounds only where
            a documented legal basis exists — and they will not compound a substance that lacks a
            lawful pathway, no matter the demand. RE GEN follows that same line.
          </p>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4a36a]">
            ◆ LegitScript-certified · §503A patient-specific compounding · sterile &amp; potency-tested
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c4a36a]">
          How peptide compounding is actually regulated
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          Two gates decide whether a peptide is{" "}
          <em className="text-[#0f766e]">compoundable.</em>
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#3d524c]">
          Most of the noise comes from one misconception: that anything “not on FDA’s safety list”
          is fair game. It isn’t. Compounding needs an affirmative basis, not the mere absence of a
          prohibition.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#e7e0d4]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4a36a]">
              Gate 1 · §503A(b)(1)(A)
            </p>
            <h3 className="mt-2 font-serif text-2xl">Is the bulk substance eligible?</h3>
            <p className="mt-3 text-[#3d524c]">
              A pharmacy may compound from a bulk drug substance only if it meets one of three
              conditions:
            </p>
            <ul className="mt-4 space-y-2 text-[#13241f]">
              <li className="flex gap-2">
                <span className="text-[#0f766e]">→</span>
                <span>
                  It has an applicable <strong>USP/NF monograph</strong>, or
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0f766e]">→</span>
                <span>
                  It is a <strong>component of an FDA-approved drug</strong>, or
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0f766e]">→</span>
                <span>
                  It appears on <strong>FDA’s 503A bulks list</strong>.
                </span>
              </li>
            </ul>
            <p className="mt-5 rounded-2xl bg-[#f7efe4] p-4 text-sm leading-relaxed text-[#3d524c]">
              Meets none of these? There is <strong className="text-rose-800">no lawful pathway</strong>{" "}
              — regardless of demand or how it is marketed elsewhere. Category 3 (nominated without
              adequate support) gets{" "}
              <strong className="text-[#b45309]">no enforcement discretion</strong>.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#e7e0d4]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4a36a]">
              Gate 2 · the “essentially a copy” rule
            </p>
            <h3 className="mt-2 font-serif text-2xl">Is the finished preparation permissible?</h3>
            <p className="mt-3 text-[#3d524c]">
              Even when a bulk substance is eligible, a compounded preparation cannot be
              “essentially a copy” of a commercially available drug — without a documented,
              patient-specific <strong>clinical difference</strong>.
            </p>
            <ul className="mt-4 space-y-2 text-[#13241f]">
              {COPY_RULE_POINTS.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[#0f766e]">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-2xl bg-[#f7efe4] p-4 text-sm leading-relaxed text-[#3d524c]">
              Eligible from bulk and permissible as a finished product are{" "}
              <strong className="text-[#13241f]">two separate questions</strong>. Both gates must be
              satisfied.
            </p>
          </article>
        </div>
      </section>

      <section id="status" className="scroll-mt-24 bg-[#f8f5ee] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c4a36a]">
            Where the major peptides stand · 2026
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            The straight answer, peptide by peptide.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-[#3d524c]">
            This is the grid RE GEN uses with Formulation. Status can change as FDA acts — we
            confirm the current basis before a prescription is sent.
          </p>
          <div className="mt-8 overflow-x-auto rounded-3xl bg-white ring-1 ring-[#e7e0d4]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#eee6d8] text-[11px] uppercase tracking-[0.16em] text-[#8a7d68]">
                <tr>
                  <th className="px-5 py-4 font-bold">Peptides</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold">Basis / notes</th>
                </tr>
              </thead>
              <tbody>
                {PEPTIDE_LEGAL_ROWS.map((row) => {
                  const s = STATUS_STYLE[row.status];
                  return (
                    <tr key={row.names} className="border-b border-[#f1ebe0] last:border-0">
                      <td className="px-5 py-5 font-semibold text-[#13241f]">{row.names}</td>
                      <td className="px-5 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${s.bg} ${s.text}`}>
                          {s.mark} {row.statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-5 leading-relaxed text-[#3d524c]">{row.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6b7a75]">
            §503A is patient-specific compounding by a pharmacy; §503B is outsourcing facilities.
            Bulk-eligibility rules differ. The statuses above address §503A. As of January 7, 2025,
            FDA stopped sorting newly nominated substances into interim categories — new substances
            now move toward PCAC review and bulks-list rulemaking.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          A formulary you can defend — with the basis beside every item.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#3d524c]">
          Here are Formulation’s peptide mainstays. If it is not on their live catalog, RE GEN will
          not pretend it is available — no matter what Instagram says.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FORMULARY_MAINSTAYS.map((card) => (
            <article key={card.name} className="rounded-3xl bg-white p-6 ring-1 ring-[#e7e0d4]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-serif text-2xl">{card.name}</h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                  {card.badge}
                </span>
              </div>
              <p className="mt-3 text-[#3d524c]">{card.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-[#13241f]">{card.forms}</p>
              <Link href={card.startHref} className="mt-4 inline-block text-sm font-bold text-[#E91E8C]">
                Request a visit →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0c1613] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            The clearest path peptides have had — but{" "}
            <em className="text-[#8fd4c4]">not a green light.</em>
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-white/70">
            On July 23–24, 2026, FDA’s Pharmacy Compounding Advisory Committee reviewed seven
            peptides for the 503A bulks list and voted to recommend six. That is a step — not
            approval.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PCAC_JULY_2026.map((p) => (
              <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/45">
                  {p.name} · {p.date}
                </p>
                <p className={`mt-2 text-sm font-bold ${p.recommended ? "text-[#8fd4c4]" : "text-rose-300"}`}>
                  {p.recommended ? "✓ Recommended" : "✕ Not recommended"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <h3 className="font-serif text-3xl">Why a recommendation isn’t “available”</h3>
            <ol className="space-y-4 text-white/80">
              <li>
                <strong className="text-[#c4a36a]">1 · PCAC only advises.</strong> It reviews the
                data and recommends. FDA then decides.
              </li>
              <li>
                <strong className="text-[#c4a36a]">2 · Listing requires rulemaking.</strong> Even a
                favorable outcome still needs formal bulks-list placement.
              </li>
              <li>
                <strong className="text-[#c4a36a]">3 · The copy rule still applies.</strong>{" "}
                Eligibility from bulk does not override the “essentially a copy” gate.
              </li>
              <li>
                <strong className="text-[#8fd4c4]">✓ We add on confirmation, not on a vote.</strong>{" "}
                If FDA lists a peptide or issues written discretion, Formulation will add it — with
                its documented basis, and not before.
              </li>
            </ol>
          </div>
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/70">
            Bottom line: the compounding status of those six has not changed — they are not
            orderable from Formulation today. What changed is a realistic path forward, pending FDA
            action. The live catalog is the source of truth for what RE GEN can send.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          Read the science — not a sales page.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#3d524c]">
          For peptides we actually carry, start with our education hub. Claims should be cited, not
          asserted. Formulation’s learning center links primary sources; RE GEN will not promise
          outcomes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/learn/peptides"
            className="rounded-full bg-[#13241f] px-5 py-3 text-sm font-bold text-white"
          >
            RE GEN peptide education
          </Link>
          <a
            href={FORMULATION_PEPTIDES_SOURCE}
            className="rounded-full border border-[#13241f] px-5 py-3 text-sm font-bold"
            target="_blank"
            rel="noreferrer"
          >
            Formulation’s peptide page ↗
          </a>
        </div>
      </section>

      <section className="bg-[#f8f5ee] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight">
              Order what’s carried — Illinois clinician first, pharmacy second.
            </h2>
            <p className="mt-4 text-lg text-[#3d524c]">
              Patients start a visit with RE GEN. A licensed Illinois clinician decides. If a
              peptide is appropriate <em>and</em> Formulation can lawfully compound it, the order
              goes to FormuConnect. If it is not carried, it is not available — regardless of the
              noise online.
            </p>
            <ul className="mt-6 space-y-3 font-semibold text-[#13241f]">
              <li>✓ Start in minutes — free to submit, $49 consult if you move forward.</li>
              <li>✓ Ask whether a peptide is even compoundable yet. We will tell you no.</li>
              <li>✓ Catalog is the source of truth. No gray-market vials.</li>
            </ul>
            <Link
              href="/start?goal=energy"
              className="mt-8 inline-block rounded-full bg-[#E91E8C] px-6 py-3 text-sm font-bold text-white"
            >
              Start at tryregenrx.com/start
            </Link>
          </div>
          <div className="rounded-3xl bg-[#0c1613] p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8fd4c4]">
              How we answer it
            </p>
            <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">Can you compound BPC-157 for me?</p>
            <p className="mt-3 rounded-2xl bg-[#8fd4c4]/15 p-4 text-sm leading-relaxed text-white/90">
              Not yet. BPC-157 has no lawful §503A pathway today. FDA’s advisory committee
              recommended it for the bulks list in July 2026, but FDA has not acted, so Formulation
              cannot compound it. If the goal is recovery support, we can show you what is currently
              carried and its legal basis — then a licensed Illinois clinician decides if any of it
              is right for you.
            </p>
            <p className="mt-4 text-[11px] text-white/40">
              RE GEN RX · Formulation Compounding Center · regulatory status as of{" "}
              {FORMULATION_PEPTIDE_REVIEWED} · confirm before prescribing · not legal or medical
              advice
            </p>
          </div>
        </div>
      </section>
    </FormulationPartnerShell>
  );
}
