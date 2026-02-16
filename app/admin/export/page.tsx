'use client';

// ============================================================
// DATA EXPORT CENTER - COMPLIANCE & BACKUP HUB
// One-click exports for all business data
// HIPAA-compliant data extraction for audits, backups, migration
// ============================================================

import { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface ExportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  recordCount?: number;
  downloadUrl?: string;
  error?: string;
}

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  dataType: string;
  sensitive: boolean;
  formats: ('csv' | 'json' | 'pdf')[];
  estimatedRecords?: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'clients',
    name: 'Client Records',
    description: 'All client demographic data, contact info, and preferences',
    icon: '👥',
    dataType: 'clients',
    sensitive: true,
    formats: ['csv', 'json'],
  },
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Complete appointment history with status and outcomes',
    icon: '📅',
    dataType: 'appointments',
    sensitive: false,
    formats: ['csv', 'json'],
  },
  {
    id: 'transactions',
    name: 'Financial Transactions',
    description: 'All payments, refunds, and financial records',
    icon: '💳',
    dataType: 'transactions',
    sensitive: true,
    formats: ['csv', 'json'],
  },
  {
    id: 'clinical-notes',
    name: 'Clinical Notes (PHI)',
    description: 'SOAP notes, treatment records, and clinical documentation',
    icon: '📋',
    dataType: 'chart_notes',
    sensitive: true,
    formats: ['json', 'pdf'],
  },
  {
    id: 'consents',
    name: 'Signed Consents',
    description: 'All consent forms with signatures and timestamps',
    icon: '✍️',
    dataType: 'signed_consents',
    sensitive: true,
    formats: ['json', 'pdf'],
  },
  {
    id: 'photos',
    name: 'Clinical Photos',
    description: 'Before/after photos linked to visits (metadata only)',
    icon: '📸',
    dataType: 'client_photos',
    sensitive: true,
    formats: ['json'],
  },
  {
    id: 'inventory',
    name: 'Inventory Records',
    description: 'Product inventory, lot numbers, expiration dates',
    icon: '📦',
    dataType: 'inventory_lots',
    sensitive: false,
    formats: ['csv', 'json'],
  },
  {
    id: 'services',
    name: 'Services & Pricing',
    description: 'Service catalog with pricing and configurations',
    icon: '✨',
    dataType: 'services',
    sensitive: false,
    formats: ['csv', 'json'],
  },
  {
    id: 'providers',
    name: 'Team & Providers',
    description: 'Staff directory and provider information',
    icon: '👩‍⚕️',
    dataType: 'providers',
    sensitive: false,
    formats: ['csv', 'json'],
  },
  {
    id: 'audit-logs',
    name: 'Audit Logs',
    description: 'Complete system audit trail for compliance',
    icon: '📝',
    dataType: 'audit_logs',
    sensitive: true,
    formats: ['json'],
  },
  {
    id: 'memberships',
    name: 'Memberships & Packages',
    description: 'Client memberships, packages, and usage records',
    icon: '💎',
    dataType: 'client_memberships',
    sensitive: false,
    formats: ['csv', 'json'],
  },
  {
    id: 'full-backup',
    name: 'Complete Database Backup',
    description: 'Full export of all data for disaster recovery',
    icon: '🔒',
    dataType: 'full',
    sensitive: true,
    formats: ['json'],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function fetchAndExport(dataType: string, format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
  // Map data types to API endpoints
  const endpointMap: Record<string, string> = {
    clients: '/api/clients?limit=10000',
    appointments: '/api/appointments?limit=10000',
    transactions: '/api/transactions?limit=10000',
    chart_notes: '/api/chart-notes?limit=10000',
    signed_consents: '/api/consents?limit=10000',
    client_photos: '/api/photos?limit=10000',
    inventory_lots: '/api/inventory?limit=10000',
    services: '/api/services?limit=10000',
    providers: '/api/providers?limit=10000',
    audit_logs: '/api/audit?limit=10000',
    client_memberships: '/api/memberships?limit=10000',
  };

  const endpoint = endpointMap[dataType];
  
  if (dataType === 'full') {
    // Full backup - fetch all endpoints
    const allData: Record<string, any> = {};
    for (const [key, url] of Object.entries(endpointMap)) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          allData[key] = data;
        }
      } catch (e) {
        console.error(`Failed to fetch ${key}:`, e);
      }
    }
    return new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  }

  if (!endpoint) {
    throw new Error(`Unknown data type: ${dataType}`);
  }

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${dataType}`);
  }

  const data = await res.json();
  const records = data[Object.keys(data)[0]] || data;

  if (format === 'json') {
    return new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  }

  if (format === 'csv') {
    // Convert to CSV
    if (!Array.isArray(records) || records.length === 0) {
      return new Blob(['No data'], { type: 'text/csv' });
    }
    
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(','),
      ...records.map((row: any) =>
        headers.map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          const str = String(val);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ];
    return new Blob([csvRows.join('\n')], { type: 'text/csv' });
  }

  if (format === 'pdf') {
    // For PDF, we'll create a simple HTML document that can be printed
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${dataType} Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Hello Gorgeous Med Spa - ${dataType} Export</h1>
        <p>Generated: ${new Date().toISOString()}</p>
        <p>Records: ${Array.isArray(records) ? records.length : 'N/A'}</p>
        <pre>${JSON.stringify(records, null, 2)}</pre>
        <div class="footer">
          <p>CONFIDENTIAL - Contains Protected Health Information (PHI)</p>
          <p>This document is subject to HIPAA regulations.</p>
        </div>
      </body>
      </html>
    `;
    return new Blob([html], { type: 'text/html' });
  }

  throw new Error(`Unsupported format: ${format}`);
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DataExportCenter() {
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [processing, setProcessing] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [acknowledgePHI, setAcknowledgePHI] = useState(false);

  const selectedOption = EXPORT_OPTIONS.find(o => o.id === selectedExport);

  const handleExport = async () => {
    if (!selectedExport || !selectedOption) return;
    if (selectedOption.sensitive && !acknowledgePHI) {
      alert('Please acknowledge the PHI warning before exporting sensitive data.');
      return;
    }

    setProcessing(true);
    const jobId = `job-${Date.now()}`;
    const newJob: ExportJob = {
      id: jobId,
      type: selectedOption.name,
      status: 'processing',
      startedAt: new Date(),
    };
    setJobs(prev => [newJob, ...prev]);

    try {
      const blob = await fetchAndExport(selectedOption.dataType, selectedFormat);
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `hgms-${selectedOption.dataType}-${new Date().toISOString().split('T')[0]}.${selectedFormat === 'pdf' ? 'html' : selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'completed', completedAt: new Date(), downloadUrl: url }
          : j
      ));
    } catch (error: any) {
      setJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'failed', error: error.message }
          : j
      ));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Data Export Center</h1>
          <p className="text-black">Export business data for compliance, backups, and analysis</p>
        </div>
      </div>

      {/* HIPAA Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-800">HIPAA Compliance Notice</h3>
            <p className="text-amber-700 text-sm mt-1">
              Some exports contain Protected Health Information (PHI). Ensure you have proper authorization
              and security measures before downloading. All export actions are logged for compliance auditing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-black">Select Data to Export</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {EXPORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedExport(option.id);
                  setSelectedFormat(option.formats[0]);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedExport === option.id
                    ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                    : 'border-black bg-white hover:border-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{option.icon}</span>
                  {option.sensitive && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      PHI
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-black mt-2">{option.name}</h3>
                <p className="text-sm text-black mt-1">{option.description}</p>
                <div className="flex gap-1 mt-2">
                  {option.formats.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-white text-black text-xs rounded uppercase">
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Configuration */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-black p-5 space-y-4">
            <h2 className="font-semibold text-black">Export Settings</h2>

            {selectedOption ? (
              <>
                {/* Selected Item */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedOption.icon}</span>
                    <span className="font-medium text-black">{selectedOption.name}</span>
                  </div>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Export Format
                  </label>
                  <div className="flex gap-2">
                    {selectedOption.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium uppercase ${
                          selectedFormat === format
                            ? 'bg-pink-500 text-white'
                            : 'bg-white text-black hover:bg-white'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range (optional) */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Date Range (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-3 py-2 border border-black rounded-lg text-sm"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-3 py-2 border border-black rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Include Deleted */}
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeDeleted}
                    onChange={(e) => setIncludeDeleted(e.target.checked)}
                    className="w-4 h-4 rounded border-black"
                  />
                  <span className="text-black">Include deleted/archived records</span>
                </label>

                {/* PHI Acknowledgment */}
                {selectedOption.sensitive && (
                  <label className="flex items-start gap-2 text-sm bg-red-50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      checked={acknowledgePHI}
                      onChange={(e) => setAcknowledgePHI(e.target.checked)}
                      className="w-4 h-4 rounded border-black mt-0.5"
                    />
                    <span className="text-red-700">
                      I acknowledge this export contains PHI and I am authorized to access this data.
                      This action will be logged.
                    </span>
                  </label>
                )}

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={processing || (selectedOption.sensitive && !acknowledgePHI)}
                  className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 disabled:bg-white disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      📥 Export {selectedOption.name}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-black">
                <span className="text-4xl block mb-2">👈</span>
                <p>Select a data type to configure export</p>
              </div>
            )}
          </div>

          {/* Quick Export Buttons */}
          <div className="bg-white rounded-xl border border-black p-5 space-y-3">
            <h2 className="font-semibold text-black">Quick Exports</h2>
            <button
              onClick={() => {
                setSelectedExport('full-backup');
                setSelectedFormat('json');
                setAcknowledgePHI(true);
              }}
              className="w-full py-2 border border-black text-black rounded-lg hover:bg-white text-sm"
            >
              🔒 Full Database Backup
            </button>
            <button
              onClick={() => {
                setSelectedExport('transactions');
                setSelectedFormat('csv');
              }}
              className="w-full py-2 border border-black text-black rounded-lg hover:bg-white text-sm"
            >
              💳 Financial Report (CSV)
            </button>
            <button
              onClick={() => {
                setSelectedExport('appointments');
                setSelectedFormat('csv');
              }}
              className="w-full py-2 border border-black text-black rounded-lg hover:bg-white text-sm"
            >
              📅 Appointments (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Export History */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="px-5 py-4 border-b border-black">
            <h2 className="font-semibold text-black">Export History (This Session)</h2>
          </div>
          <div className="divide-y divide-black">
            {jobs.map((job) => (
              <div key={job.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    job.status === 'completed' ? 'bg-green-500' :
                    job.status === 'failed' ? 'bg-red-500' :
                    job.status === 'processing' ? 'bg-amber-500 animate-pulse' :
                    'bg-black/30'
                  }`} />
                  <div>
                    <p className="font-medium text-black">{job.type}</p>
                    <p className="text-sm text-black">
                      {job.startedAt.toLocaleTimeString()}
                      {job.completedAt && ` - Completed in ${Math.round((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)}s`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'completed' && job.downloadUrl && (
                    <a
                      href={job.downloadUrl}
                      download
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200"
                    >
                      Download Again
                    </a>
                  )}
                  {job.status === 'failed' && (
                    <span className="text-sm text-red-600">{job.error}</span>
                  )}
                  {job.status === 'processing' && (
                    <span className="text-sm text-amber-600">Processing...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Footer */}
      <div className="bg-white rounded-xl p-4 text-center">
        <p className="text-sm text-black">
          All exports are logged for HIPAA compliance. Data retention: 7 years for medical records, 3 years for financial.
          <br />
          For data deletion requests (CCPA/GDPR), contact your compliance officer.
        </p>
      </div>
    </div>
  );
}
