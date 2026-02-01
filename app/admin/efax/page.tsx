'use client';

// ============================================================
// EFAX PAGE - Send and receive faxes electronically
// ============================================================

import { useState, useEffect } from 'react';

interface Fax {
  id: string;
  direction: 'inbound' | 'outbound';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'received';
  from_number: string;
  to_number: string;
  pages: number;
  subject?: string;
  recipient_name?: string;
  created_at: string;
  delivered_at?: string;
  file_url?: string;
}

export default function EFaxPage() {
  const [faxes, setFaxes] = useState<Fax[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'send'>('inbox');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Send fax form
  const [sendForm, setSendForm] = useState({
    to_number: '',
    recipient_name: '',
    subject: '',
    cover_page: true,
    file: null as File | null,
  });

  // Load faxes
  useEffect(() => {
    const loadFaxes = async () => {
      try {
        const res = await fetch('/api/efax');
        if (res.ok) {
          const data = await res.json();
          setFaxes(data.faxes || []);
        }
      } catch (err) {
        console.error('Error loading faxes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFaxes();
  }, []);

  // Filter faxes
  const inboxFaxes = faxes.filter(f => f.direction === 'inbound');
  const sentFaxes = faxes.filter(f => f.direction === 'outbound');

  // Stats
  const stats = {
    inbox: inboxFaxes.length,
    unread: inboxFaxes.filter(f => f.status === 'received').length,
    sent: sentFaxes.length,
    pending: sentFaxes.filter(f => f.status === 'pending').length,
  };

  // Handle send fax
  const handleSendFax = async () => {
    if (!sendForm.to_number || !sendForm.file) {
      setMessage({ type: 'error', text: 'Fax number and file are required' });
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('to_number', sendForm.to_number);
      formData.append('recipient_name', sendForm.recipient_name);
      formData.append('subject', sendForm.subject);
      formData.append('cover_page', String(sendForm.cover_page));
      formData.append('file', sendForm.file);

      const res = await fetch('/api/efax', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok || data.success) {
        setMessage({ type: 'success', text: 'Fax queued for sending!' });
        setShowSendModal(false);
        setSendForm({ to_number: '', recipient_name: '', subject: '', cover_page: true, file: null });
        // Add to local list
        if (data.fax) {
          setFaxes(prev => [data.fax, ...prev]);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send fax' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send fax' });
    }
    setSending(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Format phone number
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">eFax</h1>
          <p className="text-gray-500">Send and receive faxes electronically</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          📠 Send Fax
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          message.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Setup Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-2">📠 eFax Setup Required</h3>
        <p className="text-amber-800 text-sm mb-4">
          To send and receive faxes, you need to connect an eFax service. We recommend:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-gray-900">Twilio Fax</h4>
            <p className="text-sm text-gray-600 mt-1">Pay per fax, HIPAA compliant, easy API integration</p>
            <p className="text-xs text-gray-500 mt-2">~$0.01/page</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-gray-900">SRFax</h4>
            <p className="text-sm text-gray-600 mt-1">Medical-grade eFax, HIPAA BAA available</p>
            <p className="text-xs text-gray-500 mt-2">$12.95/month</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-gray-900">Phaxio</h4>
            <p className="text-sm text-gray-600 mt-1">Developer-friendly API, reliable delivery</p>
            <p className="text-xs text-gray-500 mt-2">$0.07/page</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Inbox</p>
          <p className="text-2xl font-bold text-gray-900">{stats.inbox}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Sent</p>
          <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'inbox' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📥 Inbox ({inboxFaxes.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'sent' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📤 Sent ({sentFaxes.length})
        </button>
      </div>

      {/* Fax List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading faxes...</div>
        ) : (activeTab === 'inbox' ? inboxFaxes : sentFaxes).length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <span className="text-4xl block mb-4">{activeTab === 'inbox' ? '📥' : '📤'}</span>
            <p>No {activeTab === 'inbox' ? 'received' : 'sent'} faxes yet</p>
            {activeTab === 'sent' && (
              <button
                onClick={() => setShowSendModal(true)}
                className="mt-4 text-pink-600 font-medium hover:text-pink-700"
              >
                Send your first fax
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(activeTab === 'inbox' ? inboxFaxes : sentFaxes).map(fax => (
              <div key={fax.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    fax.status === 'delivered' || fax.status === 'received' ? 'bg-green-100 text-green-600' :
                    fax.status === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {fax.direction === 'inbound' ? '📥' : '📤'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {fax.recipient_name || formatPhone(fax.direction === 'inbound' ? fax.from_number : fax.to_number)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {fax.subject || `${fax.pages} page${fax.pages !== 1 ? 's' : ''}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(fax.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    fax.status === 'delivered' || fax.status === 'received' ? 'bg-green-100 text-green-700' :
                    fax.status === 'failed' ? 'bg-red-100 text-red-700' :
                    fax.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {fax.status}
                  </span>
                  <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Fax Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Send Fax</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fax Number *</label>
                <input
                  type="tel"
                  value={sendForm.to_number}
                  onChange={(e) => setSendForm({ ...sendForm, to_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={sendForm.recipient_name}
                  onChange={(e) => setSendForm({ ...sendForm, recipient_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Dr. Smith's Office"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={sendForm.subject}
                  onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Patient Records Request"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => setSendForm({ ...sendForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">PDF, Word, or image files</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendForm.cover_page}
                  onChange={(e) => setSendForm({ ...sendForm, cover_page: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Include cover page with Hello Gorgeous branding</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFax}
                disabled={sending || !sendForm.to_number || !sendForm.file}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Fax'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Prescribing Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-2">💊 Need E-Prescribing?</h3>
        <p className="text-purple-800 mb-4">
          Electronic prescribing lets you send prescriptions directly to pharmacies. Essential for weight loss meds, topicals, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900">DoseSpot</h4>
            <p className="text-sm text-gray-600 mt-1">
              Embeddable e-prescribing widget. EPCS certified for controlled substances. 
              Integrates with Surescripts network.
            </p>
            <p className="text-xs text-purple-600 mt-2 font-medium">Recommended for med spas</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900">DrFirst (Rcopia)</h4>
            <p className="text-sm text-gray-600 mt-1">
              Full e-prescribing platform with medication history, drug interactions, 
              and prior authorization.
            </p>
            <p className="text-xs text-gray-500 mt-2">Enterprise solution</p>
          </div>
        </div>
        <p className="text-sm text-purple-700 mt-4">
          Contact us to discuss e-prescribing integration for your practice.
        </p>
      </div>
    </div>
  );
}
