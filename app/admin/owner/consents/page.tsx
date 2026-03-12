'use client';

// ============================================================
// CONSENTS & LEGAL - OWNER CONTROLLED
// Consent forms, versioning, enforcement, print, download, send
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import OwnerLayout from '../layout-wrapper';
import { CONSENT_FORMS, type ConsentForm as ConsentFormType } from '@/lib/hgos/consent-forms';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

// Category colors for visual organization
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Compliance': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Treatment': { bg: 'bg-pink-100', text: 'text-pink-800' },
  'Marketing': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Injectable': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'Laser': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Skin': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'Body': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  'Wellness': { bg: 'bg-teal-100', text: 'text-teal-800' },
};

function getCategoryFromForm(form: ConsentFormType): string {
  if (form.id.includes('hipaa') || form.id.includes('arbitration') || form.id.includes('liability') || form.id.includes('cancellation')) return 'Compliance';
  if (form.id.includes('injectable') || form.id.includes('botox') || form.id.includes('filler') || form.id.includes('kybella') || form.id.includes('pdo')) return 'Injectable';
  if (form.id.includes('laser') || form.id.includes('ipl') || form.id.includes('hair_removal')) return 'Laser';
  if (form.id.includes('morpheus') || form.id.includes('rf_') || form.id.includes('microneedling') || form.id.includes('chemical') || form.id.includes('hydra') || form.id.includes('derma')) return 'Skin';
  if (form.id.includes('body') || form.id.includes('contouring')) return 'Body';
  if (form.id.includes('iv_') || form.id.includes('bhrt') || form.id.includes('weight') || form.id.includes('prp')) return 'Wellness';
  if (form.id.includes('photo') || form.id.includes('sms')) return 'Marketing';
  if (form.id.includes('lash') || form.id.includes('brow')) return 'Treatment';
  return 'Treatment';
}

