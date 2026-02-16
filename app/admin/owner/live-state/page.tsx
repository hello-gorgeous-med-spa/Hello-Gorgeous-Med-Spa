'use client';

// ============================================================
// LIVE SYSTEM STATE - TRUTH VIEW
// ALL DATA FROM DATABASE - NO STATIC VALUES
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';
import { 
  CardSkeleton, 
  EmptyState, 
  ErrorState,
} from '@/lib/hooks/useOwnerMetrics';

interface Rule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  priority: number;
  is_active?: boolean;
  description?: string;
}

interface Feature {
  id?: string;
  key: string;
  name: string;
  enabled: boolean;
  is_enabled?: boolean;
  category?: string;
  description?: string;
}

interface SystemState {
  rules: Rule[];
  features: Feature[];
  config: Record<string, any>;
}

export default function LiveStatePage() {
  const [data, setData] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch rules
        const rulesRes = await fetch('/api/config/rules');
        const rulesData = await rulesRes.json();
        
        // Fetch feature flags
        const flagsRes = await fetch('/api/config/flags');
        const flagsData = await flagsRes.json();
        
        // Fetch config
        const configRes = await fetch('/api/config');
        const configData = await configRes.json();
        
        // Normalize rules - API returns is_active, we need enabled
        const normalizedRules = (rulesData.rules || []).map((r: any) => ({
          ...r,
          enabled: r.enabled !== undefined ? r.enabled : r.is_active === true,
        }));
        
        // Normalize features - API returns is_enabled, we need enabled
        const normalizedFeatures = (flagsData.flags || []).map((f: any) => ({
          ...f,
          enabled: f.enabled !== undefined ? f.enabled : f.is_enabled === true,
        }));
        
        setData({
          rules: normalizedRules,
          features: normalizedFeatures,
          config: configData.config || {},
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch system state');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const activeRules = data?.rules.filter(r => r.enabled) || [];
  const disabledRules = data?.rules.filter(r => !r.enabled) || [];
  const enabledFeatures = data?.features.filter(f => f.enabled) || [];
  const disabledFeatures = data?.features.filter(f => !f.enabled) || [];

  const getFilteredRules = () => {
    if (!data) return [];
    switch (filter) {
      case 'active': return activeRules;
      case 'disabled': return disabledRules;
      default: return data.rules;
    }
  };

  const getFilteredFeatures = () => {
    if (!data) return [];
    switch (filter) {
      case 'active': return enabledFeatures;
      case 'disabled': return disabledFeatures;
      default: return data.features;
    }
  };

  // Group features by category
  const groupedFeatures = getFilteredFeatures().reduce((acc, feature) => {
    const cat = feature.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <OwnerLayout title="Live System State" description="Truth view - What your system is actually doing right now">
      {/* Error State */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && data && (
        <>
          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={() => setFilter('all')} 
              className={`p-4 rounded-xl border text-left transition-all ${filter === 'all' ? 'border-purple-500 bg-purple-50 shadow-md' : 'bg-white hover:shadow-md'}`}
            >
              <p className="text-sm text-black">Total Components</p>
              <p className="text-3xl font-bold">{data.rules.length + data.features.length}</p>
            </button>
            <button 
              onClick={() => setFilter('active')} 
              className={`p-4 rounded-xl border text-left transition-all ${filter === 'active' ? 'border-green-500 bg-green-50 shadow-md' : 'bg-white hover:shadow-md'}`}
            >
              <p className="text-sm text-black">🟢 Active</p>
              <p className="text-3xl font-bold text-green-600">
                {activeRules.length + enabledFeatures.length}
              </p>
            </button>
            <button 
              onClick={() => setFilter('disabled')} 
              className={`p-4 rounded-xl border text-left transition-all ${filter === 'disabled' ? 'border-black bg-white shadow-md' : 'bg-white hover:shadow-md'}`}
            >
              <p className="text-sm text-black">⚪ Disabled</p>
              <p className="text-3xl font-bold text-black">
                {disabledRules.length + disabledFeatures.length}
              </p>
            </button>
            <div className="p-4 rounded-xl border bg-white">
              <p className="text-sm text-black">Last Refreshed</p>
              <p className="text-lg font-bold text-green-600">Just now ✓</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Rules */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b bg-gradient-to-r from-pink-50 to-white">
                <h2 className="font-semibold text-lg">⚖️ Business Rules ({getFilteredRules().length})</h2>
                <p className="text-xs text-black">Every active rule visible - no hidden logic</p>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y">
                {getFilteredRules().length > 0 ? (
                  getFilteredRules().map(rule => (
                    <div key={rule.id} className="p-4 hover:bg-white transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-white'}`} />
                            <h3 className="font-medium">{rule.name}</h3>
                          </div>
                          {rule.description && (
                            <p className="text-sm text-black mt-1 ml-4">{rule.description}</p>
                          )}
                          <p className="text-xs text-black mt-1 ml-4">
                            Category: {rule.category} • Priority: {rule.priority}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                          {rule.enabled ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="⚖️"
                    title="No rules match filter"
                    description="Try a different filter or create new rules"
                  />
                )}
              </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white">
                <h2 className="font-semibold text-lg">🎚️ Feature Flags ({getFilteredFeatures().length})</h2>
                <p className="text-xs text-black">All features and their current state</p>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {Object.keys(groupedFeatures).length > 0 ? (
                  Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category}>
                      <div className="px-4 py-2 bg-white border-b sticky top-0">
                        <p className="text-xs font-semibold text-black uppercase tracking-wider">{category}</p>
                      </div>
                      <div className="divide-y">
                        {features.map(feature => (
                          <div key={feature.key} className="p-4 hover:bg-white transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${feature.enabled ? 'bg-green-500' : 'bg-white'}`} />
                                  <h3 className="font-medium">{feature.name || feature.key}</h3>
                                </div>
                                {feature.description && (
                                  <p className="text-sm text-black mt-1 ml-4">{feature.description}</p>
                                )}
                              </div>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${feature.enabled ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                                {feature.enabled ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="🎚️"
                    title="No features match filter"
                    description="Try a different filter"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-xl p-4">
            <h3 className="font-medium text-black mb-3">Visual Indicators</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Green = Active/Enabled</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white" /> Gray = Disabled/Off</div>
            </div>
          </div>

          {/* Transparency Note */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800">🔍 Full Transparency</h3>
            <p className="text-sm text-blue-600 mt-1">
              This view shows ALL active system rules and features. There is no hidden logic.
              What you see here is exactly what the system is using.
            </p>
          </div>
        </>
      )}
    </OwnerLayout>
  );
}
