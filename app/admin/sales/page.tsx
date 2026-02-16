'use client';

// ============================================================
// SALES LIST PAGE
// View and manage all sales/invoices
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Sale {
  id: string;
  sale_number: string;
  client_id: string | null;
  status: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  tip_total: number;
  gross_total: number;
  amount_paid: number;
  balance_due: number;
  created_at: string;
  completed_at: string | null;
  sale_items: SaleItem[];
  sale_payments: SalePayment[];
}

interface SaleItem {
  id: string;
  item_name: string;
  quantity: number;
  total_price: number;
}

interface SalePayment {
  id: string;
  payment_method: string;
  amount: number;
  status: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 25;

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (statusFilter) {
        params.set('status', statusFilter);
      }

      const res = await fetch(`/api/pos/invoices?${params.toString()}`);
      const data = await res.json();

      if (data.invoices) {
        setSales(data.invoices);
        setTotal(data.total || 0);
      } else {
        setError('Failed to load sales');
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [statusFilter, offset]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-700';
      case 'voided':
      case 'failed':
      case 'unpaid':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-white text-black';
    }
  };

  // Get payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      case 'gift_card':
        return '🎁';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Sales</h1>
          <p className="text-sm text-black">
            {total} total sale{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setOffset(0);
          }}
          className="px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="refunded">Refunded</option>
          <option value="voided">Voided</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
          </div>
        ) : sales.length === 0 ? (
          <div className="py-12 text-center text-black">
            No sales found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Sale #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {sales.map((sale) => {
                const itemCount = sale.sale_items?.length || 0;
                const firstItem = sale.sale_items?.[0];
                const paymentMethod = sale.sale_payments?.[0]?.payment_method;

                return (
                  <tr key={sale.id} className="hover:bg-white">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/admin/sales/${sale.id}`}
                        className="font-medium text-pink-600 hover:text-pink-700"
                      >
                        {sale.sale_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(sale.created_at).toLocaleDateString()}
                      <span className="block text-xs text-black">
                        {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        {firstItem?.item_name || 'No items'}
                      </div>
                      {itemCount > 1 && (
                        <span className="text-xs text-black">
                          +{itemCount - 1} more
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paymentMethod ? (
                        <span className="text-lg" title={paymentMethod}>
                          {getPaymentIcon(paymentMethod)}
                        </span>
                      ) : (
                        <span className="text-black">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-semibold text-black">
                        ${(sale.gross_total / 100).toFixed(2)}
                      </span>
                      {sale.balance_due > 0 && (
                        <span className="block text-xs text-red-500">
                          ${(sale.balance_due / 100).toFixed(2)} due
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/sales/${sale.id}`}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-black">
            Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-4 py-2 border border-black rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              className="px-4 py-2 border border-black rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
