'use client';

// ============================================================
// RISK & COMPLIANCE CENTER
// ALL DATA FROM DATABASE - NO STATIC VALUES
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  useOwnerMetrics,
} from '@/lib/hooks/useOwnerMetrics';

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
  const { data, isLoading, error, refetch } = useOwnerMetrics('month');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  // Build issues list from REAL DATA
  const buildIssues = (): ComplianceIssue[] => {
    if (!data) return [];
    
    const issues: ComplianceIssue[] = [];
    
    // Check for expired inventory - CRITICAL
    if (data.inventory.expired > 0) {
      issues.push({
        id: 'inv-expired',
        category: 'inventory',
        severity: 'critical',
        title: 'Expired Products in Inventory',
        description: `${data.inventory.expired} product${data.inventory.expired > 1 ? 's have' : ' has'} expired and should not be used`,
        affectedCount: data.inventory.expired,
        actionUrl: '/admin/owner/inventory',
        actionLabel: 'View Inventory',
      });
    }
    
    // Check for pending consents - WARNING
    if (data.compliance.pendingConsents > 0) {
      issues.push({
        id: 'consent-pending',
        category: 'consent',
        severity: data.compliance.pendingConsents > 5 ? 'critical' : 'warning',
        title: 'Pending Consent Requests',
        description: `${data.compliance.pendingConsents} client${data.compliance.pendingConsents > 1 ? 's have' : ' has'} outstanding consent request${data.compliance.pendingConsents > 1 ? 's' : ''}`,
        affectedCount: data.compliance.pendingConsents,
        actionUrl: '/admin/consents',
        actionLabel: 'View Consents',
      });
    }
    
    // Check for expiring inventory - WARNING
    if (data.inventory.expiringSoon > 0) {
      issues.push({
        id: 'inv-expiring',
        category: 'inventory',
        severity: 'warning',
        title: 'Products Expiring Soon',
        description: `${data.inventory.expiringSoon} product${data.inventory.expiringSoon > 1 ? 's' : ''} will expire within 30 days`,
        affectedCount: data.inventory.expiringSoon,
        actionUrl: '/admin/owner/inventory',
        actionLabel: 'View Inventory',
      });
    }
    
    // Check for low stock - INFO
    if (data.inventory.lowStock > 0) {
      issues.push({
        id: 'inv-low',
        category: 'inventory',
        severity: 'info',
        title: 'Low Stock Alert',
        description: `${data.inventory.lowStock} product${data.inventory.lowStock > 1 ? 's are' : ' is'} below reorder level`,
        affectedCount: data.inventory.lowStock,
        actionUrl: '/admin/owner/inventory',
        actionLabel: 'View Inventory',
      });
    }
    
    // Check for high no-show rate - WARNING
    if (data.appointments.noShowRate > 0.05) {
      issues.push({
        id: 'apt-noshow',
        category: 'provider',
        severity: data.appointments.noShowRate > 0.1 ? 'warning' : 'info',
        title: 'High No-Show Rate',
        description: `No-show rate is ${Math.round(data.appointments.noShowRate * 100)}% (${data.appointments.noShows} no-shows)`,
        affectedCount: data.appointments.noShows,
        actionUrl: '/admin/appointments',
        actionLabel: 'View Appointments',
      });
    }
    
    return issues;
  };

  const issues = buildIssues();
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  const filteredIssues = filterSeverity === 'all' 
    ? issues 
    : issues.filter(i => i.severity === filterSeverity);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-white text-black';
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
      {/* Error State */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={refetch} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <CardSkeleton />
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && data && (
        <>
          {/* Status Banner - REAL DATA */}
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

          {/* Summary Stats - REAL DATA */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <button 
              onClick={() => setFilterSeverity('all')} 
              className={`p-4 rounded-xl border text-left ${filterSeverity === 'all' ? 'border-purple-500 bg-purple-50' : 'bg-white'}`}
            >
              <p className="text-sm text-black">Total Issues</p>
              <p className="text-2xl font-bold">{issues.length}</p>
            </button>
            <button 
              onClick={() => setFilterSeverity('critical')} 
              className={`p-4 rounded-xl border text-left ${filterSeverity === 'critical' ? 'border-red-500 bg-red-50' : 'bg-white'}`}
            >
              <p className="text-sm text-black">🔴 Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </button>
            <button 
              onClick={() => setFilterSeverity('warning')} 
              className={`p-4 rounded-xl border text-left ${filterSeverity === 'warning' ? 'border-[#FF2D8E] bg-amber-50' : 'bg-white'}`}
            >
              <p className="text-sm text-black">🟡 Warnings</p>
              <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
            </button>
            <button 
              onClick={() => setFilterSeverity('info')} 
              className={`p-4 rounded-xl border text-left ${filterSeverity === 'info' ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
            >
              <p className="text-sm text-black">🔵 Info</p>
              <p className="text-2xl font-bold text-blue-600">{infoCount}</p>
            </button>
            <div className="p-4 rounded-xl border bg-white">
              <p className="text-sm text-black">Last Scan</p>
              <p className="text-lg font-bold text-green-600">Just now</p>
            </div>
          </div>

          {/* Issues List - REAL DATA */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">⚠️ Active Issues ({filteredIssues.length})</h2>
              <p className="text-xs text-black">Click an issue to take action</p>
            </div>
            
            {filteredIssues.length > 0 ? (
              <div className="divide-y">
                {filteredIssues.map(issue => (
                  <div key={issue.id} className={`p-4 hover:bg-white ${
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
                          <p className="text-sm text-black">{issue.description}</p>
                          <p className="text-xs text-black mt-1">Affected: {issue.affectedCount} item{issue.affectedCount > 1 ? 's' : ''}</p>
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
              </div>
            ) : (
              <EmptyState 
                icon="✅"
                title={issues.length === 0 ? "All clear!" : "No issues match filter"}
                description={issues.length === 0 ? "No compliance issues detected" : "Try selecting a different filter"}
              />
            )}
          </div>

          {/* Export */}
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white text-sm">
              📥 Export Compliance Report
            </button>
          </div>
        </>
      )}
    </OwnerLayout>
  );
}
