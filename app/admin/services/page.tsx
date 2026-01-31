'use client';

// ============================================================
// ADMIN SERVICES PAGE
// Full CRUD for services - Edit name, description, price, 
// duration, category, and provider assignments
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { useServicesWithStats } from '@/lib/supabase/hooks';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  serviceCount?: number;
}

interface Provider {
  id: string;
  name: string;
  title?: string;
  color?: string;
}

interface Service {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  category?: { id: string; name: string };
  price: number;
  price_cents?: number;
  price_display?: string;
  duration_minutes: number;
  buffer_minutes?: number;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
  is_active: boolean;
  requires_consultation?: boolean;
  requires_consult?: boolean;
  requires_consent?: boolean;
  provider_ids?: string[];
  deposit_required?: boolean;
  deposit_amount_cents?: number;
  allow_online_booking?: boolean;
}

interface EditFormData {
  name: string;
  description: string;
  short_description: string;
  price: number;
  duration_minutes: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  category_id: string;
  is_active: boolean;
  requires_consult: boolean;
  requires_consent: boolean;
  allow_online_booking: boolean;
  deposit_required: boolean;
  deposit_amount: number;
  provider_ids: string[];
}

export default function AdminServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form state for editing
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    duration_minutes: 30,
    buffer_before_minutes: 0,
    buffer_after_minutes: 0,
    category_id: '',
    is_active: true,
    requires_consult: false,
    requires_consent: true,
    allow_online_booking: true,
    deposit_required: false,
    deposit_amount: 0,
    provider_ids: [],
  });
  
  // Fetch services with live data
  const { services, loading, error, refetch } = useServicesWithStats();

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      if (!isSupabaseConfigured()) {
        setCategories([
          { id: 'botox', name: 'Botox & Neurotoxins', slug: 'botox' },
          { id: 'fillers', name: 'Dermal Fillers', slug: 'fillers' },
          { id: 'weight-loss', name: 'Weight Loss', slug: 'weight-loss' },
          { id: 'facials', name: 'Facials & Skin', slug: 'facials' },
          { id: 'iv-therapy', name: 'IV Therapy', slug: 'iv-therapy' },
          { id: 'lash', name: 'Lash Services', slug: 'lash' },
          { id: 'brow', name: 'Brow Services', slug: 'brow' },
        ]);
        return;
      }

      try {
        const { data } = await supabase
          .from('service_categories')
          .select('*')
          .order('name');
        
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }

    fetchCategories();
  }, []);

  // Fetch providers
  useEffect(() => {
    async function fetchProviders() {
      if (!isSupabaseConfigured()) {
        setProviders([
          { id: 'danielle-001', name: 'Danielle Glazier-Alcala', title: 'Owner & Aesthetic Specialist', color: '#EC4899' },
          { id: 'ryan-001', name: 'Ryan Kent', title: 'APRN, FNP-BC', color: '#8B5CF6' },
        ]);
        return;
      }

      try {
        const { data } = await supabase
          .from('providers')
          .select(`
            id,
            color_hex,
            credentials,
            users!inner(first_name, last_name)
          `)
          .eq('is_active', true);
        
        if (data) {
          // Filter to only show actual providers (Ryan and Danielle)
          const actualProviders = data.filter((p: any) => {
            const firstName = p.users.first_name?.toLowerCase() || '';
            return firstName === 'ryan' || firstName === 'danielle';
          });

          setProviders(actualProviders.map((p: any) => ({
            id: p.id,
            name: `${p.users.first_name} ${p.users.last_name}`,
            title: p.credentials,
            color: p.color_hex || '#EC4899',
          })));
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      }
    }

    fetchProviders();
  }, []);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return services;
    return services.filter((s: Service) => s.category_id === selectedCategory);
  }, [services, selectedCategory]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: services.length,
    categories: categories.length,
    bookable: services.filter((s: Service) => s.is_active).length,
    requiresConsult: services.filter((s: Service) => s.requires_consultation || s.requires_consult).length,
  }), [services, categories]);

  // Format price
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Open edit modal
  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setEditForm({
      name: service.name || '',
      description: service.description || '',
      short_description: service.short_description || '',
      price: service.price_cents ? service.price_cents / 100 : service.price || 0,
      duration_minutes: service.duration_minutes || 30,
      buffer_before_minutes: service.buffer_before_minutes || 0,
      buffer_after_minutes: service.buffer_after_minutes || service.buffer_minutes || 0,
      category_id: service.category_id || '',
      is_active: service.is_active ?? true,
      requires_consult: service.requires_consult ?? service.requires_consultation ?? false,
      requires_consent: service.requires_consent ?? true,
      allow_online_booking: service.allow_online_booking ?? true,
      deposit_required: service.deposit_required ?? false,
      deposit_amount: service.deposit_amount_cents ? service.deposit_amount_cents / 100 : 0,
      provider_ids: service.provider_ids || [],
    });
    setSaveMessage(null);
  };

  // Save service changes
  const handleSaveService = async () => {
    if (!editingService || !isSupabaseConfigured()) {
      alert('Connect Supabase to save changes');
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const updateData: any = {
        name: editForm.name,
        slug: generateSlug(editForm.name),
        description: editForm.description,
        short_description: editForm.short_description,
        price_cents: Math.round(editForm.price * 100),
        price_display: `$${editForm.price}`,
        duration_minutes: editForm.duration_minutes,
        buffer_before_minutes: editForm.buffer_before_minutes,
        buffer_after_minutes: editForm.buffer_after_minutes,
        category_id: editForm.category_id || null,
        is_active: editForm.is_active,
        requires_consult: editForm.requires_consult,
        requires_consent: editForm.requires_consent,
        allow_online_booking: editForm.allow_online_booking,
        deposit_required: editForm.deposit_required,
        deposit_amount_cents: editForm.deposit_required ? Math.round(editForm.deposit_amount * 100) : null,
        provider_ids: editForm.provider_ids.length > 0 ? editForm.provider_ids : null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', editingService.id);

      if (updateError) {
        throw updateError;
      }

      setSaveMessage({ type: 'success', text: 'Service updated successfully!' });
      
      // Refresh services list
      if (refetch) {
        await refetch();
      }
      
      // Close modal after short delay
      setTimeout(() => {
        setEditingService(null);
        setSaveMessage(null);
      }, 1500);

    } catch (err: any) {
      console.error('Error saving service:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save service' });
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle service active status
  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    if (!isSupabaseConfigured()) {
      alert('Connect Supabase to update services');
      return;
    }

    try {
      await supabase
        .from('services')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', serviceId);
      
      if (refetch) {
        await refetch();
      }
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  // Handle delete service
  const handleDeleteService = async (service: Service) => {
    if (!isSupabaseConfigured()) {
      alert('Connect Supabase to delete services');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      if (refetch) {
        await refetch();
      }
    } catch (err: any) {
      console.error('Error deleting service:', err);
      alert(`Failed to delete service: ${err.message}`);
    }
  };

  // Toggle provider assignment
  const toggleProvider = (providerId: string) => {
    setEditForm(prev => ({
      ...prev,
      provider_ids: prev.provider_ids.includes(providerId)
        ? prev.provider_ids.filter(id => id !== providerId)
        : [...prev.provider_ids, providerId],
    }));
  };

  // Add new service
  const handleAddService = async () => {
    if (!isSupabaseConfigured()) {
      alert('Connect Supabase to add services');
      return;
    }

    setSaving(true);
    try {
      const newService = {
        name: editForm.name,
        slug: generateSlug(editForm.name),
        description: editForm.description,
        short_description: editForm.short_description,
        price_cents: Math.round(editForm.price * 100),
        price_display: `$${editForm.price}`,
        duration_minutes: editForm.duration_minutes,
        buffer_before_minutes: editForm.buffer_before_minutes,
        buffer_after_minutes: editForm.buffer_after_minutes,
        category_id: editForm.category_id || null,
        is_active: editForm.is_active,
        requires_consult: editForm.requires_consult,
        requires_consent: editForm.requires_consent,
        allow_online_booking: editForm.allow_online_booking,
        deposit_required: editForm.deposit_required,
        deposit_amount_cents: editForm.deposit_required ? Math.round(editForm.deposit_amount * 100) : null,
        provider_ids: editForm.provider_ids.length > 0 ? editForm.provider_ids : null,
      };

      const { error: insertError } = await supabase
        .from('services')
        .insert(newService);

      if (insertError) throw insertError;

      setShowAddModal(false);
      resetForm();
      if (refetch) await refetch();
    } catch (err: any) {
      console.error('Error adding service:', err);
      alert(`Failed to add service: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditForm({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      duration_minutes: 30,
      buffer_before_minutes: 0,
      buffer_after_minutes: 0,
      category_id: '',
      is_active: true,
      requires_consult: false,
      requires_consent: true,
      allow_online_booking: true,
      deposit_required: false,
      deposit_amount: 0,
      provider_ids: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500">Manage your service menu, pricing, providers, and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to manage real services
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Services</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Online Bookable</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">{stats.bookable}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Require Consult</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-amber-600">{stats.requiresConsult}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-pink-50 text-pink-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Services ({services.length})
            </button>
            {categories.map((cat) => {
              const catServiceCount = services.filter((s: Service) => s.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-pink-50 text-pink-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400">{catServiceCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : 'All Services'}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No services found in this category
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredServices.map((service: Service) => {
                // Get assigned provider names
                const assignedProviders = service.provider_ids
                  ? providers.filter(p => service.provider_ids?.includes(p.id))
                  : [];
                
                return (
                  <div
                    key={service.id}
                    className="px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          {(service.requires_consultation || service.requires_consult) && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                              Consult
                            </span>
                          )}
                          {service.requires_consent && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
                              Consent
                            </span>
                          )}
                          {!service.is_active && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.duration_minutes} min
                          {service.category?.name && ` • ${service.category.name}`}
                        </p>
                        {/* Show assigned providers */}
                        {assignedProviders.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {assignedProviders.map(p => (
                              <span
                                key={p.id}
                                className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full text-white"
                                style={{ backgroundColor: p.color || '#6B7280' }}
                              >
                                {p.name.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(service.price_cents ? service.price_cents / 100 : service.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(service)}
                            className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service)}
                            className="px-2 py-1.5 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete service"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleActive(service.id, service.is_active)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              service.is_active ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            title={service.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                service.is_active ? 'right-1' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
              <button
                onClick={() => setEditingService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Save Message */}
            {saveMessage && (
              <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
                saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {saveMessage.text}
              </div>
            )}

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., Botox Treatment"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editForm.short_description}
                  onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Brief tagline for this service"
                  maxLength={200}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  rows={3}
                  placeholder="Detailed service description..."
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    value={editForm.duration_minutes}
                    onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    min="5"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buffer After (min)</label>
                  <input
                    type="number"
                    value={editForm.buffer_after_minutes}
                    onChange={(e) => setEditForm({ ...editForm, buffer_after_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    min="0"
                    step="5"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Provider Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Performs This Service?
                </label>
                <div className="flex flex-wrap gap-2">
                  {providers.map((provider) => {
                    const isSelected = editForm.provider_ids.includes(provider.id);
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => toggleProvider(provider.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className={`font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                            {provider.name}
                          </span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {provider.title && (
                          <p className="text-xs text-gray-500 mt-0.5">{provider.title}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
                {editForm.provider_ids.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    No providers selected - all providers will be shown for this service
                  </p>
                )}
              </div>

              {/* Deposit Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.deposit_required}
                    onChange={(e) => setEditForm({ ...editForm, deposit_required: e.target.checked })}
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Require Deposit</span>
                </label>
                {editForm.deposit_required && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">Deposit Amount ($)</label>
                    <input
                      type="number"
                      value={editForm.deposit_amount}
                      onChange={(e) => setEditForm({ ...editForm, deposit_amount: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Active</span>
                    <p className="text-xs text-gray-500">Show in booking</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.allow_online_booking}
                    onChange={(e) => setEditForm({ ...editForm, allow_online_booking: e.target.checked })}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Online Booking</span>
                    <p className="text-xs text-gray-500">Allow online</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requires_consult}
                    onChange={(e) => setEditForm({ ...editForm, requires_consult: e.target.checked })}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Consult Required</span>
                    <p className="text-xs text-gray-500">New clients only</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requires_consent}
                    onChange={(e) => setEditForm({ ...editForm, requires_consent: e.target.checked })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Consent Form</span>
                    <p className="text-xs text-gray-500">Before service</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                disabled={saving || !editForm.name}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Service</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., Botox Treatment"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    value={editForm.duration_minutes}
                    onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    min="5"
                    step="5"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="Service description..."
                />
              </div>

              {/* Provider Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Performs This Service?
                </label>
                <div className="flex flex-wrap gap-2">
                  {providers.map((provider) => {
                    const isSelected = editForm.provider_ids.includes(provider.id);
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => toggleProvider(provider.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className={`font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                            {provider.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requires_consult}
                    onChange={(e) => setEditForm({ ...editForm, requires_consult: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Requires Consultation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.requires_consent}
                    onChange={(e) => setEditForm({ ...editForm, requires_consent: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Requires Consent</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                disabled={saving || !editForm.name || !editForm.price}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Service'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
