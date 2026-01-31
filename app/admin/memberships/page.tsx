'use client';

// ============================================================
// ADMIN MEMBERSHIPS PAGE
// Manage VIP memberships
// ============================================================

const MOCK_MEMBERS = [
  { id: 'm1', name: 'Jennifer Martinez', type: 'Annual', since: '2025-01-01', status: 'active', freeServiceUsed: false },
  { id: 'm2', name: 'Sarah Johnson', type: 'Annual', since: '2025-03-15', status: 'active', freeServiceUsed: true },
  { id: 'm3', name: 'Rachel Brown', type: 'Annual', since: '2024-06-01', status: 'active', freeServiceUsed: false },
  { id: 'm4', name: 'Lisa Thompson', type: 'Annual', since: '2025-01-01', status: 'active', freeServiceUsed: true },
  { id: 'm5', name: 'Karen White', type: 'Monthly', since: '2025-10-01', status: 'active', freeServiceUsed: false },
];

export default function AdminMembershipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
          <p className="text-gray-500">Manage VIP membership program</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
          + Add Member
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Members</p>
          <p className="text-2xl font-bold text-purple-600">127</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Annual</p>
          <p className="text-2xl font-bold text-gray-900">98</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Monthly</p>
          <p className="text-2xl font-bold text-gray-900">29</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-600">$4,683</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">VIP Members</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Member</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Plan</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Since</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Free Service</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_MEMBERS.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500">💎</span>
                    <span className="font-medium text-gray-900">{member.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-900">{member.type}</td>
                <td className="px-5 py-3 text-gray-600">{member.since}</td>
                <td className="px-5 py-3">
                  {member.freeServiceUsed ? (
                    <span className="text-gray-500">Used</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Available
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
