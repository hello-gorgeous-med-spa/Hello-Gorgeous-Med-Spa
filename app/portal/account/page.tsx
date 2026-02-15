// ============================================================
// ACCOUNT / SETTINGS
// Membership management, billing, logout
// ============================================================

import Link from "next/link";

export default function PortalAccountPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Account & Settings</h1>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership</h2>
        <p className="text-gray-600 mb-4">
          Manage your wellness membership, upgrade or downgrade, and view billing.
        </p>
        <Link
          href="/portal/membership"
          className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline"
        >
          View membership details →
        </Link>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Wellness Programs</h2>
        <p className="text-gray-600 mb-4">
          Explore Precision Hormone or Metabolic Reset membership programs.
        </p>
        <Link
          href="/memberships"
          className="inline-flex items-center gap-2 text-pink-600 font-medium hover:underline"
        >
          Browse wellness programs →
        </Link>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payment</h2>
        <p className="text-gray-600">
          Payment info and billing history. Contact us to update payment method.
        </p>
      </section>
    </div>
  );
}
