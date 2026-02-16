'use client';

// ============================================================
// EXPORT BUTTON COMPONENT
// CSV/Excel export functionality
// ============================================================

import { useState } from 'react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns: { key: string; label: string; format?: (value: any) => string }[];
  label?: string;
  className?: string;
}

export function ExportButton({
  data,
  filename,
  columns,
  label = 'Export CSV',
  className = '',
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Build CSV content
      const headers = columns.map(col => `"${col.label}"`).join(',');
      const rows = data.map(item => 
        columns.map(col => {
          let value = item[col.key];
          if (col.format) {
            value = col.format(value);
          }
          // Escape quotes and wrap in quotes
          const stringValue = String(value ?? '').replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      
      // Add BOM for Excel compatibility
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || data.length === 0}
      className={`px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {exporting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Exporting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {label}
        </span>
      )}
    </button>
  );
}

// Quick export utility function
export function exportToCSV(data: any[], columns: { key: string; label: string }[], filename: string) {
  const headers = columns.map(col => `"${col.label}"`).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = String(item[col.key] ?? '').replace(/"/g, '""');
      return `"${value}"`;
    }).join(',')
  );
  
  const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export default ExportButton;
