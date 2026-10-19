"use client";

import { Cinzel, Great_Vibes } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { HelcimPayCheckout } from "@/components/golden-ticket/HelcimPayCheckout";
import {
  GOLDEN_TICKET_ALACARTE,
  GOLDEN_TICKET_CONTACT,
  GOLDEN_TICKET_EVENT,
  GOLDEN_TICKET_FACE_SQUARE,
  GOLDEN_TICKET_FAQS,
  GOLDEN_TICKET_IMAGES,
  GOLDEN_TICKET_PACKAGES,
  GOLDEN_TICKET_TERMS,
  GOLDEN_TICKET_VIP_INCLUDES,
  type GoldenTicketPackage,
  type GoldenTicketPackageId,
} from "@/lib/campaigns/golden-ticket-2026";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const display = cinzel.className;
const night = script.className;
const GOLD = "#C4A35A";
const MAGENTA = "#C2185B";
const PINK = "#E91E8C";
const INK = "#1C120C";
const CREAM = "#F7EDE3";

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function Heart() {
  return (
    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill={MAGENTA}>
        <path d="M8 14s-5.2-3.2-6.6-6.1C.3 5.7 1.6 3.2 4 3.2c1.4 0 2.3.8 4 2.5 1.7-1.7 2.6-2.5 4-2.5 2.4 0 3.7 2.5 2.6 4.7C13.2 10.8 8 14 8 14z" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span
      className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
      style={{ background: GOLD }}
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
        <path d="M2.4 6.2 4.7 8.6 9.6 3.4" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function TicketCard({
  pkg,
  photo,
  photoAlt,
  onRequest,
  helcimEnabled,
}: {
  pkg: GoldenTicketPackage;
  photo: string;
  photoAlt: string;
  onRequest: (id: GoldenTicketPackageId) => void;
  helcimEnabled: boolean;
}) {
  const payUrl = pkg.id === "face" ? GOLDEN_TICKET_FACE_SQUARE.paymentLinkUrl : null;
  const canPay = pkg.checkoutEnabled && Boolean(payUrl);
  const ctaLabel =
    !canPay && helcimEnabled ? `Invoice & set up ${pkg.shortName}` : pkg.ctaLabel;

  return (
    <article
      id={pkg.id}
      className="flex h-full flex-col overflow-hidden rounded-[18px] border-2 bg-black text-white"
      style={{ borderColor: GOLD }}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image src={photo} alt={photoAlt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <h3
          className={`${display} text-center text-[20px] font-semibold leading-[1.1] tracking-[0.06em] md:text-[22px]`}
          style={{ color: GOLD }}
        >
          {pkg.cardTitle}
        </h3>
        <p className={`${display} mt-1 text-center text-[30px] font-semibold`} style={{ color: GOLD }}>
          {money(pkg.ticketPriceUsd)}
        </p>
        {pkg.founderPriceUsd ? (
          <p
            className="mx-auto mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white"
            style={{ background: PINK }}
          >
            First 5: {money(pkg.founderPriceUsd)}
          </p>
        ) : null}
        <ul className="mt-4 space-y-2 text-[13px] leading-snug text-white/90">
          {pkg.inclusions.map((item) => (
            <li key={item.label} className="flex gap-2">
              <Check />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        {pkg.containsMedication ? (
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">
            Clinical review required. A payment is not a prescription.
          </p>
        ) : (
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">Consult required. Results vary.</p>
        )}
        <div className="mt-auto pt-4">
          {canPay ? (
            <a
              href={payUrl!}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
              style={{ background: MAGENTA }}
            >
              {ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onRequest(pkg.id)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
              style={{ background: MAGENTA }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function GoldenTicketPageContent({ helcimEnabled = false }: { helcimEnabled?: boolean }) {
  const [openId, setOpenId] = useState<GoldenTicketPackageId>("body");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const selected = useMemo(
    () => GOLDEN_TICKET_PACKAGES.find((p) => p.id === openId) ?? GOLDEN_TICKET_PACKAGES[0],
    [openId],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/golden-ticket/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes, packageId: openId, invoice: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("err");
        setError(data.error || "Could not send. Call (630) 636-6193.");
        return;
      }
      setPayUrl(typeof data.payUrl === "string" && data.payUrl ? data.payUrl : null);
      setCheckoutToken(typeof data.checkoutToken === "string" && data.checkoutToken ? data.checkoutToken : null);
      setInvoiceNumber(
        typeof data.invoiceNumber === "string" && data.invoiceNumber ? data.invoiceNumber : null,
      );
      setStatus("ok");
    } catch {
      setStatus("err");
      setError("Could not send. Call (630) 636-6193.");
    }
  }

  function requestPackage(id: GoldenTicketPackageId) {
    setOpenId(id);
    setTimeout(() => document.getElementById("request")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="min-h-screen bg-[#090706] py-6 text-stone-900 md:py-10">
      <article
        className="relative mx-auto max-w-[920px] overflow-hidden rounded-[28px] border-2 px-5 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-10 md:px-14 md:py-14"
        style={{ background: CREAM, borderColor: GOLD, color: INK }}
      >
        <p className={`${display} text-center text-[12px] tracking-[0.42em] md:text-[13px]`}>
          Hello Gorgeous Med Spa
        </p>
        <p className={`${display} mt-2 text-center text-[11px] tracking-[0.34em]`} style={{ color: GOLD }}>
          {GOLDEN_TICKET_EVENT.kicker}
        </p>
        <p className={`${display} mt-6 text-center text-[28px] font-semibold tracking-[0.28em] md:text-[36px]`}>VIP</p>
        <h1
          className={`${display} text-center text-[40px] font-bold leading-[0.9] tracking-[-0.02em] md:text-[58px] lg:text-[64px]`}
        >
          GOLDEN
          <span className="block">TICKET</span>
        </h1>
        <p className={`${night} -mt-1 text-center text-[52px] leading-none md:text-[64px]`} style={{ color: MAGENTA }}>
          Night
        </p>

        <div className="mx-auto mt-8 grid max-w-[640px] gap-4 border-y py-5 text-center sm:grid-cols-2" style={{ borderColor: "rgba(196,163,90,0.45)" }}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">
            {GOLDEN_TICKET_EVENT.dateLabel}
            <span className="mt-1 block text-[12px] font-medium normal-case tracking-normal text-stone-600">
              {GOLDEN_TICKET_EVENT.timeLabel}
            </span>
          </p>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">
            74 W Washington St
            <span className="mt-1 block text-[12px] font-medium normal-case tracking-normal text-stone-600">
              Oswego, IL
            </span>
          </p>
        </div>

        <p className={`${night} mx-auto mt-6 max-w-[560px] text-center text-[28px] leading-snug text-stone-700 md:text-[32px]`}>
          {GOLDEN_TICKET_EVENT.intro}
        </p>

        <h2
          className={`${display} mt-10 text-center text-[18px] font-semibold tracking-[0.12em] md:text-[22px]`}
          style={{ color: MAGENTA }}
        >
          Your Golden Ticket includes
        </h2>
        <ul className="mx-auto mt-5 max-w-[560px] space-y-3 text-[15px] leading-snug">
          {GOLDEN_TICKET_VIP_INCLUDES.map((item) => (
            <li key={item} className="flex gap-3">
              <Heart />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2
          id="collections"
          className={`${display} mt-12 text-center text-[18px] font-semibold tracking-[0.1em] md:text-[22px]`}
          style={{ color: MAGENTA }}
        >
          {GOLDEN_TICKET_EVENT.collectionsTitle}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {GOLDEN_TICKET_PACKAGES.map((pkg) => (
            <TicketCard
              key={pkg.id}
              pkg={pkg}
              photo={GOLDEN_TICKET_IMAGES[pkg.id]}
              photoAlt={
                pkg.id === "body"
                  ? GOLDEN_TICKET_IMAGES.bodyAlt
                  : pkg.id === "face"
                    ? GOLDEN_TICKET_IMAGES.faceAlt
                    : GOLDEN_TICKET_IMAGES.wellnessAlt
              }
              onRequest={requestPackage}
              helcimEnabled={helcimEnabled}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className={`${display} text-[15px] tracking-[0.2em]`}>{GOLDEN_TICKET_EVENT.reserveLabel}</p>
          <a
            href={GOLDEN_TICKET_CONTACT.textSms}
            className="mt-2 inline-block text-[28px] font-bold tracking-wide md:text-[34px]"
            style={{ color: MAGENTA }}
          >
            Text {GOLDEN_TICKET_CONTACT.textDisplay}
          </a>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#request"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
              style={{ background: MAGENTA }}
            >
              Request a collection
            </a>
            <a
              href={GOLDEN_TICKET_CONTACT.phoneTel}
              className="inline-flex min-h-11 items-center justify-center rounded-full border px-7 text-[11px] uppercase tracking-[0.16em]"
              style={{ borderColor: GOLD, color: INK }}
            >
              {GOLDEN_TICKET_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <p className={`${display} mt-10 text-center text-[11px] tracking-[0.18em] text-stone-500`}>
          {GOLDEN_TICKET_EVENT.collectionsSub}
        </p>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-stone-500">
          {GOLDEN_TICKET_EVENT.flyerDisclaimer}
        </p>
      </article>

      <section className="mx-auto mt-10 max-w-[920px] px-5 md:px-0">
        <p className={`${display} text-center text-[11px] tracking-[0.32em]`} style={{ color: GOLD }}>
          The invitation
        </p>
        <figure className="mx-auto mt-4 max-w-[560px] overflow-hidden rounded-[24px] border-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]" style={{ borderColor: GOLD }}>
          <Image
            src={GOLDEN_TICKET_IMAGES.invite}
            alt={GOLDEN_TICKET_EVENT.title}
            width={682}
            height={1024}
            className="h-auto w-full"
            priority
          />
        </figure>
        <p className="mt-4 text-center">
          <a
            href={GOLDEN_TICKET_IMAGES.flyer}
            download
            className="text-[11px] uppercase tracking-[0.18em] underline"
            style={{ color: GOLD }}
          >
            Save the invitation
          </a>
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-[920px] px-5 text-white md:px-0">
        <p className={`${display} text-center text-[11px] tracking-[0.32em]`} style={{ color: GOLD }}>
          Evening menu
        </p>
        <h2 className={`${display} mt-2 text-center text-2xl`}>À la carte, this Friday</h2>
        <ul className="mx-auto mt-6 max-w-[640px]">
          {GOLDEN_TICKET_ALACARTE.map((item) => (
            <li
              key={item.name}
              className="flex items-baseline justify-between gap-4 border-b py-3 text-sm"
              style={{ borderColor: "rgba(196,163,90,0.25)" }}
            >
              <span>
                {item.name}
                {item.note ? <span className="mt-1 block text-[11px] text-white/40">{item.note}</span> : null}
              </span>
              <span className={`${display}`} style={{ color: GOLD }}>
                {item.price}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="request" className="mx-auto mt-14 max-w-[920px] px-5 pb-8 text-white md:px-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className={`${display} text-[11px] tracking-[0.32em]`} style={{ color: GOLD }}>
              Request
            </p>
            <h2 className={`${display} mt-3 text-3xl`}>{selected.flyerName}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {money(selected.ticketPriceUsd)} ticket.
              {helcimEnabled
                ? " Name, phone, and email open a Helcim invoice. Pay in full or enter a deposit to set up the balance."
                : " Name and phone start the request."}{" "}
              A licensed clinician reviews candidacy before any medication-related item is offered.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {GOLDEN_TICKET_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setOpenId(pkg.id)}
                  className="min-h-10 rounded-full border px-4 text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    borderColor: openId === pkg.id ? MAGENTA : "rgba(196,163,90,0.45)",
                    background: openId === pkg.id ? MAGENTA : "transparent",
                    color: "#fff",
                  }}
                >
                  {pkg.shortName}
                </button>
              ))}
            </div>
          </div>
          {status === "ok" ? (
            <div className="rounded-2xl border px-6 py-8 text-sm leading-relaxed" style={{ borderColor: GOLD }}>
              {paid ? (
                <p>Payment received. We will confirm next steps and book your consult.</p>
              ) : (
                <p>
                  Request received
                  {invoiceNumber ? ` · invoice ${invoiceNumber}` : ""}.{" "}
                  {payUrl || checkoutToken
                    ? "Pay in full, or enter a deposit on the invoice to set up the remaining balance."
                    : "Book a consult next, or wait for a call from the studio."}
                </p>
              )}
              {selected.containsMedication ? (
                <p className="mt-3 text-white/55">A payment is not a prescription. Clinical review still applies.</p>
              ) : null}
              <div className="mt-5 flex flex-col gap-3">
                {payUrl ? (
                  <a
                    href={payUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
                    style={{ background: MAGENTA }}
                  >
                    Pay or set up invoice
                  </a>
                ) : null}
                <Link
                  href={GOLDEN_TICKET_CONTACT.bookHref}
                  className="text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Book a free consult →
                </Link>
              </div>
              {checkoutToken && !paid ? (
                <HelcimPayCheckout checkoutToken={checkoutToken} onPaid={() => setPaid(true)} />
              ) : null}
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-12 rounded-xl border bg-transparent px-3 text-base tracking-normal text-white"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                  autoComplete="name"
                />
              </label>
              <label className="grid gap-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                Phone
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="min-h-12 rounded-xl border bg-transparent px-3 text-base tracking-normal text-white"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                  autoComplete="tel"
                />
              </label>
              <label className="grid gap-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                Email{" "}
                {helcimEnabled ? null : (
                  <span className="normal-case tracking-normal text-white/30">(optional)</span>
                )}
                <input
                  required={helcimEnabled}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 rounded-xl border bg-transparent px-3 text-base tracking-normal text-white"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                Notes <span className="normal-case tracking-normal text-white/30">(optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="rounded-xl border bg-transparent px-3 py-3 text-base tracking-normal text-white"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                />
              </label>
              {error ? <p className="text-sm" style={{ color: PINK }}>{error}</p> : null}
              <button
                type="submit"
                disabled={status === "saving"}
                className="min-h-12 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                style={{ background: MAGENTA }}
              >
                {status === "saving"
                  ? "Sending…"
                  : helcimEnabled
                    ? "Send request & open invoice"
                    : "Send request"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[720px] px-5 py-12 text-white md:px-0">
        <h2 className={`${display} text-2xl`} style={{ color: GOLD }}>
          Questions
        </h2>
        <dl className="mt-8 space-y-7">
          {GOLDEN_TICKET_FAQS.map((faq) => (
            <div key={faq.q}>
              <dt className="text-sm font-medium">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/60">{faq.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-xs leading-relaxed text-white/40">{GOLDEN_TICKET_TERMS.substitutions}</p>
        <p className="mt-4 text-xs text-white/40">
          <Link href={GOLDEN_TICKET_CONTACT.policyHref} className="underline" style={{ color: GOLD }}>
            Package policy
          </Link>
          {" · "}
          <a href={GOLDEN_TICKET_IMAGES.flyer} className="underline" style={{ color: GOLD }}>
            Event flyer
          </a>
          {" · "}
          Text {GOLDEN_TICKET_EVENT.textKeyword} to {GOLDEN_TICKET_CONTACT.textDisplay}
        </p>
      </section>
    </div>
  );
}
