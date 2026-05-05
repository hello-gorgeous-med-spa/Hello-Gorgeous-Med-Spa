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

type PublicProposal = {
  id: string;
  public_id: string;
  client_name: string;
  created_at: string;
  expires_at: string;
  status: string;
  concerns: string[];
  options: ProposalOption[];
  view_count: number;
};

export default function PublicProposalPage() {
  const params = useParams<{ publicId: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-8 text-sm text-black/70">Loading your treatment plan...</div>;
  if (error || !proposal) return <div className="p-8 text-sm font-semibold text-red-600">{error || "Not found."}</div>;

  const publicPdfUrl = `/api/proposals/public/${proposal.public_id}/pdf`;

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
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {options.map((option, index) => {
            const subtotal = calculateSubtotal(option.services);
            const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
            const total = calculateTotal(option);
            return (
              <article key={option.name} className="rounded-2xl border-4 border-black bg-white p-5">
                <h2 className="text-lg font-bold text-black">{option.name}</h2>
                {index === 1 ? (
                  <span className="mt-2 inline-block rounded-full bg-[#E6007E] px-2.5 py-1 text-[11px] font-bold text-white">
                    Most popular
                  </span>
                ) : null}
                <ul className="mt-3 space-y-1 text-sm text-black/80">
                  {option.services.map((service) => (
                    <li key={`${option.name}-${service.id}`}>
                      - {service.name}
                      {service.quantity > 1 ? ` (${service.quantity})` : ""}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-black/15 pt-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#E6007E]"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
                  <div className="mt-1 flex justify-between text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-2xl border-2 border-black p-5">
          <p className="text-sm text-black/80">
            Ready to move forward? Book your first visit or call us and we will help you choose the best option.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/book" className="rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold text-white">
              Book now
            </a>
            <a href="tel:16306366193" className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black">
              Call 630-636-6193
            </a>
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
