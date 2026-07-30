"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

export default function PublicProposalPage() {
  const params = useParams<{ publicId: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState<"accept" | "decline" | null>(null);
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
  const careGuides = useMemo(
    () => (proposal ? careGuidesForProposalOptions(proposal.options || []) : []),
    [proposal]
  );

  const showsVitaminCheatSheet = useMemo(() => {
    if (!proposal?.options?.length) return false;
    return proposal.options.some((option) =>
      option.services.some(
        (service) =>
          isVitaminProposalServiceId(service.id) || service.id.startsWith("vitamin-plan-")
      )
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
          : prev
      );
      setRespondNotice(String(data.message || (action === "accept" ? "Plan accepted." : "Marked declined.")));
    } catch (respondError) {
      setRespondNotice(respondError instanceof Error ? respondError.message : "Could not save your response.");
    } finally {
      setResponding(null);
    }
  };

  if (loading) return <div className="p-8 text-sm text-black/70">Loading your treatment plan...</div>;
  if (error || !proposal) return <div className="p-8 text-sm font-semibold text-red-600">{error || "Not found."}</div>;

  const publicPdfUrl = `/api/proposals/public/${proposal.public_id}/pdf`;
  const isAccepted = proposal.status === "accepted";
  const isDeclined = proposal.status === "declined";
  const hasPayment =
    proposal.payment_status === "paid" || proposal.payment_status === "deposit_paid";
  const canRespond = !isAccepted && !isDeclined && !hasPayment;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E6007E]">Hello Gorgeous Med Spa</p>
          <div className="flex gap-2">
            <a href={publicPdfUrl} className="rounded-full border border-black px-4 py-2 text-xs font-bold text-black">
              Download PDF
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white"
            >
              Print
            </button>
          </div>
        </div>

        <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#FF2D8E]">
          <h1 className="text-3xl font-black text-black">Your Personalized Treatment Plan</h1>
          <p className="mt-3 text-sm text-black/75">
            Built for {proposal.client_name} · Created {new Date(proposal.created_at).toLocaleDateString()} · Expires{" "}
            {new Date(proposal.expires_at).toLocaleDateString()}
          </p>
          {proposal.concerns?.length ? (
            <p className="mt-2 text-sm text-black/80">
              <span className="font-semibold">Concerns:</span> {proposal.concerns.join(", ")}
            </p>
          ) : null}
          {proposal.client_instructions ? (
            <div className="mt-4 rounded-xl border border-black/10 bg-[#FFF0F7] p-4">
              <p className="text-sm font-bold text-[#E6007E]">Your instructions</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-black/85">{proposal.client_instructions}</p>
            </div>
          ) : null}
          {isAccepted ? (
            <div className="mt-4 rounded-xl border-2 border-[#E6007E] bg-[#FFF0F7] p-4">
              <p className="text-sm font-bold text-[#E6007E]">
                You selected {proposal.accepted_option || "your plan"} — we&apos;ll confirm next steps soon.
              </p>
            </div>
          ) : null}
          {isDeclined ? (
            <div className="mt-4 rounded-xl border border-black/20 bg-black/[0.03] p-4">
              <p className="text-sm font-semibold text-black/80">
                You marked this proposal as not moving forward. Call or text anytime if you want to revisit.
              </p>
            </div>
          ) : null}
        </section>

        {proposal.media?.length ? (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-black">Before & after</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {proposal.media.map((item) => (
                <figure key={item.id} className="overflow-hidden rounded-2xl border-4 border-black bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.label || item.kind} className="h-56 w-full object-cover" />
                  <figcaption className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#E6007E]">
                    {item.label || item.kind}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <ProposalCredibilityBand options={options} className="mt-6" />

        {showsVitaminCheatSheet ? (
          <section className="mt-6">
            <VitaminInjectionCheatSheet variant="client" />
          </section>
        ) : null}

        {careGuides.length ? (
          <section className="mt-6 rounded-2xl border-4 border-black bg-[#FFF0F7] p-5 shadow-[8px_8px_0_0_#FF2D8E]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6007E]">Before &amp; after care</p>
            <h2 className="mt-1 text-xl font-black text-black">Your pre &amp; post care guides</h2>
            <p className="mt-2 text-sm text-black/75">
              Review these official instructions before your visits — they protect your results and keep healing on track.
            </p>
            <ul className="mt-4 space-y-3">
              {careGuides.map((guide) => (
                <li key={guide.id}>
                  <a
                    href={`${SITE.url}${guide.path}`}
                    className="inline-flex flex-col rounded-xl border-2 border-black bg-white px-4 py-3 hover:border-[#E6007E]"
                  >
                    <span className="text-sm font-bold text-[#E6007E]">{guide.title}</span>
                    <span className="text-xs text-black/70">{guide.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {options.map((option, index) => {
            const subtotal = calculateSubtotal(option.services);
            const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
            const total = calculateTotal(option);
            const isChosen = isAccepted && proposal.accepted_option === option.name;
            return (
              <article
                key={option.name}
                className={`rounded-2xl border-4 bg-white p-5 ${
                  isChosen ? "border-[#E6007E] shadow-[8px_8px_0_0_#FF2D8E]" : "border-black"
                }`}
              >
                <h2 className="text-lg font-bold text-black">{option.name}</h2>
                {index === 1 ? (
                  <span className="mt-2 inline-block rounded-full bg-[#E6007E] px-2.5 py-1 text-[11px] font-bold text-white">
                    Most popular
                  </span>
                ) : null}
                {isChosen ? (
                  <span className="mt-2 ml-2 inline-block rounded-full border border-[#E6007E] px-2.5 py-1 text-[11px] font-bold text-[#E6007E]">
                    Your choice
                  </span>
                ) : null}
                <ul className="mt-3 space-y-2 text-sm text-black/80">
                  {option.services.map((service) => (
                    <li key={`${option.name}-${service.id}`}>
                      <span className="font-semibold text-black">{formatProposalServiceLine(service)}</span>
                      {service.description ? (
                        <p className="mt-0.5 pl-3 text-xs leading-relaxed text-black/65">{service.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-black/15 pt-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#E6007E]"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
                  <div className="mt-1 flex justify-between text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                {canRespond ? (
                  <button
                    type="button"
                    disabled={Boolean(responding)}
                    onClick={() => void respond("accept", option.name)}
                    className="mt-4 w-full rounded-full bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {responding === "accept" ? "Saving…" : `Choose ${option.name}`}
                  </button>
                ) : null}
              </article>
            );
          })}
        </section>

        {canRespond ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={Boolean(responding)}
              onClick={() => void respond("decline")}
              className="rounded-full border border-black/30 px-4 py-2 text-xs font-bold text-black/70 disabled:opacity-50"
            >
              {responding === "decline" ? "Saving…" : "Not right now"}
            </button>
            <p className="text-xs text-black/55">Choosing a plan notifies our team so we can book your first visit.</p>
          </div>
        ) : null}
        {respondNotice ? <p className="mt-3 text-sm font-semibold text-[#E6007E]">{respondNotice}</p> : null}

        <section className="mt-6 rounded-2xl border-2 border-black p-5">
          {proposal.payment_status === "paid" || proposal.payment_status === "deposit_paid" ? (
            <p className="text-sm font-semibold text-[#E6007E]">
              {proposal.payment_status === "paid"
                ? "Payment received — thank you! We’ll confirm your first appointment next."
                : "Deposit received — thank you! We’ll confirm your first appointment and remaining balance next."}
            </p>
          ) : proposal.payment_url ? (
            <>
              <p className="text-sm text-black/80">
                Ready to secure your plan
                {proposal.payment_option_name ? ` (${proposal.payment_option_name})` : ""}
                {proposal.payment_amount_usd != null
                  ? ` — $${Number(proposal.payment_amount_usd).toFixed(2)}`
                  : ""}
                ?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={proposal.payment_url}
                  className="rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold text-white"
                >
                  {proposal.payment_kind === "deposit" ? "Pay deposit securely" : "Pay securely"}
                </a>
                <a href="/book" className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black">
                  Book now
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-black/80">
                {isAccepted
                  ? "Next: book your first visit or pay a deposit when we send your secure link."
                  : "Ready to move forward? Book your first visit or call us and we will help you choose the best option."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/book" className="rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold text-white">
                  Book now
                </a>
                <a href="tel:16306366193" className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black">
                  Call 630-636-6193
                </a>
              </div>
            </>
          )}

          <div className="mt-5 rounded-xl border border-black/15 bg-[#FFF0F7] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Flexible financing</p>
            <p className="mt-1 text-sm text-black/80">
              Prefer monthly payments? Apply for Cherry or CareCredit — many clients use financing for packages and series plans.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-4 py-2.5 text-sm font-bold text-white"
              >
                Apply now with Cherry
              </a>
              <a
                href={CARECREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black"
              >
                Apply with CareCredit
              </a>
              <a href="/financing" className="rounded-full border border-black/30 px-4 py-2 text-xs font-bold text-black/80">
                Financing details
              </a>
            </div>
          </div>
        </section>

        <p className="mt-5 text-xs text-black/55">
          Educational proposal only. Final treatment plan and medical eligibility are confirmed during your in-person consultation.
        </p>
        <p className="mt-2 text-xs text-black/45">
          Staff access: <Link href="/admin/proposals" className="text-[#E6007E] hover:underline">Admin proposals</Link>
        </p>
      </div>
    </main>
  );
}
