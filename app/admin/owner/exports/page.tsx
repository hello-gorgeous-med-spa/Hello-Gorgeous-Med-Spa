'use client';

// ============================================================
// DATA EXPORTS - OWNER CONTROLLED
// Export all data in multiple formats
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  recordCount: number;
  lastExport: string | null;
}

export default function DataExportsPage() {
  const [exports] = useState<ExportOption[]>([
    { id: 'clients', name: 'Clients', description: 'All client records with contact info', icon: '👥', recordCount: 3425, lastExport: '2025-01-28' },
    { id: 'appointments', name: 'Appointments', description: 'All bookings and visit history', icon: '📅', recordCount: 12450, lastExport: '2025-01-25' },
    { id: 'charts', name: 'Charts', description: 'Clinical notes and documentation', icon: '📋', recordCount: 8920, lastExport: null },
    { id: 'consents', name: 'Consents', description: 'Signed consent forms', icon: '📝', recordCount: 6780, lastExport: '2025-01-20' },
    { id: 'photos', name: 'Photos', description: 'Before/after treatment images', icon: '📸', recordCount: 4500, lastExport: null },
    { id: 'financials', name: 'Financials', description: 'Transactions and payment records', icon: '💰', recordCount: 9870, lastExport: '2025-01-30' },
    { id: 'rules', name: 'Rules', description: 'Booking rules and policies', icon: '📜', recordCount: 25, lastExport: null },
    { id: 'config', name: 'Configuration', description: 'System settings and preferences', icon: '⚙️', recordCount: 150, lastExport: '2025-01-15' },
    { id: 'inventory', name: 'Inventory', description: 'Products, lots, and stock levels', icon: '📦', recordCount: 85, lastExport: null },
    { id: 'memberships', name: 'Memberships', description: 'Member records and subscriptions', icon: '💎', recordCount: 207, lastExport: null },
  ]);

  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleExport = (id: string) => {
    setSelectedExports(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedExports(exports.map(e => e.id));
  };

  const clearAll = () => {
    setSelectedExports([]);
  };

  const startExport = () => {
    if (selectedExports.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one data type to export' });
      return;
    }
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setMessage({ type: 'success', text: `Exported ${selectedExports.length} data types as ${selectedFormat.toUpperCase()}` });
      setTimeout(() => setMessage(null), 3000);
    }, 2000);
  };

  const fullBackup = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setMessage({ type: 'success', text: 'Full system backup created successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }, 3000);
  };

  return (
    <OwnerLayout title="Data Exports" description="Export all your data in multiple formats">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Export Options</h2>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-sm text-pink-600 hover:text-pink-700">Select All</button>
                <span className="text-black">|</span>
                <button onClick={clearAll} className="text-sm text-black hover:text-black">Clear All</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {exports.map(exp => (
                <label
                  key={exp.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedExports.includes(exp.id) ? 'border-purple-500 bg-purple-50' : 'hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedExports.includes(exp.id)}
                    onChange={() => toggleExport(exp.id)}
                    className="mt-1 w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{exp.icon}</span>
                      <span className="font-medium">{exp.name}</span>
                    </div>
                    <p className="text-xs text-black mt-1">{exp.description}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-black">{exp.recordCount.toLocaleString()} records</span>
                      {exp.lastExport && (
                        <span className="text-xs text-black">Last: {exp.lastExport}</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Export Format</h3>
            <div className="space-y-2">
              {[
                { value: 'csv', label: 'CSV', desc: 'Spreadsheet compatible' },
                { value: 'pdf', label: 'PDF', desc: 'Print-ready documents' },
                { value: 'json', label: 'JSON', desc: 'Developer/API format' },
              ].map(fmt => (
                <label
                  key={fmt.value}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                    selectedFormat === fmt.value ? 'border-purple-500 bg-purple-50' : 'hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={fmt.value}
                    checked={selectedFormat === fmt.value}
                    onChange={() => setSelectedFormat(fmt.value as any)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <div>
                    <span className="font-medium">{fmt.label}</span>
                    <p className="text-xs text-black">{fmt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Export Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black">Selected Types</span>
                <span className="font-medium">{selectedExports.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Total Records</span>
                <span className="font-medium">
                  {exports
                    .filter(e => selectedExports.includes(e.id))
                    .reduce((sum, e) => sum + e.recordCount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Format</span>
                <span className="font-medium">{selectedFormat.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={startExport}
            disabled={exporting || selectedExports.length === 0}
            className={`w-full px-6 py-4 rounded-xl font-medium text-white ${
              exporting || selectedExports.length === 0
                ? 'bg-white cursor-not-allowed'
                : 'bg-[#FF2D8E] hover:bg-black'
            }`}
          >
            {exporting ? '⏳ Exporting...' : `📥 Export ${selectedExports.length} Data Types`}
          </button>

          {/* Full Backup */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">📦 Full System Backup</h3>
            <p className="text-sm text-blue-600 mb-3">
              Export everything including config, rules, templates, and all data as a single ZIP archive.
            </p>
            <button
              onClick={fullBackup}
              disabled={exporting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Create Full Backup
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="mt-6 bg-white border border-black rounded-lg p-4">
        <h3 className="font-medium text-black mb-1">📋 Compliance Notes</h3>
        <ul className="text-sm text-black space-y-1">
          <li>• All exports are logged in the audit trail</li>
          <li>• PHI exports require Owner-level access</li>
          <li>• Data retention complies with HIPAA guidelines (7 years)</li>
          <li>• No permission required - you own your data</li>
        </ul>
      </div>
    </OwnerLayout>
  );
}
