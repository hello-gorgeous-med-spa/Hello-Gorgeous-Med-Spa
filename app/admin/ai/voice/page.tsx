'use client';

// ============================================================
// AI VOICE RECEPTIONIST — Configure (Telnyx Voice + Gather Using AI + booking API)
// ============================================================

import Link from 'next/link';

function getWebhookUrl(): string {
  if (typeof window !== 'undefined') return `${window.location.origin}/api/voice/telnyx`;
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hellogorgeousmedspa.com';
  return `${base.replace(/\/$/, '')}/api/voice/telnyx`;
}

export default function AIVoicePage() {
  const webhookUrl = getWebhookUrl();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ai" className="text-black hover:text-black">← AI Hub</Link>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-xl font-bold text-black mb-2">AI Voice Receptionist</h1>
        <p className="text-black text-sm mb-6">
          Answer every call 24/7, collect name and preferred date/time via Telnyx Gather Using AI, and book appointments in real time using your existing booking API.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-emerald-900 mb-2">Setup</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-800">
            <li>In <strong>Vercel</strong> (or your host), set <code className="bg-emerald-100 px-1 rounded">TELNYX_API_KEY</code> (same key you use for SMS).</li>
            <li>Optional but recommended: set <code className="bg-emerald-100 px-1 rounded">TELNYX_WEBHOOK_PUBLIC_KEY</code> to your Telnyx webhook public key (Mission Control → API Keys → Public Key) so we verify that webhooks are from Telnyx. Paste the PEM block as-is; you can use a single line with <code className="bg-emerald-100 px-1 rounded">\n</code> for line breaks.</li>
            <li>Optional: set <code className="bg-emerald-100 px-1 rounded">TELNYX_VOICE_TRANSFER_NUMBER</code> to an E.164 number (e.g. <code className="bg-emerald-100 px-1 rounded">+16306366193</code>) so callers can be transferred to your front desk when booking fails or they need help.</li>
            <li>In <strong>Telnyx Portal</strong> → your phone number → <strong>Voice</strong> settings, set the webhook URL to:
              <div className="mt-2 p-2 bg-white rounded border border-emerald-200 font-mono text-xs break-all">
                {webhookUrl}
              </div>
              Copy this URL exactly (use HTTPS and your real domain).
            </li>
            <li>Save and redeploy if you added env vars. Incoming calls to that number will be answered by the AI, which will collect first name, last name, email, phone, service, preferred date and time, then create an appointment and speak a confirmation (or transfer if something fails).</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg p-4 border border-black">
          <p className="text-sm text-black font-medium mb-2">What it does</p>
          <ul className="text-sm text-black space-y-1 list-disc list-inside">
            <li>Answers every call and plays a short greeting</li>
            <li>Uses Telnyx <strong>Gather Using AI</strong> to collect: first name, last name, email, phone, service preference, preferred date and time</li>
            <li>Resolves natural language date (e.g. “tomorrow”, “next Tuesday”) and time (e.g. “10am”, “afternoon”) to a real slot</li>
            <li>Calls your existing <strong>POST /api/booking/create</strong> to create the appointment (same validation and confirmations as online booking)</li>
            <li>Speaks a confirmation or transfers to your transfer number if booking fails or details are missing</li>
          </ul>
        </div>

        <div className="mt-6">
          <Link href="/admin/ai" className="text-pink-600 hover:text-pink-700 font-medium text-sm">Back to AI Hub</Link>
        </div>
      </div>
    </div>
  );
}
