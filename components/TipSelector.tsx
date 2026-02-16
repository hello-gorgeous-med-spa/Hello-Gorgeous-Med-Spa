'use client';

import { useState } from 'react';

export interface TipOption {
  percentage: number;
  label: string;
}

export const DEFAULT_TIP_OPTIONS: TipOption[] = [
  { percentage: 0, label: 'No tip' },
  { percentage: 10, label: '10%' },
  { percentage: 15, label: '15%' },
  { percentage: 18, label: '18%' },
  { percentage: 20, label: '20%' },
  { percentage: 25, label: '25%' },
];

interface TipSelectorProps {
  subtotal: number;
  providerName: string;
  onTipChange: (tipAmount: number, tipPercentage: number | null) => void;
  selectedTip?: number;
  tipOptions?: TipOption[];
}

export function TipSelector({
  subtotal,
  providerName,
  onTipChange,
  selectedTip = 0,
  tipOptions = DEFAULT_TIP_OPTIONS,
}: TipSelectorProps) {
  const [customTipMode, setCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(0);

  const calculateTipAmount = (percentage: number): number => {
    return Math.round((subtotal * percentage) / 100 * 100) / 100;
  };

  const handlePresetSelect = (percentage: number) => {
    setCustomTipMode(false);
    setSelectedPercentage(percentage);
    const amount = calculateTipAmount(percentage);
    onTipChange(amount, percentage);
  };

  const handleCustomTipSubmit = () => {
    const amount = parseFloat(customTipValue) || 0;
    setSelectedPercentage(null);
    onTipChange(amount, null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-black mb-6">
        <span>Cart</span>
        <span>›</span>
        <span className="text-black font-medium">Tip</span>
        <span>›</span>
        <span>Payment</span>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-black mb-2">Select tip</h2>
      <p className="text-black mb-6">
        Select an amount for <span className="font-medium text-black">{providerName}</span>
      </p>

      {/* Tip Options Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {tipOptions.map((option) => {
          const tipAmount = calculateTipAmount(option.percentage);
          const isSelected = !customTipMode && selectedPercentage === option.percentage;

          return (
            <button
              key={option.percentage}
              onClick={() => handlePresetSelect(option.percentage)}
              className={`
                p-4 rounded-xl border-2 transition-all text-center
                ${isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-black hover:border-black bg-white'
                }
              `}
            >
              <p className={`font-bold text-lg ${isSelected ? 'text-purple-700' : 'text-black'}`}>
                {option.percentage === 0 ? option.label : option.label}
              </p>
              {option.percentage > 0 && (
                <p className={`text-sm ${isSelected ? 'text-purple-600' : 'text-black'}`}>
                  {formatCurrency(tipAmount)}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Tip Option */}
      <button
        onClick={() => setCustomTipMode(true)}
        className={`
          w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2
          ${customTipMode
            ? 'border-purple-500 bg-purple-50'
            : 'border-black hover:border-black bg-white'
          }
        `}
      >
        <span className="text-xl">⊕</span>
        <span className={`font-medium ${customTipMode ? 'text-purple-700' : 'text-black'}`}>
          Custom tip
        </span>
      </button>

      {/* Custom Tip Input */}
      {customTipMode && (
        <div className="mt-4 p-4 bg-white rounded-xl">
          <label className="block text-sm font-medium text-black mb-2">
            Enter custom amount
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">$</span>
              <input
                type="number"
                value={customTipValue}
                onChange={(e) => setCustomTipValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoFocus
              />
            </div>
            <button
              onClick={handleCustomTipSubmit}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Selected Tip Summary */}
      {selectedTip > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-center justify-between">
          <span className="text-green-800">Tip for {providerName}</span>
          <span className="font-bold text-green-700">{formatCurrency(selectedTip)}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPACT TIP SELECTOR (for checkout sidebar)
// ============================================================

interface CompactTipSelectorProps {
  subtotal: number;
  providerName: string;
  onTipChange: (tipAmount: number) => void;
  selectedTip?: number;
}

export function CompactTipSelector({
  subtotal,
  providerName,
  onTipChange,
  selectedTip = 0,
}: CompactTipSelectorProps) {
  const quickOptions = [0, 15, 18, 20, 25];

  const calculateTip = (percentage: number) => Math.round((subtotal * percentage) / 100 * 100) / 100;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black">
        Tip for {providerName}
      </label>
      <div className="flex gap-2 flex-wrap">
        {quickOptions.map((pct) => {
          const amount = calculateTip(pct);
          const isSelected = selectedTip === amount;

          return (
            <button
              key={pct}
              onClick={() => onTipChange(amount)}
              className={`
                px-3 py-2 text-sm rounded-lg border transition-colors
                ${isSelected
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-black border-black hover:border-black'
                }
              `}
            >
              {pct === 0 ? 'No tip' : `${pct}%`}
            </button>
          );
        })}
      </div>
      {selectedTip > 0 && (
        <p className="text-sm text-green-600">
          +${selectedTip.toFixed(2)} tip
        </p>
      )}
    </div>
  );
}

// ============================================================
// CHECKOUT SUMMARY WITH TIP
// ============================================================

interface CheckoutSummaryProps {
  items: {
    name: string;
    provider: string;
    duration: string;
    price: number;
  }[];
  clientName: string;
  clientPhone: string;
  tip: number;
  processingFee?: number;
  tax?: number;
  onTipChange: (amount: number) => void;
}

export function CheckoutSummary({
  items,
  clientName,
  clientPhone,
  tip,
  processingFee = 0,
  tax = 0,
  onTipChange,
}: CheckoutSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + tip + processingFee + tax;

  // Get unique provider for tip
  const provider = items[0]?.provider || 'Provider';

  return (
    <div className="bg-white rounded-xl border border-black overflow-hidden">
      {/* Client Info */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-black">{clientName}</p>
            <p className="text-sm text-black">{clientPhone}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {clientName.charAt(0)}
          </div>
        </div>
        <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
          ${subtotal.toFixed(2)} Unpaid
        </span>
      </div>

      {/* Line Items */}
      <div className="p-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-1 h-full bg-purple-500 rounded" />
            <div className="flex-1">
              <p className="font-medium text-black">{item.name}</p>
              <p className="text-sm text-black">
                {item.duration} • {item.provider}
              </p>
            </div>
            <p className="font-medium text-black">${item.price.toFixed(2)}</p>
          </div>
        ))}

        {/* Add to cart button */}
        <button className="flex items-center gap-2 text-black hover:text-black text-sm">
          <span>🛒</span> Add to cart
        </button>
      </div>

      {/* Totals */}
      <div className="border-t p-4 space-y-2 text-sm">
        {processingFee > 0 && (
          <div className="flex justify-between text-purple-600">
            <span>Processing fee</span>
            <span>${processingFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-black">Subtotal</span>
          <span className="text-black">${(subtotal + processingFee).toFixed(2)}</span>
        </div>
        {tip > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Tip</span>
            <span>+${tip.toFixed(2)}</span>
          </div>
        )}
        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-black">Tax</span>
            <span className="text-black">${tax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* To Pay */}
      <div className="border-t p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-black">To pay</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-black rounded-lg hover:bg-white">
            <span className="text-lg">⋮</span>
          </button>
          <button className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black">
            Continue to payment
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FULL CHECKOUT FLOW WITH TIP
// ============================================================

interface CheckoutWithTipProps {
  service: {
    name: string;
    category: string;
    duration: string;
    price: number;
    provider: string;
  };
  client: {
    name: string;
    phone: string;
  };
  onComplete: (data: { tip: number; total: number }) => void;
}

export function CheckoutWithTip({ service, client, onComplete }: CheckoutWithTipProps) {
  const [step, setStep] = useState<'tip' | 'payment'>('tip');
  const [tip, setTip] = useState(0);

  const subtotal = service.price;
  const total = subtotal + tip;

  const handleContinue = () => {
    if (step === 'tip') {
      setStep('payment');
    } else {
      onComplete({ tip, total });
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Tip Selection */}
          <div>
            {step === 'tip' && (
              <TipSelector
                subtotal={subtotal}
                providerName={service.provider}
                onTipChange={(amount) => setTip(amount)}
                selectedTip={tip}
              />
            )}
            {step === 'payment' && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Payment</h2>
                {/* Payment form would go here */}
                <p className="text-black">Select payment method...</p>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <CheckoutSummary
              items={[{
                name: `${service.category} · ${service.name}`,
                provider: service.provider,
                duration: service.duration,
                price: service.price,
              }]}
              clientName={client.name}
              clientPhone={client.phone}
              tip={tip}
              processingFee={0} // We don't charge processing fees like Fresha!
              onTipChange={setTip}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
