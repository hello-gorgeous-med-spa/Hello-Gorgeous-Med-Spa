"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type RxTrack = "weight-loss" | "peptides" | "fees";

type RxTemplate = {
  id: string;
  track: RxTrack;
  group: string;
  name: string;
  lineLabel: string;
  amountUsd: number;
  note?: string;
  allowCustomAmount?: boolean;
};

type TrackMeta = { id: RxTrack; label: string; count: number };

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
};

type Delivery = "link" | "email" | "sms" | "both";

type SendResult = {
  ok: boolean;
  url?: string;
  template?: { id: string; name: string; amountUsd: number };
  notify?: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } };
  error?: string;
};

const TRACKS: { id: RxTrack | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "weight-loss", label: "Weight loss" },
  { id: "peptides", label: "Peptides" },
  { id: "fees", label: "Fees" },
];

function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

const FAVORITES_KEY = "hg-rx-invoice-favorites";

type RecentSend = {
  id: string;
  created_at: string;
  client_name: string | null;
  template_name: string | null;
  amount_usd: number;
  payment_status: string;
  payment_url: string | null;
};

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export default function RxInvoicesPage() {
  const searchParams = useSearchParams();
  const paidBanner = searchParams.get("paid") === "1";
  const prefillRef = searchParams.get("ref") || "";
  const prefillName = searchParams.get("name") || "";
  const prefillEmail = searchParams.get("email") || "";
  const prefillPhone = searchParams.get("phone") || "";

  const [tracks, setTracks] = useState<TrackMeta[]>([]);
  const [templates, setTemplates] = useState<RxTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [trackFilter, setTrackFilter] = useState<RxTrack | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RxTemplate | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentSends, setRecentSends] = useState<RecentSend[]>([]);

  const [clientQuery, setClientQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchingClients, setSearchingClients] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [staffNote, setStaffNote] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("both");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [copied, setCopied] = useState(false);

  const clientSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFavoriteIds(loadFavorites());
  }, []);

  useEffect(() => {
    if (prefillName) setClientName(prefillName);
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillPhone) setPhone(prefillPhone);
  }, [prefillName, prefillEmail, prefillPhone]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/rx-ledger?limit=12&source=staff_invoice");
        const data = await res.json();
        if (!cancelled && res.ok) setRecentSends(data.rows || []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?.ok]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch("/api/admin/rx-invoices/templates");
        const data = await res.json();
        if (!cancelled && res.ok) {
          setTracks(data.tracks || []);
          setTemplates(data.templates || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoadingTemplates(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (clientQuery.length < 2) {
      setClients([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearchingClients(true);
      try {
        const res = await fetch(
          `/api/clients?search=${encodeURIComponent(clientQuery)}&limit=8`,
        );
        const data = await res.json();
        setClients(Array.isArray(data) ? data : data.clients ?? []);
      } catch {
        setClients([]);
      } finally {
        setSearchingClients(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [clientQuery]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter((t) => {
      if (trackFilter !== "all" && t.track !== trackFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.lineLabel.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q)
      );
    });
  }, [templates, trackFilter, search]);

  const grouped = useMemo((): [string, RxTemplate[]][] => {
    const map = new Map<string, RxTemplate[]>();
    for (const t of filtered) {
      const list = map.get(t.group) ?? [];
      list.push(t);
      map.set(t.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const pickTemplate = useCallback((t: RxTemplate) => {
    setSelected(t);
    setResult(null);
    setCopied(false);
    setCustomAmount(t.allowCustomAmount && t.amountUsd > 0 ? String(t.amountUsd) : "");
    setStaffNote("");
  }, []);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const favoriteTemplates = useMemo(
    () => templates.filter((t) => favoriteIds.includes(t.id)),
    [templates, favoriteIds],
  );

  const pickClient = useCallback((c: Client) => {
    setClientName(`${c.first_name} ${c.last_name}`.trim());
    setEmail(c.email ?? "");
    setPhone(c.phone ?? "");
    setSelectedClientId(c.id);
    setClientQuery("");
    setClients([]);
  }, []);

  const resolvedAmount = useMemo(() => {
    if (!selected) return null;
    const custom = customAmount.trim() ? Number(customAmount) : null;
    if (custom != null && Number.isFinite(custom) && custom > 0) {
      if (!selected.allowCustomAmount && custom !== selected.amountUsd) return null;
      return Math.round(custom * 100) / 100;
    }
    if (selected.amountUsd <= 0) return null;
    return selected.amountUsd;
  }, [selected, customAmount]);

  const sendInvoice = async () => {
    if (!selected) return;
    if (resolvedAmount == null) {
      alert(
        selected.allowCustomAmount
          ? "Enter a valid custom amount for this line item."
          : "This template needs a fixed amount.",
      );
      return;
    }
    if ((delivery === "email" || delivery === "both") && !email.trim()) {
      alert("Client email is required for email delivery.");
      return;
    }
    if ((delivery === "sms" || delivery === "both") && !phone.trim()) {
      alert("Client phone is required for text delivery.");
      return;
    }

    setSending(true);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/rx-invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selected.id,
          clientId: selectedClientId,
          intakeRef: prefillRef.trim() || undefined,
          clientName: clientName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note: staffNote.trim(),
          customAmountUsd: customAmount.trim() ? Number(customAmount) : undefined,
          delivery,
        }),
      });
      const data = (await res.json()) as SendResult & { error?: string };
      if (!res.ok) {
        setResult({ ok: false, error: data.error || "Could not create payment link" });
        return;
      }
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Network error — try again" });
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    if (!result?.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy — select the link manually.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-[#FF2D8E]">RX</span> Payment Links
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Premade GLP-1, peptide &amp; fee invoices — Square link, email, or text in one tap.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Link href="/admin/rx-ledger" className="text-xs text-[#FFB8DC] hover:text-white">
            Payment ledger →
          </Link>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white">
            ← Admin
          </Link>
        </div>
      </div>

      {paidBanner ? (
        <div className="mb-4 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          Client returned from Square checkout — payment may be complete. Confirm in Square dashboard.
        </div>
      ) : null}

      {recentSends.length > 0 ? (
        <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-3">
            Recent sends
          </h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {recentSends.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-2 text-xs border-b border-white/5 pb-2 last:border-0"
              >
                <span className="text-gray-300 truncate">
                  {row.client_name || "Client"} · {row.template_name || "Invoice"} · $
                  {Number(row.amount_usd).toFixed(0)}
                </span>
                <span
                  className={`shrink-0 uppercase font-bold ${
                    row.payment_status === "paid" ? "text-green-400" : "text-amber-300"
                  }`}
                >
                  {row.payment_status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {favoriteTemplates.length > 0 ? (
        <section className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-2">
            Pinned favorites
          </h2>
          <div className="flex flex-wrap gap-2">
            {favoriteTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickTemplate(t)}
                className="rounded-full border-2 border-[#E6007E]/50 bg-[#E6007E]/10 px-3 py-1.5 text-xs font-bold hover:border-[#E6007E]"
              >
                ★ {t.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates…"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6007E]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TRACKS.map((t) => {
          const count =
            t.id === "all"
              ? templates.length
              : tracks.find((x) => x.id === t.id)?.count ?? 0;
          const active = trackFilter === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrackFilter(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 transition ${
                active
                  ? "border-[#E6007E] bg-[#E6007E]/20 text-[#FFB8DC]"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {t.label}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {loadingTemplates ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading templates…</p>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No templates match.</p>
      ) : (
        <div className="space-y-6 mb-8">
          {grouped.map(([group, items]) => (
            <section key={group}>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-2">
                {group}
              </h2>
              <div className="grid gap-2">
                {items.map((t) => {
                  const active = selected?.id === t.id;
                  const price =
                    t.amountUsd > 0
                      ? formatUsd(t.amountUsd)
                      : t.allowCustomAmount
                        ? "Custom"
                        : "—";
                  return (
                    <div
                      key={t.id}
                      className={`relative w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                        active
                          ? "border-[#E6007E] bg-[#E6007E]/15 shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                          : "border-gray-800 bg-gray-900 hover:border-gray-600"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => pickTemplate(t)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm pr-8">{t.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{t.lineLabel}</p>
                            {t.note ? (
                              <p className="text-[11px] text-gray-500 mt-1">{t.note}</p>
                            ) : null}
                          </div>
                          <span className="shrink-0 text-sm font-black text-[#FF2D8E]">{price}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(t.id)}
                        className={`absolute top-3 right-12 text-sm ${
                          favoriteIds.includes(t.id) ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"
                        }`}
                        aria-label={favoriteIds.includes(t.id) ? "Unpin template" : "Pin template"}
                      >
                        {favoriteIds.includes(t.id) ? "★" : "☆"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {selected ? (
        <div className="rounded-2xl border-4 border-black bg-gray-900 p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#FFB8DC]">Send invoice</p>
              <h3 className="font-black text-lg">{selected.name}</h3>
              <p className="text-sm text-gray-400">
                {resolvedAmount != null ? formatUsd(resolvedAmount) : "Enter amount below"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setResult(null);
              }}
              className="text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="relative mb-3">
            <input
              ref={clientSearchRef}
              type="text"
              value={clientQuery}
              onChange={(e) => setClientQuery(e.target.value)}
              placeholder="Search client (optional)…"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2.5 text-sm focus:outline-none focus:border-[#E6007E]"
            />
            {searchingClients ? (
              <span className="absolute right-3 top-2.5 text-xs text-gray-500">…</span>
            ) : null}
            {clients.length > 0 ? (
              <div className="absolute z-20 w-full mt-1 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-xl">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickClient(c)}
                    className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-700 border-b border-gray-700/50 last:border-0"
                  >
                    <span className="font-semibold">
                      {c.first_name} {c.last_name}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {[c.phone, c.email].filter(Boolean).join(" · ") || "No contact on file"}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 mb-3">
            <label className="block">
              <span className="text-xs text-gray-400">Client name</span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-[#E6007E]"
              />
            </label>
            {selected.allowCustomAmount ? (
              <label className="block">
                <span className="text-xs text-gray-400">Amount (USD)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={selected.amountUsd > 0 ? String(selected.amountUsd) : "0.00"}
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-[#E6007E]"
                />
              </label>
            ) : null}
            <label className="block">
              <span className="text-xs text-gray-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-[#E6007E]"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-[#E6007E]"
              />
            </label>
          </div>

          <label className="block mb-3">
            <span className="text-xs text-gray-400">Note to client (optional)</span>
            <textarea
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-[#E6007E] resize-none"
            />
          </label>

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
                    value={id}
                    checked={delivery === id}
                    onChange={() => setDelivery(id)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={sending}
            onClick={sendInvoice}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-3.5 text-sm font-black uppercase tracking-wide disabled:opacity-50"
          >
            {sending ? "Creating link…" : `Send ${resolvedAmount != null ? formatUsd(resolvedAmount) : "invoice"}`}
          </button>

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
                  <p className="font-bold mb-2">Payment link ready</p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-[#FFB8DC] underline"
                  >
                    {result.url}
                  </a>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"
                    >
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                  {result.notify?.email ? (
                    <p className="mt-2 text-xs">
                      Email: {result.notify.email.ok ? "sent ✓" : result.notify.email.error}
                    </p>
                  ) : null}
                  {result.notify?.sms ? (
                    <p className="text-xs">
                      Text: {result.notify.sms.ok ? "sent ✓" : result.notify.sms.error}
                    </p>
                  ) : null}
                </>
              ) : (
                <p>{result.error || "Something went wrong"}</p>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 py-4">
          Tap a template above to send a payment link.
        </p>
      )}
    </div>
  );
}
