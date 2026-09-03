'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type Tab = 'invoice' | 'link' | 'history';

interface InvoiceItem {
  description: string;
  amount: string;
}

interface PaymentHistory {
  id: string;
  type: 'invoice' | 'payment_link' | 'subscription';
  patient: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');
  
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (actionParam === 'invoice') return 'invoice';
    if (actionParam === 'link') return 'link';
    return 'invoice';
  });

  // Invoice state
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ description: '', amount: '' }]);
  const [invoiceSending, setInvoiceSending] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<{ success?: boolean; message?: string; url?: string } | null>(null);

  // Payment Link state
  const [linkName, setLinkName] = useState('');
  const [linkAmount, setLinkAmount] = useState('');
  const [linkCreating, setLinkCreating] = useState(false);
  const [linkResult, setLinkResult] = useState<{ success?: boolean; url?: string; message?: string } | null>(null);

  // History
  const [history] = useState<PaymentHistory[]>([
    { id: 'pay_001', type: 'invoice', patient: 'Sarah M.', amount: 299, status: 'paid', date: '2024-09-03' },
    { id: 'pay_002', type: 'subscription', patient: 'Michael R.', amount: 349, status: 'paid', date: '2024-09-02' },
    { id: 'pay_003', type: 'payment_link', patient: 'Jennifer L.', amount: 189, status: 'pending', date: '2024-09-02' },
    { id: 'pay_004', type: 'invoice', patient: 'David K.', amount: 140, status: 'paid', date: '2024-09-01' },
    { id: 'pay_005', type: 'invoice', patient: 'Amanda T.', amount: 89, status: 'failed', date: '2024-08-30' },
  ]);

  const invoiceTotal = invoiceItems.reduce((sum, item) => {
    const amt = parseFloat(item.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', amount: '' }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    setInvoiceItems(updated);
  };

  const sendInvoice = async () => {
    if (!patientEmail || !patientName || invoiceTotal <= 0) {
      setInvoiceResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setInvoiceSending(true);
    setInvoiceResult(null);

    try {
      const validItems = invoiceItems
        .filter((item) => item.description.trim() && parseFloat(item.amount) > 0)
        .map((item) => ({
          description: item.description.trim(),
          amount: parseFloat(item.amount),
        }));

      const res = await fetch('/api/regen/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: patientEmail,
          name: patientName,
          items: validItems,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setInvoiceResult({ success: true, message: 'Invoice sent successfully!', url: data.invoiceUrl });
        setPatientEmail('');
        setPatientName('');
        setInvoiceItems([{ description: '', amount: '' }]);
      } else {
        setInvoiceResult({ success: false, message: data.error || 'Failed to send invoice' });
      }
    } catch (error) {
      setInvoiceResult({ success: false, message: 'Network error' });
    } finally {
      setInvoiceSending(false);
    }
  };

  const createPaymentLink = async () => {
    if (!linkName || !linkAmount || parseFloat(linkAmount) <= 0) {
      setLinkResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setLinkCreating(true);
    setLinkResult(null);

    try {
      const res = await fetch('/api/regen/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: linkName,
          amount: parseFloat(linkAmount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLinkResult({ success: true, url: data.url });
        setLinkName('');
        setLinkAmount('');
      } else {
        setLinkResult({ success: false, message: data.error || 'Failed to create link' });
      }
    } catch (error) {
      setLinkResult({ success: false, message: 'Network error' });
    } finally {
      setLinkCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Payments</h1>
        <p className="text-white/50">Send invoices, create payment links, view history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 rounded-xl p-1.5">
        {[
          { id: 'invoice' as Tab, label: 'Send Invoice', icon: '📧' },
          { id: 'link' as Tab, label: 'Payment Link', icon: '🔗' },
          { id: 'history' as Tab, label: 'History', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Invoice Tab */}
      {activeTab === 'invoice' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Send Invoice</h2>
          
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Patient Email *</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Invoice Items</label>
              <div className="space-y-3">
                {invoiceItems.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      placeholder="Description (e.g., Semaglutide 4mL)"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateInvoiceItem(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 pl-8 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                    {invoiceItems.length > 1 && (
                      <button
                        onClick={() => removeInvoiceItem(index)}
                        className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addInvoiceItem}
                className="mt-3 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm"
              >
                + Add Item
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <span className="text-white/70 font-medium">Total</span>
              <span className="text-2xl font-bold text-teal-400">${invoiceTotal.toFixed(2)}</span>
            </div>

            {/* Result */}
            {invoiceResult && (
              <div className={`p-4 rounded-xl ${invoiceResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className={invoiceResult.success ? 'text-green-300' : 'text-red-300'}>
                  {invoiceResult.message}
                </p>
                {invoiceResult.url && (
                  <a href={invoiceResult.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 text-sm hover:underline mt-1 block">
                    View Invoice →
                  </a>
                )}
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={sendInvoice}
              disabled={invoiceSending || invoiceTotal <= 0 || !patientEmail || !patientName}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {invoiceSending ? 'Sending...' : `Send Invoice for $${invoiceTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {/* Payment Link Tab */}
      {activeTab === 'link' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Create Payment Link</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">What is this for? *</label>
              <input
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="e.g., Semaglutide Monthly Supply"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Amount *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">$</span>
                <input
                  type="number"
                  value={linkAmount}
                  onChange={(e) => setLinkAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 pl-10 rounded-xl bg-white/10 border border-white/20 text-white text-xl placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* Result */}
            {linkResult && (
              <div className={`p-4 rounded-xl ${linkResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                {linkResult.success ? (
                  <div>
                    <p className="text-green-300 mb-2">Payment link created!</p>
                    <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                      <input
                        type="text"
                        readOnly
                        value={linkResult.url}
                        className="flex-1 bg-transparent text-white/80 text-sm truncate outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(linkResult.url!)}
                        className="px-3 py-1 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-400 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-300">{linkResult.message}</p>
                )}
              </div>
            )}

            <button
              onClick={createPaymentLink}
              disabled={linkCreating || !linkName || !linkAmount || parseFloat(linkAmount) <= 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:from-pink-400 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {linkCreating ? 'Creating...' : 'Create Payment Link'}
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Payment History</h2>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'invoice' ? 'bg-teal-500/20' :
                    item.type === 'subscription' ? 'bg-purple-500/20' : 'bg-pink-500/20'
                  }`}>
                    <span className="text-lg">
                      {item.type === 'invoice' ? '📧' : item.type === 'subscription' ? '🔄' : '🔗'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.patient}</p>
                    <p className="text-white/50 text-sm capitalize">{item.type.replace('_', ' ')} • {item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${item.amount}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                    item.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