export default function ConsentsPage() {
  const [selectedForm, setSelectedForm] = useState<ConsentFormType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMethod, setSendMethod] = useState<'client' | 'email' | 'sms' | 'link'>('client');
  const [sendEmail, setSendEmail] = useState('');
  const [sendPhone, setSendPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const printRef = useRef<HTMLDivElement>(null);
  
  // Client search state
  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const [enforcementRules, setEnforcementRules] = useState({
    block_booking_without_consent: true,
    block_checkout_without_consent: true,
    send_reminder_days_before_expiry: 14,
    allow_override_with_note: false,
  });

  // Search clients
  const searchClients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setClients([]);
      return;
    }
    setLoadingClients(true);
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Failed to search clients:', error);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clientSearch) {
        searchClients(clientSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [clientSearch, searchClients]);

  // Generate shareable link
  const generateLink = async () => {
    if (!selectedForm) return;
    try {
      const response = await fetch('/api/consents/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: selectedForm.id,
          formName: selectedForm.name,
          generateLinkOnly: true,
        }),
      });
      const data = await response.json();
      if (data.url) {
        setGeneratedLink(data.url);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate link' });
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Reset send modal state
  const resetSendModal = () => {
    setShowSendModal(false);
    setSendEmail('');
    setSendPhone('');
    setClientSearch('');
    setClients([]);
    setSelectedClient(null);
    setGeneratedLink(null);
    setLinkCopied(false);
    setSendMethod('client');
  };

  // Group forms by category
  const groupedForms = CONSENT_FORMS.reduce((acc, form) => {
    const category = getCategoryFromForm(form);
    if (!acc[category]) acc[category] = [];
    acc[category].push(form);
    return acc;
  }, {} as Record<string, ConsentFormType[]>);

  // Filter forms
  const filteredForms = CONSENT_FORMS.filter(form => {
    const matchesSearch = searchQuery === '' || 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || getCategoryFromForm(form) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Print function
  const handlePrint = (form: ConsentFormType) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.name} - Hello Gorgeous Med Spa</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.6; 
            max-width: 8.5in;
            margin: 0.75in auto;
            padding: 0 0.5in;
          }
          h2 { text-align: center; margin-bottom: 20px; font-size: 16pt; }
          h3 { margin-top: 20px; margin-bottom: 10px; font-size: 13pt; }
          .clinic-name { text-align: center; margin-bottom: 30px; }
          .important-notice { background: #fff3cd; padding: 15px; border: 1px solid #ffc107; margin: 20px 0; }
          .warning-box { background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; margin: 20px 0; }
          .signature-block { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }
          ul { margin-left: 20px; }
          li { margin-bottom: 5px; }
          .footer { margin-top: 60px; }
          .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; margin: 5px 0; }
          .date-line { border-bottom: 1px solid #000; width: 150px; display: inline-block; margin: 5px 0; }
          @media print {
            body { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        ${form.content}
        <div class="footer">
          <p><strong>Patient Signature:</strong> <span class="signature-line"></span></p>
          <p><strong>Printed Name:</strong> <span class="signature-line"></span></p>
          <p><strong>Date:</strong> <span class="date-line"></span></p>
          <br>
          <p style="font-size: 10pt; color: #666;">Form Version: ${form.version} | Last Updated: ${form.lastUpdated}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Download PDF function
  const handleDownloadPDF = async (form: ConsentFormType) => {
    // Create a blob with HTML content that can be converted to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.name}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; padding: 40px; }
          h2 { text-align: center; margin-bottom: 20px; }
          h3 { margin-top: 20px; margin-bottom: 10px; }
          .clinic-name { text-align: center; margin-bottom: 30px; }
          .important-notice { background: #fff3cd; padding: 15px; border: 1px solid #ffc107; margin: 20px 0; }
          .warning-box { background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; margin: 20px 0; }
          .signature-block { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }
          ul { margin-left: 20px; }
          li { margin-bottom: 5px; }
          .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; }
        </style>
      </head>
      <body>
        ${form.content}
        <div style="margin-top: 60px;">
          <p><strong>Patient Signature:</strong> <span class="signature-line"></span></p>
          <p><strong>Printed Name:</strong> <span class="signature-line"></span></p>
          <p><strong>Date:</strong> _______________</p>
          <p style="margin-top: 20px; font-size: 10pt; color: #666;">Form Version: ${form.version} | Last Updated: ${form.lastUpdated}</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.id}-consent-form-v${form.version}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: `Downloaded ${form.shortName} consent form. Open in browser and print to PDF for best results.` });
    setTimeout(() => setMessage(null), 5000);
  };

  // Send consent form to client
  const handleSendToClient = async () => {
    if (!selectedForm) return;

    // Validate based on send method
    if (sendMethod === 'client' && !selectedClient) {
      setMessage({ type: 'error', text: 'Please select a client' });
      return;
    }
    if (sendMethod === 'email' && !sendEmail) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }
    if (sendMethod === 'sms' && !sendPhone) {
      setMessage({ type: 'error', text: 'Please enter a phone number' });
      return;
    }

    setSending(true);
    try {
      const payload: Record<string, unknown> = {
        formType: selectedForm.id,
        formName: selectedForm.name,
      };

      if (sendMethod === 'client' && selectedClient) {
        payload.clientId = selectedClient.id;
        payload.email = selectedClient.email || undefined;
        payload.phone = selectedClient.phone || undefined;
      } else if (sendMethod === 'email') {
        payload.email = sendEmail;
      } else if (sendMethod === 'sms') {
        payload.phone = sendPhone;
      }

      const response = await fetch('/api/consents/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const recipient = sendMethod === 'client' && selectedClient 
          ? `${selectedClient.first_name} ${selectedClient.last_name}`
          : sendEmail || sendPhone;
        setMessage({ type: 'success', text: `Consent form sent to ${recipient}!` });
        resetSendModal();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send consent form' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send consent form' });
    } finally {
      setSending(false);
    }
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Consent settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const categories = ['all', ...Object.keys(groupedForms)];

  return (
    <OwnerLayout title="Consents & Legal" description="Manage consent forms - print, download, and send to clients">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search consent forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#FF2D8E] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat} 
                  {cat === 'all' ? ` (${CONSENT_FORMS.length})` : ` (${groupedForms[cat]?.length || 0})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-[#FF2D8E]">{CONSENT_FORMS.length}</div>
            <div className="text-sm text-gray-600">Total Forms</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{CONSENT_FORMS.filter(f => f.isRequired).length}</div>
            <div className="text-sm text-gray-600">Required Forms</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{Object.keys(groupedForms).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{CONSENT_FORMS.filter(f => f.expiresAfterDays).length}</div>
            <div className="text-sm text-gray-600">With Expiration</div>
          </div>
        </div>

        {/* Consent Forms List */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Consent Forms Library</h2>
            <p className="text-sm text-gray-600 mt-1">Click on any form to preview, print, download, or send to clients</p>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredForms.map(form => {
              const category = getCategoryFromForm(form);
              const colors = CATEGORY_COLORS[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
              
              return (
                <div key={form.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900">{form.name}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">v{form.version}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>{category}</span>
                        {form.isRequired && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {form.expiresAfterDays ? (
                          <span>Expires: {form.expiresAfterDays} days</span>
                        ) : (
                          <span>No expiration</span>
                        )}
                        <span>•</span>
                        <span>Updated: {form.lastUpdated}</span>
                        {form.requiredForServices && form.requiredForServices.length > 0 && (
                          <>
                            <span>•</span>
                            <span>For: {form.requiredForServices.slice(0, 3).join(', ')}{form.requiredForServices.length > 3 ? '...' : ''}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setSelectedForm(form); setShowPreview(true); }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handlePrint(form)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Print"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(form)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { setSelectedForm(form); setShowSendModal(true); }}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Send to Client"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enforcement Rules */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Enforcement Rules</h2>
          <div className="space-y-4">
            {[
              { key: 'block_booking_without_consent', label: 'Block booking if required consent is missing/expired' },
              { key: 'block_checkout_without_consent', label: 'Block checkout if required consent is missing/expired' },
              { key: 'allow_override_with_note', label: 'Allow staff to override with documented reason' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={enforcementRules[item.key as keyof typeof enforcementRules] as boolean}
                  onChange={(e) => setEnforcementRules(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-pink-600 rounded"
                />
                <span>{item.label}</span>
              </label>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send Reminder Before Expiry (days)</label>
              <input
                type="number"
                value={enforcementRules.send_reminder_days_before_expiry}
                onChange={(e) => setEnforcementRules(prev => ({ ...prev, send_reminder_days_before_expiry: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800">📋 Consent Form Management</h3>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• <strong>Print:</strong> Opens form in new window for printing</li>
            <li>• <strong>Download:</strong> Downloads HTML file - open in browser and use "Print to PDF"</li>
            <li>• <strong>Send:</strong> Emails or texts consent link to client for digital signature</li>
            <li>• All forms are HIPAA-compliant with arbitration and liability clauses</li>
            <li>• Version control ensures legal compliance - previous versions are preserved</li>
          </ul>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-[#FF2D8E] text-white rounded-lg hover:bg-black font-medium transition-colors">
            Save Consent Settings
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="font-semibold text-lg">{selectedForm.name}</h2>
                <p className="text-sm text-gray-600">Version {selectedForm.version} • {selectedForm.lastUpdated}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(selectedForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => { setShowPreview(false); setShowSendModal(true); }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send
                </button>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div 
              className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] prose prose-sm max-w-none"
              ref={printRef}
              dangerouslySetInnerHTML={{ __html: selectedForm.content }}
            />
          </div>
        </div>
      )}

      {/* Send Modal - Enhanced */}
      {showSendModal && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={resetSendModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b bg-gradient-to-r from-pink-600 to-pink-500">
              <h2 className="font-semibold text-lg text-white">Send Consent Form</h2>
              <p className="text-sm text-pink-100">{selectedForm.name}</p>
            </div>
            
            {/* Send Method Tabs */}
            <div className="flex border-b">
              {[
                { id: 'client', label: 'Client Account', icon: '👤' },
                { id: 'email', label: 'Email', icon: '📧' },
                { id: 'sms', label: 'SMS', icon: '📱' },
                { id: 'link', label: 'Copy Link', icon: '🔗' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSendMethod(method.id as typeof sendMethod)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    sendMethod === method.id
                      ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1">{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Client Search */}
              {sendMethod === 'client' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Client</label>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => { setClientSearch(e.target.value); setSelectedClient(null); }}
                      placeholder="Search by name, email, or phone..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  {loadingClients && (
                    <div className="text-center py-4 text-gray-500">
                      <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}

                  {clients.length > 0 && !selectedClient && (
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {clients.map(client => (
                        <button
                          key={client.id}
                          onClick={() => { setSelectedClient(client); setClients([]); }}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium">{client.first_name} {client.last_name}</p>
                          <p className="text-sm text-gray-500">
                            {client.email && <span>{client.email}</span>}
                            {client.email && client.phone && <span> • </span>}
                            {client.phone && <span>{client.phone}</span>}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedClient && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            {selectedClient.first_name} {selectedClient.last_name}
                          </p>
                          <p className="text-sm text-green-600">
                            {selectedClient.email || selectedClient.phone || 'No contact info'}
                          </p>
                        </div>
                        <button
                          onClick={() => { setSelectedClient(null); setClientSearch(''); }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    Form will be sent to the client&apos;s email/phone and linked to their account for secure access in their portal.
                  </div>
                </div>
              )}

              {/* Email */}
              {sendMethod === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={sendEmail}
                      onChange={(e) => setSendEmail(e.target.value)}
                      placeholder="client@email.com"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    Client will receive an email with a link to view and digitally sign the consent form.
                  </div>
                </div>
              )}

              {/* SMS */}
              {sendMethod === 'sms' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={sendPhone}
                      onChange={(e) => setSendPhone(e.target.value)}
                      placeholder="(630) 555-1234"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    Client will receive an SMS with a link to view and digitally sign the consent form.
                  </div>
                </div>
              )}

              {/* Copy Link */}
              {sendMethod === 'link' && (
                <div className="space-y-3">
                  {!generatedLink ? (
                    <button
                      onClick={generateLink}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors"
                    >
                      Click to generate shareable link
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={generatedLink}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                        />
                        <button
                          onClick={copyLink}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            linkCopied
                              ? 'bg-green-600 text-white'
                              : 'bg-[#FF2D8E] text-white hover:bg-black'
                          }`}
                        >
                          {linkCopied ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Link expires in 7 days</p>
                    </div>
                  )}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                    <strong>Note:</strong> This link is not tied to a specific client account. Use Client Account method for secure, tracked consents.
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2 bg-gray-50">
              <button
                onClick={resetSendModal}
                className="px-4 py-2 border rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              {sendMethod !== 'link' && (
                <button
                  onClick={handleSendToClient}
                  disabled={sending || 
                    (sendMethod === 'client' && !selectedClient) ||
                    (sendMethod === 'email' && !sendEmail) ||
                    (sendMethod === 'sms' && !sendPhone)
                  }
                  className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Consent Form
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
