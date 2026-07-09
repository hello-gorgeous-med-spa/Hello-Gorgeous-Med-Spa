'use client';

import Link from 'next/link';

export default function AdminStaffPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">← Settings</Link>
        <span className="text-black">/</span>
        <h1 className="text-xl font-bold text-black">Staff</h1>
      </div>
      <div className="bg-white rounded-xl border border-black p-6 text-black space-y-4">
        <div>
          <p className="font-medium">Staff & payroll</p>
          <p className="text-sm mt-1 text-black/80">
            Compensation rules for Ryan (1099), Michelle ($22/hr + 10%), and Marissa ($20/hr + reviews + commission).
            Weekly pay via Square Payroll.
          </p>
        </div>
        <Link
          href="/admin/payroll"
          className="inline-block px-4 py-2 rounded-lg bg-[#FF2D8E] text-white font-semibold text-sm hover:bg-black"
        >
          Weekly payroll preview →
        </Link>
        <p className="text-xs text-black/60">
          Full staff builder (permissions, schedule, service eligibility) coming in a future release.
        </p>
      </div>
    </div>
  );
}
