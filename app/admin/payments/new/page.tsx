'use client';

// ============================================================
// NEW PAYMENT PAGE
// Process a new payment or sale
// ============================================================

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  const clientId = searchParams.get('client');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientSearch: '',
    selectedClient: clientId || '',
    appointmentId: appointmentId || '',
    paymentType: 'service',
    items: [{ description: '', quantity: 1, price: 0 }],
    subtotal: 0,
    discount: 0,
    discountType: 'percent',
    tip: 0,
    paymentMethod: 'card',
    notes: '',
  });

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discountAmount = formData.discountType === 'percent' 
      ? subtotal * (formData.discount / 100)
      : formData.discount;
    return subtotal - discountAmount + formData.tip;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert('Payment processed successfully! (Demo mode - Stripe integration pending)');
    router.push('/admin/payments');
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/payments"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Payments
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">New Payment</h1>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Client Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Client
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={formData.clientSearch}
                onChange={(e) => setFormData({ ...formData, clientSearch: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              {formData.selectedClient && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">Client selected: Jennifer Martinez</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Type */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Type</h2>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'service', label: 'Service', icon: '💉' },
              { value: 'product', label: 'Product', icon: '🧴' },
              { value: 'package', label: 'Package', icon: '📦' },
              { value: 'membership', label: 'Membership', icon: '💎' },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, paymentType: type.value })}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  formData.paymentType === type.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl block mb-1">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-pink-500 hover:text-pink-600"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                />
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-28 pl-7 pr-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Discount & Tip */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Adjustments</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                />
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="percent">%</option>
                  <option value="fixed">$</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tip}
                  onChange={(e) => setFormData({ ...formData, tip: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'card', label: 'Card', icon: '💳' },
              { value: 'cash', label: 'Cash', icon: '💵' },
              { value: 'check', label: 'Check', icon: '📄' },
              { value: 'other', label: 'Other', icon: '📱' },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  formData.paymentMethod === method.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl block mb-1">{method.icon}</span>
                <span className="text-sm">{method.label}</span>
              </button>
            ))}
          </div>

          {formData.paymentMethod === 'card' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Stripe payment terminal will appear here when configured.
              </p>
            </div>
          )}
        </div>

        {/* Total & Submit */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>${formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
            </div>
            {formData.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>
                  -{formData.discountType === 'percent' ? `${formData.discount}%` : `$${formData.discount.toFixed(2)}`}
                </span>
              </div>
            )}
            {formData.tip > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tip</span>
                <span>${formData.tip.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-pink-500">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/payments"
              className="flex-1 px-4 py-3 text-center text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : `Charge $${calculateTotal().toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
