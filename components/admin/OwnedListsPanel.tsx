"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type OwnedListRow = {
  id: string;
  label: string;
  count: number | null;
  hint: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
};

type OwnedListsData = {
  ok: boolean;
  generatedAt?: string;
  square?: {
    connected: boolean;
    customersScanned: number;
    error?: string;
  };
  lists: OwnedListRow[];
};

export function OwnedListsPanel() {
  const [data, setData] = useState<OwnedListsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/local-dominance/owned-lists", { cache: "no-store" });
      const json = (await res.json()) as OwnedListsData & { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const topAudience =
    data?.lists.find((l) => l.id === "square-all")?.count ??
    data?.lists.find((l) => l.id === "contact-email")?.count;

  return (
    <section className="rounded-2xl border-2 border-black bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-black">Owned lists — your free audience</h3>
          <p className="mt-1 text-sm text-black/65">
            Lists you already have (no purchased emails). Use Square + Contact Collection for blasts; text warm RX
            leads directly.
          </p>
          {topAudience != null && topAudience > 0 ? (
            <p className="mt-2 text-sm font-semibold text-[#E6007E]">
              Largest reach: ~{topAudience.toLocaleString()} contacts in Square
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-lg border border-black px-3 py-1.5 text-xs font-semibold hover:bg-black/5 disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh counts"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      ) : null}

      {data?.square && !data.square.connected ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          Square counts unavailable — set <code>SQUARE_ACCESS_TOKEN</code> or connect Square OAuth. Other lists still
          load from HG database.
          {data.square.error ? ` (${data.square.error})` : ""}
        </p>
      ) : null}

      {loading && !data ? (
        <p className="mt-4 text-sm text-black/50">Loading audience counts… (Square scan may take a few seconds)</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/55">
              <tr>
                <th className="p-2">List</th>
                <th className="p-2 text-right">Count</th>
                <th className="p-2">Use for</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {(data?.lists ?? []).map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-black/10 ${row.highlight ? "bg-[#FFF0F7]/80" : ""}`}
                >
                  <td className="p-2 font-medium text-black">{row.label}</td>
                  <td className="p-2 text-right font-black text-[#E6007E]">
                    {row.count == null ? "—" : row.count.toLocaleString()}
                  </td>
                  <td className="p-2 text-xs text-black/60">{row.hint}</td>
                  <td className="p-2 text-right">
                    {row.external ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#E6007E] hover:underline"
                      >
                        Open ↗
                      </a>
                    ) : (
                      <Link href={row.href} className="text-xs font-semibold text-[#E6007E] hover:underline">
                        Open →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-black/10 pt-4">
        <QuickChip href="/admin/marketing/contacts" label="Import CSV" />
        <QuickChip href="/join" label="Sign-up link /join" external />
        <QuickChip href="/admin/marketing/square-segments" label="Sync Square segments" />
        <QuickChip href="/admin/sms" label="Send SMS" />
      </div>

      {data?.generatedAt ? (
        <p className="mt-2 text-[10px] text-black/40">
          Updated {new Date(data.generatedAt).toLocaleString()}
          {data.square?.connected
            ? ` · ${data.square.customersScanned.toLocaleString()} Square customers scanned`
            : ""}
        </p>
      ) : null}
    </section>
  );
}

function QuickChip({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls =
    "rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-semibold text-black hover:border-[#E6007E] hover:text-[#E6007E]";
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
