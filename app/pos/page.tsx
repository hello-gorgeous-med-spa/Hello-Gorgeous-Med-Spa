'use client';

// ============================================================
// POS SYSTEM - INVOICE-FIRST ARCHITECTURE
// 3-Panel Layout: Ready for Checkout | Active Invoice | Smart Add-ons
// Premium white-based luxury interface
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const TerminalStatusModal = dynamic(() => import('@/components/TerminalStatusModal'), {
  ssr: false,
});

// Types
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  membership_status?: string;
  account_balance?: number;
}

interface LineItem {
  id: string;
  type: 'service' | 'retail' | 'package' | 'membership' | 'adjustment';
  reference_id?: string;
  name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
  provider_name?: string;
}

interface Invoice {
  id: string | null;
  client: Client | null;
  appointment_id: string | null;
  items: LineItem[];
  subtotal: number;
  tax: number;
  discount_total: number;
  deposit_applied: number;
  tip: number;
  total: number;
  balance_due: number;
  status: 'draft' | 'open' | 'paid' | 'partially_paid' | 'void';
}

interface ReadyAppointment {
  id: string;
  client_id: string;
  client_name: string;
  client_email?: string;
  service_name: string;
  service_price: number;
  provider_name: string;
  starts_at: string;
  status: string;
  deposit_amount?: number;
}

// Smart Add-on Rules
const ADD_ON_RULES: Record<string, { name: string; price: number; description: string }[]> = {
  'botox': [
    { name: 'Brow Lift Add-on', price: 50, description: 'Enhance your results' },
    { name: 'Lip Flip', price: 75, description: 'Subtle lip enhancement' },
  ],
  'dysport': [
    { name: 'Brow Lift Add-on', price: 50, description: 'Enhance your results' },
    { name: 'Lip Flip', price: 75, description: 'Subtle lip enhancement' },
  ],
  'microneedling': [
    { name: 'AnteAGE Serum', price: 195, description: 'Maximize healing' },
    { name: 'PRP Add-on', price: 150, description: 'Enhanced regeneration' },
  ],
  'lip filler': [
    { name: 'Hylenex Protection', price: 50, description: 'Safety protocol' },
    { name: 'Lip Care Kit', price: 35, description: 'Post-treatment care' },
  ],
  'filler': [
    { name: 'Hylenex Protection', price: 50, description: 'Safety protocol' },
  ],
  'hydrafacial': [
    { name: 'LED Light Therapy', price: 50, description: 'Boost results' },
    { name: 'Dermaplaning Add-on', price: 45, description: 'Deeper exfoliation' },
  ],
  'prf': [
    { name: 'EZ PRF Gel Upgrade', price: 100, description: 'Extended results' },
  ],
  'iv therapy': [
    { name: 'Glutathione Push', price: 50, description: 'Antioxidant boost' },
    { name: 'B12 Shot', price: 25, description: 'Energy boost' },
  ],
};

function getSmartAddOns(items: LineItem[]): { name: string; price: number; description: string }[] {
  const addOns: { name: string; price: number; description: string }[] = [];
  const addedNames = new Set<string>();
  
  items.forEach(item => {
    const itemNameLower = item.name.toLowerCase();
    Object.entries(ADD_ON_RULES).forEach(([keyword, suggestions]) => {
      if (itemNameLower.includes(keyword)) {
        suggestions.forEach(suggestion => {
          if (!addedNames.has(suggestion.name)) {
            addOns.push(suggestion);
            addedNames.add(suggestion.name);
          }
        });
      }
    });
  });
  
  return addOns.slice(0, 6);
}

