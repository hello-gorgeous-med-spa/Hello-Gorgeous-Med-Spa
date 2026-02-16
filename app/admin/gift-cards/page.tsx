'use client';

// ============================================================
// GIFT CARD MANAGEMENT PAGE
// Purchase, track, and redeem gift cards
// Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb, ExportButton, NoDataEmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

export default function GiftCardsPage() {
  const toast = useToast();
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Client selector state
  const [clients, setClients] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Form for creating gift card
  const [createForm, setCreateForm] = useState({
    initial_amount: 50,
    recipient_name: '',
    recipient_email: '',
    recipient_client_id: '',
    purchaser_name: '',
    message: '',
  });

  // Form for redeeming
  const [redeemForm, setRedeemForm] = useState({
    code: '',
    amount: 0,
  });

  // Fetch gift cards from API
  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (searchQuery) params.append('search', searchQuery);
        
        const res = await fetch(`/api/gift-cards?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setGiftCards(data.giftCards || []);
      } catch (err) {
        console.error('Error loading gift cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftCards();
  }, [filterStatus, searchQuery]);

  // Fetch clients for dropdown when modal opens or search changes
  useEffect(() => {
    if (!showSellModal) return;
    
    const fetchClients = async () => {
      try {
        const params = new URLSearchParams();
        if (clientSearch) params.append('search', clientSearch);
        params.append('limit', '20');
        
        const res = await fetch(`/api/clients?${params}`);
        const data = await res.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error('Error loading clients:', err);
      }
    };
    
    const debounce = setTimeout(fetchClients, 300);
    return () => clearTimeout(debounce);
  }, [showSellModal, clientSearch]);

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

  // Create gift card
  const handleCreateGiftCard = async () => {
    if (createForm.initial_amount <= 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Gift card created! Code: ${data.giftCard?.code}` });
        setShowSellModal(false);
        setCreateForm({ initial_amount: 50, recipient_name: '', recipient_email: '', recipient_client_id: '', purchaser_name: '', message: '' });
        setSelectedClient(null);
        setClientSearch('');
        // Refresh list
        const refreshRes = await fetch('/api/gift-cards');
        const refreshData = await refreshRes.json();
        setGiftCards(refreshData.giftCards || []);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to create gift card' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create gift card' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Redeem gift card
  const handleRedeemGiftCard = async () => {
    if (!redeemForm.code || redeemForm.amount <= 0) return;
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
      if (res.ok) {
        setMessage({ type: 'success', text: `Redeemed $${redeemForm.amount}! New balance: $${data.newBalance}` });
        setShowRedeemModal(false);
        setRedeemForm({ code: '', amount: 0 });
        // Refresh
        const refreshRes = await fetch('/api/gift-cards');
        const refreshData = await refreshRes.json();
        setGiftCards(refreshData.giftCards || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to redeem' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to redeem gift card' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Void gift card
  const handleVoidCard = async (card: any) => {
    if (!window.confirm(`Void gift card ${card.code}? This will set the balance to $0 and cannot be undone.`)) return;
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, action: 'void' }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Gift card voided' });
        setGiftCards(prev => prev.map(gc => gc.id === card.id ? { ...gc, status: 'voided', current_balance: 0 } : gc));
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to void card' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Export columns
  const exportColumns = [
    { key: 'code', label: 'Code' },
    { key: 'recipient_name', label: 'Recipient' },
    { key: 'initial_amount', label: 'Initial Value', format: (v: number) => `$${v}` },
    { key: 'current_balance', label: 'Balance', format: (v: number) => `$${v}` },
    { key: 'status', label: 'Status' },
    { key: 'expires_at', label: 'Expires', format: (v: string) => v ? new Date(v).toLocaleDateString() : 'Never' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Gift Cards</h1>
          <p className="text-black">Sell, track, and redeem gift cards</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            data={giftCards}
            filename="gift-cards"
            columns={exportColumns}
          />
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors"
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

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Active Cards</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-black">
              {giftCards.filter(gc => gc.status === 'active').length}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Outstanding Balance</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-amber-600">${totalLiability.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Sold</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">${totalSold.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Redeemed</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-black">
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
            className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="redeemed">Fully Redeemed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Code</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Recipient</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Initial</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Balance</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Expires</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
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
                  <td colSpan={7} className="px-5 py-4">
                    {giftCards.length === 0 ? (
                      <NoDataEmptyState type="gift cards" />
                    ) : (
                      <div className="text-center py-8 text-black">
                        No gift cards match your search
                        <br />
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-pink-600 mt-2"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCards.map((gc) => (
                  <tr key={gc.id} className="hover:bg-white">
                    <td className="px-5 py-3">
                      <span className="font-mono text-sm text-black">{gc.code}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-black">{gc.recipient_name || '-'}</p>
                      {gc.recipient_email && (
                        <p className="text-sm text-black">{gc.recipient_email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-black">${gc.initial_amount || 0}</td>
                    <td className="px-5 py-3 font-semibold text-green-600">${gc.current_balance || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        gc.status === 'active' ? 'bg-green-100 text-green-700' :
                        gc.status === 'redeemed' ? 'bg-white text-black' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {gc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-black">
                      {gc.expires_at ? new Date(gc.expires_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {gc.status === 'active' && gc.current_balance > 0 && (
                          <button 
                            onClick={() => {
                              setRedeemForm({ code: gc.code, amount: gc.current_balance });
                              setShowRedeemModal(true);
                            }}
                            className="px-2 py-1 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded"
                          >
                            Redeem
                          </button>
                        )}
                        {gc.status === 'active' && (
                          <button 
                            onClick={() => handleVoidCard(gc)}
                            className="px-2 py-1 text-sm text-black hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            Void
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Gift Card Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Create Gift Card</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Amount *</label>
                <div className="flex gap-2">
                  {[25, 50, 100, 150, 200].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCreateForm({...createForm, initial_amount: amt})}
                      className={`px-3 py-2 rounded-lg border ${createForm.initial_amount === amt ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-black text-black'}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={createForm.initial_amount}
                  onChange={(e) => setCreateForm({...createForm, initial_amount: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-black rounded-lg mt-2"
                  placeholder="Custom amount"
                />
              </div>

              {/* Client Selector */}
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">
                  Link to Client Profile <span className="text-black font-normal">(optional)</span>
                </label>
                {selectedClient ? (
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-medium">
                        {selectedClient.first_name?.[0]}{selectedClient.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-black">{selectedClient.first_name} {selectedClient.last_name}</p>
                        <p className="text-sm text-black">{selectedClient.email || selectedClient.phone}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(null);
                        setCreateForm({...createForm, recipient_client_id: '', recipient_name: '', recipient_email: ''});
                      }}
                      className="text-black hover:text-black"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setShowClientDropdown(true);
                      }}
                      onFocus={() => setShowClientDropdown(true)}
                      className="w-full px-4 py-2 border border-black rounded-lg"
                      placeholder="Search clients by name or email..."
                    />
                    {showClientDropdown && clients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => {
                              setSelectedClient(client);
                              setCreateForm({
                                ...createForm,
                                recipient_client_id: client.id,
                                recipient_name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
                                recipient_email: client.email || '',
                              });
                              setShowClientDropdown(false);
                              setClientSearch('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-white flex items-center gap-3 border-b border-black last:border-0"
                          >
                            <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {client.first_name?.[0]}{client.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-black">{client.first_name} {client.last_name}</p>
                              <p className="text-sm text-black">{client.email || client.phone}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {showClientDropdown && clientSearch && clients.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-black rounded-lg shadow-lg p-4 text-center text-black">
                        No clients found
                      </div>
                    )}
                  </>
                )}
                <p className="text-xs text-black mt-1">Card will appear in their profile's Payments tab</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={createForm.recipient_name}
                  onChange={(e) => setCreateForm({...createForm, recipient_name: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="Who is this for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={createForm.recipient_email}
                  onChange={(e) => setCreateForm({...createForm, recipient_email: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="Email to send gift card code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Purchaser Name</label>
                <input
                  type="text"
                  value={createForm.purchaser_name}
                  onChange={(e) => setCreateForm({...createForm, purchaser_name: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="Who purchased this?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Message (optional)</label>
                <textarea
                  value={createForm.message}
                  onChange={(e) => setCreateForm({...createForm, message: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={2}
                  placeholder="Personal message..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => setShowSellModal(false)} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleCreateGiftCard}
                disabled={saving || createForm.initial_amount <= 0}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Creating...' : `Create $${createForm.initial_amount} Gift Card`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Gift Card Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Redeem Gift Card</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Gift Card Code *</label>
                <input
                  type="text"
                  value={redeemForm.code}
                  onChange={(e) => setRedeemForm({...redeemForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-black rounded-lg font-mono"
                  placeholder="HG-XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Amount to Redeem *</label>
                <input
                  type="number"
                  step="0.01"
                  value={redeemForm.amount || ''}
                  onChange={(e) => setRedeemForm({...redeemForm, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => setShowRedeemModal(false)} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleRedeemGiftCard}
                disabled={saving || !redeemForm.code || redeemForm.amount <= 0}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Redeeming...' : `Redeem $${redeemForm.amount || 0}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
