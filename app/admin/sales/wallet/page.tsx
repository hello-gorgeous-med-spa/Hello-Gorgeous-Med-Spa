'use client';

// ============================================================
// BUSINESS WALLET PAGE
// Live Cash Position - Shows real money movement
// This is NOT revenue - this is actual cash flow
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Wallet {
  date: string;
  openingBalance: number;
  closingBalance: number;
  activity: {
    paymentsReceived: number;
    refundsIssued: number;
    processingFees: number;
    tips: number;
    netMovement: number;
  };
  byMethod: {
    card: number;
    cash: number;
    giftCard: number;
    membershipCredit: number;
    other: number;
  };
  byProcessor: {
    square: { collected: number; fees: number; net: number };
    stripe: { collected: number; fees: number; net: number };
    cash: { collected: number; fees: number; net: number };
    giftCard: { collected: number; fees: number; net: number };
    other: { collected: number; fees: number; net: number };
  };
  counts: {
    totalTransactions: number;
    collections: number;
    refunds: number;
    pending: number;
  };
  pending: {
    payments: number;
    count: number;
  };
  status: string;
  lastUpdated: string;
}

export default function BusinessWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const fetchWallet = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sales/wallet');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch wallet');
      }

      setWallet(data.wallet);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchWallet, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/sales" className="text-sm text-black hover:text-black">
            ← Back to Sales
          </Link>
          <h1 className="text-2xl font-bold text-black mt-1">Business Wallet</h1>
          <p className="text-black text-sm">Live cash position - Updated in real time</p>
        </div>
        <button
          onClick={fetchWallet}
          disabled={isLoading}
          className="px-4 py-2 bg-white hover:bg-white rounded-lg flex items-center gap-2"
        >
          <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
          Refresh
        </button>
      </div>

      {isLoading && !wallet ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="animate-spin text-4xl mb-4">💼</div>
          <p className="text-black">Loading wallet...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : wallet ? (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-green-600">LIVE</span>
              </span>
              <span className="text-black">|</span>
              <span className="text-sm text-black">
                Last updated: {formatTime(wallet.lastUpdated)}
              </span>
            </div>
            <span className="text-sm text-black">
              {new Date(wallet.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Main Balance Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Today's Net Movement</p>
            <p className="text-5xl font-bold mt-2">{formatCurrency(wallet.activity.netMovement)}</p>
            
            <div className="mt-8 grid grid-cols-4 gap-6">
              <div>
                <p className="text-emerald-200 text-xs uppercase">Payments Received</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(wallet.activity.paymentsReceived)}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs uppercase">Refunds Issued</p>
                <p className="text-2xl font-semibold mt-1 text-red-300">-{formatCurrency(wallet.activity.refundsIssued)}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs uppercase">Processing Fees</p>
                <p className="text-2xl font-semibold mt-1 text-orange-300">-{formatCurrency(wallet.activity.processingFees)}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs uppercase">Tips</p>
                <p className="text-2xl font-semibold mt-1 text-blue-200">{formatCurrency(wallet.activity.tips)}</p>
              </div>
            </div>
          </div>

          {/* Transaction Counts */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-3xl font-bold text-black">{wallet.counts.totalTransactions}</p>
              <p className="text-sm text-black">Total Transactions</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{wallet.counts.collections}</p>
              <p className="text-sm text-black">Collections</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{wallet.counts.refunds}</p>
              <p className="text-sm text-black">Refunds</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{wallet.counts.pending}</p>
              <p className="text-sm text-amber-600">Pending</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* By Payment Method */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b bg-white">
                <h3 className="font-semibold">By Payment Method</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <span>Card Payments</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(wallet.byMethod.card)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💵</span>
                    <span>Cash</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(wallet.byMethod.cash)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <span>Gift Card Redemptions</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(wallet.byMethod.giftCard)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💎</span>
                    <span>Membership Credits</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(wallet.byMethod.membershipCredit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <span>Other</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(wallet.byMethod.other)}</span>
                </div>
              </div>
            </div>

            {/* By Processor */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b bg-white">
                <h3 className="font-semibold">By Processor</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-white0">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-black">Processor</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-black">Collected</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-black">Fees</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-black">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-3 font-medium">Square (Card)</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(wallet.byProcessor.square?.collected || 0)}</td>
                    <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(wallet.byProcessor.square?.fees || 0)}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(wallet.byProcessor.square?.net || 0)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium">Cash</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(wallet.byProcessor.cash?.collected || 0)}</td>
                    <td className="px-4 py-3 text-right text-black">$0.00</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(wallet.byProcessor.cash?.net || 0)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium">Gift Card</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(wallet.byProcessor.giftCard?.collected || 0)}</td>
                    <td className="px-4 py-3 text-right text-black">$0.00</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(wallet.byProcessor.giftCard?.net || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Payments Alert */}
          {wallet.pending.count > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">⏳</span>
                <div>
                  <h3 className="font-semibold text-amber-800">Pending Payments</h3>
                  <p className="text-amber-700">
                    You have {wallet.pending.count} pending payment(s) totaling{' '}
                    <strong>{formatCurrency(wallet.pending.payments)}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-blue-800">Understanding the Business Wallet</h3>
                <p className="text-blue-700 text-sm mt-1">
                  The Business Wallet shows <strong>cash movement</strong>, not revenue. 
                  Gift card redemptions reduce wallet balance (liability), not increase revenue. 
                  Refunds reduce the wallet. Tips are tracked separately and can be configured for payout.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-4">
            <Link
              href="/admin/sales/daily-summary"
              className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
            >
              📊 View Daily Summary
            </Link>
            <Link
              href="/admin/sales"
              className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
            >
              📋 View All Sales
            </Link>
            <Link
              href="/admin/sales/payments"
              className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
            >
              💳 View Payments
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
