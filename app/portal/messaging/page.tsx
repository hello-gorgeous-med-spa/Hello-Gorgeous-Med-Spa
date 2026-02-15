// Secure Messaging - members-only
// Full implementation in Phase 7
export default function PortalMessagingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Secure Messaging</h1>
      <p className="text-gray-600">
        HIPAA-compliant messaging with your provider. 24–48 hour response time.
      </p>
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">
          Secure messaging coming soon.
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
