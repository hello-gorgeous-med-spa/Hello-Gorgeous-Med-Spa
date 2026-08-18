"use client";

import { useEffect, useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  isRequired: boolean;
  order: number;
  category: string;
};

const PIN_KEY = "hg_kiosk_staff";

export default function KioskHubPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [forms, setForms] = useState<CatalogItem[]>([]);
  const [coreIds, setCoreIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [needName, setNeedName] = useState(false);
  const [matches, setMatches] = useState<{ id: string; name: string }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(PIN_KEY);
      if (saved) {
        setPin(saved);
        setUnlocked(true);
      }
    }
    fetch("/api/kiosk/forms")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.forms) ? (data.forms as CatalogItem[]) : [];
        const cores = Array.isArray(data.coreIds) ? (data.coreIds as string[]) : [];
        setForms(list);
        setCoreIds(cores);
        setSelected(new Set(cores));
      })
      .catch(() => setErr("Could not load the consent list."));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogItem[]>();
    for (const f of forms) {
      const arr = map.get(f.category) || [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return [...map.entries()];
  }, [forms]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function lock() {
    sessionStorage.removeItem(PIN_KEY);
    setUnlocked(false);
    setPin("");
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    sessionStorage.setItem(PIN_KEY, pin.trim());
    setUnlocked(true);
  }

  async function startVisit(clientId?: string) {
    setBusy(true);
    setErr(null);
    setNote(null);
    setMatches(null);
    try {
      const res = await fetch("/api/kiosk/start-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          phone: phone.trim(),
          formIds: [...selected],
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          clientId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setErr("Wrong staff PIN. Unlock again.");
        lock();
        return;
      }
      if (res.status === 404 && /first and last name/i.test(String(data.error || ""))) {
        setNeedName(true);
        setErr(data.error);
        return;
      }
      if (res.status === 409 && Array.isArray(data.matches)) {
        setMatches(data.matches);
        setErr(data.error);
        return;
      }
      if (!res.ok || !data.url) {
        setErr(data.error || "Could not start consents.");
        return;
      }
      if (Array.isArray(data.skipped_already_signed) && data.skipped_already_signed.length) {
        setNote(`Already on file: ${data.skipped_already_signed.join(", ")}`);
      }
      window.location.href = data.url;
    } catch {
      setErr("Network error. Check Wi-Fi and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <p className="text-[#FF1493] text-xs tracking-[0.2em] uppercase mb-3">Hello Gorgeous Med Spa</p>
          <h1 className="font-serif text-3xl font-light mb-2">Consent iPad</h1>
          <p className="text-white/60 text-sm mb-8">Staff unlock — then pick the forms for this client.</p>
          <form onSubmit={unlock} className="space-y-4 text-left">
            <label className="block text-xs uppercase tracking-wider text-white/50">Staff PIN</label>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Desk PIN"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#FF1493]"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-[#FF1493] text-white py-3 font-medium"
            >
              Unlock desk
            </button>
          </form>
          {err && <p className="mt-6 text-sm text-red-300">{err}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[#FF1493] text-xs tracking-[0.2em] uppercase mb-1">Hello Gorgeous · iPad hub</p>
            <h1 className="font-serif text-3xl font-light">Assign consents</h1>
            <p className="text-white/55 text-sm mt-2">
              Pick the forms for this visit, enter their cell, then hand them the iPad to sign.
            </p>
            <p className="text-white/40 text-xs mt-2">
              Library lives at Admin → Founder Control → Consents &amp; Legal. This iPad assigns them — not Hub.
            </p>
          </div>
          <button type="button" onClick={lock} className="text-xs text-white/40 underline shrink-0 mt-2">
            Lock
          </button>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 mb-6 space-y-3">
          <label className="block text-xs uppercase tracking-wider text-white/50">Mobile on file</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setNeedName(false);
              setMatches(null);
            }}
            placeholder="(630) 555-0199"
            className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#FF1493]"
          />
          {needName && (
            <div className="grid grid-cols-2 gap-3">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#FF1493]"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#FF1493]"
              />
            </div>
          )}
          {matches && matches.length > 0 && (
            <div className="space-y-2">
              {matches.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => startVisit(m.id)}
                  className="w-full text-left rounded-lg border border-white/20 px-4 py-3 hover:border-[#FF1493]"
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSelected(new Set(coreIds))}
            className="text-xs rounded-full border border-white/20 px-3 py-1.5 text-white/70"
          >
            Core packet only
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set(forms.map((f) => f.id)))}
            className="text-xs rounded-full border border-white/20 px-3 py-1.5 text-white/70"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-xs rounded-full border border-white/20 px-3 py-1.5 text-white/70"
          >
            Clear
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-[#FF1493] text-xs font-bold uppercase tracking-wider mb-2">{cat}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {items.map((f) => {
                  const on = selected.has(f.id);
                  return (
                    <label
                      key={f.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer ${
                        on ? "border-[#FF1493] bg-[#FF1493]/15" : "border-white/15 bg-white/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(f.id)}
                        className="mt-1 accent-[#FF1493]"
                      />
                      <span>
                        <span className="block font-medium text-sm">{f.shortName}</span>
                        <span className="block text-xs text-white/50">{f.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {err && <p className="mb-4 text-sm text-red-300">{err}</p>}
        {note && <p className="mb-4 text-sm text-emerald-300">{note}</p>}

        <button
          type="button"
          disabled={busy || !phone.trim() || selected.size === 0}
          onClick={() => startVisit()}
          className="w-full rounded-xl bg-[#FF1493] text-white py-4 font-semibold disabled:opacity-40"
        >
          {busy ? "Starting…" : `Hand iPad to client · ${selected.size} form${selected.size === 1 ? "" : "s"}`}
        </button>
        <p className="mt-3 text-center text-xs text-white/35">
          Signing stays on this iPad. Forms save to the Hello Gorgeous chart — not Hub.
        </p>
      </div>
    </div>
  );
}
