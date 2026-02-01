'use client';

// ============================================================
// COMPLIANCE DASHBOARD PAGE - FULLY INTERACTIVE
// Monitor legal compliance, incidents, and provider credentials
// ============================================================

import { useState, useEffect, useMemo } from 'react';
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
} from '@/lib/hgos/legal-protection';

import { ACTIVE_PROVIDERS } from '@/lib/hgos/providers';

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
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  
  // Data states
  const [complianceStatuses, setComplianceStatuses] = useState<Record<string, { status: ComplianceItem['status']; lastCompleted?: string; nextDue?: string; notes?: string }>>({});
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Incident form
  const [incidentForm, setIncidentForm] = useState({
    type: '',
    date_occurred: new Date().toISOString().split('T')[0],
    time_occurred: '',
    client_name: '',
    provider_name: '',
    treatment_type: '',
    description: '',
    immediate_actions: '',
    medical_attention_required: false,
    client_notified: false,
  });

  // Compliance form
  const [complianceForm, setComplianceForm] = useState({
    status: 'pending' as ComplianceItem['status'],
    lastCompleted: '',
    nextDue: '',
    notes: '',
    responsible: '',
  });

  // Load data from APIs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load compliance statuses
        const compRes = await fetch('/api/compliance');
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplianceStatuses(compData.records || {});
        }

        // Load incidents
        const incRes = await fetch('/api/incidents');
        if (incRes.ok) {
          const incData = await incRes.json();
          setIncidents(incData.incidents || []);
        }
      } catch (err) {
        console.error('Error loading compliance data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Merge checklist with status data
  const complianceItems: ComplianceItem[] = useMemo(() => {
    return COMPLIANCE_CHECKLIST.map(item => ({
      ...item,
      status: complianceStatuses[item.id]?.status,
      lastCompleted: complianceStatuses[item.id]?.lastCompleted,
      nextDue: complianceStatuses[item.id]?.nextDue,
    }));
  }, [complianceStatuses]);

  const trackedItems = useMemo(() => complianceItems.filter(i => complianceStatuses[i.id]), [complianceItems, complianceStatuses]);
  const complianceStatus = useMemo(() => getComplianceStatus(trackedItems), [trackedItems]);
  const expiringItems = useMemo(() => getExpiringItems(complianceItems, 30), [complianceItems]);
  const riskScore = useMemo(() => calculateRiskScore(incidents, complianceItems), [incidents, complianceItems]);
  const openIncidents = useMemo(() => incidents.filter(i => i.status !== 'closed'), [incidents]);

  // Filter compliance items by category
  const filteredItems = useMemo(() => {
    return selectedCategory === 'all' 
      ? complianceItems 
      : complianceItems.filter(i => i.category === selectedCategory);
  }, [complianceItems, selectedCategory]);

  // Group items by category
  const groupedItems = useMemo(() => {
    return complianceItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<ComplianceCategory, ComplianceItem[]>);
  }, [complianceItems]);

  // Save compliance status
  const handleSaveCompliance = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: complianceForm.status,
          last_completed: complianceForm.lastCompleted || null,
          next_due: complianceForm.nextDue || null,
          notes: complianceForm.notes || null,
          responsible: complianceForm.responsible || null,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Compliance status updated!' });
        setComplianceStatuses(prev => ({
          ...prev,
          [selectedItem.id]: {
            status: complianceForm.status,
            lastCompleted: complianceForm.lastCompleted,
            nextDue: complianceForm.nextDue,
            notes: complianceForm.notes,
          },
        }));
        setShowComplianceModal(false);
        setSelectedItem(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save compliance status' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Submit incident
  const handleSubmitIncident = async () => {
    if (!incidentForm.type || !incidentForm.description) {
      setMessage({ type: 'error', text: 'Type and description are required' });
      return;
    }
    setSaving(true);
    try {
      const incidentType = INCIDENT_TYPES.find(t => t.type === incidentForm.type);
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...incidentForm,
          severity: incidentType?.severity || 'minor',
          reported_by: 'Admin',
        }),
      });

      const data = await res.json();
      if (res.ok || data.success) {
        setMessage({ type: 'success', text: `Incident reported: ${data.incident?.id}` });
        setIncidents(prev => [data.incident, ...prev]);
        setShowIncidentModal(false);
        setIncidentForm({
          type: '',
          date_occurred: new Date().toISOString().split('T')[0],
          time_occurred: '',
          client_name: '',
          provider_name: '',
          treatment_type: '',
          description: '',
          immediate_actions: '',
          medical_attention_required: false,
          client_notified: false,
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit incident' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit incident' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Update incident status
  const updateIncidentStatus = async (incidentId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: incidentId, status: newStatus }),
      });
      if (res.ok) {
        setIncidents(prev => prev.map(inc => 
          inc.id === incidentId ? { ...inc, status: newStatus as any } : inc
        ));
        setMessage({ type: 'success', text: 'Incident updated' });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (err) {
      console.error('Error updating incident:', err);
    }
  };

  // Open compliance edit modal
  const openComplianceEdit = (item: ComplianceItem) => {
    setSelectedItem(item);
    const existing = complianceStatuses[item.id];
    setComplianceForm({
      status: existing?.status || 'pending',
      lastCompleted: existing?.lastCompleted || '',
      nextDue: existing?.nextDue || '',
      notes: existing?.notes || '',
      responsible: '',
    });
    setShowComplianceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-500">Monitor legal compliance, incidents, and provider credentials</p>
        </div>
        <button
          onClick={() => setShowIncidentModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <span>🚨</span>
          Report Incident
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Risk Score Banner */}
      <div className={`p-6 rounded-xl ${
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
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
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
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-3xl font-bold text-green-600">{complianceStatus.compliant}</div>
              <div className="text-gray-600">Compliant Items</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${trackedItems.length > 0 ? complianceStatus.percentage : 0}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {trackedItems.length > 0 ? `${complianceStatus.percentage}%` : '0%'} compliant
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-3xl font-bold text-red-600">{complianceStatus.nonCompliant}</div>
              <div className="text-gray-600">Non-Compliant</div>
              <p className="text-sm text-red-600 mt-2">Requires immediate attention</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-3xl font-bold text-orange-600">{expiringItems.length}</div>
              <div className="text-gray-600">Expiring Soon</div>
              <p className="text-sm text-orange-600 mt-2">Within 30 days</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-3xl font-bold text-blue-600">{openIncidents.length}</div>
              <div className="text-gray-600">Open Incidents</div>
              <p className="text-sm text-blue-600 mt-2">Require follow-up</p>
            </div>
          </div>

          {/* Quick Start Guide */}
          {trackedItems.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Get Started with Compliance Tracking</h3>
              <p className="text-blue-800 mb-4">
                No compliance items are being tracked yet. Go to the <strong>Compliance Checklist</strong> tab 
                and click "Update" on each item to start tracking your compliance status.
              </p>
              <button
                onClick={() => setActiveTab('checklist')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Checklist →
              </button>
            </div>
          )}

          {/* Category Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-lg mb-4">Compliance by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(groupedItems) as ComplianceCategory[]).map(category => {
                const items = groupedItems[category];
                const statusItems = items.filter(i => complianceStatuses[i.id]);
                const compliant = statusItems.filter(i => complianceStatuses[i.id]?.status === 'compliant').length;
                const total = items.length;
                const tracked = statusItems.length;
                const percentage = tracked > 0 ? Math.round((compliant / tracked) * 100) : 0;
                
                return (
                  <div 
                    key={category}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => { setActiveTab('checklist'); setSelectedCategory(category); }}
                  >
                    <div className="text-2xl mb-2">{CATEGORY_ICONS[category]}</div>
                    <div className="font-medium text-sm">{CATEGORY_LABELS[category]}</div>
                    <div className="text-xs text-gray-500 mt-1">{tracked}/{total} tracked</div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${tracked === 0 ? 'bg-gray-300' : percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: tracked > 0 ? `${percentage}%` : '0%' }}
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
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
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
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                        {item.required && (
                          <span className="text-xs text-red-600">* Required</span>
                        )}
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
                        <button 
                          onClick={() => openComplianceEdit(item)}
                          className="px-3 py-1.5 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 font-medium"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Incident Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['minor', 'moderate', 'severe', 'critical'] as IncidentSeverity[]).map(severity => {
              const count = incidents.filter(i => i.severity === severity).length;
              return (
                <div key={severity} className="bg-white rounded-xl border border-gray-100 p-4">
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
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold">Incident History</h3>
              <button
                onClick={() => setShowIncidentModal(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                + New Incident
              </button>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">✓</div>
                <div>No incidents reported</div>
                <p className="text-sm mt-1">Click "New Incident" to report one</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {incidents.map(incident => (
                  <div key={incident.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
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
                          {INCIDENT_TYPES.find(t => t.type === incident.type)?.label || incident.type}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                          <span>📅 {incident.dateOccurred}</span>
                          {incident.clientName && <span>👤 {incident.clientName}</span>}
                          {incident.providerName && <span>👩‍⚕️ {incident.providerName}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {incident.status !== 'closed' && (
                          <>
                            {incident.status === 'open' && (
                              <button 
                                onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Investigate
                              </button>
                            )}
                            {incident.status === 'investigating' && (
                              <button 
                                onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Resolve
                              </button>
                            )}
                            <button 
                              onClick={() => updateIncidentStatus(incident.id, 'closed')}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              Close
                            </button>
                          </>
                        )}
                      </div>
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
          {ACTIVE_PROVIDERS.map(provider => (
            <div key={provider.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-lg">{provider.firstName} {provider.lastName}, {provider.credentials}</h3>
                <p className="text-sm text-gray-500">{provider.role}</p>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-700 mb-3">Licenses & Certifications</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{provider.credentials === 'FNP-BC' ? 'Illinois APRN License' : 'Illinois RN License'}</div>
                        <div className="text-sm text-gray-600">Issued by: Illinois DFPR</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Active
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">BLS/CPR Certification</div>
                        <div className="text-sm text-gray-600">Issued by: American Heart Association</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Active
                      </span>
                    </div>
                  </div>
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
            <div key={protocol.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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

          <button 
            onClick={() => window.print()}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
          >
            🖨️ Print All Emergency Protocols
          </button>
        </div>
      )}

      {/* Compliance Update Modal */}
      {showComplianceModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Update Compliance Status</h2>
              <p className="text-gray-500">{selectedItem.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={complianceForm.status}
                  onChange={(e) => setComplianceForm({ ...complianceForm, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="compliant">✓ Compliant</option>
                  <option value="non_compliant">✗ Not Compliant</option>
                  <option value="expires_soon">⚠️ Expires Soon</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Completed</label>
                  <input
                    type="date"
                    value={complianceForm.lastCompleted}
                    onChange={(e) => setComplianceForm({ ...complianceForm, lastCompleted: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Due</label>
                  <input
                    type="date"
                    value={complianceForm.nextDue}
                    onChange={(e) => setComplianceForm({ ...complianceForm, nextDue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Person</label>
                <input
                  type="text"
                  value={complianceForm.responsible}
                  onChange={(e) => setComplianceForm({ ...complianceForm, responsible: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Who is responsible for this item?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={complianceForm.notes}
                  onChange={(e) => setComplianceForm({ ...complianceForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p><strong>Category:</strong> {CATEGORY_LABELS[selectedItem.category]}</p>
                <p><strong>Frequency:</strong> {selectedItem.frequency.replace('_', ' ')}</p>
                <p><strong>Required:</strong> {selectedItem.required ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => { setShowComplianceModal(false); setSelectedItem(null); }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCompliance}
                disabled={saving}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Report New Incident</h2>
                <button onClick={() => setShowIncidentModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type *</label>
                <select 
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select type...</option>
                  {INCIDENT_TYPES.map(type => (
                    <option key={type.type} value={type.type}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Occurred *</label>
                  <input 
                    type="date" 
                    value={incidentForm.date_occurred}
                    onChange={(e) => setIncidentForm({ ...incidentForm, date_occurred: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Occurred</label>
                  <input 
                    type="time" 
                    value={incidentForm.time_occurred}
                    onChange={(e) => setIncidentForm({ ...incidentForm, time_occurred: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input 
                    type="text" 
                    value={incidentForm.client_name}
                    onChange={(e) => setIncidentForm({ ...incidentForm, client_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    placeholder="Enter client name..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={incidentForm.provider_name}
                    onChange={(e) => setIncidentForm({ ...incidentForm, provider_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select provider...</option>
                    {ACTIVE_PROVIDERS.map(p => (
                      <option key={p.id} value={`${p.firstName} ${p.lastName}`}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment/Service</label>
                <input 
                  type="text" 
                  value={incidentForm.treatment_type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, treatment_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  placeholder="e.g., Lip Filler, Botox..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-24"
                  placeholder="Describe what happened in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Actions Taken</label>
                <textarea 
                  value={incidentForm.immediate_actions}
                  onChange={(e) => setIncidentForm({ ...incidentForm, immediate_actions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-20"
                  placeholder="What steps were taken immediately..."
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={incidentForm.medical_attention_required}
                    onChange={(e) => setIncidentForm({ ...incidentForm, medical_attention_required: e.target.checked })}
                    className="rounded" 
                  />
                  <span className="text-sm">Medical attention required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={incidentForm.client_notified}
                    onChange={(e) => setIncidentForm({ ...incidentForm, client_notified: e.target.checked })}
                    className="rounded" 
                  />
                  <span className="text-sm">Client notified</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitIncident}
                disabled={saving || !incidentForm.type || !incidentForm.description}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Submitting...' : 'Submit Incident Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
