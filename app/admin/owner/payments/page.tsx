'use client';

// ============================================================
// PAYMENTS & FINANCIALS - OWNER CONTROLLED
// Pricing, taxes, refund rules, payment processor
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

export default function PaymentsPage() {
  const [taxSettings, setTaxSettings] = useState({
    collect_sales_tax: true,
    default_tax_rate: 8.25,
    tax_on_services: false,
    tax_on_products: true,
  });

  const [refundPolicy, setRefundPolicy] = useState({
    allow_refunds: true,
    refund_window_days: 30,
    partial_refunds_allowed: true,
    require_manager_approval: false,
    approval_threshold: 100,
  });

  const [paymentMethods, setPaymentMethods] = useState({
    accept_credit_cards: true,
    accept_cash: true,
    accept_check: false,
    accept_gift_cards: true,
    accept_membership_credits: true,
    accept_financing: false,
  });

  const [processorSettings, setProcessorSettings] = useState({
    processor: 'Stripe',
    mode: 'live',
    statement_descriptor: 'HELLO GORGEOUS',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Payment settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Payments & Financials" description="Configure pricing, taxes, and payment rules">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Payment Processor */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Processor</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
              <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium">{processorSettings.processor}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <div className={`px-4 py-2 rounded-lg font-medium ${processorSettings.mode === 'live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {processorSettings.mode.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statement Descriptor</label>
              <input
                type="text"
                value={processorSettings.statement_descriptor}
                onChange={(e) => setProcessorSettings(prev => ({ ...prev, statement_descriptor: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={22}
              />
            </div>
          </div>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener" className="inline-block mt-4 text-sm text-pink-600 hover:text-pink-700">
            Open Stripe Dashboard →
          </a>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Tax Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={taxSettings.collect_sales_tax} onChange={(e) => setTaxSettings(prev => ({ ...prev, collect_sales_tax: e.target.checked }))} className="w-5 h-5" />
              <span>Collect Sales Tax</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
              <input
                type="number"
                value={taxSettings.default_tax_rate}
                onChange={(e) => setTaxSettings(prev => ({ ...prev, default_tax_rate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                step="0.01"
                min="0"
              />
            </div>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={taxSettings.tax_on_services} onChange={(e) => setTaxSettings(prev => ({ ...prev, tax_on_services: e.target.checked }))} className="w-5 h-5" />
              <span>Apply Tax to Services</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={taxSettings.tax_on_products} onChange={(e) => setTaxSettings(prev => ({ ...prev, tax_on_products: e.target.checked }))} className="w-5 h-5" />
              <span>Apply Tax to Products</span>
            </label>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Accepted Payment Methods</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'accept_credit_cards', label: 'Credit/Debit Cards' },
              { key: 'accept_cash', label: 'Cash' },
              { key: 'accept_check', label: 'Check' },
              { key: 'accept_gift_cards', label: 'Gift Cards' },
              { key: 'accept_membership_credits', label: 'Membership Credits' },
              { key: 'accept_financing', label: 'Third-Party Financing' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={paymentMethods[item.key as keyof typeof paymentMethods]}
                  onChange={(e) => setPaymentMethods(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-pink-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Refund Policy</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={refundPolicy.allow_refunds} onChange={(e) => setRefundPolicy(prev => ({ ...prev, allow_refunds: e.target.checked }))} className="w-5 h-5" />
              <span>Allow Refunds</span>
            </label>
            {refundPolicy.allow_refunds && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Window (days)</label>
                  <input
                    type="number"
                    value={refundPolicy.refund_window_days}
                    onChange={(e) => setRefundPolicy(prev => ({ ...prev, refund_window_days: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" checked={refundPolicy.partial_refunds_allowed} onChange={(e) => setRefundPolicy(prev => ({ ...prev, partial_refunds_allowed: e.target.checked }))} className="w-5 h-5" />
                  <span>Allow Partial Refunds</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" checked={refundPolicy.require_manager_approval} onChange={(e) => setRefundPolicy(prev => ({ ...prev, require_manager_approval: e.target.checked }))} className="w-5 h-5" />
                  <span>Require Manager Approval</span>
                </label>
                {refundPolicy.require_manager_approval && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Threshold ($)</label>
                    <input
                      type="number"
                      value={refundPolicy.approval_threshold}
                      onChange={(e) => setRefundPolicy(prev => ({ ...prev, approval_threshold: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Refunds above this amount require approval</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium">
            Save Payment Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
