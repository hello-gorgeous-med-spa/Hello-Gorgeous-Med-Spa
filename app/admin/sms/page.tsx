"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SMS_TEMPLATES, validateSMSLength } from "@/lib/hgos/sms-marketing";
import { SMS_COST_PER_SEGMENT_USD } from "@/lib/sms-studio";

type CampaignRow = {
  id: string;
  name: string;
  status: string;
  channel: string;
  total_recipients: number;
  sms_sent: number;
  sms_failed: number;
  sms_content?: string;
  created_at: string;
  completed_at?: string | null;
};

export default function TextStudioPage() {
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipients, setRecipients] = useState<"all" | "custom">("all");
  const [customNumbers, setCustomNumbers] = useState("");
  const [sending, setSending] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [recentOptIns, setRecentOptIns] = useState<number | null>(null);
  const [twilioConfigured, setTwilioConfigured] = useState(false);
  const [messagingServiceConfigured, setMessagingServiceConfigured] = useState(false);
  const [displayPhone, setDisplayPhone] = useState("(630) 864-5231");
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const customCount = useMemo(
    () => customNumbers.split("\n").map((n) => n.trim()).filter(Boolean).length,
    [customNumbers],
  );

  const audienceCount = recipients === "all" ? clientCount : customCount;
  const lengthInfo = useMemo(() => validateSMSLength(message || "x"), [message]);
  const segments = message ? lengthInfo.segments : 1;
  const costUsd = audienceCount * segments * SMS_COST_PER_SEGMENT_USD;
  const estMinutes = Math.max(1, Math.ceil(audienceCount / 10));

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/sms/stats");
      if (!res.ok) return;
      const data = await res.json();
      setClientCount(data.smsOptInCount || 0);
      setRecentOptIns(typeof data.recentOptIns === "number" ? data.recentOptIns : null);
      setTwilioConfigured(!!data.twilioConfigured);
      setMessagingServiceConfigured(!!data.messagingServiceConfigured);
      if (data.displayPhone) setDisplayPhone(data.displayPhone);
    } catch {
      /* ignore */
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns?channel=sms");
      if (!res.ok) return;
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadStats();
    void loadCampaigns();
  }, [loadStats, loadCampaigns]);

  // Poll active / in-flight campaigns
  useEffect(() => {
    const inflight = campaigns.some((c) => c.status === "queued" || c.status === "sending");
    if (!inflight && !activeCampaignId) return;
    const t = setInterval(() => {
      void loadCampaigns();
    }, 4000);
    return () => clearInterval(t);
  }, [campaigns, activeCampaignId, loadCampaigns]);

  const applyTemplate = (templateId: string) => {
    const template = SMS_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.message.replace(/\{\{(\w+)\}\}/g, "{$1}"));
      setSelectedTemplate(templateId);
    }
  };

  const sendTest = async () => {
    const to = testPhone.trim() || prompt("Phone number for test text:") || "";
    if (!to || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message }),
      });
      const data = await res.json();
      if (data.success) {
        setToast("Test sent — check your phone.");
        setTestPhone(to);
      } else {
        setError(data.error || "Test failed");
      }
    } catch {
      setError("Test failed");
    } finally {
      setSending(false);
    }
  };

  const enqueueCampaign = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    setConfirmOpen(false);
    try {
      const payload: Record<string, unknown> = {
        name: `Text Studio · ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
        channel: "sms",
        smsContent: message,
        audienceSegment: recipients === "all" ? "sms-opt-in" : "custom",
      };
      if (recipients === "custom") {
        payload.customPhones = customNumbers
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean);
      }

      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to queue campaign");
        return;
      }
      setActiveCampaignId(data.campaignId);
      setToast(data.message || "Campaign queued");
      void loadCampaigns();
    } catch {
      setError("Failed to queue campaign");
    } finally {
      setSending(false);
    }
  };

  const cancelCampaign = async (id: string) => {
    if (!confirm("Cancel this campaign? Pending texts will not send.")) return;
    const res = await fetch(`/api/campaigns/${id}/cancel`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Cancel failed");
      return;
    }
    setToast("Campaign cancelled");
    void loadCampaigns();
  };

  const joinQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `sms:${displayPhone.replace(/\D/g, "").replace(/^1?/, "1")}?body=JOIN`,
  )}`;

  const active = campaigns.find((c) => c.id === activeCampaignId) || campaigns.find((c) => c.status === "sending" || c.status === "queued");

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Hello Gorgeous</p>
          <h1 className="text-3xl font-black text-black">Text Studio</h1>
          <p className="mt-1 text-sm text-black/70">
            Compose → confirm → send. Queued via Twilio A2P — no $150/mo blast fee.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
          <div className="font-bold text-black">{clientCount.toLocaleString()} SMS opt-ins</div>
          {recentOptIns != null && (
            <div className="text-xs text-black/60">~{recentOptIns} updated in last 7 days</div>
          )}
        </div>
      </div>

      {!twilioConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="font-medium">Twilio is not configured</p>
          <p className="mt-1 text-sm">
            Set <code className="rounded bg-amber-100 px-1">TWILIO_ACCOUNT_SID</code>,{" "}
            <code className="rounded bg-amber-100 px-1">TWILIO_AUTH_TOKEN</code>, and{" "}
            <code className="rounded bg-amber-100 px-1">TWILIO_MESSAGING_SERVICE_SID</code> in Vercel.
          </p>
        </div>
      )}

      {twilioConfigured && !messagingServiceConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Add <code className="rounded bg-amber-100 px-1">TWILIO_MESSAGING_SERVICE_SID</code> (your
          verified A2P service) for best deliverability.
        </div>
      )}

      {toast && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {toast}
          <button type="button" className="ml-3 underline" onClick={() => setToast(null)}>
            dismiss
          </button>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
          <button type="button" className="ml-3 underline" onClick={() => setError(null)}>
            dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border-2 border-black bg-white p-6">
            <h3 className="mb-4 font-semibold text-black">Quick templates</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {SMS_TEMPLATES.filter((t) => t.category === "promotional")
                .slice(0, 6)
                .map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      selectedTemplate === template.id
                        ? "border-[#E6007E] bg-pink-50 text-pink-800"
                        : "border-black/20 hover:border-[#E6007E]"
                    }`}
                  >
                    <div className="truncate font-medium">{template.name}</div>
                  </button>
                ))}
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-6">
            <h3 className="mb-2 font-semibold text-black">Your message</h3>
            <p className="mb-3 text-xs text-black/60">
              Use {"{firstName}"} for personalization. STOP language is added automatically if missing.
            </p>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSelectedTemplate("");
              }}
              placeholder="Type your offer… Flash sale, new special, reminder to book…"
              className="h-40 w-full resize-none rounded-lg border border-black/30 px-4 py-3 focus:border-[#E6007E] focus:outline-none focus:ring-2 focus:ring-[#E6007E]/30"
            />
            <div className="mt-2 flex justify-between text-sm">
              <span className={segments > 1 ? "text-amber-700" : "text-black/60"}>
                {message.length} chars · {segments} segment{segments === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-6">
            <h3 className="mb-4 font-semibold text-black">Audience</h3>
            <div className="mb-4 flex gap-4">
              <button
                type="button"
                onClick={() => setRecipients("all")}
                className={`flex-1 rounded-lg border-2 p-4 transition-colors ${
                  recipients === "all" ? "border-[#E6007E] bg-pink-50" : "border-black/20"
                }`}
              >
                <div className="font-semibold">All SMS opt-ins</div>
                <div className="text-sm text-black/60">{clientCount.toLocaleString()} people</div>
              </button>
              <button
                type="button"
                onClick={() => setRecipients("custom")}
                className={`flex-1 rounded-lg border-2 p-4 transition-colors ${
                  recipients === "custom" ? "border-[#E6007E] bg-pink-50" : "border-black/20"
                }`}
              >
                <div className="font-semibold">Custom list</div>
                <div className="text-sm text-black/60">Paste numbers (must be opted in)</div>
              </button>
            </div>
            {recipients === "custom" && (
              <textarea
                value={customNumbers}
                onChange={(e) => setCustomNumbers(e.target.value)}
                placeholder={"6301234567\n3125559999"}
                className="h-32 w-full resize-none rounded-lg border border-black/30 px-4 py-3"
              />
            )}
            <p className="mt-3 text-xs text-black/55">
              Only clients with <strong>accepts SMS marketing</strong> are texted. Numbers not opted in
              are skipped.{" "}
              <Link href="/forms/sms-consent" className="text-[#E6007E] underline">
                Paper consent form
              </Link>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border-2 border-black bg-gradient-to-b from-[#FFF0F7] to-white p-6">
            <h3 className="mb-3 font-semibold text-black">Preview</h3>
            <div className="mx-auto max-w-[260px] rounded-3xl bg-zinc-900 p-3">
              <div className="rounded-2xl bg-zinc-800 p-3">
                <div className="mb-2 text-center text-[10px] text-white/40">{displayPhone}</div>
                <div className="rounded-2xl rounded-bl-md bg-[#E6007E] p-3 text-sm text-white">
                  {message || "Your message will appear here…"}
                  {message && !/stop/i.test(message) && (
                    <div className="mt-2 border-t border-white/30 pt-2 text-xs opacity-80">
                      Reply STOP to unsubscribe.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-6 text-sm">
            <h3 className="mb-3 font-semibold text-black">Cost estimate</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black/60">Recipients</span>
                <span className="font-medium">{audienceCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Twilio (~${SMS_COST_PER_SEGMENT_USD}/seg)</span>
                <span className="font-medium text-emerald-700">${costUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Est. send time</span>
                <span className="font-medium">~{estMinutes} min</span>
              </div>
              <div className="border-t pt-2 text-xs text-black/50">
                vs ~$150 SaaS blast tools — you pay Twilio only.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Your cell for test"
                className="flex-1 rounded-xl border border-black/30 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void sendTest()}
                disabled={!message || sending}
                className="rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Test
              </button>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={!message || sending || audienceCount < 1}
              className="w-full rounded-xl bg-[#E6007E] py-4 text-base font-bold text-white shadow-[4px_4px_0_0_#000] disabled:opacity-50"
            >
              {sending ? "Queuing…" : `Send to ${audienceCount.toLocaleString()} · $${costUsd.toFixed(2)}`}
            </button>
          </div>

          {active && (active.status === "queued" || active.status === "sending") && (
            <div className="rounded-xl border-2 border-[#E6007E] bg-pink-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#E6007E]">Sending…</span>
                <button
                  type="button"
                  onClick={() => void cancelCampaign(active.id)}
                  className="text-xs font-semibold underline"
                >
                  Cancel
                </button>
              </div>
              <div className="mb-1 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full bg-[#E6007E] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((active.sms_sent + active.sms_failed) / Math.max(1, active.total_recipients)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-black/70">
                {active.sms_sent} sent · {active.sms_failed} failed ·{" "}
                {Math.max(0, active.total_recipients - active.sms_sent - active.sms_failed)} left
              </p>
            </div>
          )}

          <div className="rounded-xl border-2 border-black bg-white p-5">
            <h3 className="mb-2 font-semibold text-black">Grow the list</h3>
            <p className="mb-3 text-xs text-black/65">
              Front desk: ask clients to text <strong>JOIN</strong> to{" "}
              <strong>{displayPhone}</strong>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={joinQrUrl}
              alt="QR code — text JOIN"
              width={140}
              height={140}
              className="mx-auto rounded-lg border border-black/10"
            />
            <p className="mt-2 text-center text-[11px] text-black/50">Print for aftercare bags</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-black">Recent SMS campaigns</h2>
        <div className="overflow-hidden rounded-xl border-2 border-black bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-black/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-black/50">
                    No SMS campaigns yet — send your first above.
                  </td>
                </tr>
              )}
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t border-black/10">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 capitalize">{c.status}</td>
                  <td className="px-4 py-3">
                    {c.sms_sent}/{c.total_recipients}
                    {c.sms_failed > 0 ? ` · ${c.sms_failed} failed` : ""}
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(c.status === "queued" || c.status === "sending") && (
                      <button
                        type="button"
                        onClick={() => void cancelCampaign(c.id)}
                        className="text-xs font-semibold text-red-600 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <h3 className="text-xl font-black text-black">Send this campaign?</h3>
            <ul className="mt-4 space-y-2 text-sm text-black/80">
              <li>
                <strong>{audienceCount.toLocaleString()}</strong> opted-in recipients
              </li>
              <li>
                About <strong>${costUsd.toFixed(2)}</strong> Twilio cost ({segments} seg each)
              </li>
              <li>
                Roughly <strong>~{estMinutes} minutes</strong> via background queue
              </li>
            </ul>
            <p className="mt-3 text-xs text-black/50">
              You can cancel while it is still sending.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border-2 border-black py-3 font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void enqueueCampaign()}
                className="flex-1 rounded-xl bg-[#E6007E] py-3 font-bold text-white"
              >
                Yes, send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
