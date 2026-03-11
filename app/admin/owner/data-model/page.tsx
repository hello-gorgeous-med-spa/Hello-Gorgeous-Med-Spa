'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function DataModelPage() {
  return (
    <OwnerLayout title="Data Model Control" description="Schema and data structure governance.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          View and govern your data model (clients, appointments, services, etc.). This module is on the roadmap.
        </p>
        <Link href="/admin/owner/live-state" className="text-[#FF2D8E] font-medium hover:underline">
          Live System State →
        </Link>
      </div>
    </OwnerLayout>
  );
}
