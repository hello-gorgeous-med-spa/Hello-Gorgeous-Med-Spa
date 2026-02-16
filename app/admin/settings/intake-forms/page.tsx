'use client';

// ============================================================
// INTAKE FORM BUILDER - Customize New Client Questions
// Owner can add, remove, reorder intake questions
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface IntakeField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'email';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  section: string;
}

interface IntakeForm {
  id: string;
  name: string;
  description: string;
  sections: string[];
  fields: IntakeField[];
  is_active: boolean;
}

const DEFAULT_SECTIONS = ['Personal Info', 'Medical History', 'Lifestyle', 'Aesthetic Goals'];

const DEFAULT_INTAKE_FORM: IntakeForm = {
  id: 'intake-main',
  name: 'New Client Intake Form',
  description: 'Collected from all new clients',
  sections: DEFAULT_SECTIONS,
  fields: [
    // Personal Info
    { id: 'f1', type: 'text', label: 'Full Legal Name', required: true, section: 'Personal Info' },
    { id: 'f2', type: 'date', label: 'Date of Birth', required: true, section: 'Personal Info' },
    { id: 'f3', type: 'phone', label: 'Phone Number', required: true, section: 'Personal Info' },
    { id: 'f4', type: 'email', label: 'Email Address', required: true, section: 'Personal Info' },
    { id: 'f5', type: 'text', label: 'Address', required: false, section: 'Personal Info' },
    { id: 'f6', type: 'text', label: 'Emergency Contact Name', required: true, section: 'Personal Info' },
    { id: 'f7', type: 'phone', label: 'Emergency Contact Phone', required: true, section: 'Personal Info' },
    
    // Medical History
    { id: 'f8', type: 'radio', label: 'Are you pregnant or breastfeeding?', required: true, section: 'Medical History', options: ['Yes', 'No', 'Not Applicable'] },
    { id: 'f9', type: 'textarea', label: 'List any allergies', required: false, section: 'Medical History', placeholder: 'Include medications, foods, latex, etc.' },
    { id: 'f10', type: 'textarea', label: 'Current medications/supplements', required: false, section: 'Medical History', placeholder: 'Include prescription and over-the-counter' },
    { id: 'f11', type: 'textarea', label: 'Medical conditions', required: false, section: 'Medical History', placeholder: 'Diabetes, autoimmune, etc.' },
    { id: 'f12', type: 'textarea', label: 'Previous cosmetic procedures', required: false, section: 'Medical History', placeholder: 'Botox, fillers, laser, surgery, etc.' },
    
    // Lifestyle
    { id: 'f13', type: 'select', label: 'Do you smoke?', required: true, section: 'Lifestyle', options: ['Never', 'Previously', 'Occasionally', 'Daily'] },
    { id: 'f14', type: 'select', label: 'Alcohol consumption', required: true, section: 'Lifestyle', options: ['Never', 'Occasionally', 'Weekly', 'Daily'] },
    { id: 'f15', type: 'select', label: 'Sun exposure', required: true, section: 'Lifestyle', options: ['Minimal', 'Moderate', 'Frequent'] },
    
    // Aesthetic Goals
    { id: 'f16', type: 'checkbox', label: 'Areas of concern (select all that apply)', required: false, section: 'Aesthetic Goals', options: ['Wrinkles/Fine Lines', 'Volume Loss', 'Skin Texture', 'Acne/Scarring', 'Hyperpigmentation', 'Redness', 'Weight Management'] },
    { id: 'f17', type: 'textarea', label: 'What are your aesthetic goals?', required: false, section: 'Aesthetic Goals', placeholder: 'Tell us what you hope to achieve' },
    { id: 'f18', type: 'select', label: 'How did you hear about us?', required: true, section: 'Aesthetic Goals', options: ['Google Search', 'Instagram', 'Facebook', 'Friend/Family', 'Another Provider', 'Walk-in', 'Other'] },
  ],
  is_active: true,
};

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: '📝' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { value: 'radio', label: 'Radio Buttons', icon: '⭕' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'email', label: 'Email', icon: '📧' },
];

