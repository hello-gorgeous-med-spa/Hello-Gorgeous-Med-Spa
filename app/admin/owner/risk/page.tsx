'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function RiskPage() {
  return (
    <OwnerLayout title="Risk & Compliance" description="Compliance and risk oversight.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Compliance checklist, risk register, and audit readiness. This module is on the roadmap.
        </p>
        <Link href="/admin/compliance" className="text-[#FF2D8E] font-medium hover:underline">
          Compliance →
        </Link>
      </div>
    </OwnerLayout>
  );
}
