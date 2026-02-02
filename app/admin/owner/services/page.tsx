'use client';

// ============================================================
// SERVICE MANAGEMENT - OWNER CONTROLLED
// Full CRUD for services with all configurations
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  price_cents: number;
  duration_minutes: number;
  buffer_before: number;
  buffer_after: number;
  required_consents: string[];
  required_chart_sections: string[];
  require_before_photo: boolean;
  require_after_photo: boolean;
  required_inventory: { product_id: string; quantity: number }[];
  follow_up_days: number;
  is_active: boolean;
  is_bookable_online: boolean;
  providers: string[];
}

const CONSENT_OPTIONS = [
  'HIPAA Acknowledgment',
  'Neurotoxin Consent',
  'Dermal Filler Consent',
  'Financial Policy',
  'Photo Release',
  'Treatment Consent',
];

const CHART_SECTIONS = [
  'Subjective',
  'Objective',
  'Assessment',
  'Plan',
  'Injection Map',
  'Before/After Photos',
];

const CATEGORIES = [
  'Injectables',
  'Dermal Fillers',
  'Laser Treatments',
  'Skincare',
  'Body Contouring',
  'IV Therapy',
  'Other',
];

export default function ServiceManagementPage() {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services) {
        setServices(data.services.map((s: any) => ({
          id: s.id,
          name: s.name || '',
          description: s.description || '',
          category: s.category?.name || 'Other',
          price_cents: s.price_cents || 0,
          duration_minutes: s.duration_minutes || 30,
          buffer_before: s.buffer_before || 0,
          buffer_after: s.buffer_after || 15,
          required_consents: s.required_consents || [],
          required_chart_sections: s.required_chart_sections || ['Subjective', 'Objective', 'Assessment', 'Plan'],
          require_before_photo: s.require_before_photo || false,
          require_after_photo: s.require_after_photo || false,
          required_inventory: s.required_inventory || [],
          follow_up_days: s.follow_up_days || 14,
          is_active: s.is_active !== false,
          is_bookable_online: s.is_bookable_online !== false,
          providers: s.providers || [],
        })));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewService = () => {
    const newService: ServiceConfig = {
      id: `svc-${Date.now()}`,
      name: '',
      description: '',
      category: 'Other',
      price_cents: 0,
      duration_minutes: 30,
      buffer_before: 0,
      buffer_after: 15,
      required_consents: [],
      required_chart_sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
      require_before_photo: false,
      require_after_photo: false,
      required_inventory: [],
      follow_up_days: 14,
      is_active: true,
      is_bookable_online: true,
      providers: [],
    };
    setEditingService(newService);
    setIsCreating(true);
  };

  const saveService = async () => {
    if (!editingService?.name) {
      setMessage({ type: 'error', text: 'Service name is required' });
      return;
    }

    try {
      if (isCreating) {
        // In production, this would POST to API
        setServices(prev => [...prev, editingService]);
        setMessage({ type: 'success', text: 'Service created!' });
      } else {
        setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
        setMessage({ type: 'success', text: 'Service updated!' });
      }
      
      setEditingService(null);
      setIsCreating(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save service' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleConsent = (consent: string) => {
    if (!editingService) return;
    const consents = editingService.required_consents.includes(consent)
      ? editingService.required_consents.filter(c => c !== consent)
      : [...editingService.required_consents, consent];
    setEditingService({ ...editingService, required_consents: consents });
  };

  const toggleChartSection = (section: string) => {
    if (!editingService) return;
    const sections = editingService.required_chart_sections.includes(section)
      ? editingService.required_chart_sections.filter(s => s !== section)
      : [...editingService.required_chart_sections, section];
    setEditingService({ ...editingService, required_chart_sections: sections });
  };

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  };

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['all', ...new Set(services.map(s => s.category))];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
        <div className="bg-white rounded-xl border p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Services</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-500">{services.length} services • Full configuration control</p>
        </div>
        {!editingService && (
          <button onClick={createNewService} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            + Create Service
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {editingService ? (
        /* Service Editor */
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create Service' : 'Edit Service'}</h2>
            <button onClick={() => { setEditingService(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text"
                value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Botox Treatment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editingService.category}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editingService.description}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-20"
              placeholder="Service description for clients..."
            />
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={(editingService.price_cents / 100).toFixed(0)}
                onChange={(e) => setEditingService({ ...editingService, price_cents: parseFloat(e.target.value) * 100 || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input
                type="number"
                value={editingService.duration_minutes}
                onChange={(e) => setEditingService({ ...editingService, duration_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="5"
                step="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Before (min)</label>
              <input
                type="number"
                value={editingService.buffer_before}
                onChange={(e) => setEditingService({ ...editingService, buffer_before: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer After (min)</label>
              <input
                type="number"
                value={editingService.buffer_after}
                onChange={(e) => setEditingService({ ...editingService, buffer_after: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>

          {/* Required Consents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Consents</label>
            <div className="flex flex-wrap gap-2">
              {CONSENT_OPTIONS.map(consent => (
                <button
                  key={consent}
                  onClick={() => toggleConsent(consent)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    editingService.required_consents.includes(consent)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {consent}
                </button>
              ))}
            </div>
          </div>

          {/* Required Chart Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Chart Sections</label>
            <div className="flex flex-wrap gap-2">
              {CHART_SECTIONS.map(section => (
                <button
                  key={section}
                  onClick={() => toggleChartSection(section)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    editingService.required_chart_sections.includes(section)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Requirements */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={editingService.require_before_photo}
                onChange={(e) => setEditingService({ ...editingService, require_before_photo: e.target.checked })}
                className="w-5 h-5 text-pink-500"
              />
              <div>
                <p className="font-medium">Require Before Photo</p>
                <p className="text-sm text-gray-500">Must capture photo before treatment</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={editingService.require_after_photo}
                onChange={(e) => setEditingService({ ...editingService, require_after_photo: e.target.checked })}
                className="w-5 h-5 text-pink-500"
              />
              <div>
                <p className="font-medium">Require After Photo</p>
                <p className="text-sm text-gray-500">Must capture photo after treatment</p>
              </div>
            </label>
          </div>

          {/* Follow-up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Reminder (days)</label>
              <input
                type="number"
                value={editingService.follow_up_days}
                onChange={(e) => setEditingService({ ...editingService, follow_up_days: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingService.is_active}
                onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingService.is_bookable_online}
                onChange={(e) => setEditingService({ ...editingService, is_bookable_online: e.target.checked })}
              />
              <span>Bookable Online</span>
            </label>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingService(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={saveService} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Create Service' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-xl border divide-y">
            {filteredServices.map(service => (
              <div key={service.id} className={`p-4 hover:bg-gray-50 ${!service.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{service.category}</span>
                      {!service.is_active && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ${(service.price_cents / 100).toFixed(0)} • {service.duration_minutes} min
                      {service.buffer_after > 0 && ` • +${service.buffer_after}min buffer`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {service.required_consents.length > 0 && `${service.required_consents.length} consents • `}
                      {service.require_before_photo && 'Before photo • '}
                      {service.require_after_photo && 'After photo • '}
                      {service.follow_up_days > 0 && `${service.follow_up_days}d follow-up`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingService(service)} className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(service.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${service.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${service.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
