"use client";

import { useCallback, useEffect, useState } from "react";

type Affiliate = {
  id: string;
  code: string;
  partner_type: string;
  status: string;
  legal_name: string;
  email: string;
  business_name?: string;
  created_at: string;
};

type Commission = {
  id: string;
  affiliate_id: string;
  kind: string;
  status: string;
  amount_usd: number;
};

export default function OpsAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/regen/ops/affiliates", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setAffiliates(json.affiliates || []);
      setCommissions(json.commissions || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: string) {
    await fetch("/api/regen/ops/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Partners</h1>
          <p className="text-white/50">Approve affiliates. Commissions are a referral fee — never tied to a prescription.</p>
        </div>
        <button type="button" onClick={load} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">Refresh</button>
      </div>

      {loading ? <p className="text-white/50">Loading…</p> : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/45">
            <tr>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pending $</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((row) => {
              const pending = commissions
                .filter((c) => c.affiliate_id === row.id && c.status !== "paid" && c.status !== "void")
                .reduce((sum, c) => sum + Number(c.amount_usd || 0), 0);
              return (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <b className="text-white">{row.legal_name}</b>
                    <div className="text-xs text-white/40">{row.business_name || row.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{row.code}</td>
                  <td className="px-4 py-3">{row.partner_type}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">${pending.toFixed(2)}</td>
                  <td className="px-4 py-3 space-x-2">
                    {row.status !== "active" ? (
                      <button type="button" onClick={() => act(row.id, "approve")} className="rounded bg-teal-600 px-2 py-1 text-xs text-white">Approve</button>
                    ) : (
                      <button type="button" onClick={() => act(row.id, "pause")} className="rounded bg-white/10 px-2 py-1 text-xs">Pause</button>
                    )}
                    <button type="button" onClick={() => act(row.id, "pay")} className="rounded bg-pink-600 px-2 py-1 text-xs text-white">Mark paid</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {affiliates.length === 0 && !loading ? (
          <p className="p-6 text-sm text-white/40">No applications yet. Public form is /affiliates/apply.</p>
        ) : null}
      </div>
    </div>
  );
}
