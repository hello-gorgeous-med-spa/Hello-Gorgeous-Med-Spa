'use client';

// ============================================================
// POS TERMINAL - MAIN PAGE
// Quick checkout and appointment-based transactions
// With Stripe Integration - Connected to Live Data
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTodaysAppointments, useRecentPayments } from '@/lib/supabase/hooks';
import { isSupabaseConfigured } from '@/lib/supabase/client';

// Dynamically import Stripe component (client-side only)
const StripeCheckout = dynamic(() => import('@/components/StripeCheckout'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function POSTerminalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  // Fetch today's appointments from Supabase
  const { appointments, loading: apptsLoading } = useTodaysAppointments();
  const { payments, loading: paymentsLoading } = useRecentPayments(5);

  // Transform appointments for POS display
  const todaysAppointments = useMemo(() => {
    return appointments.map(apt => ({
      id: apt.id,
      time: new Date(apt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      client: `${apt.client?.first_name || ''} ${apt.client?.last_name || ''}`.trim() || 'Walk-in',
      clientId: apt.client?.id || '',
      email: apt.client?.email || '',
      service: apt.service?.name || 'Service',
      provider: `${apt.provider?.first_name || ''} ${apt.provider?.last_name || ''}`.trim() || 'Provider',
      status: apt.status,
      amount: apt.service?.price || 0,
    }));
  }, [appointments]);

  // Transform recent payments for display
  const recentTransactions = useMemo(() => {
    const fromDB = payments.map((p: any) => ({
      id: p.id,
      time: new Date(p.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      client: `${p.client?.first_name || ''} ${p.client?.last_name || ''}`.trim() || 'Client',
      amount: p.total_amount || 0,
      method: p.payment_method || 'Card',
    }));
    return [...localTransactions, ...fromDB].slice(0, 5);
  }, [payments, localTransactions]);

  const filteredAppointments = useMemo(() => {
    if (!searchQuery) return todaysAppointments;
    const query = searchQuery.toLowerCase();
    return todaysAppointments.filter(
      (apt) =>
        apt.client.toLowerCase().includes(query) ||
        apt.service.toLowerCase().includes(query)
    );
  }, [todaysAppointments, searchQuery]);

  const readyForCheckout = filteredAppointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'checked_in' || apt.status === 'in_progress'
  );

  const scheduled = filteredAppointments.filter((apt) => apt.status === 'confirmed' || apt.status === 'pending');

  const selectedAppointment = todaysAppointments.find(a => a.id === selectedAppointmentId);

  const handlePaymentSuccess = (paymentIntentId: string, clientName: string, amount: number) => {
    // Add to local transactions immediately
    setLocalTransactions(prev => [{
      id: paymentIntentId,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      client: clientName,
      amount: amount,
      method: 'Card ••••',
    }, ...prev]);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Appointments & Quick Actions */}
      <div className="w-2/3 border-r border-slate-700 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search client or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          {!isSupabaseConfigured() && (
            <p className="text-xs text-amber-400 mt-2">Demo Mode - Connect Supabase for live data</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button className="flex-1 px-4 py-3 text-sm font-medium text-pink-400 border-b-2 border-pink-500">
            Ready for Checkout ({readyForCheckout.length})
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white">
            Scheduled ({scheduled.length})
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white">
            Walk-in Sale
          </button>
        </div>

        {/* Appointment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {apptsLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading appointments...</p>
            </div>
          ) : readyForCheckout.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-4">✓</p>
              <p>All caught up! No appointments ready for checkout.</p>
            </div>
          ) : (
            readyForCheckout.map((apt) => (
              <button
                key={apt.id}
                onClick={() => setSelectedAppointmentId(apt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAppointmentId === apt.id
                    ? 'bg-pink-500/20 border-pink-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-400">{apt.time}</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          apt.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : apt.status === 'in_progress'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {apt.status === 'completed' ? '✓ Done' : apt.status === 'in_progress' ? 'In Progress' : 'Checked In'}
                      </span>
                    </div>
                    <p className="font-semibold text-white text-lg">{apt.client}</p>
                    <p className="text-slate-400">{apt.service}</p>
                    <p className="text-sm text-slate-500">Provider: {apt.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">${apt.amount}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-700">
          <div className="grid grid-cols-4 gap-3">
            <Link
              href="/pos/quick-sale"
              className="p-4 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors"
            >
              <span className="text-2xl block mb-1">🛒</span>
              <span className="text-sm text-slate-300">Quick Sale</span>
            </Link>
            <Link
              href="/pos/products"
              className="p-4 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors"
            >
              <span className="text-2xl block mb-1">📦</span>
              <span className="text-sm text-slate-300">Products</span>
            </Link>
            <Link
              href="/pos/packages"
              className="p-4 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors"
            >
              <span className="text-2xl block mb-1">🎁</span>
              <span className="text-sm text-slate-300">Packages</span>
            </Link>
            <Link
              href="/pos/gift-card"
              className="p-4 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors"
            >
              <span className="text-2xl block mb-1">💳</span>
              <span className="text-sm text-slate-300">Gift Card</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Cart / Checkout */}
      <div className="w-1/3 flex flex-col bg-slate-800">
        {selectedAppointment ? (
          <CheckoutPanel
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointmentId(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Empty State */}
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-6xl mb-4">👈</p>
                <p className="text-xl font-medium text-slate-300">Select an appointment</p>
                <p className="text-slate-500 mt-2">Or start a walk-in sale</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="border-t border-slate-700 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Transactions</h3>
              {paymentsLoading ? (
                <div className="text-center text-slate-500 py-4">Loading...</div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center text-slate-500 py-4">No recent transactions</div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-white">{txn.client}</p>
                        <p className="text-slate-500">{txn.time} • {txn.method}</p>
                      </div>
                      <p className="text-green-400 font-medium">${txn.amount}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Checkout Panel Component
function CheckoutPanel({
  appointment,
  onClose,
  onPaymentSuccess,
}: {
  appointment: {
    id: string;
    time: string;
    client: string;
    clientId: string;
    email: string;
    service: string;
    provider: string;
    amount: number;
  };
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string, clientName: string, amount: number) => void;
}) {
  const [lineItems, setLineItems] = useState([
    { id: '1', name: appointment.service, quantity: 1, price: appointment.amount },
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [tip, setTip] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash' | null>(null);
  const [paid, setPaid] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discountType === 'percent' ? subtotal * (discount / 100) : discount;
  const total = subtotal - discountAmount + tip;

  const handleStripeSuccess = (paymentIntentId: string) => {
    setPaymentId(paymentIntentId);
    setPaid(true);
    onPaymentSuccess(paymentIntentId, appointment.client, total);
  };

  const handleCashPayment = () => {
    const cashId = `cash_${Date.now()}`;
    setPaymentId(cashId);
    setPaid(true);
    onPaymentSuccess(cashId, appointment.client, total);
  };

  if (paid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Complete!</h2>
        <p className="text-slate-400 mb-2">${total.toFixed(2)} paid successfully</p>
        <p className="text-slate-500 text-sm mb-6">ID: {paymentId?.slice(0, 20)}...</p>
        <div className="space-y-3 w-full max-w-xs">
          <button className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
            📧 Email Receipt
          </button>
          <button className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
            🖨️ Print Receipt
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (showPayment && paymentMethod === 'stripe') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button onClick={() => { setShowPayment(false); setPaymentMethod(null); }} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h2 className="font-semibold text-white">Card Payment</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-4">
            <StripeCheckout
              amount={subtotal - discountAmount}
              tipAmount={tip}
              clientId={appointment.clientId}
              clientName={appointment.client}
              clientEmail={appointment.email}
              appointmentId={appointment.id}
              services={appointment.service}
              onSuccess={handleStripeSuccess}
              onError={(error) => console.error('Payment error:', error)}
              onCancel={() => { setShowPayment(false); setPaymentMethod(null); }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showPayment && paymentMethod === 'cash') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button onClick={() => { setShowPayment(false); setPaymentMethod(null); }} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h2 className="font-semibold text-white">Cash Payment</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <p className="text-slate-400 mb-2">Amount Due</p>
          <p className="text-5xl font-bold text-white mb-8">${total.toFixed(2)}</p>
          
          <div className="w-full max-w-xs space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Cash Received</label>
              <input
                type="number"
                placeholder={total.toFixed(2)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-2xl text-center"
              />
            </div>
            <button
              onClick={handleCashPayment}
              className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold text-lg"
            >
              ✓ Mark as Paid
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button onClick={() => setShowPayment(false)} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h2 className="font-semibold text-white">Select Payment Method</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <p className="text-slate-400 mb-2">Total Due</p>
          <p className="text-5xl font-bold text-white mb-8">${total.toFixed(2)}</p>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center gap-2"
            >
              💳 Credit/Debit Card
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              💵 Cash
            </button>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            🔒 Card payments processed securely by Stripe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{appointment.time}</p>
            <h2 className="font-semibold text-white text-lg">{appointment.client}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">
            ×
          </button>
        </div>
      </div>

      {/* Line Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {lineItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Add Item Button */}
        <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-slate-500 hover:text-slate-300">
          + Add Item
        </button>

        {/* Discount */}
        <div className="mt-6">
          <label className="text-sm text-slate-400 block mb-2">Discount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="percent">%</option>
              <option value="fixed">$</option>
            </select>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4">
          <label className="text-sm text-slate-400 block mb-2">Tip</label>
          <div className="flex gap-2">
            {[0, 15, 20, 25].map((pct) => (
              <button
                key={pct}
                onClick={() => setTip(pct === 0 ? 0 : subtotal * (pct / 100))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tip === (pct === 0 ? 0 : subtotal * (pct / 100))
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {pct === 0 ? 'None' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        {tip > 0 && (
          <div className="flex justify-between text-slate-400">
            <span>Tip</span>
            <span>${tip.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-600">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="p-4">
        <button
          onClick={() => setShowPayment(true)}
          className="w-full py-4 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 transition-colors"
        >
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
