'use client';

import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function OwnerGiftCardsPage() {
  return (
    <OwnerLayout title="Gift Cards" description="Gift card program and settings.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 max-w-2xl">
        <p className="text-gray-600 mb-4">
          Configure gift card products, denominations, and redemption rules. This module is on the roadmap.
        </p>
        <Link href="/admin/gift-cards" className="text-[#FF2D8E] font-medium hover:underline">
          Gift Cards →
        </Link>
      </div>
    </OwnerLayout>
  );
}
