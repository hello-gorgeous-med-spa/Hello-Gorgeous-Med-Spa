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

const COVER_KEY = "hg_kiosk_cover";

export default function KioskHubPage() {
  const [covered, setCovered] = useState(false);
  const [forms, setForms] = useState<CatalogItem[]>([]);
  const [coreIds, setCoreIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [needName, setNeedName] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCovered(sessionStorage.getItem(COVER_KEY) === "1");
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

  function coverDesk() {
    sessionStorage.setItem(COVER_KEY, "1");
    setCovered(true);
  }

  function showDesk() {
    sessionStorage.removeItem(COVER_KEY);
    setCovered(false);
    setErr(null);
  }

  async function startVisit() {
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const res = await fetch("/api/kiosk/start-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          formIds: [...selected],
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 404 && /first and last name/i.test(String(data.error || ""))) {
        setNeedName(true);
        setErr(data.error);
        return;
      }
      if (!res.ok || !(data.path || data.url)) {
        setErr(data.error || "Could not start consents.");
        return;
      }
      if (Array.isArray(data.skipped_already_signed) && data.skipped_already_signed.length) {
        setNote(`Already on file: ${data.skipped_already_signed.join(", ")}`);
      }
      window.location.assign(data.path || data.url);
    } catch {
      setErr("Network error. Check Wi-Fi and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (covered) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <p className="text-[#FF1493] text-xs tracking-[0.2em] uppercase mb-3">Hello Gorgeous Med Spa</p>
          <h1 className="font-serif text-3xl font-light mb-2">Consent iPad</h1>
          <p className="text-white/60 text-sm mb-8">Hand this back to the desk when you are done signing.</p>
          <button
            type="button"
            onClick={showDesk}
            className="w-full rounded-lg bg-[#FF1493] text-white py-3 font-medium"
          >
            Open desk
          </button>
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
              This iPad assigns forms — not Hub. Signed copies land on the client chart.
            </p>
          </div>
          <button type="button" onClick={coverDesk} className="text-xs text-white/40 underline shrink-0 mt-2">
            Cover
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
