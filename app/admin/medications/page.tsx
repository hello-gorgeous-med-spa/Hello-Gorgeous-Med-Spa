'use client';

// ============================================================
// ADMIN MEDICATIONS PAGE
// Track medications administered
// ============================================================

const MOCK_MEDICATIONS = [
  { id: 'm1', date: '2026-01-31', client: 'Michelle Williams', medication: 'Semaglutide 0.5mg', provider: 'Ryan Kent, APRN' },
  { id: 'm2', date: '2026-01-30', client: 'Jennifer Martinez', medication: 'Botox 40 units', provider: 'Ryan Kent, APRN' },
  { id: 'm3', date: '2026-01-30', client: 'Sarah Johnson', medication: 'Juvederm Ultra 1mL', provider: 'Ryan Kent, APRN' },
  { id: 'm4', date: '2026-01-29', client: 'Rachel Brown', medication: 'Semaglutide 0.25mg', provider: 'Ryan Kent, APRN' },
  { id: 'm5', date: '2026-01-29', client: 'Lisa Thompson', medication: 'Dysport 60 units', provider: 'Ryan Kent, APRN' },
];

export default function AdminMedicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
        <p className="text-gray-500">Track medications administered to clients</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900">189</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Botox/Dysport</p>
          <p className="text-2xl font-bold text-purple-600">2,450 units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Filler</p>
          <p className="text-2xl font-bold text-pink-600">38 syringes</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Administrations</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Client</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Medication</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Provider</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_MEDICATIONS.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-900">{med.date}</td>
                <td className="px-5 py-3 text-gray-900">{med.client}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{med.medication}</td>
                <td className="px-5 py-3 text-gray-600">{med.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Medication tracking is automatically recorded when charting is completed. 
          E-prescribing requires Surescripts integration (Phase 3).
        </p>
      </div>
    </div>
  );
}
