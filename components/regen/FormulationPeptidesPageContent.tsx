import Link from "next/link";

import { FormulationPartnerShell } from "@/components/regen/FormulationPartnerShell";
import { PeptideShowcaseGrid } from "@/components/regen/PeptideShowcaseGrid";
import {
  COPY_RULE_POINTS,
  FORMULATION_PEPTIDE_REVIEWED,
  PCAC_JULY_2026,
  PEPTIDE_LEGAL_ROWS,
} from "@/lib/regen/formulation-peptide-formulary";
import { formulationStartHref } from "@/lib/regen/formulation-client-pricing";
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from "@/lib/regen/telehealth-consult";

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
      closingHeadline="Illinois clinician first. A licensed 503A pharmacy fills what they prescribe."
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
              RE GEN RX · compounded peptides
            </p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Compounded peptides — with the{" "}
              <em className="text-[#E91E8C]">legal basis</em> for every one.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Peptide therapy is the fastest-moving corner of compounding, and the most confused.
              RE GEN only requests a peptide where a documented §503A basis exists — and we will show
              you that basis. Research-chemical shops cannot. A real Illinois practice, filling
              through a licensed 503A pharmacy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
              >
                See the peptide menu →
              </a>
              <Link
                href="/start?goal=energy"
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"
              >
                Start a visit
              </Link>
              <Link
                href={REGEN_TELEHEALTH_PATH}
                className="rounded-full border border-[#0D9488] px-5 py-3 text-sm font-bold text-[#2DD4BF]"
              >
                Book a consult · {regenTelehealthPriceLabel()}
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/45">
              Legal-basis grid updated {FORMULATION_PEPTIDE_REVIEWED} · from-prices plus shipping · a
              clinician still decides
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <dl className="space-y-6">
              <div>
                <dt className="font-serif text-2xl text-[#2DD4BF]">3 legal bases</dt>
                <dd className="mt-1 text-sm text-white/70">
                  Monograph · approved-drug component · 503A bulks list — nothing else qualifies
                </dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-[#2DD4BF]">{FORMULATION_PEPTIDE_REVIEWED}</dt>
                <dd className="mt-1 text-sm text-white/70">
                  PCAC recommended 6 of 7 reviewed peptides — we add on confirmation, not on a vote
                </dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-[#2DD4BF]">Sterile &amp; tested</dt>
                <dd className="mt-1 text-sm text-white/70">
                  What we carry is potency-tested and defensible — never research-chemical sourced
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-3xl border border-[#0D9488]/25 border-l-4 border-l-[#0D9488] bg-white px-8 py-8 shadow-[0_20px_50px_rgba(19,36,31,0.06)]">
          <p className="font-serif text-2xl leading-snug text-[#111111] sm:text-3xl">
            Products sold online as “research peptides,” clinic vials of uncertain origin, and
            shifting FDA guidance have left people unsure what a pharmacy can{" "}
            <em className="text-[#0D9488]">lawfully</em> prepare. We only request a peptide where a
            documented legal basis exists — and we will not request a substance that lacks a lawful
            pathway, no matter the demand.
          </p>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
            ◆ Licensed 503A compounding · patient-specific · sterile &amp; potency-tested
          </p>
        </div>
      </section>

      <PeptideShowcaseGrid />

      <section className="mx-auto max-w-6xl px-5 py-8 pb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
          How peptide compounding is actually regulated
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          Two gates decide whether a peptide is{" "}
          <em className="text-[#0D9488]">compoundable.</em>
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
          Most of the noise comes from one misconception: that anything “not on FDA’s safety list”
          is fair game. It isn’t. Compounding needs an affirmative basis, not the mere absence of a
          prohibition.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#0D9488]/20">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
              Gate 1 · §503A(b)(1)(A)
            </p>
            <h3 className="mt-2 font-serif text-2xl">Is the bulk substance eligible?</h3>
            <p className="mt-3 text-[#4B5563]">
              A pharmacy may compound from a bulk drug substance only if it meets one of three
              conditions:
            </p>
            <ul className="mt-4 space-y-2 text-[#111111]">
              <li className="flex gap-2">
                <span className="text-[#0D9488]">→</span>
                <span>
                  It has an applicable <strong>USP/NF monograph</strong>, or
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D9488]">→</span>
                <span>
                  It is a <strong>component of an FDA-approved drug</strong>, or
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0D9488]">→</span>
                <span>
                  It appears on <strong>FDA’s 503A bulks list</strong>.
                </span>
              </li>
            </ul>
            <p className="mt-5 rounded-2xl bg-[#CCFBF1] p-4 text-sm leading-relaxed text-[#4B5563]">
              Meets none of these? There is <strong className="text-rose-800">no lawful pathway</strong>{" "}
              — regardless of demand or how it is marketed elsewhere. Category 3 (nominated without
              adequate support) gets{" "}
              <strong className="text-[#b45309]">no enforcement discretion</strong>.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#0D9488]/20">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
              Gate 2 · the “essentially a copy” rule
            </p>
            <h3 className="mt-2 font-serif text-2xl">Is the finished preparation permissible?</h3>
            <p className="mt-3 text-[#4B5563]">
              Even when a bulk substance is eligible, a compounded preparation cannot be
              “essentially a copy” of a commercially available drug — without a documented,
              patient-specific <strong>clinical difference</strong>.
            </p>
            <ul className="mt-4 space-y-2 text-[#111111]">
              {COPY_RULE_POINTS.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[#0D9488]">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-2xl bg-[#CCFBF1] p-4 text-sm leading-relaxed text-[#4B5563]">
              Eligible from bulk and permissible as a finished product are{" "}
              <strong className="text-[#111111]">two separate questions</strong>. Both gates must be
              satisfied.
            </p>
          </article>
        </div>
      </section>

      <section id="status" className="scroll-mt-24 bg-[#F0FDFA] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
            Where the major peptides stand · 2026
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            The straight answer, peptide by peptide.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
            This is the grid RE GEN uses. Status can change as FDA acts — we confirm the current
            basis before a prescription is sent. Peptides without a lawful pathway are not
            orderable.
          </p>
          <div className="mt-8 overflow-x-auto rounded-3xl bg-white ring-1 ring-[#0D9488]/20">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#E5E7EB] text-[11px] uppercase tracking-[0.16em] text-[#0D9488]">
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
                    <tr key={row.names} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="px-5 py-5 font-semibold text-[#111111]">{row.names}</td>
                      <td className="px-5 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${s.bg} ${s.text}`}>
                          {s.mark} {row.statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-5 leading-relaxed text-[#4B5563]">{row.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
            §503A is patient-specific compounding by a pharmacy; §503B is outsourcing facilities.
            Bulk-eligibility rules differ. The statuses above address §503A. As of January 7, 2025,
            FDA stopped sorting newly nominated substances into interim categories — new substances
            now move toward PCAC review and bulks-list rulemaking.
          </p>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            The clearest path peptides have had — but{" "}
            <em className="text-[#E91E8C]">not a green light.</em>
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
                <p className={`mt-2 text-sm font-bold ${p.recommended ? "text-[#2DD4BF]" : "text-rose-300"}`}>
                  {p.recommended ? "✓ Recommended" : "✕ Not recommended"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <h3 className="font-serif text-3xl">Why a recommendation isn’t “available”</h3>
            <ol className="space-y-4 text-white/80">
              <li>
                <strong className="text-[#0D9488]">1 · PCAC only advises.</strong> It reviews the
                data and recommends. FDA then decides.
              </li>
              <li>
                <strong className="text-[#0D9488]">2 · Listing requires rulemaking.</strong> Even a
                favorable outcome still needs formal bulks-list placement.
              </li>
              <li>
                <strong className="text-[#0D9488]">3 · The copy rule still applies.</strong>{" "}
                Eligibility from bulk does not override the “essentially a copy” gate.
              </li>
              <li>
                <strong className="text-[#E91E8C]">✓ We add on confirmation, not on a vote.</strong>{" "}
                If FDA lists a peptide or issues written discretion, we will add it — with its
                documented basis, and not before.
              </li>
            </ol>
          </div>
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/70">
            Bottom line: the compounding status of those six has not changed — they are not
            orderable today. What changed is a realistic path forward, pending FDA action. The live
            catalog is the source of truth for what RE GEN can send.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          Read the science — not a sales page.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
          For peptides we actually carry, start with our education hub. Claims should be cited, not
          asserted. RE GEN will not promise outcomes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/learn/peptides"
            className="rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
          >
            RE GEN peptide education
          </Link>
          <Link
            href="/safety"
            className="rounded-full border-2 border-[#0D9488] px-5 py-3 text-sm font-bold text-[#0D9488]"
          >
            Safety &amp; compounding
          </Link>
        </div>
      </section>

      <section className="bg-[#F0FDFA] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight">
              Request what’s carried — Illinois clinician first.
            </h2>
            <p className="mt-4 text-lg text-[#4B5563]">
              Patients start a visit with RE GEN. A licensed Illinois clinician decides. If a
              peptide is appropriate <em>and</em> a licensed 503A pharmacy can lawfully compound it,
              you pay the invoice and it ships. If it is not carried, it is not available —
              regardless of the noise online.
            </p>
            <ul className="mt-6 space-y-3 font-semibold text-[#111111]">
              <li>✓ Intake in minutes — then pay only if prescribed (or we refund).</li>
              <li>✓ Ask whether a peptide is even compoundable yet. We will tell you no.</li>
              <li>✓ Catalog is the source of truth. No gray-market vials.</li>
            </ul>
            <Link
              href={formulationStartHref("sermorelin")}
              className="mt-8 inline-block rounded-full bg-[#E91E8C] px-6 py-3 text-sm font-bold text-white"
            >
              Start at tryregenrx.com/start
            </Link>
          </div>
          <div className="rounded-3xl bg-[#0A0A0A] p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2DD4BF]">
              How we answer it
            </p>
            <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">Can you compound BPC-157 for me?</p>
            <p className="mt-3 rounded-2xl bg-[#0D9488]/20 p-4 text-sm leading-relaxed text-white/90">
              Not yet. BPC-157 has no lawful §503A pathway today. FDA’s advisory committee
              recommended it for the bulks list in July 2026, but FDA has not acted, so it cannot be
              compounded. If the goal is recovery support, we can show you what is currently
              carried and its legal basis — then a licensed Illinois clinician decides if any of it
              is right for you.
            </p>
            <p className="mt-4 text-[11px] text-white/40">
              RE GEN RX · regulatory status as of {FORMULATION_PEPTIDE_REVIEWED} · confirm before
              prescribing · not legal or medical advice
            </p>
          </div>
        </div>
      </section>
    </FormulationPartnerShell>
  );
}
