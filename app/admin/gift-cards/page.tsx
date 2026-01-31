'use client';

// ============================================================
// GIFT CARD MANAGEMENT PAGE
// Purchase, track, and redeem gift cards
// ============================================================

import { useState } from 'react';

const MOCK_GIFT_CARDS = [
  {
    id: 'gc1',
    code: 'HG-2026-ABCD-1234',
    initialAmount: 200,
    currentBalance: 125,
    purchasedBy: 'Jennifer Martinez',
    purchasedAt: '2026-01-15',
    recipientName: 'Sarah Johnson',
    recipientEmail: 'sarah@example.com',
    status: 'active',
    expiresAt: '2027-01-15',
  },
  {
    id: 'gc2',
    code: 'HG-2026-EFGH-5678',
    initialAmount: 100,
    currentBalance: 100,
    purchasedBy: 'Emily Chen',
    purchasedAt: '2026-01-20',
    recipientName: 'Mom',
    recipientEmail: null,
    status: 'active',
    expiresAt: '2027-01-20',
  },
  {
    id: 'gc3',
    code: 'HG-2025-IJKL-9012',
    initialAmount: 150,
    currentBalance: 0,
    purchasedBy: 'Amanda Wilson',
    purchasedAt: '2025-06-01',
    recipientName: 'Lisa Thompson',
    recipientEmail: 'lisa@example.com',
    status: 'redeemed',
    expiresAt: '2026-06-01',
  },
  {
    id: 'gc4',
    code: 'HG-2025-MNOP-3456',
    initialAmount: 75,
    currentBalance: 75,
    purchasedBy: 'Walk-in',
    purchasedAt: '2025-12-20',
    recipientName: null,
    recipientEmail: null,
    status: 'active',
    expiresAt: '2026-12-20',
  },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', cardCode: 'HG-2026-ABCD-1234', type: 'purchase', amount: 200, date: '2026-01-15', by: 'Jennifer Martinez' },
  { id: 't2', cardCode: 'HG-2026-ABCD-1234', type: 'redemption', amount: -75, date: '2026-01-25', by: 'Sarah Johnson', service: 'Botox' },
  { id: 't3', cardCode: 'HG-2026-EFGH-5678', type: 'purchase', amount: 100, date: '2026-01-20', by: 'Emily Chen' },
];

export default function GiftCardsPage() {
  const [giftCards] = useState(MOCK_GIFT_CARDS);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const totalLiability = giftCards
    .filter(gc => gc.status === 'active')
    .reduce((sum, gc) => sum + gc.currentBalance, 0);
  
  const totalSold = giftCards.reduce((sum, gc) => sum + gc.initialAmount, 0);

  const filteredCards = giftCards.filter((gc) => {
    const matchesSearch = gc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gc.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gc.purchasedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || gc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-gray-500">Sell, track, and redeem gift cards</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Redeem
          </button>
          <button
            onClick={() => setShowSellModal(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
          >
            + Sell Gift Card
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Sold (All Time)</p>
          <p className="text-3xl font-bold text-gray-900">${totalSold.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Outstanding Liability</p>
          <p className="text-3xl font-bold text-amber-500">${totalLiability.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Active Cards</p>
          <p className="text-3xl font-bold text-green-600">
            {giftCards.filter(gc => gc.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Sold This Month</p>
          <p className="text-3xl font-bold text-pink-500">$300</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by code, purchaser, or recipient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="redeemed">Fully Redeemed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Code</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Recipient</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Purchased By</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Initial</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Balance</th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Expires</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm">{card.code}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{card.recipientName || '-'}</p>
                    {card.recipientEmail && (
                      <p className="text-sm text-gray-500">{card.recipientEmail}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {card.purchasedBy}
                  <p className="text-sm text-gray-400">{card.purchasedAt}</p>
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  ${card.initialAmount}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={card.currentBalance > 0 ? 'font-bold text-green-600' : 'text-gray-400'}>
                    ${card.currentBalance}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    card.status === 'active' ? 'bg-green-100 text-green-700' :
                    card.status === 'redeemed' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {card.expiresAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {card.status === 'active' && card.currentBalance > 0 && (
                      <button className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg">
                        Redeem
                      </button>
                    )}
                    <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                      History
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'purchase' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {tx.type === 'purchase' ? '+' : '-'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    {tx.type === 'purchase' ? 'Card Purchased' : `Redeemed for ${tx.service}`}
                  </p>
                  <p className="text-sm text-gray-500">{tx.cardCode} • {tx.by}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${tx.type === 'purchase' ? 'text-green-600' : 'text-gray-900'}`}>
                  {tx.type === 'purchase' ? '+' : ''}${Math.abs(tx.amount)}
                </p>
                <p className="text-sm text-gray-400">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sell Gift Card Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Sell Gift Card</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[50, 100, 150, 200].map((amount) => (
                    <button
                      key={amount}
                      className="py-2 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Who's it for?"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="Email to send card"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                <textarea
                  rows={2}
                  placeholder="Add a personal message (optional)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchased By</label>
                <input
                  type="text"
                  placeholder="Search client or enter name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowSellModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSellModal(false);
                  alert('Gift card sold! (Demo mode)');
                }}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Sell Gift Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Redeem Gift Card</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gift Card Code *</label>
                <input
                  type="text"
                  placeholder="HG-2026-XXXX-XXXX"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono"
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Card Balance</p>
                <p className="text-2xl font-bold text-green-600">$125.00</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Redeem *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  alert('Gift card redeemed! (Demo mode)');
                }}
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
