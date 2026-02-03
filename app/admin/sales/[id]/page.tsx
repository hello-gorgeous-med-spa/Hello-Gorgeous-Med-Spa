'use client';

// ============================================================
// SALE DETAIL PAGE
// Full view of a single sale with items, payments, history
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sale {
  id: string;
  sale_number: string;
  status: string;
  sale_type: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  tip_total: number;
  gross_total: number;
  net_total: number;
  amount_paid: number;
  balance_due: number;
  discount_type: string;
  discount_code: string;
  discount_reason: string;
  tax_rate: number;
  internal_notes: string;
  client_notes: string;
  created_at: string;
  completed_at: string;
  voided_at: string;
  void_reason: string;
  clients?: any;
  providers?: any;
  appointments?: any;
  sale_items?: any[];
  sale_payments?: any[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  unpaid: 'bg-red-100 text-red-700 border-red-200',
  partially_paid: 'bg-orange-100 text-orange-700 border-orange-200',
  refunded: 'bg-purple-100 text-purple-700 border-purple-200',
  voided: 'bg-gray-200 text-gray-500 border-gray-300',
};

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchSale = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/sales/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Sale not found');
        }

        setSale(data.sale);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSale();
    }
  }, [params.id]);

  const handleVoid = async () => {
    if (!sale) return;

    try {
      const res = await fetch(`/api/sales/${sale.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: voidReason }),
      });

      if (res.ok) {
        router.push('/admin/sales');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to void sale');
      }
    } catch {
      alert('Failed to void sale');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💰</div>
          <p className="text-gray-500">Loading sale...</p>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <span className="text-4xl">❌</span>
          <h2 className="text-lg font-semibold text-red-800 mt-2">Sale Not Found</h2>
          <p className="text-red-600 text-sm">{error}</p>
          <Link href="/admin/sales" className="mt-4 inline-block text-pink-600 hover:underline">
            ← Back to Sales
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/sales" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Sales
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Sale {sale.sale_number}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${STATUS_COLORS[sale.status]}`}>
            {sale.status.replace('_', ' ').toUpperCase()}
          </span>
          {sale.status !== 'voided' && sale.status !== 'completed' && (
            <button
              onClick={() => setShowVoidModal(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
            >
              Void Sale
            </button>
          )}
          {sale.balance_due > 0 && (
            <Link
              href={`/pos?sale=${sale.id}`}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
            >
              Collect Payment
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Client</h2>
            {sale.clients?.user_profiles ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                  {sale.clients.user_profiles.first_name?.[0]}{sale.clients.user_profiles.last_name?.[0]}
                </div>
                <div>
                  <p className="font-medium">{sale.clients.user_profiles.first_name} {sale.clients.user_profiles.last_name}</p>
                  <p className="text-sm text-gray-500">{sale.clients.user_profiles.email}</p>
                  <p className="text-sm text-gray-500">{sale.clients.user_profiles.phone}</p>
                </div>
                <Link
                  href={`/admin/clients/${sale.clients.id}`}
                  className="ml-auto text-pink-600 hover:underline text-sm"
                >
                  View Profile →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Walk-in Client</p>
            )}
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold">Items</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Item</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Unit Price</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(sale.sale_items || []).map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-xs text-gray-500">{item.item_type}</p>
                    </td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Payments</h2>
              {sale.balance_due > 0 && (
                <span className="text-sm text-red-600">
                  {formatCurrency(sale.balance_due)} remaining
                </span>
              )}
            </div>
            {(sale.sale_payments || []).length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Payment #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Method</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sale.sale_payments.map((payment: any) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 font-mono text-sm">{payment.payment_number}</td>
                      <td className="px-4 py-4">
                        <span className="capitalize">{payment.payment_method.replace('_', ' ')}</span>
                        {payment.card_last_four && (
                          <span className="text-gray-400 ml-1">•••• {payment.card_last_four}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDateTime(payment.processed_at || payment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {payment.amount < 0 ? (
                          <span className="text-red-600">{formatCurrency(payment.amount)}</span>
                        ) : (
                          formatCurrency(payment.amount)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No payments recorded
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Totals */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              {sale.discount_total > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(sale.discount_total)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(sale.tax_total)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Gross Total</span>
                <span>{formatCurrency(sale.gross_total)}</span>
              </div>
              {sale.tip_total > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Tips</span>
                  <span>{formatCurrency(sale.tip_total)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="text-green-600">{formatCurrency(sale.amount_paid)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Balance Due</span>
                <span className={sale.balance_due > 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatCurrency(sale.balance_due)}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sale ID</span>
                <span className="font-mono">{sale.sale_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="capitalize">{sale.sale_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span>{sale.providers?.user_profiles 
                  ? `${sale.providers.user_profiles.first_name} ${sale.providers.user_profiles.last_name}`
                  : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{formatDateTime(sale.created_at)}</span>
              </div>
              {sale.completed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span>{formatDateTime(sale.completed_at)}</span>
                </div>
              )}
              {sale.voided_at && (
                <div className="flex justify-between text-red-600">
                  <span>Voided</span>
                  <span>{formatDateTime(sale.voided_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {(sale.internal_notes || sale.client_notes) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold mb-4">Notes</h2>
              {sale.internal_notes && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Internal</p>
                  <p className="text-sm">{sale.internal_notes}</p>
                </div>
              )}
              {sale.client_notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client</p>
                  <p className="text-sm">{sale.client_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Void Modal */}
      {showVoidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Void Sale</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to void sale <strong>{sale.sale_number}</strong>?
              This cannot be undone.
            </p>
            <textarea
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="Reason for voiding..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowVoidModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleVoid}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Void Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
