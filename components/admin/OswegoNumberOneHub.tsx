"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  GBP_SETUP_CHECKLIST,
  NUMBER_ONE_PILLARS,
  OSWEGO_RX_GOAL_LABEL,
  OSWEGO_RX_GOAL_USD,
  OSWEGO_KEYWORD_WATCHLIST,
  WEEKLY_SOCIAL_BLAST,
} from "@/lib/oswego-dominance-playbook";
import { OwnedListsPanel } from "@/components/admin/OwnedListsPanel";
import { LapsedReactivationPanel } from "@/components/admin/LapsedReactivationPanel";

type HubData = {
  ok: boolean;
  placesConnected: boolean;
  you: { rating: number | null; reviews: number | null };
  her: { name: string; rating: number | null; reviews: number | null };
  gap: {
    reviewsToPassHer: number | null;
    ratingGap: number | null;
    aheadOnReviews: boolean | null;
    reviewLead: number | null;
  };
  velocity: {
    reviewAsksLast7: number;
    reviewAsksLast30: number;
    reviewTargetPerWeek: number;
    rxIntakesLast7: number;
    rxIntakesLast30: number;
    rxStartsTargetPerWeek: number;
    rxStartsSent7: number;
    rxStartsSent30: number;
    warmNurtureSent7: number;
    peptideGuideLeads30: number;
  };
  rxGoal?: {
    goalUsd: number;
    goalStart: string;
    goalEnd: string;
    goalActive: boolean;
    weeksRemaining: number;
    estimatedRevenueUsd: number;
    progressPercent: number;
    rxStartsGoalPeriod: number;
    startsNeededTotal: number;
    startsRemaining: number;
    weeklyStartsNeeded: number;
    estimatedStartUsd: number;
    onTrackWeeklyStarts: boolean;
  };
  warmLeads: Array<{
    submissionId: string;
    submittedAt: string;
    patientName: string;
    phone: string | null;
    email: string | null;
    track: string;
    status: string;
    action: string;
  }>;
  error?: string;
};

const GBP_STORAGE = "hg-gbp-checklist-v1";

