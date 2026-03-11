'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function ChangesPage() {
  return (
    <OwnerLayout title="Change Management" description="Track and approve system changes.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Log of configuration and content changes. This module is on the roadmap.
        </p>
        <Link href="/admin/owner/audit" className="text-[#FF2D8E] font-medium hover:underline">
          Audit & Forensics →
        </Link>
      </div>
    </OwnerLayout>
  );
}
