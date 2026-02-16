'use client';

// ============================================================
// DAILY SALES SUMMARY - FRESHA-LEVEL
// Transaction summary + Cash movement for any date
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Summary {
  date: string;
  formattedDate: string;
  totalSales: number;
  completedSales: number;
  voidedSales: number;
  refundedSales: number;
  unpaidSales: number;
  transactionSummary: {
    services: { count: number; gross: number };
    products: { count: number; gross: number };
    memberships: { count: number; gross: number };
    giftCards: { count: number; gross: number };
    fees: { count: number; gross: number };
    refunds: { count: number; gross: number };
  };
  financials: {
    grossSales: number;
    discounts: number;
    taxCollected: number;
    tips: number;
    refunds: number;
    netSales: number;
  };
  paymentSummary: {
    card: { count: number; amount: number };
    cash: { count: number; amount: number };
    giftCard: { count: number; amount: number };
    membershipCredit: { count: number; amount: number };
    other: { count: number; amount: number };
  };
  processingFees: number;
  totalCollected: number;
  totalPayable: number;
  outstanding: number;
}

export default function DailySummaryPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/sales/daily-summary?date=${selectedDate}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch summary');
        }

        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/sales" className="text-sm text-black hover:text-black">
            ← Back to Sales
          </Link>
          <h1 className="text-2xl font-bold text-black mt-1">Daily Sales Summary</h1>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateDate('prev')}
          className="px-4 py-2 hover:bg-white rounded-lg"
        >
          ← Previous Day
        </button>
        
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          {isToday && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => navigateDate('next')}
          disabled={isToday}
          className="px-4 py-2 hover:bg-white rounded-lg disabled:opacity-50"
        >
          Next Day →
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-black">Loading summary...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : summary ? (
        <div className="space-y-6">
          {/* Date Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold">{summary.formattedDate}</h2>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div>
                <p className="text-pink-100 text-sm">Total Sales</p>
                <p className="text-3xl font-bold">{summary.totalSales}</p>
              </div>
              <div>
                <p className="text-pink-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">{summary.completedSales}</p>
              </div>
              <div>
                <p className="text-pink-100 text-sm">Gross Sales</p>
                <p className="text-3xl font-bold">{formatCurrency(summary.financials.grossSales)}</p>
              </div>
              <div>
                <p className="text-pink-100 text-sm">Net Collected</p>
                <p className="text-3xl font-bold">{formatCurrency(summary.totalCollected)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Transaction Summary */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b bg-white">
                <h3 className="font-semibold">Transaction Summary</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-black">Category</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-black">Qty</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-black">Gross</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-3">Services</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.services.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.transactionSummary.services.gross)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Products</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.products.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.transactionSummary.products.gross)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Memberships</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.memberships.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.transactionSummary.memberships.gross)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Gift Cards Sold</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.giftCards.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.transactionSummary.giftCards.gross)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Fees</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.fees.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.transactionSummary.fees.gross)}</td>
                  </tr>
                  <tr className="text-red-600">
                    <td className="px-6 py-3">Refunds</td>
                    <td className="px-4 py-3 text-center">{summary.transactionSummary.refunds.count}</td>
                    <td className="px-6 py-3 text-right font-medium">-{formatCurrency(summary.transactionSummary.refunds.gross)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-white font-semibold">
                  <tr>
                    <td className="px-6 py-3">Net Sales</td>
                    <td className="px-4 py-3 text-center"></td>
                    <td className="px-6 py-3 text-right">{formatCurrency(summary.financials.netSales)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Cash Movement Summary */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b bg-white">
                <h3 className="font-semibold">Cash Movement</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-black">Payment Method</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-black">Count</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-black">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-3">💳 Card Payments</td>
                    <td className="px-4 py-3 text-center">{summary.paymentSummary.card.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.paymentSummary.card.amount)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">💵 Cash</td>
                    <td className="px-4 py-3 text-center">{summary.paymentSummary.cash.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.paymentSummary.cash.amount)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">🎁 Gift Card Redemptions</td>
                    <td className="px-4 py-3 text-center">{summary.paymentSummary.giftCard.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.paymentSummary.giftCard.amount)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">💎 Membership Credits</td>
                    <td className="px-4 py-3 text-center">{summary.paymentSummary.membershipCredit.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.paymentSummary.membershipCredit.amount)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Other</td>
                    <td className="px-4 py-3 text-center">{summary.paymentSummary.other.count}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(summary.paymentSummary.other.amount)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-white font-semibold">
                  <tr>
                    <td className="px-6 py-3">Total Collected</td>
                    <td className="px-4 py-3 text-center"></td>
                    <td className="px-6 py-3 text-right text-green-600">{formatCurrency(summary.totalCollected)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Financial Summary</h3>
            <div className="grid grid-cols-6 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-black">Gross Sales</p>
                <p className="text-xl font-bold">{formatCurrency(summary.financials.grossSales)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Discounts</p>
                <p className="text-xl font-bold text-green-600">-{formatCurrency(summary.financials.discounts)}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-black">Tax Collected</p>
                <p className="text-xl font-bold">{formatCurrency(summary.financials.taxCollected)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Tips</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.financials.tips)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Refunds</p>
                <p className="text-xl font-bold text-red-600">-{formatCurrency(summary.financials.refunds)}</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-pink-600">Net Sales</p>
                <p className="text-xl font-bold text-pink-600">{formatCurrency(summary.financials.netSales)}</p>
              </div>
            </div>
          </div>

          {/* Outstanding & Processing */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-amber-700 text-sm font-medium">Outstanding Balance</p>
              <p className="text-3xl font-bold text-amber-700">{formatCurrency(summary.outstanding)}</p>
              <p className="text-xs text-amber-600 mt-2">{summary.unpaidSales} unpaid sales</p>
            </div>
            <div className="bg-white border rounded-xl p-6">
              <p className="text-black text-sm font-medium">Processing Fees</p>
              <p className="text-3xl font-bold text-black">{formatCurrency(summary.processingFees)}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-700 text-sm font-medium">Net Payable</p>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(summary.totalPayable)}</p>
              <p className="text-xs text-green-600 mt-2">After fees</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
