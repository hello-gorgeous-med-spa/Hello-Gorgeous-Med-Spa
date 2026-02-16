'use client';

// ============================================================
// ADMIN SERVICES PAGE - Fresha-Style Service Management
// Full CRUD with categories, pricing variants, team assignment
// ============================================================

import { useState, useEffect } from 'react';
import { Breadcrumb, NoDataEmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  category?: { id: string; name: string };
  price_cents?: number;
  price_display?: string;
  duration_minutes: number;
  is_active: boolean;
  requires_consult?: boolean;
  requires_consent?: boolean;
  allow_online_booking?: boolean;
  provider_ids?: string[];
}

interface Provider {
  id: string;
  name: string;
  title?: string;
  color?: string;
}

const DURATION_OPTIONS = [15, 20, 30, 45, 60, 75, 90, 120];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    duration_minutes: 30,
    category_id: '',
    is_active: true,
    requires_consult: false,
    requires_consent: true,
    allow_online_booking: true,
    provider_ids: [] as string[],
  });

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [servicesRes, providersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/providers'),
      ]);

      const servicesData = await servicesRes.json();
      const providersData = await providersRes.json();

      if (servicesData.services) {
        setServices(servicesData.services);
        // Expand all categories by default
        const catIds = new Set((servicesData.categories || []).map((c: Category) => c.id));
        setExpandedCategories(catIds);
      }
      if (servicesData.categories) {
        setCategories(servicesData.categories);
      }
      if (providersData.providers) {
        setProviders(providersData.providers.map((p: any) => ({
          id: p.id,
          name: p.first_name ? `${p.first_name} ${p.last_name}` : p.name || 'Provider',
          title: p.credentials || p.title,
          color: p.color_hex || p.color || '#EC4899',
        })));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load services. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const groupedServices = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category_id === cat.id),
  })).filter(cat => cat.services.length > 0);

  // Uncategorized services
  const uncategorizedServices = services.filter(s => !s.category_id);

  // Search filter
  const filterServices = (serviceList: Service[]) => {
    if (!searchQuery) return serviceList;
    const query = searchQuery.toLowerCase();
    return serviceList.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.short_description?.toLowerCase().includes(query)
    );
  };

  // Toggle category expansion
  const toggleCategory = (catId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(catId)) {
      newExpanded.delete(catId);
    } else {
      newExpanded.add(catId);
    }
    setExpandedCategories(newExpanded);
  };

  // Open edit modal
  const openEdit = (service: Service) => {
    setEditingService(service);
    setEditForm({
      name: service.name || '',
      description: service.description || '',
      short_description: service.short_description || '',
      price: service.price_cents ? service.price_cents / 100 : 0,
      duration_minutes: service.duration_minutes || 30,
      category_id: service.category_id || '',
      is_active: service.is_active ?? true,
      requires_consult: service.requires_consult ?? false,
      requires_consent: service.requires_consent ?? true,
      allow_online_booking: service.allow_online_booking ?? true,
      provider_ids: service.provider_ids || [],
    });
    setMessage(null);
  };

  // Open add modal
  const openAdd = (categoryId?: string) => {
    setEditForm({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      duration_minutes: 30,
      category_id: categoryId || '',
      is_active: true,
      requires_consult: false,
      requires_consent: true,
      allow_online_booking: true,
      provider_ids: [],
    });
    setShowAddModal(true);
    setMessage(null);
  };

  // Save service
  const saveService = async () => {
    if (!editForm.name) {
      setMessage({ type: 'error', text: 'Service name is required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const serviceData = {
        id: editingService?.id,
        name: editForm.name,
        slug: editForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: editForm.description || null,
        short_description: editForm.short_description || null,
        price_cents: Math.round(editForm.price * 100),
        price_display: `$${editForm.price}`,
        duration_minutes: editForm.duration_minutes,
        category_id: editForm.category_id || null,
        is_active: editForm.is_active,
        requires_consult: editForm.requires_consult,
        requires_consent: editForm.requires_consent,
        allow_online_booking: editForm.allow_online_booking,
        provider_ids: editForm.provider_ids.length > 0 ? editForm.provider_ids : null,
      };

      const res = await fetch('/api/services', {
        method: editingService ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setMessage({ type: 'success', text: editingService ? 'Service updated!' : 'Service added!' });
      await fetchData();
      
      setTimeout(() => {
        setEditingService(null);
        setShowAddModal(false);
        setMessage(null);
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save service' });
    } finally {
      setSaving(false);
    }
  };

  // Delete service
  const deleteService = async (service: Service) => {
    if (!confirm(`Delete "${service.name}"?\n\nThis cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/services?id=${service.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  // Toggle active status
  const toggleActive = async (service: Service) => {
    try {
      await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: service.id, is_active: !service.is_active }),
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  // Format price
  const formatPrice = (service: Service) => {
    if (service.price_display) return service.price_display;
    if (service.price_cents) return `$${(service.price_cents / 100).toFixed(0)}`;
    return '$0';
  };

  // Render service row
  const renderService = (service: Service) => {
    const assignedProviders = providers.filter(p => service.provider_ids?.includes(p.id));
    
    return (
      <div
        key={service.id}
        className={`flex items-center justify-between px-4 py-3 border-l-4 hover:bg-white transition-colors ${
          service.is_active ? 'border-pink-400' : 'border-black bg-white'
        }`}
      >
        <div className="flex-1 min-w-0 pl-4">
          <div className="flex items-center gap-2">
            <p className={`font-medium ${service.is_active ? 'text-black' : 'text-black'}`}>
              {service.name}
            </p>
            {!service.is_active && (
              <span className="text-xs bg-white text-black px-2 py-0.5 rounded">Inactive</span>
            )}
            {service.requires_consult && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Consult</span>
            )}
          </div>
          <p className="text-sm text-black">
            {service.duration_minutes}min
            {service.short_description && ` • ${service.short_description}`}
          </p>
          {assignedProviders.length > 0 && (
            <div className="flex gap-1 mt-1">
              {assignedProviders.map(p => (
                <span
                  key={p.id}
                  className="text-[10px] px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.split(' ')[0]}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-semibold text-black min-w-[80px] text-right">
            {formatPrice(service)}
          </span>
          
          {/* Actions dropdown */}
          <div className="relative group">
            <button className="px-3 py-1.5 text-sm text-black hover:bg-white rounded-lg flex items-center gap-1">
              Actions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-black py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => openEdit(service)}
                className="w-full text-left px-4 py-2 text-sm text-black hover:bg-white"
              >
                Edit details
              </button>
              <button
                onClick={() => toggleActive(service)}
                className="w-full text-left px-4 py-2 text-sm text-black hover:bg-white"
              >
                {service.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => deleteService(service)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-2xl font-bold text-black">Services</h1>
          <p className="text-black">Loading your service menu...</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-white rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Services</h1>
          <p className="text-black">
            {services.length} services in {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => openAdd()}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Add Service
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
          <button onClick={fetchData} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black">🔍</span>
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Services by Category */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        {groupedServices.length === 0 && uncategorizedServices.length === 0 ? (
          <div className="p-12 text-center text-black">
            <p className="text-lg mb-2">No services yet</p>
            <p className="text-sm">Add your first service to get started</p>
            <button
              onClick={() => openAdd()}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              + Add Service
            </button>
          </div>
        ) : (
          <>
            {groupedServices.map(category => {
              const filteredCatServices = filterServices(category.services);
              if (filteredCatServices.length === 0 && searchQuery) return null;
              
              return (
                <div key={category.id} className="border-b border-black last:border-0">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transform transition-transform ${expandedCategories.has(category.id) ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                      <span className="font-semibold text-black">{category.name}</span>
                      <span className="text-sm text-black bg-white px-2 py-0.5 rounded-full">
                        {category.services.length}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAdd(category.id);
                      }}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      + Add
                    </button>
                  </button>

                  {/* Services List */}
                  {expandedCategories.has(category.id) && (
                    <div className="divide-y divide-gray-50">
                      {(searchQuery ? filteredCatServices : category.services).map(renderService)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Uncategorized */}
            {filterServices(uncategorizedServices).length > 0 && (
              <div className="border-b border-black last:border-0">
                <div className="px-4 py-4 bg-white">
                  <span className="font-semibold text-black">Uncategorized</span>
                  <span className="ml-2 text-sm text-black bg-white px-2 py-0.5 rounded-full">
                    {uncategorizedServices.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {filterServices(uncategorizedServices).map(renderService)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editingService || showAddModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-black flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                {editingService ? 'Edit service' : 'Add service'}
              </h2>
              <button
                onClick={() => { setEditingService(null); setShowAddModal(false); }}
                className="text-black hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Service name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Botox Treatment"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Category</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">No category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Pricing and Duration */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Pricing and duration</label>
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-black mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-black rounded-lg"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-black mb-1">Duration</label>
                      <select
                        value={editForm.duration_minutes}
                        onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-black rounded-lg"
                      >
                        {DURATION_OPTIONS.map(d => (
                          <option key={d} value={d}>{d} min</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={3}
                  placeholder="Service details..."
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Team members
                  <span className="text-black font-normal ml-1">({editForm.provider_ids.length})</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {providers.map(provider => {
                    const isSelected = editForm.provider_ids.includes(provider.id);
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => {
                          setEditForm(prev => ({
                            ...prev,
                            provider_ids: isSelected
                              ? prev.provider_ids.filter(id => id !== provider.id)
                              : [...prev.provider_ids, provider.id],
                          }));
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-black hover:border-black'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.name.charAt(0)}
                        </div>
                        <span className={isSelected ? 'text-pink-700 font-medium' : 'text-black'}>
                          {provider.name}
                        </span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings Toggles */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Settings</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <div>
                      <span className="font-medium text-black">Online booking</span>
                      <p className="text-xs text-black">Allow clients to book this service online</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, allow_online_booking: !prev.allow_online_booking }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        editForm.allow_online_booking ? 'bg-green-500' : 'bg-white'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        editForm.allow_online_booking ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <div>
                      <span className="font-medium text-black">Requires consultation</span>
                      <p className="text-xs text-black">New clients need a consult first</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, requires_consult: !prev.requires_consult }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        editForm.requires_consult ? 'bg-amber-500' : 'bg-white'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        editForm.requires_consult ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <div>
                      <span className="font-medium text-black">Consent form required</span>
                      <p className="text-xs text-black">Client must sign consent before service</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, requires_consent: !prev.requires_consent }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        editForm.requires_consent ? 'bg-blue-500' : 'bg-white'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        editForm.requires_consent ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <div>
                      <span className="font-medium text-black">Active</span>
                      <p className="text-xs text-black">Show this service in booking</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        editForm.is_active ? 'bg-green-500' : 'bg-white'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        editForm.is_active ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => { setEditingService(null); setShowAddModal(false); }}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Close
              </button>
              <button
                onClick={saveService}
                disabled={saving || !editForm.name}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
