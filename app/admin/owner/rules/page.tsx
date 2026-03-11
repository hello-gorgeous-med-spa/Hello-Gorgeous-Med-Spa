'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function RulesPage() {
  return (
    <OwnerLayout title="Rules & Precedence" description="Business rules and priority settings for your med spa.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Configure business rules, pricing precedence, and priority logic in one place. This module is on the roadmap.
        </p>
        <Link href="/admin/owner/live-state" className="text-[#FF2D8E] font-medium hover:underline">
          View Live System State →
        </Link>
      </div>
    </OwnerLayout>
  );
}
