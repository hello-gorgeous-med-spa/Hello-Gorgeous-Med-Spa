// ============================================================
// PROVIDER CLIENT VIEW
// Clinical overview of a specific client
// ============================================================

import Link from 'next/link';

// Mock client data - will be replaced with Supabase
const MOCK_CLIENT = {
  id: 'c1',
  firstName: 'Jennifer',
  lastName: 'Martinez',
  email: 'jennifer.martinez@email.com',
  phone: '(630) 555-1234',
  dateOfBirth: '1985-03-15',
  membershipStatus: 'active',
  membershipType: 'Annual',
  
  // Medical
  allergies: ['Lidocaine'],
  medications: ['Synthroid 50mcg daily'],
  medicalConditions: ['Hypothyroidism'],
  
  // Stats
  totalVisits: 12,
  lastVisit: '2026-01-15',
  totalSpent: 4250,
  
  // Flags
  pendingConsents: ['filler-consent'],
  pendingIntakes: [],
};

const MOCK_CHART_HISTORY = [
  {
    id: 'n1',
    date: '2026-01-15',
    service: 'Botox - Full Face',
    provider: 'Ryan Kent, APRN',
    status: 'signed',
    summary: '40 units Botox to glabella, forehead, crows feet',
  },
  {
    id: 'n2',
    date: '2025-12-01',
    service: 'Lip Filler',
    provider: 'Ryan Kent, APRN',
    status: 'signed',
    summary: '1 syringe Juvederm Ultra to lips',
  },
  {
    id: 'n3',
    date: '2025-10-15',
    service: 'Botox - Full Face',
    provider: 'Ryan Kent, APRN',
    status: 'signed',
    summary: '36 units Botox',
  },
];

const MOCK_CONSENTS = [
  { id: 'con1', name: 'General Treatment Consent', status: 'valid', signedAt: '2025-01-01', expiresAt: null },
  { id: 'con2', name: 'Neurotoxin Consent', status: 'valid', signedAt: '2025-01-01', expiresAt: null },
  { id: 'con3', name: 'Dermal Filler Consent', status: 'expired', signedAt: '2024-06-01', expiresAt: '2025-06-01' },
  { id: 'con4', name: 'HIPAA Privacy Notice', status: 'valid', signedAt: '2025-01-01', expiresAt: null },
];

const MOCK_PHOTOS = [
  { id: 'p1', date: '2026-01-15', type: 'after', area: 'Face - Front' },
  { id: 'p2', date: '2026-01-15', type: 'before', area: 'Face - Front' },
  { id: 'p3', date: '2025-12-01', type: 'after', area: 'Lips' },
  { id: 'p4', date: '2025-12-01', type: 'before', area: 'Lips' },
];

export default function ProviderClientView({ params }: { params: { id: string } }) {
  const client = MOCK_CLIENT;
  const age = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link href="/provider/clients" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Clients
        </Link>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.firstName} {client.lastName}
                </h1>
                {client.membershipStatus === 'active' && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    💎 {client.membershipType} Member
                  </span>
                )}
              </div>
              <p className="text-gray-500">
                {age} years old • {client.totalVisits} visits • Last seen {client.lastVisit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/provider/chart/new?client=${client.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <span>📝</span> New Chart
            </Link>
            <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <span>📞</span>
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <span>💬</span>
            </button>
          </div>
        </div>

        {/* Alert Banners */}
        {(client.pendingConsents.length > 0 || client.pendingIntakes.length > 0) && (
          <div className="mt-4 space-y-2">
            {client.pendingConsents.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 text-amber-800">
                  <span>⚠️</span>
                  <span className="font-medium">Missing Consents:</span>
                  <span>Dermal Filler Consent needs signature</span>
                </div>
                <Link
                  href={`/provider/clients/${client.id}/consents`}
                  className="text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Send Consent →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clinical Alerts */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
              <span>🚨</span> Clinical Alerts
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="font-medium">Allergy:</span> Lidocaine - Use alternative anesthetic
              </div>
            </div>
          </div>

          {/* Chart History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Chart History</h2>
              <Link
                href={`/provider/clients/${client.id}/charts`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {MOCK_CHART_HISTORY.map((chart) => (
                <Link
                  key={chart.id}
                  href={`/provider/charts/${chart.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{chart.service}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          chart.status === 'signed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {chart.status === 'signed' ? '✓ Signed' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{chart.summary}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-900">{chart.date}</p>
                      <p className="text-gray-500">{chart.provider}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Photos</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                + Add Photo
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3">
                {MOCK_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-xs">{photo.type}</span>
                    <span className="text-xs">{photo.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-gray-900">{client.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-gray-900">{client.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                <p className="text-gray-900">{client.dateOfBirth} ({age} years)</p>
              </div>
            </div>
          </div>

          {/* Medical Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Medical Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {client.allergies.map((allergy) => (
                    <span key={allergy} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Medications</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {client.medications.map((med) => (
                    <li key={med}>• {med}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Conditions</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {client.medicalConditions.map((condition) => (
                    <li key={condition}>• {condition}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href={`/provider/clients/${client.id}/intake`}
              className="block mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Full Intake →
            </Link>
          </div>

          {/* Consents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Consents</h3>
            <div className="space-y-2">
              {MOCK_CONSENTS.map((consent) => (
                <div key={consent.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{consent.name}</p>
                    <p className="text-xs text-gray-500">Signed {consent.signedAt}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    consent.status === 'valid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {consent.status === 'valid' ? '✓ Valid' : '⚠ Expired'}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href={`/provider/clients/${client.id}/consents`}
              className="block mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage Consents →
            </Link>
          </div>

          {/* Membership */}
          {client.membershipStatus === 'active' && (
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💎</span>
                <h3 className="font-semibold">VIP Member</h3>
              </div>
              <p className="text-purple-100 text-sm mb-3">
                {client.membershipType} membership since Jan 2025
              </p>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-sm font-medium">Free $75 Service Available</p>
                <p className="text-xs text-purple-200">Redeemable anytime</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
