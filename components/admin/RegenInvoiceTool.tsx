'use client';

import { useState } from 'react';

interface InvoiceItem {
  description: string;
  amount: string;
  quantity: string;
}

interface InvoiceResult {
  success: boolean;
  invoice?: {
    id: string;
    number: string;
    hostedUrl: string;
    total: number;
  };
  message?: string;
  error?: string;
}

// Common Re Gen products/services for quick add
const QUICK_ADD_ITEMS = [
  { label: 'Telehealth Consult', description: 'NP Telehealth Consultation', amount: 49 },
  { label: 'Semaglutide (Maint)', description: 'Semaglutide Maintenance - 1 Month', amount: 195 },
  { label: 'Semaglutide (Titration)', description: 'Semaglutide Titration - 1 Month', amount: 245 },
  { label: 'Tirzepatide (Maint)', description: 'Tirzepatide Maintenance - 1 Month', amount: 295 },
  { label: 'Tirzepatide (Max)', description: 'Tirzepatide 15mg - 1 Month', amount: 395 },
  { label: 'BPC-157', description: 'BPC-157 Injectable - 1 Month', amount: 169 },
  { label: 'Sermorelin', description: 'Sermorelin Injectable - 1 Month', amount: 149 },
  { label: 'NAD+ Protocol', description: 'NAD+ Injectable Protocol - 1 Month', amount: 169 },
  { label: 'HRT Women', description: 'Women\'s HRT Compounded - 1 Month', amount: 150 },
  { label: 'TRT Men', description: 'Men\'s TRT Injectable - 1 Month', amount: 200 },
  { label: 'Shipping', description: 'Pharmacy Shipping', amount: 35 },
  { label: 'Labs - Peak', description: 'Peak Performance Lab Panel', amount: 199 },
  { label: 'Labs - HRT', description: 'HRT Baseline Lab Panel', amount: 299 },
];

export default function RegenInvoiceTool() {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [program, setProgram] = useState('');
  const [memo, setMemo] = useState('');
  const [dueInDays, setDueInDays] = useState('7');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', amount: '', quantity: '1' },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);

  const addItem = () => {
    setItems([...items, { description: '', amount: '', quantity: '1' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const quickAddItem = (preset: typeof QUICK_ADD_ITEMS[0]) => {
    // Find first empty row or add new
    const emptyIndex = items.findIndex(
      (item) => !item.description && !item.amount
    );
    if (emptyIndex >= 0) {
      const newItems = [...items];
      newItems[emptyIndex] = {
        description: preset.description,
        amount: preset.amount.toString(),
        quantity: '1',
      };
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          description: preset.description,
          amount: preset.amount.toString(),
          quantity: '1',
        },
      ]);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + amount * quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const validItems = items
        .filter((item) => item.description && item.amount)
        .map((item) => ({
          description: item.description,
          amount: parseFloat(item.amount),
          quantity: parseInt(item.quantity) || 1,
        }));

      if (validItems.length === 0) {
        setResult({ success: false, error: 'Add at least one item' });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/regen/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: {
            name: patientName,
            email: patientEmail,
            phone: patientPhone || undefined,
            program: program || undefined,
          },
          items: validItems,
          memo: memo || undefined,
          dueInDays: parseInt(dueInDays) || 7,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          invoice: data.invoice,
          message: data.message,
        });
        // Clear form on success
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
        setProgram('');
        setMemo('');
        setItems([{ description: '', amount: '', quantity: '1' }]);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send invoice',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Send Re Gen Invoice</h2>
        <p className="text-sm text-gray-600 mt-1">
          Create and email a Stripe invoice to a Re Gen patient
        </p>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Quick Add</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_ITEMS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => quickAddItem(preset)}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors"
            >
              {preset.label} (${preset.amount})
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Email *
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="patient@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="+1 630 555 1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select program...</option>
              <option value="glp1-semaglutide">GLP-1 Semaglutide</option>
              <option value="glp1-tirzepatide">GLP-1 Tirzepatide</option>
              <option value="hrt-women">HRT Women</option>
              <option value="trt-men">TRT Men</option>
              <option value="peptides">Peptides</option>
              <option value="labs">Labs Only</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Items
          </label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div className="w-16">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            + Add another item
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              ${calculateTotal().toFixed(2)}
            </p>
          </div>
        </div>

        {/* Memo & Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Memo (optional)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Thank you for choosing Re Gen..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due in (days)
            </label>
            <input
              type="number"
              value={dueInDays}
              onChange={(e) => setDueInDays(e.target.value)}
              min="1"
              max="90"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !patientName || !patientEmail}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.success ? (
            <div>
              <p className="font-medium text-green-800">{result.message}</p>
              {result.invoice && (
                <div className="mt-2 text-sm text-green-700">
                  <p>Invoice #{result.invoice.number}</p>
                  <p>Total: ${result.invoice.total.toFixed(2)}</p>
                  <a
                    href={result.invoice.hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline hover:text-green-800"
                  >
                    View Invoice →
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-800">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
