'use client';

// ============================================================
// AI HUB — In-house AI: Voice, Memory, Watchdog
// Your AI that never misses a call and actually remembers your business.
// No Boots AI or external agency; everything lives here.
// ============================================================

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AIHubPage() {
  const [watchdogCount, setWatchdogCount] = useState<number | null>(null);
  const [flaggedCount, setFlaggedCount] = useState<number | null>(null);
  const [memoryCount, setMemoryCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/ai/watchdog').then((r) => r.ok && r.json().then((d) => d.logs?.length ?? 0)).catch(() => 0),
      fetch('/api/ai/watchdog?flagged=true').then((r) => r.ok && r.json().then((d) => d.logs?.length ?? 0)).catch(() => 0),
      fetch('/api/ai/memory').then((r) => r.ok && r.json().then((d) => d.items?.length ?? 0)).catch(() => 0),
    ]).then(([total, flagged, mem]) => {
      setWatchdogCount(total);
      setFlaggedCount(flagged);
      setMemoryCount(mem);
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero — AI employee that never misses a call + Hello Gorgeous mascot */}
      <section className="bg-gradient-to-b from-black via-black to-black text-white px-4 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/characters/hello-gorgeous-mascot.png"
              alt="Hello Gorgeous mascot"
              width={160}
              height={160}
              className="rounded-2xl object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-amber-300/95 drop-shadow-sm">
            Your AI that never misses a call and actually remembers your business.
          </h1>
          <p className="mt-4 text-lg text-black max-w-2xl mx-auto">
            All of this lives in your system. Private, continuously learning, compliance-aware. No Boots AI or third-party required.
          </p>
          <p className="mt-2 text-sm text-black">
            🔒 Private & self-hosted · 🛡️ Compliance-aware · 🔄 Reusable across all AI agents
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/admin/insights"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors shadow-lg"
            >
              Ask AI (Business Insights)
            </Link>
            <Link
              href="/admin/ai/memory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-amber-400/60 text-amber-300 font-medium hover:bg-amber-400/10 transition-colors"
            >
              Business Memory
            </Link>
          </div>
        </div>
      </section>

      {/* Cards: Voice Receptionist, Business Memory, AI Watchdog */}
      <section className="flex-1 bg-black px-4 py-10">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
          {/* AI Voice Receptionist */}
          <div className="bg-black/80 border border-black/50 rounded-xl p-6 flex flex-col">
            <div className="text-3xl mb-2">📞</div>
            <h2 className="text-lg font-semibold text-white mb-1">AI Voice Receptionist</h2>
            <p className="text-sm text-black mb-4 flex-1">
              Answers every call 24/7, books appointments in real time, captures lead details, sounds human. Coming soon: connect your Telnyx number to enable.
            </p>
            <Link
              href="/admin/ai/voice"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors"
            >
              Configure →
            </Link>
          </div>

          {/* Business Memory */}
          <div className="bg-black/80 border border-black/50 rounded-xl p-6 flex flex-col">
            <div className="text-3xl mb-2">🧠</div>
            <h2 className="text-lg font-semibold text-white mb-1">Business Memory</h2>
            <p className="text-sm text-black mb-4 flex-1">
              The knowledge base your AI uses. Add FAQs, policies, service info. Searchable, reusable intelligence that you own.
            </p>
            <div className="text-2xl font-bold text-amber-300 mb-2">{memoryCount !== null ? memoryCount : '—'} entries</div>
            <Link
              href="/admin/ai/memory"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors"
            >
              Manage Memory →
            </Link>
          </div>

          {/* AI Watchdog */}
          <div className="bg-black/80 border border-black/50 rounded-xl p-6 flex flex-col">
            <div className="text-3xl mb-2">🛡️</div>
            <h2 className="text-lg font-semibold text-white mb-1">AI Watchdog</h2>
            <p className="text-sm text-black mb-4 flex-1">
              Monitors AI responses, flags risk or non-compliance, maintains audit trails, ensures consistency across channels.
            </p>
            <div className="flex gap-4 mb-2">
              <span className="text-amber-300 font-bold">{watchdogCount !== null ? watchdogCount : '—'} logs</span>
              {flaggedCount !== null && flaggedCount > 0 && (
                <span className="text-[#FF2D8E] font-bold">{flaggedCount} flagged</span>
              )}
            </div>
            <Link
              href="/admin/ai/watchdog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors"
            >
              View Logs →
            </Link>
          </div>
        </div>

        {/* Mascot feedback for owner */}
        <div className="max-w-4xl mx-auto mt-6">
          <Link
            href="/admin/ai/mascot-feedback"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-400/60 text-amber-300 font-medium hover:bg-amber-400/10 transition-colors"
          >
            📬 Mascot feedback for owner
          </Link>
          <p className="text-black text-sm mt-1">Messages, complaints, and requests from the chat widget — she sends you everything so you can follow up.</p>
        </div>

        {/* Why this matters */}
        <div className="max-w-4xl mx-auto mt-10 pt-8 border-t border-black/50">
          <h3 className="text-lg font-semibold text-amber-300/95 mb-4">Why this matters</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-black text-sm">
            <li className="flex items-center gap-2">🔒 Private & self-hosted — your data stays in your system</li>
            <li className="flex items-center gap-2">🚀 Continuously learning — add to Business Memory anytime</li>
            <li className="flex items-center gap-2">🛡️ Compliance-aware — Watchdog keeps audit trails</li>
            <li className="flex items-center gap-2">🔄 Reusable across all AI agents — one memory, many uses</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
