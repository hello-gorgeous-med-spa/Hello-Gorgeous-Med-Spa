"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  formatKioskPrice,
  KIOSK_SHIP_USD,
  resolveKioskRequestItems,
} from "@/lib/regen/kiosk-request";

export function KioskRequestForm() {
  const params = useSearchParams();
  const items = useMemo(
    () => resolveKioskRequestItems(params.get("items")),
    [params],
  );
  const subtotal = items.reduce((sum, item) => sum + item.priceUsd, 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [note, setNote] = useState("");
  const [illinois, setIllinois] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!illinois) {
      setError("This clinic prescribes for Illinois residents.");
      return;
    }
    if (!consent) {
      setError("Please confirm this is a request, not a prescription.");
      return;
    }
    if (!items.length && !note.trim()) {
      setError("Tell us what you pointed at on the menu.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/regen/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          dateOfBirth: dob,
          state: "IL",
          goal: "peptide-bar",
          hipaaConsent: true,
          telehealthConsent: true,
          treatmentConsent: true,
          medicalHistory: {
            source: "peptide-bar-kiosk",
            kioskItemIds: items.map((item) => item.id),
            note: note.trim(),
          },
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "The request did not send. Ask the front desk.");
        return;
      }
      setSent(true);
    } catch {
      setError("The request did not send. Ask the front desk.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-[#f4efe6] px-5 py-10 text-[#1a1614]">
        <div className="mx-auto max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e23d86]">
            Hello Gorgeous
          </p>
          <h1 className="mt-3 font-serif text-4xl">Request sent.</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[#5c554e]">
            The clinic has what you picked. a licensed Illinois clinician reviews it before any invoice.
            A request is not a prescription.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] px-5 py-8 text-[#1a1614]">
      <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-5">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e23d86]">
            Peptide Bar
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-none">Your request.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5c554e]">
            Compounded medications are not FDA-approved. A clinician reviews this before anything is dispensed.
          </p>
        </header>

        {items.length ? (
          <section className="rounded-2xl bg-white/70 p-4">
            <ul className="grid gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[16px]">{item.name}</span>
                    <span className="block text-[13px] text-[#6e675f]">{item.spec}</span>
                  </span>
                  <span className="text-[16px]">{formatKioskPrice(item.priceUsd)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-black/10 pt-3 text-[14px] text-[#5c554e]">
              Items {formatKioskPrice(subtotal)}. Cold ship ${KIOSK_SHIP_USD} once, not inside the item price.
              Semaglutide and tirzepatide show the starting vial. The clinician sets the weekly dose.
            </p>
          </section>
        ) : (
          <label className="grid gap-2 text-[14px]">
            What did you point at?
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="rounded-2xl border border-black/10 bg-white px-3 py-3 text-[16px]"
              placeholder="Name the items from the menu"
            />
          </label>
        )}

        {items.length ? (
          <label className="grid gap-2 text-[14px]">
            Anything else for the clinician
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              className="rounded-2xl border border-black/10 bg-white px-3 py-3 text-[16px]"
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-[14px]">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="h-12 rounded-2xl border border-black/10 bg-white px-3 text-[16px]"
          />
        </label>
        <label className="grid gap-2 text-[14px]">
          Phone
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            className="h-12 rounded-2xl border border-black/10 bg-white px-3 text-[16px]"
          />
        </label>
        <label className="grid gap-2 text-[14px]">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="h-12 rounded-2xl border border-black/10 bg-white px-3 text-[16px]"
          />
        </label>
        <label className="grid gap-2 text-[14px]">
          Date of birth
          <input
            required
            type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            className="h-12 rounded-2xl border border-black/10 bg-white px-3 text-[16px]"
          />
        </label>
        <label className="flex gap-3 text-[14px] leading-snug">
          <input
            type="checkbox"
            checked={illinois}
            onChange={(event) => setIllinois(event.target.checked)}
            className="mt-1"
          />
          I live in Illinois.
        </label>
        <label className="flex gap-3 text-[14px] leading-snug">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1"
          />
          This is a request for a licensed Illinois clinician to review. It is not a prescription, and no payment is taken here.
        </label>
        {error ? <p className="text-[14px] text-[#9b1c4a]">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-full bg-[#e23d86] text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send this request"}
        </button>
      </form>
    </main>
  );
}
