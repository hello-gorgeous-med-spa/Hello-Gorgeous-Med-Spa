// Labs & AI Dashboard - members-only
// Full implementation in Phase 4
export default function PortalLabsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Labs & AI Dashboard</h1>
      <p className="text-gray-600">
        Upload your lab reports for AI-powered educational insights and trend tracking. This feature is available with Precision Hormone or Metabolic Reset membership.
      </p>
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">
          Lab upload and AI insights coming soon.
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
