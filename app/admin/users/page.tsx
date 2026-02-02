'use client';

// ============================================================
// USER & ACCESS MANAGEMENT - RBAC CONTROL CENTER
// Role-based access control with kill switch functionality
// All access changes are logged for compliance
// ============================================================

import { useState, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  last_login?: string;
  phone?: string;
  is_provider?: boolean;
  provider_id?: string;
}

interface AccessLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const ROLES: Role[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full system access - all features, settings, and financials',
    permissions: ['*'],
    userCount: 0,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative access - manage users, services, and view reports',
    permissions: [
      'view:dashboard', 'view:reports', 'view:clients', 'edit:clients',
      'view:appointments', 'edit:appointments', 'view:services', 'edit:services',
      'view:inventory', 'edit:inventory', 'view:marketing', 'edit:marketing',
      'view:users', 'edit:users', 'view:compliance'
    ],
    userCount: 0,
  },
  {
    id: 'provider',
    name: 'Provider',
    description: 'Clinical access - charting, patient info, and personal schedule',
    permissions: [
      'view:dashboard', 'view:clients', 'edit:clients',
      'view:appointments', 'edit:appointments', 'view:charting', 'edit:charting',
      'view:photos', 'edit:photos', 'view:schedule'
    ],
    userCount: 0,
  },
  {
    id: 'staff',
    name: 'Front Desk Staff',
    description: 'Operational access - booking, check-in, POS, basic client info',
    permissions: [
      'view:dashboard', 'view:clients', 'view:appointments', 'edit:appointments',
      'use:pos', 'view:schedule'
    ],
    userCount: 0,
  },
  {
    id: 'client',
    name: 'Client',
    description: 'Client portal access - view own appointments and history',
    permissions: ['view:portal', 'edit:own_profile'],
    userCount: 0,
  },
];

