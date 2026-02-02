'use client';

// ============================================================
// MEMBERSHIP PLAN BUILDER - Create Membership Tiers Without Code
// Define benefits, pricing, and rules
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface MembershipBenefit {
  id: string;
  type: 'discount' | 'free_service' | 'units' | 'priority' | 'custom';
  description: string;
  value?: number;
  service_id?: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  billing_period: 'monthly' | 'quarterly' | 'annual';
  benefits: MembershipBenefit[];
  is_active: boolean;
  is_featured: boolean;
  color: string;
  member_count?: number;
}

const DEFAULT_PLANS: MembershipPlan[] = [
  {
    id: 'plan-bronze',
    name: 'Bronze',
    description: 'Perfect for occasional visits',
    price_cents: 4900,
    billing_period: 'monthly',
    benefits: [
      { id: 'b1', type: 'discount', description: '10% off all services', value: 10 },
      { id: 'b2', type: 'priority', description: 'Priority booking' },
    ],
    is_active: true,
    is_featured: false,
    color: '#CD7F32',
    member_count: 45,
  },
  {
    id: 'plan-silver',
    name: 'Silver',
    description: 'Our most popular plan',
    price_cents: 9900,
    billing_period: 'monthly',
    benefits: [
      { id: 'b1', type: 'discount', description: '15% off all services', value: 15 },
      { id: 'b2', type: 'units', description: '10 units of Botox included', value: 10 },
      { id: 'b3', type: 'priority', description: 'Priority booking' },
      { id: 'b4', type: 'free_service', description: 'Free monthly B12 injection' },
    ],
    is_active: true,
    is_featured: true,
    color: '#C0C0C0',
    member_count: 128,
  },
  {
    id: 'plan-gold',
    name: 'Gold',
    description: 'VIP experience with maximum benefits',
    price_cents: 19900,
    billing_period: 'monthly',
    benefits: [
      { id: 'b1', type: 'discount', description: '20% off all services', value: 20 },
      { id: 'b2', type: 'units', description: '20 units of Botox included', value: 20 },
      { id: 'b3', type: 'free_service', description: 'Monthly facial included' },
      { id: 'b4', type: 'free_service', description: 'Free IV therapy quarterly' },
      { id: 'b5', type: 'priority', description: 'VIP priority booking' },
      { id: 'b6', type: 'custom', description: 'Complimentary product samples' },
    ],
    is_active: true,
    is_featured: false,
    color: '#FFD700',
    member_count: 34,
  },
];

