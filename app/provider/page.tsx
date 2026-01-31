// ============================================================
// PROVIDER DASHBOARD HOME
// Daily schedule and quick access to clinical tools
// ============================================================

import Link from 'next/link';

// Mock data - will be replaced with Supabase queries
const MOCK_TODAY_SCHEDULE = [
  {
    id: '1',
    time: '9:00 AM',
    duration: 30,
    client: { id: 'c1', firstName: 'Jennifer', lastName: 'Martinez', isNew: false },
    service: 'Botox - Full Face',
    status: 'checked_in',
    intakeComplete: true,
    consentValid: true,
  },
  {
    id: '2',
    time: '9:45 AM',
    duration: 45,
    client: { id: 'c2', firstName: 'Amanda', lastName: 'Chen', isNew: true },
    service: 'New Client Consultation',
    status: 'confirmed',
    intakeComplete: false,
    consentValid: false,
  },
  {
    id: '3',
    time: '10:30 AM',
    duration: 30,
    client: { id: 'c3', firstName: 'Sarah', lastName: 'Johnson', isNew: false },
    service: 'Lip Filler',
    status: 'confirmed',
    intakeComplete: true,
    consentValid: true,
  },
  {
    id: '4',
    time: '11:15 AM',
    duration: 60,
    client: { id: 'c4', firstName: 'Michelle', lastName: 'Williams', isNew: false },
    service: 'Semaglutide Follow-up',
    status: 'confirmed',
    intakeComplete: true,
    consentValid: true,
  },
  {
    id: '5',
    time: '1:00 PM',
    duration: 45,
    client: { id: 'c5', firstName: 'Rachel', lastName: 'Brown', isNew: false },
    service: 'Dermaplaning + Chemical Peel',
    status: 'confirmed',
    intakeComplete: true,
    consentValid: false,
  },
  {
    id: '6',
    time: '2:00 PM',
    duration: 30,
    client: { id: 'c6', firstName: 'Emily', lastName: 'Davis', isNew: false },
    service: 'Botox Touch-up',
    status: 'confirmed',
    intakeComplete: true,
    consentValid: true,
  },
];

const MOCK_PENDING_CHARTS = [
  { id: 'ch1', clientName: 'Lisa Thompson', service: 'Botox', date: 'Yesterday' },
  { id: 'ch2', clientName: 'Karen White', service: 'Filler', date: '2 days ago' },
];

const MOCK_MESSAGES = [
  { id: 'm1', from: 'Sarah Johnson', preview: 'Question about my lip filler...', time: '10 min ago', unread: true },
  { id: 'm2', from: 'Michelle Williams', preview: 'Can I reschedule my appointment?', time: '1 hr ago', unread: true },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'checked_in': return 'bg-green-100 text-green-700 border-green-200';
    case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'checked_in': return 'Checked In';
    case 'confirmed': return 'Confirmed';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}

export default function ProviderDashboard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Good Morning, Ryan 👋</h1>
        <p className="text-gray-500">{today}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{MOCK_TODAY_SCHEDULE.length}</p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-gray-500">Checked In</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{MOCK_PENDING_CHARTS.length}</p>
              <p className="text-sm text-gray-500">Pending Charts</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-gray-500">New Client</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
              <Link
                href="/provider/schedule"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full Schedule →
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {MOCK_TODAY_SCHEDULE.map((apt) => (
                <div
                  key={apt.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="w-20 flex-shrink-0">
                      <p className="font-semibold text-gray-900">{apt.time}</p>
                      <p className="text-xs text-gray-500">{apt.duration} min</p>
                    </div>

                    {/* Client & Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/provider/clients/${apt.client.id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {apt.client.firstName} {apt.client.lastName}
                        </Link>
                        {apt.client.isNew && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            NEW
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{apt.service}</p>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-3 mt-2">
                        {!apt.intakeComplete && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <span>⚠️</span> Intake Needed
                          </span>
                        )}
                        {!apt.consentValid && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <span>📝</span> Consent Needed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {apt.status === 'checked_in' ? (
                        <Link
                          href={`/provider/chart/new?client=${apt.client.id}&appointment=${apt.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <span>📝</span> Start Chart
                        </Link>
                      ) : (
                        <Link
                          href={`/provider/clients/${apt.client.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Charts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-amber-500">⚡</span>
                Pending Charts
              </h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                {MOCK_PENDING_CHARTS.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {MOCK_PENDING_CHARTS.map((chart) => (
                <Link
                  key={chart.id}
                  href={`/provider/charts/${chart.id}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{chart.clientName}</p>
                  <p className="text-sm text-gray-500">
                    {chart.service} • {chart.date}
                  </p>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <Link
                href="/provider/charts?status=draft"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All Pending →
              </Link>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>💬</span>
                Messages
              </h2>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                2 new
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {MOCK_MESSAGES.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/provider/messages/${msg.id}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{msg.from}</p>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <Link
                href="/provider/messages"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All Messages →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/provider/chart/new"
                className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="text-xl">📝</span>
                <span className="font-medium">New Chart Note</span>
              </Link>
              <Link
                href="/provider/clients"
                className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="text-xl">🔍</span>
                <span className="font-medium">Search Clients</span>
              </Link>
              <Link
                href="/provider/templates"
                className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="text-xl">📄</span>
                <span className="font-medium">Chart Templates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
