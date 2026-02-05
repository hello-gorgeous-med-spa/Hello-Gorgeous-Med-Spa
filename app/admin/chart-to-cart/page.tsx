// ============================================================
// CHART-TO-CART - Active Treatment Sessions
// What is charted is what is charged
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface TreatmentSession {
  id: string;
  client_id: string;
  client_name: string;
  provider: string;
  status: 'in_progress' | 'ready_to_checkout' | 'completed';
  started_at: string;
  treatment_summary: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
  total: number;
  paperwork: {
    consents: boolean;
    questionnaires: boolean;
  };
}

export default function ChartToCartPage() {
  const [sessions, setSessions] = useState<TreatmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'ready_to_checkout'>('all');

  // Mock data for demonstration
  useEffect(() => {
    // In production, this would fetch from API
    const mockSessions: TreatmentSession[] = [
      {
        id: '1',
        client_id: 'c1',
        client_name: 'Sydney Marie',
        provider: 'Olivia Richardson',
        status: 'ready_to_checkout',
        started_at: new Date(Date.now() - 45 * 60000).toISOString(),
        treatment_summary: 'Lips & Cheeks',
        products: [
          { id: 'p1', name: 'Revanesse Versa +', quantity: 1, unit: 'Syringe', price: 725 },
          { id: 'p2', name: 'Restylane Contour', quantity: 2, unit: 'Syringes', price: 1525 },
        ],
        total: 2846.48,
        paperwork: { consents: true, questionnaires: false },
      },
      {
        id: '2',
        client_id: 'c2',
        client_name: 'Danielle McVea',
        provider: 'Staff',
        status: 'in_progress',
        started_at: new Date(Date.now() - 20 * 60000).toISOString(),
        treatment_summary: 'Botox - Forehead & Glabella',
        products: [
          { id: 'p3', name: 'Botox Cosmetic', quantity: 33, unit: 'Units', price: 495 },
          { id: 'p4', name: 'Restylane Lyft', quantity: 1, unit: 'Syringe', price: 750 },
          { id: 'p5', name: 'Restylane Defyne', quantity: 1, unit: 'Syringe', price: 699 },
        ],
        total: 1944,
        paperwork: { consents: true, questionnaires: true },
      },
    ];

    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSessions = sessions.filter(s => 
    filter === 'all' || s.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Progress</span>;
      case 'ready_to_checkout':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Ready to Checkout</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Completed</span>;
      default:
        return null;
    }
  };

  const getTimeElapsed = (startedAt: string) => {
    const mins = Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            Chart-to-Cart
          </h1>
          <p className="text-gray-500 mt-1">What is charted is what is charged</p>
        </div>
        <Link
          href="/admin/chart-to-cart/new"
          className="px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium flex items-center gap-2"
        >
          <span>➕</span> New Treatment Session
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {sessions.filter(s => s.status === 'in_progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready to Checkout</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {sessions.filter(s => s.status === 'ready_to_checkout').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${sessions.reduce((sum, s) => sum + s.total, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products Used</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {sessions.reduce((sum, s) => sum + s.products.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('ready_to_checkout')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'ready_to_checkout' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Ready to Checkout
        </button>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <span className="text-6xl">🛒</span>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">No active sessions</h3>
          <p className="text-gray-500 mt-2">Start a new treatment session to begin charting</p>
          <Link
            href="/admin/chart-to-cart/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium mt-6"
          >
            <span>➕</span> Start New Session
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div 
              key={session.id} 
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Session Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {session.client_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-3">
                        {session.client_name}
                        {getStatusBadge(session.status)}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Provider: {session.provider} • {session.treatment_summary}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Started {getTimeElapsed(session.started_at)} ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${session.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">Total Due</p>
                  </div>
                </div>
              </div>

              {/* Products/Cart Summary */}
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-start gap-8">
                  {/* Products */}
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Current Sale
                    </h4>
                    <div className="space-y-2">
                      {session.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-pink-600 font-medium text-sm">{product.name}</span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                              {product.quantity}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Paperwork Status */}
                  <div className="w-48">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Paperwork
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {session.paperwork.consents ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-400">✕</span>
                        )}
                        <span className={`text-sm ${session.paperwork.consents ? 'text-gray-700' : 'text-gray-400'}`}>
                          Consents
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.paperwork.questionnaires ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-400">✕</span>
                        )}
                        <span className={`text-sm ${session.paperwork.questionnaires ? 'text-gray-700' : 'text-gray-400'}`}>
                          Questionnaires
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/charting/injection-map?client=${session.client_id}`}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>💉</span> View Chart
                  </Link>
                  <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                    <span>📝</span> Add Notes
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                    <span>📷</span> Photos
                  </button>
                </div>
                
                {session.status === 'ready_to_checkout' ? (
                  <Link
                    href={`/pos?session=${session.id}`}
                    className="px-6 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <span>💳</span> Take Payment
                  </Link>
                ) : (
                  <button className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2">
                    <span>✅</span> Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/charting/injection-map"
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              💉
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Injection Mapping</h3>
              <p className="text-sm text-blue-700">Chart treatments on face diagram</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/chart-to-cart/products"
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              💊
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Products & Pricing</h3>
              <p className="text-sm text-purple-700">Manage inventory pricing</p>
            </div>
          </div>
        </Link>

        <Link
          href="/pos"
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <h3 className="font-semibold text-green-900">POS Terminal</h3>
              <p className="text-sm text-green-700">Process payments</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
