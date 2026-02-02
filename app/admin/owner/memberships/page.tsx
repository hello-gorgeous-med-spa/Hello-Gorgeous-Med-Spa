'use client';

// ============================================================
// MEMBERSHIPS & PACKAGES - OWNER CONTROLLED
// Membership plans, packages, billing rules
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'quarterly' | 'annual';
  benefits: string[];
  is_active: boolean;
  member_count: number;
}

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([
    { id: '1', name: 'Bronze', price: 49, billing: 'monthly', benefits: ['10% off services', 'Priority booking'], is_active: true, member_count: 45 },
    { id: '2', name: 'Silver', price: 99, billing: 'monthly', benefits: ['15% off services', '10 Botox units', 'Free B12'], is_active: true, member_count: 128 },
    { id: '3', name: 'Gold', price: 199, billing: 'monthly', benefits: ['20% off services', '20 Botox units', 'Free facial', 'VIP booking'], is_active: true, member_count: 34 },
  ]);

  const [billingSettings, setBillingSettings] = useState({
    allow_pause: true,
    max_pause_days: 90,
    allow_downgrade: true,
    prorate_changes: true,
    retry_failed_payments: true,
    retry_attempts: 3,
    cancel_after_failed_retries: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleActive = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Membership settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Memberships & Packages" description="Configure membership plans and billing rules">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Membership Plans */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Membership Plans</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
              + Create Plan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
            {plans.map(plan => (
              <div key={plan.id} className={`border rounded-xl overflow-hidden ${!plan.is_active ? 'opacity-60' : ''}`}>
                <div className="h-2 bg-purple-500" />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.billing}</span>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.benefits.map((b, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-green-500">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-3">{plan.member_count} active members</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-sm text-purple-600 hover:text-purple-700">Edit</button>
                    <button
                      onClick={() => toggleActive(plan.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${plan.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${plan.is_active ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Billing Rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={billingSettings.allow_pause} onChange={(e) => setBillingSettings(prev => ({ ...prev, allow_pause: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Allow Membership Pause</span>
                <span className="text-xs text-gray-500">Members can pause billing temporarily</span>
              </div>
            </label>
            {billingSettings.allow_pause && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Pause Duration (days)</label>
                <input
                  type="number"
                  value={billingSettings.max_pause_days}
                  onChange={(e) => setBillingSettings(prev => ({ ...prev, max_pause_days: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            )}
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={billingSettings.allow_downgrade} onChange={(e) => setBillingSettings(prev => ({ ...prev, allow_downgrade: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Allow Downgrade</span>
                <span className="text-xs text-gray-500">Members can switch to a lower tier</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={billingSettings.prorate_changes} onChange={(e) => setBillingSettings(prev => ({ ...prev, prorate_changes: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Prorate Plan Changes</span>
                <span className="text-xs text-gray-500">Adjust billing when changing plans mid-cycle</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="checkbox" checked={billingSettings.retry_failed_payments} onChange={(e) => setBillingSettings(prev => ({ ...prev, retry_failed_payments: e.target.checked }))} className="w-5 h-5" />
              <div>
                <span className="block font-medium">Retry Failed Payments</span>
                <span className="text-xs text-gray-500">Automatically retry declined charges</span>
              </div>
            </label>
            {billingSettings.retry_failed_payments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retry Attempts</label>
                <input
                  type="number"
                  value={billingSettings.retry_attempts}
                  onChange={(e) => setBillingSettings(prev => ({ ...prev, retry_attempts: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                  max="5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Save Membership Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