// Main POS Component
function POSContent() {
  const searchParams = useSearchParams();
  const appointmentIdParam = searchParams.get('appointment');
  
  // State
  const [readyAppointments, setReadyAppointments] = useState<ReadyAppointment[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<Invoice>({
    id: null,
    client: null,
    appointment_id: null,
    items: [],
    subtotal: 0,
    tax: 0,
    discount_total: 0,
    deposit_applied: 0,
    tip: 0,
    total: 0,
    balance_due: 0,
    status: 'draft',
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [loadedAppointmentId, setLoadedAppointmentId] = useState<string | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);

  // Tax rate (can be made configurable)
  const TAX_RATE = 0; // 0% for services in IL

  // Fetch ready appointments
  const fetchReadyAppointments = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/appointments?date=${today}`);
      const data = await res.json();
      if (data.appointments) {
        const ready = data.appointments
          .filter((a: any) => 
            ['checked_in', 'in_progress', 'completed'].includes(a.status) &&
            a.payment_status !== 'paid'
          )
          .map((a: any) => ({
            id: a.id,
            client_id: a.client_id,
            client_name: a.client_name || `${a.client?.first_name || ''} ${a.client?.last_name || ''}`.trim() || 'Client',
            client_email: a.client_email || a.client?.email,
            service_name: a.service_name || a.service?.name || 'Service',
            service_price: a.service_price || a.service?.price || 0,
            provider_name: a.provider_name || `${a.provider?.first_name || ''} ${a.provider?.last_name || ''}`.trim() || 'Provider',
            starts_at: a.starts_at,
            status: a.status,
            deposit_amount: a.deposit_amount || 0,
          }));
        setReadyAppointments(ready);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
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

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?active=true');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([fetchReadyAppointments(), fetchServices(), fetchProducts()])
      .finally(() => setLoading(false));
  }, [fetchReadyAppointments, fetchServices, fetchProducts]);

  // Load appointment from URL
  useEffect(() => {
    if (appointmentIdParam && appointmentIdParam !== loadedAppointmentId) {
      const loadAppointment = async () => {
        try {
          const res = await fetch(`/api/appointments/${appointmentIdParam}`);
          const data = await res.json();
          if (data.appointment) {
            const appt = data.appointment;
            selectAppointment({
              id: appt.id,
              client_id: appt.client_id || appt.client?.id,
              client_name: appt.client ? `${appt.client.first_name || ''} ${appt.client.last_name || ''}`.trim() : 'Client',
              client_email: appt.client?.email,
              service_name: appt.service?.name || 'Service',
              service_price: appt.service?.price || appt.service?.price_cents / 100 || 0,
              provider_name: appt.provider ? `${appt.provider.first_name || ''} ${appt.provider.last_name || ''}`.trim() : 'Provider',
              starts_at: appt.starts_at,
              status: appt.status,
              deposit_amount: appt.deposit_amount || 0,
            });
            setLoadedAppointmentId(appointmentIdParam);
          }
        } catch (err) {
          console.error('Failed to load appointment:', err);
        }
      };
      loadAppointment();
    }
  }, [appointmentIdParam, loadedAppointmentId]);

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * TAX_RATE) / 100;
    const total = subtotal + tax - invoice.discount_total - invoice.deposit_applied;
    const balance_due = total - invoice.tip;
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total: Math.max(0, total),
      balance_due: Math.max(0, balance_due),
    }));
  }, [invoice.items, invoice.discount_total, invoice.deposit_applied, invoice.tip]);

  // Select appointment to checkout
  const selectAppointment = (appt: ReadyAppointment) => {
    setIsWalkIn(false);
    const lineItem: LineItem = {
      id: `service-${appt.id}-${Date.now()}`,
      type: 'service',
      reference_id: appt.id,
      name: appt.service_name,
      quantity: 1,
      unit_price: appt.service_price,
      discount: 0,
      total: appt.service_price,
      provider_name: appt.provider_name,
    };

    setInvoice({
      id: null,
      client: {
        id: appt.client_id,
        first_name: appt.client_name.split(' ')[0] || '',
        last_name: appt.client_name.split(' ').slice(1).join(' ') || '',
        email: appt.client_email,
      },
      appointment_id: appt.id,
      items: [lineItem],
      subtotal: appt.service_price,
      tax: 0,
      discount_total: 0,
      deposit_applied: appt.deposit_amount || 0,
      tip: 0,
      total: appt.service_price - (appt.deposit_amount || 0),
      balance_due: appt.service_price - (appt.deposit_amount || 0),
      status: 'draft',
    });
  };

  // Start walk-in
  const startWalkIn = () => {
    setIsWalkIn(true);
    setInvoice({
      id: null,
      client: null,
      appointment_id: null,
      items: [],
      subtotal: 0,
      tax: 0,
      discount_total: 0,
      deposit_applied: 0,
      tip: 0,
      total: 0,
      balance_due: 0,
      status: 'draft',
    });
  };

  // Search clients
  const searchClients = async (query: string) => {
    setClientSearch(query);
    if (query.length < 2) {
      setClientResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setClientResults(data.clients || []);
    } catch (err) {
      console.error('Client search error:', err);
    }
  };

  // Select client for walk-in
  const selectClient = (client: Client) => {
    setInvoice(prev => ({ ...prev, client }));
    setClientSearch('');
    setClientResults([]);
  };

  // Add line item
  const addLineItem = (item: { name: string; price: number; type: LineItem['type']; id?: string }) => {
    const lineItem: LineItem = {
      id: `${item.type}-${item.id || Date.now()}-${Date.now()}`,
      type: item.type,
      reference_id: item.id,
      name: item.name,
      quantity: 1,
      unit_price: item.price,
      discount: 0,
      total: item.price,
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, lineItem],
    }));
    setShowAddService(false);
    setShowAddProduct(false);
  };

  // Remove line item
  const removeLineItem = (itemId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
    }));
  };

  // Update line item quantity
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity, total: item.unit_price * quantity - item.discount }
          : item
      ),
    }));
  };

  // Update line item price
  const updateItemPrice = (itemId: string, price: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, unit_price: price, total: price * item.quantity - item.discount }
          : item
      ),
    }));
  };

  // Apply discount to item
  const applyItemDiscount = (itemId: string, discount: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, discount, total: item.unit_price * item.quantity - discount }
          : item
      ),
    }));
  };

  // Process terminal payment
  const processTerminalPayment = async () => {
    if (invoice.items.length === 0) return;
    
    setProcessing(true);
    try {
      // Create invoice in database
      const invoiceRes = await fetch('/api/pos/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: invoice.client?.id || null,
          appointment_id: invoice.appointment_id,
          items: invoice.items.map(item => ({
            type: item.type,
            item_id: item.reference_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount,
          })),
          discount_amount: invoice.discount_total,
          tax_rate: TAX_RATE * 100,
          notes: invoice.deposit_applied > 0 ? `Deposit applied: $${invoice.deposit_applied.toFixed(2)}` : undefined,
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
          amount_cents: Math.round(invoice.balance_due * 100),
          tip_settings: {
            allowTipping: true,
            separateTipScreen: true,
            tipPercentages: [18, 20, 25],
          },
        }),
      });

      const terminalData = await terminalRes.json();
      if (!terminalRes.ok) throw new Error(terminalData.error);

      setShowTerminalModal(true);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to start payment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  // Process cash payment
  const processCashPayment = async () => {
    if (invoice.items.length === 0) return;
    
    setProcessing(true);
    try {
      // Create invoice
      const invoiceRes = await fetch('/api/pos/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: invoice.client?.id || null,
          appointment_id: invoice.appointment_id,
          items: invoice.items.map(item => ({
            type: item.type,
            item_id: item.reference_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount,
          })),
        }),
      });

      const invoiceData = await invoiceRes.json();
      if (!invoiceRes.ok) throw new Error(invoiceData.error);

      // Record cash payment
      const paymentRes = await fetch('/api/pos/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sale_id: invoiceData.sale_id,
          payment_method: 'cash',
          amount: Math.round(invoice.balance_due * 100),
        }),
      });

      if (paymentRes.ok) {
        setPaymentSuccess(true);
        // Update appointment payment status if linked
        if (invoice.appointment_id) {
          await fetch(`/api/appointments/${invoice.appointment_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_status: 'paid' }),
          });
        }
      }
    } catch (err) {
      console.error('Cash payment error:', err);
      alert('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  // Handle terminal payment complete
  const handlePaymentComplete = (data: any) => {
    setShowTerminalModal(false);
    setPaymentSuccess(true);
    // Update appointment payment status if linked
    if (invoice.appointment_id) {
      fetch(`/api/appointments/${invoice.appointment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' }),
      });
    }
    // Refresh ready appointments
    fetchReadyAppointments();
  };

  // Reset for new transaction
  const resetInvoice = () => {
    setIsWalkIn(false);
    setInvoice({
      id: null,
      client: null,
      appointment_id: null,
      items: [],
      subtotal: 0,
      tax: 0,
      discount_total: 0,
      deposit_applied: 0,
      tip: 0,
      total: 0,
      balance_due: 0,
      status: 'draft',
    });
    setPaymentSuccess(false);
    setSaleId(null);
    fetchReadyAppointments();
  };

  // Format time
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get smart add-ons
  const smartAddOns = getSmartAddOns(invoice.items);

  // Payment success view
  if (paymentSuccess) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#E6007E] flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Payment Complete!</h1>
          <p className="text-black mb-8">${invoice.total.toFixed(2)} collected</p>
          <div className="space-y-3">
            <button className="w-full py-3 px-6 border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium">
              📧 Email Receipt
            </button>
            <button className="w-full py-3 px-6 border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium">
              📱 Text Receipt
            </button>
            <button
              onClick={resetInvoice}
              className="w-full py-4 px-6 bg-[#E6007E] text-white rounded-lg hover:bg-black transition-colors font-bold"
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      {/* LEFT PANEL - Ready for Checkout */}
      <div className="w-80 border-r border-black flex flex-col bg-white">
        <div className="p-4 border-b border-black">
          <h2 className="text-lg font-bold text-black">Ready for Checkout</h2>
          <p className="text-sm text-black/60">Today&apos;s completed appointments</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-black/5 h-24 rounded-lg" />
              ))}
            </div>
          ) : readyAppointments.length === 0 ? (
            <div className="p-8 text-center text-black/50">
              <p>No appointments ready</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {readyAppointments.map(appt => (
                <button
                  key={appt.id}
                  onClick={() => selectAppointment(appt)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    invoice.appointment_id === appt.id
                      ? 'border-[#E6007E] bg-[#E6007E]/5'
                      : 'border-black hover:border-[#E6007E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black/60">{formatTime(appt.starts_at)}</span>
                    <span className="text-sm font-bold text-[#E6007E]">${appt.service_price.toFixed(0)}</span>
                  </div>
                  <p className="font-bold text-black truncate">{appt.client_name}</p>
                  <p className="text-sm text-black/70 truncate">{appt.service_name}</p>
                  <p className="text-xs text-black/50 mt-1">with {appt.provider_name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Walk-in Button */}
        <div className="p-4 border-t border-black">
          <button
            onClick={startWalkIn}
            className="w-full py-3 px-4 border-2 border-[#E6007E] text-[#E6007E] rounded-lg font-bold hover:bg-[#E6007E] hover:text-white transition-colors"
          >
            + New Walk-In
          </button>
        </div>
      </div>

      {/* CENTER PANEL - Active Invoice */}
      <div className="flex-1 flex flex-col bg-white">
        {invoice.items.length === 0 && !invoice.client && !isWalkIn ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-black/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Select an Appointment</h2>
              <p className="text-black/60">
                Choose a completed appointment from the left, or start a walk-in sale
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Client Header */}
            <div className="p-6 border-b border-black">
              {invoice.client ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xl font-bold">
                    {invoice.client.first_name?.[0] || 'W'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-black">
                      {invoice.client.first_name} {invoice.client.last_name}
                    </h2>
                    {invoice.client.email && (
                      <p className="text-sm text-black/60">{invoice.client.email}</p>
                    )}
                    {invoice.client.membership_status && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold rounded">
                        {invoice.client.membership_status}
                      </span>
                    )}
                  </div>
                  {invoice.client.account_balance && invoice.client.account_balance > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-black/60">Balance Due</p>
                      <p className="text-lg font-bold text-red-600">${invoice.client.account_balance.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Walk-in client search
                <div>
                  <p className="text-sm font-medium text-black mb-2">Walk-In Client (Optional)</p>
                  <div className="relative">
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => searchClients(e.target.value)}
                      placeholder="Search by name, email, or phone..."
                      className="w-full px-4 py-3 border border-black rounded-lg text-black placeholder-black/40 focus:outline-none focus:border-[#E6007E]"
                    />
                    {clientResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {clientResults.map(client => (
                          <button
                            key={client.id}
                            onClick={() => selectClient(client)}
                            className="w-full px-4 py-3 text-left hover:bg-black/5 border-b border-black/10 last:border-0"
                          >
                            <p className="font-medium text-black">{client.first_name} {client.last_name}</p>
                            <p className="text-sm text-black/60">{client.email || client.phone}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {invoice.items.map(item => (
                  <div key={item.id} className="p-4 border border-black rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-black">{item.name}</p>
                        {item.provider_name && (
                          <p className="text-sm text-black/60">with {item.provider_name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-black rounded">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-black hover:bg-black/5"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-black font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-black hover:bg-black/5"
                          >
                            +
                          </button>
                        </div>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-1 border border-black rounded text-right font-bold text-black"
                        />
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="p-1 text-black/40 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {item.discount > 0 && (
                      <p className="text-sm text-[#E6007E] mt-2">-${item.discount.toFixed(2)} discount</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowAddService(true)}
                  className="flex-1 py-3 border border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
                >
                  + Add Service
                </button>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex-1 py-3 border border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
                >
                  + Add Product
                </button>
              </div>

              {/* Add Service Modal */}
              {showAddService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b border-black flex items-center justify-between">
                      <h3 className="font-bold text-black">Add Service</h3>
                      <button onClick={() => setShowAddService(false)} className="text-black/60 hover:text-black">✕</button>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {services.slice(0, 20).map(service => (
                          <button
                            key={service.id}
                            onClick={() => addLineItem({
                              name: service.name,
                              price: service.price_cents ? service.price_cents / 100 : service.price || 0,
                              type: 'service',
                              id: service.id,
                            })}
                            className="w-full p-3 text-left border border-black rounded-lg hover:border-[#E6007E] hover:bg-[#E6007E]/5"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-black">{service.name}</span>
                              <span className="font-bold text-[#E6007E]">
                                ${service.price_cents ? (service.price_cents / 100).toFixed(0) : service.price || 0}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b border-black flex items-center justify-between">
                      <h3 className="font-bold text-black">Add Product</h3>
                      <button onClick={() => setShowAddProduct(false)} className="text-black/60 hover:text-black">✕</button>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {products.length === 0 ? (
                        <p className="text-center text-black/60 py-8">No products available</p>
                      ) : (
                        <div className="space-y-2">
                          {products.slice(0, 20).map(product => (
                            <button
                              key={product.id}
                              onClick={() => addLineItem({
                                name: product.name,
                                price: product.price_cents ? product.price_cents / 100 : product.price || 0,
                                type: 'retail',
                                id: product.id,
                              })}
                              className="w-full p-3 text-left border border-black rounded-lg hover:border-[#E6007E] hover:bg-[#E6007E]/5"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium text-black">{product.name}</span>
                                <span className="font-bold text-[#E6007E]">
                                  ${product.price_cents ? (product.price_cents / 100).toFixed(0) : product.price || 0}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Totals & Payment */}
            <div className="border-t border-black p-6 bg-white">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-black">
                    <span>Tax</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                )}
                {invoice.discount_total > 0 && (
                  <div className="flex justify-between text-[#E6007E]">
                    <span>Discount</span>
                    <span>-${invoice.discount_total.toFixed(2)}</span>
                  </div>
                )}
                {invoice.deposit_applied > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Deposit Applied</span>
                    <span>-${invoice.deposit_applied.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-black">
                  <span className="text-xl font-bold text-black">TOTAL DUE</span>
                  <span className="text-[28px] font-bold text-[#E6007E]">${invoice.balance_due.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={processTerminalPayment}
                  disabled={processing || invoice.items.length === 0}
                  className="col-span-2 py-4 bg-[#E6007E] text-white rounded-lg font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      💳 Charge on Terminal
                    </>
                  )}
                </button>
                <button
                  onClick={processCashPayment}
                  disabled={processing || invoice.items.length === 0}
                  className="py-3 border border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  💵 Cash
                </button>
                <button
                  disabled={processing || invoice.items.length === 0}
                  className="py-3 border border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  🎁 Gift Card
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT PANEL - Smart Add-ons */}
      <div className="w-72 border-l border-black flex flex-col bg-white">
        <div className="p-4 border-b border-black">
          <h2 className="text-lg font-bold text-black">Suggested Add-ons</h2>
          <p className="text-sm text-black/60">Based on cart items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {smartAddOns.length === 0 ? (
            <div className="text-center py-8 text-black/50">
              <p className="text-sm">Add items to see suggestions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {smartAddOns.map((addon, idx) => (
                <button
                  key={idx}
                  onClick={() => addLineItem({ name: addon.name, price: addon.price, type: 'service' })}
                  className="w-full p-4 text-left border border-black rounded-lg hover:border-[#E6007E] hover:bg-[#E6007E]/5 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-black">{addon.name}</span>
                    <span className="font-bold text-[#E6007E]">+${addon.price}</span>
                  </div>
                  <p className="text-xs text-black/60">{addon.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-black space-y-2">
          <button className="w-full py-2 px-4 border border-black text-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">
            Apply Discount
          </button>
          <button className="w-full py-2 px-4 border border-black text-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">
            Apply Membership
          </button>
        </div>
      </div>

      {/* Terminal Modal */}
      {showTerminalModal && saleId && (
        <TerminalStatusModal
          isOpen={showTerminalModal}
          saleId={saleId}
          amount={Math.round(invoice.balance_due * 100)}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowTerminalModal(false)}
          onRetry={processTerminalPayment}
          onClose={() => setShowTerminalModal(false)}
        />
      )}
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function POSPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E6007E] border-t-transparent rounded-full" />
      </div>
    }>
      <POSContent />
    </Suspense>
  );
}
