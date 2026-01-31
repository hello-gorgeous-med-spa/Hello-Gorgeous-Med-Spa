'use client';

import { useState } from 'react';
import {
  COMPLIANCE_CHECKLIST,
  ComplianceItem,
  ComplianceCategory,
  getComplianceStatus,
  getExpiringItems,
  calculateRiskScore,
  INCIDENT_TYPES,
  Incident,
  IncidentSeverity,
  EMERGENCY_PROTOCOLS,
  ProviderCredentials,
} from '@/lib/hgos/legal-protection';

// Mock data - in production, this comes from Supabase
const MOCK_COMPLIANCE_STATUS: Record<string, { status: ComplianceItem['status']; lastCompleted?: string; nextDue?: string }> = {
  'business_license': { status: 'compliant', lastCompleted: '2025-06-15', nextDue: '2026-06-15' },
  'medical_director': { status: 'compliant', lastCompleted: '2025-09-01', nextDue: '2026-09-01' },
  'np_license': { status: 'compliant', lastCompleted: '2025-03-20', nextDue: '2027-03-20' },
  'laser_certification': { status: 'expires_soon', lastCompleted: '2024-02-15', nextDue: '2026-02-15' },
  'malpractice_insurance': { status: 'compliant', lastCompleted: '2025-10-01', nextDue: '2026-10-01' },
  'general_liability': { status: 'compliant', lastCompleted: '2025-10-01', nextDue: '2026-10-01' },
  'workers_comp': { status: 'compliant', lastCompleted: '2025-10-01', nextDue: '2026-10-01' },
  'cyber_liability': { status: 'non_compliant' },
  'hipaa_policies': { status: 'compliant', lastCompleted: '2025-01-15' },
  'hipaa_training': { status: 'compliant', lastCompleted: '2025-01-20', nextDue: '2026-01-20' },
  'baa_agreements': { status: 'compliant', lastCompleted: '2025-01-10' },
  'bloodborne_pathogens': { status: 'compliant', lastCompleted: '2025-01-20', nextDue: '2026-01-20' },
  'sharps_disposal': { status: 'compliant', lastCompleted: '2026-01-15', nextDue: '2026-02-15' },
  'cpr_certification': { status: 'compliant', lastCompleted: '2025-06-01', nextDue: '2026-06-01' },
  'emergency_kit': { status: 'expires_soon', lastCompleted: '2025-12-01', nextDue: '2026-02-01' },
};

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    type: 'bruising_excessive',
    severity: 'minor',
    status: 'closed',
    dateOccurred: '2026-01-15',
    timeOccurred: '14:30',
    location: 'Treatment Room 1',
    description: 'Client experienced more bruising than typical after lip filler. Resolved within 10 days.',
    clientName: 'Jane D.',
    providerName: 'Ryan Kent, FNP-BC',
    treatmentType: 'Lip Filler',
    productUsed: 'Juvederm Ultra',
    lotNumber: 'JUV-2025-1234',
    immediateActions: 'Applied ice, provided arnica gel, scheduled follow-up',
    medicalAttentionRequired: false,
    clientNotified: true,
    reportedBy: 'Ryan Kent',
    reportedAt: '2026-01-15T15:00:00Z',
    closedBy: 'Ryan Kent',
    closedAt: '2026-01-25T10:00:00Z',
    notes: [],
  },
];

