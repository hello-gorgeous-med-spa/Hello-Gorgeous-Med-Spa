'use client';

// ============================================================
// CONTACT COLLECTION ADMIN PAGE
// Manage sign-up link, QR codes, import CSV, and view subscribers
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

function parseCSV(text: string): { email: string; first_name: string; last_name: string; phone: string }[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('email') || header.includes('first');
  const start = hasHeader ? 1 : 0;
  const rows: { email: string; first_name: string; last_name: string; phone: string }[] = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
    const email = (parts[0] ?? '').trim();
    if (!email || !email.includes('@')) continue;
    rows.push({
      email,
      first_name: (parts[1] ?? '').trim() || 'Subscriber',
      last_name: (parts[2] ?? '').trim(),
      phone: (parts[3] ?? '').trim(),
    });
  }
  return rows;
}

const CSV_TEMPLATE = 'email,first_name,last_name,phone\njane@example.com,Jane,Doe,6305551234\njohn@example.com,John,Smith,';

export default function ContactCollectionPage() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; updated: number; skipped: number; errors: { row: number; error: string }[] } | null>(null);
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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(signupUrlWithUtm)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'hello-gorgeous-signup-qr.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-contacts-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportResult(null);
    const text = await file.text();
    const contacts = parseCSV(text);
    if (contacts.length === 0) {
      toast.error('No valid rows found. Use email, first_name, last_name, phone.');
      return;
    }
    setImporting(true);
    try {
      const res = await fetch('/api/marketing/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setImportResult({
        imported: data.imported ?? 0,
        updated: data.updated ?? 0,
        skipped: data.skipped ?? 0,
        errors: (data.errors ?? []).map((x: any) => ({ row: x.row, error: x.error })),
      });
      toast.success(`Imported ${data.imported ?? 0} new, updated ${data.updated ?? 0}`);
      fetchSubscribers();
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Contact Collection</h1>
        <p className="text-black">Grow your client list with shareable sign-up links</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-black">
          <p className="text-sm text-black">Total Subscribers</p>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-black">
          <p className="text-sm text-black">This Month</p>
          <p className="text-2xl font-bold text-green-600">+{stats.thisMonth}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-black">
          <p className="text-sm text-black">Email Opt-in</p>
          <p className="text-2xl font-bold text-black">{stats.emailOptIn}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-black">
          <p className="text-sm text-black">SMS Opt-in</p>
          <p className="text-2xl font-bold text-black">{stats.smsOptIn}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-black">
          <p className="text-sm text-black">Loyalty Members</p>
          <p className="text-2xl font-bold text-pink-600">{stats.loyaltyEnrolled}</p>
        </div>
      </div>

      {/* Sign-up Link Card */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="p-6 border-b border-black">
          <h2 className="text-lg font-semibold text-black">Online Sign-up</h2>
          <p className="text-sm text-black">Share this link to collect contacts and grow your marketing list</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* QR Code Preview */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-white rounded-xl border border-black flex items-center justify-center overflow-hidden">
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
                <label className="block text-sm font-medium text-black mb-2">Sign-up Page URL</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-white border border-black rounded-xl text-sm text-black truncate">
                    {signupUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(signupUrl)}
                    className="px-4 py-3 bg-black text-white font-medium rounded-xl hover:bg-black transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white transition-colors flex items-center gap-2"
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
                  className="px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white transition-colors flex items-center gap-2"
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

      {/* Import from CSV — id for owner dashboard deep link */}
      <div id="import" className="bg-white rounded-2xl border border-black overflow-hidden scroll-mt-4">
        <div className="p-6 border-b border-black">
          <h2 className="text-lg font-semibold text-black">Import contact list (CSV)</h2>
          <p className="text-sm text-black">Upload a CSV to add contacts to your marketing list. Existing emails are updated; new ones are added.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              disabled={importing}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-xl hover:bg-black disabled:opacity-50"
            >
              {importing ? 'Importing...' : '📤 Choose CSV file'}
            </button>
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-4 py-2 bg-white text-black font-medium rounded-xl hover:bg-white"
            >
              Download template
            </button>
          </div>
          <p className="text-sm text-black">
            CSV format: <code className="bg-white px-1 rounded">email, first_name, last_name, phone</code>. First row can be headers (email, first_name, last_name, phone).
          </p>
          {importResult && (
            <div className="bg-white rounded-xl p-4 text-sm">
              <p className="font-medium text-black">Last import: {importResult.imported} new, {importResult.updated} updated, {importResult.skipped} skipped.</p>
              {importResult.errors.length > 0 && (
                <p className="text-amber-700 mt-1">Errors: {importResult.errors.slice(0, 5).map((e) => `Row ${e.row}: ${e.error}`).join('; ')}{importResult.errors.length > 5 ? '…' : ''}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="bg-white rounded-2xl border border-black overflow-hidden">
        <div className="p-6 border-b border-black flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">Recent Sign-ups</h2>
            <p className="text-sm text-black">People who joined through the sign-up page</p>
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
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Preferences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {loadingSubscribers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-black">
                    Loading...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-black mb-2">📭</div>
                    <p className="text-black">No subscribers yet</p>
                    <p className="text-sm text-black">Share your sign-up link to start collecting contacts</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white">
                    <td className="px-6 py-4">
                      <span className="font-medium text-black">{sub.first_name} {sub.last_name}</span>
                    </td>
                    <td className="px-6 py-4 text-black">{sub.email}</td>
                    <td className="px-6 py-4 text-black">{sub.phone || '—'}</td>
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
                    <td className="px-6 py-4 text-sm text-black">
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
