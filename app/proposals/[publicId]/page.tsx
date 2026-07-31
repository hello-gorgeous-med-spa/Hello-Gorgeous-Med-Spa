"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  formatProposalServiceLine,
  type ProposalOption,
} from "@/lib/proposals/utils";
import type { ProposalMediaItem } from "@/lib/proposals/types";
import { ProposalCredibilityBand } from "@/components/proposals/ProposalCredibilityBand";
import { VitaminInjectionCheatSheet } from "@/components/proposals/VitaminInjectionCheatSheet";
import { careGuidesForProposalOptions } from "@/lib/proposals/care-guides";
import { isVitaminProposalServiceId } from "@/lib/proposals/vitamin-injections";
import { SITE } from "@/lib/seo";
import { CARECREDIT_URL, CHERRY_PAY_URL } from "@/lib/flows";

const PINK = "#E6007E";
const PINK_HOT = "#FF2D8E";

type PublicProposal = {
  id: string;
  public_id: string;
  client_name: string;
  created_at: string;
  expires_at: string;
  status: string;
  concerns: string[];
  options: ProposalOption[];
  client_instructions: string | null;
  media: ProposalMediaItem[];
  payment_status?: string;
  payment_kind?: string | null;
  payment_amount_usd?: number | null;
  payment_url?: string | null;
  payment_option_name?: string | null;
  paid_at?: string | null;
  accepted_option?: string | null;
  accepted_at?: string | null;
  declined_at?: string | null;
  view_count: number;
};

function planDiffLabel(option: ProposalOption, essentialTotal: number, index: number): string | null {
  if (index === 0 || essentialTotal <= 0) return null;
  const total = calculateTotal(option);
  const delta = Math.round(total - essentialTotal);
  if (delta === 0) return "Same investment as Essential · more included";
  if (delta > 0) return `+$${delta.toLocaleString()} vs Essential · more included`;
  return `Save $${Math.abs(delta).toLocaleString()} vs list · vs Essential`;
}

