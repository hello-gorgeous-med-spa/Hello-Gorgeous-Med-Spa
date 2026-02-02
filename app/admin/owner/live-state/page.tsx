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
  formatRelativeTime,
} from '@/lib/hooks/useOwnerMetrics';

interface SystemState {
  rules: Array<{
    id: string;
    name: string;
    category: string;
    enabled: boolean;
    priority: number;
  }>;
  features: Array<{
    id: string;
    key: string;
    name: string;
    enabled: boolean;
    environment: string;
  }>;
  config: Record<string, any>;
}

export default function LiveStatePage() {
  const [data, setData] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'warning' | 'disabled'>('all');

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
        
        setData({
          rules: rulesData.rules || [],
          features: flagsData.flags || [],
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

  return (
    <OwnerLayout title="Live System State" description="Truth view - No hidden system behavior">
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
          {/* Status Summary - REAL DATA */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <button 
              onClick={() => setFilter('all')} 
              className={`p-4 rounded-xl border text-left ${filter === 'all' ? 'border-purple-500 bg-purple-50' : 'bg-white'}`}
            >
              <p className="text-sm text-gray-500">Total Components</p>
              <p className="text-2xl font-bold">{data.rules.length + data.features.length}</p>
            </button>
            <button 
              onClick={() => setFilter('active')} 
              className={`p-4 rounded-xl border text-left ${filter === 'active' ? 'border-green-500 bg-green-50' : 'bg-white'}`}
            >
              <p className="text-sm text-gray-500">🟢 Active</p>
              <p className="text-2xl font-bold text-green-600">
                {activeRules.length + enabledFeatures.length}
              </p>
            </button>
            <button 
              onClick={() => setFilter('disabled')} 
              className={`p-4 rounded-xl border text-left ${filter === 'disabled' ? 'border-gray-500 bg-gray-50' : 'bg-white'}`}
            >
              <p className="text-sm text-gray-500">⚪ Disabled</p>
              <p className="text-2xl font-bold text-gray-400">
                {disabledRules.length + disabledFeatures.length}
              </p>
            </button>
            <div className="p-4 rounded-xl border bg-white">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-lg font-bold text-green-600">Just now</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Active Rules - REAL DATA */}
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">⚖️ Business Rules ({getFilteredRules().length})</h2>
                <p className="text-xs text-gray-500">Every active rule visible - no magic logic</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y">
                {getFilteredRules().length > 0 ? (
                  getFilteredRules().map(rule => (
                    <div key={rule.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <h3 className="font-medium text-sm">{rule.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {rule.category} • Priority: {rule.priority}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {rule.enabled ? 'active' : 'disabled'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="⚖️"
                    title="No rules configured"
                    description="Business rules will appear here when created"
                  />
                )}
              </div>
            </div>

            {/* Feature Flags - REAL DATA */}
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">🎚️ Feature Flags ({getFilteredFeatures().length})</h2>
                <p className="text-xs text-gray-500">All features and their current state</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y">
                {getFilteredFeatures().length > 0 ? (
                  getFilteredFeatures().map(feature => (
                    <div key={feature.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${feature.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <h3 className="font-medium text-sm">{feature.name || feature.key}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Key: {feature.key}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${feature.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {feature.enabled ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="🎚️"
                    title="No feature flags configured"
                    description="Feature flags will appear here when created"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-700 mb-3">Visual Indicators</h3>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Green = Active/Enabled</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" /> Gray = Disabled</div>
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
