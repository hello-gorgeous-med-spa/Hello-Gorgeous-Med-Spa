// ============================================================
// NEW CHART NOTE PAGE
// SOAP Charting Interface for Providers
// ============================================================

import Link from 'next/link';
import ChartEditor from './ChartEditor';

// Mock data - would come from URL params in real implementation
const MOCK_CLIENT = {
  id: 'c1',
  firstName: 'Jennifer',
  lastName: 'Martinez',
  dateOfBirth: '1985-03-15',
  allergies: ['Lidocaine'],
  medications: ['Synthroid 50mcg daily'],
  lastBotoxDate: '2025-10-15',
  lastBotoxUnits: 36,
};

const MOCK_APPOINTMENT = {
  id: 'apt1',
  service: 'Botox - Full Face',
  scheduledTime: '9:00 AM',
  duration: 30,
};

export default function NewChartPage({
  searchParams,
}: {
  searchParams: { client?: string; appointment?: string };
}) {
  const client = MOCK_CLIENT;
  const appointment = MOCK_APPOINTMENT;
  const age = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Client Info */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/provider/clients/${client.id}`}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="font-semibold text-gray-900">
                  New Chart: {client.firstName} {client.lastName}
                </h1>
                <p className="text-sm text-gray-500">
                  {appointment.service} • {appointment.scheduledTime}
                </p>
              </div>
            </div>

            {/* Client Alerts - Always Visible */}
            {client.allergies.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600">⚠️</span>
                <span className="text-sm font-medium text-red-700">
                  Allergy: {client.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Client Quick Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Client Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {client.firstName[0]}{client.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{age} years old</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.allergies.map((a) => (
                      <span key={a} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Medications</p>
                  <ul className="mt-1 text-gray-700">
                    {client.medications.map((m) => (
                      <li key={m}>• {m}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Last Botox</p>
                  <p className="text-gray-900">{client.lastBotoxDate}</p>
                  <p className="text-gray-500">{client.lastBotoxUnits} units</p>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  💉 Botox Full Face
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  💋 Lip Filler
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  ✨ Dermaplaning
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  💧 IV Therapy
                </button>
              </div>
            </div>
          </div>

          {/* Main Chart Editor */}
          <div className="lg:col-span-3">
            <ChartEditor
              clientId={client.id}
              appointmentId={appointment.id}
              defaultService={appointment.service}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
