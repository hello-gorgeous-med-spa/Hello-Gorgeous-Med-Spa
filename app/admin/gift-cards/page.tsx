'use client';

// ============================================================
// GIFT CARD MANAGEMENT PAGE
// Purchase, track, and redeem gift cards
// Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';


// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch gift cards from database
  useEffect(() => {
    const fetchGiftCards = async () => {
      if (false) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('gift_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setGiftCards(data);
        }
      } catch (err) {
        console.error('Error fetching gift cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);

  const totalLiability = giftCards
    .filter(gc => gc.status === 'active')
    .reduce((sum, gc) => sum + (gc.current_balance || 0), 0);
  
  const totalSold = giftCards.reduce((sum, gc) => sum + (gc.initial_amount || 0), 0);

  const filteredCards = giftCards.filter((gc) => {
    const matchesSearch = !searchQuery || 
      gc.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || gc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-gray-500">Sell, track, and redeem gift cards</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Redeem Card
          </button>
          <button
            onClick={() => setShowSellModal(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + Sell Gift Card
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {false && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to manage gift cards
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active Cards</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {giftCards.filter(gc => gc.status === 'active').length}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Outstanding Balance</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-amber-600">${totalLiability.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Sold</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">${totalSold.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Redeemed</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-600">
              {giftCards.filter(gc => gc.status === 'redeemed').length}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by code or recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="redeemed">Fully Redeemed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Code</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Recipient</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Initial</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Balance</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Expires</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-28 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-16 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-16 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-20 h-6 rounded-full" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-16 h-8" /></td>
                  </tr>
                ))
              ) : filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    {giftCards.length === 0 ? 'No gift cards yet' : 'No gift cards match your search'}
                    <br />
                    <button
                      onClick={() => setShowSellModal(true)}
                      className="text-pink-600 mt-2"
                    >
                      + Sell first gift card
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCards.map((gc) => (
                  <tr key={gc.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <span className="font-mono text-sm text-gray-900">{gc.code}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-gray-900">{gc.recipient_name || '-'}</p>
                      {gc.recipient_email && (
                        <p className="text-sm text-gray-500">{gc.recipient_email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-900">${gc.initial_amount || 0}</td>
                    <td className="px-5 py-3 font-semibold text-green-600">${gc.current_balance || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        gc.status === 'active' ? 'bg-green-100 text-green-700' :
                        gc.status === 'redeemed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {gc.expires_at ? new Date(gc.expires_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3">
                      {gc.status === 'active' && gc.current_balance > 0 && (
                        <button className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg">
                          Redeem
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sell Modal Placeholder */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sell Gift Card</h2>
            <p className="text-gray-500 mb-4">Gift card sales are processed through the POS terminal.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <a
                href="/pos/gift-card"
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-center"
              >
                Open POS
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal Placeholder */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Redeem Gift Card</h2>
            <p className="text-gray-500 mb-4">Gift card redemption is handled during checkout in the POS terminal.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <a
                href="/pos"
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-center"
              >
                Open POS
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
