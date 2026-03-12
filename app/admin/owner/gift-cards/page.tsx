'use client';

import { useState } from 'react';
import Link from 'next/link';
import OwnerLayout from '../layout-wrapper';

export default function OwnerGiftCardsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncingCustomers, setSyncingCustomers] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSyncGiftCards = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/gift-cards/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Gift cards synced!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Sync failed' });
    }
    setSyncing(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSyncCustomers = async () => {
    setSyncingCustomers(true);
    try {
      const res = await fetch('/api/square/customers/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Customers synced!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Sync failed' });
    }
    setSyncingCustomers(false);
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <OwnerLayout title="Gift Cards & Square Sync" description="Gift card program and Square integration settings.">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/admin/gift-cards"
            className="bg-white rounded-xl border p-6 hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-pink-600 transition-colors">Gift Card Management</h3>
                <p className="text-gray-600 text-sm mt-1">
                  View, sell, redeem, and track all gift cards in the system.
                </p>
                <span className="text-pink-600 text-sm font-medium mt-2 inline-block">
                  Manage Gift Cards →
                </span>
              </div>
            </div>
          </Link>

          <a 
            href="https://squareup.com/dashboard/gift-cards"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border p-6 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">🔗</span>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">Square Gift Cards</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage eGift cards in Square Dashboard. Set up online purchasing for customers.
                </p>
                <span className="text-blue-600 text-sm font-medium mt-2 inline-block">
                  Open Square Dashboard →
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Square Sync Section */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Square Integration</h2>
          <p className="text-gray-600 mb-6">
            Sync data between Square and Hello Gorgeous. Gift cards and customers created in Square will automatically sync via webhooks, but you can also run a manual sync.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Sync Gift Cards</h3>
              <p className="text-sm text-blue-700 mb-3">
                Import gift cards from Square into your system for unified tracking and redemption.
              </p>
              <button
                onClick={handleSyncGiftCards}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Gift Cards
                  </>
                )}
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-2">Sync Customers</h3>
              <p className="text-sm text-purple-700 mb-3">
                Import all customers from Square so you can chart, market to, and track their visits.
              </p>
              <button
                onClick={handleSyncCustomers}
                disabled={syncingCustomers}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {syncingCustomers ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Import Customers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Webhook Status Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-medium text-green-800">Automatic Sync Enabled</h3>
          <p className="text-sm text-green-700 mt-1">
            Square webhooks are configured to automatically sync:
          </p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• <strong>Customers:</strong> New customers and updates sync automatically</li>
            <li>• <strong>Gift Cards:</strong> Created, activated, redeemed, and balance changes</li>
            <li>• <strong>Payments:</strong> Terminal checkouts and payment completions</li>
            <li>• <strong>Orders:</strong> Completed orders link customers to your system</li>
          </ul>
        </div>

        {/* Configuration Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-medium text-amber-800">Webhook Configuration</h3>
          <p className="text-sm text-amber-700 mt-1">
            To enable automatic sync, ensure these webhook events are enabled in your Square Developer Dashboard:
          </p>
          <ul className="text-sm text-amber-700 mt-2 space-y-1 font-mono">
            <li>• customer.created, customer.updated, customer.deleted</li>
            <li>• gift_card.created, gift_card.updated, gift_card.activity.created</li>
            <li>• order.created, order.updated</li>
            <li>• payment.completed, payment.updated</li>
          </ul>
          <p className="text-sm text-amber-700 mt-2">
            Webhook URL: <code className="bg-amber-100 px-2 py-0.5 rounded">https://www.hellogorgeousmedspa.com/api/square/webhook</code>
          </p>
        </div>
      </div>
    </OwnerLayout>
  );
}