export default function PublicProposalPage() {
  const params = useParams<{ publicId: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<"accept" | "decline" | null>(null);
  const [payingIndex, setPayingIndex] = useState<number | null>(null);
  const [respondNotice, setRespondNotice] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/proposals/public/${params.publicId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load proposal.");
        setProposal(data.proposal);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load proposal.");
      } finally {
        setLoading(false);
      }
    };
    if (params.publicId) load();
  }, [params.publicId]);

  const options = useMemo(() => proposal?.options || [], [proposal?.options]);
  const essentialTotal = useMemo(
    () => (options[0] ? calculateTotal(options[0]) : 0),
    [options],
  );
  const careGuides = useMemo(
    () => (proposal ? careGuidesForProposalOptions(proposal.options || []) : []),
    [proposal],
  );

  const showsVitaminCheatSheet = useMemo(() => {
    if (!proposal?.options?.length) return false;
    return proposal.options.some((option) =>
      option.services.some(
        (service) =>
          isVitaminProposalServiceId(service.id) || service.id.startsWith("vitamin-plan-"),
      ),
    );
  }, [proposal]);

  const respond = async (action: "accept" | "decline", optionName?: string) => {
    if (!proposal) return;
    setRespondNotice(null);
    setResponding(action);
    try {
      const response = await fetch(`/api/proposals/public/${proposal.public_id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, optionName }),
      });
      const text = await response.text();
      const data = text.trim() ? (JSON.parse(text) as Record<string, unknown>) : {};
      if (!response.ok) throw new Error(String(data.error || "Could not save your response."));

      setProposal((prev) =>
        prev
          ? {
              ...prev,
              status: String(data.status || (action === "accept" ? "accepted" : "declined")),
              accepted_option:
                action === "accept" ? String(data.accepted_option || optionName || "") : null,
              accepted_at: action === "accept" ? new Date().toISOString() : null,
              declined_at: action === "decline" ? new Date().toISOString() : null,
            }
          : prev,
      );
      setRespondNotice(
        String(data.message || (action === "accept" ? "Plan accepted." : "Marked declined.")),
      );
    } catch (respondError) {
      setRespondNotice(
        respondError instanceof Error ? respondError.message : "Could not save your response.",
      );
    } finally {
      setResponding(null);
    }
  };

  const payNow = async (optionIndex: number, kind: "full" | "deposit" = "full") => {
    if (!proposal) return;
    setRespondNotice(null);
    setPayingIndex(optionIndex);
    try {
      const response = await fetch(`/api/proposals/public/${proposal.public_id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex, kind }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not create Square invoice.",
        );
      }
      const url = typeof data.url === "string" ? data.url : "";
      if (!url) throw new Error("Square checkout URL missing.");

      setProposal((prev) =>
        prev
          ? {
              ...prev,
              status: "accepted",
              accepted_option: String(data.optionName || prev.options[optionIndex]?.name || ""),
              accepted_at: new Date().toISOString(),
              payment_status: "pending",
              payment_kind: kind,
              payment_amount_usd: Number(data.amountUsd) || null,
              payment_url: url,
              payment_option_name: String(data.optionName || ""),
            }
          : prev,
      );
      setRespondNotice(
        `Square checkout ready — $${Number(data.amountUsd).toFixed(2)}. Opening…`,
      );
      window.location.href = url;
    } catch (payError) {
      setRespondNotice(
        payError instanceof Error ? payError.message : "Could not create Square invoice.",
      );
    } finally {
      setPayingIndex(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF0F7] px-4 py-16 text-center text-sm text-black/60">
        Loading your treatment plan…
      </main>
    );
  }
  if (error || !proposal) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 text-center text-sm font-semibold text-red-600">
        {error || "Not found."}
      </main>
    );
  }

  const publicPdfUrl = `/api/proposals/public/${proposal.public_id}/pdf`;
  const isAccepted = proposal.status === "accepted";
  const isDeclined = proposal.status === "declined";
  const hasPayment =
    proposal.payment_status === "paid" || proposal.payment_status === "deposit_paid";
  const canRespond = !isAccepted && !isDeclined && !hasPayment;
  const canPay = !isDeclined && !hasPayment && proposal.payment_status !== "paid";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% -10%, rgba(230,0,126,0.18), transparent 55%),
            radial-gradient(ellipse 60% 40% at 90% 0%, rgba(255,45,142,0.14), transparent 50%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 42%, #f5f5f5 100%)
          `,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/hello-gorgeous-logo.png"
              alt="Hello Gorgeous Med Spa"
              width={56}
              height={60}
              className="h-14 w-auto"
              priority
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
                Hello Gorgeous Med Spa
              </p>
              <p className="text-xs text-black/55">Oswego · Fox Valley · NP-directed care</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <a
              href={publicPdfUrl}
              className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black hover:border-[#E6007E]"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full px-4 py-2 text-xs font-bold text-white"
              style={{ background: `linear-gradient(125deg, ${PINK_HOT}, ${PINK})` }}
            >
              Print
            </button>
          </div>
        </header>

        <section className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] text-white shadow-[10px_10px_0_0_rgba(230,0,126,0.45)]">
          <div
            className="relative px-6 py-10 md:px-10 md:py-12"
            style={{
              background: `
                linear-gradient(125deg, #1a0a12 0%, #2d1020 45%, #0a0a0a 100%),
                radial-gradient(ellipse 70% 80% at 85% 20%, rgba(230,0,126,0.35), transparent 55%)
              `,
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "#FFB8DC" }}>
              Personalized for you
            </p>
            <h1
              className="mt-3 max-w-3xl text-4xl font-medium leading-[1.1] md:text-5xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Your treatment plan,{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {proposal.client_name}
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
              Built {new Date(proposal.created_at).toLocaleDateString()} · Valid through{" "}
              {new Date(proposal.expires_at).toLocaleDateString()}. Review your options below — then
              secure your plan or tell us you&apos;re ready to book.
            </p>
            {proposal.concerns?.length ? (
              <p className="mt-4 text-sm text-[#FFB8DC]/proposal.concerns.join(" · ")}</p>
            ) : null}
          </div>
        </section>

        {proposal.client_instructions ? (
          <section className="mt-8 rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
              A note from Hello Gorgeous
            </p>
            <h2
              className="mt-2 text-3xl font-medium text-black md:text-4xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Welcome
            </h2>
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-black/80">
              {proposal.client_instructions}
            </div>
          </section>
        ) : null}

        {isAccepted ? (
          <div className="mt-6 rounded-2xl border-4 border-black bg-[#FFF0F7] p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <p className="text-sm font-bold" style={{ color: PINK }}>
              You selected {proposal.accepted_option || "your plan"}.
            </p>
            <p className="mt-1 text-sm text-black/70">
              Next: pay a deposit to lock it in, or we&apos;ll call to book your first visit.
            </p>
          </div>
        ) : null}
        {isDeclined ? (
          <div className="mt-6 rounded-2xl border border-black/20 bg-black/[0.03] p-5">
            <p className="text-sm font-semibold text-black/80">
              You marked this proposal as not moving forward. Call or text anytime if you want to
              revisit.
            </p>
          </div>
        ) : null}

        {proposal.media?.length ? (
          <section className="mt-10">
            <h2
              className="mb-4 text-2xl font-medium text-black md:text-3xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Before &amp; after
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {proposal.media.map((item) => (
                <figure
                  key={item.id}
                  className="overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.label || item.kind}
                    className="h-56 w-full object-cover"
                  />
                  <figcaption
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wide"
                    style={{ color: PINK }}
                  >
                    {item.label || item.kind}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
            Choose your path
          </p>
          <h2
            className="mt-1 text-3xl font-medium text-black md:text-4xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Good · Better · Best
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-black/65">
            Compare what&apos;s included. Most clients start with a deposit to hold their plan, then
            we schedule treatments around your calendar.
          </p>
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          {options.map((option, index) => {
            const subtotal = calculateSubtotal(option.services);
            const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
            const total = calculateTotal(option);
            const isChosen = isAccepted && proposal.accepted_option === option.name;
            const diff = planDiffLabel(option, essentialTotal, index);
            const popular = index === 1;
            return (
              <article
                key={option.name}
                className={`relative flex flex-col rounded-[1.5rem] border-4 bg-white p-5 ${
                  isChosen || popular
                    ? "border-[#E6007E] shadow-[8px_8px_0_0_#FF2D8E]"
                    : "border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.12)]"
                }`}
              >
                {popular ? (
                  <span
                    className="absolute -top-3 left-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                    style={{ background: PINK }}
                  >
                    Most popular
                  </span>
                ) : null}
                <h3
                  className="text-2xl font-medium text-black"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {option.name}
                </h3>
                {isChosen ? (
                  <span
                    className="mt-2 inline-block w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold"
                    style={{ borderColor: PINK, color: PINK }}
                  >
                    Your choice
                  </span>
                ) : null}
                {diff ? <p className="mt-2 text-xs font-semibold text-black/50">{diff}</p> : null}

                <ul className="mt-4 flex-1 space-y-3 text-sm text-black/80">
                  {option.services.map((service) => (
                    <li key={`${option.name}-${service.id}`}>
                      <span className="font-semibold text-black">
                        {formatProposalServiceLine(service)}
                      </span>
                      {service.description ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-black/60">
                          {service.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t-2 border-black/10 pt-4">
                  {discount > 0 ? (
                    <>
                      <div className="flex justify-between text-sm text-black/60">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold" style={{ color: PINK }}>
                        <span>Savings</span>
                        <span>-${discount.toFixed(0)}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-bold uppercase tracking-wide text-black/50">
                      Total
                    </span>
                    <span
                      className="text-3xl font-medium text-black"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      ${total.toFixed(0)}
                    </span>
                  </div>
                </div>

                {canPay ? (
                  <div className="mt-5 space-y-2 print:hidden">
                    <button
                      type="button"
                      disabled={payingIndex !== null || Boolean(responding)}
                      onClick={() => void payNow(index, "deposit")}
                      className="w-full rounded-full px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: `linear-gradient(125deg, ${PINK_HOT}, ${PINK})` }}
                    >
                      {payingIndex === index
                        ? "Opening Square…"
                        : `Reserve with 50% · $${(total * 0.5).toFixed(0)}`}
                    </button>
                    <button
                      type="button"
                      disabled={payingIndex !== null || Boolean(responding)}
                      onClick={() => void payNow(index, "full")}
                      className="w-full rounded-full border-2 border-black bg-white px-4 py-2.5 text-xs font-bold text-black disabled:opacity-50"
                    >
                      {payingIndex === index ? "Opening Square…" : `Pay in full · $${total.toFixed(0)}`}
                    </button>
                    {canRespond ? (
                      <button
                        type="button"
                        disabled={Boolean(responding) || payingIndex !== null}
                        onClick={() => void respond("accept", option.name)}
                        className="w-full rounded-full border border-black/20 px-4 py-2 text-xs font-semibold text-black/55 disabled:opacity-50"
                      >
                        {responding === "accept" ? "Saving…" : "Choose — we’ll call to book"}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        {canRespond ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              disabled={Boolean(responding)}
              onClick={() => void respond("decline")}
              className="rounded-full border border-black/25 px-4 py-2 text-xs font-bold text-black/55 disabled:opacity-50"
            >
              {responding === "decline" ? "Saving…" : "Not right now"}
            </button>
            <p className="text-xs text-black/50">
              Choosing a plan notifies our team so we can book your first visit.
            </p>
          </div>
        ) : null}
        {respondNotice ? (
          <p className="mt-3 text-sm font-semibold" style={{ color: PINK }}>
            {respondNotice}
          </p>
        ) : null}

        <ProposalCredibilityBand options={options} className="mt-12" />

        {showsVitaminCheatSheet ? (
          <section className="mt-10">
            <VitaminInjectionCheatSheet variant="client" />
          </section>
        ) : null}

        {careGuides.length ? (
          <section className="mt-10 rounded-[1.5rem] border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_#FF2D8E]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: PINK }}>
              Before &amp; after care
            </p>
            <h2
              className="mt-1 text-2xl font-medium text-black md:text-3xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Your pre &amp; post care guides
            </h2>
            <p className="mt-2 text-sm text-black/70">
              Review these before your visits — they protect your results and keep healing on track.
            </p>
            <ul className="mt-4 space-y-3">
              {careGuides.map((guide) => (
                <li key={guide.id}>
                  <a
                    href={`${SITE.url}${guide.path}`}
                    className="inline-flex flex-col rounded-xl border-2 border-black bg-white px-4 py-3 hover:border-[#E6007E]"
                  >
                    <span className="text-sm font-bold" style={{ color: PINK }}>
                      {guide.title}
                    </span>
                    <span className="text-xs text-black/70">{guide.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10 rounded-[1.5rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
          {proposal.payment_status === "paid" || proposal.payment_status === "deposit_paid" ? (
            <p className="text-sm font-semibold" style={{ color: PINK }}>
              {proposal.payment_status === "paid"
                ? "Payment received — thank you! We’ll confirm your first appointment next."
                : "Deposit received — thank you! We’ll confirm your first appointment and remaining balance next."}
            </p>
          ) : proposal.payment_url ? (
            <>
              <h2
                className="text-2xl font-medium text-black"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Finish securing your plan
              </h2>
              <p className="mt-2 text-sm text-black/70">
                {proposal.payment_option_name ? `${proposal.payment_option_name} · ` : ""}
                {proposal.payment_amount_usd != null
                  ? `$${Number(proposal.payment_amount_usd).toFixed(2)} ready in Square.`
                  : "Your secure Square checkout is ready."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={proposal.payment_url}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(125deg, ${PINK_HOT}, ${PINK})` }}
                >
                  {proposal.payment_kind === "deposit"
                    ? "Pay deposit securely"
                    : "Continue to Square"}
                </a>
                <a
                  href="/book"
                  className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black"
                >
                  Book now
                </a>
              </div>
            </>
          ) : (
            <>
              <h2
                className="text-2xl font-medium text-black"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Ready when you are
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Reserve with a deposit on a plan above, or book a visit and we&apos;ll walk through
                everything together.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/book"
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(125deg, ${PINK_HOT}, ${PINK})` }}
                >
                  Book now
                </a>
                <a
                  href="tel:16306366193"
                  className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black"
                >
                  Call 630-636-6193
                </a>
              </div>
            </>
          )}

          <div className="mt-6 rounded-xl border-2 border-black/10 bg-[#FFF0F7] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: PINK }}>
              Flexible financing
            </p>
            <p className="mt-1 text-sm text-black/75">
              Prefer monthly payments? Apply for Cherry or CareCredit — many clients use financing
              for packages and series plans.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-4 py-2.5 text-sm font-bold text-white"
              >
                Apply with Cherry
              </a>
              <a
                href={CARECREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black"
              >
                Apply with CareCredit
              </a>
              <a
                href="/financing"
                className="rounded-full border border-black/25 px-4 py-2 text-xs font-bold text-black/70"
              >
                Financing details
              </a>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-black/45">
          Educational proposal only. Final treatment plan and medical eligibility are confirmed
          during your in-person consultation.
        </p>
        <p className="mt-2 text-center text-xs text-black/35 print:hidden">
          Staff:{" "}
          <Link href="/admin/proposals" className="hover:underline" style={{ color: PINK }}>
            Admin proposals
          </Link>
        </p>
      </div>
    </main>
  );
}
