"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CLIENT_APP_PROMO_EVENT,
  CLIENT_APP_PROMO_STORAGE_KEY,
} from "@/lib/client-app-promo-codes";

export function readStoredAppPromoCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CLIENT_APP_PROMO_STORAGE_KEY);
}

export function writeStoredAppPromoCode(code: string | null) {
  if (typeof window === "undefined") return;
  if (code) localStorage.setItem(CLIENT_APP_PROMO_STORAGE_KEY, code);
  else localStorage.removeItem(CLIENT_APP_PROMO_STORAGE_KEY);
  window.dispatchEvent(new Event(CLIENT_APP_PROMO_EVENT));
}

export function useAppPromoCode() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    setCode(readStoredAppPromoCode());
    const sync = () => setCode(readStoredAppPromoCode());
    window.addEventListener(CLIENT_APP_PROMO_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CLIENT_APP_PROMO_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return code;
}

type PromoCardProps = {
  /** Default subtotal for validation preview (e.g. 100 for Bestie minimum). */
  previewSubtotalUsd?: number;
  compact?: boolean;
};

export function ClientAppPromoCodeCard({
  previewSubtotalUsd = 100,
  compact = false,
}: PromoCardProps) {
  const applied = useAppPromoCode();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ discountUsd: number; finalUsd: number } | null>(
    null,
  );

  useEffect(() => {
    if (!applied) {
      setPreview(null);
      return;
    }
    void fetch("/api/client-app/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: applied, subtotalUsd: previewSubtotalUsd }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPreview({ discountUsd: d.discountUsd, finalUsd: d.finalUsd });
      })
      .catch(() => setPreview(null));
  }, [applied, previewSubtotalUsd]);

  const apply = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/client-app/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input, subtotalUsd: previewSubtotalUsd }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Invalid code");
        return;
      }
      writeStoredAppPromoCode(data.code);
      setInput("");
      setPreview({ discountUsd: data.discountUsd, finalUsd: data.finalUsd });
    } catch {
      setErr("Could not validate code. Try again.");
    } finally {
      setBusy(false);
    }
  }, [input, previewSubtotalUsd]);

  const remove = useCallback(() => {
    writeStoredAppPromoCode(null);
    setPreview(null);
    setErr(null);
  }, []);

  if (applied && preview) {
    return (
      <div
        className={`rounded-2xl border ${compact ? "p-3 mb-3" : "p-4 mb-5"}`}
        style={{
          borderColor: "rgba(251,191,36,0.45)",
          background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(230,0,126,0.08))",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
              Promo applied
            </p>
            <p className="font-mono font-black text-white text-lg">{applied}</p>
            <p className="text-xs text-amber-100/80 mt-0.5">
              Up to ${preview.discountUsd.toFixed(0)} off at checkout (min $100 order)
            </p>
          </div>
          <button
            type="button"
            onClick={remove}
            className="text-xs font-semibold text-white/50 hover:text-white shrink-0"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${compact ? "p-3 mb-3" : "p-4 mb-5"}`}
      style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
    >
      {!compact && (
        <>
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-300 mb-1">
            Have a promo code?
          </p>
          <p className="text-xs text-white/45 mb-3">
            Try <span className="font-mono font-bold text-amber-200">BESTIE100</span> — $100 off
            orders $100+
          </p>
        </>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="BESTIE100"
          className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/30"
          autoCapitalize="characters"
          autoCorrect="off"
        />
        <button
          type="button"
          disabled={busy || !input.trim()}
          onClick={() => void apply()}
          className="rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(90deg, #f59e0b, #E6007E)" }}
        >
          {busy ? "…" : "Apply"}
        </button>
      </div>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
    </div>
  );
}
