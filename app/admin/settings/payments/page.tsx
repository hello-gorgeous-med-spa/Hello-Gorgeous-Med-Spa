'use client';

// ============================================================
// SQUARE PAYMENTS SETTINGS PAGE
// Connect Square, manage locations and terminal devices
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface SquareConnection {
  id: string;
  merchant_id: string;
  business_name: string | null;
  location_id: string | null;
  location_name: string | null;
  default_device_id: string | null;
  environment: string;
  status: string;
  connected_at: string;
  last_webhook_at: string | null;
}

interface SquareLocation {
  id: string;
  name: string;
  address: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  status: string;
}

interface SquareDevice {
  id: string;
  square_device_id: string;
  name: string;
  product_type: string;
  status: string;
  is_default: boolean;
  last_seen_at: string | null;
}

export default function PaymentSettingsPage() {
  // Connection state
  const [connection, setConnection] = useState<SquareConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Locations state
  const [locations, setLocations] = useState<SquareLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  // Devices state
  const [devices, setDevices] = useState<SquareDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  
  // Test ping state
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Pairing state
  const [showPairing, setShowPairing] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pairingStatus, setPairingStatus] = useState<string>('');
  
  // Saving state
  const [saving, setSaving] = useState(false);

  // Check for URL params (success/error from OAuth)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');
    const errorParam = params.get('error');
    const messageParam = params.get('message');
    
    if (successParam === 'true') {
      setSuccess(messageParam || 'Square connected successfully!');
      // Clear params from URL
      window.history.replaceState({}, '', '/admin/settings/payments');
    } else if (errorParam) {
      setError(messageParam || `Error: ${errorParam}`);
      window.history.replaceState({}, '', '/admin/settings/payments');
    }
  }, []);

  // Fetch connection status
  const fetchConnection = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/square/settings');
      const data = await res.json();
      
      if (data.connection) {
        setConnection(data.connection);
      } else {
        setConnection(null);
      }
    } catch (err) {
      console.error('Failed to fetch connection:', err);
      setError('Failed to load Square connection status');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    if (!connection) return;
    
    try {
      setLoadingLocations(true);
      const res = await fetch('/api/square/locations');
      const data = await res.json();
      
      if (data.locations) {
        setLocations(data.locations);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  }, [connection]);

  // Fetch devices
  const fetchDevices = useCallback(async (refresh = false) => {
    if (!connection?.location_id) return;
    
    try {
      setLoadingDevices(true);
      const res = await fetch(`/api/square/devices?locationId=${connection.location_id}&refresh=${refresh}`);
      const data = await res.json();
      
      if (data.devices) {
        setDevices(data.devices);
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoadingDevices(false);
    }
  }, [connection?.location_id]);

  // Load data on mount
  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  // Load locations when connected
  useEffect(() => {
    if (connection) {
      fetchLocations();
    }
  }, [connection, fetchLocations]);

  // Load devices when location is selected
  useEffect(() => {
    if (connection?.location_id) {
      fetchDevices(false);
    }
  }, [connection?.location_id, fetchDevices]);

  // Handle location change
  const handleLocationChange = async (locationId: string) => {
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/square/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: locationId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setConnection(data.connection);
        setSuccess('Location updated');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update location');
      }
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle default device change
  const handleSetDefaultDevice = async (deviceId: string) => {
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/square/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ default_device_id: deviceId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setConnection(data.connection);
        // Refresh devices to update is_default flags
        fetchDevices(false);
        setSuccess('Default device updated');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update device');
      }
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Test terminal ping
  const handleTestPing = async (deviceId?: string) => {
    setTestingPing(true);
    setPingResult(null);
    
    try {
      const res = await fetch('/api/square/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId }),
      });
      
      const data = await res.json();
      setPingResult({
        success: data.success,
        message: data.success ? data.message : data.error,
      });
      
      // Refresh devices to update status
      if (data.success) {
        fetchDevices(false);
      }
    } catch {
      setPingResult({
        success: false,
        message: 'Failed to test terminal',
      });
    } finally {
      setTestingPing(false);
    }
  };

  // Start device pairing
  const handleStartPairing = async () => {
    if (!connection?.location_id) {
      setError('Please select a location first');
      return;
    }
    
    setShowPairing(true);
    setPairingCode(null);
    setPairingStatus('Creating pairing code...');
    
    try {
      const res = await fetch('/api/square/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId: connection.location_id }),
      });
      
      let data;
      try {
        const text = await res.text();
        if (!text || !text.trim()) {
          data = { error: 'Server error', details: `Empty response (HTTP ${res.status}). Add SQUARE_ACCESS_TOKEN to Vercel.` };
        } else {
          try {
            data = JSON.parse(text);
          } catch {
            data = { error: 'Server error', details: text.slice(0, 100) };
          }
        }
      } catch {
        setPairingStatus('Failed: Network error');
        return;
      }
      
      if (res.ok && data.code) {
        setPairingCode(data.code);
        setPairingStatus('Enter this code on your Square Terminal');
      } else {
        const msg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Unknown error');
        setPairingStatus('Failed: ' + msg);
        setError(msg);
        setTimeout(() => setError(null), 8000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network or server error';
      setPairingStatus('Failed: ' + msg);
      setError(msg);
      setTimeout(() => setError(null), 8000);
    }
  };

  // Disconnect Square
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Square? This will disable terminal payments.')) {
      return;
    }
    
    try {
      const res = await fetch('/api/square/connection', {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setConnection(null);
        setLocations([]);
        setDevices([]);
        setSuccess('Square disconnected');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to disconnect');
      }
    } catch {
      setError('Failed to disconnect');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-[#FF2D8E]">Settings</Link>
            <span>/</span>
            <span>Payments</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Payment Settings</h1>
          <p className="text-black">Configure Square for terminal payments</p>
        </div>
        {success && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {success}
          </span>
        )}
        {error && (
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
            {error}
          </span>
        )}
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Square Connection</h2>
        
        {connection ? (
          <div className="space-y-4">
            {/* Connected Status */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{'✓'}</span>
                </div>
                <div>
                  <p className="font-medium text-black">
                    {connection.business_name || 'Square Account'}
                  </p>
                  <p className="text-sm text-black">
                    Connected since {new Date(connection.connected_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  connection.environment === 'production' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {connection.environment === 'production' ? 'Live' : 'Sandbox'}
                </span>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Merchant Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-black">Merchant ID:</span>
                <span className="ml-2 font-mono text-black">{connection.merchant_id}</span>
              </div>
              <div>
                <span className="text-black">Last Webhook:</span>
                <span className="ml-2 text-black">
                  {connection.last_webhook_at 
                    ? new Date(connection.last_webhook_at).toLocaleString() 
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <p className="text-black mb-4">Connect your Square account to accept terminal payments</p>
            <a
              href="/api/square/oauth/start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.5 9h-9a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zM12 5h9a.5.5 0 0 0 .5-.5v-2A2.5 2.5 0 0 0 19 0H5a2.5 2.5 0 0 0-2.5 2.5v2a.5.5 0 0 0 .5.5h9z"/>
              </svg>
              Connect Square
            </a>
          </div>
        )}
      </div>

      {/* Location Selection */}
      {connection && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Location</h2>
          
          {loadingLocations ? (
            <div className="flex items-center gap-2 text-black">
              <div className="animate-spin h-4 w-4 border-2 border-[#FF2D8E] border-t-transparent rounded-full" />
              Loading locations...
            </div>
          ) : locations.length === 0 ? (
            <p className="text-black">No locations found in your Square account</p>
          ) : (
            <div className="space-y-2">
              {locations.map((location) => (
                <label
                  key={location.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    connection.location_id === location.id
                      ? 'border-[#FF2D8E] bg-pink-50'
                      : 'border-black hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="location"
                      checked={connection.location_id === location.id}
                      onChange={() => handleLocationChange(location.id)}
                      disabled={saving}
                      className="w-4 h-4 text-[#FF2D8E] border-black focus:ring-pink-500"
                    />
                    <div>
                      <p className="font-medium text-black">{location.name}</p>
                      {location.address && (
                        <p className="text-sm text-black">
                          {[location.address.line1, location.address.city, location.address.state]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    location.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-white text-black'
                  }`}>
                    {location.status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Terminal Devices */}
      {connection?.location_id && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-black">Terminal Devices</h2>
            <div className="flex gap-2">
              <button
                onClick={() => fetchDevices(true)}
                disabled={loadingDevices}
                className="px-3 py-1.5 text-sm text-black hover:bg-white rounded-lg"
              >
                {loadingDevices ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleStartPairing}
                className="px-3 py-1.5 text-sm bg-[#FF2D8E] text-white rounded-lg hover:bg-black"
              >
                + Pair New Device
              </button>
            </div>
          </div>

          {/* Pairing Modal */}
          {showPairing && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-900">Pair New Terminal</h3>
                <button
                  onClick={() => {
                    setShowPairing(false);
                    fetchDevices(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Close
                </button>
              </div>
              {pairingCode ? (
                <div className="text-center py-4">
                  <p className="text-sm text-blue-700 mb-2">{pairingStatus}</p>
                  <div className="text-4xl font-mono font-bold text-blue-900 tracking-widest">
                    {pairingCode}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Code expires in 5 minutes
                  </p>
                </div>
              ) : (
                <p className="text-sm text-blue-700">{pairingStatus}</p>
              )}
            </div>
          )}

          {/* Device List */}
          {loadingDevices ? (
            <div className="flex items-center gap-2 text-black">
              <div className="animate-spin h-4 w-4 border-2 border-[#FF2D8E] border-t-transparent rounded-full" />
              Loading devices...
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8 text-black">
              <p>No terminal devices paired</p>
              <p className="text-sm mt-1">Click &quot;Pair New Device&quot; to add a Square Terminal</p>
            </div>
          ) : (
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    device.is_default ? 'border-[#FF2D8E] bg-pink-50' : 'border-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.status === 'paired' ? 'bg-green-100' : 'bg-white'
                    }`}>
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-black">{device.name}</p>
                        {device.is_default && (
                          <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-black">
                        {device.product_type} 
                        {device.last_seen_at && (
                          <span> - Last seen {new Date(device.last_seen_at).toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      device.status === 'paired' 
                        ? 'bg-green-100 text-green-700' 
                        : device.status === 'offline'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-white text-black'
                    }`}>
                      {device.status}
                    </span>
                    <button
                      onClick={() => handleTestPing(device.id)}
                      disabled={testingPing}
                      className="px-3 py-1.5 text-sm text-black hover:bg-white rounded-lg"
                    >
                      {testingPing ? '...' : 'Test'}
                    </button>
                    {!device.is_default && (
                      <button
                        onClick={() => handleSetDefaultDevice(device.id)}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ping Result */}
          {pingResult && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              pingResult.success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {pingResult.success ? 'Test successful: ' : 'Test failed: '}
              {pingResult.message}
            </div>
          )}
        </div>
      )}

      {/* Webhook Configuration Help */}
      {connection && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Webhook Configuration</h2>
          <p className="text-sm text-black mb-3">
            Configure these webhooks in your Square Developer Dashboard:
          </p>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-black mb-2">Webhook URL:</p>
            <code className="block text-sm bg-white px-3 py-2 rounded border border-black break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/square/webhook` : '/api/square/webhook'}
            </code>
            <p className="text-sm font-medium text-black mt-4 mb-2">Required Events:</p>
            <ul className="text-sm text-black list-disc list-inside space-y-1">
              <li>terminal.checkout.created</li>
              <li>terminal.checkout.updated</li>
              <li>payment.completed</li>
              <li>refund.created</li>
              <li>refund.updated</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
