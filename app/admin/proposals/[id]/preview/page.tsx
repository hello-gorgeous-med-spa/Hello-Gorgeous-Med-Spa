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
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { ProposalCredibilityBand } from "@/components/proposals/ProposalCredibilityBand";
import { VitaminInjectionCheatSheet } from "@/components/proposals/VitaminInjectionCheatSheet";
import { isVitaminProposalServiceId } from "@/lib/proposals/vitamin-injections";
import { careGuidesForProposalOptions } from "@/lib/proposals/care-guides";
import { SITE } from "@/lib/seo";
import { CARECREDIT_URL, CHERRY_PAY_URL } from "@/lib/flows";
import {
  fillProposalWelcomeTemplate,
  PROPOSAL_WELCOME_TEMPLATES,
} from "@/lib/proposals/welcome-templates";

export default function ProposalPreviewPage() {
  const params = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<TreatmentProposalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [sendingCare, setSendingCare] = useState<"email" | "sms" | "both" | null>(null);
  const [creatingPay, setCreatingPay] = useState<"deposit" | "full" | null>(null);
  const [optionIndex, setOptionIndex] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [depositPercent, setDepositPercent] = useState(50);
  const [notice, setNotice] = useState<string | null>(null);

  const reload = async () => {
    const response = await fetch(`/api/proposals/${params.id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load proposal.");
    setProposal(data.proposal);
    setEmail(data.proposal?.client_email || "");
    setPhone(data.proposal?.client_phone || "");
    setClientNote(data.proposal?.client_instructions || "");
    if (Array.isArray(data.proposal?.options) && data.proposal.options.length) {
      setOptionIndex(Math.min(1, data.proposal.options.length - 1));
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await reload();
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load proposal.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const options = useMemo<ProposalOption[]>(() => proposal?.options || [], [proposal?.options]);
  const showsVitaminCheatSheet = useMemo(
    () =>
      options.some((option) =>
        option.services.some(
          (service) =>
            isVitaminProposalServiceId(service.id) || service.id.startsWith("vitamin-plan-")
        )
      ),
    [options]
  );
  const careGuides = useMemo(() => careGuidesForProposalOptions(options), [options]);
  const pdfHref = `/api/proposals/${params.id}/pdf`;
  const publicShareHref = proposal?.public_id ? `/proposals/${proposal.public_id}` : "";
  const selectedTotal = options[optionIndex] ? calculateTotal(options[optionIndex]) : 0;
  const safeDepositPercent = Math.min(100, Math.max(1, depositPercent || 50));
  const depositPreview = Math.round(selectedTotal * (safeDepositPercent / 100) * 100) / 100;

  const copyShareLink = async () => {
    if (!publicShareHref) return;
    const absoluteUrl = `${window.location.origin}${publicShareHref}`;
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setNotice("Public share link copied.");
    } catch {
      setNotice("Could not copy automatically. Please copy the link manually.");
    }
  };

  const saveClientNote = async () => {
    if (!proposal) return;
    setNotice(null);
    setSavingNote(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: proposal.client_name,
          clientEmail: email || proposal.client_email,
          clientPhone: phone || proposal.client_phone,
          concerns: proposal.concerns || [],
          options: proposal.options || [],
          internalNotes: proposal.internal_notes,
          clientInstructions: clientNote,
          media: proposal.media || [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save note.");
      setProposal(data.proposal);
      setClientNote(data.proposal?.client_instructions || "");
      setNotice("Welcome note saved — clients see it on their plan link & PDF.");
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : "Failed to save note.");
    } finally {
      setSavingNote(false);
    }
  };

  const readJson = async (response: Response) => {
    const text = await response.text();
    if (!text.trim()) return {};
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { error: text.slice(0, 200) || "Invalid server response." };
    }
  };

  const sendEmail = async () => {
    setNotice(null);
    setSendingEmail(true);
    try {
      const response = await fetch("/api/proposals/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: params.id, email }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data.error || "Failed to send email."));
      setNotice("Proposal email sent successfully.");
    } catch (sendError) {
      setNotice(sendError instanceof Error ? sendError.message : "Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  const sendSms = async () => {
    setNotice(null);
    setSendingSms(true);
    try {
      const response = await fetch("/api/proposals/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: params.id, phone }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data.error || "Failed to send SMS."));
      setNotice("Proposal SMS sent successfully.");
    } catch (sendError) {
      setNotice(sendError instanceof Error ? sendError.message : "Failed to send SMS.");
    } finally {
      setSendingSms(false);
    }
  };

  const sendCare = async (mode: "email" | "sms" | "both") => {
    setNotice(null);
    setSendingCare(mode);
    try {
      const channels =
        mode === "both" ? ["email", "sms"] : mode === "email" ? ["email"] : ["sms"];
      const response = await fetch("/api/proposals/send-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: params.id,
          email,
          phone,
          channels,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send care guides.");
      const guideNames = Array.isArray(data.guides)
        ? data.guides.map((g: { title: string }) => g.title).join(", ")
        : "guides";
      setNotice(`Pre & post care sent (${guideNames}).`);
    } catch (careError) {
      setNotice(careError instanceof Error ? careError.message : "Failed to send care guides.");
    } finally {
      setSendingCare(null);
    }
  };

  const createPayment = async (kind: "deposit" | "full") => {
    setNotice(null);
    setCreatingPay(kind);
    try {
      const body: Record<string, unknown> = {
        kind,
        optionIndex,
        depositPercent: safeDepositPercent,
      };
      const custom = Number(customAmount);
      if (customAmount.trim() && Number.isFinite(custom) && custom > 0) {
        body.amountUsd = custom;
      }
      const response = await fetch(`/api/proposals/${params.id}/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create payment link.");
      await reload();
      setNotice(
        `${kind === "deposit" ? "Deposit" : "Pay in full"} link ready ($${Number(data.amountUsd).toFixed(2)}). Copied + opened.`
      );
      if (data.url) {
        try {
          await navigator.clipboard.writeText(data.url);
        } catch {
          /* ignore */
        }
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (payError) {
      setNotice(payError instanceof Error ? payError.message : "Failed to create payment link.");
    } finally {
      setCreatingPay(null);
    }
  };

  if (loading) return <div className="p-8 text-sm text-black/70">Loading proposal...</div>;
  if (error || !proposal) return <div className="p-8 text-sm font-semibold text-red-600">{error || "Not found."}</div>;

  const paymentStatus = proposal.payment_status || "unpaid";

  return (
    <main className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-5xl p-6 print:p-0">
        <div className="print:hidden mb-4 flex items-center justify-between">
          <Link href="/admin/proposals" className="text-sm font-semibold text-[#E6007E] hover:underline">
            ← Back to proposals
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/admin/proposals/${params.id}/edit`}
              className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Edit
            </Link>
            <a href={pdfHref} className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black">
              Download PDF
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold text-white"
            >
              Print proposal
            </button>
          </div>
        </div>

        <section className="rounded-2xl border-4 border-black p-6 shadow-[8px_8px_0_0_#FF2D8E] print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">Hello Gorgeous Med Spa</p>
          <h1 className="mt-2 text-3xl font-black text-black">Personalized Treatment Plan</h1>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p><span className="font-semibold">Client:</span> {proposal.client_name}</p>
            <p><span className="font-semibold">Created:</span> {new Date(proposal.created_at).toLocaleDateString()}</p>
            <p><span className="font-semibold">Email:</span> {proposal.client_email || "N/A"}</p>
            <p><span className="font-semibold">Phone:</span> {proposal.client_phone || "N/A"}</p>
            <p>
              <span className="font-semibold">Payment:</span>{" "}
              <span className="uppercase tracking-wide text-[#E6007E]">{paymentStatus.replace("_", " ")}</span>
              {proposal.payment_amount_usd != null ? ` · $${Number(proposal.payment_amount_usd).toFixed(2)}` : ""}
            </p>
          </div>
          {proposal.concerns?.length ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-black">Concerns</p>
              <p className="text-sm text-black/80">{proposal.concerns.join(", ")}</p>
            </div>
          ) : null}
          {proposal.client_instructions ? (
            <div className="mt-5 rounded-2xl border-4 border-black bg-[#FFF0F7] p-5 print:border-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">
                A note from Hello Gorgeous
              </p>
              <h2 className="mt-1 text-xl font-black text-black">Welcome</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/85">
                {proposal.client_instructions}
              </p>
            </div>
          ) : null}
        </section>

        <section className="print:hidden mt-5 rounded-2xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#FF2D8E]">
          <h2 className="text-lg font-black text-black">Welcome message &amp; note to client</h2>
          <p className="mt-1 text-sm text-black/65">
            This shows on their personalized treatment plan, PDF, and share link. Insert a template, edit, then save.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROPOSAL_WELCOME_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() =>
                  setClientNote(
                    fillProposalWelcomeTemplate(template.body, proposal.client_name || ""),
                  )
                }
                className="rounded-full border-2 border-black bg-[#FFF0F7] px-3 py-1.5 text-[11px] font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {template.label}
              </button>
            ))}
          </div>
          <textarea
            rows={10}
            value={clientNote}
            onChange={(event) => setClientNote(event.target.value)}
            className="mt-3 w-full rounded-xl border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Hi … Welcome. Your proposal includes…"
          />
          <button
            type="button"
            disabled={savingNote}
            onClick={() => void saveClientNote()}
            className="mt-3 rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {savingNote ? "Saving…" : "Save note to client plan"}
          </button>
        </section>

        {proposal.media?.length ? (
          <section className="mt-5">
            <h2 className="mb-3 text-lg font-bold text-black">Before & after</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {proposal.media.map((item) => (
                <figure key={item.id} className="overflow-hidden rounded-xl border-2 border-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.label || item.kind} className="h-48 w-full object-cover" />
                  <figcaption className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#E6007E]">
                    {item.label || item.kind}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <ProposalCredibilityBand options={options} className="mt-5" />

        {showsVitaminCheatSheet ? (
          <section className="mt-5">
            <VitaminInjectionCheatSheet variant="staff" />
          </section>
        ) : null}

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {options.map((option, index) => {
            const subtotal = calculateSubtotal(option.services);
            const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
            const total = calculateTotal(option);
            return (
              <article key={option.name} className="rounded-xl border-2 border-black p-4">
                <h2 className="text-lg font-bold text-black">{option.name}</h2>
                {index === 1 ? (
                  <span className="mt-1 inline-block rounded-full bg-[#E6007E] px-2 py-1 text-[11px] font-bold text-white">Best value</span>
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
                  <div className="mt-1 flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="print:hidden mt-6 rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
          <h2 className="text-lg font-bold text-black">Square Pay Now</h2>
          <p className="mt-1 text-sm text-black/70">
            Creates a Square Payment Link (payment type: Proposal), logs it in the RX ledger, and marks this proposal paid when Square webhooks fire. Clients can also tap Pay Now on the public proposal link.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Plan to charge</label>
              <select
                value={optionIndex}
                onChange={(event) => setOptionIndex(Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
              >
                {options.map((option, index) => (
                  <option key={option.name} value={index}>
                    {option.name} · ${calculateTotal(option).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Deposit %</label>
              <input
                type="number"
                min={1}
                max={100}
                value={depositPercent}
                onChange={(event) => setDepositPercent(Number(event.target.value) || 50)}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Custom amount (optional)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder={`Deposit $${depositPreview.toFixed(0)}`}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <button
                type="button"
                disabled={Boolean(creatingPay) || paymentStatus === "paid"}
                onClick={() => void createPayment("deposit")}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
              >
                {creatingPay === "deposit"
                  ? "Creating…"
                  : `Pay deposit (${safeDepositPercent}% · $${depositPreview.toFixed(0)})`}
              </button>
              <button
                type="button"
                disabled={Boolean(creatingPay) || paymentStatus === "paid"}
                onClick={() => void createPayment("full")}
                className="rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {creatingPay === "full" ? "Creating…" : `Pay Now · $${selectedTotal.toFixed(0)}`}
              </button>
            </div>
          </div>
          {proposal.payment_url ? (
            <p className="mt-3 text-sm">
              Active link:{" "}
              <a href={proposal.payment_url} target="_blank" rel="noreferrer" className="font-semibold text-[#E6007E] underline">
                Open Square checkout
              </a>
              {proposal.payment_kind ? ` · ${proposal.payment_kind}` : ""}
              {proposal.payment_option_name ? ` · ${proposal.payment_option_name}` : ""}
            </p>
          ) : null}

          <div className="mt-5 rounded-xl border border-black/15 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Client financing</p>
            <p className="mt-1 text-sm text-black/75">
              Share Cherry so they can apply for monthly payments (often soft credit check to see options).
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white"
              >
                Apply now with Cherry
              </a>
              <a
                href={CARECREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-black px-4 py-2 text-sm font-bold text-black"
              >
                Apply with CareCredit
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(CHERRY_PAY_URL);
                    setNotice("Cherry apply link copied.");
                  } catch {
                    setNotice("Could not copy Cherry link — open Apply now instead.");
                  }
                }}
                className="rounded-full border border-black/30 px-4 py-2 text-xs font-bold text-black/70"
              >
                Copy Cherry link
              </button>
            </div>
          </div>
        </section>

        <section className="print:hidden mt-6 rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-black">Send pre & post care</h2>
          <p className="mt-1 text-sm text-black/70">
            Email or text the official before-and-after care guides that match treatments on this proposal.
          </p>
          {careGuides.length ? (
            <ul className="mt-3 space-y-1 text-sm text-black/80">
              {careGuides.map((guide) => (
                <li key={guide.id}>
                  •{" "}
                  <a
                    href={`${SITE.url}${guide.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#E6007E] underline"
                  >
                    {guide.title}
                  </a>
                  <span className="text-black/60"> — {guide.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-black/55">No mapped care guides for the services on this proposal yet.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!careGuides.length || Boolean(sendingCare)}
              onClick={() => void sendCare("email")}
              className="rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              {sendingCare === "email" ? "Sending…" : "Email care guides"}
            </button>
            <button
              type="button"
              disabled={!careGuides.length || Boolean(sendingCare)}
              onClick={() => void sendCare("sms")}
              className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
            >
              {sendingCare === "sms" ? "Sending…" : "Text care guides"}
            </button>
            <button
              type="button"
              disabled={!careGuides.length || Boolean(sendingCare)}
              onClick={() => void sendCare("both")}
              className="rounded-full border-2 border-black bg-[#FFF0F7] px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
            >
              {sendingCare === "both" ? "Sending…" : "Email + text"}
            </button>
          </div>
        </section>

        <section className="print:hidden mt-6 rounded-2xl border-2 border-black bg-white p-5">
          <h2 className="text-lg font-bold text-black">Send to client</h2>
          {publicShareHref ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-xs text-black/65">
                Public share link:{" "}
                <a className="font-semibold text-[#E6007E] hover:underline" href={publicShareHref}>
                  {publicShareHref}
                </a>
              </p>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-full border border-black px-3 py-1 text-[11px] font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                Copy share link
              </button>
            </div>
          ) : null}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                placeholder="client@email.com"
              />
              <button
                type="button"
                onClick={sendEmail}
                disabled={sendingEmail}
                className="mt-2 rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {sendingEmail ? "Sending..." : "Send email with PDF"}
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Phone</label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                placeholder="(630) 555-1212"
              />
              <button
                type="button"
                onClick={sendSms}
                disabled={sendingSms}
                className="mt-2 rounded-full border border-black px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
              >
                {sendingSms ? "Sending..." : "Send SMS with link"}
              </button>
            </div>
          </div>
          {notice ? <p className="mt-3 text-sm font-semibold text-[#E6007E]">{notice}</p> : null}
        </section>
      </div>
    </main>
  );
}
