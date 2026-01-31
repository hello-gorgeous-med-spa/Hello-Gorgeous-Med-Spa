'use client';

import { useState } from 'react';

// eFax Configuration
const EFAX_CONFIG = {
  faxNumber: '(630) 982-6014',
  accountId: '6309826014',
  loginUrl: 'https://www.efax.com/login',
  sendUrl: 'https://www.efax.com/efax-send-fax',
  inboxUrl: 'https://www.efax.com/myaccount/messages',
};

export default function FaxPage() {
  const [faxTo, setFaxTo] = useState('');
  const [subject, setSubject] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Mock recent faxes
  const recentFaxes = [
    { id: 1, direction: 'incoming', from: '(312) 555-0123', date: '2026-01-30', pages: 3, status: 'received' },
    { id: 2, direction: 'outgoing', to: '(847) 555-4567', date: '2026-01-29', pages: 2, status: 'delivered' },
    { id: 3, direction: 'incoming', from: '(630) 555-7890', date: '2026-01-28', pages: 5, status: 'received' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">eFax Center</h1>
        <p className="text-gray-600 mt-1">Send and receive faxes digitally - no fax machine needed</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Your Fax Number */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-200">Your Fax Number</span>
            <span className="text-2xl">📠</span>
          </div>
          <div className="text-3xl font-bold">{EFAX_CONFIG.faxNumber}</div>
          <p className="text-purple-200 text-sm mt-2">
            Give this number to receive faxes directly to your inbox
          </p>
        </div>

        {/* Send Fax */}
        <a
          href={EFAX_CONFIG.sendUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border-2 border-pink-200 hover:border-pink-400 rounded-2xl p-6 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Send a Fax</span>
            <span className="text-2xl group-hover:scale-110 transition-transform">📤</span>
          </div>
          <div className="text-xl font-bold text-gray-900">Compose New Fax</div>
          <p className="text-gray-500 text-sm mt-2">
            Upload a document and send via eFax
          </p>
        </a>

        {/* View Inbox */}
        <a
          href={EFAX_CONFIG.inboxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Fax Inbox</span>
            <span className="text-2xl group-hover:scale-110 transition-transform">📥</span>
          </div>
          <div className="text-xl font-bold text-gray-900">View Received Faxes</div>
          <p className="text-gray-500 text-sm mt-2">
            Check incoming faxes in your eFax inbox
          </p>
        </a>
      </div>

      {/* eFax Login Portal */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">eFax Portal</h2>
            <p className="text-gray-500">Access your full eFax dashboard</p>
          </div>
          <a
            href={EFAX_CONFIG.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Open eFax Portal →
          </a>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-700 mb-2">Quick Login Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Account/Fax Number:</span>
              <span className="ml-2 font-mono bg-white px-2 py-1 rounded">{EFAX_CONFIG.accountId}</span>
            </div>
            <div>
              <span className="text-gray-500">Login URL:</span>
              <a href={EFAX_CONFIG.loginUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-600 hover:underline">
                efax.com/login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How eFax Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Receiving Faxes
            </h3>
            <ul className="space-y-2 text-gray-600 ml-10">
              <li>• Share your fax number: <strong>{EFAX_CONFIG.faxNumber}</strong></li>
              <li>• Faxes arrive as PDFs in your eFax inbox</li>
              <li>• Get email notifications for new faxes</li>
              <li>• Download, forward, or print from anywhere</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Sending Faxes
            </h3>
            <ul className="space-y-2 text-gray-600 ml-10">
              <li>• Click "Send a Fax" above or use eFax portal</li>
              <li>• Upload PDF, Word, or image files</li>
              <li>• Enter recipient's fax number</li>
              <li>• Track delivery status in real-time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Med Spa Fax Uses */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Common Med Spa Fax Uses</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-800">Medical Records</h3>
            <p className="text-sm text-gray-600">Send/receive patient records securely via fax for HIPAA compliance</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-2xl mb-2">💊</div>
            <h3 className="font-semibold text-gray-800">Prescriptions</h3>
            <p className="text-sm text-gray-600">Fax prescriptions to pharmacies or receive orders from physicians</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-2xl mb-2">📑</div>
            <h3 className="font-semibold text-gray-800">Insurance & Referrals</h3>
            <p className="text-sm text-gray-600">Process insurance paperwork and receive referrals from other providers</p>
          </div>
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Fax Activity</h2>
          <a
            href={EFAX_CONFIG.inboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View All in eFax →
          </a>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          To view your complete fax history, log in to your eFax portal.
        </p>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">📠</div>
          <p className="text-gray-600">Your fax activity appears in the eFax portal</p>
          <a
            href={EFAX_CONFIG.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
          >
            Log in to eFax
          </a>
        </div>
      </div>
    </div>
  );
}
