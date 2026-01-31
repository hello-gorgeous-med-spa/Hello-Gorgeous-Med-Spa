'use client';

// ============================================================
// ADMIN STAFF PAGE
// Manage providers, staff, and permissions
// Live data from provider configuration
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { ACTIVE_PROVIDERS, STAFF_ROLES, type Provider } from '@/lib/hgos/providers';

function getRoleBadge(role: string) {
  const styles: Record<string, string> = {
    owner: 'bg-pink-100 text-pink-700',
    provider: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
  };
  const labels: Record<string, string> = {
    owner: 'Owner',
    provider: 'Provider',
    staff: 'Staff',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
      {labels[role] || role}
    </span>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${ampm}`;
}

export default function AdminStaffPage() {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<Provider | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get active providers from configuration
  const staff = ACTIVE_PROVIDERS.filter(p => p.isActive);
  const providers = staff.filter(s => s.role === 'provider' || s.canPrescribe);
  const chartingStaff = staff.filter(s => s.canPrescribe);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Providers</h1>
          <p className="text-gray-500">Manage team members and permissions</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/staff/schedule"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            📅 Manage Schedules
          </Link>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + Add Team Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Staff</p>
          <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="text-2xl font-bold text-purple-600">{providers.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Today</p>
          <p className="text-2xl font-bold text-green-600">{staff.filter(s => s.isActive).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Can Prescribe</p>
          <p className="text-2xl font-bold text-gray-900">{chartingStaff.length}</p>
        </div>
      </div>

      {/* Roles Legend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(STAFF_ROLES).map(([id, role]) => (
            <div key={id} className="flex items-start gap-3">
              {getRoleBadge(id)}
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
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.fullName}
                          {member.credentials && (
                            <span className="text-gray-500 font-normal ml-1">
                              , {member.credentials}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{member.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-900">{member.email}</p>
                    {member.phone && <p className="text-sm text-gray-500">{member.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    {getRoleBadge(member.role)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'owner' && (
                        <span className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">
                          Full Access
                        </span>
                      )}
                      {member.canPrescribe && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          Prescribe
                        </span>
                      )}
                      {member.role === 'provider' && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Chart
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingStaff(member)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <Link
                        href="/admin/staff/schedule"
                        className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        Schedule
                      </Link>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Weekly Schedules</h2>
          <Link
            href="/admin/staff/schedule"
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Edit Schedules →
          </Link>
        </div>
        <div className="space-y-6">
          {staff.map((member) => (
            <div key={member.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: member.color }}
                >
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.displayName}
                  </p>
                  <p className="text-xs text-gray-500">{member.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-sm">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                  const schedule = member.schedule[day];
                  return (
                    <div key={day} className="text-center">
                      <p className="text-xs text-gray-500 capitalize mb-1">{day.slice(0, 3)}</p>
                      {schedule ? (
                        <p className="text-gray-900 text-xs">
                          {formatTime(schedule.start)} - {formatTime(schedule.end)}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-xs">Off</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {member.services && member.services[0] !== 'all' && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.services.map((service) => (
                      <span key={service} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded capitalize">
                        {service.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Team Member</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue={editingStaff.firstName}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue={editingStaff.lastName}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  defaultValue={editingStaff.title}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
                <input
                  type="text"
                  defaultValue={editingStaff.credentials}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={editingStaff.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={editingStaff.phone || ''}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  defaultValue={editingStaff.role}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="owner">Owner</option>
                  <option value="provider">Provider</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={editingStaff.canPrescribe}
                    className="w-4 h-4 text-pink-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Can Prescribe</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={editingStaff.isActive}
                    className="w-4 h-4 text-pink-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Save to database
                  alert('Changes saved! (Database integration pending)');
                  setEditingStaff(null);
                }}
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Nurse Practitioner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., FNP-BC, RN-S"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="email@hellogorgeousmedspa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="(630) 555-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="">Select role...</option>
                  <option value="provider">Provider</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Save to database
                  alert('Staff member added! (Database integration pending)');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
