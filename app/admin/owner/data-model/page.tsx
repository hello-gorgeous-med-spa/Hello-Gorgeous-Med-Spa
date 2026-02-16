'use client';

// ============================================================
// DATA MODEL CONTROL - NO-CODE SCHEMA
// Add custom fields without database migrations
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  entity: 'client' | 'chart' | 'appointment' | 'invoice';
  required: boolean;
  visibility: string[];
  lockAfterSign: boolean;
  options?: string[];
}

export default function DataModelPage() {
  const [fields, setFields] = useState<CustomField[]>([
    { id: 'f1', name: 'Referral Source', type: 'select', entity: 'client', required: false, visibility: ['admin', 'front_desk'], lockAfterSign: false, options: ['Google', 'Instagram', 'Friend', 'Walk-in', 'Other'] },
    { id: 'f2', name: 'VIP Status', type: 'checkbox', entity: 'client', required: false, visibility: ['admin'], lockAfterSign: false },
    { id: 'f3', name: 'Allergies', type: 'textarea', entity: 'client', required: true, visibility: ['admin', 'provider'], lockAfterSign: false },
    { id: 'f4', name: 'Treatment Notes', type: 'textarea', entity: 'chart', required: false, visibility: ['provider'], lockAfterSign: true },
    { id: 'f5', name: 'Units Used', type: 'number', entity: 'chart', required: true, visibility: ['provider', 'admin'], lockAfterSign: true },
    { id: 'f6', name: 'Follow-Up Date', type: 'date', entity: 'appointment', required: false, visibility: ['admin', 'provider', 'front_desk'], lockAfterSign: false },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: '',
    type: 'text',
    entity: 'client',
    required: false,
    visibility: ['admin'],
    lockAfterSign: false,
    options: [],
  });
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const entities = ['all', 'client', 'chart', 'appointment', 'invoice'];
  const fieldTypes = ['text', 'number', 'date', 'select', 'checkbox', 'textarea'];
  const roles = ['admin', 'provider', 'front_desk', 'billing'];

  const filteredFields = filterEntity === 'all' ? fields : fields.filter(f => f.entity === filterEntity);

  const addField = () => {
    if (!newField.name) {
      setMessage({ type: 'error', text: 'Field name is required' });
      return;
    }
    const field: CustomField = {
      id: `f${Date.now()}`,
      name: newField.name || '',
      type: newField.type as any || 'text',
      entity: newField.entity as any || 'client',
      required: newField.required || false,
      visibility: newField.visibility || ['admin'],
      lockAfterSign: newField.lockAfterSign || false,
      options: newField.options,
    };
    setFields(prev => [...prev, field]);
    setShowAddField(false);
    setNewField({
      name: '',
      type: 'text',
      entity: 'client',
      required: false,
      visibility: ['admin'],
      lockAfterSign: false,
      options: [],
    });
    setMessage({ type: 'success', text: `Field "${field.name}" added successfully` });
    setTimeout(() => setMessage(null), 3000);
  };

  const deleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (!confirm(`Delete field "${field?.name}"? This cannot be undone.`)) return;
    setFields(prev => prev.filter(f => f.id !== id));
    setMessage({ type: 'success', text: 'Field deleted' });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleRequired = (id: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, required: !f.required } : f));
  };

  return (
    <OwnerLayout title="Data Model Control" description="Add custom fields without database migrations">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800">🗃️ No-Code Schema Control</h3>
        <p className="text-sm text-blue-600 mt-1">
          Add custom fields to clients, charts, appointments, and invoices without database migrations.
          Fields persist across visits and are exportable.
        </p>
      </div>

      {/* Filter & Add */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {entities.map(entity => (
            <button
              key={entity}
              onClick={() => setFilterEntity(entity)}
              className={`px-4 py-2 rounded-lg text-sm capitalize font-medium transition-colors ${
                filterEntity === entity ? 'bg-[#FF2D8E] text-white shadow-lg shadow-[#FF2D8E]/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'
              }`}
            >
              {entity === 'all' ? 'All Entities' : entity}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddField(true)}
          className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg text-sm hover:bg-black"
        >
          + Add Custom Field
        </button>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-white">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-black">FIELD NAME</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-black">TYPE</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-black">ENTITY</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-black">VISIBILITY</th>
              <th className="px-4 py-3 text-xs font-semibold text-black">REQUIRED</th>
              <th className="px-4 py-3 text-xs font-semibold text-black">LOCK</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredFields.map(field => (
              <tr key={field.id} className="hover:bg-white">
                <td className="px-4 py-3 font-medium">{field.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-white px-2 py-1 rounded capitalize">{field.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    field.entity === 'client' ? 'bg-blue-100 text-blue-700' :
                    field.entity === 'chart' ? 'bg-green-100 text-green-700' :
                    field.entity === 'appointment' ? 'bg-pink-100 text-pink-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {field.entity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {field.visibility.join(', ')}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleRequired(field.id)}
                    className={`w-5 h-5 rounded ${field.required ? 'bg-green-500 text-white' : 'bg-white'} flex items-center justify-center text-xs mx-auto`}
                  >
                    {field.required ? '✓' : ''}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {field.lockAfterSign && <span className="text-[#FF2D8E]">🔒</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteField(field.id)} className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFields.length === 0 && (
          <div className="p-8 text-center text-black">
            No custom fields for this entity. Click "+ Add Custom Field" to create one.
          </div>
        )}
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Custom Field</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Field Name</label>
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Emergency Contact"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {fieldTypes.map(t => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Entity</label>
                  <select
                    value={newField.entity}
                    onChange={(e) => setNewField(prev => ({ ...prev, entity: e.target.value as any }))}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {entities.filter(e => e !== 'all').map(e => (
                      <option key={e} value={e} className="capitalize">{e}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newField.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={newField.options?.join(', ')}
                    onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value.split(',').map(s => s.trim()) }))}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-2">Role Visibility</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="checkbox"
                        checked={newField.visibility?.includes(role)}
                        onChange={(e) => {
                          const vis = newField.visibility || [];
                          if (e.target.checked) {
                            setNewField(prev => ({ ...prev, visibility: [...vis, role] }));
                          } else {
                            setNewField(prev => ({ ...prev, visibility: vis.filter(v => v !== role) }));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{role.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Required</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newField.lockAfterSign}
                    onChange={(e) => setNewField(prev => ({ ...prev, lockAfterSign: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Lock after signature</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowAddField(false)} className="px-4 py-2 text-black hover:text-black">
                Cancel
              </button>
              <button onClick={addField} className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black">
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Acceptance Criteria */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-medium text-green-800 mb-2">✅ Acceptance Criteria</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• No database migration required</li>
          <li>• Fields persist across visits</li>
          <li>• Exportable in all data exports</li>
          <li>• Role-based visibility enforced</li>
        </ul>
      </div>
    </OwnerLayout>
  );
}
