'use client';

// ============================================================
// ADMIN USER MANAGEMENT PAGE
// Full CRUD with Role-Based Access Control
// Owner account is PROTECTED - cannot be deleted or demoted
// ============================================================

import { useState, useEffect } from 'react';
import { ACTIVE_PROVIDERS } from '@/lib/hgos/providers';
import { getStoredUser } from '@/lib/hgos/auth';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'owner' | 'admin' | 'provider' | 'staff' | 'readonly';
  phone?: string;
  is_active: boolean;
  is_protected?: boolean;
  two_factor_enabled?: boolean;
  requires_2fa?: boolean;
  last_login_at?: string;
  login_count?: number;
  locked_until?: string;
  created_at: string;
  provider_id?: string;
}

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-800 border border-amber-300',
  admin: 'bg-pink-100 text-pink-800 border border-pink-300',
  provider: 'bg-purple-100 text-purple-800 border border-purple-300',
  staff: 'bg-blue-100 text-blue-800 border border-blue-300',
  readonly: 'bg-gray-100 text-gray-800 border border-gray-300',
};

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  provider: 'Provider',
  staff: 'Staff',
  readonly: 'Read-Only',
};

const ROLE_DESCRIPTIONS: Record<string, string[]> = {
  owner: [
    'Full system access',
    'Manage all users & roles',
    'Access audit logs',
    'Business settings',
    'Cannot be deleted',
  ],
  admin: [
    'Dashboard & reports',
    'Manage clients & appointments',
    'Marketing & content',
    'Staff management',
    'Cannot access audit logs',
  ],
  provider: [
    'View own appointments',
    'Manage patient charts',
    'Clinical notes & prescribing',
    'POS checkout',
    'Limited client access',
  ],
  staff: [
    'Front desk operations',
    'Check-in clients',
    'Basic POS operations',
    'View appointments',
    'No report access',
  ],
  readonly: [
    'View-only dashboard',
    'View appointments',
    'View clients',
    'No edit permissions',
    'For auditors/observers',
  ],
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('active');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    setCurrentUser(stored);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch('/api/users', { signal: controller.signal }).catch(() => null);
      clearTimeout(timeout);
      
      if (res?.ok) {
        const data = await res.json().catch(() => ({}));
        setUsers(data.users || []);
      } else {
        // Fallback to providers
        setUsers(ACTIVE_PROVIDERS.filter(p => p.isActive).map(p => ({
          id: p.id,
          email: p.email,
          first_name: p.firstName,
          last_name: p.lastName,
          role: p.role as any,
          is_active: true,
          is_protected: p.role === 'owner',
          created_at: '2024-01-01',
        })));
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUser?.role === 'owner';

  const filteredUsers = users.filter((u) => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterActive === 'active' && !u.is_active) return false;
    if (filterActive === 'inactive' && u.is_active) return false;
    return true;
  });

  const handleDeactivate = async (user: User) => {
    if (user.is_protected) {
      setError('Cannot deactivate protected Owner account');
      return;
    }
    
    if (!confirm(`Deactivate ${user.first_name} ${user.last_name}? They will lose system access.`)) {
      return;
    }
    
    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: false } : u));
      } else {
        setError(data.error || 'Failed to deactivate user');
      }
    } catch (e) {
      setError('Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (user: User) => {
    setActionLoading(user.id);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, action: 'reactivate' }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: true } : u));
      } else {
        setError(data.error || 'Failed to reactivate user');
      }
    } catch (e) {
      setError('Failed to reactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (user: User, newRole: string) => {
    if (user.is_protected || user.role === 'owner') {
      setError('Cannot change role of protected Owner account');
      return;
    }
    
    if (newRole === 'owner') {
      setError('Cannot promote to Owner role');
      return;
    }
    
    setActionLoading(user.id);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, action: 'change_role', role: newRole }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole as any } : u));
        setShowRoleModal(null);
      } else {
        setError(data.error || 'Failed to change role');
      }
    } catch (e) {
      setError('Failed to change role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async (user: User) => {
    setActionLoading(user.id);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, action: 'unlock' }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, locked_until: undefined } : u));
      } else {
        setError(data.error || 'Failed to unlock user');
      }
    } catch (e) {
      setError('Failed to unlock user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset2FA = async (user: User) => {
    if (!confirm(`Reset 2FA for ${user.first_name}? They will need to set it up again.`)) {
      return;
    }
    
    setActionLoading(user.id);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, action: 'reset_2fa' }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, two_factor_enabled: false } : u));
      } else {
        setError(data.error || 'Failed to reset 2FA');
      }
    } catch (e) {
      setError('Failed to reset 2FA');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    setActionLoading('save');
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser ? { ...userData, id: editingUser.id } : userData;
      
      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (editingUser) {
          setUsers(users.map(u => u.id === editingUser.id ? data.user : u));
        } else {
          setUsers([data.user, ...users]);
        }
        setShowAddModal(false);
        setEditingUser(null);
      } else {
        setError(data.error || 'Failed to save user');
      }
    } catch (e) {
      setError('Failed to save user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">User Management</h1>
          <p className="text-gray-600">
            {isOwner ? 'Full access - manage all users and roles' : 'View and manage team members'}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            + Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-black">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-pink-600">
            {users.filter((u) => u.role === 'admin' || u.role === 'owner').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'provider').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Staff</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'staff').length}
          </p>
        </div>
      </div>

      {/* Owner Protection Notice */}
      {isOwner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 text-xl">🔒</span>
            <div>
              <h3 className="font-semibold text-amber-800">Owner Account Protected</h3>
              <p className="text-sm text-amber-700">
                Your account (danielle@hellogorgeousmedspa.com) is protected. It cannot be deleted, 
                deactivated, or have its role changed. This ensures you always have full system access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {['all', 'owner', 'admin', 'provider', 'staff', 'readonly'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterRole === role
                  ? 'bg-[#FF2D8E] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : ROLE_LABELS[role]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterActive === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setFilterActive('active')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterActive === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive('inactive')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterActive === 'inactive'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">User</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">2FA</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Last Login</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No users found matching filters
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const provider = ACTIVE_PROVIDERS.find(p => p.id === user.id || p.email === user.email);
                const isLocked = user.locked_until && new Date(user.locked_until) > new Date();
                const isProtected = user.is_protected || user.role === 'owner';
                
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                          style={{ backgroundColor: provider?.color || '#6b7280' }}
                        >
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            {isProtected && (
                              <span className="text-amber-500" title="Protected Account">🔒</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                        {isOwner && !isProtected && (
                          <button
                            onClick={() => setShowRoleModal(user)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Change Role"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isLocked ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                          🔐 Locked
                        </span>
                      ) : user.is_active ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {user.two_factor_enabled ? (
                        <span className="text-green-600" title="2FA Enabled">✓ Enabled</span>
                      ) : user.requires_2fa ? (
                        <span className="text-amber-600" title="2FA Required">⚠️ Required</span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {user.last_login_at 
                        ? new Date(user.last_login_at).toLocaleDateString()
                        : 'Never'}
                      {user.login_count && (
                        <span className="text-xs text-gray-400 ml-1">({user.login_count}x)</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actionLoading === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit User"
                            >
                              Edit
                            </button>
                            
                            {isOwner && isLocked && (
                              <button 
                                onClick={() => handleUnlock(user)}
                                className="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                title="Unlock Account"
                              >
                                Unlock
                              </button>
                            )}
                            
                            {isOwner && user.two_factor_enabled && (
                              <button 
                                onClick={() => handleReset2FA(user)}
                                className="px-2 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded"
                                title="Reset 2FA"
                              >
                                Reset 2FA
                              </button>
                            )}
                            
                            {!isProtected && isOwner && (
                              user.is_active ? (
                                <button 
                                  onClick={() => handleDeactivate(user)}
                                  className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                  title="Deactivate User"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleReactivate(user)}
                                  className="px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                                  title="Reactivate User"
                                >
                                  Reactivate
                                </button>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Reference */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Role Permissions Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(ROLE_DESCRIPTIONS).map(([role, permissions]) => (
            <div key={role} className="border border-gray-200 rounded-lg p-4">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${ROLE_COLORS[role]}`}>
                {ROLE_LABELS[role]}
              </span>
              <ul className="space-y-1">
                {permissions.map((permission, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">🔐 Security Controls</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Owner account is protected and cannot be modified or deleted</li>
          <li>• Only Owner can change user roles or create Admin accounts</li>
          <li>• Accounts lock after 5 failed login attempts</li>
          <li>• All login attempts and role changes are logged to audit trail</li>
          <li>• Two-factor authentication recommended for all admin accounts</li>
        </ul>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          isOwner={isOwner}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          loading={actionLoading === 'save'}
        />
      )}

      {/* Change Role Modal */}
      {showRoleModal && (
        <RoleModal
          user={showRoleModal}
          onClose={() => setShowRoleModal(null)}
          onChangeRole={handleChangeRole}
          loading={actionLoading === showRoleModal.id}
        />
      )}
    </div>
  );
}

// User Add/Edit Modal
function UserModal({
  user,
  isOwner,
  onClose,
  onSave,
  loading,
}: {
  user: User | null;
  isOwner: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
    }
  );

  const isProtected = user?.is_protected || user?.role === 'owner';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={!!user}
            />
            {user && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {isOwner && !isProtected && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="staff">Staff (Front Desk)</option>
                <option value="provider">Provider (Clinical)</option>
                <option value="admin">Admin (Management)</option>
                <option value="readonly">Read-Only (Observer)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Note: Owner role cannot be assigned to other users
              </p>
            </div>
          )}

          {isProtected && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                🔒 This is a protected Owner account. Role cannot be changed.
              </p>
            </div>
          )}

          {!user && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📧 A password setup link will be sent to the user's email address.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {user ? 'Save Changes' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Change Role Modal
function RoleModal({
  user,
  onClose,
  onChangeRole,
  loading,
}: {
  user: User;
  onClose: () => void;
  onChangeRole: (user: User, newRole: string) => void;
  loading: boolean;
}) {
  const [selectedRole, setSelectedRole] = useState(user.role);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Change Role
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Change role for <strong>{user.first_name} {user.last_name}</strong>
          </p>

          <div className="space-y-2">
            {['admin', 'provider', 'staff', 'readonly'].map((role) => (
              <label
                key={role}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === role
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role as any)}
                    className="text-pink-500"
                  />
                  <div>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${ROLE_COLORS[role]}`}>
                      {ROLE_LABELS[role]}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {ROLE_DESCRIPTIONS[role][0]}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ This change will take effect immediately. The user may need to log in again.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => onChangeRole(user, selectedRole)}
              disabled={loading || selectedRole === user.role}
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              Change Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
