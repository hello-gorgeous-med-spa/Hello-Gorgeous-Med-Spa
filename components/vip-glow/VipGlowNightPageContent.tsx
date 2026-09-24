"use client";

import { Cormorant_Garamond, Inter } from "next/font/google";
import Image from "next/image";
import { useMemo, useState } from "react";

import { SITE } from "@/lib/seo";
import {
  countIvBags,
  EMPTY_VIP_GLOW_DETAILS,
  formatGlowGoals,
  smsInviteHref,
  VIP_GLOW_BROW_STYLES,
  VIP_GLOW_EXPECT,
  VIP_GLOW_FILLER_AREAS,
  VIP_GLOW_FLYER,
  VIP_GLOW_IV_BLENDS,
  VIP_GLOW_SHORT_URL,
  VIP_GLOW_SLOTS,
  VIP_GLOW_SMS_TEXT,
  VIP_GLOW_TREATMENTS,
  VIP_GLOW_VITAMINS,
  type VipGlowDetails,
  type VipGlowTreatmentId,
} from "@/lib/vip-glow-night";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

const serif = cormorant.className;
const sans = inter.className;

type RsvpRow = {
  id: string;
  time: string;
  clientName: string;
  clientTreatments: string[];
  clientDetails: VipGlowDetails;
  guestName?: string;
  guestTreatments?: string[];
  guestDetails?: VipGlowDetails;
};

