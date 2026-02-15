'use client';

import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/portal/useAuth';

interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod?: string;
  cardBrand?: string;
  lastFour?: string;
  lineItems: Array<{ name: string; price: number; quantity: number }>;
  providerName?: string;
  status: string;
  pdfUrl?: string;
}

export default function ReceiptsPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    if (!user) return;
    fetchReceipts();
  }, [user, selectedYear]);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/receipts?year=${selectedYear}`);
      const data = await res.json();
      setReceipts(data.receipts || []);
    } catch (err) {
      console.error('Failed to fetch receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = receipts.reduce((sum, r) => sum + r.total, 0);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin text-4xl">💗</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Payment History</h1>
          <p className="text-[#111]/70 mt-1">View and download your receipts</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-[#111]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6007E]/50"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70">Total Spent in {selectedYear}</p>
            <p className="text-3xl font-bold mt-1">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70">{receipts.length} Transactions</p>
            <button className="mt-2 text-sm text-[#E6007E] hover:underline">
              Download {selectedYear} Summary
            </button>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#111]/10 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#111]/10">
          <span className="text-4xl">🧾</span>
          <p className="mt-4 text-[#111]/70">No receipts found for {selectedYear}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="bg-white rounded-xl border border-[#111]/10 overflow-hidden">
              <button
                onClick={() => setExpandedReceipt(expandedReceipt === receipt.id ? null : receipt.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E6007E]/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🧾</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#111]">Receipt #{receipt.receiptNumber}</p>
                    <p className="text-sm text-[#111]/50">{new Date(receipt.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#111]">${receipt.total.toFixed(2)}</p>
                  {receipt.lastFour && (
                    <p className="text-xs text-[#111]/50">{receipt.cardBrand} •••• {receipt.lastFour}</p>
                  )}
                </div>
              </button>

              {expandedReceipt === receipt.id && (
                <div className="border-t border-[#111]/10 p-4 bg-gray-50">
                  {/* Line Items */}
                  <div className="space-y-2 mb-4">
                    {receipt.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-[#111]/70">{item.name} x{item.quantity}</span>
                        <span className="text-[#111]">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-[#111]/10 pt-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#111]/70">Subtotal</span>
                      <span>${receipt.subtotal.toFixed(2)}</span>
                    </div>
                    {receipt.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${receipt.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#111]/70">Tax</span>
                      <span>${receipt.tax.toFixed(2)}</span>
                    </div>
                    {receipt.tip > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#111]/70">Tip</span>
                        <span>${receipt.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t border-[#111]/10">
                      <span>Total</span>
                      <span>${receipt.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Provider */}
                  {receipt.providerName && (
                    <p className="text-sm text-[#111]/50 mt-4">Provider: {receipt.providerName}</p>
                  )}

                  {/* Download Button */}
                  <button className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
                    ⬇️ Download PDF Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
