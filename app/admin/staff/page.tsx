'use client';

// ============================================================
// ADMIN STAFF PAGE
// Manage providers, staff, and permissions
// ============================================================

import { useState } from 'react';

// Mock data
const MOCK_STAFF = [
  {
    id: 'u1',
    firstName: 'Danielle',
    lastName: 'Glazier-Alcala',
    email: 'danielle@hellogorgeousmedspa.com',
    phone: '(630) 636-6193',
    role: 'admin',
    title: 'Owner',
    isActive: true,
    canChart: false,
    canPrescribe: false,
    lastLogin: '2026-01-31 9:00 AM',
  },
  {
    id: 'u2',
    firstName: 'Ryan',
    lastName: 'Kent',
    email: 'ryan@hellogorgeousmedspa.com',
    phone: '(630) 555-0001',
    role: 'provider',
    title: 'APRN',
    credentials: 'APRN, FNP-BC',
    npiNumber: '1234567890',
    isActive: true,
    canChart: true,
    canPrescribe: true,
    services: ['Botox', 'Fillers', 'Weight Loss', 'IV Therapy'],
    schedule: {
      monday: { start: '9:00 AM', end: '5:00 PM' },
      tuesday: { start: '9:00 AM', end: '5:00 PM' },
      wednesday: { start: '9:00 AM', end: '5:00 PM' },
      thursday: { start: '9:00 AM', end: '5:00 PM' },
      friday: { start: '9:00 AM', end: '3:00 PM' },
    },
    lastLogin: '2026-01-31 8:45 AM',
  },
  {
    id: 'u3',
    firstName: 'Jessica',
    lastName: 'Smith',
    email: 'jessica@hellogorgeousmedspa.com',
    phone: '(630) 555-0002',
    role: 'staff',
    title: 'Medical Assistant',
    isActive: true,
    canChart: false,
    canPrescribe: false,
    services: ['Facials', 'Dermaplaning', 'Lashes', 'Brows'],
    lastLogin: '2026-01-30 4:30 PM',
  },
];

const ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to all features', color: 'red' },
  { id: 'provider', name: 'Provider', description: 'Can chart, prescribe, and see all clients', color: 'purple' },
  { id: 'staff', name: 'Staff', description: 'Can book and manage appointments', color: 'blue' },
];

function getRoleBadge(role: string) {
  const styles: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    provider: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
  };
  const labels: Record<string, string> = {
    admin: 'Admin',
    provider: 'Provider',
    staff: 'Staff',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
      {labels[role]}
    </span>
  );
}

export default function AdminStaffPage() {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Providers</h1>
          <p className="text-gray-500">Manage team members and permissions</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors">
          + Add Team Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Staff</p>
          <p className="text-2xl font-bold text-gray-900">{MOCK_STAFF.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="text-2xl font-bold text-purple-600">
            {MOCK_STAFF.filter((s) => s.role === 'provider').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Today</p>
          <p className="text-2xl font-bold text-green-600">
            {MOCK_STAFF.filter((s) => s.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Can Chart</p>
          <p className="text-2xl font-bold text-gray-900">
            {MOCK_STAFF.filter((s) => s.canChart).length}
          </p>
        </div>
      </div>

      {/* Roles Legend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <div key={role.id} className="flex items-start gap-3">
              {getRoleBadge(role.id)}
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Team Member</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Contact</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Role</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Permissions</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Last Login</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STAFF.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {staff.firstName[0]}{staff.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {staff.firstName} {staff.lastName}
                          {staff.credentials && (
                            <span className="text-gray-500 font-normal ml-1">
                              , {staff.credentials}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{staff.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-900">{staff.email}</p>
                    <p className="text-sm text-gray-500">{staff.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    {getRoleBadge(staff.role)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {staff.canChart && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Chart
                        </span>
                      )}
                      {staff.canPrescribe && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          Prescribe
                        </span>
                      )}
                      {!staff.canChart && !staff.canPrescribe && (
                        <span className="text-gray-400 text-sm">Basic</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600">{staff.lastLogin}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedStaff(staff.id)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      {staff.role === 'provider' && (
                        <button className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                          Schedule
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Schedules */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Provider Schedules</h2>
        <div className="space-y-6">
          {MOCK_STAFF.filter((s) => s.role === 'provider').map((provider) => (
            <div key={provider.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm">
                  {provider.firstName[0]}{provider.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {provider.firstName} {provider.lastName}, {provider.credentials}
                  </p>
                  <p className="text-xs text-gray-500">NPI: {provider.npiNumber}</p>
                </div>
              </div>
              {provider.schedule && (
                <div className="grid grid-cols-5 gap-2 text-sm">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                    const schedule = provider.schedule?.[day as keyof typeof provider.schedule];
                    return (
                      <div key={day} className="text-center">
                        <p className="text-xs text-gray-500 capitalize mb-1">{day.slice(0, 3)}</p>
                        {schedule ? (
                          <p className="text-gray-900">
                            {schedule.start.replace(' AM', 'a').replace(' PM', 'p')} - {schedule.end.replace(' AM', 'a').replace(' PM', 'p')}
                          </p>
                        ) : (
                          <p className="text-gray-400">Off</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {provider.services && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.services.map((service) => (
                      <span key={service} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
