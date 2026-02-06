'use client';

// ============================================================
// POS TERMINAL - MAIN PAGE
// Quick checkout and appointment-based transactions
// With Square Terminal Integration
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Terminal Status Modal (client-side only)
const TerminalStatusModal = dynamic(() => import('@/components/TerminalStatusModal'), {
  ssr: false,
});

export default function POSTerminalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'checkout' | 'scheduled' | 'walkin'>('checkout');
  const [walkInMode, setWalkInMode] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  // State for API data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [apptsLoading, setApptsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  // Fetch today's appointments from API
  const fetchTodaysAppointments = useCallback(async () => {
    try {
      setApptsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/appointments?date=${today}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setApptsLoading(false);
    }
  }, []);

  // Fetch recent payments from transactions API
  const fetchRecentPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/transactions?startDate=${today}&limit=10`);
      const data = await res.json();
      if (data.transactions) {
        setPayments(data.transactions.map((t: any) => ({
          id: t.id,
          created_at: t.created_at,
          client_name: t.client ? `${t.client.first_name} ${t.client.last_name}` : 'Client',
          total_amount: t.total_amount,
          payment_method: t.payment_method,
        })));
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  // Fetch services for walk-in sales
  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services?active=true');
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, []);

  useEffect(() => {
    fetchTodaysAppointments();
    fetchRecentPayments();
    fetchServices();
  }, [fetchTodaysAppointments, fetchRecentPayments, fetchServices]);

  // Transform appointments for POS display
  const todaysAppointments = useMemo(() => {
    return appointments.map(apt => ({
      id: apt.id,
      time: new Date(apt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      client: apt.client_name || 'Walk-in',
      clientId: apt.client_id || '',
      email: apt.client_email || '',
      service: apt.service_name || 'Service',
      provider: apt.provider_name || 'Provider',
      status: apt.status,
      amount: apt.service_price || 0,
    }));
  }, [appointments]);

  // Transform recent payments for display
  const recentTransactions = useMemo(() => {
    const fromDB = payments.map((p: any) => ({
      id: p.id,
      time: new Date(p.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      client: p.client_name || 'Client',
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
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => { setActiveTab('checkout'); setWalkInMode(false); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'checkout' ? 'text-pink-400 border-b-2 border-pink-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ready for Checkout ({readyForCheckout.length})
          </button>
          <button 
            onClick={() => { setActiveTab('scheduled'); setWalkInMode(false); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'scheduled' ? 'text-pink-400 border-b-2 border-pink-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scheduled ({scheduled.length})
          </button>
          <button 
            onClick={() => { setActiveTab('walkin'); setWalkInMode(true); setSelectedAppointmentId(null); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'walkin' ? 'text-green-400 border-b-2 border-green-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛒 Walk-in Sale
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {apptsLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          ) : activeTab === 'walkin' ? (
            /* Walk-in Sale - Service Selection */
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-2xl mb-2">🛒</p>
                <p className="text-white font-medium">Walk-in Sale</p>
                <p className="text-slate-400 text-sm">Select services to add to cart</p>
              </div>
              
              {/* Service Categories */}
              <div className="grid grid-cols-2 gap-3">
                {services.length === 0 ? (
                  <p className="col-span-2 text-center text-slate-400 py-8">No services found</p>
                ) : (
                  services.slice(0, 12).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        // Create a walk-in "appointment" object
                        const servicePrice = service.price_cents ? service.price_cents / 100 : (service.price || 0);
                        const walkInApt = {
                          id: `walkin-${Date.now()}`,
                          time: 'Walk-in',
                          client: 'Walk-in Customer',
                          clientId: '',
                          email: '',
                          service: service.name,
                          provider: 'Staff',
                          status: 'walkin',
                          amount: servicePrice,
                        };
                        setSelectedAppointmentId(walkInApt.id);
                        // Store in appointments temporarily
                        setAppointments(prev => [...prev, { 
                          ...walkInApt, 
                          starts_at: new Date().toISOString(),
                          service_name: service.name,
                          service_price: servicePrice,
                          client_name: 'Walk-in Customer',
                        }]);
                      }}
                      className="p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-green-500 hover:bg-slate-700 transition-all text-left"
                    >
                      <p className="text-white font-medium text-sm">{service.name}</p>
                      <p className="text-green-400 font-bold mt-1">
                        {service.price_display || (service.price_cents 
                          ? `$${(service.price_cents / 100).toLocaleString()}` 
                          : service.price 
                            ? `$${service.price.toLocaleString()}`
                            : 'Free')}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">{service.duration_minutes || 30} min</p>
                    </button>
                  ))
                )}
              </div>

              {services.length > 12 && (
                <Link href="/pos/quick-sale" className="block text-center text-pink-400 hover:text-pink-300 py-2">
                  View all {services.length} services →
                </Link>
              )}
            </div>
          ) : activeTab === 'scheduled' ? (
            /* Scheduled Appointments */
            scheduled.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">📅</p>
                <p>No scheduled appointments</p>
              </div>
            ) : (
              scheduled.map((apt) => (
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
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                          Scheduled
                        </span>
                      </div>
                      <p className="font-semibold text-white text-lg">{apt.client}</p>
                      <p className="text-slate-400">{apt.service}</p>
                      <p className="text-sm text-slate-500">Provider: {apt.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-400">${apt.amount}</p>
                    </div>
                  </div>
                </button>
              ))
            )
          ) : (
            /* Ready for Checkout (default) */
            readyForCheckout.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">✓</p>
                <p>All caught up! No appointments ready for checkout.</p>
                <button 
                  onClick={() => setActiveTab('walkin')}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Start Walk-in Sale
                </button>
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
            )
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

// Checkout Panel Component with Square Terminal Integration
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
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'terminal' | 'cash' | 'giftcard' | null>(null);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardError, setGiftCardError] = useState('');
  const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null);
  const [applyingGiftCard, setApplyingGiftCard] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [finalTip, setFinalTip] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Terminal checkout state
  const [saleId, setSaleId] = useState<string | null>(null);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [startingTerminal, setStartingTerminal] = useState(false);

  const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discountType === 'percent' ? subtotal * (discount / 100) : discount;
  const total = subtotal - discountAmount; // Tip will be added on terminal

  // Start terminal checkout
  const handleTerminalCheckout = async () => {
    setStartingTerminal(true);
    setTerminalError(null);
    
    try {
      // First, create an invoice/sale
      const invoiceRes = await fetch('/api/pos/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: appointment.clientId || null,
          appointment_id: appointment.id.startsWith('walkin-') ? null : appointment.id,
          items: lineItems.map(item => ({
            type: 'service',
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          discount_amount: discountAmount,
          discount_type: discountType,
          notes: `POS checkout for ${appointment.service}`,
        }),
      });
      
      const invoiceData = await invoiceRes.json();
      
      if (!invoiceRes.ok) {
        throw new Error(invoiceData.error || 'Failed to create invoice');
      }
      
      const newSaleId = invoiceData.sale_id;
      setSaleId(newSaleId);
      
      // Start terminal charge
      const terminalRes = await fetch(`/api/pos/invoices/${newSaleId}/square/start-terminal-charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tip_settings: {
            allowTipping: true,
            separateTipScreen: true,
            customTipField: true,
            tipPercentages: [15, 20, 25],
          },
        }),
      });
      
      const terminalData = await terminalRes.json();
      
      if (!terminalRes.ok) {
        throw new Error(terminalData.error || 'Failed to start terminal checkout');
      }
      
      // Show terminal modal
      setShowTerminalModal(true);
      
    } catch (err: any) {
      console.error('Terminal checkout error:', err);
      setTerminalError(err.message || 'Failed to start terminal checkout');
    } finally {
      setStartingTerminal(false);
    }
  };

  // Handle terminal completion
  const handleTerminalComplete = (data: {
    paymentId: string;
    tipAmount: number;
    totalAmount: number;
    cardBrand?: string;
    cardLast4?: string;
  }) => {
    setFinalTip(data.tipAmount / 100); // Convert cents to dollars
    setFinalTotal(data.totalAmount / 100);
    setPaymentId(data.paymentId);
    setPaid(true);
    setShowTerminalModal(false);
    onPaymentSuccess(data.paymentId, appointment.client, data.totalAmount / 100);
  };

  // Handle terminal cancel
  const handleTerminalCancel = () => {
    setShowTerminalModal(false);
    setSaleId(null);
  };

  // Handle terminal retry
  const handleTerminalRetry = () => {
    if (saleId) {
      // Restart the terminal charge for the existing sale
      handleTerminalCheckout();
    }
  };

  const handleCashPayment = async () => {
    // Create invoice first
    const invoiceRes = await fetch('/api/pos/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: appointment.clientId || null,
        appointment_id: appointment.id.startsWith('walkin-') ? null : appointment.id,
        items: lineItems.map(item => ({
          type: 'service',
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        discount_amount: discountAmount,
        discount_type: discountType,
      }),
    });
    
    const invoiceData = await invoiceRes.json();
    const cashId = `cash_${Date.now()}`;
    setPaymentId(cashId);
    setFinalTotal(total);
    setPaid(true);
    onPaymentSuccess(cashId, appointment.client, total);
  };

  // Gift card lookup
  const lookupGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setGiftCardError('Please enter a gift card code');
      return;
    }
    setApplyingGiftCard(true);
    setGiftCardError('');
    setGiftCardBalance(null);
    
    try {
      const res = await fetch(`/api/gift-cards?code=${encodeURIComponent(giftCardCode.trim().toUpperCase())}`);
      const data = await res.json();
      
      if (!res.ok || !data.giftCard) {
        setGiftCardError('Gift card not found');
        return;
      }
      
      const gc = data.giftCard;
      if (gc.status !== 'active') {
        setGiftCardError(`Gift card is ${gc.status}`);
        return;
      }
      
      if (!gc.current_balance || gc.current_balance <= 0) {
        setGiftCardError('Gift card has no balance remaining');
        return;
      }
      
      setGiftCardBalance(gc.current_balance);
    } catch (err) {
      setGiftCardError('Failed to lookup gift card');
      console.error(err);
    } finally {
      setApplyingGiftCard(false);
    }
  };

  // Gift card payment
  const handleGiftCardPayment = async () => {
    if (!giftCardBalance || giftCardBalance <= 0) return;
    
    setApplyingGiftCard(true);
    try {
      const res = await fetch('/api/gift-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: giftCardCode.trim().toUpperCase(),
          action: 'redeem',
          amount: Math.min(total, giftCardBalance),
          transaction_reference: `POS-${Date.now()}`,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setGiftCardError(data.error || 'Failed to redeem gift card');
        return;
      }
      
      const gcId = `gc_${Date.now()}`;
      setPaymentId(gcId);
      setFinalTotal(total);
      setPaid(true);
      onPaymentSuccess(gcId, appointment.client, total);
    } catch (err) {
      setGiftCardError('Failed to process gift card payment');
      console.error(err);
    } finally {
      setApplyingGiftCard(false);
    }
  };

  // Paid state
  if (paid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Complete!</h2>
        <p className="text-slate-400 mb-1">${(finalTotal || total).toFixed(2)} paid</p>
        {finalTip > 0 && (
          <p className="text-green-400 text-sm mb-2">Includes ${finalTip.toFixed(2)} tip</p>
        )}
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

  // Cash payment view
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
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gift card payment view
  if (showPayment && paymentMethod === 'giftcard') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button onClick={() => { setShowPayment(false); setPaymentMethod(null); setGiftCardCode(''); setGiftCardBalance(null); setGiftCardError(''); }} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h2 className="font-semibold text-white">Gift Card Payment</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <p className="text-slate-400 mb-2">Amount Due</p>
          <p className="text-5xl font-bold text-white mb-8">${total.toFixed(2)}</p>
          
          <div className="w-full max-w-xs space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Gift Card Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="HGXX-XXXX-XXXX"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg tracking-wider uppercase"
                />
                <button
                  onClick={lookupGiftCard}
                  disabled={applyingGiftCard}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                >
                  {applyingGiftCard ? '...' : 'Lookup'}
                </button>
              </div>
            </div>

            {giftCardError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                {giftCardError}
              </div>
            )}

            {giftCardBalance !== null && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <p className="text-green-400 text-sm text-center mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-green-400 text-center">${giftCardBalance.toFixed(2)}</p>
              </div>
            )}

            <button
              onClick={handleGiftCardPayment}
              disabled={giftCardBalance === null || giftCardBalance <= 0 || applyingGiftCard}
              className="w-full py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applyingGiftCard ? 'Processing...' : giftCardBalance !== null 
                ? `Apply $${Math.min(total, giftCardBalance).toFixed(2)}`
                : 'Enter Gift Card Code'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment method selection
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

        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
          <p className="text-slate-400 mb-2">Total Due</p>
          <p className="text-5xl font-bold text-white mb-2">${total.toFixed(2)}</p>
          <p className="text-slate-500 text-sm mb-6">Tip will be added on terminal</p>

          {/* Financing Options - show for purchases $200+ */}
          {total >= 200 && (
            <div className="w-full max-w-xs mb-6 p-4 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl border border-pink-700/30">
              <p className="text-sm text-pink-300 mb-3 text-center">
                💰 Need financing? As low as ${Math.round(total / 24)}/mo
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open('https://www.withcherry.com/', '_blank')}
                  className="flex-1 py-2.5 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm rounded-lg border border-red-500/30 font-medium transition-colors"
                >
                  🍒 Cherry
                </button>
                <button
                  onClick={() => window.open('https://www.carecredit.com/', '_blank')}
                  className="flex-1 py-2.5 px-3 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 text-sm rounded-lg border border-teal-500/30 font-medium transition-colors"
                >
                  💳 CareCredit
                </button>
                <button
                  onClick={() => window.open('https://www.patientfi.com/', '_blank')}
                  className="flex-1 py-2.5 px-3 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-sm rounded-lg border border-purple-500/30 font-medium transition-colors"
                >
                  ✨ PatientFi
                </button>
              </div>
            </div>
          )}

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handleTerminalCheckout}
              disabled={startingTerminal}
              className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {startingTerminal ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Starting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Charge on Terminal
                </>
              )}
            </button>
            <button
              onClick={() => setPaymentMethod('giftcard')}
              className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
            >
              🎁 Gift Card
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              💵 Cash
            </button>
          </div>

          {terminalError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center max-w-xs">
              {terminalError}
            </div>
          )}

          <p className="text-slate-500 text-sm mt-6">
            Card payments processed securely by Square Terminal
          </p>
        </div>
      </div>
    );
  }

  // Main checkout view
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

        {/* Tip Note */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            Tip will be added at the terminal during payment
          </p>
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
          Charge ${total.toFixed(2)}
        </button>
      </div>

      {/* Terminal Status Modal */}
      {showTerminalModal && saleId && (
        <TerminalStatusModal
          isOpen={showTerminalModal}
          saleId={saleId}
          amount={Math.round(total * 100)} // Convert to cents
          onComplete={handleTerminalComplete}
          onCancel={handleTerminalCancel}
          onRetry={handleTerminalRetry}
          onClose={() => {
            setShowTerminalModal(false);
            if (paid) {
              onClose();
            }
          }}
        />
      )}
    </div>
  );
}
