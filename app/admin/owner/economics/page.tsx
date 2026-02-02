'use client';

// ============================================================
// REVENUE & ECONOMICS CONTROL
// Pricing, commissions, margins, and profitability
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface ServiceEconomics {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  cost: number;
  margin: number;
  marginPct: number;
}

interface ProviderEconomics {
  id: string;
  name: string;
  revenue: number;
  commission: number;
  commissionRate: number;
  profit: number;
}

export default function EconomicsPage() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'commissions' | 'profitability'>('pricing');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pricing Versions
  const [pricingVersions, setPricingVersions] = useState([
    { id: 'v1', name: 'Current Pricing', effectiveDate: '2025-01-01', status: 'active' },
    { id: 'v2', name: 'Spring 2025 Pricing', effectiveDate: '2025-03-15', status: 'scheduled' },
    { id: 'v3', name: 'Summer 2025 Pricing', effectiveDate: '2025-06-01', status: 'draft' },
  ]);

  // Time-Based Pricing Rules
  const [timePricing, setTimePricing] = useState([
    { id: 't1', name: 'Weekend Markup', condition: 'Saturday, Sunday', adjustment: '+10%', enabled: true },
    { id: 't2', name: 'Evening Markup', condition: 'After 6PM', adjustment: '+$15', enabled: false },
    { id: 't3', name: 'Holiday Markup', condition: 'Federal Holidays', adjustment: '+15%', enabled: true },
    { id: 't4', name: 'Off-Peak Discount', condition: 'Tuesday 10AM-2PM', adjustment: '-10%', enabled: true },
  ]);

  // Service Economics
  const [serviceEconomics] = useState<ServiceEconomics[]>([
    { id: 's1', name: 'Botox (per unit)', category: 'Injectables', currentPrice: 14, cost: 6, margin: 8, marginPct: 57 },
    { id: 's2', name: 'Juvederm Voluma', category: 'Fillers', currentPrice: 850, cost: 400, margin: 450, marginPct: 53 },
    { id: 's3', name: 'HydraFacial', category: 'Facials', currentPrice: 199, cost: 45, margin: 154, marginPct: 77 },
    { id: 's4', name: 'Laser Hair Removal', category: 'Laser', currentPrice: 150, cost: 20, margin: 130, marginPct: 87 },
    { id: 's5', name: 'Microneedling', category: 'Skin', currentPrice: 350, cost: 75, margin: 275, marginPct: 79 },
  ]);

  // Provider Economics
  const [providerEconomics] = useState<ProviderEconomics[]>([
    { id: 'p1', name: 'Ryan Kent', revenue: 45000, commission: 13500, commissionRate: 30, profit: 31500 },
    { id: 'p2', name: 'Danielle Alcala', revenue: 52000, commission: 15600, commissionRate: 30, profit: 36400 },
  ]);

  // Commission Settings
  const [commissionRules, setCommissionRules] = useState({
    defaultRate: 30,
    injectableRate: 30,
    facialRate: 25,
    laserRate: 20,
    productSalesRate: 10,
    tieredCommission: true,
    tiers: [
      { threshold: 0, rate: 30 },
      { threshold: 30000, rate: 32 },
      { threshold: 50000, rate: 35 },
    ],
  });

  // Revenue Alerts
  const [alerts] = useState([
    { id: 'a1', type: 'warning', message: 'Botox margin below target (target: 60%, current: 57%)', service: 'Botox' },
    { id: 'a2', type: 'info', message: 'Spring pricing goes live in 41 days', date: '2025-03-15' },
  ]);

  const toggleTimePricing = (id: string) => {
    setTimePricing(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Economics settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Revenue & Economics Control" description="Pricing, commissions, and profitability">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2 mb-6">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg flex items-center gap-3 ${
              alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <span>{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <span className={`text-sm ${alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b mb-6">
        {[
          { id: 'pricing', label: 'Pricing Versions' },
          { id: 'commissions', label: 'Provider Commissions' },
          { id: 'profitability', label: 'Profitability' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRICING TAB */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Pricing Versions */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">📅 Pricing Versions (Future-Dated)</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                + Create Version
              </button>
            </div>
            <div className="divide-y">
              {pricingVersions.map(version => (
                <div key={version.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{version.name}</h3>
                    <p className="text-sm text-gray-500">Effective: {version.effectiveDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      version.status === 'active' ? 'bg-green-100 text-green-700' :
                      version.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {version.status}
                    </span>
                    <button className="text-sm text-purple-600 hover:text-purple-700">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time-Based Pricing */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">⏰ Time-Based Pricing Rules</h2>
            </div>
            <div className="divide-y">
              {timePricing.map(rule => (
                <div key={rule.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-500">{rule.condition} • {rule.adjustment}</p>
                  </div>
                  <button
                    onClick={() => toggleTimePricing(rule.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMMISSIONS TAB */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          {/* Commission Rules */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">💰 Commission Formulas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Rate (%)</label>
                <input
                  type="number"
                  value={commissionRules.defaultRate}
                  onChange={(e) => setCommissionRules(prev => ({ ...prev, defaultRate: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Injectables Rate (%)</label>
                <input
                  type="number"
                  value={commissionRules.injectableRate}
                  onChange={(e) => setCommissionRules(prev => ({ ...prev, injectableRate: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facial Rate (%)</label>
                <input
                  type="number"
                  value={commissionRules.facialRate}
                  onChange={(e) => setCommissionRules(prev => ({ ...prev, facialRate: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Sales Rate (%)</label>
                <input
                  type="number"
                  value={commissionRules.productSalesRate}
                  onChange={(e) => setCommissionRules(prev => ({ ...prev, productSalesRate: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Tiered Commission */}
            <div className="mt-6">
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={commissionRules.tieredCommission}
                  onChange={(e) => setCommissionRules(prev => ({ ...prev, tieredCommission: e.target.checked }))}
                  className="w-5 h-5"
                />
                <span className="font-medium">Enable Tiered Commission</span>
              </label>
              {commissionRules.tieredCommission && (
                <div className="space-y-2">
                  {commissionRules.tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Revenue ≥ ${tier.threshold.toLocaleString()}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{tier.rate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Provider Commission Summary */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">👤 Provider Commission (This Month)</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">PROVIDER</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">REVENUE</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">RATE</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">COMMISSION</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">PROFIT</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {providerEconomics.map(provider => (
                  <tr key={provider.id}>
                    <td className="px-4 py-3 font-medium">{provider.name}</td>
                    <td className="px-4 py-3 text-right">${provider.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{provider.commissionRate}%</td>
                    <td className="px-4 py-3 text-right text-red-600">-${provider.commission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">${provider.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROFITABILITY TAB */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          {/* Profit by Service */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">📊 Profit per Service</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">SERVICE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">CATEGORY</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">PRICE</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">COST</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">MARGIN</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">MARGIN %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {serviceEconomics.map(service => (
                  <tr key={service.id}>
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3 text-gray-500">{service.category}</td>
                    <td className="px-4 py-3 text-right">${service.currentPrice}</td>
                    <td className="px-4 py-3 text-right text-gray-500">${service.cost}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">${service.margin}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-sm ${
                        service.marginPct >= 70 ? 'bg-green-100 text-green-700' :
                        service.marginPct >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {service.marginPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cost Attribution */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">📈 Margin Visibility</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-green-600">Average Margin</p>
                <p className="text-2xl font-bold text-green-700">71%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-blue-600">Total Revenue (MTD)</p>
                <p className="text-2xl font-bold text-blue-700">$97,000</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-purple-600">Net Profit (MTD)</p>
                <p className="text-2xl font-bold text-purple-700">$67,900</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
          Save Economics Settings
        </button>
      </div>

      {/* Access Note */}
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          <strong>🔒 Founder Only:</strong> Economics settings can only be modified by the Founder. Providers cannot alter pricing or commission rules.
        </p>
      </div>
    </OwnerLayout>
  );
}
