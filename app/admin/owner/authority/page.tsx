'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function AuthorityPage() {
  return (
    <OwnerLayout title="Access & Authority" description="Roles, permissions, and access control.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Manage who can access admin, owner, and sensitive areas. This module is on the roadmap.
        </p>
        <Link href="/admin/settings" className="text-[#FF2D8E] font-medium hover:underline">
          Settings →
        </Link>
      </div>
    </OwnerLayout>
  );
}
