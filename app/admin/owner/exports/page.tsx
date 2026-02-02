'use client';

// ============================================================
// DATA EXPORTS CENTER - OWNER CONTROLLED
// Export all data in CSV/PDF/JSON formats
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  formats: string[];
  estimated_records?: number;
  last_export?: string;
}

export default function DataExportsPage() {
  const [exports] = useState<ExportOption[]>([
    {
      id: 'clients',
      name: 'Clients',
      description: 'All client records including contact info, preferences, and notes',
      icon: '👥',
      formats: ['CSV', 'JSON'],
      estimated_records: 3425,
      last_export: '2024-01-15T10:30:00Z',
    },
    {
      id: 'appointments',
      name: 'Appointments',
      description: 'All appointments history with status, provider, and service details',
      icon: '📅',
      formats: ['CSV', 'JSON'],
      estimated_records: 1013,
      last_export: '2024-01-10T14:00:00Z',
    },
    {
      id: 'charts',
      name: 'Clinical Charts',
      description: 'SOAP notes and clinical documentation (HIPAA-compliant export)',
      icon: '🩺',
      formats: ['PDF', 'JSON'],
      estimated_records: 850,
    },
    {
      id: 'consents',
      name: 'Signed Consents',
      description: 'All signed consent forms with signatures and timestamps',
      icon: '📝',
      formats: ['PDF', 'JSON'],
      estimated_records: 2100,
    },
    {
      id: 'photos',
      name: 'Clinical Photos',
      description: 'Before/after photos organized by client and date',
      icon: '📸',
      formats: ['ZIP'],
      estimated_records: 450,
    },
    {
      id: 'transactions',
      name: 'Financial Transactions',
      description: 'All payments, refunds, and transaction history',
      icon: '💰',
      formats: ['CSV', 'PDF', 'JSON'],
      estimated_records: 2800,
      last_export: '2024-01-20T09:15:00Z',
    },
    {
      id: 'invoices',
      name: 'Invoices',
      description: 'All invoices and receipts',
      icon: '🧾',
      formats: ['PDF', 'CSV'],
      estimated_records: 2500,
    },
    {
      id: 'inventory',
      name: 'Inventory',
      description: 'Product catalog, lot tracking, and stock levels',
      icon: '📦',
      formats: ['CSV', 'JSON'],
      estimated_records: 45,
    },
    {
      id: 'audit_logs',
      name: 'Audit Logs',
      description: 'Complete system activity logs for compliance',
      icon: '📜',
      formats: ['CSV', 'JSON'],
      estimated_records: 15000,
    },
    {
      id: 'configuration',
      name: 'System Configuration',
      description: 'All settings, rules, and configuration data',
      icon: '⚙️',
      formats: ['JSON'],
    },
    {
      id: 'memberships',
      name: 'Memberships',
      description: 'Member data, billing history, and plan details',
      icon: '💎',
      formats: ['CSV', 'JSON'],
      estimated_records: 207,
    },
    {
      id: 'services',
      name: 'Services & Pricing',
      description: 'Service catalog with pricing and configuration',
      icon: '💉',
      formats: ['CSV', 'JSON'],
      estimated_records: 76,
    },
  ]);

  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('CSV');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    if (!selectedExport) {
      setMessage({ type: 'error', text: 'Please select a data type to export' });
      return;
    }

    setIsExporting(true);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    setMessage({ type: 'success', text: `${selectedExport} data exported successfully as ${selectedFormat}!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportAll = async () => {
    if (!confirm('Export ALL data? This may take several minutes.')) return;
    
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsExporting(false);
    setMessage({ type: 'success', text: 'Complete data backup exported successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const selectedOption = exports.find(e => e.id === selectedExport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Data Exports</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Export Center</h1>
          <p className="text-gray-500">Export your data anytime • No permission required</p>
        </div>
        <button
          onClick={exportAll}
          disabled={isExporting}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          📦 Export Everything
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Data Ownership Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="font-medium text-blue-800">Your Data, Your Control</p>
            <p className="text-sm text-blue-600">
              As the system owner, you have unrestricted access to export all business data at any time.
              No approval or developer permission required.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Data Types */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Data to Export</h2>
          <div className="grid grid-cols-2 gap-3">
            {exports.map(exp => (
              <button
                key={exp.id}
                onClick={() => {
                  setSelectedExport(exp.id);
                  setSelectedFormat(exp.formats[0]);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedExport === exp.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{exp.icon}</span>
                  {exp.estimated_records && (
                    <span className="text-xs text-gray-500">{exp.estimated_records.toLocaleString()} records</span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mt-2">{exp.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                <div className="flex gap-1 mt-2">
                  {exp.formats.map(fmt => (
                    <span key={fmt} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {fmt}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Export Options</h3>
            
            {selectedOption ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selected</label>
                  <p className="text-sm text-pink-600 font-medium">{selectedOption.icon} {selectedOption.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <div className="flex gap-2">
                    {selectedOption.formats.map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedFormat(fmt)}
                        className={`px-3 py-1.5 rounded text-sm ${
                          selectedFormat === fmt
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range (optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="px-3 py-2 border rounded text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 font-medium"
                >
                  {isExporting ? 'Exporting...' : `Export ${selectedOption.name}`}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Select a data type to export
              </p>
            )}
          </div>

          {/* Recent Exports */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Exports</h3>
            <div className="space-y-2 text-sm">
              {exports.filter(e => e.last_export).slice(0, 3).map(exp => (
                <div key={exp.id} className="flex items-center justify-between py-2 border-b">
                  <span>{exp.icon} {exp.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(exp.last_export!).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-700">
              <strong>HIPAA Note:</strong> Clinical data exports are logged for compliance.
              Handle exported PHI according to your privacy policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