const PERMISSION_CATEGORIES = [
  {
    name: 'Dashboard & Reports',
    permissions: ['view:dashboard', 'view:reports', 'export:reports'],
  },
  {
    name: 'Clients',
    permissions: ['view:clients', 'edit:clients', 'delete:clients', 'export:clients'],
  },
  {
    name: 'Appointments',
    permissions: ['view:appointments', 'edit:appointments', 'delete:appointments'],
  },
  {
    name: 'Clinical',
    permissions: ['view:charting', 'edit:charting', 'sign:charting', 'view:photos', 'edit:photos'],
  },
  {
    name: 'Financial',
    permissions: ['view:financial', 'edit:pricing', 'process:refunds', 'view:transactions'],
  },
  {
    name: 'Inventory',
    permissions: ['view:inventory', 'edit:inventory', 'adjust:inventory'],
  },
  {
    name: 'Users & Access',
    permissions: ['view:users', 'edit:users', 'suspend:users', 'delete:users'],
  },
  {
    name: 'System',
    permissions: ['view:settings', 'edit:settings', 'view:audit_logs'],
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function UserAccessManagement() {
  // State
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'logs' | 'permissions'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmKillSwitch, setConfirmKillSwitch] = useState<User | null>(null);
  const [newUserModal, setNewUserModal] = useState(false);

  // New user form
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    full_name: '',
    role: 'staff',
    phone: '',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users (using providers endpoint as proxy for team)
        const provRes = await fetch('/api/providers');
        const provData = await provRes.json();
        const providers = provData.providers || [];

        // Transform providers to users format
        const userList: User[] = providers.map((p: any) => ({
          id: p.id,
          email: p.email || `${p.first_name?.toLowerCase() || 'user'}@hellogorgeousmedspa.com`,
          full_name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Team Member',
          role: p.is_admin ? 'admin' : 'provider',
          status: p.is_active !== false ? 'active' : 'inactive',
          created_at: p.created_at || new Date().toISOString(),
          last_login: p.last_login,
          phone: p.phone,
          is_provider: true,
          provider_id: p.id,
        }));

        // Add demo users if list is empty
        if (userList.length === 0) {
          userList.push(
            {
              id: '1',
              email: 'owner@hellogorgeousmedspa.com',
              full_name: 'Owner',
              role: 'owner',
              status: 'active',
              created_at: '2024-01-01',
            },
            {
              id: '2',
              email: 'frontdesk@hellogorgeousmedspa.com',
              full_name: 'Front Desk',
              role: 'staff',
              status: 'active',
              created_at: '2024-06-01',
            }
          );
        }

        setUsers(userList);

        // Fetch audit logs
        try {
          const logsRes = await fetch('/api/audit?limit=50');
          const logsData = await logsRes.json();
          if (logsData.logs) {
            setAccessLogs(logsData.logs.map((log: any) => ({
              id: log.id,
              user_id: log.user_id,
              user_name: log.user_name || 'System',
              action: log.action,
              resource: log.resource_type,
              details: log.details || '',
              ip_address: log.ip_address,
              timestamp: log.created_at,
            })));
          }
        } catch (e) {
          console.log('No audit logs available');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    if (searchQuery && !user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    return true;
  });

  // Kill switch - immediately suspend user access
  const handleKillSwitch = async (user: User) => {
    try {
      // Update user status
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      
      // If they're a provider, update via provider API
      if (user.is_provider && user.provider_id) {
        await fetch(`/api/providers/${user.provider_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: newStatus === 'active' }),
        });
      }

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));

      // Log the action
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newStatus === 'suspended' ? 'user_suspended' : 'user_reactivated',
          resource_type: 'user',
          resource_id: user.id,
          details: `User ${user.full_name} (${user.email}) was ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`,
        }),
      });

      setConfirmKillSwitch(null);
      alert(`User ${user.full_name} has been ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`);
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status');
    }
  };

  // Update user role
  const handleUpdateRole = async (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      // Update local state first
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      // Log the action
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'role_changed',
          resource_type: 'user',
          resource_id: userId,
          details: `User ${user.full_name} role changed from ${user.role} to ${newRole}`,
        }),
      });

      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.full_name) {
      alert('Email and name are required');
      return;
    }

    try {
      // Create as provider if role is provider
      if (newUserForm.role === 'provider') {
        const [firstName, ...lastParts] = newUserForm.full_name.split(' ');
        const lastName = lastParts.join(' ');
        
        const res = await fetch('/api/providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: newUserForm.email,
            phone: newUserForm.phone,
            is_active: true,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(prev => [...prev, {
            id: data.provider?.id || Date.now().toString(),
            email: newUserForm.email,
            full_name: newUserForm.full_name,
            role: newUserForm.role,
            status: 'active',
            created_at: new Date().toISOString(),
            is_provider: true,
            provider_id: data.provider?.id,
          }]);
        }
      } else {
        // Add to local state for non-provider roles
        setUsers(prev => [...prev, {
          id: Date.now().toString(),
          email: newUserForm.email,
          full_name: newUserForm.full_name,
          role: newUserForm.role,
          status: 'active',
          created_at: new Date().toISOString(),
        }]);
      }

      // Log the action
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'user_created',
          resource_type: 'user',
          details: `New user created: ${newUserForm.full_name} (${newUserForm.email}) with role ${newUserForm.role}`,
        }),
      });

      setNewUserModal(false);
      setNewUserForm({ email: '', full_name: '', role: 'staff', phone: '' });
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    }
  };

  // Count users per role
  const rolesWithCounts = ROLES.map(role => ({
    ...role,
    userCount: users.filter(u => u.role === role.id).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & Access Management</h1>
          <p className="text-gray-500">Manage team access with role-based permissions</p>
        </div>
        <button
          onClick={() => setNewUserModal(true)}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          + Add User
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <h3 className="font-semibold text-red-800">Access Control Notice</h3>
            <p className="text-red-700 text-sm">
              All access changes are logged for compliance. Use the kill switch to immediately 
              revoke access if a security incident is suspected. Suspended users cannot log in.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['users', 'roles', 'permissions', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'users' && '👥 '}
            {tab === 'roles' && '🎭 '}
            {tab === 'permissions' && '🔑 '}
            {tab === 'logs' && '📜 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Roles</option>
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-4 py-3">
                        <div className="animate-pulse bg-gray-200 h-8 rounded" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${user.status === 'suspended' ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            user.role === 'owner' ? 'bg-purple-500' :
                            user.role === 'admin' ? 'bg-blue-500' :
                            user.role === 'provider' ? 'bg-pink-500' :
                            'bg-gray-500'
                          }`}>
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'owner' ? 'bg-pink-100 text-pink-700' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'provider' ? 'bg-pink-100 text-pink-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {ROLES.find(r => r.id === user.role)?.name || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' :
                          user.status === 'suspended' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setEditModalOpen(true);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          {user.role !== 'owner' && (
                            <button
                              onClick={() => setConfirmKillSwitch(user)}
                              className={`text-sm font-medium ${
                                user.status === 'suspended'
                                  ? 'text-green-600 hover:text-green-700'
                                  : 'text-red-600 hover:text-red-700'
                              }`}
                            >
                              {user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesWithCounts.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.userCount} users</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${
                  role.id === 'owner' ? 'bg-purple-500' :
                  role.id === 'admin' ? 'bg-blue-500' :
                  role.id === 'provider' ? 'bg-pink-500' :
                  role.id === 'staff' ? 'bg-green-500' :
                  'bg-gray-500'
                }`} />
              </div>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {(role.permissions[0] === '*' 
                  ? ['Full Access']
                  : role.permissions.slice(0, 4)
                ).map((perm) => (
                  <span
                    key={perm}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {perm}
                  </span>
                ))}
                {role.permissions.length > 4 && role.permissions[0] !== '*' && (
                  <span className="px-2 py-0.5 text-gray-500 text-xs">
                    +{role.permissions.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <p className="text-gray-600">
            Permission matrix showing what each role can access. Contact system administrator 
            to modify role permissions.
          </p>
          
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Permission</th>
                  {ROLES.filter(r => r.id !== 'client').map(role => (
                    <th key={role.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PERMISSION_CATEGORIES.map((category) => (
                  <>
                    <tr key={category.name} className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-2 font-semibold text-gray-700 text-sm">
                        {category.name}
                      </td>
                    </tr>
                    {category.permissions.map((perm) => (
                      <tr key={perm}>
                        <td className="px-4 py-2 text-sm text-gray-600">{perm}</td>
                        {ROLES.filter(r => r.id !== 'client').map(role => (
                          <td key={role.id} className="px-4 py-2 text-center">
                            {role.permissions[0] === '*' || role.permissions.includes(perm) ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Access Change Log</h3>
            <button className="text-sm text-pink-600 hover:text-pink-700">
              Export Logs
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {accessLogs.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                No access logs available
              </div>
            ) : (
              accessLogs.map((log) => (
                <div key={log.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log.details || `${log.user_name} - ${log.resource}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.ip_address && (
                        <p className="text-xs text-gray-400">IP: {log.ip_address}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedUser.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  disabled={selectedUser.role === 'owner'}
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                {selectedUser.role === 'owner' && (
                  <p className="text-xs text-gray-500 mt-1">Owner role cannot be changed</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateRole(selectedUser.id, selectedUser.role)}
                className="flex-1 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kill Switch Confirmation Modal */}
      {confirmKillSwitch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <span className="text-5xl block mb-4">
                {confirmKillSwitch.status === 'suspended' ? '✅' : '🚨'}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {confirmKillSwitch.status === 'suspended' ? 'Reactivate User?' : 'Suspend User Access?'}
              </h2>
              <p className="text-gray-600 mb-4">
                {confirmKillSwitch.status === 'suspended'
                  ? `This will restore access for ${confirmKillSwitch.full_name}. They will be able to log in immediately.`
                  : `This will immediately revoke access for ${confirmKillSwitch.full_name}. They will be logged out of all sessions.`
                }
              </p>
              <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mb-4">
                This action will be logged for compliance purposes.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleKillSwitch(confirmKillSwitch)}
                className={`flex-1 py-2 text-white rounded-lg ${
                  confirmKillSwitch.status === 'suspended'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {confirmKillSwitch.status === 'suspended' ? 'Reactivate' : 'Suspend Now'}
              </button>
              <button
                onClick={() => setConfirmKillSwitch(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {newUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUserForm.full_name}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="jane@hellogorgeousmedspa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  {ROLES.filter(r => r.id !== 'owner' && r.id !== 'client').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                className="flex-1 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setNewUserModal(false);
                  setNewUserForm({ email: '', full_name: '', role: 'staff', phone: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
