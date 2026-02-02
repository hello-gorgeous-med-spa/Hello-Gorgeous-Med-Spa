'use client';

// ============================================================
// FINANCIAL COMMAND CENTER - CFO COCKPIT
// Complete financial oversight and pricing control
// Revenue tracking, refunds, pricing management
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================

interface FinancialSummary {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  pendingRefunds: number;
  processingFees: number;
  netRevenue: number;
  avgTransaction: number;
  transactionCount: number;
  giftCardLiability: number;
  membershipRevenue: number;
  serviceRevenue: number;
  retailRevenue: number;
  tipRevenue: number;
}

interface Transaction {
  id: string;
  created_at: string;
  client_name: string;
  client_id?: string;
  service_name?: string;
  amount: number;
  payment_method: string;
  status: string;
  stripe_payment_intent_id?: string;
  refund_amount?: number;
  tip_amount?: number;
  notes?: string;
}

interface Service {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  price: number;
  duration: number;
  is_active: boolean;
}

interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

// ============================================================
// COMPONENTS
// ============================================================

function StatCard({ label, value, subValue, icon, color = 'gray' }: {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: string;
  color?: 'gray' | 'green' | 'red' | 'blue' | 'purple';
}) {
  const colorStyles = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {icon && <span>{icon}</span>}
      </div>
      <p className={`text-2xl font-bold ${colorStyles[color]} mt-1`}>{value}</p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function FinancialCommandCenter() {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pricing' | 'refunds'>('overview');
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'year'>('month');
  
  // Pricing editor state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  // Refund state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);

  // Fetch financial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch transactions
      const txRes = await fetch('/api/transactions?limit=500');
      const txData = await txRes.json();
      const allTransactions = txData.transactions || [];
      setTransactions(allTransactions);

      // Fetch services for pricing
      const svcRes = await fetch('/api/services');
      const svcData = await svcRes.json();
      setServices(svcData.services || []);

      // Calculate summary
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const completed = allTransactions.filter((t: Transaction) => t.status === 'completed' || t.status === 'succeeded');
      
      const todayTx = completed.filter((t: Transaction) => new Date(t.created_at) >= todayStart);
      const weekTx = completed.filter((t: Transaction) => new Date(t.created_at) >= weekAgo);
      const monthTx = completed.filter((t: Transaction) => new Date(t.created_at) >= monthAgo);
      const yearTx = completed.filter((t: Transaction) => new Date(t.created_at) >= yearStart);

      const todayRevenue = todayTx.reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);
      const weekRevenue = weekTx.reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);
      const monthRevenue = monthTx.reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);
      const yearRevenue = yearTx.reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);

      const pendingRefunds = allTransactions
        .filter((t: Transaction) => t.status === 'refund_pending')
        .reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);

      // Estimate processing fees (2.9% + $0.30 per transaction)
      const processingFees = monthTx.reduce((sum: number) => sum + 0.30, 0) + monthRevenue * 0.029;

      const tipRevenue = monthTx.reduce((sum: number, t: Transaction) => sum + (t.tip_amount || 0), 0);

      setSummary({
        todayRevenue,
        weekRevenue,
        monthRevenue,
        yearRevenue,
        pendingRefunds,
        processingFees: Math.round(processingFees * 100) / 100,
        netRevenue: monthRevenue - processingFees,
        avgTransaction: monthTx.length > 0 ? Math.round(monthRevenue / monthTx.length) : 0,
        transactionCount: monthTx.length,
        giftCardLiability: 0, // Would come from gift cards
        membershipRevenue: 0, // Would come from memberships
        serviceRevenue: monthRevenue,
        retailRevenue: 0,
        tipRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update service price
  const handleUpdatePrice = async () => {
    if (!editingService || !newPrice) return;
    setSavingPrice(true);
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      if (res.ok) {
        setServices(prev => prev.map(s => 
          s.id === editingService.id ? { ...s, price: parseFloat(newPrice) } : s
        ));
        setEditingService(null);
        setNewPrice('');
      }
    } catch (error) {
      console.error('Failed to update price:', error);
    } finally {
      setSavingPrice(false);
    }
  };

  // Process refund
  const handleRefund = async () => {
    if (!selectedTransaction || !refundAmount || !refundReason) return;
    setProcessingRefund(true);
    try {
      const res = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: selectedTransaction.stripe_payment_intent_id,
          amount: parseFloat(refundAmount) * 100, // Convert to cents
          reason: refundReason,
        }),
      });
      
      if (res.ok) {
        // Update local state
        setTransactions(prev => prev.map(t => 
          t.id === selectedTransaction.id 
            ? { ...t, status: 'refunded', refund_amount: parseFloat(refundAmount) }
            : t
        ));
        setSelectedTransaction(null);
        setRefundAmount('');
        setRefundReason('');
        alert('Refund processed successfully');
      } else {
        const error = await res.json();
        alert(`Refund failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Refund failed:', error);
      alert('Failed to process refund');
    } finally {
      setProcessingRefund(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    !searchQuery || 
    t.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    !searchQuery ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Command Center</h1>
          <p className="text-gray-500">Revenue tracking, pricing control, and refund management</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/export"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            📊 Export Reports
          </Link>
          <Link
            href="/pos"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            💳 Open POS
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['overview', 'transactions', 'pricing', 'refunds'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && '📊 '}
            {tab === 'transactions' && '💳 '}
            {tab === 'pricing' && '💰 '}
            {tab === 'refunds' && '↩️ '}
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Today" 
              value={`$${(summary?.todayRevenue || 0).toLocaleString()}`}
              icon="💵"
              color="green"
            />
            <StatCard 
              label="This Week" 
              value={`$${(summary?.weekRevenue || 0).toLocaleString()}`}
              color="green"
            />
            <StatCard 
              label="This Month" 
              value={`$${(summary?.monthRevenue || 0).toLocaleString()}`}
              subValue={`${summary?.transactionCount || 0} transactions`}
              color="green"
            />
            <StatCard 
              label="YTD" 
              value={`$${(summary?.yearRevenue || 0).toLocaleString()}`}
              color="green"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Avg Transaction" 
              value={`$${summary?.avgTransaction || 0}`}
            />
            <StatCard 
              label="Processing Fees" 
              value={`$${(summary?.processingFees || 0).toLocaleString()}`}
              subValue="~2.9% + $0.30/tx"
              color="red"
            />
            <StatCard 
              label="Net Revenue" 
              value={`$${Math.round(summary?.netRevenue || 0).toLocaleString()}`}
              subValue="After fees"
              color="blue"
            />
            <StatCard 
              label="Tips Collected" 
              value={`$${(summary?.tipRevenue || 0).toLocaleString()}`}
              color="purple"
            />
          </div>

          {/* Revenue Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue by Category</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-bold text-gray-900">${(summary?.serviceRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600">Retail</span>
                  <span className="font-bold text-gray-900">${(summary?.retailRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600">Memberships</span>
                  <span className="font-bold text-gray-900">${(summary?.membershipRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Liabilities & Pending</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-amber-800">Pending Refunds</p>
                    <p className="text-sm text-amber-600">Awaiting processing</p>
                  </div>
                  <span className="text-xl font-bold text-amber-700">
                    ${(summary?.pendingRefunds || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Gift Card Liability</p>
                    <p className="text-sm text-purple-600">Unredeemed balance</p>
                  </div>
                  <span className="text-xl font-bold text-purple-700">
                    ${(summary?.giftCardLiability || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by client or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-4 py-3">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.slice(0, 50).map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{tx.client_name || 'Guest'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tx.service_name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tx.payment_method === 'card' ? 'bg-blue-100 text-blue-700' :
                          tx.payment_method === 'cash' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.payment_method || 'Card'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tx.status === 'completed' || tx.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                          tx.status === 'refunded' ? 'bg-amber-100 text-amber-700' :
                          tx.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ${(tx.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(tx.status === 'completed' || tx.status === 'succeeded') && tx.stripe_payment_intent_id && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setRefundAmount(String(tx.amount));
                              setActiveTab('refunds');
                            }}
                            className="text-sm text-pink-600 hover:text-pink-700"
                          >
                            Refund
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
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />

          {/* Pricing Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Current Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{service.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.category_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.duration} min
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingService?.id === service.id ? (
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-24 px-2 py-1 border border-pink-300 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="font-bold text-gray-900">${service.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingService?.id === service.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={handleUpdatePrice}
                            disabled={savingPrice}
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            {savingPrice ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingService(null);
                              setNewPrice('');
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setNewPrice(String(service.price));
                          }}
                          className="text-sm text-pink-600 hover:text-pink-700"
                        >
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bulk Actions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2">Bulk Price Updates</h3>
            <p className="text-sm text-amber-700 mb-3">
              For bulk price changes (e.g., annual price increases), export services to CSV, update prices, 
              and import. This ensures proper audit trail and version control.
            </p>
            <div className="flex gap-3">
              <Link
                href="/admin/export?type=services"
                className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg text-sm hover:bg-amber-50"
              >
                Export Services
              </Link>
              <Link
                href="/admin/services"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
              >
                Full Service Editor
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <div className="space-y-6">
          {/* Process Refund Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Process Refund</h3>
            
            {selectedTransaction ? (
              <div className="space-y-4">
                {/* Selected Transaction Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium">{selectedTransaction.client_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Original Amount</p>
                      <p className="font-medium">${selectedTransaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(selectedTransaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium">{selectedTransaction.service_name || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Refund Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Refund Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        max={selectedTransaction.amount}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max: ${selectedTransaction.amount} (full refund)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Refund
                    </label>
                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select a reason...</option>
                      <option value="requested_by_customer">Requested by customer</option>
                      <option value="duplicate">Duplicate charge</option>
                      <option value="fraudulent">Fraudulent charge</option>
                      <option value="service_not_provided">Service not provided</option>
                      <option value="service_unsatisfactory">Service unsatisfactory</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRefund}
                      disabled={processingRefund || !refundAmount || !refundReason}
                      className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {processingRefund ? 'Processing...' : `Process Refund ($${refundAmount || 0})`}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTransaction(null);
                        setRefundAmount('');
                        setRefundReason('');
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl block mb-2">💳</span>
                <p className="text-gray-500 mb-4">Select a transaction to refund</p>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  View Transactions
                </button>
              </div>
            )}
          </div>

          {/* Refund History */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Refunds</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {transactions
                .filter(t => t.status === 'refunded')
                .slice(0, 10)
                .map((tx) => (
                  <div key={tx.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{tx.client_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()} • {tx.service_name || 'Service'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        -${(tx.refund_amount || tx.amount || 0).toLocaleString()}
                      </p>
                      <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        Refunded
                      </span>
                    </div>
                  </div>
                ))}
              {transactions.filter(t => t.status === 'refunded').length === 0 && (
                <div className="px-5 py-8 text-center text-gray-500">
                  No refunds processed
                </div>
              )}
            </div>
          </div>

          {/* Refund Policy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Refund Policy</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Full refunds are available within 24 hours of service</li>
              <li>• Partial refunds may be issued for service quality issues</li>
              <li>• Refunds are processed back to the original payment method</li>
              <li>• All refunds are logged for compliance and audit purposes</li>
              <li>• Refunds typically appear in 5-10 business days</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
