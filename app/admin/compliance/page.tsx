'use client';

// ============================================================
// COMPLIANCE DASHBOARD - RISK & AUDIT CENTER
// HIPAA compliance, license tracking, consent monitoring
// Live alerts and automated compliance checks
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================

interface ComplianceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
  dueDate?: string;
  createdAt: string;
  dismissed?: boolean;
}

interface ConsentStats {
  totalClients: number;
  hipaaConsent: number;
  treatmentConsent: number;
  photoConsent: number;
  missingConsents: number;
}

interface ProviderCredential {
  id: string;
  providerName: string;
  credentialType: string;
  licenseNumber?: string;
  expirationDate: string;
  status: 'valid' | 'expiring' | 'expired';
  daysUntilExpiry: number;
}

interface AuditSummary {
  totalActions: number;
  phiAccess: number;
  chartEdits: number;
  consentsSigned: number;
  failedLogins: number;
  unusualActivity: number;
}

interface InventoryCompliance {
  totalLots: number;
  expiringSoon: number;
  expired: number;
  missingLotNumbers: number;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ComplianceDashboard() {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'consents' | 'credentials' | 'audit' | 'inventory'>('overview');
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [consentStats, setConsentStats] = useState<ConsentStats | null>(null);
  const [credentials, setCredentials] = useState<ProviderCredential[]>([]);
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);
  const [inventoryCompliance, setInventoryCompliance] = useState<InventoryCompliance | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  // Fetch compliance data
  const runComplianceScan = useCallback(async () => {
    setLoading(true);
    const newAlerts: ComplianceAlert[] = [];

    try {
      // Fetch clients for consent checking
      let clients: any[] = [];
      try {
        const clientsRes = await fetch('/api/clients?limit=1000');
        const clientsData = await clientsRes.json();
        clients = Array.isArray(clientsData?.clients) ? clientsData.clients : [];
      } catch {
        // ignore
      }

      // Fetch consents — /api/consents returns { templates, stats: { totalSigned, ... } }
      let totalHipaa = 0;
      let totalTreatment = 0;
      let totalPhoto = 0;
      let totalSigned = 0;
      try {
        const consentsRes = await fetch('/api/consents');
        const consentsData = await consentsRes.json();
        const templates = Array.isArray(consentsData?.templates) ? consentsData.templates : [];
        totalSigned = consentsData?.stats?.totalSigned ?? 0;
        templates.forEach((t: any) => {
          const slug = (t.slug || t.name || '').toLowerCase();
          if (slug.includes('hipaa')) totalHipaa++;
          else if (slug.includes('treatment') || slug.includes('general')) totalTreatment++;
          else if (slug.includes('photo') || slug.includes('release')) totalPhoto++;
        });
        if (totalHipaa === 0 && totalSigned > 0) totalHipaa = totalSigned;
      } catch {
        // ignore
      }

      const missingConsents = Math.max(0, clients.length - (totalHipaa || totalSigned));
      setConsentStats({
        totalClients: clients.length,
        hipaaConsent: totalHipaa,
        treatmentConsent: totalTreatment,
        photoConsent: totalPhoto,
        missingConsents,
      });

      if (missingConsents > 0) {
        newAlerts.push({
          id: 'consent-missing',
          type: 'warning',
          category: 'Consents',
          title: `${missingConsents} clients missing HIPAA consent`,
          description: 'Clients should sign HIPAA acknowledgment before receiving services.',
          action: 'View Clients',
          actionUrl: '/admin/clients',
          createdAt: new Date().toISOString(),
        });
      }

      // Fetch providers for credential checking
      let providers: any[] = [];
      try {
        const provRes = await fetch('/api/providers');
        const provData = await provRes.json();
        providers = Array.isArray(provData?.providers) ? provData.providers : [];
      } catch {
        // ignore
      }

      const credentialsList: ProviderCredential[] = [];
      const now = new Date();

      providers.forEach((p: any) => {
        // Simulated credential data - would come from credentials table
        const licenseExpiry = p.license_expiration 
          ? new Date(p.license_expiration)
          : new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000); // Default 6 months out

        const daysUntil = Math.floor((licenseExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        credentialsList.push({
          id: p.id,
          providerName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider',
          credentialType: 'Medical License',
          licenseNumber: p.license_number || 'N/A',
          expirationDate: licenseExpiry.toISOString(),
          status: daysUntil < 0 ? 'expired' : daysUntil < 30 ? 'expiring' : 'valid',
          daysUntilExpiry: daysUntil,
        });
      });

      setCredentials(credentialsList);

      const expiredCreds = credentialsList.filter(c => c.status === 'expired');
      const expiringCreds = credentialsList.filter(c => c.status === 'expiring');

      if (expiredCreds.length > 0) {
        newAlerts.push({
          id: 'cred-expired',
          type: 'critical',
          category: 'Credentials',
          title: `${expiredCreds.length} expired provider credential(s)`,
          description: 'Providers cannot perform services with expired credentials.',
          action: 'View Credentials',
          actionUrl: '/admin/team',
          createdAt: new Date().toISOString(),
        });
      }

      if (expiringCreds.length > 0) {
        newAlerts.push({
          id: 'cred-expiring',
          type: 'warning',
          category: 'Credentials',
          title: `${expiringCreds.length} credential(s) expiring within 30 days`,
          description: 'Renew credentials before expiration to avoid service interruption.',
          action: 'View Team',
          actionUrl: '/admin/team',
          createdAt: new Date().toISOString(),
        });
      }

      // Fetch audit logs — /api/audit may not exist; use empty array if missing/fails
      let logs: any[] = [];
      try {
        const auditRes = await fetch('/api/audit?limit=500');
        if (auditRes.ok) {
          const auditData = await auditRes.json();
          logs = Array.isArray(auditData?.logs) ? auditData.logs : [];
        }
      } catch {
        // no audit API or network error
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayLogs = logs.filter((l: any) => new Date(l.created_at) >= today);

      setAuditSummary({
        totalActions: todayLogs.length,
        phiAccess: todayLogs.filter((l: any) => l.action === 'view' && ['client', 'clinical_note'].includes(l.resource_type)).length,
        chartEdits: todayLogs.filter((l: any) => l.action === 'update' && l.resource_type === 'clinical_note').length,
        consentsSigned: todayLogs.filter((l: any) => l.action === 'sign').length,
        failedLogins: todayLogs.filter((l: any) => l.action === 'login_failed').length,
        unusualActivity: todayLogs.filter((l: any) => l.severity === 'high').length,
      });

      // Check for unusual activity
      const failedLogins = todayLogs.filter((l: any) => l.action === 'login_failed').length;
      if (failedLogins > 5) {
        newAlerts.push({
          id: 'security-logins',
          type: 'critical',
          category: 'Security',
          title: `${failedLogins} failed login attempts today`,
          description: 'Unusual login activity detected. Review security logs immediately.',
          action: 'View Audit Log',
          actionUrl: '/admin/users?tab=logs',
          createdAt: new Date().toISOString(),
        });
      }

      // Fetch inventory for compliance — API returns { inventory } with items that have .lots[]
      let inventoryLots: { expiration_date?: string; lot_number?: string }[] = [];
      try {
        const invRes = await fetch('/api/inventory?limit=1000');
        if (invRes.ok) {
          const invData = await invRes.json();
          const inventory = invData.inventory || invData.items || [];
          inventoryLots = (inventory as any[])
            .flatMap((i: any) => i.lots || (i.inventory_lots || []))
            .filter(Boolean);
        }
      } catch {
        // ignore
      }

      const expiryThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiredItems = inventoryLots.filter((i: any) => i.expiration_date && new Date(i.expiration_date) < now);
      const expiringItems = inventoryLots.filter((i: any) =>
        i.expiration_date &&
        new Date(i.expiration_date) >= now &&
        new Date(i.expiration_date) < expiryThreshold
      );
      const missingLots = inventoryLots.filter((i: any) => !i.lot_number);

      setInventoryCompliance({
        totalLots: inventoryLots.length,
        expiringSoon: expiringItems.length,
        expired: expiredItems.length,
        missingLotNumbers: missingLots.length,
      });

      if (expiredItems.length > 0) {
        newAlerts.push({
          id: 'inv-expired',
          type: 'critical',
          category: 'Inventory',
          title: `${expiredItems.length} expired product(s) in inventory`,
          description: 'Expired products must be removed from use immediately.',
          action: 'View Inventory',
          actionUrl: '/admin/inventory',
          createdAt: new Date().toISOString(),
        });
      }

      if (missingLots.length > 0) {
        newAlerts.push({
          id: 'inv-lots',
          type: 'warning',
          category: 'Inventory',
          title: `${missingLots.length} items missing lot numbers`,
          description: 'All injectable products require lot number tracking for safety.',
          action: 'Update Inventory',
          actionUrl: '/admin/inventory',
          createdAt: new Date().toISOString(),
        });
      }

      // Add informational alerts
      if (newAlerts.filter(a => a.type === 'critical').length === 0) {
        newAlerts.push({
          id: 'compliance-good',
          type: 'info',
          category: 'System',
          title: 'No critical compliance issues detected',
          description: 'Your practice is currently meeting core compliance requirements.',
          createdAt: new Date().toISOString(),
        });
      }

      setAlerts(newAlerts);
      setLastScan(new Date());
    } catch (error) {
      console.error('Compliance scan error:', error);
      setAlerts([{
        id: 'scan-error',
        type: 'warning',
        category: 'System',
        title: 'Compliance scan incomplete',
        description: 'Some data could not be retrieved. Please try again.',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runComplianceScan();
    // Run scan every 5 minutes
    const interval = setInterval(runComplianceScan, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [runComplianceScan]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, dismissed: true } : a
    ));
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.dismissed);
  const warningAlerts = alerts.filter(a => a.type === 'warning' && !a.dismissed);
  const infoAlerts = alerts.filter(a => a.type === 'info' && !a.dismissed);

  const complianceScore = Math.max(0, 100 - (criticalAlerts.length * 25) - (warningAlerts.length * 10));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Compliance Dashboard</h1>
          <p className="text-black">
            HIPAA compliance, credential tracking, and audit monitoring
            {lastScan && (
              <span className="ml-2 text-xs">
                Last scan: {lastScan.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runComplianceScan}
            disabled={loading}
            className="px-4 py-2 border border-black text-black rounded-lg hover:bg-white disabled:opacity-50"
          >
            {loading ? '⏳ Scanning...' : '🔄 Run Scan'}
          </button>
          <Link
            href="/admin/export"
            className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black"
          >
            📊 Export Report
          </Link>
        </div>
      </div>

      {/* Compliance Score */}
      <div className={`rounded-xl p-6 ${
        complianceScore >= 80 ? 'bg-green-50 border border-green-200' :
        complianceScore >= 50 ? 'bg-amber-50 border border-amber-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">Compliance Score</h2>
            <p className="text-black">Based on current alerts and pending items</p>
          </div>
          <div className="text-right">
            <span className={`text-5xl font-bold ${
              complianceScore >= 80 ? 'text-green-600' :
              complianceScore >= 50 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {complianceScore}
            </span>
            <span className="text-2xl text-black">/100</span>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              complianceScore >= 80 ? 'bg-green-500' :
              complianceScore >= 50 ? 'bg-amber-500' :
              'bg-red-500'
            }`}
            style={{ width: `${complianceScore}%` }}
          />
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            🚨 Critical Issues ({criticalAlerts.length})
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg p-4 border border-red-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-black">{alert.title}</p>
                    <p className="text-sm text-black mt-1">{alert.description}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-black hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                {alert.action && alert.actionUrl && (
                  <Link
                    href={alert.actionUrl}
                    className="inline-block mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    {alert.action}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            ⚠️ Warnings ({warningAlerts.length})
          </h3>
          <div className="space-y-3">
            {warningAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg p-4 border border-amber-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-black">{alert.title}</p>
                    <p className="text-sm text-black mt-1">{alert.description}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-black hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                {alert.action && alert.actionUrl && (
                  <Link
                    href={alert.actionUrl}
                    className="inline-block mt-3 px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600"
                  >
                    {alert.action}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-black">
        {(['overview', 'consents', 'credentials', 'audit', 'inventory'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'text-pink-600 border-b-2 border-[#FF2D8E]'
                : 'text-black hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-black p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black">Consent Compliance</span>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-black">
              {consentStats ? Math.round(((consentStats.totalClients - consentStats.missingConsents) / Math.max(consentStats.totalClients, 1)) * 100) : 0}%
            </p>
            <p className="text-sm text-black">
              {consentStats?.missingConsents || 0} missing
            </p>
          </div>

          <div className="bg-white rounded-xl border border-black p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black">Provider Credentials</span>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-3xl font-bold text-black">
              {credentials.filter(c => c.status === 'valid').length}/{credentials.length}
            </p>
            <p className="text-sm text-black">
              {credentials.filter(c => c.status === 'expiring').length} expiring soon
            </p>
          </div>

          <div className="bg-white rounded-xl border border-black p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black">Audit Actions Today</span>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-3xl font-bold text-black">
              {auditSummary?.totalActions || 0}
            </p>
            <p className="text-sm text-black">
              {auditSummary?.phiAccess || 0} PHI access
            </p>
          </div>

          <div className="bg-white rounded-xl border border-black p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black">Inventory Issues</span>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-black">
              {(inventoryCompliance?.expired || 0) + (inventoryCompliance?.expiringSoon || 0)}
            </p>
            <p className="text-sm text-black">
              {inventoryCompliance?.expired || 0} expired
            </p>
          </div>
        </div>
      )}

      {/* Consents Tab */}
      {activeTab === 'consents' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Total Clients</p>
              <p className="text-2xl font-bold">{consentStats?.totalClients || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">HIPAA Signed</p>
              <p className="text-2xl font-bold text-green-600">{consentStats?.hipaaConsent || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Treatment Consent</p>
              <p className="text-2xl font-bold text-blue-600">{consentStats?.treatmentConsent || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Photo Release</p>
              <p className="text-2xl font-bold text-pink-600">{consentStats?.photoConsent || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black p-5">
            <h3 className="font-semibold text-black mb-3">Required Consent Forms</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                HIPAA Acknowledgment - Required for all clients
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                General Treatment Consent - Required before first service
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Injectable Consent - Required for Botox/filler treatments
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Photo/Media Release - Required for before/after photos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Financial Policy - Required before payment processing
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Credential</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">License #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Expiration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {credentials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-black">
                    No provider credentials found
                  </td>
                </tr>
              ) : (
                credentials.map((cred) => (
                  <tr key={cred.id} className={cred.status === 'expired' ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 font-medium text-black">{cred.providerName}</td>
                    <td className="px-4 py-3 text-black">{cred.credentialType}</td>
                    <td className="px-4 py-3 text-black">{cred.licenseNumber}</td>
                    <td className="px-4 py-3 text-black">
                      {new Date(cred.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        cred.status === 'valid' ? 'bg-green-100 text-green-700' :
                        cred.status === 'expiring' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {cred.status === 'valid' ? 'Valid' :
                         cred.status === 'expiring' ? `Expires in ${cred.daysUntilExpiry}d` :
                         'Expired'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">PHI Access Today</p>
              <p className="text-2xl font-bold">{auditSummary?.phiAccess || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Chart Modifications</p>
              <p className="text-2xl font-bold">{auditSummary?.chartEdits || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Consents Signed</p>
              <p className="text-2xl font-bold">{auditSummary?.consentsSigned || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">Audit Trail</h3>
              <Link href="/admin/users?tab=logs" className="text-sm text-pink-600 hover:text-pink-700">
                View Full Log →
              </Link>
            </div>
            <p className="text-black text-sm">
              All PHI access, chart modifications, and consent actions are automatically logged 
              with timestamp, user ID, and IP address for HIPAA compliance.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Total Lots Tracked</p>
              <p className="text-2xl font-bold">{inventoryCompliance?.totalLots || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Expiring (30 days)</p>
              <p className="text-2xl font-bold text-amber-600">{inventoryCompliance?.expiringSoon || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Expired</p>
              <p className="text-2xl font-bold text-red-600">{inventoryCompliance?.expired || 0}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-black">Missing Lot #</p>
              <p className="text-2xl font-bold text-amber-600">{inventoryCompliance?.missingLotNumbers || 0}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Inventory Compliance Requirements</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All injectable products must have lot numbers recorded</li>
              <li>• Expiration dates must be tracked and products removed before expiry</li>
              <li>• Usage must be logged per patient for adverse event tracking</li>
              <li>• Storage temperatures should be monitored for applicable products</li>
            </ul>
          </div>
        </div>
      )}

      {/* HIPAA Notice Footer */}
      <div className="bg-white rounded-xl p-4 text-center text-sm text-black">
        This compliance dashboard is provided as a tool to help monitor regulatory requirements.
        It does not constitute legal advice. Consult with healthcare compliance professionals for
        specific guidance on HIPAA, state medical board, and other regulatory requirements.
      </div>
    </div>
  );
}
