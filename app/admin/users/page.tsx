'use client';

// ============================================================
// ADMIN USER MANAGEMENT PAGE
// Manage staff accounts, roles, and permissions
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'admin' | 'provider' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'danielle@hellogorgeousmedspa.com',
    firstName: 'Danielle',
    lastName: 'Glazier-Alcala',
    role: 'owner',
    status: 'active',
    lastLogin: '2026-01-31 8:30 AM',
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    email: 'ryan.kent@hellogorgeousmedspa.com',
    firstName: 'Ryan',
    lastName: 'Kent',
    role: 'provider',
    status: 'active',
    lastLogin: '2026-01-31 8:45 AM',
    createdAt: '2024-06-15',
  },
  {
    id: 'u3',
    email: 'staff@hellogorgeousmedspa.com',
    firstName: 'Jessica',
    lastName: 'Smith',
    role: 'staff',
    status: 'active',
    lastLogin: '2026-01-30 5:00 PM',
    createdAt: '2025-03-01',
  },
  {
    id: 'u4',
    email: 'admin@hellogorgeousmedspa.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-01-29',
    createdAt: '2025-01-01',
  },
];

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-700',
  admin: 'bg-pink-100 text-pink-700',
  provider: 'bg-purple-100 text-purple-700',
  staff: 'bg-blue-100 text-blue-700',
};

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  provider: 'Provider',
  staff: 'Staff',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = users.filter((u) => 
    filterRole === 'all' || u.role === filterRole
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage staff accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'provider').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Staff</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'staff').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Now</p>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'owner', 'admin', 'provider', 'staff'].map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterRole === role
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role === 'all' ? 'All Users' : ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">User</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Role</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Last Login</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${ROLE_COLORS[user.role].split(' ')[0]} flex items-center justify-center font-bold text-sm`}>
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : user.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {user.lastLogin || 'Never'}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Edit
                    </button>
                    {user.role !== 'owner' && (
                      <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demo Account Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Demo Accounts</h3>
        <p className="text-sm text-blue-800 mb-4">
          Use these accounts to test different role access levels:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500 font-mono">admin@hellogorgeousmedspa.com</p>
            <p className="text-xs text-gray-500">Password: admin123</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Provider</p>
            <p className="text-xs text-gray-500 font-mono">provider@hellogorgeousmedspa.com</p>
            <p className="text-xs text-gray-500">Password: provider123</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Staff</p>
            <p className="text-xs text-gray-500 font-mono">staff@hellogorgeousmedspa.com</p>
            <p className="text-xs text-gray-500">Password: staff123</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Client</p>
            <p className="text-xs text-gray-500 font-mono">client@example.com</p>
            <p className="text-xs text-gray-500">Password: client123</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSave={(user) => {
            if (editingUser) {
              setUsers(users.map((u) => u.id === user.id ? user : u));
            } else {
              setUsers([...users, { ...user, id: `u${Date.now()}` }]);
            }
            setShowAddModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      email: '',
      firstName: '',
      lastName: '',
      role: 'staff',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as User);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="staff">Staff (Front Desk)</option>
              <option value="provider">Provider (Clinical)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          {!user && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                A password reset link will be sent to the user's email address.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              {user ? 'Save Changes' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
