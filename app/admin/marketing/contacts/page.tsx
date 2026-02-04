'use client';

// ============================================================
// CONTACT COLLECTION ADMIN PAGE
// Manage sign-up link, QR codes, and view subscribers
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

export default function ContactCollectionPage() {
  const toast = useToast();
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    emailOptIn: 0,
    smsOptIn: 0,
    loyaltyEnrolled: 0,
  });

  useEffect(() => {
    // Get the base URL
    setBaseUrl(window.location.origin);
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/marketing/subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setStats(data.stats || stats);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const signupUrl = `${baseUrl}/join`;
  const signupUrlWithUtm = `${signupUrl}?utm_source=qr&utm_medium=print`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const downloadQRCode = () => {
    // Generate QR code using a simple API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(signupUrlWithUtm)}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'hello-gorgeous-signup-qr.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Collection</h1>
        <p className="text-gray-500">Grow your client list with shareable sign-up links</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-green-600">+{stats.thisMonth}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Email Opt-in</p>
          <p className="text-2xl font-bold text-gray-900">{stats.emailOptIn}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">SMS Opt-in</p>
          <p className="text-2xl font-bold text-gray-900">{stats.smsOptIn}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Loyalty Members</p>
          <p className="text-2xl font-bold text-pink-600">{stats.loyaltyEnrolled}</p>
        </div>
      </div>

      {/* Sign-up Link Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Online Sign-up</h2>
          <p className="text-sm text-gray-500">Share this link to collect contacts and grow your marketing list</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* QR Code Preview */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(signupUrlWithUtm)}`}
                  alt="Sign-up QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Link and Actions */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sign-up Page URL</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 truncate">
                    {signupUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(signupUrl)}
                    className="px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </button>
                <a
                  href={signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Preview Page
                </a>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <p className="text-sm text-blue-700">
                  <strong>💡 Tip:</strong> Print the QR code and place it at your front desk, on receipts, or in treatment rooms to grow your list!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Sign-ups</h2>
            <p className="text-sm text-gray-500">People who joined through the sign-up page</p>
          </div>
          <button
            onClick={fetchSubscribers}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingSubscribers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">📭</div>
                    <p className="text-gray-500">No subscribers yet</p>
                    <p className="text-sm text-gray-400">Share your sign-up link to start collecting contacts</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{sub.first_name} {sub.last_name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-600">{sub.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {sub.email_opt_in && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Email</span>
                        )}
                        {sub.sms_opt_in && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">SMS</span>
                        )}
                        {sub.loyalty && (
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">Loyalty</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
