'use client';

// ============================================================
// RISK & COMPLIANCE CENTER
// Monitor compliance gaps and high-risk issues
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface ComplianceIssue {
  id: string;
  category: 'consent' | 'chart' | 'inventory' | 'provider' | 'rule';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedCount: number;
  actionUrl: string;
  actionLabel: string;
}

export default function RiskCompliancePage() {
  const [issues] = useState<ComplianceIssue[]>([
    { id: 'i1', category: 'consent', severity: 'critical', title: 'Missing HIPAA Acknowledgments', description: '3 clients have appointments today without signed HIPAA forms', affectedCount: 3, actionUrl: '/admin/clients', actionLabel: 'View Clients' },
    { id: 'i2', category: 'chart', severity: 'warning', title: 'Incomplete Charts', description: '5 charts from last week are missing required signatures', affectedCount: 5, actionUrl: '/admin/charts', actionLabel: 'View Charts' },
    { id: 'i3', category: 'inventory', severity: 'warning', title: 'Expiring Inventory', description: '2 products expire within 30 days', affectedCount: 2, actionUrl: '/admin/owner/inventory', actionLabel: 'View Inventory' },
    { id: 'i4', category: 'inventory', severity: 'critical', title: 'Expired Products', description: '1 expired product still in active inventory', affectedCount: 1, actionUrl: '/admin/owner/inventory', actionLabel: 'View Inventory' },
    { id: 'i5', category: 'provider', severity: 'info', title: 'Provider Approaching Limit', description: 'Ryan Kent at 45/50 daily Botox units', affectedCount: 1, actionUrl: '/admin/owner/users', actionLabel: 'View Provider' },
    { id: 'i6', category: 'rule', severity: 'warning', title: 'Rule Conflict Detected', description: 'VIP waiver conflicts with cancellation fee policy', affectedCount: 2, actionUrl: '/admin/owner/rules', actionLabel: 'View Rules' },
  ]);

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'consent', 'chart', 'inventory', 'provider', 'rule'];
  const categoryLabels: Record<string, string> = {
    consent: 'Missing Consents',
    chart: 'Incomplete Charts',
    inventory: 'Inventory Issues',
    provider: 'Provider Compliance',
    rule: 'Rule Conflicts',
  };

  const filteredIssues = issues.filter(issue => {
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && issue.category !== filterCategory) return false;
    return true;
  });

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consent': return '📝';
      case 'chart': return '📋';
      case 'inventory': return '📦';
      case 'provider': return '👤';
      case 'rule': return '⚖️';
      default: return '⚠️';
    }
  };

  return (
    <OwnerLayout title="Risk & Compliance Center" description="Monitor compliance gaps and high-risk issues">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl mb-6 ${
        criticalCount > 0 ? 'bg-red-100 border-2 border-red-300' :
        warningCount > 0 ? 'bg-amber-100 border-2 border-amber-300' :
        'bg-green-100 border-2 border-green-300'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {criticalCount > 0 ? '🔴' : warningCount > 0 ? '🟡' : '🟢'}
          </span>
          <div>
            <h2 className={`font-bold ${
              criticalCount > 0 ? 'text-red-800' :
              warningCount > 0 ? 'text-amber-800' :
              'text-green-800'
            }`}>
              {criticalCount > 0 ? `${criticalCount} Critical Issue${criticalCount > 1 ? 's' : ''} Require Attention` :
               warningCount > 0 ? `${warningCount} Warning${warningCount > 1 ? 's' : ''} to Review` :
               'All Systems Compliant'}
            </h2>
            <p className={`text-sm ${
              criticalCount > 0 ? 'text-red-600' :
              warningCount > 0 ? 'text-amber-600' :
              'text-green-600'
            }`}>
              {criticalCount > 0 ? 'Critical issues may block operations or create liability' :
               warningCount > 0 ? 'Warnings should be addressed soon' :
               'No compliance gaps detected'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <button onClick={() => setFilterSeverity('all')} className={`p-4 rounded-xl border text-left ${filterSeverity === 'all' ? 'border-purple-500 bg-purple-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">Total Issues</p>
          <p className="text-2xl font-bold">{issues.length}</p>
        </button>
        <button onClick={() => setFilterSeverity('critical')} className={`p-4 rounded-xl border text-left ${filterSeverity === 'critical' ? 'border-red-500 bg-red-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🔴 Critical</p>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
        </button>
        <button onClick={() => setFilterSeverity('warning')} className={`p-4 rounded-xl border text-left ${filterSeverity === 'warning' ? 'border-amber-500 bg-amber-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🟡 Warnings</p>
          <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
        </button>
        <button onClick={() => setFilterSeverity('info')} className={`p-4 rounded-xl border text-left ${filterSeverity === 'info' ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
          <p className="text-sm text-gray-500">🔵 Info</p>
          <p className="text-2xl font-bold text-blue-600">{issues.filter(i => i.severity === 'info').length}</p>
        </button>
        <div className="p-4 rounded-xl border bg-white">
          <p className="text-sm text-gray-500">Last Scan</p>
          <p className="text-lg font-bold text-green-600">Just now</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filterCategory === cat ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Categories' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">⚠️ Active Issues</h2>
          <p className="text-xs text-gray-500">Click an issue to take action</p>
        </div>
        <div className="divide-y">
          {filteredIssues.map(issue => (
            <div key={issue.id} className={`p-4 hover:bg-gray-50 ${
              issue.severity === 'critical' ? 'border-l-4 border-l-red-500' :
              issue.severity === 'warning' ? 'border-l-4 border-l-amber-500' :
              'border-l-4 border-l-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{issue.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Affected: {issue.affectedCount} item{issue.affectedCount > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <a
                  href={issue.actionUrl}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    issue.severity === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                    issue.severity === 'warning' ? 'bg-amber-600 text-white hover:bg-amber-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {issue.actionLabel}
                </a>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-3">✅</span>
              <p className="text-gray-500">No issues match your filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Summary by Category */}
      <div className="mt-6 grid grid-cols-5 gap-4">
        {categories.filter(c => c !== 'all').map(category => {
          const catIssues = issues.filter(i => i.category === category);
          const hasCritical = catIssues.some(i => i.severity === 'critical');
          const hasWarning = catIssues.some(i => i.severity === 'warning');
          return (
            <div key={category} className={`p-4 rounded-xl border ${
              hasCritical ? 'bg-red-50 border-red-200' :
              hasWarning ? 'bg-amber-50 border-amber-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span>{getCategoryIcon(category)}</span>
                <span className="font-medium text-sm">{categoryLabels[category]}</span>
              </div>
              <p className={`text-lg font-bold ${
                hasCritical ? 'text-red-600' :
                hasWarning ? 'text-amber-600' :
                'text-green-600'
              }`}>
                {catIssues.length === 0 ? '✓ Clear' : `${catIssues.length} Issue${catIssues.length > 1 ? 's' : ''}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Export */}
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
          📥 Export Compliance Report
        </button>
      </div>
    </OwnerLayout>
  );
}