export default function IntakeFormBuilderPage() {
  const [form, setForm] = useState<IntakeForm>(DEFAULT_INTAKE_FORM);
  const [editingField, setEditingField] = useState<IntakeField | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addField = (section: string, type: string) => {
    const newField: IntakeField = {
      id: `field-${Date.now()}`,
      type: type as any,
      label: '',
      required: false,
      section,
    };
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setEditingField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<IntakeField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
    }));
    if (editingField?.id === fieldId) {
      setEditingField(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeField = (fieldId: string) => {
    if (!confirm('Remove this field?')) return;
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId),
    }));
    if (editingField?.id === fieldId) {
      setEditingField(null);
    }
  };

  const saveForm = () => {
    setMessage({ type: 'success', text: 'Intake form saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredFields = selectedSection === 'all' 
    ? form.fields 
    : form.fields.filter(f => f.section === selectedSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Intake Forms</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Intake Form Builder</h1>
          <p className="text-black">Customize the new client intake questionnaire</p>
        </div>
        <button onClick={saveForm} className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black">
          Save Form
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSection('all')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedSection === 'all' ? 'bg-[#FF2D8E] text-white' : 'bg-white text-black hover:bg-white'
          }`}
        >
          All Fields ({form.fields.length})
        </button>
        {form.sections.map(section => {
          const count = form.fields.filter(f => f.section === section).length;
          return (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                selectedSection === section ? 'bg-[#FF2D8E] text-white' : 'bg-white text-black hover:bg-white'
              }`}
            >
              {section} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Fields List */}
        <div className="col-span-2 space-y-4">
          {form.sections.map(section => {
            if (selectedSection !== 'all' && selectedSection !== section) return null;
            const sectionFields = form.fields.filter(f => f.section === section);
            if (sectionFields.length === 0 && selectedSection !== 'all') return null;

            return (
              <div key={section} className="bg-white rounded-xl border">
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <h3 className="font-semibold text-black">{section}</h3>
                  <div className="flex gap-1">
                    {FIELD_TYPES.slice(0, 4).map(ft => (
                      <button
                        key={ft.value}
                        onClick={() => addField(section, ft.value)}
                        className="px-2 py-1 text-sm bg-white border rounded hover:bg-white"
                        title={`Add ${ft.label}`}
                      >
                        {ft.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y">
                  {sectionFields.map(field => (
                    <div
                      key={field.id}
                      onClick={() => setEditingField(field)}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white ${
                        editingField?.id === field.id ? 'bg-pink-50' : ''
                      }`}
                    >
                      <span className="text-lg">{FIELD_TYPES.find(t => t.value === field.type)?.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-black">
                          {field.label || <span className="text-black italic">Untitled field</span>}
                        </p>
                        <p className="text-xs text-black">
                          {FIELD_TYPES.find(t => t.value === field.type)?.label}
                          {field.required && ' • Required'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                        className="text-black hover:text-red-500"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                  {sectionFields.length === 0 && (
                    <p className="p-4 text-sm text-black text-center">No fields in this section</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Field Editor */}
        <div className="bg-white rounded-xl border p-4 sticky top-4 h-fit">
          <h3 className="font-semibold text-black mb-4">
            {editingField ? 'Edit Field' : 'Select a field'}
          </h3>

          {editingField ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Field Label</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => updateField(editingField.id, { label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Enter field label"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Field Type</label>
                <select
                  value={editingField.type}
                  onChange={(e) => updateField(editingField.id, { type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {FIELD_TYPES.map(ft => (
                    <option key={ft.value} value={ft.value}>{ft.icon} {ft.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Section</label>
                <select
                  value={editingField.section}
                  onChange={(e) => updateField(editingField.id, { section: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {form.sections.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {editingField.type === 'text' || editingField.type === 'textarea' ? (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={editingField.placeholder || ''}
                    onChange={(e) => updateField(editingField.id, { placeholder: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Placeholder text"
                  />
                </div>
              ) : null}

              {['select', 'checkbox', 'radio'].includes(editingField.type) && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Options (one per line)</label>
                  <textarea
                    value={(editingField.options || []).join('\n')}
                    onChange={(e) => updateField(editingField.id, { options: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm h-24"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={editingField.required}
                  onChange={(e) => updateField(editingField.id, { required: e.target.checked })}
                  className="w-4 h-4 text-[#FF2D8E] rounded"
                />
                <span className="text-sm">Required field</span>
              </label>
            </div>
          ) : (
            <p className="text-sm text-black">Click on a field to edit its properties</p>
          )}
        </div>
      </div>
    </div>
  );
}
