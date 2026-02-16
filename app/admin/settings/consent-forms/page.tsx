'use client';

// ============================================================
// CONSENT FORM BUILDER - Create/Edit Consent Forms Without Code
// Owner can add questions, change wording, require signatures
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConsentField {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'signature' | 'date' | 'select';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface ConsentForm {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ConsentField[];
  content: string;
  requires_signature: boolean;
  expires_days: number;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: '📝' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'signature', label: 'Signature', icon: '✍️' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
];

const DEFAULT_FORMS: ConsentForm[] = [
  {
    id: 'consent-hipaa',
    name: 'HIPAA Acknowledgment',
    description: 'Privacy practices acknowledgment',
    category: 'compliance',
    content: `NOTICE OF PRIVACY PRACTICES

Hello Gorgeous Med Spa is committed to protecting your health information. This notice describes how medical information about you may be used and disclosed and how you can get access to this information.

YOUR RIGHTS:
• You have the right to request restrictions on certain uses and disclosures of your health information
• You have the right to receive confidential communications
• You have the right to inspect and copy your health information
• You have the right to request amendments to your health information
• You have the right to receive an accounting of disclosures

By signing below, you acknowledge that you have received and understand this Notice of Privacy Practices.`,
    fields: [
      { id: 'f1', type: 'checkbox', label: 'I acknowledge that I have received the Notice of Privacy Practices', required: true },
      { id: 'f2', type: 'signature', label: 'Patient Signature', required: true },
      { id: 'f3', type: 'date', label: 'Date', required: true },
    ],
    requires_signature: true,
    expires_days: 365,
    is_active: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'consent-neurotoxin',
    name: 'Neurotoxin Consent',
    description: 'Botox, Dysport, Jeuveau treatment consent',
    category: 'treatment',
    content: `INFORMED CONSENT FOR NEUROTOXIN TREATMENT

I understand that I am receiving treatment with botulinum toxin (Botox, Dysport, Jeuveau, or similar product) for the purpose of temporarily reducing facial wrinkles.

RISKS AND COMPLICATIONS:
• Bruising, swelling, or redness at injection sites
• Headache
• Temporary drooping of eyelid or eyebrow
• Asymmetry
• Allergic reaction (rare)

I confirm that:
• I am not pregnant or breastfeeding
• I have disclosed all medications and supplements
• I have no known allergies to botulinum toxin products
• I understand results are temporary (3-4 months)`,
    fields: [
      { id: 'f1', type: 'checkbox', label: 'I am NOT pregnant or breastfeeding', required: true },
      { id: 'f2', type: 'checkbox', label: 'I have disclosed all medications and supplements', required: true },
      { id: 'f3', type: 'checkbox', label: 'I understand the risks and complications listed above', required: true },
      { id: 'f4', type: 'checkbox', label: 'I consent to before/after photographs', required: false },
      { id: 'f5', type: 'signature', label: 'Patient Signature', required: true },
      { id: 'f6', type: 'date', label: 'Date', required: true },
    ],
    requires_signature: true,
    expires_days: 365,
    is_active: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'consent-filler',
    name: 'Dermal Filler Consent',
    description: 'Lip filler, cheek filler, etc.',
    category: 'treatment',
    content: `INFORMED CONSENT FOR DERMAL FILLER TREATMENT

I understand that I am receiving treatment with hyaluronic acid dermal filler for facial volume restoration and/or enhancement.

RISKS AND COMPLICATIONS:
• Bruising, swelling, redness, tenderness
• Lumps or irregularities
• Asymmetry
• Infection (rare)
• Vascular occlusion (rare but serious)
• Allergic reaction (rare)

I confirm that:
• I am not pregnant or breastfeeding
• I have no history of severe allergies or anaphylaxis
• I have disclosed all medications including blood thinners
• I understand results typically last 6-18 months`,
    fields: [
      { id: 'f1', type: 'checkbox', label: 'I am NOT pregnant or breastfeeding', required: true },
      { id: 'f2', type: 'checkbox', label: 'I have no history of severe allergies', required: true },
      { id: 'f3', type: 'checkbox', label: 'I have disclosed all medications', required: true },
      { id: 'f4', type: 'checkbox', label: 'I understand the risks listed above', required: true },
      { id: 'f5', type: 'textarea', label: 'Please list any allergies', required: false, placeholder: 'List allergies or write "None"' },
      { id: 'f6', type: 'signature', label: 'Patient Signature', required: true },
      { id: 'f7', type: 'date', label: 'Date', required: true },
    ],
    requires_signature: true,
    expires_days: 365,
    is_active: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'consent-financial',
    name: 'Financial Policy',
    description: 'Payment and cancellation policy',
    category: 'compliance',
    content: `FINANCIAL POLICY & CANCELLATION AGREEMENT

PAYMENT POLICY:
• Payment is due at the time of service
• We accept cash, credit cards, and financing options
• Deposits may be required for certain services

CANCELLATION POLICY:
• Please provide 24 hours notice for cancellations
• Late cancellations (less than 24 hours) may incur a 50% fee
• No-shows may be charged the full service amount
• Repeated no-shows may result in a required deposit for future bookings

By signing below, you agree to these policies.`,
    fields: [
      { id: 'f1', type: 'checkbox', label: 'I understand and agree to the payment policy', required: true },
      { id: 'f2', type: 'checkbox', label: 'I understand and agree to the cancellation policy', required: true },
      { id: 'f3', type: 'signature', label: 'Patient Signature', required: true },
      { id: 'f4', type: 'date', label: 'Date', required: true },
    ],
    requires_signature: true,
    expires_days: 365,
    is_active: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ConsentFormBuilderPage() {
  const [forms, setForms] = useState<ConsentForm[]>(DEFAULT_FORMS);
  const [editingForm, setEditingForm] = useState<ConsentForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewForm = () => {
    const newForm: ConsentForm = {
      id: `consent-${Date.now()}`,
      name: '',
      description: '',
      category: 'treatment',
      content: '',
      fields: [],
      requires_signature: true,
      expires_days: 365,
      is_active: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingForm(newForm);
    setIsCreating(true);
  };

  const saveForm = () => {
    if (!editingForm?.name) {
      setMessage({ type: 'error', text: 'Form name is required' });
      return;
    }

    if (isCreating) {
      setForms(prev => [...prev, editingForm]);
    } else {
      setForms(prev => prev.map(f => f.id === editingForm.id ? { ...editingForm, version: f.version + 1, updated_at: new Date().toISOString() } : f));
    }

    setMessage({ type: 'success', text: isCreating ? 'Consent form created!' : 'Consent form updated!' });
    setEditingForm(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const addField = (type: string) => {
    if (!editingForm) return;
    const newField: ConsentField = {
      id: `field-${Date.now()}`,
      type: type as any,
      label: '',
      required: type === 'signature',
    };
    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField],
    });
  };

  const updateField = (fieldId: string, updates: Partial<ConsentField>) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
    });
  };

  const removeField = (fieldId: string) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.filter(f => f.id !== fieldId),
    });
  };

  const toggleFormActive = (formId: string) => {
    setForms(prev => prev.map(f => f.id === formId ? { ...f, is_active: !f.is_active } : f));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Consent Forms</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Consent Form Builder</h1>
          <p className="text-black">Create and edit consent forms without code</p>
        </div>
        {!editingForm && (
          <button
            onClick={createNewForm}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            + Create Form
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Form Editor */}
      {editingForm ? (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create New Form' : 'Edit Form'}</h2>
            <button onClick={() => { setEditingForm(null); setIsCreating(false); }} className="text-black hover:text-black">
              ✕ Close
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Form Name *</label>
              <input
                type="text"
                value={editingForm.name}
                onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Neurotoxin Consent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select
                value={editingForm.category}
                onChange={(e) => setEditingForm({ ...editingForm, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="compliance">Compliance</option>
                <option value="treatment">Treatment</option>
                <option value="financial">Financial</option>
                <option value="photo">Photo Release</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description</label>
            <input
              type="text"
              value={editingForm.description}
              onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Brief description of this consent form"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Form Content</label>
            <textarea
              value={editingForm.content}
              onChange={(e) => setEditingForm({ ...editingForm, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-48 font-mono text-sm"
              placeholder="Enter the consent form text that will be displayed to clients..."
            />
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-black">Form Fields</label>
              <div className="flex gap-2">
                {FIELD_TYPES.map(ft => (
                  <button
                    key={ft.value}
                    onClick={() => addField(ft.value)}
                    className="px-3 py-1 text-sm bg-white rounded hover:bg-white"
                    title={`Add ${ft.label}`}
                  >
                    {ft.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {editingForm.fields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-lg">{FIELD_TYPES.find(t => t.value === field.type)?.icon}</span>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="flex-1 px-3 py-1.5 border rounded text-sm"
                    placeholder="Field label"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>
                  <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700">🗑</button>
                </div>
              ))}
              {editingForm.fields.length === 0 && (
                <p className="text-sm text-black text-center py-4">Click the icons above to add form fields</p>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Expires After (days)</label>
              <input
                type="number"
                value={editingForm.expires_days}
                onChange={(e) => setEditingForm({ ...editingForm, expires_days: parseInt(e.target.value) || 365 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingForm.requires_signature}
                  onChange={(e) => setEditingForm({ ...editingForm, requires_signature: e.target.checked })}
                />
                <span className="text-sm">Requires Signature</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingForm.is_active}
                  onChange={(e) => setEditingForm({ ...editingForm, is_active: e.target.checked })}
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => { setEditingForm(null); setIsCreating(false); }}
              className="px-4 py-2 text-black hover:bg-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveForm}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {isCreating ? 'Create Form' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        /* Form List */
        <div className="bg-white rounded-xl border divide-y">
          {forms.map(form => (
            <div key={form.id} className="p-4 flex items-center justify-between hover:bg-white">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-black">{form.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${form.is_active ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                    {form.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs bg-white text-black px-2 py-0.5 rounded">
                    v{form.version}
                  </span>
                </div>
                <p className="text-sm text-black mt-0.5">{form.description}</p>
                <p className="text-xs text-black mt-1">
                  {form.fields.length} fields • Expires: {form.expires_days} days • Category: {form.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingForm(form)}
                  className="px-3 py-1.5 text-sm text-black hover:bg-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleFormActive(form.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-green-500' : 'bg-white'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_active ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
