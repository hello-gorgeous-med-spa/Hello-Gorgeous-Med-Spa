'use client';

// ============================================================
// INVOICE DETAIL PAGE
// View sale details, payment info, and process refunds
// ============================================================

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Sale {
  id: string;
  sale_number: string;
  client_id: string | null;
  appointment_id: string | null;
  provider_id: string | null;
  status: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  tip_total: number;
  gross_total: number;
  net_total: number;
  amount_paid: number;
  balance_due: number;
  created_at: string;
  completed_at: string | null;
  sale_items: SaleItem[];
  sale_payments: SalePayment[];
}

interface SaleItem {
  id: string;
  item_type: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
}

interface SalePayment {
  id: string;
  payment_number: string;
  payment_method: string;
  payment_processor: string | null;
  amount: number;
  tip_amount: number;
  processing_fee: number;
  net_amount: number;
  status: string;
  square_payment_id: string | null;
  square_order_id: string | null;
  square_terminal_checkout_id: string | null;
  terminal_status: string | null;
  card_brand: string | null;
  card_last_four: string | null;
  processor_receipt_url: string | null;
  refund_amount: number;
  created_at: string;
  processed_at: string | null;
}

interface Refund {
  id: string;
  square_refund_id: string | null;
  amount: number;
  reason: string;
  refund_type: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [sale, setSale] = useState<Sale | null>(null);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refund modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);

  // Fetch sale data
  const fetchSale = async () => {
    try {
      const res = await fetch(`/api/pos/invoices?id=${id}`);
      const data = await res.json();
      
      if (res.status === 404) {
        setError('Sale not found');
        return;
      }
      
      if (data.invoice) {
        setSale(data.invoice);
      } else {
        setError('Failed to load sale');
      }
    } catch (err) {
      console.error('Error fetching sale:', err);
      setError('Failed to load sale details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch refunds
  const fetchRefunds = async () => {
    try {
      const res = await fetch(`/api/pos/invoices/${id}/square/refund`);
      const data = await res.json();
      
      if (data.refunds) {
        setRefunds(data.refunds);
      }
    } catch (err) {
      console.error('Error fetching refunds:', err);
    }
  };

  useEffect(() => {
    fetchSale();
    fetchRefunds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Process refund
  const handleRefund = async () => {
    setProcessingRefund(true);
    setRefundError(null);
    setRefundSuccess(null);
    
    if (!refundReason.trim() || refundReason.trim().length < 3) {
      setRefundError('Please enter a reason for the refund (at least 3 characters)');
      setProcessingRefund(false);
      return;
    }
    
    try {
      const body: { reason: string; amount?: number } = {
        reason: refundReason.trim(),
      };
      
      if (refundType === 'partial' && refundAmount) {
        body.amount = Math.round(parseFloat(refundAmount) * 100); // Convert to cents
      }
      
      const res = await fetch(`/api/pos/invoices/${id}/square/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setRefundSuccess(`Refund of $${(data.refund.amount / 100).toFixed(2)} processed successfully`);
        setShowRefundModal(false);
        setRefundReason('');
        setRefundAmount('');
        
        // Refresh data
        fetchSale();
        fetchRefunds();
      } else {
        setRefundError(data.error || 'Failed to process refund');
      }
    } catch (err) {
      setRefundError('Failed to process refund');
      console.error(err);
    } finally {
      setProcessingRefund(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'refunded':
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-700';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-700';
      case 'voided':
      case 'failed':
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-white text-black';
    }
  };

  // Calculate refundable amount
  const getRefundableAmount = () => {
    if (!sale) return 0;
    const completedPayments = sale.sale_payments?.filter(p => p.status === 'completed') || [];
    const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = completedPayments.reduce((sum, p) => sum + (p.refund_amount || 0), 0);
    return (totalPaid - totalRefunded) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Sale not found'}</p>
          <Link 
            href="/admin/sales"
            className="mt-4 inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Back to Sales
          </Link>
        </div>
      </div>
    );
  }

  const refundableAmount = getRefundableAmount();
  const hasSquarePayment = sale.sale_payments?.some(p => 
    p.payment_processor === 'square' && p.status === 'completed' && p.square_payment_id
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/sales" className="hover:text-[#FF2D8E]">Sales</Link>
            <span>/</span>
            <span>{sale.sale_number}</span>
          </div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            {sale.sale_number}
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(sale.status)}`}>
              {sale.status}
            </span>
          </h1>
        </div>
        
        {refundSuccess && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            {refundSuccess}
          </span>
        )}
      </div>

      {/* Sale Info */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Sale Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-black">Created</p>
            <p className="font-medium text-black">
              {new Date(sale.created_at).toLocaleString()}
            </p>
          </div>
          {sale.completed_at && (
            <div>
              <p className="text-sm text-black">Completed</p>
              <p className="font-medium text-black">
                {new Date(sale.completed_at).toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-black">Subtotal</p>
            <p className="font-medium text-black">${(sale.subtotal / 100).toFixed(2)}</p>
          </div>
          {sale.discount_total > 0 && (
            <div>
              <p className="text-sm text-black">Discount</p>
              <p className="font-medium text-green-600">-${(sale.discount_total / 100).toFixed(2)}</p>
            </div>
          )}
          {sale.tip_total > 0 && (
            <div>
              <p className="text-sm text-black">Tip</p>
              <p className="font-medium text-black">${(sale.tip_total / 100).toFixed(2)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-black">Total</p>
            <p className="font-bold text-lg text-black">${(sale.gross_total / 100).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-black">Paid</p>
            <p className="font-medium text-black">${(sale.amount_paid / 100).toFixed(2)}</p>
          </div>
          {sale.balance_due > 0 && (
            <div>
              <p className="text-sm text-black">Balance Due</p>
              <p className="font-medium text-red-600">${(sale.balance_due / 100).toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Line Items */}
        {sale.sale_items && sale.sale_items.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-black mb-2">Items</h3>
            <div className="border border-black rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="text-left px-4 py-2 text-black">Item</th>
                    <th className="text-center px-4 py-2 text-black">Qty</th>
                    <th className="text-right px-4 py-2 text-black">Price</th>
                    <th className="text-right px-4 py-2 text-black">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {sale.sale_items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-black">{item.item_name}</td>
                      <td className="px-4 py-2 text-center text-black">{item.quantity}</td>
                      <td className="px-4 py-2 text-right text-black">${(item.unit_price / 100).toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-black">${(item.total_price / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payments */}
      {sale.sale_payments && sale.sale_payments.length > 0 && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Payments</h2>
          
          <div className="space-y-4">
            {sale.sale_payments.map((payment) => (
              <div 
                key={payment.id}
                className="border border-black rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {payment.payment_method === 'card' ? '💳' : 
                       payment.payment_method === 'cash' ? '💵' : 
                       payment.payment_method === 'gift_card' ? '🎁' : '💳'}
                    </span>
                    <div>
                      <p className="font-medium text-black">
                        {payment.payment_method === 'card' ? 'Card Payment' : 
                         payment.payment_method === 'cash' ? 'Cash Payment' : 
                         payment.payment_method === 'gift_card' ? 'Gift Card' : payment.payment_method}
                        {payment.card_brand && payment.card_last_four && (
                          <span className="text-black ml-2">
                            {payment.card_brand} ****{payment.card_last_four}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-black">{payment.payment_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">${(payment.amount / 100).toFixed(2)}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {payment.tip_amount > 0 && (
                    <div>
                      <span className="text-black">Tip: </span>
                      <span className="text-black">${(payment.tip_amount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {payment.processing_fee > 0 && (
                    <div>
                      <span className="text-black">Fee: </span>
                      <span className="text-black">${(payment.processing_fee / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {payment.refund_amount > 0 && (
                    <div>
                      <span className="text-black">Refunded: </span>
                      <span className="text-purple-600">${(payment.refund_amount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {payment.processed_at && (
                    <div>
                      <span className="text-black">Processed: </span>
                      <span className="text-black">{new Date(payment.processed_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Square IDs */}
                {(payment.square_payment_id || payment.square_order_id) && (
                  <div className="mt-3 pt-3 border-t border-black text-xs font-mono text-black">
                    {payment.square_payment_id && (
                      <p>Payment ID: {payment.square_payment_id}</p>
                    )}
                    {payment.square_order_id && (
                      <p>Order ID: {payment.square_order_id}</p>
                    )}
                    {payment.square_terminal_checkout_id && (
                      <p>Checkout ID: {payment.square_terminal_checkout_id}</p>
                    )}
                  </div>
                )}

                {/* Receipt Link */}
                {payment.processor_receipt_url && (
                  <a
                    href={payment.processor_receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-pink-600 hover:text-pink-700"
                  >
                    View Receipt →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refunds */}
      {refunds.length > 0 && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Refunds</h2>
          
          <div className="space-y-3">
            {refunds.map((refund) => (
              <div 
                key={refund.id}
                className="flex items-center justify-between p-4 border border-black rounded-lg"
              >
                <div>
                  <p className="font-medium text-black">
                    {refund.refund_type === 'full' ? 'Full Refund' : 'Partial Refund'}
                  </p>
                  <p className="text-sm text-black">{refund.reason}</p>
                  <p className="text-xs text-black mt-1">
                    {new Date(refund.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">-${(refund.amount / 100).toFixed(2)}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(refund.status)}`}>
                    {refund.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {hasSquarePayment && refundableAmount > 0 && (
        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="font-semibold text-black mb-4">Actions</h2>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setRefundType('full');
                setShowRefundModal(true);
              }}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium"
            >
              Full Refund (${refundableAmount.toFixed(2)})
            </button>
            <button
              onClick={() => {
                setRefundType('partial');
                setShowRefundModal(true);
              }}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white font-medium"
            >
              Partial Refund
            </button>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-white"
            onClick={() => setShowRefundModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              {refundType === 'full' ? 'Full Refund' : 'Partial Refund'}
            </h2>
            
            {refundType === 'partial' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                  Refund Amount (max ${refundableAmount.toFixed(2)})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">$</span>
                  <input
                    type="number"
                    step="0.01"
                    max={refundableAmount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Reason for Refund *
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Customer requested refund..."
                rows={3}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            {refundError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {refundError}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={processingRefund}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 font-medium"
              >
                {processingRefund ? 'Processing...' : 'Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