const MOCK_PROVIDER_CREDENTIALS: ProviderCredentials[] = [
  {
    providerId: 'ryan-kent',
    providerName: 'Ryan Kent, FNP-BC',
    credentials: [
      {
        id: 'cred-1',
        type: 'np_license',
        name: 'Illinois APRN License',
        licenseNumber: '209.XXXXXX',
        issuingBody: 'Illinois DFPR',
        issuedDate: '2023-03-20',
        expirationDate: '2027-03-20',
        status: 'active',
      },
      {
        id: 'cred-2',
        type: 'cpr_bls',
        name: 'BLS/CPR Certification',
        issuingBody: 'American Heart Association',
        issuedDate: '2025-06-01',
        expirationDate: '2026-06-01',
        status: 'active',
      },
      {
        id: 'cred-3',
        type: 'injection_certification',
        name: 'Allergan Injectable Training',
        issuingBody: 'Allergan Medical Institute',
        issuedDate: '2023-01-15',
        expirationDate: '2026-01-15',
        status: 'expired',
      },
      {
        id: 'cred-4',
        type: 'dea_registration',
        name: 'DEA Registration',
        licenseNumber: 'FK1234567',
        issuingBody: 'DEA',
        issuedDate: '2024-01-01',
        expirationDate: '2027-01-01',
        status: 'active',
      },
    ],
    trainings: [],
    insurancePolicies: [],
  },
  {
    providerId: 'danielle-alcala',
    providerName: 'Danielle Alcala, RN-S',
    credentials: [
      {
        id: 'cred-5',
        type: 'rn_license',
        name: 'Illinois RN License',
        licenseNumber: '041.XXXXXX',
        issuingBody: 'Illinois DFPR',
        issuedDate: '2020-05-15',
        expirationDate: '2026-05-15',
        status: 'active',
      },
      {
        id: 'cred-6',
        type: 'cpr_bls',
        name: 'BLS/CPR Certification',
        issuingBody: 'American Heart Association',
        issuedDate: '2025-06-01',
        expirationDate: '2026-06-01',
        status: 'active',
      },
    ],
    trainings: [],
    insurancePolicies: [],
  },
];

const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  licensing: 'Licensing & Certifications',
  insurance: 'Insurance Coverage',
  client_consent: 'Client Consent',
  hipaa: 'HIPAA Compliance',
  osha: 'OSHA Requirements',
  documentation: 'Documentation',
  training: 'Training & Education',
  equipment: 'Equipment & Safety',
};

const CATEGORY_ICONS: Record<ComplianceCategory, string> = {
  licensing: '📜',
  insurance: '🛡️',
  client_consent: '✍️',
  hipaa: '🔒',
  osha: '⚠️',
  documentation: '📋',
  training: '🎓',
  equipment: '🔧',
};

const STATUS_COLORS = {
  compliant: 'bg-green-100 text-green-800 border-green-200',
  non_compliant: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  expires_soon: 'bg-orange-100 text-orange-800 border-orange-200',
};

