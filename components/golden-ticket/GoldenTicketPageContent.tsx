"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  GOLDEN_TICKET_CONTACT,
  GOLDEN_TICKET_FACE_SQUARE,
  GOLDEN_TICKET_FAQS,
  GOLDEN_TICKET_PACKAGES,
  GOLDEN_TICKET_TERMS,
  type GoldenTicketPackage,
  type GoldenTicketPackageId,
} from "@/lib/campaigns/golden-ticket-2026";

const GOLD = "#D4AF37";
const PINK = "#FF4FA0";

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function TicketCard({
  pkg,
  onRequest,
}: {
  pkg: GoldenTicketPackage;
  onRequest: (id: GoldenTicketPackageId) => void;
}) {
  const payUrl = pkg.id === "face" ? GOLDEN_TICKET_FACE_SQUARE.paymentLinkUrl : null;
  const canPay = pkg.checkoutEnabled && Boolean(payUrl);

  return (
    <article
      id={pkg.id}
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-black text-white shadow-[0_20px_60px_rgba(212,175,55,0.15)]"
      style={{ borderColor: GOLD }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-5 py-3"
        style={{ borderColor: `${GOLD}66`, background: "linear-gradient(90deg,#1a1408,#000)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: GOLD }}>
          Golden Ticket
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">{pkg.shortName}</p>
      </div>
      <div className="flex flex-1 flex-col px-6 py-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl leading-tight">{pkg.flyerName}</h2>
        <p className="mt-4 font-[family-name:var(--font-playfair)] text-4xl" style={{ color: GOLD }}>
          {money(pkg.ticketPriceUsd)}
        </p>
        <p className="mt-1 text-sm text-white/70">
          Advertised collection value {money(pkg.advertisedValueUsd)}
        </p>
        <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-white/90">
          {pkg.inclusions.map((item) => (
            <li key={item.label} className="flex gap-2">
              <span style={{ color: PINK }} aria-hidden>
                ✦
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        {pkg.containsMedication ? (
          <p className="mt-5 text-xs leading-relaxed text-white/60">
            Includes medication-related items. Request a consult — online payment is not offered for this
            collection until clinical and payment-policy approval.
          </p>
        ) : (
          <p className="mt-5 text-xs leading-relaxed text-white/60">
            40 units of neurotoxin are listed separately from Morpheus8 add-ons. Consult required. Results
            vary.
          </p>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-6">
          {canPay ? (
            <a
              href={payUrl!}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-black"
              style={{ background: GOLD }}
            >
              {pkg.ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onRequest(pkg.id)}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-black"
              style={{ background: pkg.containsMedication ? PINK : GOLD }}
            >
              {pkg.ctaLabel}
            </button>
          )}
          <Link
            href={GOLDEN_TICKET_CONTACT.bookHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm text-white/90"
            style={{ borderColor: `${GOLD}99` }}
          >
            Book a free consult
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GoldenTicketPageContent() {
  const [openId, setOpenId] = useState<GoldenTicketPackageId | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const selected = useMemo(
    () => GOLDEN_TICKET_PACKAGES.find((p) => p.id === openId) ?? null,
    [openId],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!openId) return;
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/golden-ticket/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes, packageId: openId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("err");
        setError(data.error || "Could not send. Call (630) 636-6193.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("err");
      setError("Could not send. Call (630) 636-6193.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 pb-12 pt-16 lg:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 0%, rgba(255,79,160,0.25), transparent 40%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.2), transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            Hello Gorgeous Med Spa · Oswego, IL
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl leading-tight sm:text-6xl">
            Golden Ticket
          </h1>
          <p className="mt-2 font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl" style={{ color: PINK }}>
            Mommy Makeover Collection
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
            Three VIP collections at published Golden Ticket prices. Physician-directed care under{" "}
            {GOLDEN_TICKET_TERMS.physician}. Results vary. Consultation required.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-3">
          {GOLDEN_TICKET_PACKAGES.map((pkg) => (
            <TicketCard
              key={pkg.id}
              pkg={pkg}
              onRequest={(id) => {
                setOpenId(id);
                setTimeout(() => document.getElementById("request")?.scrollIntoView({ behavior: "smooth" }), 50);
              }}
            />
          ))}
        </div>
      </section>

      {selected ? (
        <section id="request" className="border-t px-6 py-14" style={{ borderColor: `${GOLD}33` }}>
          <div className="mx-auto max-w-xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Request {selected.flyerName}</h2>
            <p className="mt-2 text-sm text-white/70">
              {money(selected.ticketPriceUsd)} Golden Ticket price. We only need a name and phone — a
              licensed clinician reviews candidacy before any medication is offered.
            </p>
            {status === "ok" ? (
              <p className="mt-6 rounded-xl border px-4 py-4 text-sm" style={{ borderColor: GOLD }}>
                Request received. Book your consult next, or wait for a call from the studio.
                <Link href={GOLDEN_TICKET_CONTACT.bookHref} className="mt-3 block font-semibold" style={{ color: GOLD }}>
                  Book a free consult →
                </Link>
              </p>
            ) : (
              <form onSubmit={submit} className="mt-6 grid gap-4">
                <label className="grid gap-1 text-sm">
                  Name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="min-h-11 rounded-lg border bg-black px-3 text-white"
                    style={{ borderColor: `${GOLD}66` }}
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Phone
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="min-h-11 rounded-lg border bg-black px-3 text-white"
                    style={{ borderColor: `${GOLD}66` }}
                    autoComplete="tel"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Email <span className="text-white/40">(optional)</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-11 rounded-lg border bg-black px-3 text-white"
                    style={{ borderColor: `${GOLD}66` }}
                    autoComplete="email"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Anything we should know <span className="text-white/40">(optional)</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="rounded-lg border bg-black px-3 py-2 text-white"
                    style={{ borderColor: `${GOLD}66` }}
                  />
                </label>
                {error ? <p className="text-sm text-pink-300">{error}</p> : null}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="min-h-12 rounded-full font-semibold text-black"
                  style={{ background: GOLD }}
                >
                  {status === "saving" ? "Sending…" : "Send request"}
                </button>
              </form>
            )}
          </div>
        </section>
      ) : null}

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[800px]">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl" style={{ color: GOLD }}>
            Terms
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
            <li>{GOLDEN_TICKET_TERMS.substitutions}</li>
            <li>
              Valid {GOLDEN_TICKET_TERMS.expirationMonths} months from purchase. Complete series work within{" "}
              {GOLDEN_TICKET_TERMS.scheduleWindowMonths} months when possible.
            </li>
            <li>{GOLDEN_TICKET_TERMS.refunds}</li>
            <li>{GOLDEN_TICKET_TERMS.transfer}</li>
            <li>
              <Link href={GOLDEN_TICKET_CONTACT.policyHref} className="underline" style={{ color: GOLD }}>
                Full package policy
              </Link>
              {" · "}
              <Link href={GOLDEN_TICKET_CONTACT.financingHref} className="underline" style={{ color: GOLD }}>
                Financing
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t px-6 py-16" style={{ borderColor: `${GOLD}33` }}>
        <div className="mx-auto max-w-[800px]">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Questions</h2>
          <dl className="mt-8 space-y-6">
            {GOLDEN_TICKET_FAQS.map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold" style={{ color: GOLD }}>
                  {faq.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/80">{faq.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-sm text-white/60">
            74 W. Washington St, Oswego IL ·{" "}
            <a href={GOLDEN_TICKET_CONTACT.phoneTel} style={{ color: PINK }}>
              {GOLDEN_TICKET_CONTACT.phoneDisplay}
            </a>
            {" · "}
            <a href="/flyers/golden-ticket.html" style={{ color: GOLD }}>
              Print flyer
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
