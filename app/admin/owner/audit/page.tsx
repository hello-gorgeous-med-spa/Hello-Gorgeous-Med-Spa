'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function AuditPage() {
  return (
    <OwnerLayout title="Audit & Forensics" description="Activity logs and audit trail.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          View who did what and when for compliance and troubleshooting. This module is on the roadmap.
        </p>
        <Link href="/admin/owner/live-state" className="text-[#FF2D8E] font-medium hover:underline">
          Live System State →
        </Link>
      </div>
    </OwnerLayout>
  );
}
