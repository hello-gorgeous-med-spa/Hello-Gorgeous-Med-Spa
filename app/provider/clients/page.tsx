// ============================================================
// PROVIDER CLIENTS LIST
// Search and browse all clients
// ============================================================

import Link from 'next/link';

// Mock data - will be replaced with Supabase query
const MOCK_CLIENTS = [
  {
    id: 'c1',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@email.com',
    phone: '(630) 555-1234',
    lastVisit: '2026-01-15',
    totalVisits: 12,
    membershipStatus: 'active',
    hasAlerts: true,
  },
  {
    id: 'c2',
    firstName: 'Amanda',
    lastName: 'Chen',
    email: 'amanda.chen@email.com',
    phone: '(630) 555-2345',
    lastVisit: null,
    totalVisits: 0,
    membershipStatus: null,
    hasAlerts: false,
  },
  {
    id: 'c3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(630) 555-3456',
    lastVisit: '2026-01-10',
    totalVisits: 8,
    membershipStatus: 'active',
    hasAlerts: false,
  },
  {
    id: 'c4',
    firstName: 'Michelle',
    lastName: 'Williams',
    email: 'mwilliams@email.com',
    phone: '(630) 555-4567',
    lastVisit: '2026-01-20',
    totalVisits: 4,
    membershipStatus: null,
    hasAlerts: false,
  },
  {
    id: 'c5',
    firstName: 'Rachel',
    lastName: 'Brown',
    email: 'rachel.b@email.com',
    phone: '(630) 555-5678',
    lastVisit: '2025-12-15',
    totalVisits: 15,
    membershipStatus: 'active',
    hasAlerts: true,
  },
];

export default function ProviderClientsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Search and manage client records</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
          + Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option>All Clients</option>
            <option>VIP Members</option>
            <option>New Clients</option>
            <option>Need Follow-up</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Client</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Last Visit</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Visits</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_CLIENTS.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <div>
                      <Link
                        href={`/provider/clients/${client.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {client.firstName} {client.lastName}
                      </Link>
                      {client.hasAlerts && (
                        <span className="ml-2 text-red-500" title="Has alerts">⚠️</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{client.email}</p>
                  <p className="text-sm text-gray-500">{client.phone}</p>
                </td>
                <td className="px-6 py-4">
                  {client.lastVisit ? (
                    <span className="text-sm text-gray-900">{client.lastVisit}</span>
                  ) : (
                    <span className="text-sm text-gray-400">Never</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{client.totalVisits}</span>
                </td>
                <td className="px-6 py-4">
                  {client.totalVisits === 0 ? (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      New
                    </span>
                  ) : client.membershipStatus === 'active' ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      💎 VIP
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      Regular
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/provider/chart/new?client=${client.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Chart
                    </Link>
                    <Link
                      href={`/provider/clients/${client.id}`}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing 1-5 of 3,199 clients
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              2
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              640
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
