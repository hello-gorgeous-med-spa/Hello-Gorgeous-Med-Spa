'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function ClinicalPage() {
  return (
    <OwnerLayout title="Clinical Governance" description="Protocols, consents, and clinical standards.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Manage clinical protocols, consent forms, and governance. This module is on the roadmap.
        </p>
        <Link href="/admin/consents" className="text-[#FF2D8E] font-medium hover:underline">
          Consents →
        </Link>
      </div>
    </OwnerLayout>
  );
}
