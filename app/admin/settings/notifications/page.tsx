'use client';

import Link from 'next/link';

export default function AdminSettingsNotificationsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">← Settings</Link>
        <span className="text-black">/</span>
        <h1 className="text-xl font-bold text-black">Notifications</h1>
      </div>
      <div className="bg-white rounded-xl border border-black p-6 text-black">
        <p className="font-medium">Notification preferences</p>
        <p className="text-sm mt-1 text-black/80">Configure appointment reminders, booking confirmations, and internal alerts. Full notification settings in a future release.</p>
        <Link href="/admin/settings" className="inline-block mt-4 text-[#2D63A4] font-medium hover:underline">Back to Settings</Link>
      </div>
    </div>
  );
}
