'use client';

// ============================================================
// USER & STAFF MANAGEMENT - OWNER CONTROLLED
// Full RBAC with capabilities, kill switch
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserCapabilities {
  can_book: boolean;
  can_chart: boolean;
  can_view_financials: boolean;
  can_process_payments: boolean;
  can_manage_inventory: boolean;
  can_view_all_clients: boolean;
  can_export_data: boolean;
  services_allowed: string[];
  unit_limit_per_day?: number;
}

interface SystemUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'owner' | 'admin' | 'provider' | 'front_desk' | 'billing';
  is_active: boolean;
  is_locked: boolean;
  last_login?: string;
  capabilities: UserCapabilities;
  created_at: string;
}

const ROLES = [
  { value: 'owner', label: 'Owner', description: 'Full system access (non-removable)', color: 'purple' },
  { value: 'admin', label: 'Admin', description: 'Full access except owner settings', color: 'pink' },
  { value: 'provider', label: 'Provider', description: 'Clinical access, charting, own schedule', color: 'blue' },
  { value: 'front_desk', label: 'Front Desk', description: 'Booking, check-in, basic client info', color: 'green' },
  { value: 'billing', label: 'Billing', description: 'Payments, invoices, financial reports', color: 'yellow' },
];

const DEFAULT_CAPABILITIES: Record<string, UserCapabilities> = {
  owner: {
    can_book: true,
    can_chart: true,
    can_view_financials: true,
    can_process_payments: true,
    can_manage_inventory: true,
    can_view_all_clients: true,
    can_export_data: true,
    services_allowed: ['all'],
  },
  admin: {
    can_book: true,
    can_chart: true,
    can_view_financials: true,
    can_process_payments: true,
    can_manage_inventory: true,
    can_view_all_clients: true,
    can_export_data: true,
    services_allowed: ['all'],
  },
  provider: {
    can_book: true,
    can_chart: true,
    can_view_financials: false,
    can_process_payments: false,
    can_manage_inventory: false,
    can_view_all_clients: false,
    can_export_data: false,
    services_allowed: ['all'],
  },
  front_desk: {
    can_book: true,
    can_chart: false,
    can_view_financials: false,
    can_process_payments: true,
    can_manage_inventory: false,
    can_view_all_clients: true,
    can_export_data: false,
    services_allowed: ['all'],
  },
  billing: {
    can_book: false,
    can_chart: false,
    can_view_financials: true,
    can_process_payments: true,
    can_manage_inventory: false,
    can_view_all_clients: true,
    can_export_data: true,
    services_allowed: [],
  },
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'user-owner',
      email: 'danielle@hellogorgeousmedspa.com',
      first_name: 'Danielle',
      last_name: 'Alcala',
      role: 'owner',
      is_active: true,
      is_locked: false,
      last_login: new Date().toISOString(),
      capabilities: DEFAULT_CAPABILITIES.owner,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'user-provider-1',
      email: 'ryan@hellogorgeousmedspa.com',
      first_name: 'Ryan',
      last_name: 'Kent',
      role: 'provider',
      is_active: true,
      is_locked: false,
      last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      capabilities: { ...DEFAULT_CAPABILITIES.provider, unit_limit_per_day: 200 },
      created_at: '2024-01-15T00:00:00Z',
    },
  ]);

  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showKillSwitch, setShowKillSwitch] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewUser = () => {
    const newUser: SystemUser = {
      id: `user-${Date.now()}`,
      email: '',
      first_name: '',
      last_name: '',
      role: 'front_desk',
      is_active: true,
      is_locked: false,
      capabilities: { ...DEFAULT_CAPABILITIES.front_desk },
      created_at: new Date().toISOString(),
    };
    setEditingUser(newUser);
    setIsCreating(true);
  };

  const saveUser = () => {
    if (!editingUser?.email || !editingUser?.first_name) {
      setMessage({ type: 'error', text: 'Email and first name are required' });
      return;
    }

    if (isCreating) {
      setUsers(prev => [...prev, editingUser]);
      setMessage({ type: 'success', text: 'User created!' });
    } else {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
      setMessage({ type: 'success', text: 'User updated!' });
    }

    setEditingUser(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const updateRole = (role: string) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      role: role as any,
      capabilities: { ...DEFAULT_CAPABILITIES[role] },
    });
  };

  const toggleCapability = (key: keyof UserCapabilities) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      capabilities: {
        ...editingUser.capabilities,
        [key]: !editingUser.capabilities[key],
      },
    });
  };

  const lockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'owner') {
      setMessage({ type: 'error', text: 'Cannot lock owner account' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_locked: !u.is_locked, is_active: u.is_locked } : u));
    setMessage({ type: 'success', text: user?.is_locked ? 'User unlocked' : 'User locked - access revoked immediately' });
    setTimeout(() => setMessage(null), 3000);
  };

  const deactivateUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'owner') {
      setMessage({ type: 'error', text: 'Cannot deactivate owner account' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
  };

  const formatDate = (iso?: string) => {
    if (!iso) return 'Never';
    return new Date(iso).toLocaleString();
  };

  const getRoleColor = (role: string) => {
    const r = ROLES.find(r => r.value === role);
    switch (r?.color) {
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'pink': return 'bg-pink-100 text-pink-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'green': return 'bg-green-100 text-green-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Users & Staff</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">User & Staff Management</h1>
          <p className="text-gray-500">{users.length} users • Full RBAC control</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowKillSwitch(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🚨 Kill Switch
          </button>
          {!editingUser && (
            <button onClick={createNewUser} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              + Add User
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Kill Switch Modal */}
      {showKillSwitch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-lg font-bold text-red-700 mb-4">🚨 Emergency Access Revocation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a user to immediately revoke all access. This action is logged and cannot be undone without owner approval.
            </p>
            <div className="space-y-2 mb-6">
              {users.filter(u => u.role !== 'owner').map(user => (
                <button
                  key={user.id}
                  onClick={() => { lockUser(user.id); setShowKillSwitch(false); }}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-red-50"
                >
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowKillSwitch(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser ? (
        /* User Editor */
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Add User' : 'Edit User'}</h2>
            <button onClick={() => { setEditingUser(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={editingUser.first_name}
                onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={editingUser.last_name}
                onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={editingUser.role === 'owner'}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="grid grid-cols-5 gap-3">
              {ROLES.map(role => (
                <button
                  key={role.value}
                  onClick={() => updateRole(role.value)}
                  disabled={editingUser.role === 'owner' && role.value !== 'owner'}
                  className={`p-3 rounded-lg border-2 text-left ${
                    editingUser.role === role.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${editingUser.role === 'owner' && role.value !== 'owner' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-medium text-sm">{role.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          {editingUser.role !== 'owner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capabilities</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'can_book', label: 'Can Book Appointments' },
                  { key: 'can_chart', label: 'Can Access/Create Charts' },
                  { key: 'can_view_financials', label: 'Can View Financial Data' },
                  { key: 'can_process_payments', label: 'Can Process Payments' },
                  { key: 'can_manage_inventory', label: 'Can Manage Inventory' },
                  { key: 'can_view_all_clients', label: 'Can View All Clients' },
                  { key: 'can_export_data', label: 'Can Export Data' },
                ].map(cap => (
                  <label key={cap.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={editingUser.capabilities[cap.key as keyof UserCapabilities] as boolean}
                      onChange={() => toggleCapability(cap.key as keyof UserCapabilities)}
                      className="w-4 h-4 text-pink-500"
                    />
                    <span className="text-sm">{cap.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Provider-specific */}
          {editingUser.role === 'provider' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Unit Limit (optional)</label>
              <input
                type="number"
                value={editingUser.capabilities.unit_limit_per_day || ''}
                onChange={(e) => setEditingUser({
                  ...editingUser,
                  capabilities: { ...editingUser.capabilities, unit_limit_per_day: parseInt(e.target.value) || undefined }
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="No limit"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex gap-6 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingUser.is_active}
                onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                disabled={editingUser.role === 'owner'}
              />
              <span>Active</span>
            </label>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingUser(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={saveUser} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        /* Users List */
        <div className="bg-white rounded-xl border divide-y">
          {users.map(user => (
            <div key={user.id} className={`p-4 ${!user.is_active || user.is_locked ? 'bg-gray-50 opacity-75' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{user.first_name} {user.last_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      {user.is_locked && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">🔒 Locked</span>
                      )}
                      {!user.is_active && !user.is_locked && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Last login: {formatDate(user.last_login)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role !== 'owner' && (
                    <>
                      <button onClick={() => setEditingUser(user)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        Edit
                      </button>
                      <button
                        onClick={() => lockUser(user.id)}
                        className={`px-3 py-1.5 text-sm rounded ${user.is_locked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        {user.is_locked ? 'Unlock' : 'Lock'}
                      </button>
                    </>
                  )}
                  {user.role === 'owner' && (
                    <span className="text-xs text-purple-600 font-medium">👑 System Owner</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Permissions Reference */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Permission</th>
                {ROLES.map(role => (
                  <th key={role.value} className="text-center p-2">{role.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Book Appointments', key: 'can_book' },
                { label: 'Access Charts', key: 'can_chart' },
                { label: 'View Financials', key: 'can_view_financials' },
                { label: 'Process Payments', key: 'can_process_payments' },
                { label: 'Manage Inventory', key: 'can_manage_inventory' },
                { label: 'View All Clients', key: 'can_view_all_clients' },
                { label: 'Export Data', key: 'can_export_data' },
              ].map(perm => (
                <tr key={perm.key} className="border-b">
                  <td className="p-2">{perm.label}</td>
                  {ROLES.map(role => (
                    <td key={role.value} className="text-center p-2">
                      {DEFAULT_CAPABILITIES[role.value][perm.key as keyof UserCapabilities] ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
