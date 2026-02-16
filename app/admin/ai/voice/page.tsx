'use client';

// ============================================================
// AI VOICE RECEPTIONIST — Configure (in-house, no Boots)
// ============================================================

import Link from 'next/link';

export default function AIVoicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ai" className="text-black hover:text-black">← AI Hub</Link>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-xl font-bold text-black mb-2">AI Voice Receptionist</h1>
        <p className="text-black text-sm mb-6">
          Answer every call 24/7, book appointments in real time, capture lead details, sound human. All in your system—no Boots AI or external service required.
        </p>
        <div className="bg-white rounded-lg p-4 border border-black">
          <p className="text-sm text-black font-medium mb-2">Coming soon</p>
          <p className="text-sm text-black mb-4">
            To enable the voice receptionist you’ll connect your existing Telnyx phone number to a voice AI stack (e.g. Telnyx Voice API + speech-to-text + your booking API). 
            Your Business Memory and Watchdog will plug in so the AI knows your services and all interactions are logged.
          </p>
          <ul className="text-sm text-black space-y-1 list-disc list-inside">
            <li>Answers every call, 24/7</li>
            <li>Books appointments in real time</li>
            <li>Captures lead details and intent</li>
            <li>Sounds human, not robotic</li>
            <li>Routes or escalates when needed</li>
          </ul>
        </div>
        <div className="mt-6">
          <Link href="/admin/ai" className="text-pink-600 hover:text-pink-700 font-medium text-sm">Back to AI Hub</Link>
        </div>
      </div>
    </div>
  );
}
