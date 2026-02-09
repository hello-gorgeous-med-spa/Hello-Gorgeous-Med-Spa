'use client';

// ============================================================
// AI WATCHDOG — Audit trail and compliance monitoring
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

type LogEntry = {
  id: string;
  source: string;
  channel: string | null;
  request_summary: string | null;
  response_summary: string | null;
  full_response_preview: string | null;
  flagged: boolean;
  flag_reason: string | null;
  created_at: string;
};

export default function AIWatchdogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = `/api/ai/watchdog?limit=50${flaggedOnly ? '&flagged=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [flaggedOnly]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/admin/ai" className="text-slate-500 hover:text-slate-700">← AI Hub</Link>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => setFlaggedOnly(e.target.checked)}
            className="rounded border-gray-300"
          />
          Flagged only
        </label>
      </div>
      <h1 className="text-xl font-bold text-gray-900">AI Watchdog</h1>
      <p className="text-gray-600 text-sm">
        Monitors AI responses, flags risk or non-compliance, maintains audit trails. All in your system.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : logs.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-gray-600">
          {flaggedOnly ? 'No flagged logs.' : 'No AI activity logged yet. Use AI Insights (chat) and logs will appear here.'}
        </div>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li
              key={log.id}
              className={`rounded-xl border p-4 ${
                log.flagged ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {log.source} · {log.channel || '—'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </span>
                {log.flagged && (
                  <span className="text-xs font-medium text-red-600">Flagged: {log.flag_reason || 'non-compliance'}</span>
                )}
              </div>
              {log.request_summary && (
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium text-gray-500">Request:</span> {log.request_summary}
                </p>
              )}
              {log.response_summary && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-gray-500">Response:</span> {log.response_summary}
                </p>
              )}
              {log.full_response_preview && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">Preview full response</summary>
                  <pre className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                    {log.full_response_preview}
                  </pre>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
