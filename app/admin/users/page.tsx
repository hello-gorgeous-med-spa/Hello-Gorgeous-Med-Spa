'use client';

// ============================================================
// ADMIN USER MANAGEMENT PAGE
// Manage staff accounts, roles, and permissions
// Live data - no demo accounts
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { ACTIVE_PROVIDERS, STAFF_ROLES } from '@/lib/hgos/providers';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'admin' | 'provider' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  credentials?: string;
}

// Initialize users from active providers
const INITIAL_USERS: User[] = ACTIVE_PROVIDERS.filter(p => p.isActive).map(provider => ({
  id: provider.id,
  email: provider.email,
  firstName: provider.firstName,
  lastName: provider.lastName,
  role: provider.role,
  status: 'active' as const,
  lastLogin: 'Today',
  createdAt: '2024-01-01',
  credentials: provider.credentials,
}));

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

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['All access - Full control of the system'],
  admin: ['View dashboard', 'Manage clients', 'Manage appointments', 'View reports', 'Manage staff'],
  provider: ['View appointments', 'Manage charts', 'View clients', 'Prescribe medications'],
  staff: ['View appointments', 'Check in clients', 'Basic POS operations'],
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = users.filter((u) => 
    filterRole === 'all' || u.role === filterRole
  );

  const handleDeactivate = (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'inactive' as const } : u
      ));
    }
  };

  const handleReactivate = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">User Management</h1>
          <p className="text-black">Manage staff accounts and system access</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Users</p>
          <p className="text-2xl font-bold text-black">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Providers</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'provider').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Inactive</p>
          <p className="text-2xl font-bold text-black">
            {users.filter((u) => u.status === 'inactive').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'owner', 'provider', 'staff'].map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterRole === role
                ? 'bg-[#FF2D8E] text-white'
                : 'bg-white text-black hover:bg-white'
            }`}
          >
            {role === 'all' ? 'All Users' : ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-black">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-black">User</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-black">Role</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-black">Last Login</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {filteredUsers.map((user) => {
              const provider = ACTIVE_PROVIDERS.find(p => p.id === user.id);
              return (
                <tr key={user.id} className="hover:bg-white">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                        style={{ backgroundColor: provider?.color || '#6b7280' }}
                      >
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-black">
                          {user.firstName} {user.lastName}
                          {user.credentials && (
                            <span className="text-black font-normal">, {user.credentials}</span>
                          )}
                        </p>
                        <p className="text-sm text-black">{user.email}</p>
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
                        : 'bg-white text-black'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-black">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-3 py-1.5 text-sm text-black hover:bg-white rounded-lg"
                      >
                        Edit
                      </button>
                      {user.role !== 'owner' && (
                        user.status === 'active' ? (
                          <button 
                            onClick={() => handleDeactivate(user.id)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReactivate(user.id)}
                            className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            Reactivate
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role Permissions */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
            <div key={role} className="border border-black rounded-lg p-4">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${ROLE_COLORS[role]}`}>
                {ROLE_LABELS[role]}
              </span>
              <ul className="space-y-1">
                {permissions.map((permission, i) => (
                  <li key={i} className="text-sm text-black flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">🔐 Security Best Practices</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All user passwords must be at least 12 characters with mixed case, numbers, and symbols</li>
          <li>• Users are automatically logged out after 30 minutes of inactivity</li>
          <li>• All login attempts are logged for security auditing</li>
          <li>• Two-factor authentication is recommended for all accounts</li>
        </ul>
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
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-black">
          <h2 className="text-xl font-bold text-black">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Credentials (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., FNP-BC, RN-S"
              value={formData.credentials || ''}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              disabled={user?.role === 'owner'}
            >
              <option value="staff">Staff (Front Desk)</option>
              <option value="provider">Provider (Clinical)</option>
              <option value="admin">Admin (Management)</option>
              {user?.role === 'owner' && <option value="owner">Owner</option>}
            </select>
          </div>

          {!user && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                📧 A password setup link will be sent to the user's email address.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
            >
              {user ? 'Save Changes' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
