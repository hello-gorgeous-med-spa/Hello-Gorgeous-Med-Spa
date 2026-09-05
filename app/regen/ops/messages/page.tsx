'use client';

import Link from 'next/link';

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-white">Messages</h1>
      <p className="text-white/60">
        Open a patient chart and use Message patient. Emails send from provider@hellogorgeousmedspa.com.
      </p>
      <Link href="/ops/patients" className="inline-block px-4 py-2 rounded-lg bg-teal-500 text-white">Go to patients</Link>
    </div>
  );
}
