// Medication & Supplement Tracker - members-only
// Full implementation in Phase 5
export default function PortalMedicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medications & Supplements</h1>
      <p className="text-gray-600">
        Track prescriptions, peptides, IV therapies, and supplements. Request refills and manage wellness credits.
      </p>
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">
          Medication tracker coming soon.
        </p>
        <a
          href="/memberships"
          className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:underline"
        >
          Join a wellness program →
        </a>
      </div>
    </div>
  );
}
