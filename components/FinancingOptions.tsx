'use client';

// ============================================================
// FINANCING OPTIONS COMPONENT
// Cherry, CareCredit, PatientFi integration
// ============================================================

import { useState } from 'react';

interface FinancingOptionsProps {
  amount: number;
  onSelect?: (provider: string) => void;
  compact?: boolean;
}

interface FinancingProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  bgColor: string;
  description: string;
  applyUrl: string;
  monthlyEstimate: (amount: number) => string;
  terms: string;
}

const FINANCING_PROVIDERS: FinancingProvider[] = [
  {
    id: 'cherry',
    name: 'Cherry',
    logo: '🍒',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
    description: 'Easy approval, no hard credit check',
    applyUrl: 'https://withcherry.com/apply',
    monthlyEstimate: (amount) => `$${Math.round(amount / 12)}/mo`,
    terms: '0% APR for 12 months',
  },
  {
    id: 'carecredit',
    name: 'CareCredit',
    logo: '💳',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
    description: 'Healthcare credit card, use anywhere',
    applyUrl: 'https://www.carecredit.com/apply',
    monthlyEstimate: (amount) => `$${Math.round(amount / 24)}/mo`,
    terms: '0% APR for 6-24 months',
  },
  {
    id: 'patientfi',
    name: 'PatientFi',
    logo: '✨',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    description: 'Med spa focused, high approval rate',
    applyUrl: 'https://www.patientfi.com/',
    monthlyEstimate: (amount) => `$${Math.round(amount / 18)}/mo`,
    terms: 'Flexible terms 6-36 months',
  },
];

export function FinancingOptions({ amount, onSelect, compact = false }: FinancingOptionsProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleSelect = (provider: FinancingProvider) => {
    setSelectedProvider(provider.id);
    onSelect?.(provider.id);
    // Open apply URL in new tab
    window.open(provider.applyUrl, '_blank');
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-gray-900">💰 Need financing?</p>
          <p className="text-sm text-gray-600">As low as ${Math.round(amount / 24)}/mo</p>
        </div>
        <div className="flex gap-2">
          {FINANCING_PROVIDERS.map(provider => (
            <button
              key={provider.id}
              onClick={() => handleSelect(provider)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${provider.bgColor}`}
            >
              {provider.logo} {provider.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Pay Over Time</h3>
        <p className="text-gray-600">Split your ${amount.toLocaleString()} into easy monthly payments</p>
      </div>

      <div className="space-y-3">
        {FINANCING_PROVIDERS.map(provider => (
          <button
            key={provider.id}
            onClick={() => handleSelect(provider)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              selectedProvider === provider.id 
                ? 'border-pink-500 bg-pink-50' 
                : `${provider.bgColor} border`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.logo}</span>
                <div className="text-left">
                  <p className={`font-bold ${provider.color}`}>{provider.name}</p>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{provider.monthlyEstimate(amount)}</p>
                <p className="text-xs text-gray-500">{provider.terms}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        Clicking will open the financing application in a new window.
        Approval subject to credit check by financing provider.
      </p>
    </div>
  );
}

// Standalone button for checkout pages
export function FinancingButton({ amount }: { amount: number }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 px-4 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 font-medium rounded-xl border border-pink-200 hover:from-pink-200 hover:to-purple-200 transition-colors"
      >
        💰 Pay Over Time - As low as ${Math.round(amount / 24)}/mo
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Financing Options</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <FinancingOptions amount={amount} onSelect={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
