'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function ExportsPage() {
  return (
    <OwnerLayout title="Exports & Exit" description="Data export and portability.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Export client data, appointments, and records. This module is on the roadmap.
        </p>
        <Link href="/admin/reports" className="text-[#FF2D8E] font-medium hover:underline">
          Reports →
        </Link>
      </div>
    </OwnerLayout>
  );
}
