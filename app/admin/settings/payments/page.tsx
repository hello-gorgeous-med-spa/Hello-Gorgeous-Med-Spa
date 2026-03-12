'use client';

import { useState, useEffect } from 'react';
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

export default function AdminSettingsPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connection, setConnection] = useState<SquareConnection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConnection();
  }, []);

  const fetchConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/square/connection?verify=true');
      const data = await res.json();
      if (data.connected && data.connection) {
        setConnection(data.connection);
      } else {
        setConnection(null);
      }
    } catch (err) {
      setError('Failed to check connection status');
    }
    setLoading(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch('/api/square/oauth/start');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start OAuth flow');
        setConnecting(false);
      }
    } catch (err) {
      setError('Failed to connect to Square');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Square? This will disable terminal payments and data sync.')) {
      return;
    }
    setDisconnecting(true);
    try {
      const res = await fetch('/api/square/connection', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setConnection(null);
        setMessage({ type: 'success', text: 'Square disconnected successfully' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to disconnect' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to disconnect' });
    }
    setDisconnecting(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleReauthorize = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/square/oauth/start');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start re-authorization');
        setConnecting(false);
      }
    } catch (err) {
      setError('Failed to re-authorize');
      setConnecting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">← Settings</Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-xl font-bold text-black">Payments / Square</h1>
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

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl border p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Checking Square connection...
          </div>
        </div>
      ) : connection ? (
        /* Connected State */
        <div className="space-y-6">
          {/* Connection Status Card */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm16.5 16.5v-15h-15v15h15zM8.25 8.25h3v3h-3v-3zm4.5 0h3v3h-3v-3zm-4.5 4.5h3v3h-3v-3zm4.5 0h3v3h-3v-3z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-black">{connection.business_name || 'Square Account'}</h2>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {connection.environment === 'production' ? 'Production' : 'Sandbox'} • 
                    Connected {new Date(connection.connected_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReauthorize}
                  disabled={connecting}
                  className="px-4 py-2 text-blue-600 bg-blue-50 font-medium rounded-lg hover:bg-blue-100 disabled:opacity-50"
                >
                  {connecting ? 'Redirecting...' : 'Re-authorize'}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="px-4 py-2 text-red-600 bg-red-50 font-medium rounded-lg hover:bg-red-100 disabled:opacity-50"
                >
                  {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>

            {/* Connection Details */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Merchant ID</p>
                <p className="font-mono text-sm text-gray-800 mt-1">{connection.merchant_id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-sm text-gray-800 mt-1">{connection.location_name || connection.location_id || 'Not set'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Default Device</p>
                <p className="text-sm text-gray-800 mt-1">
                  {connection.default_device_id ? (
                    <span className="font-mono">{connection.default_device_id.slice(0, 12)}...</span>
                  ) : (
                    <span className="text-gray-400">Not configured</span>
                  )}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Last Webhook</p>
                <p className="text-sm text-gray-800 mt-1">
                  {connection.last_webhook_at 
                    ? new Date(connection.last_webhook_at).toLocaleString()
                    : <span className="text-gray-400">No webhooks received</span>
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/admin/pos"
              className="bg-white rounded-xl border p-5 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-semibold group-hover:text-pink-600">Point of Sale</h3>
                  <p className="text-sm text-gray-500">Process terminal payments</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/settings/terminal"
              className="bg-white rounded-xl border p-5 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📟</span>
                <div>
                  <h3 className="font-semibold group-hover:text-pink-600">Terminal Setup</h3>
                  <p className="text-sm text-gray-500">Configure Square Terminal devices</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/owner/gift-cards"
              className="bg-white rounded-xl border p-5 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <h3 className="font-semibold group-hover:text-pink-600">Gift Cards</h3>
                  <p className="text-sm text-gray-500">Sync and manage gift cards</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/admin/clients"
              className="bg-white rounded-xl border p-5 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="font-semibold group-hover:text-pink-600">Import Customers</h3>
                  <p className="text-sm text-gray-500">Sync customers from Square</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Webhook Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-medium text-amber-800">Webhook Configuration</h3>
            <p className="text-sm text-amber-700 mt-1">
              Ensure webhooks are configured in Square Developer Dashboard to enable automatic sync.
            </p>
            <p className="text-sm text-amber-700 mt-2">
              Webhook URL: <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">https://www.hellogorgeousmedspa.com/api/square/webhook</code>
            </p>
          </div>
        </div>
      ) : (
        /* Not Connected State */
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v18H3V3zm16.5 16.5v-15h-15v15h15zM8.25 8.25h3v3h-3v-3zm4.5 0h3v3h-3v-3zm-4.5 4.5h3v3h-3v-3zm4.5 0h3v3h-3v-3z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Connect Square</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect your Square account to enable terminal payments, sync customers, manage gift cards, and more.
          </p>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {connecting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm16.5 16.5v-15h-15v15h15z"/>
                </svg>
                Connect Square Account
              </>
            )}
          </button>

          <div className="mt-8 text-left bg-gray-50 rounded-lg p-4 max-w-lg mx-auto">
            <h3 className="font-medium text-gray-800 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Process payments with Square Terminal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Automatic customer sync when they checkout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Gift card sync and redemption tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Payment and refund tracking</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="pt-4">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">
          ← Back to Settings
        </Link>
      </div>
    </div>
  );
}
