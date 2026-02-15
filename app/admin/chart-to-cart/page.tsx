// ============================================================
// CHART-TO-CART - Aesthetic Record Style
// What is charted is what is charged - Square Integration
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chart-to-cart/sessions?limit=50');
      const data = await res.json();
      const list = (data.sessions || []).map((s: any) => ({
        id: s.id,
        client_id: s.client_id,
        client_name: s.client_name || 'Client',
        provider: s.provider || 'Staff',
        status: s.status,
        started_at: s.started_at,
        treatment_summary: s.treatment_summary || '',
        products: Array.isArray(s.products) ? s.products : [],
        total: Number(s.total) || 0,
        paperwork: s.paperwork || { consents: false, questionnaires: false },
      }));
      setSessions(list);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = sessions.filter(s => 
    filter === 'all' || s.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Progress</span>;
      case 'ready_to_checkout':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium animate-pulse">Ready to Checkout</span>;
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

  const activeCount = sessions.filter(s => s.status === 'in_progress').length;
  const readyCount = sessions.filter(s => s.status === 'ready_to_checkout').length;
  const todayRevenue = sessions.reduce((sum, s) => sum + s.total, 0);
  const productsUsed = sessions.reduce((sum, s) => sum + s.products.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header - Clean White & Pink */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Chart-to-Cart</h1>
                  <p className="text-pink-600 font-medium">Powered by Square</p>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-xl">
                The gap between charting and checkout is where revenue gets lost. 
                Chart-to-Cart closes that gap automatically.
              </p>
            </div>
            <Link
              href="/admin/chart-to-cart/new"
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/20"
            >
              <span>➕</span> New Treatment Session
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards - Floating */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Sessions</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{activeCount}</p>
                <p className="text-xs text-blue-600 mt-1">In treatment room</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Ready to Checkout</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{readyCount}</p>
                <p className="text-xs text-green-600 mt-1">Awaiting payment</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today&apos;s Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">${todayRevenue.toLocaleString()}</p>
                <p className="text-xs text-pink-600 mt-1">From chart-to-cart</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Products Charted</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{productsUsed}</p>
                <p className="text-xs text-purple-600 mt-1">Real-time inventory</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-2xl">💊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Aesthetic Record Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-5">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-3">
              <span className="text-lg">🔄</span>
            </div>
            <h3 className="font-bold text-gray-900">Treatment to Checkout</h3>
            <p className="text-sm text-gray-600 mt-1">
              Chart completes → cart populates → instant checkout. No communication gaps.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-5">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white mb-3">
              <span className="text-lg">✓</span>
            </div>
            <h3 className="font-bold text-gray-900">What&apos;s Charted = Charged</h3>
            <p className="text-sm text-gray-600 mt-1">
              Every product, unit, and service automatically syncs to invoice. Zero leakage.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-5">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white mb-3">
              <span className="text-lg">⏱️</span>
            </div>
            <h3 className="font-bold text-gray-900">No Double Entry</h3>
            <p className="text-sm text-gray-600 mt-1">
              Staff freed from cross-checking systems. Focus on patient care, not paperwork.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pink-100 p-5">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white mb-3">
              <span className="text-lg">📦</span>
            </div>
            <h3 className="font-bold text-gray-900">Real-Time Inventory</h3>
            <p className="text-sm text-gray-600 mt-1">
              Products used = inventory updated. Accurate cost analysis and supply tracking.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === 'in_progress' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              In Progress
            </button>
            <button
              onClick={() => setFilter('ready_to_checkout')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === 'ready_to_checkout' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Ready to Checkout
            </button>
          </div>

          <button
            onClick={fetchSessions}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No Active Sessions</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Start a new treatment session to begin charting. Products charted are automatically sent to the cart for checkout.
            </p>
            <Link
              href="/admin/chart-to-cart/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-xl hover:from-pink-600 hover:to-fuchsia-600 transition-all font-semibold mt-8 shadow-lg shadow-pink-500/25"
            >
              <span>➕</span> Start New Session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div 
                key={session.id} 
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-all ${
                  session.status === 'ready_to_checkout' 
                    ? 'border-green-200 ring-2 ring-green-100' 
                    : 'border-gray-100'
                }`}
              >
                {/* Status Banner */}
                {session.status === 'ready_to_checkout' && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center text-sm font-medium py-2 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Ready for Checkout — Cart Populated from Chart
                  </div>
                )}

                {/* Session Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/20">
                        {session.client_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-3">
                          {session.client_name}
                          {getStatusBadge(session.status)}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          <span className="font-medium">Provider:</span> {session.provider} • {session.treatment_summary}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <span>🕐</span> Started {getTimeElapsed(session.started_at)} ago
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📦</span> {session.products.length} items
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        ${session.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-400">Balance Due</p>
                    </div>
                  </div>
                </div>

                {/* Products/Cart Summary */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-start gap-8">
                    {/* Products */}
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center text-pink-600 text-xs">🛒</span>
                        Current Sale
                      </h4>
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {session.products.map((product, idx) => (
                          <div key={product.id} className={`flex items-center justify-between p-3 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}>
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 text-sm">
                                {product.quantity}×
                              </span>
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="font-bold text-gray-900">
                              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paperwork Status */}
                    <div className="w-52">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs">📋</span>
                        Paperwork
                      </h4>
                      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          {session.paperwork.consents ? (
                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs">✕</span>
                          )}
                          <span className={`text-sm ${session.paperwork.consents ? 'text-gray-700' : 'text-gray-400'}`}>
                            Consents Signed
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {session.paperwork.questionnaires ? (
                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                          ) : (
                            <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs">✕</span>
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
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/charting/injection-map?client=${session.client_id}`}
                      className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>💉</span> View Chart
                    </Link>
                    <button className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2">
                      <span>📝</span> Notes
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2">
                      <span>📷</span> Photos
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2">
                      <span>🎁</span> Loyalty
                    </button>
                  </div>
                  
                  {session.status === 'ready_to_checkout' ? (
                    <Link
                      href={`/pos?session=${session.id}`}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-green-500/25"
                    >
                      <span>💳</span> Take Payment with Square
                    </Link>
                  ) : (
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25">
                      <span>✅</span> Mark Ready for Checkout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/charting/injection-map"
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  💉
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Injection Mapping</h3>
                  <p className="text-sm text-gray-500">Chart treatments on face diagram</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/chart-to-cart/products"
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  💊
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Products & Pricing</h3>
                  <p className="text-sm text-gray-500">Manage inventory & pricing variations</p>
                </div>
              </div>
            </Link>

            <Link
              href="/pos"
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                  💳
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Square POS</h3>
                  <p className="text-sm text-gray-500">Process payments, apply loyalty</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⬜</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Square Integration</h3>
                  <p className="text-pink-600">Connected & Active</p>
                </div>
              </div>
              <p className="text-gray-600 max-w-xl">
                Chart products → Cart populates → Square processes payment → Inventory updates → Done. 
                One connected workflow on one device.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-4 bg-pink-50 border border-pink-100 rounded-xl">
                <p className="text-2xl font-bold text-pink-600">Wallet</p>
                <p className="text-xs text-gray-500 mt-1">Credits & Loyalty</p>
              </div>
              <div className="text-center px-6 py-4 bg-pink-50 border border-pink-100 rounded-xl">
                <p className="text-2xl font-bold text-pink-600">Text2Pay</p>
                <p className="text-xs text-gray-500 mt-1">Remote checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-8 text-gray-400 text-sm">
          <p>Chart-to-Cart eliminates revenue leakage and double entry. Every treatment charted is automatically charged.</p>
          <p className="mt-1">💎 VIP patients get a seamless, faster checkout experience.</p>
        </div>
      </div>
    </div>
  );
}
