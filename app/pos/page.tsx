'use client';

// ============================================================
// BOULEVARD-STYLE POS
// Sales ledger + Checkout panel layout
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TerminalStatusModal = dynamic(() => import('@/components/TerminalStatusModal'), {
  ssr: false,
});

export default function POSPage() {
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Data
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent sales
  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch('/api/sales?limit=20');
      const data = await res.json();
      if (data.sales) {
        setSales(data.sales);
      }
    } catch (err) {
      console.error('Failed to load sales:', err);
    }
  }, []);

  // Fetch services
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

  // Fetch today's appointments
  const fetchTodaysAppointments = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/appointments?date=${today}`);
      const data = await res.json();
      if (data.appointments) {
        // Filter to checked-in or completed only
        const ready = data.appointments.filter((a: any) => 
          ['checked_in', 'in_progress', 'completed'].includes(a.status)
        );
        setAppointments(ready);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchSales(), fetchServices(), fetchTodaysAppointments()])
      .finally(() => setLoading(false));
  }, [fetchSales, fetchServices, fetchTodaysAppointments]);

  // Search clients
  const searchClients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setClients([]);
      return;
    }
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to search clients:', err);
    }
  }, []);

  // Add to cart
  const addToCart = (item: any, type: 'service' | 'product') => {
    const price = item.price_cents ? item.price_cents / 100 : (item.price || 0);
    setCart(prev => [...prev, {
      id: `${type}-${item.id}-${Date.now()}`,
      type,
      item_id: item.id,
      name: item.name,
      price,
      original_price: price,
      quantity: 1,
      discount: 0,
      provider_name: selectedClient?.provider_name || 'Staff',
    }]);
  };

  // Remove from cart
  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  // Apply discount to item
  const applyDiscount = (cartId: string, discountPercent: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartId) {
        const discount = item.original_price * (discountPercent / 100);
        return { ...item, discount, price: item.original_price - discount };
      }
      return item;
    }));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
  const hasDiscount = totalDiscount > 0;

  // Select appointment client
  const selectAppointmentClient = (appt: any) => {
    setSelectedClient({
      id: appt.client_id,
      name: appt.client_name || 'Client',
      email: appt.client_email,
      appointment_id: appt.id,
      provider_name: appt.provider_name,
    });
    
    // Add the service to cart
    const servicePrice = appt.service_price || appt.service?.price || 0;
    setCart([{
      id: `service-${appt.service_id || appt.id}-${Date.now()}`,
      type: 'service',
      item_id: appt.service_id,
      name: appt.service_name || 'Service',
      price: servicePrice,
      original_price: servicePrice,
      quantity: 1,
      discount: 0,
      provider_name: appt.provider_name || 'Provider',
    }]);
    
    setShowCheckout(true);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Panel - Sales Ledger */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700">
              <option>All Locations</option>
              <option>Main Location</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Options
            </button>
          </div>
        </div>

        {/* Ready for Checkout - Today's Appointments */}
        {appointments.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-pink-50/50">
            <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-3">
              Ready for Checkout ({appointments.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {appointments.map((appt) => (
                <button
                  key={appt.id}
                  onClick={() => selectAppointmentClient(appt)}
                  className="flex-shrink-0 p-3 bg-white rounded-xl border border-pink-200 hover:border-pink-400 hover:shadow-md transition-all min-w-[160px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-medium">
                      {appt.client_name?.[0] || 'C'}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800 text-sm truncate max-w-[100px]">
                        {appt.client_name || 'Client'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appt.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{appt.service_name}</p>
                  <p className="text-sm font-bold text-pink-600 mt-1">
                    ${appt.service_price || 0}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No sales yet
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedClient({
                        id: sale.client_id,
                        name: sale.client_name || 'Client',
                        sale_id: sale.id,
                      });
                      setShowCheckout(true);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {sale.client_name || 'Walk-in'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 text-right">
                      ${((sale.gross_total || sale.net_total || 0) / 100).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Middle Panel - Checkout */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        {showCheckout && selectedClient ? (
          <CheckoutPanel
            client={selectedClient}
            cart={cart}
            services={services}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onApplyDiscount={applyDiscount}
            subtotal={subtotal}
            hasDiscount={hasDiscount}
            totalDiscount={totalDiscount}
            onClose={() => {
              setShowCheckout(false);
              setSelectedClient(null);
              setCart([]);
            }}
            onComplete={() => {
              fetchSales();
              setShowCheckout(false);
              setSelectedClient(null);
              setCart([]);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-700 mb-2">Start Checkout</p>
            <p className="text-sm text-gray-500 text-center mb-6">
              Select a client from ready appointments<br />or search for a client
            </p>
            
            {/* Client Search */}
            <div className="w-full max-w-xs relative">
              <input
                type="text"
                placeholder="Search client..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchClients(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {clients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient({
                          id: client.id,
                          name: `${client.first_name} ${client.last_name}`,
                          email: client.email,
                        });
                        setShowCheckout(true);
                        setClients([]);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium">
                        {client.first_name?.[0]}{client.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{client.first_name} {client.last_name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Walk-in Button */}
            <button
              onClick={() => {
                setSelectedClient({ id: null, name: 'Walk-in Customer' });
                setShowCheckout(true);
              }}
              className="mt-4 px-6 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
            >
              + Walk-in Sale
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - Quick Services */}
      <div className="w-1/6 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Add</p>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {services.slice(0, 10).map((service) => (
            <button
              key={service.id}
              onClick={() => {
                if (!showCheckout) {
                  setSelectedClient({ id: null, name: 'Walk-in Customer' });
                  setShowCheckout(true);
                }
                addToCart(service, 'service');
              }}
              className="w-full p-3 text-left bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors border border-transparent hover:border-pink-200"
            >
              <p className="text-sm font-medium text-slate-800 truncate">{service.name}</p>
              <p className="text-sm font-bold text-pink-600">
                ${service.price_cents ? (service.price_cents / 100).toFixed(0) : service.price || 0}
              </p>
            </button>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <Link
            href="/pos/gift-card"
            className="flex items-center gap-2 w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium text-sm transition-colors"
          >
            <span>🎁</span> Sell Gift Card
          </Link>
          <Link
            href="/admin/memberships"
            className="flex items-center gap-2 w-full p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 font-medium text-sm transition-colors"
          >
            <span>⭐</span> Memberships
          </Link>
        </div>
      </div>
    </div>
  );
}

// Checkout Panel Component
function CheckoutPanel({
  client,
  cart,
  services,
  onAddToCart,
  onRemoveFromCart,
  onApplyDiscount,
  subtotal,
  hasDiscount,
  totalDiscount,
  onClose,
  onComplete,
}: {
  client: any;
  cart: any[];
  services: any[];
  onAddToCart: (item: any, type: 'service' | 'product') => void;
  onRemoveFromCart: (id: string) => void;
  onApplyDiscount: (id: string, percent: number) => void;
  subtotal: number;
  hasDiscount: boolean;
  totalDiscount: number;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [showServices, setShowServices] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Start terminal checkout
  const handleTerminalCheckout = async () => {
    setProcessing(true);
    try {
      // Create invoice
      const invoiceRes = await fetch('/api/pos/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id || null,
          appointment_id: client.appointment_id || null,
          items: cart.map(item => ({
            type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.original_price,
            discount_amount: item.discount,
          })),
          notes: `POS checkout`,
        }),
      });
      
      const invoiceData = await invoiceRes.json();
      if (!invoiceRes.ok) throw new Error(invoiceData.error);
      
      setSaleId(invoiceData.sale_id);
      
      // Start terminal charge
      const terminalRes = await fetch(`/api/pos/invoices/${invoiceData.sale_id}/square/start-terminal-charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tip_settings: {
            allowTipping: true,
            separateTipScreen: true,
            tipPercentages: [15, 20, 25],
          },
        }),
      });
      
      if (!terminalRes.ok) {
        const terminalData = await terminalRes.json();
        throw new Error(terminalData.error);
      }
      
      setShowTerminalModal(true);
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Failed to start checkout');
    } finally {
      setProcessing(false);
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    setProcessing(true);
    try {
      const invoiceRes = await fetch('/api/pos/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id || null,
          appointment_id: client.appointment_id || null,
          items: cart.map(item => ({
            type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.original_price,
            discount_amount: item.discount,
          })),
          payment_method: 'cash',
        }),
      });
      
      if (!invoiceRes.ok) throw new Error('Failed to create invoice');
      
      setPaymentId(`cash_${Date.now()}`);
      setPaid(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Paid state
  if (paid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-slate-800 mb-2">Payment Complete!</p>
        <p className="text-gray-500 mb-6">${subtotal.toFixed(2)} paid</p>
        <div className="space-y-2 w-full max-w-xs">
          <button className="w-full py-3 bg-gray-100 text-slate-700 rounded-xl hover:bg-gray-200 font-medium">
            📧 Email Receipt
          </button>
          <button className="w-full py-3 bg-gray-100 text-slate-700 rounded-xl hover:bg-gray-200 font-medium">
            🖨️ Print Receipt
          </button>
          <button
            onClick={onComplete}
            className="w-full py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Payment selection
  if (showPayment) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700 mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="font-semibold text-slate-800">Select Payment</h3>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-gray-500 mb-2">Total Due</p>
          <p className="text-4xl font-bold text-slate-800 mb-8">${subtotal.toFixed(2)}</p>
          
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handleTerminalCheckout}
              disabled={processing}
              className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
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
              onClick={handleCashPayment}
              disabled={processing}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium disabled:opacity-50"
            >
              💵 Cash
            </button>
            <button
              disabled={processing}
              className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium disabled:opacity-50"
            >
              🎁 Gift Card
            </button>
          </div>
        </div>

        {/* Terminal Modal */}
        {showTerminalModal && saleId && (
          <TerminalStatusModal
            isOpen={showTerminalModal}
            saleId={saleId}
            amount={Math.round(subtotal * 100)}
            onComplete={(data) => {
              setPaymentId(data.paymentId);
              setPaid(true);
              setShowTerminalModal(false);
            }}
            onCancel={() => setShowTerminalModal(false)}
            onRetry={handleTerminalCheckout}
            onClose={() => setShowTerminalModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <h3 className="font-semibold text-slate-800">Checkout</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold text-lg">
          {client.name?.[0] || 'C'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{client.name}</p>
          <p className="text-sm text-gray-500">Client since {new Date().getFullYear()}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto">
        {cart.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No items yet</p>
            <p className="text-sm mt-1">Add services or products below</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-gray-500">with {item.provider_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.discount > 0 && (
                      <p className="text-sm text-gray-400 line-through">${item.original_price.toFixed(2)}</p>
                    )}
                    <p className="font-semibold text-slate-800">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add buttons */}
        <div className="p-4 flex gap-2 border-t border-gray-200 bg-white">
          <button
            onClick={() => setShowServices(!showServices)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <span className="text-lg">+</span> ADD SERVICE
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-lg">+</span> ADD PRODUCT
          </button>
        </div>

        {/* Service dropdown */}
        {showServices && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
            {services.slice(0, 8).map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  onAddToCart(service, 'service');
                  setShowServices(false);
                }}
                className="w-full text-left p-3 bg-white rounded-lg hover:bg-pink-50 border border-gray-200 hover:border-pink-200 transition-colors"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-800">{service.name}</span>
                  <span className="text-sm font-semibold text-pink-600">
                    ${service.price_cents ? (service.price_cents / 100).toFixed(0) : service.price || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* More button */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-lg">+</span> MORE
          </button>
        </div>
      </div>

      {/* Offers Applied */}
      {hasDiscount && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {cart.filter(i => i.discount > 0).length} Offer{cart.filter(i => i.discount > 0).length > 1 ? 's' : ''} Applied
          </span>
          <button className="text-sm text-pink-600 font-medium">Show</button>
        </div>
      )}

      {/* Subtotal */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="text-lg font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
      </div>

      {/* Go to Payments */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => setShowPayment(true)}
          disabled={cart.length === 0}
          className="w-full py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          Go to Payments
        </button>
      </div>
    </div>
  );
}
