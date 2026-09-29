"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  REGEN_NOW_LIVE_FB,
  REGEN_NOW_LIVE_FLYER,
  REGEN_NOW_LIVE_GBP,
  REGEN_NOW_LIVE_IG,
  REGEN_NOW_LIVE_URL,
  regenNowLiveSms,
} from "@/lib/regen/now-live";
import {
  REGEN_SQUARE_GLP1_GROUP,
  REGEN_SQUARE_GLP1_INVITE_MAX,
  squareGlp1InviteText,
} from "@/lib/regen/square-glp1-constants";

type Row = {
  squareCustomerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastItem: string;
  lastOrderAt: string | null;
  regenPatientId: string | null;
};

type Report = {
  ok?: boolean;
  connected?: boolean;
  groupName?: string;
  groupId?: string | null;
  catalogHits?: number;
  ordersScanned?: number;
  clients?: Row[];
  tagged?: number;
  upserted?: number;
  error?: string;
};

function when(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export default function OpsSquareGlp1Page() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [copied, setCopied] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/regen/ops/square-glp1", { cache: "no-store" });
    const json = (await res.json()) as Report;
    setReport(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function pull() {
    setPulling(true);
    setMsg("");
    let json: Report = {};
    try {
      const res = await fetch("/api/regen/ops/square-glp1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pull" }),
      });
      json = (await res.json().catch(() => ({}))) as Report;
      if (!res.ok) {
        setMsg(json.error || "Square did not answer.");
        return;
      }
    } catch {
      setMsg("Could not reach the Square pull.");
      return;
    } finally {
      setPulling(false);
    }
    setReport(json);
    setMsg(
      `Found ${json.clients?.length || 0} GLP-1 clients. Tagged ${json.tagged || 0} in Square · saved ${json.upserted || 0} in REGEN. Scanned ${json.ordersScanned || 0} orders.`,
    );
  }

  async function invite() {
    if (
      !window.confirm(
        `Text up to ${REGEN_SQUARE_GLP1_INVITE_MAX} Square GLP-1 clients the online shop link? People texted in the last 30 days are skipped. Reply STOP is on the message.`,
      )
    ) {
      return;
    }
    setInviting(true);
    setMsg("");
    try {
      const res = await fetch("/api/regen/ops/square-glp1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite" }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        sent?: number;
        failed?: number;
        skippedCooldown?: number;
        skippedNoPhone?: number;
        eligible?: number;
        errors?: string[];
      };
      if (!res.ok && !json.sent) {
        setMsg(json.errors?.[0] || "Could not send invites.");
        return;
      }
      setMsg(
        `Texted ${json.sent || 0} of ${json.eligible || 0}. Skipped ${json.skippedCooldown || 0} already invited · ${json.skippedNoPhone || 0} with no phone.${json.errors?.length ? ` ${json.errors[0]}` : ""}`,
      );
    } catch {
      setMsg("Could not send invites.");
    } finally {
      setInviting(false);
    }
  }

  async function launch() {
    if (
      !window.confirm(
        `MMS the REGEN RX launch flyer to up to ${REGEN_SQUARE_GLP1_INVITE_MAX} Square GLP-1 clients? People who got this flyer in the last 30 days are skipped. Reply STOP is on the message.`,
      )
    ) {
      return;
    }
    setLaunching(true);
    setMsg("");
    try {
      const res = await fetch("/api/regen/ops/square-glp1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "launch" }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        sent?: number;
        failed?: number;
        skippedCooldown?: number;
        skippedNoPhone?: number;
        eligible?: number;
        errors?: string[];
      };
      if (!res.ok && !json.sent) {
        setMsg(json.errors?.[0] || "Could not send the launch flyer.");
        return;
      }
      setMsg(
        `Launch flyer sent to ${json.sent || 0} of ${json.eligible || 0}. Skipped ${json.skippedCooldown || 0} already notified · ${json.skippedNoPhone || 0} with no phone.${json.errors?.length ? ` ${json.errors[0]}` : ""}`,
      );
    } catch {
      setMsg("Could not send the launch flyer.");
    } finally {
      setLaunching(false);
    }
  }

  async function copyCaption(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  }

  function downloadCsv() {
    const rows = report?.clients || [];
    const header = ["first_name", "last_name", "phone", "email", "last_item", "last_order", "square_id"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [
          csvEscape(r.firstName),
          csvEscape(r.lastName),
          csvEscape(r.phone),
          csvEscape(r.email),
          csvEscape(r.lastItem),
          csvEscape(r.lastOrderAt || ""),
          csvEscape(r.squareCustomerId),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regen-square-glp1.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const clients = report?.clients || [];
  const withPhone = clients.filter((c) => c.phone).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Square GLP-1</h1>
        <p className="text-white/50 mt-1 max-w-2xl">
          Square and REGEN talk here. Pull completed Square orders that look like semaglutide / tirzepatide / GLP-1,
          tag them in Square as <span className="text-white/80">{REGEN_SQUARE_GLP1_GROUP}</span>, save them on Patients,
          then text the online shop. Cards stay off Square — Ryan still reviews, pay is PayConex.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void pull()}
          disabled={pulling}
          className="px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold disabled:opacity-50"
        >
          {pulling ? "Pulling Square…" : "Pull from Square"}
        </button>
        <button
          type="button"
          onClick={() => void invite()}
          disabled={inviting || !clients.length}
          className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-semibold disabled:opacity-50"
        >
          {inviting ? "Texting…" : `Text invite (up to ${REGEN_SQUARE_GLP1_INVITE_MAX})`}
        </button>
        <button
          type="button"
          onClick={() => void launch()}
          disabled={launching || !clients.length}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 text-sm font-semibold disabled:opacity-50"
        >
          {launching ? "Sending flyer…" : `Send launch flyer (up to ${REGEN_SQUARE_GLP1_INVITE_MAX})`}
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={!clients.length}
          className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-semibold disabled:opacity-50"
        >
          Download CSV
        </button>
        <Link href="/ops/patients" className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm">
          Patients
        </Link>
      </div>

      <p className="text-white/40 text-sm">
        Short text: {squareGlp1InviteText("Dani")}
        <br />
        Flyer text: {regenNowLiveSms("Dani")} ·{" "}
        <a href={REGEN_NOW_LIVE_URL} className="text-teal-300 underline" target="_blank" rel="noreferrer">
          {REGEN_NOW_LIVE_URL}
        </a>
      </p>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
        <img
          src={REGEN_NOW_LIVE_FLYER}
          alt="REGEN RX now live flyer"
          className="w-full max-w-[220px] rounded-xl border border-white/10"
        />
        <div className="space-y-3">
          <p className="text-white/70 text-sm">Copy these for Instagram, Facebook, and Google. Same flyer. No extra list.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copyCaption("ig", REGEN_NOW_LIVE_IG)} className="px-3 py-2 rounded-lg border border-white/20 text-white text-xs">
              {copied === "ig" ? "Copied IG" : "Copy Instagram"}
            </button>
            <button type="button" onClick={() => void copyCaption("fb", REGEN_NOW_LIVE_FB)} className="px-3 py-2 rounded-lg border border-white/20 text-white text-xs">
              {copied === "fb" ? "Copied FB" : "Copy Facebook"}
            </button>
            <button type="button" onClick={() => void copyCaption("gbp", REGEN_NOW_LIVE_GBP)} className="px-3 py-2 rounded-lg border border-white/20 text-white text-xs">
              {copied === "gbp" ? "Copied Google" : "Copy Google post"}
            </button>
            <a href={REGEN_NOW_LIVE_FLYER} download className="px-3 py-2 rounded-lg border border-white/20 text-white text-xs">
              Download flyer
            </a>
            <Link href="/regen/now-live" className="px-3 py-2 rounded-lg border border-white/20 text-white text-xs">
              Open share page
            </Link>
          </div>
        </div>
      </div>

      {msg ? <p className="text-teal-200 text-sm">{msg}</p> : null}
      {report?.error ? <p className="text-pink-300 text-sm">{report.error}</p> : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="On this list" value={String(clients.length)} />
        <Stat label="Have a phone" value={String(withPhone)} />
        <Stat label="Orders scanned" value={String(report?.ordersScanned || 0)} />
        <Stat label="Catalog matches" value={String(report?.catalogHits || 0)} />
      </div>

      {loading ? <p className="text-white/40">Loading Square group…</p> : null}
      {!loading && !clients.length ? (
        <p className="text-white/50">
          No GLP-1 Square clients yet. Click Pull from Square. That reads the last two years of completed orders.
        </p>
      ) : null}

      {clients.length ? (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="text-left text-white/40">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Last item</th>
                <th className="p-3">Last order</th>
                <th className="p-3">REGEN</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.squareCustomerId} className="border-t border-white/10 text-white/80">
                  <td className="p-3">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="p-3">{c.phone || "—"}</td>
                  <td className="p-3">{c.lastItem || "—"}</td>
                  <td className="p-3">{when(c.lastOrderAt)}</td>
                  <td className="p-3">{c.regenPatientId ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <p className="text-white/40 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
