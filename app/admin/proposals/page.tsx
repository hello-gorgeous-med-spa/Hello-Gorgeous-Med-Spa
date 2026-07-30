"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";
import { proposalStatusBadges } from "@/lib/proposals/status-badges";

export default function ProposalsListPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<TreatmentProposalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/proposals");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load proposals.");
        setProposals(data.proposals || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load proposals.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-black">Treatment proposals</h1>
          <p className="mt-1 text-sm text-black/70">
            Create, review, and print consult plans.{" "}
            <a
              href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E6007E] underline"
            >
              Staff how-to
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/staff/protocols/guides/InMode-Packages-How-To-Sell.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-black bg-[#FFF0F7] px-4 py-2.5 text-sm font-bold text-black"
          >
            How to sell packages
          </a>
          <a
            href="/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-black bg-white px-4 py-2.5 text-sm font-bold text-black"
          >
            How to use
          </a>
          <Link href="/admin/proposals/new" className="rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white">
            + New proposal
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white">
        <table className="w-full">
          <thead className="bg-[#FFF0F7]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Client</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Created</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black">Expires</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/70">
                  Loading proposals...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-red-600">
                  {error}
                </td>
              </tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/70">
                  No proposals yet.
                </td>
              </tr>
            ) : (
              proposals.map((proposal) => {
                const badges = proposalStatusBadges(proposal);
                return (
                  <tr key={proposal.id} className="border-t border-black/10">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-black">{proposal.client_name}</p>
                      <p className="text-xs text-black/60">
                        {proposal.client_email || proposal.client_phone || "No contact"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                          <span
                            key={badge.key}
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70">
                      {new Date(proposal.expires_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {badges.map((badge) => (
                          <span
                            key={`action-${badge.key}`}
                            className={`inline-flex rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                        <Link
                          href={`/admin/proposals/${proposal.id}/edit`}
                          className="rounded-full border border-black px-3 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/proposals/${proposal.id}/preview`}
                          className="rounded-full bg-[#E6007E] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Preview
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