const SEVERITY_COLORS = {
  minor: 'bg-blue-100 text-blue-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  severe: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function ComplianceDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'incidents' | 'credentials' | 'protocols'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory | 'all'>('all');
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Merge checklist with status data
  const complianceItems: ComplianceItem[] = COMPLIANCE_CHECKLIST.map(item => ({
    ...item,
    ...MOCK_COMPLIANCE_STATUS[item.id],
  }));

  const complianceStatus = getComplianceStatus(complianceItems.filter(i => MOCK_COMPLIANCE_STATUS[i.id]));
  const expiringItems = getExpiringItems(complianceItems, 30);
  const riskScore = calculateRiskScore(MOCK_INCIDENTS, complianceItems);

  const openIncidents = MOCK_INCIDENTS.filter(i => i.status !== 'closed');

  // Filter compliance items by category
  const filteredItems = selectedCategory === 'all' 
    ? complianceItems 
    : complianceItems.filter(i => i.category === selectedCategory);

  // Group items by category
  const groupedItems = complianceItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ComplianceCategory, ComplianceItem[]>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor legal compliance, incidents, and provider credentials</p>
          </div>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>🚨</span>
            Report Incident
          </button>
        </div>
      </div>

      {/* Risk Score Banner */}
      <div className={`mb-6 p-6 rounded-2xl ${
        riskScore.level === 'critical' ? 'bg-red-50 border-2 border-red-300' :
        riskScore.level === 'high' ? 'bg-orange-50 border-2 border-orange-300' :
        riskScore.level === 'medium' ? 'bg-yellow-50 border-2 border-yellow-300' :
        'bg-green-50 border-2 border-green-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {riskScore.level === 'critical' ? '🚨' :
               riskScore.level === 'high' ? '⚠️' :
               riskScore.level === 'medium' ? '⚡' : '✅'}
              Risk Level: <span className="uppercase">{riskScore.level}</span>
            </h2>
            {riskScore.factors.length > 0 && (
              <ul className="mt-2 text-sm">
                {riskScore.factors.map((factor, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>•</span> {factor}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{riskScore.score}</div>
            <div className="text-sm text-gray-600">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'checklist', label: 'Compliance Checklist', icon: '✅' },
          { id: 'incidents', label: 'Incidents', icon: '🚨' },
          { id: 'credentials', label: 'Provider Credentials', icon: '📜' },
          { id: 'protocols', label: 'Emergency Protocols', icon: '🏥' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-6">
              <div className="text-3xl font-bold text-green-600">{complianceStatus.compliant}</div>
              <div className="text-gray-600">Compliant Items</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${complianceStatus.percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">{complianceStatus.percentage}% compliant</div>
            </div>
            
            <div className="bg-white rounded-xl border p-6">
              <div className="text-3xl font-bold text-red-600">{complianceStatus.nonCompliant}</div>
              <div className="text-gray-600">Non-Compliant</div>
              <p className="text-sm text-red-600 mt-2">Requires immediate attention</p>
            </div>
            
            <div className="bg-white rounded-xl border p-6">
              <div className="text-3xl font-bold text-orange-600">{expiringItems.length}</div>
              <div className="text-gray-600">Expiring Soon</div>
              <p className="text-sm text-orange-600 mt-2">Within 30 days</p>
            </div>
            
            <div className="bg-white rounded-xl border p-6">
              <div className="text-3xl font-bold text-blue-600">{openIncidents.length}</div>
              <div className="text-gray-600">Open Incidents</div>
              <p className="text-sm text-blue-600 mt-2">Require follow-up</p>
            </div>
          </div>

          {/* Alerts Section */}
          {(complianceStatus.nonCompliant > 0 || expiringItems.length > 0) && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>⚠️</span> Action Required
              </h3>
              <div className="space-y-3">
                {complianceItems
                  .filter(i => i.status === 'non_compliant')
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <span className="font-medium">{item.title}</span>
                        <p className="text-sm text-red-600">{item.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Not Compliant
                      </span>
                    </div>
                  ))}
                {expiringItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <span className="font-medium">{item.title}</span>
                      <p className="text-sm text-orange-600">Expires: {item.nextDue}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      Expiring Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Summary */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-lg mb-4">Compliance by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(groupedItems) as ComplianceCategory[]).map(category => {
                const items = groupedItems[category];
                const statusItems = items.filter(i => MOCK_COMPLIANCE_STATUS[i.id]);
                const compliant = statusItems.filter(i => MOCK_COMPLIANCE_STATUS[i.id]?.status === 'compliant').length;
                const total = statusItems.length;
                const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;
                
                return (
                  <div 
                    key={category}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => { setActiveTab('checklist'); setSelectedCategory(category); }}
                  >
                    <div className="text-2xl mb-2">{CATEGORY_ICONS[category]}</div>
                    <div className="font-medium text-sm">{CATEGORY_LABELS[category]}</div>
                    <div className="text-xs text-gray-500 mt-1">{compliant}/{total} items</div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {(Object.keys(CATEGORY_LABELS) as ComplianceCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Checklist Items */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Item</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Frequency</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Next Due</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize">{item.frequency.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.status ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[item.status]}`}>
                          {item.status === 'compliant' ? '✓ Compliant' :
                           item.status === 'non_compliant' ? '✗ Not Compliant' :
                           item.status === 'pending' ? '⏳ Pending' :
                           '⚠️ Expires Soon'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Not Tracked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.nextDue || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Incident Stats */}
          <div className="grid grid-cols-4 gap-4">
            {(['minor', 'moderate', 'severe', 'critical'] as IncidentSeverity[]).map(severity => {
              const count = MOCK_INCIDENTS.filter(i => i.severity === severity).length;
              return (
                <div key={severity} className="bg-white rounded-xl border p-4">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${SEVERITY_COLORS[severity]}`}>
                    {severity.toUpperCase()}
                  </div>
                  <div className="text-2xl font-bold mt-2">{count}</div>
                  <div className="text-sm text-gray-500">incidents</div>
                </div>
              );
            })}
          </div>

          {/* Incidents List */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Incident History</h3>
              <button
                onClick={() => setShowIncidentModal(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                + New Incident
              </button>
            </div>
            {MOCK_INCIDENTS.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">✓</div>
                <div>No incidents reported</div>
              </div>
            ) : (
              <div className="divide-y">
                {MOCK_INCIDENTS.map(incident => (
                  <div key={incident.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-500">{incident.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[incident.severity]}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            incident.status === 'closed' ? 'bg-gray-100 text-gray-600' :
                            incident.status === 'resolved' ? 'bg-green-100 text-green-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                        <div className="font-medium mt-1">
                          {INCIDENT_TYPES.find(t => t.type === incident.type)?.label}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 {incident.dateOccurred}</span>
                          <span>👤 {incident.clientName || 'N/A'}</span>
                          <span>👩‍⚕️ {incident.providerName}</span>
                        </div>
                      </div>
                      <button className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          {MOCK_PROVIDER_CREDENTIALS.map(provider => (
            <div key={provider.providerId} className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-lg">{provider.providerName}</h3>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-700 mb-3">Licenses & Certifications</h4>
                <div className="space-y-3">
                  {provider.credentials.map(cred => {
                    const isExpired = new Date(cred.expirationDate) < new Date();
                    const isExpiringSoon = !isExpired && new Date(cred.expirationDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div 
                        key={cred.id}
                        className={`p-4 rounded-lg border ${
                          isExpired ? 'bg-red-50 border-red-200' :
                          isExpiringSoon ? 'bg-orange-50 border-orange-200' :
                          'bg-green-50 border-green-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{cred.name}</div>
                            {cred.licenseNumber && (
                              <div className="text-sm text-gray-600">License #: {cred.licenseNumber}</div>
                            )}
                            <div className="text-sm text-gray-600">Issued by: {cred.issuingBody}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isExpired ? 'bg-red-100 text-red-800' :
                            isExpiringSoon ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {isExpired ? '✗ Expired' : isExpiringSoon ? '⚠️ Expiring Soon' : '✓ Active'}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          <span>Issued: {cred.issuedDate}</span>
                          <span>Expires: {cred.expirationDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Tip: Keep Credentials Updated</h4>
            <p className="text-sm text-blue-800">
              Upload copies of all licenses and certifications. Set reminders 60 days before expiration 
              to ensure continuous compliance. Expired credentials can result in legal liability and 
              insurance claim denials.
            </p>
          </div>
        </div>
      )}

      {/* Emergency Protocols Tab */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">🚨 Emergency Reference Guide</h3>
            <p className="text-red-800">
              Print these protocols and keep them accessible in every treatment room. 
              Review with all staff quarterly.
            </p>
          </div>

          {EMERGENCY_PROTOCOLS.map(protocol => (
            <div key={protocol.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="bg-red-600 text-white p-4">
                <h3 className="text-xl font-bold">{protocol.name}</h3>
                <p className="text-red-100">{protocol.condition}</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Symptoms */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">⚠️ Signs & Symptoms</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {protocol.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-red-500">•</span> {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Immediate Actions */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">🏃 IMMEDIATE ACTIONS</h4>
                  <ol className="space-y-2">
                    {protocol.immediateActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Medications */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">💊 Medications</h4>
                  <div className="space-y-2">
                    {protocol.medications.map((med, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-600">
                          Dose: {med.dosage} | Route: {med.route}
                        </div>
                        <div className="text-sm text-red-600">📍 Location: {med.location}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">📞 Emergency Contacts</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {protocol.contactNumbers.map((contact, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-lg">{contact.phone}</div>
                        <div className="text-sm text-gray-600">{contact.name}</div>
                        <div className="text-xs text-gray-500">{contact.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📋 Follow-Up Actions</h4>
                  <ul className="space-y-1">
                    {protocol.followUpActions.map((action, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span>☐</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
            🖨️ Print All Emergency Protocols
          </button>
        </div>
      )}

      {/* Incident Report Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Report New Incident</h2>
                <button onClick={() => setShowIncidentModal(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type *</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select type...</option>
                  {INCIDENT_TYPES.map(type => (
                    <option key={type.type} value={type.type}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Occurred *</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Occurred *</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter client name..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment/Service</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Lip Filler, Botox..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-lg h-24"
                  placeholder="Describe what happened in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Actions Taken *</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-lg h-20"
                  placeholder="What steps were taken immediately..."
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Medical attention required</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Client notified</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Submit Incident Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
