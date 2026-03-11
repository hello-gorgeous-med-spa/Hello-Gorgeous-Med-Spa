'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function OwnerInventoryPage() {
  return (
    <OwnerLayout title="Inventory" description="Owner-level inventory and reorder settings.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Set reorder thresholds, lot tracking, and inventory rules. This module is on the roadmap.
        </p>
        <Link href="/admin/inventory" className="text-[#FF2D8E] font-medium hover:underline">
          Inventory →
        </Link>
      </div>
    </OwnerLayout>
  );
}
