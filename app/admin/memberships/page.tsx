"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type CategoryId =
  | "all"
  | "med-spa"
  | "vitamin-bar"
  | "hormones"
  | "wellness"
  | "peptides"
  | "aesthetic";

type MembershipItem = {
  id: string;
  category: string;
  group: string;
  name: string;
  summary: string;
  perks: string[];
  pricePerMonth: number;
  priceLabel: string;
  squarePayUrl?: string;
  consultFirst?: boolean;
  bookHref?: string;
  learnMoreHref?: string;
  badge?: string;
  inactive?: boolean;
  footnote?: string;
};

type Delivery = "link" | "email" | "sms" | "both";

export default function AdminMembershipsHubPage() {
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [categories, setCategories] = useState<{ id: CategoryId; label: string; count: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MembershipItem | null>(null);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("both");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    url?: string;
    error?: string;
    notify?: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } };
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/memberships/catalog");
        const data = await res.json();
        if (!cancelled && res.ok) {
          setCategories(data.categories || []);
          setMemberships(data.memberships || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return memberships.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.group.toLowerCase().includes(q)
      );
    });
  }, [memberships, categoryFilter, search]);

  const grouped = useMemo((): [string, MembershipItem[]][] => {
    const map = new Map<string, MembershipItem[]>();
    for (const m of filtered) {
      const list = map.get(m.group) ?? [];
      list.push(m);
      map.set(m.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const pick = useCallback((m: MembershipItem) => {
    setSelected(m);
    setResult(null);
    setCopied(false);
  }, []);

  const sendLink = async () => {
    if (!selected) return;
    if (selected.inactive) {
      alert("This plan is marked inactive — not sold on the site yet.");
      return;
    }
    if (selected.consultFirst) {
      alert("This plan requires a consult first — use Book consult or send them to Fresha.");
      return;
    }
    if ((delivery === "email" || delivery === "both") && !email.trim()) {
      alert("Email required for email delivery.");
      return;
    }
    if ((delivery === "sms" || delivery === "both") && !phone.trim()) {
      alert("Phone required for text delivery.");
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/memberships/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: selected.id,
          clientName: clientName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          delivery,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, error: data.error || "Could not get checkout link" });
        return;
      }
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setSending(false);
    }
  };

  const copyStaticLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-[#FF2D8E]">Memberships</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            All plans in one place — Square checkout links for Glow, Vitamin Bar, hormones, wellness
            &amp; peptides.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
          <Link href="/admin/memberships/manage" className="text-gray-500 hover:text-white">
            Member accounts →
          </Link>
          <Link href="/admin" className="text-gray-500 hover:text-white">
            ← Admin
          </Link>
        </div>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search memberships…"
        className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm mb-4 placeholder-gray-500 focus:outline-none focus:border-[#E6007E]"
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {(categories.length ? categories : [{ id: "all" as const, label: "All", count: 0 }]).map(
          (c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id as CategoryId)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 transition ${
                categoryFilter === c.id
                  ? "border-[#E6007E] bg-[#E6007E]/20 text-[#FFB8DC]"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {c.label}
              <span className="ml-1 opacity-60">({c.count})</span>
            </button>
          ),
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading plans…</p>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No plans match.</p>
      ) : (
        <div className="space-y-6 mb-8">
          {grouped.map(([group, items]) => (
            <section key={group}>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-2">
                {group}
              </h2>
              <div className="grid gap-2">
                {items.map((m) => {
                  const active = selected?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => pick(m)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                        active
                          ? "border-[#E6007E] bg-[#E6007E]/15 shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                          : "border-gray-800 bg-gray-900 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-sm">{m.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{m.summary}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {m.inactive ? (
                              <span className="text-[10px] font-bold uppercase text-amber-400/90">
                                Inactive
                              </span>
                            ) : null}
                            {m.consultFirst ? (
                              <span className="text-[10px] font-bold uppercase text-blue-300/90">
                                Consult first
                              </span>
                            ) : null}
                            {m.squarePayUrl ? (
                              <span className="text-[10px] font-bold uppercase text-green-400/90">
                                Square link
                              </span>
                            ) : !m.consultFirst && !m.inactive ? (
                              <span className="text-[10px] font-bold uppercase text-violet-300/90">
                                Auto checkout
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <span className="shrink-0 text-sm font-black text-[#FF2D8E]">
                          {m.priceLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {selected ? (
        <div className="rounded-2xl border-4 border-black bg-gray-900 p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#FFB8DC]">Send membership</p>
              <h3 className="font-black text-lg">{selected.name}</h3>
              <p className="text-sm text-[#FF2D8E] font-bold">{selected.priceLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          {selected.inactive ? (
            <p className="text-sm text-amber-200 mb-4">
              Inactive on the public site — enable in code before selling.
            </p>
          ) : selected.consultFirst ? (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-blue-100">
                Requires NP consult before enrollment — don&apos;t send a membership link yet.
              </p>
              {selected.bookHref ? (
                <a
                  href={selected.bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-bold"
                >
                  Book consult (Fresha) ↗
                </a>
              ) : null}
              {selected.learnMoreHref ? (
                <Link
                  href={selected.learnMoreHref}
                  className="block text-xs text-[#FFB8DC] underline mt-2"
                >
                  Learn more page →
                </Link>
              ) : null}
            </div>
          ) : (
            <>
              {selected.squarePayUrl ? (
                <button
                  type="button"
                  onClick={() => copyStaticLink(selected.squarePayUrl!)}
                  className="mb-4 w-full rounded-lg border border-green-500/40 bg-green-500/10 py-2 text-xs font-bold text-green-200"
                >
                  {copied ? "Copied!" : "Copy existing Square link"}
                </button>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <label className="block sm:col-span-2">
                  <span className="text-xs text-gray-400">Client name</span>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <fieldset className="mb-4">
                <legend className="text-xs text-gray-400 mb-2">Delivery</legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["link", "Link only"],
                      ["email", "Email"],
                      ["sms", "Text"],
                      ["both", "Email + text"],
                    ] as const
                  ).map(([id, label]) => (
                    <label
                      key={id}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold border-2 ${
                        delivery === id
                          ? "border-[#E6007E] bg-[#E6007E]/20"
                          : "border-gray-700 text-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        className="sr-only"
                        checked={delivery === id}
                        onChange={() => setDelivery(id)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                disabled={sending}
                onClick={sendLink}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-3.5 text-sm font-black uppercase tracking-wide disabled:opacity-50"
              >
                {sending ? "Getting link…" : `Send ${selected.priceLabel}`}
              </button>
            </>
          )}

          {result ? (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                result.ok
                  ? "border-green-500/40 bg-green-500/10 text-green-100"
                  : "border-red-500/40 bg-red-500/10 text-red-100"
              }`}
            >
              {result.ok && result.url ? (
                <>
                  <p className="font-bold mb-2">Checkout link ready</p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-[#FFB8DC] underline"
                  >
                    {result.url}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyStaticLink(result.url!)}
                    className="mt-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Copy link
                  </button>
                </>
              ) : (
                <p>{result.error}</p>
              )}
            </div>
          ) : null}

          {selected.footnote ? (
            <p className="mt-4 text-[11px] text-gray-500">{selected.footnote}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 py-4">Tap a plan to send a checkout link.</p>
      )}
    </div>
  );
}
