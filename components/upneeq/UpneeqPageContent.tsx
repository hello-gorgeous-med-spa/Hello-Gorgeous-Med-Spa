"use client";

import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  UPNEEQ_AFTER,
  UPNEEQ_BEFORE,
  UPNEEQ_BENEFITS,
  UPNEEQ_FAQ,
  UPNEEQ_FOR,
  UPNEEQ_PHONE,
  UPNEEQ_PHONE_HREF,
  UPNEEQ_PI_URL,
  UPNEEQ_PINK,
  UPNEEQ_RESULTS,
  UPNEEQ_SAFETY,
  UPNEEQ_SIMULATOR_URL,
  UPNEEQ_STATS,
  UPNEEQ_TEAL,
  UPNEEQ_WAITLIST_PERKS,
} from "@/lib/upneeq-marketing";

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export type UpneeqBrand = "hg" | "regen";

export function UpneeqPageContent({ brand }: { brand: UpneeqBrand }) {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !email.trim() || !consent) {
      setError("Add your name, phone, email, and check the consult box.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/upneeq-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, brand, consent: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Could not join. Call 630-636-6193.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not join. Call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`${instrument.className} min-h-screen bg-white text-zinc-900 antialiased`}>
      {brand === "regen" ? <RegenPublicNav /> : null}

      <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 py-[9px] px-4 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] text-white" style={{ background: UPNEEQ_TEAL }}>
        <Link href="/" className="opacity-90 hover:opacity-100">
          {brand === "regen" ? "REGEN RX" : "Hello Gorgeous"}
        </Link>
        <span>Coming Soon to Oswego, IL · Licensed Illinois clinician</span>
      </div>

      <section className="relative mx-auto max-w-[1280px] overflow-hidden px-6 py-14 sm:px-8 sm:py-20">
        <p className="inline-flex rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
          COMING SOON
        </p>
        <h1 className={`${bodoni.className} mt-5 text-[42px] font-bold leading-[0.95] tracking-tight sm:text-[64px]`}>
          Lift Your Eyes.
          <br />
          No Surgery Needed.
        </h1>
        <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-zinc-600">
          Upneeq® is the only FDA-approved prescription eye drop for acquired ptosis (low-lying lids) — coming soon to
          Hello Gorgeous Med Spa in Oswego. Many people notice a lifted-lid look within minutes. Results vary. Real
          before/afters below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#waitlist" className="rounded-full px-6 py-[11px] text-[13px] font-semibold text-white" style={{ background: UPNEEQ_PINK }}>
            Join Waitlist
          </a>
          <a href={UPNEEQ_PHONE_HREF} className="rounded-full border border-zinc-200 px-6 py-[11px] text-[13px] font-semibold text-zinc-700">
            {UPNEEQ_PHONE}
          </a>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-[#FBF9F7]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 sm:px-8 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
            <span className="h-2 w-2 rounded-full" style={{ background: UPNEEQ_PINK }} />
            Real Patient Results
          </p>
          <h2 className={`${bodoni.className} mt-4 text-[30px] font-bold leading-[0.95] sm:text-[42px]`}>
            See the lift.
            <br />
            No filter. No surgery.
          </h2>
          <p className="mt-3 max-w-[520px] text-[14px] leading-[1.6] text-zinc-600">
            Actual Upneeq® before &amp; after photos from the official site. Swipe on mobile. Results vary — consultation
            required at Hello Gorgeous Med Spa.
          </p>

          <div className="mt-8 flex gap-4 overflow-x-auto pb-6 sm:gap-5">
            {UPNEEQ_RESULTS.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setSlide(i)}
                className={`w-[85vw] shrink-0 overflow-hidden rounded-[28px] border bg-white text-left sm:w-[420px] ${
                  slide === i ? "border-zinc-900 shadow-[0_16px_40px_rgba(0,0,0,0.10)]" : "border-zinc-100"
                }`}
              >
                <div className="relative aspect-[1.45/1] overflow-hidden bg-[#F6F2EE]">
                  <Image src={item.src} alt={item.alt} fill className="object-cover object-top" sizes="420px" />
                  <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white" style={{ background: UPNEEQ_BEFORE }}>
                    BEFORE
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white" style={{ background: UPNEEQ_AFTER }}>
                    AFTER UPNEEQ®
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <p className="text-[13px] font-semibold leading-tight">{item.note}</p>
                  <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400">REAL RESULT</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {UPNEEQ_STATS.map((stat) => (
              <div key={stat.n} className="flex gap-3 rounded-2xl border border-zinc-100 bg-white p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: stat.n === "3" ? UPNEEQ_PINK : UPNEEQ_TEAL }}>
                  {stat.n}
                </span>
                <p className="text-[13px] leading-[1.4]">
                  <span className="font-bold">{stat.title}</span>
                  <br />
                  <span className="text-zinc-600">{stat.body}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-zinc-100">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${UPNEEQ_TEAL}14, ${UPNEEQ_PINK}14)` }} />
        <div className="relative mx-auto grid max-w-[1280px] items-start gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              Official Upneeq Tool
            </p>
            <h2 className={`${bodoni.className} mt-5 text-[32px] font-bold leading-[0.95] sm:text-[44px]`}>
              Preview your lift in 30 seconds
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-zinc-600">
              Try the official Upneeq virtual simulator. Upload a selfie or use the demo to preview how a subtle eyelid
              lift opens your eyes. No surgery, no commitment — a sneak peek before your Hello Gorgeous consult.
            </p>
            <a
              href={UPNEEQ_SIMULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-zinc-900 px-5 py-3 text-[13px] font-bold text-white"
            >
              Open Simulator →
            </a>
            <p className="mt-3 text-[12px] text-zinc-500">Official simulator hosted by Upneeq. If the embed is blocked, use the button.</p>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <iframe
              title="Upneeq Virtual Drop Simulator"
              src={UPNEEQ_SIMULATOR_URL}
              className="h-[420px] w-full"
              loading="lazy"
              allow="camera; clipboard-write"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-14 sm:px-8 sm:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">What is Upneeq®?</p>
        <h2 className={`${bodoni.className} mt-3 text-[32px] font-bold leading-[0.95] sm:text-[44px]`}>
          The first &amp; only Rx drop for droopy eyelids.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-zinc-600">
          Upneeq (oxymetazoline hydrochloride ophthalmic solution 0.1%) lifts the upper eyelid quickly — no surgery, no
          downtime. Often discussed when clients look tired even when they are not. Results vary.
        </p>
        <div className="mt-8 rounded-[20px] border border-zinc-100 bg-[#FBF9F7] p-6">
          <p className="text-[12px] font-bold uppercase tracking-widest">Clinical note</p>
          <p className="mt-2 text-[14px] leading-[1.65] text-zinc-600">
            Upneeq contains oxymetazoline 0.1%, an alpha-adrenergic agonist that stimulates Müller’s muscle. When Müller’s
            contracts, it helps the levator muscle lift the eyelid. No cutting, no stitches. FDA approved July 2020 · Rx
            only.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {UPNEEQ_FOR.map((item) => (
            <div key={item.title} className="rounded-[16px] border border-zinc-100 bg-white p-5">
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: UPNEEQ_PINK }}>
                  ✓
                </span>
                {item.title}
              </p>
              <p className="mt-2 text-[13px] leading-[1.5] text-zinc-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[24px] border border-zinc-100 bg-white p-6 sm:p-7">
          <h3 className="text-[16px] font-bold">Benefits at a glance</h3>
          <ul className="mt-5 space-y-3">
            {UPNEEQ_BENEFITS.map((line) => (
              <li key={line} className="flex gap-3 text-[13.5px] leading-[1.5] text-zinc-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] text-white" style={{ background: UPNEEQ_TEAL }}>
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-900 p-4 text-white">
            <div>
              <p className="text-[12px] font-bold">Coming soon in Oswego</p>
              <p className="mt-0.5 text-[11px] text-white/60">Hello Gorgeous Med Spa · IL licensed</p>
            </div>
            <p className="text-[20px] font-bold" style={{ color: UPNEEQ_PINK }}>
              ®
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
        <p className="text-center text-[11px] font-bold uppercase tracking-widest">FAQ · Safety · Pricing</p>
        <h2 className={`${bodoni.className} mt-4 text-center text-[32px] font-bold`}>What clients ask us.</h2>
        <div className="mt-8 space-y-2">
          {UPNEEQ_FAQ.map((item, i) => (
            <div key={item.question} className="rounded-2xl border border-zinc-100 bg-white">
              <button type="button" className="flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-semibold" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {item.question}
                <span className="text-zinc-400">{openFaq === i ? "–" : "+"}</span>
              </button>
              {openFaq === i ? <p className="px-5 pb-4 text-[14px] leading-[1.65] text-zinc-600">{item.answer}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="waitlist" className="border-t border-zinc-100 bg-[#F8F6F3]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest">Join the list</p>
            <h2 className={`${bodoni.className} mt-3 text-[32px] font-bold leading-[0.95] sm:text-[44px]`}>
              Be first in Oswego to try Upneeq®
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-zinc-600">
              Limited first shipment. Waitlist gets priority consults, intro pricing when we launch, and a ptosis
              screening at Hello Gorgeous Med Spa.
            </p>
            <ul className="mt-6 space-y-2 text-[14px] text-zinc-700">
              {UPNEEQ_WAITLIST_PERKS.map((line) => (
                <li key={line}>● {line}</li>
              ))}
            </ul>
            <Link href={PRIMARY_BOOKING_CTA.href} className="mt-6 inline-block text-[13px] font-semibold underline">
              {PRIMARY_BOOKING_CTA.label}
            </Link>
          </div>

          <div className="rounded-[24px] border border-zinc-100 bg-white p-6 sm:p-8">
            {done ? (
              <div>
                <p className="text-[18px] font-bold">You’re on the list, gorgeous.</p>
                <p className="mt-2 text-[14px] leading-[1.6] text-zinc-600">
                  We saved your spot for our first Upneeq shipment. We’ll text you for priority booking — usually within
                  1–2 weeks of launch.
                </p>
                <a href={UPNEEQ_PHONE_HREF} className="mt-6 inline-block rounded-full bg-zinc-900 px-5 py-3 text-[13px] font-bold text-white">
                  Call {UPNEEQ_PHONE}
                </a>
              </div>
            ) : (
              <form onSubmit={(e) => void submit(e)} className="space-y-4">
                <p className="text-[14px] font-bold">Notify me first</p>
                <p className="text-[12px] text-zinc-500">Coming soon to Oswego, IL</p>
                <label className="block text-[12px] font-semibold">
                  Full Name
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-[14px] font-normal" required />
                </label>
                <label className="block text-[12px] font-semibold">
                  Phone
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-[14px] font-normal" required />
                </label>
                <label className="block text-[12px] font-semibold">
                  Email
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-[14px] font-normal" required />
                </label>
                <label className="flex gap-2 text-[12px] leading-[1.5] text-zinc-600">
                  <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setError(""); }} className="mt-0.5" />
                  I understand Upneeq is a prescription medication and requires a consultation with a licensed Illinois
                  clinician. I’m not using it for congenital ptosis and will discuss my medical history.
                </label>
                {error ? <p className="text-[13px] text-pink-600">{error}</p> : null}
                <button type="submit" disabled={busy} className="w-full rounded-full py-3 text-[13px] font-bold text-white disabled:opacity-50" style={{ background: UPNEEQ_PINK }}>
                  {busy ? "Saving…" : "Notify Me First — Join Waitlist"}
                </button>
                <p className="text-[11px] text-zinc-500">By joining, you agree to be contacted about Upneeq availability. Reply STOP to opt out of texts.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-10 sm:grid-cols-[1.2fr_1.8fr] sm:px-8">
          <div>
            <p className="text-[14px] font-bold">
              <span style={{ color: UPNEEQ_TEAL }}>Hello Gorgeous</span> Med Spa
            </p>
            <p className="mt-2 text-[13px] leading-[1.6] text-zinc-600">
              Oswego, IL · Licensed Illinois clinician
              <br />
              {UPNEEQ_PHONE} · tryregenrx.com
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">FDA Approved July 2020</span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Rx Only</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={UPNEEQ_SIMULATOR_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-bold text-white">
                Virtual Simulator ↗
              </a>
              <a href={UPNEEQ_PHONE_HREF} className="rounded-full border border-zinc-200 px-4 py-2 text-[11px] font-bold">
                {UPNEEQ_PHONE}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-[11px] leading-[1.6] text-zinc-500 sm:p-5">
            <span className="font-bold text-zinc-700">Important Safety Information – Brief Summary (Coming Soon): </span>
            {UPNEEQ_SAFETY}{" "}
            <a href={UPNEEQ_PI_URL} className="underline" target="_blank" rel="noopener noreferrer">
              Upneeq.com
            </a>
            . Images © Upneeq / RVL Pharmaceuticals. Upneeq® is a registered trademark of RVL Pharmaceuticals.
            <br />
            <br />© {new Date().getFullYear()} Hello Gorgeous Med Spa — tryregenrx.com — Upneeq coming soon to Oswego, IL.
          </div>
        </div>
      </footer>
    </div>
  );
}