function toggleId(list: VipGlowTreatmentId[], id: VipGlowTreatmentId): VipGlowTreatmentId[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function DetailFields({
  selected,
  details,
  onChange,
  guest,
}: {
  selected: VipGlowTreatmentId[];
  details: VipGlowDetails;
  onChange: (next: VipGlowDetails) => void;
  guest?: boolean;
}) {
  const selectCls =
    "mt-1 w-full rounded-lg border border-white/15 bg-[#0d0c0d] px-3 py-2 text-[13px] text-white outline-none focus:border-[#e9aab0]";
  const labelCls = "font-inter text-[10px] uppercase tracking-widest text-[#e9aab0]";
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {selected.includes("botox") && (
        <label className="block">
          <span className={labelCls}>Units</span>
          <input
            value={details.botoxUnits}
            onChange={(e) => onChange({ ...details, botoxUnits: e.target.value })}
            type="text"
            inputMode="numeric"
            placeholder={guest ? "Units e.g. 20" : "e.g. 20"}
            className={selectCls}
          />
        </label>
      )}
      {selected.includes("iv") && (
        <label className="block">
          <span className={labelCls}>IV Blend</span>
          <select
            value={details.ivChoice}
            onChange={(e) => onChange({ ...details, ivChoice: e.target.value })}
            className={selectCls}
          >
            <option value="">{guest ? "IV Blend..." : "Choose..."}</option>
            {VIP_GLOW_IV_BLENDS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected.includes("vitamin") && (
        <label className="block">
          <span className={labelCls}>Vitamin</span>
          <select
            value={details.vitaminChoice}
            onChange={(e) => onChange({ ...details, vitaminChoice: e.target.value })}
            className={selectCls}
          >
            <option value="">{guest ? "Vitamin..." : "Choose..."}</option>
            {VIP_GLOW_VITAMINS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected.includes("filler") && (
        <label className="block">
          <span className={labelCls}>Area</span>
          <select
            value={details.fillerArea}
            onChange={(e) => onChange({ ...details, fillerArea: e.target.value })}
            className={selectCls}
          >
            <option value="">{guest ? "Area..." : "Choose..."}</option>
            {VIP_GLOW_FILLER_AREAS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected.includes("microblading") && (
        <label className="block">
          <span className={labelCls}>Brow Style</span>
          <select
            value={details.browStyle}
            onChange={(e) => onChange({ ...details, browStyle: e.target.value })}
            className={selectCls}
          >
            <option value="">{guest ? "Brow style..." : "Choose..."}</option>
            {VIP_GLOW_BROW_STYLES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

function TreatmentGrid({
  selected,
  onToggle,
  compact,
}: {
  selected: VipGlowTreatmentId[];
  onToggle: (id: VipGlowTreatmentId) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}>
      {VIP_GLOW_TREATMENTS.map((t) => {
        const on = selected.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            className={`group rounded-[16px] border p-[1px] text-left transition ${
              on ? "border-[#e9aab0] bg-[#e9aab0]/20" : "border-white/10 bg-white/5"
            }`}
          >
            <div className={`rounded-[15px] p-4 h-full ${on ? "bg-[#1a1214] text-white" : "bg-[#131213] text-white"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className={`${serif} text-[18px] leading-none font-semibold ${on ? "text-[#e9aab0]" : ""}`}>
                  {t.name}
                </p>
                {t.badge ? (
                  <span className={`${sans} rounded-full bg-[#e9aab0] px-2 py-0.5 text-[9px] font-medium tracking-widest text-black`}>
                    {t.badge}
                  </span>
                ) : null}
              </div>
              <p className={`${sans} text-[11px] mt-1 ${on ? "text-white/70" : "text-white/45"}`}>{t.blurb}</p>
              <p className={`${sans} text-[13px] font-semibold mt-3 ${on ? "text-[#e9aab0]" : ""}`}>{t.price}</p>
              {t.sub ? (
                <p className={`${sans} text-[9px] tracking-wide uppercase mt-1 ${on ? "text-[#e9aab0]" : "text-white/40"}`}>
                  {t.sub}
                </p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function VipGlowNightPageContent() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [treatments, setTreatments] = useState<VipGlowTreatmentId[]>([]);
  const [details, setDetails] = useState<VipGlowDetails>({ ...EMPTY_VIP_GLOW_DETAILS });
  const [bringingGuest, setBringingGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestTreatments, setGuestTreatments] = useState<VipGlowTreatmentId[]>([]);
  const [guestDetails, setGuestDetails] = useState<VipGlowDetails>({ ...EMPTY_VIP_GLOW_DETAILS });
  const [openExpect, setOpenExpect] = useState<string | null>("solaria");
  const [shareOpen, setShareOpen] = useState(true);
  const [copied, setCopied] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<RsvpRow | null>(null);
  const [staffPin, setStaffPin] = useState("");
  const [staffRows, setStaffRows] = useState<
    Array<{
      id: string;
      time: string;
      clientName: string;
      clientWants: string;
      guestName: string;
      guestWants: string;
      ivBags: number;
    }>
  >([]);
  const [staffErr, setStaffErr] = useState("");

  const confirmWants = useMemo(
    () => (confirmed ? formatGlowGoals(confirmed.clientTreatments, confirmed.clientDetails) : ""),
    [confirmed],
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(VIP_GLOW_SHORT_URL);
      setCopied("Link copied");
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("Copy failed");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !time || treatments.length === 0) {
      setError("Add your name, time slot, and at least one glow goal.");
      return;
    }
    if (bringingGuest && (!guestName.trim() || !guestPhone.trim())) {
      setError("Add guest name & phone or set guest to No.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vip-glow/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          timeSlot: time,
          treatments,
          details,
          bringingGuest,
          guestName,
          guestPhone,
          guestEmail,
          guestTreatments,
          guestDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not save RSVP.");
        return;
      }
      setConfirmed({
        id: data.rsvp?.id ?? "ok",
        time,
        clientName: name,
        clientTreatments: treatments,
        clientDetails: details,
        guestName: bringingGuest ? guestName : undefined,
        guestTreatments: bringingGuest ? guestTreatments : undefined,
        guestDetails: bringingGuest ? guestDetails : undefined,
      });
    } catch {
      setError("Could not save RSVP. Call 630-636-6193.");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadStaff() {
    setStaffErr("");
    const res = await fetch("/api/vip-glow/rsvp", {
      headers: { "x-staff-pin": staffPin },
    });
    const data = await res.json();
    if (!res.ok) {
      setStaffErr(data.error || "Staff PIN required.");
      return;
    }
    setStaffRows(data.entries ?? []);
  }

  function downloadCsv() {
    const rows = [
      ["Time", "Client", "ClientWants", "Guest", "GuestWants", "IV Bags"],
      ...staffRows.map((r) => [r.time, r.clientName, r.clientWants, r.guestName || "", r.guestWants, String(r.ivBags)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vip-glow-allocation.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyTable() {
    const lines = [
      ["Time", "Client", "ClientWants", "Guest", "GuestWants", "IV Bags"].join("\t"),
      ...staffRows.map((r) => [r.time, r.clientName, r.clientWants, r.guestName || "", r.guestWants, r.ivBags].join("\t")),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopied("Copied for Sheets!");
      setTimeout(() => setCopied(""), 2500);
    } catch {
      setCopied("Copy failed");
    }
  }

  return (
    <div className={`${sans} min-h-screen bg-[#080608] text-white selection:bg-[#e9aab0]/40`}>
      <style>{`
        .quilt {
          background-color: #ffeef2;
          background-image:
            linear-gradient(45deg, #ffd9df 1px, transparent 1px),
            linear-gradient(-45deg, #ffd9df 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .quilt-soft {
          background-color: #fff5f6;
          background-image: radial-gradient(#e9aab0 0.6px, transparent 0.8px);
          background-size: 18px 18px;
        }
      `}</style>

      <div className="w-full bg-black">
        <div className="relative mx-auto max-w-[1280px]">
          <Image
            src={VIP_GLOW_FLYER}
            alt="VIP Glow Night flyer — Hello Gorgeous Med Spa, Oswego"
            width={1080}
            height={1920}
            priority
            className="mx-auto h-auto max-h-[88vh] w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080608] via-transparent to-transparent md:hidden" />
        </div>
      </div>

      <div className="border-y border-[#e9aab0]/20 bg-[#0d0b0c]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:py-10">
          <div>
            <p className={`${sans} text-[10px] uppercase tracking-[0.35em] text-[#e9aab0]`}>
              Hello Gorgeous Medical Spa presents
            </p>
            <h1 className={`${serif} mt-2 text-[44px] font-semibold leading-[0.9] tracking-[0.02em] md:text-[68px]`}>
              VIP GLOW NIGHT
            </h1>
            <p className={`${sans} mt-3 max-w-xl text-[13px] leading-relaxed text-white/60 md:text-[14px]`}>
              An intimate evening of rose-gold touch-ups, blush-lounge IVs & brow artistry. Limited appointments.
              Complimentary bubbly + afterglow kit.
            </p>
          </div>
          {shareOpen ? (
            <div className="flex flex-col gap-3 md:min-w-[360px]">
              <div className="flex items-center justify-between rounded-[14px] border border-[#e9aab0]/30 bg-[#121011] p-4">
                <div>
                  <p className={`${sans} text-[10px] uppercase tracking-widest text-white/40`}>Shareable Invite Link</p>
                  <p className={`${sans} mt-1 text-[13px] text-[#e9aab0]`}>{VIP_GLOW_SHORT_URL.replace("https://", "")}</p>
                  <p className={`${sans} mt-1 text-[11px] text-white/40`}>Works from iMessage → Text or Copy</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className={`${sans} text-[10px] uppercase tracking-widest text-white/40`}
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={smsInviteHref()}
                  className={`${sans} rounded-full bg-[#e9aab0] px-4 py-3 text-center text-[12px] font-medium tracking-wide text-black`}
                >
                  Text This Invite
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className={`${sans} rounded-full border border-[#e9aab0]/40 px-4 py-3 text-[12px] tracking-wide text-[#e9aab0]`}
                >
                  {copied === "Link copied" ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className={`${sans} rounded-full border border-[#e9aab0]/40 px-5 py-3 text-[12px] tracking-wide text-[#e9aab0]`}
            >
              Share invite
            </button>
          )}
        </div>
      </div>

      {confirmed ? (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="quilt rounded-[24px] p-8 text-[#1a1214]">
            <p className={`${sans} text-[10px] uppercase tracking-widest text-black/50`}>
              Allocation · {confirmed.time}
            </p>
            <h2 className={`${serif} mt-2 text-[32px]`}>You&apos;re in, {confirmed.clientName.split(" ")[0]}</h2>
            <p className={`${sans} mt-2 text-[14px] text-black/70`}>{confirmWants}</p>
            {confirmed.guestName ? (
              <p className={`${sans} mt-2 text-[14px] text-black/60`}>
                {confirmed.guestName} — {formatGlowGoals(confirmed.guestTreatments ?? [], confirmed.guestDetails)}
              </p>
            ) : null}
            <p className={`${sans} mt-4 text-[13px] text-black/55`}>
              IV bags to make:{" "}
              <strong>{countIvBags(confirmed.clientTreatments, confirmed.guestTreatments)}</strong>
            </p>
            <p className={`${sans} mt-6 text-[12px] text-black/50`}>
              We&apos;ll text you if we need to confirm. Arrive 15 minutes early for numbing.{" "}
              {SITE.phone}
            </p>
          </div>
        </section>
      ) : (
        <form onSubmit={submit} className="mx-auto max-w-6xl space-y-10 px-6 py-10 md:py-14">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`${serif} text-[18px] text-[#e9aab0]`}>01</span>
                <h2 className={`${serif} text-[26px]`}>Your Details</h2>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name *"
                className="rounded-xl border border-white/10 bg-[#121011] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone *"
                type="tel"
                className="rounded-xl border border-white/10 bg-[#121011] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for aftercare"
                type="email"
                className="rounded-xl border border-white/10 bg-[#121011] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
              />
            </div>
            <p className={`${sans} mt-5 text-[10px] uppercase tracking-widest text-white/40`}>Select Time Slot</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {VIP_GLOW_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`rounded-full border px-3 py-2.5 text-[12px] tracking-wide transition ${
                    time === slot
                      ? "border-[#e9aab0] bg-[#e9aab0] text-black"
                      : "border-white/10 bg-[#0d0c0d] text-white/70 hover:border-[#e9aab0]/40 hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-3">
              <span className={`${serif} text-[18px] text-[#e9aab0]`}>02</span>
              <h2 className={`${serif} text-[26px]`}>Your Glow Goals</h2>
              <span className={`${sans} rounded-full border border-[#e9aab0]/20 bg-[#e9aab0]/15 px-3 py-1 text-[10px] uppercase tracking-widest text-[#e9aab0]`}>
                Multi-select
              </span>
            </div>
            <p className={`${sans} mb-4 text-[13px] text-white/50`}>Tap treatments from the flyer. Details appear when selected.</p>
            <TreatmentGrid selected={treatments} onToggle={(id) => setTreatments((cur) => toggleId(cur, id))} />
            <DetailFields selected={treatments} details={details} onChange={setDetails} />
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className={`${serif} text-[18px] text-[#e9aab0]`}>03</span>
              <h2 className={`${serif} text-[26px]`}>Bring a Bestie?</h2>
            </div>
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setBringingGuest(false)}
                className={`rounded-full border px-4 py-2 text-[12px] ${
                  !bringingGuest ? "border-[#e9aab0] bg-[#e9aab0] text-black" : "border-white/15 text-white/70"
                }`}
              >
                No, just me
              </button>
              <button
                type="button"
                onClick={() => setBringingGuest(true)}
                className={`rounded-full border px-4 py-2 text-[12px] ${
                  bringingGuest ? "border-[#e9aab0] bg-[#e9aab0] text-black" : "border-white/15 text-white/70"
                }`}
              >
                Yes + guest
              </button>
            </div>
            {bringingGuest ? (
              <div className="rounded-[20px] border border-[#e9aab0]/20 bg-[#121011] p-5">
                <p className={`${serif} text-[22px]`}>Her Glow Goals</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Guest Name *"
                    className="rounded-xl border border-white/10 bg-[#0d0c0d] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
                  />
                  <input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Guest Phone *"
                    type="tel"
                    className="rounded-xl border border-white/10 bg-[#0d0c0d] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
                  />
                  <input
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Guest Email"
                    type="email"
                    className="rounded-xl border border-white/10 bg-[#0d0c0d] px-4 py-3 text-[14px] outline-none focus:border-[#e9aab0]"
                  />
                </div>
                <div className="mt-5">
                  <TreatmentGrid
                    compact
                    selected={guestTreatments}
                    onToggle={(id) => setGuestTreatments((cur) => toggleId(cur, id))}
                  />
                  <DetailFields guest selected={guestTreatments} details={guestDetails} onChange={setGuestDetails} />
                </div>
              </div>
            ) : null}
          </section>

          {error ? <p className={`${sans} text-[13px] text-[#e9aab0]`}>{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className={`${sans} w-full rounded-full bg-[#e9aab0] py-4 text-[14px] font-medium tracking-wide text-black disabled:opacity-60 md:w-auto md:px-10`}
          >
            {submitting ? "Saving…" : "Confirm VIP Glow RSVP"}
          </button>
        </form>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className={`${serif} text-[32px]`}>What to Expect</h2>
          <span className={`${sans} text-[10px] uppercase tracking-widest text-white/40`}>7 Services</span>
        </div>
        <div className="space-y-2">
          {VIP_GLOW_EXPECT.map((card) => {
            const open = openExpect === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setOpenExpect(open ? null : card.id)}
                className="w-full rounded-[16px] border border-white/10 bg-[#121011] px-5 py-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={`${serif} text-[20px]`}>{card.title}</p>
                  <span className="text-[#e9aab0]">{open ? "–" : "+"}</span>
                </div>
                {open ? (
                  <div className="mt-3 grid gap-3 text-[13px] text-white/65 md:grid-cols-3">
                    <p>
                      <span className="block text-[10px] uppercase tracking-widest text-[#e9aab0]">Numb</span>
                      {card.numb}
                    </p>
                    <p>
                      <span className="block text-[10px] uppercase tracking-widest text-[#e9aab0]">Procedure</span>
                      {card.proc}
                    </p>
                    <p>
                      <span className="block text-[10px] uppercase tracking-widest text-[#e9aab0]">Downtime</span>
                      {card.down}
                    </p>
                    <p className="md:col-span-3 text-white/50">{card.tip}</p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-[20px] border border-white/10 bg-[#0d0c0d] p-5">
          <p className={`${sans} text-[10px] uppercase tracking-widest text-white/40`}>Prep for your glow</p>
          <ul className={`${sans} mt-3 space-y-1 text-[13px] text-white/60`}>
            <li>Arrive makeup-free, hair pulled back</li>
            <li>No retinol / self-tanner 48 hrs before Solaria or Morpheus</li>
            <li>Hydrate — IV lounge is first-come during your slot</li>
            <li>Microblading: no caffeine day-of</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className={`${serif} text-[28px]`}>Tonight&apos;s Allocation</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!staffRows.length}
              className={`${sans} rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-widest text-white/70 disabled:opacity-40`}
            >
              Download CSV
            </button>
            <button
              type="button"
              onClick={copyTable}
              disabled={!staffRows.length}
              className={`${sans} rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-widest text-white/70 disabled:opacity-40`}
            >
              Copy Table for Sheets
            </button>
          </div>
        </div>
        <div className="quilt mt-4 overflow-hidden rounded-[20px] text-[#1a1214]">
          <div className="flex flex-wrap items-end gap-3 border-b border-black/5 p-4">
            <label className="block">
              <span className={`${sans} text-[10px] uppercase tracking-widest text-black/50`}>Staff quick check</span>
              <input
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                type="password"
                inputMode="numeric"
                placeholder="Staff PIN"
                className="mt-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] text-black"
              />
            </label>
            <button
              type="button"
              onClick={loadStaff}
              className={`${sans} rounded-full bg-black px-4 py-2 text-[12px] text-white`}
            >
              Load board
            </button>
            {staffErr ? <p className={`${sans} text-[12px] text-red-700`}>{staffErr}</p> : null}
          </div>
          <div className="overflow-x-auto">
            <table className={`${sans} w-full text-left text-[12px]`}>
              <thead className="text-[10px] uppercase tracking-widest text-black/40">
                <tr>
                  <th className="px-3 py-3">Time</th>
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">ClientWants</th>
                  <th className="px-3 py-3">Guest</th>
                  <th className="px-3 py-3">GuestWants</th>
                  <th className="px-3 py-3">IV Bags</th>
                </tr>
              </thead>
              <tbody>
                {staffRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-black/40">
                      No RSVPs yet — be the first glow. Staff: load the board with your PIN.
                    </td>
                  </tr>
                ) : (
                  staffRows.map((r) => (
                    <tr key={r.id} className="border-t border-black/5">
                      <td className="px-3 py-2.5 text-[#9a5b63]">{r.time}</td>
                      <td className="px-3 py-2.5">{r.clientName}</td>
                      <td className="max-w-[160px] truncate px-3 py-2.5 text-black/60">{r.clientWants}</td>
                      <td className="px-3 py-2.5">{r.guestName || "—"}</td>
                      <td className="max-w-[140px] truncate px-3 py-2.5 text-black/50">{r.guestWants || "—"}</td>
                      <td className="px-3 py-2.5">{r.ivBags}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {staffRows.length > 0 ? (
            <div className="quilt-soft grid grid-cols-3 gap-2 border-t border-black/5 p-4 text-[11px] text-black/70">
              <div>
                Total RSVPs: <span className="font-semibold text-black">{staffRows.length}</span>
              </div>
              <div>
                IV Bags:{" "}
                <span className="font-semibold text-black">{staffRows.reduce((n, r) => n + r.ivBags, 0)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-10">
        <div className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-[#0d0c0d] p-4">
          <div className={`${serif} flex h-8 w-8 items-center justify-center rounded-full bg-[#e9aab0] font-bold text-black`}>
            !
          </div>
          <p className={`${sans} text-[11px] leading-relaxed text-white/60`}>
            VIP pricing valid night-of only. Solaria & Morpheus limited to 12 spots. Microblading includes 6-week
            perfection touch-up. Vitamin $15 add-on limit 2 per guest.{" "}
            <span className="text-[#e9aab0]">Please arrive 15 min early for numbing.</span>
          </p>
        </div>
      </div>

      <footer className="mt-6 border-t border-white/10 py-8 text-center">
        <p className={`${serif} text-[18px] uppercase tracking-[0.2em]`}>Hello Gorgeous Medical Spa</p>
        <p className={`${sans} mt-2 text-[11px] uppercase tracking-widest text-white/30`}>
          VIP Glow Night · hellogorgeousmedspa.com/vip-glow · Private Event
        </p>
        <p className={`${sans} mt-3 text-[12px] text-white/40`}>
          {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} · {SITE.phone}
        </p>
        <p className="sr-only">{VIP_GLOW_SMS_TEXT}</p>
      </footer>
    </div>
  );
}
