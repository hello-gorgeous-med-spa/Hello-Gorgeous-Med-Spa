'use client';

// ============================================================
// SQUARE TERMINAL SETUP PAGE
// Pair, configure, and manage Square Terminal devices
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Device {
  id: string;
  square_device_id: string;
  name: string;
  status: string;
  product_type: string;
  is_default: boolean;
  paired_at: string;
  location_id: string;
}

interface Connection {
  id: string;
  merchant_id: string;
  business_name: string;
  location_id: string;
  location_name: string;
  default_device_id: string;
  status: string;
}

export default function TerminalSetupPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pairing states
  const [showPairModal, setShowPairModal] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pairingName, setPairingName] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);

  // Add by ID states
  const [showAddByIdModal, setShowAddByIdModal] = useState(false);
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [addingById, setAddingById] = useState(false);

  // Fetch connection and devices
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get connection status
      const connRes = await fetch('/api/square/connection');
      const connData = await connRes.json();
      
      if (!connData.connected || !connData.connection) {
        setConnection(null);
        setDevices([]);
        setLoading(false);
        return;
      }
      
      setConnection(connData.connection);
      
      // Get devices
      const devicesRes = await fetch('/api/square/devices?refresh=true');
      const devicesData = await devicesRes.json();
      
      if (devicesData.devices) {
        setDevices(devicesData.devices);
      }
    } catch (err) {
      setError('Failed to load terminal data');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate pairing code
  const generatePairingCode = async () => {
    setPairingLoading(true);
    setPairingCode(null);
    try {
      const res = await fetch('/api/square/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pairingName || undefined }),
      });
      const data = await res.json();
      
      if (data.code) {
        setPairingCode(data.code);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate pairing code' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to generate pairing code' });
    }
    setPairingLoading(false);
  };

  // Add device by Square ID
  const addDeviceById = async () => {
    if (!deviceIdInput.trim()) return;
    
    setAddingById(true);
    try {
      const res = await fetch('/api/square/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          square_device_id: deviceIdInput.trim(),
          name: deviceNameInput.trim() || undefined,
          set_as_default: true,
        }),
      });
      const data = await res.json();
      
      if (data.added || data.device) {
        setMessage({ type: 'success', text: 'Terminal added successfully!' });
        setShowAddByIdModal(false);
        setDeviceIdInput('');
        setDeviceNameInput('');
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add device' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add device' });
    }
    setAddingById(false);
  };

  // Set device as default
  const setDefaultDevice = async (deviceId: string) => {
    try {
      const res = await fetch(`/api/square/devices/${deviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true }),
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Default terminal updated' });
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update default' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update default terminal' });
    }
  };

  // Remove device
  const removeDevice = async (deviceId: string) => {
    if (!confirm('Remove this terminal? You can re-add it later.')) return;
    
    try {
      const res = await fetch(`/api/square/devices/${deviceId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Terminal removed' });
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to remove' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove terminal' });
    }
  };

  // Clear message after 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/settings/payments" className="text-[#2D63A4] font-medium hover:underline">
          ← Payments
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-xl font-bold text-black">Terminal Setup</h1>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading terminal configuration...
          </div>
        </div>
      ) : !connection ? (
        /* Not Connected */
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📟</span>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Connect Square First</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your Square account before setting up terminals.
          </p>
          <Link
            href="/admin/settings/payments"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Connect Square
          </Link>
        </div>
      ) : (
        /* Connected - Show Terminals */
        <div className="space-y-6">
          {/* Connection Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-green-800">Square Connected</p>
                <p className="text-sm text-green-700">
                  {connection.business_name} • {connection.location_name || 'Default Location'}
                </p>
              </div>
            </div>
          </div>

          {/* Add Terminal Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Add Terminal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowPairModal(true)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🔗</span>
                <h3 className="font-semibold text-black">Pair New Terminal</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Generate a code to pair a new Square Terminal device
                </p>
              </button>

              <button
                onClick={() => setShowAddByIdModal(true)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">📝</span>
                <h3 className="font-semibold text-black">Add by Device ID</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add an already-paired terminal using its Square Device ID
                </p>
              </button>
            </div>
          </div>

          {/* Paired Terminals */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Paired Terminals</h2>
              <button
                onClick={fetchData}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {devices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📟</span>
                <p>No terminals paired yet</p>
                <p className="text-sm mt-1">Add a terminal using the options above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${device.is_default ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">📟</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-black">{device.name}</h3>
                          {device.is_default && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 font-mono">
                          {device.square_device_id}
                        </p>
                        <p className="text-xs text-gray-400">
                          Paired {new Date(device.paired_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!device.is_default && (
                        <button
                          onClick={() => setDefaultDevice(device.id)}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => removeDevice(device.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/pos"
              className="bg-white rounded-xl border p-5 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-semibold group-hover:text-pink-600">Open POS</h3>
                  <p className="text-sm text-gray-500">Process payments with your terminal</p>
                </div>
              </div>
            </Link>

            <a
              href="https://squareup.com/dashboard/devices"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <h3 className="font-semibold group-hover:text-blue-600">Square Dashboard</h3>
                  <p className="text-sm text-gray-500">Manage devices in Square</p>
                </div>
              </div>
            </a>
          </div>

          {/* Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">Finding Your Device ID</h3>
            <p className="text-sm text-blue-700">
              To find your Square Terminal's Device ID:
            </p>
            <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
              <li>On your Terminal, go to Settings → About</li>
              <li>Look for "Device ID" (starts with a letter, followed by numbers)</li>
              <li>Or find it in Square Dashboard → Devices → Select your terminal</li>
            </ol>
          </div>
        </div>
      )}

      {/* Pair Modal */}
      {showPairModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Pair New Terminal</h2>
            
            {!pairingCode ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terminal Name (optional)
                  </label>
                  <input
                    type="text"
                    value={pairingName}
                    onChange={(e) => setPairingName(e.target.value)}
                    placeholder="e.g., Front Desk Terminal"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPairModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generatePairingCode}
                    disabled={pairingLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {pairingLoading ? 'Generating...' : 'Generate Code'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-4">
                    Enter this code on your Square Terminal:
                  </p>
                  <div className="text-4xl font-mono font-bold tracking-widest text-blue-600 bg-blue-50 py-4 rounded-lg">
                    {pairingCode}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    On your Terminal: Settings → Pair Device → Enter the code above
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowPairModal(false);
                      setPairingCode(null);
                      setPairingName('');
                      fetchData();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add by ID Modal */}
      {showAddByIdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Terminal by Device ID</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Device ID *
                </label>
                <input
                  type="text"
                  value={deviceIdInput}
                  onChange={(e) => setDeviceIdInput(e.target.value)}
                  placeholder="e.g., 9fa747a2-25ff-48ee-b078-04381f7c828f"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terminal Name (optional)
                </label>
                <input
                  type="text"
                  value={deviceNameInput}
                  onChange={(e) => setDeviceNameInput(e.target.value)}
                  placeholder="e.g., Treatment Room 1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddByIdModal(false);
                  setDeviceIdInput('');
                  setDeviceNameInput('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addDeviceById}
                disabled={addingById || !deviceIdInput.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {addingById ? 'Adding...' : 'Add Terminal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="pt-4">
        <Link href="/admin/settings/payments" className="text-[#2D63A4] font-medium hover:underline">
          ← Back to Payments
        </Link>
      </div>
    </div>
  );
}
