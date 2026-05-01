"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type EnvFlag = { name: string; required: boolean; set: boolean; note?: string };

type Diagnostics = {
  ok: boolean;
  generatedAt: string;
  requestedBy: { role: string; email: string | null };
  webhookUrl: string;
  twilioPhoneNumberMasked: string | null;
  transferTarget: { e164: string; masked: string | null };
  env: EnvFlag[];
  requiredMissing: string[];
  warnings: string[];
  db: {
    reachable: boolean;
    callsCount: number | null;
    bookingRequestsCount: number | null;
    knowledgeCount: number | null;
    settingsCount: number | null;
    error?: string;
  };
};

type SelfTestResult = {
  ok: boolean;
  callSid: string;
  webhook: {
    url: string;
    status: number;
    bodySnippet: string;
    error?: string;
    twimlLooksValid: boolean;
  };
  db: { rowFound: boolean; cleanup: "delete" | "keep"; error?: string };
};

export default function AiConciergeHealthPage() {
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [test, setTest] = useState<SelfTestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/ai-concierge/diagnostics", { cache: "no-store" });
      const data = (await res.json()) as Diagnostics | { error: string };
      if (!res.ok || "error" in data) {
        setErr("error" in data ? data.error : `HTTP ${res.status}`);
        setDiag(null);
      } else {
        setDiag(data);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runSelfTest(cleanup: "delete" | "keep") {
    setRunning(true);
    setTest(null);
    try {
      const res = await fetch("/api/ai-concierge/diagnostics/selftest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleanup }),
        cache: "no-store",
      });
      const data = (await res.json()) as SelfTestResult;
      setTest(data);
    } catch (e) {
      setTest({
        ok: false,
        callSid: "",
        webhook: { url: "", status: 0, bodySnippet: "", error: e instanceof Error ? e.message : "Network error", twimlLooksValid: false },
        db: { rowFound: false, cleanup, error: undefined },
      });
    } finally {
      setRunning(false);
    }
  }

  async function copyWebhook() {
    if (!diag) return;
    try {
      await navigator.clipboard.writeText(diag.webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const overallChip = useMemo(() => {
    if (!diag) return null;
    if (diag.ok) return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Healthy</span>;
    return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Needs attention</span>;
  }, [diag]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Health &amp; Diagnostics</h2>
          <p className="text-sm text-black/70">Verify Twilio + Claude + Supabase before a real call.</p>
        </div>
        <div className="flex items-center gap-2">
          {overallChip}
          <button
            type="button"
            onClick={load}
            className="text-xs px-2.5 py-1 rounded border border-black/15 hover:bg-black/5"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="text-sm">Loading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {diag && (
        <div className="space-y-6">
          <section className="border border-black/10 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-2">Twilio webhook URL</h3>
            <p className="text-xs text-black/70 mb-2">
              Paste this into <strong>Twilio Console → Phone Numbers → your number → Voice → A call comes in (Webhook, HTTP POST)</strong>.
              This URL is canonical regardless of whether you opened admin on the apex or on <code className="bg-black/5 px-1 rounded">hub.</code> —
              override with <code className="bg-black/5 px-1 rounded">NEXT_PUBLIC_AI_CONCIERGE_BASE_URL</code> or <code className="bg-black/5 px-1 rounded">NEXT_PUBLIC_SITE_URL</code> if needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <code className="block flex-1 text-xs bg-black/5 px-2 py-1.5 rounded font-mono break-all">{diag.webhookUrl}</code>
              <button
                type="button"
                onClick={copyWebhook}
                className="text-xs px-2.5 py-1.5 rounded bg-[#E6007E] text-white hover:bg-[#c00069]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
              <div>
                <dt className="text-black/60">Twilio number (TWILIO_PHONE_NUMBER)</dt>
                <dd className="font-mono">{diag.twilioPhoneNumberMasked ?? "(unset)"}</dd>
              </div>
              <div>
                <dt className="text-black/60">Sarah&apos;s transfer target</dt>
                <dd className="font-mono">{diag.transferTarget.e164}</dd>
              </div>
            </dl>
          </section>

          {diag.warnings.length > 0 && (
            <section className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Warnings</h3>
              <ul className="list-disc pl-5 text-xs text-red-800 space-y-1">
                {diag.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="border border-black/10 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-2">Environment variables</h3>
            <p className="text-xs text-black/70 mb-3">
              Values are never displayed — only whether each is set. Update missing items in Vercel → Settings → Environment Variables, then redeploy.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-black/5">
                  <tr>
                    <th className="text-left p-2">Variable</th>
                    <th className="text-left p-2">Required</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {diag.env.map((row) => {
                    const ok = row.set || !row.required;
                    return (
                      <tr key={row.name} className="border-t border-black/5">
                        <td className="p-2 font-mono">{row.name}</td>
                        <td className="p-2">{row.required ? "Yes" : "Optional"}</td>
                        <td className="p-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              ok
                                ? row.set
                                  ? "bg-green-100 text-green-800"
                                  : "bg-black/5 text-black/70"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {row.set ? "Set" : row.required ? "Missing" : "Unset"}
                          </span>
                        </td>
                        <td className="p-2 text-black/70">{row.note ?? ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {diag.requiredMissing.length > 0 && (
              <p className="text-xs text-red-700 mt-2">
                Missing required: <span className="font-mono">{diag.requiredMissing.join(", ")}</span>
              </p>
            )}
          </section>

          <section className="border border-black/10 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-2">Database (Supabase)</h3>
            <p className="text-xs text-black/70 mb-2">
              {diag.db.reachable ? "Service-role client can reach all four AI Concierge tables." : "Service-role client cannot reach the AI Concierge tables."}
            </p>
            {diag.db.error && <p className="text-xs text-red-700 mb-2">{diag.db.error}</p>}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <Stat label="Calls" value={diag.db.callsCount} />
              <Stat label="Booking requests" value={diag.db.bookingRequestsCount} />
              <Stat label="Knowledge" value={diag.db.knowledgeCount} />
              <Stat label="Settings" value={diag.db.settingsCount} />
            </dl>
          </section>

          <section className="border border-black/10 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-2">Self-test</h3>
            <p className="text-xs text-black/70 mb-3">
              Posts a signed synthetic Twilio webhook to <code className="bg-black/5 px-1 rounded">/api/ai-concierge/voice/incoming</code> and
              verifies the TwiML + DB row. Useful before a real test call.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => runSelfTest("delete")}
                disabled={running}
                className="text-xs px-3 py-1.5 rounded bg-black text-white disabled:opacity-50"
              >
                {running ? "Running…" : "Run self-test (auto-clean)"}
              </button>
              <button
                type="button"
                onClick={() => runSelfTest("keep")}
                disabled={running}
                className="text-xs px-3 py-1.5 rounded border border-black/20 hover:bg-black/5 disabled:opacity-50"
              >
                Run &amp; keep row (visible in Calls tab)
              </button>
            </div>
            {test && (
              <div className="space-y-2 text-xs">
                <div>
                  Result:{" "}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      test.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {test.ok ? "Pass" : "Fail"}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-black/70">CallSid: {test.callSid}</div>
                <div>
                  Webhook → status {test.webhook.status}; TwiML looks valid: {test.webhook.twimlLooksValid ? "yes" : "no"}
                  {test.webhook.error ? <span className="text-red-700"> · error: {test.webhook.error}</span> : null}
                </div>
                <div>
                  DB row inserted: {test.db.rowFound ? "yes" : "no"}; cleanup: {test.db.cleanup}
                  {test.db.error ? <span className="text-red-700"> · {test.db.error}</span> : null}
                </div>
                <details className="text-[11px]">
                  <summary className="cursor-pointer text-black/60">Raw TwiML preview</summary>
                  <pre className="bg-black/5 mt-1 p-2 rounded whitespace-pre-wrap break-all">{test.webhook.bodySnippet}</pre>
                </details>
              </div>
            )}
          </section>

          <p className="text-[11px] text-black/50">Generated at {new Date(diag.generatedAt).toLocaleString()}.</p>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded border border-black/10 p-2">
      <div className="text-[10px] uppercase tracking-wider text-black/50">{label}</div>
      <div className="font-mono text-sm">{value ?? "—"}</div>
    </div>
  );
}
