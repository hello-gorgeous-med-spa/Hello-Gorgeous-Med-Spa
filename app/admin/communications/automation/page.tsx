'use client';

// ============================================================
// Patient Communication Automation — dashboard
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Rule {
  id: string;
  name: string;
  trigger_event: string;
  channel: string;
  active: boolean;
}

interface Template {
  id: string;
  name: string;
  channel: string;
  trigger_event: string;
  active: boolean;
}

interface Log {
  id: string;
  channel: string;
  status: string;
  sent_at: string;
}

export default function AutomationDashboardPage() {
  const [data, setData] = useState<{
    activeRules: number;
    rules: Rule[];
    queuePending: number;
    queueFailed: number;
    templates: Template[];
    recentLogs: Log[];
    sentLast7d: { email: number; sms: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/automation/dashboard')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading…</div>;
  if (!data) return <div className="p-6 text-red-600">Could not load automation dashboard.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-black mb-2">Patient Communication Automation</h1>
      <p className="text-gray-600 mb-6">
        Appointment confirmations, reminders, follow-ups, review requests, and rebooking. Runs automatically via cron.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <p className="text-sm text-gray-600">Active rules</p>
          <p className="text-2xl font-bold text-black">{data.activeRules}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <p className="text-sm text-gray-600">Queue (pending)</p>
          <p className="text-2xl font-bold text-[#2D63A4]">{data.queuePending}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <p className="text-sm text-gray-600">Failed (retry or fix)</p>
          <p className="text-2xl font-bold text-red-600">{data.queueFailed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <p className="text-sm text-gray-600 mb-2">Sent last 7 days</p>
          <p className="text-black">Email: <strong>{data.sentLast7d?.email ?? 0}</strong></p>
          <p className="text-black">SMS: <strong>{data.sentLast7d?.sms ?? 0}</strong></p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <p className="text-sm text-gray-600 mb-2">Cron endpoints</p>
          <p className="text-xs text-gray-500 font-mono">POST /api/automation/queue/enqueue (schedule messages)</p>
          <p className="text-xs text-gray-500 font-mono">POST /api/automation/queue/process (send pending)</p>
          <p className="text-xs text-gray-500 mt-1">Use Authorization: Bearer CRON_SECRET</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-3">Active automation rules</h2>
        <ul className="space-y-2">
          {(data.rules || []).map((r) => (
            <li key={r.id} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-black">{r.name}</span>
              <span className="text-gray-500">{r.trigger_event}</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{r.channel}</span>
            </li>
          ))}
          {(!data.rules || data.rules.length === 0) && <li className="text-gray-500">No active rules. Run migration to seed.</li>}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-3">Message templates</h2>
        <ul className="space-y-2">
          {(data.templates || []).slice(0, 12).map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-black">{t.name}</span>
              <span className="text-gray-500">{t.trigger_event}</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100">{t.channel}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-black mb-3">Recent message logs</h2>
        <ul className="space-y-1 text-sm">
          {(data.recentLogs || []).slice(0, 20).map((log) => (
            <li key={log.id} className="flex items-center gap-3 text-gray-700">
              <span>{log.channel}</span>
              <span>{log.status}</span>
              <span className="text-gray-500">{log.sent_at ? new Date(log.sent_at).toLocaleString() : ''}</span>
            </li>
          ))}
          {(!data.recentLogs || data.recentLogs.length === 0) && <li className="text-gray-500">No messages sent yet.</li>}
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link href="/admin/communications/templates" className="text-[#2D63A4] hover:underline font-medium">
          Message templates →
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/admin/sms" className="text-[#2D63A4] hover:underline font-medium">
          SMS campaigns →
        </Link>
      </div>
    </div>
  );
}
