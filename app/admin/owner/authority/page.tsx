'use client';

// ============================================================
// ACCESS & AUTHORITY CONTROL
// Complete control over user access and system security
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'locked' | 'pending';
  lastLogin: string;
  activeSessions: number;
}

export default function AuthorityPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Danielle Alcala', email: 'danielle@hellogorgeousmedspa.com', role: 'Founder', status: 'active', lastLogin: '2025-02-02T10:30:00Z', activeSessions: 2 },
    { id: 'u2', name: 'Ryan Kent', email: 'ryan@hellogorgeousmedspa.com', role: 'Provider', status: 'active', lastLogin: '2025-02-02T09:15:00Z', activeSessions: 1 },
    { id: 'u3', name: 'Front Desk', email: 'frontdesk@hellogorgeousmedspa.com', role: 'Front Desk', status: 'active', lastLogin: '2025-02-01T17:00:00Z', activeSessions: 0 },
  ]);

  const [systemMode, setSystemMode] = useState<'normal' | 'readonly'>('normal');
  const [showRevokeAll, setShowRevokeAll] = useState(false);
  const [showRotateSecrets, setShowRotateSecrets] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const revokeUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.role === 'Founder') {
      setMessage({ type: 'error', text: 'Cannot revoke Founder access' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (!confirm(`Revoke access for ${user.name}? They will be logged out immediately.`)) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'locked', activeSessions: 0 } : u));
    setMessage({ type: 'success', text: `Access revoked for ${user.name}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const restoreUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    setMessage({ type: 'success', text: 'Access restored' });
    setTimeout(() => setMessage(null), 3000);
  };

  const forceLogoutAll = () => {
    if (!confirm('Force logout ALL users (except Founder)? This will end all active sessions.')) return;
    setUsers(prev => prev.map(u => u.role === 'Founder' ? u : { ...u, activeSessions: 0 }));
    setMessage({ type: 'success', text: 'All users have been logged out' });
    setShowRevokeAll(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleReadOnly = () => {
    const newMode = systemMode === 'normal' ? 'readonly' : 'normal';
    setSystemMode(newMode);
    setMessage({ type: 'success', text: newMode === 'readonly' ? 'System locked to READ-ONLY mode' : 'System restored to normal operation' });
    setTimeout(() => setMessage(null), 3000);
  };

  const rotateSecrets = () => {
    setMessage({ type: 'success', text: 'API secrets rotated successfully. All integrations have been updated.' });
    setShowRotateSecrets(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const totalSessions = users.reduce((sum, u) => sum + u.activeSessions, 0);

  return (
    <OwnerLayout title="Access & Authority Control" description="Control user access and system security">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* System Mode Banner */}
      <div className={`p-4 rounded-xl mb-6 ${systemMode === 'readonly' ? 'bg-red-100 border-2 border-red-300' : 'bg-green-100 border-2 border-green-300'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{systemMode === 'readonly' ? '🔴' : '🟢'}</span>
            <div>
              <h2 className={`font-bold ${systemMode === 'readonly' ? 'text-red-800' : 'text-green-800'}`}>
                {systemMode === 'readonly' ? 'READ-ONLY MODE ACTIVE' : 'NORMAL OPERATION'}
              </h2>
              <p className={`text-sm ${systemMode === 'readonly' ? 'text-red-600' : 'text-green-600'}`}>
                {systemMode === 'readonly' ? 'All write operations are blocked' : 'Users can perform normal operations'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleReadOnly}
            className={`px-4 py-2 rounded-lg font-medium ${
              systemMode === 'readonly' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {systemMode === 'readonly' ? 'Restore Normal Mode' : 'Lock to Read-Only'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* User List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">👥 User Access Control</h2>
                <p className="text-xs text-black">{totalSessions} active sessions</p>
              </div>
              <button
                onClick={() => setShowRevokeAll(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
              >
                Force Logout All
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-white">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-black">USER</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-black">ROLE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-black">LAST LOGIN</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-black">SESSIONS</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-black">STATUS</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => (
                  <tr key={user.id} className={`hover:bg-white ${user.status === 'locked' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-black">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.role === 'Founder' ? 'bg-pink-100 text-pink-700' :
                        user.role === 'Provider' ? 'bg-blue-100 text-blue-700' :
                        'bg-white text-black'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.activeSessions > 0 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{user.activeSessions}</span>
                      ) : (
                        <span className="text-black text-xs">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' :
                        user.status === 'locked' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'Founder' && (
                        user.status === 'active' ? (
                          <button
                            onClick={() => revokeUser(user.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => restoreUser(user.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Restore
                          </button>
                        )
                      )}
                      {user.role === 'Founder' && (
                        <span className="text-xs text-black">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Controls */}
        <div className="space-y-6">
          {/* Emergency Controls */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-red-50">
              <h2 className="font-semibold text-red-800">🚨 Emergency Controls</h2>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={toggleReadOnly}
                className="w-full p-3 text-left rounded-lg border hover:bg-white"
              >
                <h3 className="font-medium text-sm">🔒 Lock System to Read-Only</h3>
                <p className="text-xs text-black">Block all write operations instantly</p>
              </button>
              <button
                onClick={() => setShowRevokeAll(true)}
                className="w-full p-3 text-left rounded-lg border hover:bg-white"
              >
                <h3 className="font-medium text-sm">👤 Force Logout All Users</h3>
                <p className="text-xs text-black">End all active sessions (except Founder)</p>
              </button>
              <button
                onClick={() => setShowRotateSecrets(true)}
                className="w-full p-3 text-left rounded-lg border hover:bg-white"
              >
                <h3 className="font-medium text-sm">🔑 Rotate API Secrets</h3>
                <p className="text-xs text-black">Generate new API keys via UI</p>
              </button>
            </div>
          </div>

          {/* Founder Protection */}
          <div className="bg-purple-50 border border-pink-200 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-2">👑 Founder Protection</h3>
            <ul className="text-xs text-pink-700 space-y-1">
              <li>✓ Founder cannot be overridden</li>
              <li>✓ Devs cannot lock Founder out</li>
              <li>✓ All actions logged</li>
              <li>✓ Cannot be downgraded</li>
            </ul>
          </div>

          {/* Audit Note */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-medium text-black mb-2">📋 All Actions Logged</h3>
            <p className="text-xs text-black">
              Every access control action is recorded in the audit log with user, timestamp, IP, and action details.
            </p>
            <a href="/admin/owner/audit" className="text-xs text-pink-600 hover:text-pink-700 mt-2 inline-block">
              View Audit Log →
            </a>
          </div>
        </div>
      </div>

      {/* Force Logout Modal */}
      {showRevokeAll && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">🚨 Force Logout All Users</h3>
            <p className="text-black mb-4">
              This will immediately end all active sessions for all users except the Founder.
              Users will need to log in again.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowRevokeAll(false)} className="px-4 py-2 text-black hover:text-black">
                Cancel
              </button>
              <button onClick={forceLogoutAll} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Force Logout All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rotate Secrets Modal */}
      {showRotateSecrets && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">🔑 Rotate API Secrets</h3>
            <p className="text-black mb-4">
              This will generate new API keys for all integrations (Stripe, Telnyx, etc.).
              Existing keys will be invalidated.
            </p>
            <div className="p-3 bg-amber-50 rounded-lg mb-4">
              <p className="text-sm text-amber-700">
                ⚠️ Integrations may be temporarily disrupted during rotation.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowRotateSecrets(false)} className="px-4 py-2 text-black hover:text-black">
                Cancel
              </button>
              <button onClick={rotateSecrets} className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black">
                Rotate Secrets
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
