"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  type ProposalOption,
} from "@/lib/proposals/utils";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

export default function ProposalPreviewPage() {
  const params = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<TreatmentProposalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/proposals/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load proposal.");
        setProposal(data.proposal);
        setEmail(data.proposal?.client_email || "");
        setPhone(data.proposal?.client_phone || "");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load proposal.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) load();
  }, [params.id]);

  const options = useMemo<ProposalOption[]>(() => proposal?.options || [], [proposal?.options]);
  const pdfHref = `/api/proposals/${params.id}/pdf`;
  const publicShareHref = proposal?.public_id ? `/proposals/${proposal.public_id}` : "";

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

  const sendEmail = async () => {
    setNotice(null);
    setSendingEmail(true);
    try {
      const response = await fetch("/api/proposals/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: params.id, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send email.");
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send SMS.");
      setNotice("Proposal SMS sent successfully.");
    } catch (sendError) {
      setNotice(sendError instanceof Error ? sendError.message : "Failed to send SMS.");
    } finally {
      setSendingSms(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-black/70">Loading proposal...</div>;
  if (error || !proposal) return <div className="p-8 text-sm font-semibold text-red-600">{error || "Not found."}</div>;

  return (
    <main className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-5xl p-6 print:p-0">
        <div className="print:hidden mb-4 flex items-center justify-between">
          <Link href="/admin/proposals" className="text-sm font-semibold text-[#E6007E] hover:underline">
            ← Back to proposals
          </Link>
          <div className="flex gap-2">
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
          </div>
          {proposal.concerns?.length ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-black">Concerns</p>
              <p className="text-sm text-black/80">{proposal.concerns.join(", ")}</p>
            </div>
          ) : null}
        </section>

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
                <ul className="mt-3 space-y-1 text-sm text-black/80">
                  {option.services.map((service) => (
                    <li key={`${option.name}-${service.id}`}>- {service.name}{service.quantity > 1 ? ` (${service.quantity})` : ""}</li>
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