export function OswegoNumberOneHub() {
  const [data, setData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gbpChecked, setGbpChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GBP_STORAGE);
      if (raw) setGbpChecked(JSON.parse(raw));
    } catch {
      setGbpChecked({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GBP_STORAGE, JSON.stringify(gbpChecked));
  }, [gbpChecked]);

  useEffect(() => {
    fetch("/api/admin/local-dominance/oswego-hub")
      .then((r) => r.json())
      .then((d: HubData) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const gbpDone = GBP_SETUP_CHECKLIST.filter((i) => gbpChecked[i.id]).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl border-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black p-6 text-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB8DC]">Oswego, IL · 2026</p>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">
          Be <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">#1</span> in Oswego
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          One weekly command center: beat HER on Google, fill GLP-1 + peptide revenue, and execute faster than every
          rival on Washington Street.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickLink href="/admin/marketing/post-social" label="Post to Social" />
          <QuickLink href="/admin/marketing/social-content-agent" label="Facebook presets" />
          <QuickLink href="/admin/rx-dispatch" label="RX Dispatch" />
          <QuickLink href="/admin/rx-invoices" label="RX Invoices" />
          <QuickLink href="https://business.google.com" label="Google Business" external />
          <QuickLink href="/review" label="Review QR" external />
        </div>
      </section>

      {/* Empire scoreboard — $30k RX goal + weekly velocity */}
      {data?.rxGoal ? (
        <section className="rounded-2xl border-4 border-black bg-gradient-to-br from-[#FFF0F7] to-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-black">Empire scoreboard · RX revenue</h3>
              <p className="mt-1 text-sm text-black/65">
                {OSWEGO_RX_GOAL_LABEL} · est. ${data.rxGoal.estimatedStartUsd}/start
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                data.rxGoal.onTrackWeeklyStarts
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {data.rxGoal.onTrackWeeklyStarts ? "On pace this week ✓" : "Push starts this week ↑"}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-[#E6007E]">
                ${data.rxGoal.estimatedRevenueUsd.toLocaleString()} est.
              </span>
              <span className="text-black/60">${data.rxGoal.goalUsd.toLocaleString()} goal</span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-black bg-white">
              <div
                className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] transition-all"
                style={{ width: `${Math.max(data.rxGoal.progressPercent, 2)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-black/60">
              {data.rxGoal.rxStartsGoalPeriod} pharmacy sends · {data.rxGoal.startsRemaining} starts remaining ·{" "}
              {data.rxGoal.goalActive
                ? `${data.rxGoal.weeksRemaining} weeks left · need ~${data.rxGoal.weeklyStartsNeeded}/wk`
                : `Goal runs ${data.rxGoal.goalStart} → ${data.rxGoal.goalEnd}`}
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <VelocityStat
              label="RX starts sent (7d)"
              value={data.velocity.rxStartsSent7}
              target={data.velocity.rxStartsTargetPerWeek}
            />
            <VelocityStat label="RX starts sent (30d)" value={data.velocity.rxStartsSent30} />
            <VelocityStat label="Auto nurture SMS (7d)" value={data.velocity.warmNurtureSent7} />
            <VelocityStat label="Peptide guide leads (30d)" value={data.velocity.peptideGuideLeads30} />
          </div>
        </section>
      ) : null}

      {/* Pillars */}
      <section className="grid gap-3 md:grid-cols-3">
        {NUMBER_ONE_PILLARS.map((p) => (
          <article key={p.title} className="rounded-2xl border-2 border-black bg-white p-4">
            <h3 className="font-bold text-black">{p.title}</h3>
            <p className="mt-1 text-xs text-black/65">{p.metric}</p>
            <ul className="mt-2 space-y-0.5 text-sm text-black/80">
              {p.actions.map((a) => (
                <li key={a}>▸ {a}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* HER vs You */}
      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <h3 className="text-lg font-black text-black">You vs HER Aesthetics (Oswego rival)</h3>
        <p className="mt-1 text-sm text-black/65">Live Google data · same downtown Washington St corridor</p>
        {loading ? (
          <p className="mt-4 text-sm text-black/50">Loading…</p>
        ) : !data?.placesConnected ? (
          <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Set <code className="text-xs">GOOGLE_PLACES_API_KEY</code> on Vercel to see live HER comparison.
          </p>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ScoreCard
                label="Hello Gorgeous"
                rating={data.you.rating}
                reviews={data.you.reviews}
                highlight
              />
              <ScoreCard label={data.her.name} rating={data.her.rating} reviews={data.her.reviews} />
            </div>
            <div className="mt-4 rounded-xl bg-[#FFF0F7] p-4 text-sm">
              {data.gap.aheadOnReviews ? (
                <p className="font-semibold text-green-800">
                  You&apos;re ahead on review count by {data.gap.reviewLead} — protect the lead with 5 asks/week.
                </p>
              ) : data.gap.reviewsToPassHer != null ? (
                <p className="font-semibold text-[#E6007E]">
                  Need <strong>{data.gap.reviewsToPassHer}</strong> more Google reviews to pass HER on count.
                </p>
              ) : null}
              {data.gap.ratingGap != null && data.gap.ratingGap > 0 ? (
                <p className="mt-1 text-black/75">
                  Star gap: HER is <strong>{data.gap.ratingGap}★</strong> ahead — prioritize happy-client asks (GLP-1
                  wins, natural Botox) and reply to every review within 24h.
                </p>
              ) : null}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <VelocityStat
                label="Review asks (7d)"
                value={data.velocity.reviewAsksLast7}
                target={data.velocity.reviewTargetPerWeek}
              />
              <VelocityStat
                label="RX intakes (7d)"
                value={data.velocity.rxIntakesLast7}
                target={data.velocity.rxStartsTargetPerWeek}
              />
              <VelocityStat label="RX intakes (30d)" value={data.velocity.rxIntakesLast30} />
            </div>
          </>
        )}
      </section>

      {/* Warm leads */}
      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-black text-black">Warm RX leads — act today</h3>
          <Link href="/admin/rx-dispatch" className="text-sm font-semibold text-[#E6007E] hover:underline">
            Open RX Dispatch →
          </Link>
        </div>
        <p className="mt-1 text-sm text-black/65">
          Peptide + GLP-1 intakes not yet sent to pharmacy · auto 24h/72h SMS when{" "}
          <code className="text-xs">WARM_LEAD_NURTURE_ENABLED=true</code> · goal {OSWEGO_RX_GOAL_LABEL}: $
          {OSWEGO_RX_GOAL_USD.toLocaleString()}
        </p>
        {!data?.warmLeads?.length ? (
          <p className="mt-4 text-sm text-black/50">
            No open intakes in the last 30 days — push the GLP-1 screener and peptide request in social posts.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-black/5 text-xs uppercase text-black/60">
                <tr>
                  <th className="p-2">Patient</th>
                  <th className="p-2">Track</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Next step</th>
                </tr>
              </thead>
              <tbody>
                {data.warmLeads.map((lead) => (
                  <WarmLeadRow key={lead.submissionId} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/rx-invoices"
            className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85"
          >
            Send payment link
          </Link>
          <Link
            href="/quiz/glp-1-readiness"
            target="_blank"
            className="rounded-lg border border-black px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          >
            GLP-1 screener
          </Link>
        </div>
      </section>

      <OwnedListsPanel />

      <LapsedReactivationPanel />

      {/* Weekly social */}
      <section className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
        <h3 className="text-lg font-black text-black">Mon / Wed / Fri social blast</h3>
        <p className="mt-1 text-sm text-black/65">Load the Blast presets — Facebook in Social Agent, Google in Post to Social.</p>
        <div className="mt-4 space-y-2">
          {WEEKLY_SOCIAL_BLAST.map((slot) => (
            <div
              key={slot.day}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/15 bg-white p-3"
            >
              <div>
                <p className="text-xs font-bold uppercase text-[#E6007E]">{slot.day}</p>
                <p className="font-semibold text-black">{slot.theme}</p>
                <p className="text-xs text-black/50">
                  FB: {slot.facebookPresetId} · GBP: {slot.googlePresetId}
                </p>
              </div>
              <Link
                href={slot.adminRoute}
                className="rounded-lg bg-[#E6007E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#c9006e]"
              >
                Load preset →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* GBP checklist */}
      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <h3 className="text-lg font-black text-black">GBP setup checklist</h3>
        <p className="mt-1 text-sm text-black/65">
          {gbpDone}/{GBP_SETUP_CHECKLIST.length} done · fixes map-pack visibility for “med spa Oswego”
        </p>
        <div className="mt-3 h-2 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-[#E6007E]"
            style={{ width: `${(gbpDone / GBP_SETUP_CHECKLIST.length) * 100}%` }}
          />
        </div>
        <ul className="mt-4 space-y-2">
          {GBP_SETUP_CHECKLIST.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-xl border border-black/10 p-3">
              <input
                type="checkbox"
                checked={!!gbpChecked[item.id]}
                onChange={() => setGbpChecked((p) => ({ ...p, [item.id]: !p[item.id] }))}
                className="mt-1 h-4 w-4 accent-[#E6007E]"
              />
              <div>
                <p className="font-semibold text-black">{item.label}</p>
                <p className="text-xs text-black/60">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Keyword watch */}
      <section className="rounded-2xl border-2 border-black bg-white p-5">
        <h3 className="font-black text-black">Weekly keyword watch (incognito)</h3>
        <p className="mt-1 text-xs text-black/60">Search these every Monday — track if you&apos;re moving up.</p>
        <ul className="mt-3 space-y-1 text-sm text-black/80">
          {OSWEGO_KEYWORD_WATCHLIST.map((kw) => (
            <li key={kw}>▸ {kw}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20";
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label} ↗
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

function ScoreCard({
  label,
  rating,
  reviews,
  highlight,
}: {
  label: string;
  rating: number | null;
  reviews: number | null;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border-2 p-4 ${highlight ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/15 bg-white"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/60">{label}</p>
      <p className="mt-1 text-3xl font-black text-black">
        {rating ?? "—"}★
        <span className="ml-2 text-lg font-semibold text-black/60">({reviews ?? "—"} reviews)</span>
      </p>
    </article>
  );
}

function VelocityStat({
  label,
  value,
  target,
}: {
  label: string;
  value: number;
  target?: number;
}) {
  const onTrack = target != null ? value >= target : null;
  return (
    <article className="rounded-xl border border-black/15 bg-[#FFF0F7] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-black/55">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#E6007E]">{value}</p>
      {target != null ? (
        <p className={`text-xs ${onTrack ? "text-green-700" : "text-amber-800"}`}>
          Target: {target}/wk {onTrack ? "✓" : "↑ push harder"}
        </p>
      ) : null}
    </article>
  );
}

type WarmLeadRowData = {
  submissionId: string;
  submittedAt: string;
  patientName: string;
  phone: string | null;
  email: string | null;
  track: string;
  status: string;
  action: string;
};

function WarmLeadRow({ lead }: { lead: WarmLeadRowData }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function sendFollowUpSms() {
    if (!lead.phone) {
      setError("No phone on file");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/local-dominance/warm-lead-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: lead.submissionId, phone: lead.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <tr className="border-t border-black/10">
      <td className="p-2">
        <div className="font-medium">{lead.patientName}</div>
        <div className="text-xs text-black/50">
          {lead.phone || lead.email || new Date(lead.submittedAt).toLocaleDateString()}
        </div>
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </td>
      <td className="p-2 capitalize">{lead.track}</td>
      <td className="p-2">
        <span className="rounded-full bg-[#FFF0F7] px-2 py-0.5 text-xs font-semibold text-[#E6007E]">
          {lead.status}
        </span>
      </td>
      <td className="p-2">
        <p className="text-xs text-black/75">{lead.action}</p>
        {lead.phone ? (
          <button
            type="button"
            disabled={sending || sent}
            onClick={() => void sendFollowUpSms()}
            className={`mt-2 rounded-lg px-2 py-1 text-xs font-semibold ${
              sent
                ? "bg-green-600 text-white"
                : "bg-[#E6007E] text-white hover:bg-[#c9006e] disabled:opacity-50"
            }`}
          >
            {sent ? "Text sent ✓" : sending ? "Sending…" : "Text follow-up"}
          </button>
        ) : (
          <span className="mt-2 block text-xs text-black/40">Add phone to text</span>
        )}
      </td>
    </tr>
  );
}
