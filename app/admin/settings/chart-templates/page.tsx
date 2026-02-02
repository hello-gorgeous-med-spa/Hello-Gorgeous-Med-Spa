'use client';

// ============================================================
// CHART TEMPLATE EDITOR - Customize SOAP Note Sections
// Owner can add, remove, modify charting fields per service type
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface ChartField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox' | 'injection_map';
  required: boolean;
  options?: string[];
  placeholder?: string;
  unit?: string;
}

interface ChartSection {
  id: string;
  name: string;
  code: 'S' | 'O' | 'A' | 'P' | 'custom';
  fields: ChartField[];
}

interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  service_types: string[];
  sections: ChartSection[];
  require_lot_tracking: boolean;
  require_before_photo: boolean;
  require_after_photo: boolean;
  is_active: boolean;
}

const DEFAULT_TEMPLATES: ChartTemplate[] = [
  {
    id: 'tpl-injectable',
    name: 'Injectable Treatment',
    description: 'For Botox, Dysport, Jeuveau',
    service_types: ['Injectables', 'BOTOX'],
    sections: [
      {
        id: 's1',
        name: 'Subjective',
        code: 'S',
        fields: [
          { id: 'f1', label: 'Chief Complaint', type: 'textarea', required: true, placeholder: 'Patient presents with...' },
          { id: 'f2', label: 'Treatment Goals', type: 'textarea', required: true, placeholder: 'Patient desires...' },
          { id: 'f3', label: 'Previous Treatments', type: 'textarea', required: false },
        ],
      },
      {
        id: 's2',
        name: 'Objective',
        code: 'O',
        fields: [
          { id: 'f4', label: 'Areas Treated', type: 'checkbox', required: true, options: ['Glabella', 'Forehead', 'Crow\'s Feet', 'Bunny Lines', 'Lip Flip', 'Masseter', 'Neck Bands'] },
          { id: 'f5', label: 'Product Used', type: 'select', required: true, options: ['Botox', 'Dysport', 'Jeuveau', 'Xeomin'] },
          { id: 'f6', label: 'Total Units', type: 'number', required: true, unit: 'units' },
          { id: 'f7', label: 'Lot Number', type: 'text', required: true },
          { id: 'f8', label: 'Expiration Date', type: 'text', required: true },
          { id: 'f9', label: 'Injection Sites', type: 'injection_map', required: false },
        ],
      },
      {
        id: 's3',
        name: 'Assessment',
        code: 'A',
        fields: [
          { id: 'f10', label: 'Clinical Assessment', type: 'textarea', required: true, placeholder: 'Moderate dynamic rhytids...' },
          { id: 'f11', label: 'Treatment Tolerance', type: 'select', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
        ],
      },
      {
        id: 's4',
        name: 'Plan',
        code: 'P',
        fields: [
          { id: 'f12', label: 'Post-Care Instructions Given', type: 'checkbox', required: true, options: ['No rubbing 4 hours', 'No exercise 24 hours', 'No lying down 4 hours', 'Ice PRN'] },
          { id: 'f13', label: 'Follow-Up', type: 'select', required: true, options: ['2 weeks touch-up', '3-4 months maintenance', 'As needed', 'Call with concerns'] },
          { id: 'f14', label: 'Additional Notes', type: 'textarea', required: false },
        ],
      },
    ],
    require_lot_tracking: true,
    require_before_photo: true,
    require_after_photo: false,
    is_active: true,
  },
  {
    id: 'tpl-filler',
    name: 'Dermal Filler Treatment',
    description: 'For lip, cheek, jawline fillers',
    service_types: ['Dermal Fillers', 'DERMAL FILLERS'],
    sections: [
      {
        id: 's1',
        name: 'Subjective',
        code: 'S',
        fields: [
          { id: 'f1', label: 'Chief Complaint', type: 'textarea', required: true },
          { id: 'f2', label: 'Treatment Goals', type: 'textarea', required: true },
          { id: 'f3', label: 'Previous Filler History', type: 'textarea', required: false },
        ],
      },
      {
        id: 's2',
        name: 'Objective',
        code: 'O',
        fields: [
          { id: 'f4', label: 'Areas Treated', type: 'checkbox', required: true, options: ['Lips', 'Nasolabial Folds', 'Marionette Lines', 'Cheeks', 'Chin', 'Jawline', 'Under Eyes', 'Temples'] },
          { id: 'f5', label: 'Product Used', type: 'select', required: true, options: ['Juvederm Ultra', 'Juvederm Voluma', 'Restylane', 'Restylane Lyft', 'RHA', 'Sculptra'] },
          { id: 'f6', label: 'Volume Used', type: 'number', required: true, unit: 'mL' },
          { id: 'f7', label: 'Lot Number', type: 'text', required: true },
          { id: 'f8', label: 'Expiration Date', type: 'text', required: true },
          { id: 'f9', label: 'Technique', type: 'select', required: true, options: ['Needle', 'Cannula', 'Both'] },
        ],
      },
      {
        id: 's3',
        name: 'Assessment',
        code: 'A',
        fields: [
          { id: 'f10', label: 'Clinical Assessment', type: 'textarea', required: true },
          { id: 'f11', label: 'Immediate Results', type: 'select', required: true, options: ['As expected', 'Minor asymmetry - will settle', 'Touch-up recommended'] },
        ],
      },
      {
        id: 's4',
        name: 'Plan',
        code: 'P',
        fields: [
          { id: 'f12', label: 'Post-Care Instructions', type: 'checkbox', required: true, options: ['Ice 10 min/hour', 'Avoid makeup 24h', 'No strenuous exercise 48h', 'Sleep elevated', 'Arnica PRN'] },
          { id: 'f13', label: 'Follow-Up', type: 'select', required: true, options: ['2 weeks check', '4-6 weeks touch-up', '6-12 months maintenance'] },
          { id: 'f14', label: 'Additional Notes', type: 'textarea', required: false },
        ],
      },
    ],
    require_lot_tracking: true,
    require_before_photo: true,
    require_after_photo: true,
    is_active: true,
  },
];

export default function ChartTemplatesPage() {
  const [templates, setTemplates] = useState<ChartTemplate[]>(DEFAULT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<ChartTemplate | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveTemplate = () => {
    if (!editingTemplate) return;
    
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setMessage({ type: 'success', text: 'Template saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const addField = (sectionId: string, type: string) => {
    if (!editingTemplate) return;
    
    const newField: ChartField = {
      id: `field-${Date.now()}`,
      label: '',
      type: type as any,
      required: false,
    };

    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections.map(s =>
        s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      ),
    });
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<ChartField>) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
          : s
      ),
    });
  };

  const removeField = (sectionId: string, fieldId: string) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      sections: editingTemplate.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      ),
    });
  };

  const toggleActive = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
  };

  const FIELD_TYPES = [
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'textarea', label: 'Long Text', icon: '📄' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Chart Templates</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Chart Templates</h1>
          <p className="text-gray-500">Customize SOAP note fields for each service type</p>
        </div>
        {editingTemplate && (
          <button onClick={saveTemplate} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            Save Template
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {editingTemplate ? (
        /* Template Editor */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{editingTemplate.name}</h2>
              <p className="text-sm text-gray-500">{editingTemplate.description}</p>
            </div>
            <button onClick={() => setEditingTemplate(null)} className="text-gray-500 hover:text-gray-700">
              ← Back to list
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-medium mb-3">Template Settings</h3>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTemplate.require_lot_tracking}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, require_lot_tracking: e.target.checked })}
                />
                <span className="text-sm">Require lot tracking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTemplate.require_before_photo}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, require_before_photo: e.target.checked })}
                />
                <span className="text-sm">Require before photo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTemplate.require_after_photo}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, require_after_photo: e.target.checked })}
                />
                <span className="text-sm">Require after photo</span>
              </label>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-2 gap-6">
            {editingTemplate.sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl border overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                      {section.code}
                    </span>
                    <span className="font-semibold">{section.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {FIELD_TYPES.map(ft => (
                      <button
                        key={ft.value}
                        onClick={() => addField(section.id, ft.value)}
                        className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
                        title={ft.label}
                      >
                        {ft.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y max-h-80 overflow-y-auto">
                  {section.fields.map(field => (
                    <div key={field.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                          className="flex-1 px-2 py-1 border rounded text-sm"
                          placeholder="Field label"
                        />
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                          />
                          Req
                        </label>
                        <button onClick={() => removeField(section.id, field.id)} className="text-red-400 hover:text-red-600">🗑</button>
                      </div>
                      {['select', 'checkbox'].includes(field.type) && (
                        <input
                          type="text"
                          value={(field.options || []).join(', ')}
                          onChange={(e) => updateField(section.id, field.id, { options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })}
                          className="w-full px-2 py-1 border rounded text-xs text-gray-500"
                          placeholder="Options (comma-separated)"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Templates List */
        <div className="bg-white rounded-xl border divide-y">
          {templates.map(template => (
            <div key={template.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${template.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {template.sections.length} sections • {template.sections.reduce((a, s) => a + s.fields.length, 0)} fields
                    {template.require_lot_tracking && ' • Lot tracking'}
                    {template.require_before_photo && ' • Before photo'}
                    {template.require_after_photo && ' • After photo'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingTemplate(template)} className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(template.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${template.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${template.is_active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
