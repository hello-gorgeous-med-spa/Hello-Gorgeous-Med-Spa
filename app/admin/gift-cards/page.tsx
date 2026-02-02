'use client';

// ============================================================
// GIFT CARD MANAGEMENT PAGE
// Full Square integration - NO manual reconciliation
// ============================================================

import { useState, useEffect } from 'react';

interface GiftCard {
  id: string;
  code: string;
  gan_last_4: string | null;
  square_gift_card_id: string | null;
  initial_value: number;
  current_balance: number;
  status: string;
  card_type: string;
  source: string;
  recipient_name: string | null;
  recipient_email: string | null;
  purchaser_name: string | null;
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
  last_synced_at: string | null;
}

interface Stats {
  totalCards: number;
  activeCards: number;
  totalLiability: number;
  totalSold: number;
  totalRedeemed: number;
}

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [showDetails, setShowDetails] = useState<GiftCard | null>(null);
  const [syncing, setSyncing] = useState(false);
  
  // Create form
  const [createForm, setCreateForm] = useState({
    initial_amount: 50,
    recipient_name: '',
    recipient_email: '',
    purchaser_name: '',
    message: '',
    card_type: 'digital',
  });
  
  // Redeem form
  const [redeemForm, setRedeemForm] = useState({
    code: '',
    amount: 0,
  });
  
  const [saving, setSaving] = useState(false);

  // Fetch gift cards from REAL database
  useEffect(() => {
    fetchGiftCards();
  }, [statusFilter, searchTerm]);

  const fetchGiftCards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchTerm) params.set('search', searchTerm);
      
      const res = await fetch(`/api/gift-cards?${params}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch gift cards');
      }
      
      setGiftCards(data.giftCards || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gift cards');
      setGiftCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create gift card
  const handleCreate = async () => {
    if (!createForm.initial_amount || createForm.initial_amount <= 0) {
      setMessage({ type: 'error', text: 'Valid amount required' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Gift card created! Code: ${data.giftCard?.code}${data.squareLinked ? ' (Square linked)' : ''}` 
        });
        setShowCreate(false);
        setCreateForm({ initial_amount: 50, recipient_name: '', recipient_email: '', purchaser_name: '', message: '', card_type: 'digital' });
        fetchGiftCards();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create gift card' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to create gift card' });
    } finally {
      setSaving(false);
    }
  };

  // Redeem gift card
  const handleRedeem = async () => {
    if (!redeemForm.code || !redeemForm.amount || redeemForm.amount <= 0) {
      setMessage({ type: 'error', text: 'Code and amount required' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemForm.code,
          action: 'redeem',
          amount: redeemForm.amount,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Redeemed $${redeemForm.amount}. New balance: $${data.newBalance}${data.squareSynced ? ' (Square synced)' : ''}` 
        });
        setShowRedeem(false);
        setRedeemForm({ code: '', amount: 0 });
        fetchGiftCards();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to redeem' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to redeem gift card' });
    } finally {
      setSaving(false);
    }
  };

  // Void gift card
  const handleVoid = async (card: GiftCard) => {
    if (!window.confirm(`Void gift card ${card.code}? Balance ($${card.current_balance}) will be zeroed.`)) return;

    try {
      const res = await fetch('/api/gift-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, action: 'void', reason: 'Voided by admin' }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Gift card voided' });
        fetchGiftCards();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to void' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to void gift card' });
    }
  };

  // Sync with Square
  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/gift-cards/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full: false }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Sync complete: ${data.synced} synced, ${data.errors} errors${data.mismatches?.length ? `, ${data.mismatches.length} mismatches fixed` : ''}` 
        });
        fetchGiftCards();
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'redeemed': return 'bg-gray-100 text-gray-600';
      case 'voided': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-gray-500">Square integrated - Real-time balance sync</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          >
            {syncing ? '🔄 Syncing...' : '🔄 Sync with Square'}
          </button>
          <button
            onClick={() => setShowRedeem(true)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            💳 Redeem
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            + Sell Gift Card
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Stats - REAL DATA */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total Cards</p>
            <p className="text-2xl font-bold">{stats.totalCards}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Active Cards</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeCards}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total Sold</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalSold)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total Redeemed</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRedeemed)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <p className="text-sm text-amber-700">Outstanding Liability</p>
            <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.totalLiability)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by code, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="redeemed">Redeemed</option>
            <option value="voided">Voided</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
          <span className="text-4xl block mb-3">❌</span>
          <h3 className="font-semibold text-red-800 mb-2">Error Loading Gift Cards</h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button onClick={fetchGiftCards} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="animate-spin text-4xl mb-4">🎁</div>
          <p className="text-gray-500">Loading gift cards...</p>
        </div>
      )}

      {/* Gift Cards Table - REAL DATA */}
      {!isLoading && !error && (
        <div className="bg-white rounded-xl border overflow-hidden">
          {giftCards.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CODE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">RECIPIENT</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">INITIAL</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">BALANCE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">STATUS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">SOURCE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CREATED</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {giftCards.map(card => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{card.code}</span>
                        {card.square_gift_card_id && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Square</span>
                        )}
                      </div>
                      {card.gan_last_4 && (
                        <p className="text-xs text-gray-400">•••• {card.gan_last_4}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{card.recipient_name || '—'}</p>
                      <p className="text-xs text-gray-400">{card.recipient_email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(card.initial_value)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${card.current_balance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {formatCurrency(card.current_balance)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(card.status)}`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{card.source}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(card.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDetails(card)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          View
                        </button>
                        {card.status === 'active' && (
                          <button
                            onClick={() => handleVoid(card)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            Void
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-3">🎁</span>
              <h3 className="font-medium text-gray-700 mb-1">No gift cards yet</h3>
              <p className="text-sm text-gray-500 mb-4">Sell your first gift card to get started</p>
              <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                + Sell Gift Card
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Sell Gift Card</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <div className="flex gap-2">
                  {[25, 50, 100, 150, 200].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCreateForm(prev => ({ ...prev, initial_amount: amt }))}
                      className={`px-3 py-2 border rounded-lg text-sm ${createForm.initial_amount === amt ? 'bg-purple-100 border-purple-500' : ''}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={createForm.initial_amount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, initial_amount: parseFloat(e.target.value) || 0 }))}
                  className="mt-2 w-full px-3 py-2 border rounded-lg"
                  placeholder="Custom amount"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={createForm.recipient_name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, recipient_name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={createForm.recipient_email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, recipient_email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="To send digital gift card"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                <textarea
                  value={createForm.message}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Add a personal message..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !createForm.initial_amount}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Creating...' : `Create $${createForm.initial_amount} Card`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {showRedeem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Redeem Gift Card</h2>
              <button onClick={() => setShowRedeem(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gift Card Code *</label>
                <input
                  type="text"
                  value={redeemForm.code}
                  onChange={(e) => setRedeemForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                  placeholder="HG-XXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Redeem *</label>
                <input
                  type="number"
                  value={redeemForm.amount || ''}
                  onChange={(e) => setRedeemForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRedeem(false)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={saving || !redeemForm.code || !redeemForm.amount}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Redeeming...' : `Redeem $${redeemForm.amount || 0}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Gift Card Details</h2>
              <button onClick={() => setShowDetails(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-mono text-lg font-bold">{showDetails.code}</p>
                  {showDetails.gan_last_4 && <p className="text-sm text-gray-500">•••• {showDetails.gan_last_4}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">${showDetails.current_balance.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">of ${showDetails.initial_value.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(showDetails.status)}`}>
                    {showDetails.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Source</p>
                  <p className="font-medium">{showDetails.source}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(showDetails.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Used</p>
                  <p className="font-medium">{formatDate(showDetails.last_used_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expires</p>
                  <p className="font-medium">{formatDate(showDetails.expires_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Synced</p>
                  <p className="font-medium">{formatDate(showDetails.last_synced_at)}</p>
                </div>
              </div>
              
              {showDetails.recipient_name && (
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm">Recipient</p>
                  <p className="font-medium">{showDetails.recipient_name}</p>
                  {showDetails.recipient_email && <p className="text-sm text-gray-500">{showDetails.recipient_email}</p>}
                </div>
              )}
              
              {showDetails.square_gift_card_id && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                  <span className="text-blue-500">✓</span>
                  <span className="text-blue-700">Linked to Square</span>
                  <span className="text-blue-500 font-mono text-xs ml-auto">{showDetails.square_gift_card_id.slice(0, 8)}...</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDetails(null)} className="flex-1 px-4 py-2 border rounded-lg">
                Close
              </button>
              {showDetails.status === 'active' && (
                <button
                  onClick={() => { handleVoid(showDetails); setShowDetails(null); }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  Void Card
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
