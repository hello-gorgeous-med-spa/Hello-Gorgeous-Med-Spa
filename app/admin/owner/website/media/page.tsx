'use client';

import Link from 'next/link';
import OwnerLayout from '../../layout-wrapper';

export default function WebsiteMediaPage() {
  return (
    <OwnerLayout title="Media Library" description="Images, videos, and files for your website.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Upload and manage images and files used across your site. This module is on the roadmap.
        </p>
        <Link href="/admin/owner/website" className="text-[#FF2D8E] font-medium hover:underline">
          ← Website Control
        </Link>
      </div>
    </OwnerLayout>
  );
}
