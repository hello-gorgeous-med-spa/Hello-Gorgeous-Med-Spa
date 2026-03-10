'use client';

// ============================================================
// OWNER'S MANUAL — Reference and how-to (Phase 6)
// ============================================================

import Link from 'next/link';

export default function OwnerManualPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/owner" className="text-[#2D63A4] font-medium hover:underline">← Owner</Link>
        <h1 className="text-2xl font-bold text-black mt-2">Owner&apos;s Manual</h1>
        <p className="text-black mt-1">Reference and how-to for running your med spa from the admin.</p>
      </div>

      <div className="bg-white rounded-xl border border-black p-6 space-y-4 text-black">
        <section>
          <h2 className="font-semibold text-lg">Daily ops</h2>
          <p className="text-sm mt-1">Use <Link href="/admin" className="text-[#2D63A4] hover:underline">Dashboard</Link> for today&apos;s appointments and revenue. Use <Link href="/admin/calendar" className="text-[#2D63A4] hover:underline">Calendar</Link> to manage the schedule and check in clients.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg">Clients & charting</h2>
          <p className="text-sm mt-1"><Link href="/admin/clients" className="text-[#2D63A4] hover:underline">Clients</Link> is the single source of truth per client (overview, appointments, charting, consents, photos, etc.). <Link href="/admin/charting" className="text-[#2D63A4] hover:underline">Charting</Link> is template-driven clinical notes only.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg">Services & memberships</h2>
          <p className="text-sm mt-1">Edit bookable <Link href="/admin/services" className="text-[#2D63A4] hover:underline">Services</Link> and <Link href="/admin/memberships" className="text-[#2D63A4] hover:underline">Memberships</Link> without code. Changes apply to Calendar and booking.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg">Marketing & content</h2>
          <p className="text-sm mt-1"><Link href="/admin/marketing" className="text-[#2D63A4] hover:underline">Marketing</Link> for campaigns, segments, and audience filters. <Link href="/admin/content/site" className="text-[#2D63A4] hover:underline">Website / Content</Link> for no-code hero, promos, and SEO.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg">Owner portal</h2>
          <p className="text-sm mt-1"><Link href="/admin/owner" className="text-[#2D63A4] hover:underline">Owner</Link> gives a revenue snapshot, no-show rate, top providers/services, and quick links to edit services, promos, and content.</p>
        </section>
      </div>
    </div>
  );
}