const BENEFIT_TYPES = [
  { value: 'discount', label: 'Percentage Discount', icon: '%' },
  { value: 'units', label: 'Included Units', icon: '💉' },
  { value: 'free_service', label: 'Free Service', icon: '🎁' },
  { value: 'priority', label: 'Priority Booking', icon: '⭐' },
  { value: 'custom', label: 'Custom Benefit', icon: '✨' },
];

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(DEFAULT_PLANS);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewPlan = () => {
    const newPlan: MembershipPlan = {
      id: `plan-${Date.now()}`,
      name: '',
      description: '',
      price_cents: 0,
      billing_period: 'monthly',
      benefits: [],
      is_active: true,
      is_featured: false,
      color: '#EC4899',
      member_count: 0,
    };
    setEditingPlan(newPlan);
    setIsCreating(true);
  };

  const savePlan = () => {
    if (!editingPlan?.name) {
      setMessage({ type: 'error', text: 'Plan name is required' });
      return;
    }

    if (isCreating) {
      setPlans(prev => [...prev, editingPlan]);
      setMessage({ type: 'success', text: 'Plan created!' });
    } else {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
      setMessage({ type: 'success', text: 'Plan updated!' });
    }

    setEditingPlan(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const addBenefit = (type: string) => {
    if (!editingPlan) return;
    const newBenefit: MembershipBenefit = {
      id: `benefit-${Date.now()}`,
      type: type as any,
      description: '',
    };
    setEditingPlan({
      ...editingPlan,
      benefits: [...editingPlan.benefits, newBenefit],
    });
  };

  const updateBenefit = (benefitId: string, updates: Partial<MembershipBenefit>) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: editingPlan.benefits.map(b => b.id === benefitId ? { ...b, ...updates } : b),
    });
  };

  const removeBenefit = (benefitId: string) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: editingPlan.benefits.filter(b => b.id !== benefitId),
    });
  };

  const toggleActive = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Membership Plans</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Plans</h1>
          <p className="text-gray-500">Create and manage membership tiers</p>
        </div>
        {!editingPlan && (
          <button onClick={createNewPlan} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            + Create Plan
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Editor */}
      {editingPlan ? (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create Membership Plan' : 'Edit Plan'}</h2>
            <button onClick={() => { setEditingPlan(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
              <input
                type="text"
                value={editingPlan.name}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Gold Membership"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={editingPlan.color}
                onChange={(e) => setEditingPlan({ ...editingPlan, color: e.target.value })}
                className="w-full h-10 border rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={editingPlan.description}
              onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Short description of this plan"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={(editingPlan.price_cents / 100).toFixed(0)}
                onChange={(e) => setEditingPlan({ ...editingPlan, price_cents: parseFloat(e.target.value) * 100 || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
              <select
                value={editingPlan.billing_period}
                onChange={(e) => setEditingPlan({ ...editingPlan, billing_period: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Benefits</label>
              <div className="flex gap-2">
                {BENEFIT_TYPES.map(bt => (
                  <button
                    key={bt.value}
                    onClick={() => addBenefit(bt.value)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    title={bt.label}
                  >
                    {bt.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {editingPlan.benefits.map(benefit => (
                <div key={benefit.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span>{BENEFIT_TYPES.find(t => t.value === benefit.type)?.icon}</span>
                  <input
                    type="text"
                    value={benefit.description}
                    onChange={(e) => updateBenefit(benefit.id, { description: e.target.value })}
                    className="flex-1 px-3 py-1.5 border rounded text-sm"
                    placeholder="Benefit description"
                  />
                  {(benefit.type === 'discount' || benefit.type === 'units') && (
                    <input
                      type="number"
                      value={benefit.value || ''}
                      onChange={(e) => updateBenefit(benefit.id, { value: parseInt(e.target.value) })}
                      className="w-20 px-3 py-1.5 border rounded text-sm"
                      placeholder={benefit.type === 'discount' ? '%' : 'Units'}
                    />
                  )}
                  <button onClick={() => removeBenefit(benefit.id)} className="text-red-500 hover:text-red-700">🗑</button>
                </div>
              ))}
              {editingPlan.benefits.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Click icons above to add benefits</p>
              )}
            </div>
          </div>

          <div className="flex gap-6 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingPlan.is_featured}
                onChange={(e) => setEditingPlan({ ...editingPlan, is_featured: e.target.checked })}
              />
              <span className="text-sm">Featured plan</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingPlan.is_active}
                onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingPlan(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={savePlan} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        /* Plans Grid */
        <div className="grid grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border overflow-hidden ${plan.is_featured ? 'ring-2 ring-pink-500' : ''}`}
            >
              <div className="h-2" style={{ backgroundColor: plan.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    {plan.is_featured && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Most Popular</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>

                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.price_cents)}</span>
                  <span className="text-gray-500">/{plan.billing_period}</span>
                </div>

                <div className="mt-4 space-y-2">
                  {plan.benefits.slice(0, 4).map(b => (
                    <div key={b.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {b.description}
                    </div>
                  ))}
                  {plan.benefits.length > 4 && (
                    <p className="text-xs text-gray-400">+{plan.benefits.length - 4} more benefits</p>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-4">{plan.member_count || 0} active members</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <button onClick={() => setEditingPlan(plan)} className="text-sm text-pink-600 hover:text-pink-700">Edit</button>
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
      )}
    </div>
  );
}
