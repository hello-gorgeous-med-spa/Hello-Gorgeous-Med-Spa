'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function EconomicsPage() {
  return (
    <OwnerLayout title="Revenue & Economics" description="Revenue tracking, margins, and economics.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          View revenue breakdown, service economics, and profitability. This module is on the roadmap.
        </p>
        <Link href="/admin" className="text-[#FF2D8E] font-medium hover:underline">
          Dashboard →
        </Link>
      </div>
    </OwnerLayout>
  );
}
