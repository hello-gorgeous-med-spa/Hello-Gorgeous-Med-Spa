'use client';

import { useState } from 'react';
import {
  PaymentMethod,
  PaymentSplit,
  getGroupedPaymentMethods,
  getPaymentMethod,
  formatPaymentMethod,
  validatePaymentSplit,
  getFinancingOptions,
} from '@/lib/hgos/payment-methods';

// ============================================================
// PAYMENT METHOD BADGE
// ============================================================

interface PaymentMethodBadgeProps {
  methodId: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentMethodBadge({ 
  methodId, 
  showIcon = true, 
  size = 'md' 
}: PaymentMethodBadgeProps) {
  const method = getPaymentMethod(methodId);
  if (!method) return <span>{methodId}</span>;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const typeColors: Record<string, string> = {
    cash: 'bg-green-100 text-green-800',
    card: 'bg-blue-100 text-blue-800',
    financing: 'bg-purple-100 text-purple-800',
    credit: 'bg-amber-100 text-amber-800',
    gift: 'bg-pink-100 text-pink-800',
    comp: 'bg-white text-black',
    deposit: 'bg-cyan-100 text-cyan-800',
    other: 'bg-white text-black',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses[size]} ${typeColors[method.type]}`}
    >
      {showIcon && <span>{method.icon}</span>}
      <span>{method.displayName}</span>
    </span>
  );
}

// ============================================================
// SINGLE PAYMENT METHOD SELECTOR
// ============================================================

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (methodId: string) => void;
  disabled?: boolean;
  showGrouped?: boolean;
}

export function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
  showGrouped = true,
}: PaymentMethodSelectorProps) {
  const grouped = getGroupedPaymentMethods();

  if (!showGrouped) {
    // Flat list
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
      >
        {Object.values(grouped).flat().map((method) => (
          <option key={method.id} value={method.id}>
            {method.icon} {method.displayName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
    >
      {Object.entries(grouped).map(([groupName, methods]) => (
        <optgroup key={groupName} label={groupName}>
          {methods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.icon} {method.displayName}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// ============================================================
// PAYMENT METHOD GRID (for touch-friendly checkout)
// ============================================================

interface PaymentMethodGridProps {
  value: string;
  onChange: (methodId: string) => void;
  disabled?: boolean;
}

export function PaymentMethodGrid({
  value,
  onChange,
  disabled = false,
}: PaymentMethodGridProps) {
  const grouped = getGroupedPaymentMethods();

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([groupName, methods]) => (
        <div key={groupName}>
          <h4 className="text-sm font-medium text-black mb-2">{groupName}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {methods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange(method.id)}
                disabled={disabled}
                className={`
                  flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${value === method.id
                    ? 'border-[#FF2D8E] bg-pink-50'
                    : 'border-black hover:border-black bg-white'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-sm font-medium text-black">{method.displayName}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// SPLIT PAYMENT EDITOR
// ============================================================

interface SplitPaymentEditorProps {
  totalAmount: number;
  splits: PaymentSplit[];
  onChange: (splits: PaymentSplit[]) => void;
  disabled?: boolean;
}

export function SplitPaymentEditor({
  totalAmount,
  splits,
  onChange,
  disabled = false,
}: SplitPaymentEditorProps) {
  const grouped = getGroupedPaymentMethods();
  const allMethods = Object.values(grouped).flat();
  
  const remainingAmount = totalAmount - splits.reduce((sum, s) => sum + s.amount, 0);
  const validation = validatePaymentSplit(splits, totalAmount);

  const addSplit = () => {
    onChange([...splits, { methodId: 'card_terminal', amount: remainingAmount }]);
  };

  const removeSplit = (index: number) => {
    onChange(splits.filter((_, i) => i !== index));
  };

  const updateSplit = (index: number, updates: Partial<PaymentSplit>) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], ...updates };
    onChange(newSplits);
  };

  return (
    <div className="space-y-4">
      {/* Split rows */}
      {splits.map((split, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            value={split.methodId}
            onChange={(e) => updateSplit(index, { methodId: e.target.value })}
            disabled={disabled}
            className="flex-1 px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {allMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.icon} {method.displayName}
              </option>
            ))}
          </select>
          
          <div className="relative w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">$</span>
            <input
              type="number"
              value={split.amount}
              onChange={(e) => updateSplit(index, { amount: parseFloat(e.target.value) || 0 })}
              disabled={disabled}
              step="0.01"
              min="0"
              className="w-full pl-7 pr-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {splits.length > 1 && (
            <button
              type="button"
              onClick={() => removeSplit(index)}
              disabled={disabled}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {/* Add split button */}
      {remainingAmount > 0.01 && (
        <button
          type="button"
          onClick={addSplit}
          disabled={disabled}
          className="w-full py-2 border-2 border-dashed border-black rounded-lg text-black hover:border-black hover:text-black transition-colors"
        >
          + Add Another Payment Method (${remainingAmount.toFixed(2)} remaining)
        </button>
      )}

      {/* Validation message */}
      {!validation.valid && splits.length > 0 && (
        <p className="text-sm text-red-500">{validation.message}</p>
      )}

      {/* Total summary */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-black">Total</span>
        <span className={`font-bold text-lg ${Math.abs(remainingAmount) < 0.01 ? 'text-green-600' : 'text-amber-600'}`}>
          ${totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// FINANCING OPTIONS DISPLAY
// ============================================================

interface FinancingOptionsProps {
  amount: number;
  onSelect?: (methodId: string) => void;
}

export function FinancingOptions({ amount, onSelect }: FinancingOptionsProps) {
  const options = getFinancingOptions();
  
  if (options.length === 0) return null;

  return (
    <div className="bg-purple-50 rounded-xl p-4">
      <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
        💰 Financing Options Available
      </h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            className="bg-white rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <p className="font-medium text-black">{option.displayName}</p>
                <p className="text-sm text-black">{option.description}</p>
              </div>
            </div>
            {option.id === 'afterpay' && (
              <div className="text-right">
                <p className="font-semibold text-purple-600">
                  4 x ${(amount / 4).toFixed(2)}
                </p>
                <p className="text-xs text-black">interest-free</p>
              </div>
            )}
            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
                Select
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT RECEIPT LINE
// ============================================================

interface PaymentReceiptLineProps {
  splits: PaymentSplit[];
}

export function PaymentReceiptLine({ splits }: PaymentReceiptLineProps) {
  if (splits.length === 0) return null;

  if (splits.length === 1) {
    const method = getPaymentMethod(splits[0].methodId);
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-black">
          {method?.icon} {method?.displayName || splits[0].methodId}
        </span>
        <span className="font-medium">${splits[0].amount.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {splits.map((split, index) => {
        const method = getPaymentMethod(split.methodId);
        return (
          <div key={index} className="flex items-center justify-between py-1 text-sm">
            <span className="text-black">
              {method?.icon} {method?.displayName || split.methodId}
            </span>
            <span>${split.amount.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
}
