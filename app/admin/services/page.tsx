'use client';

// ============================================================
// ADMIN SERVICES PAGE
// Manage services, pricing, and durations - Connected to Live Data
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

interface Service {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: { id: string; name: string };
  price: number;
  duration_minutes: number;
  buffer_minutes?: number;
  is_active: boolean;
  requires_consultation: boolean;
  requires_consent: boolean;
}

export default function AdminServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Fetch services with live data
  const { services, loading, error } = useServicesWithStats();

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      if (!isSupabaseConfigured()) {
        // Mock categories
        setCategories([
          { id: 'botox', name: 'Botox & Neurotoxins', slug: 'botox', serviceCount: 3 },
          { id: 'fillers', name: 'Dermal Fillers', slug: 'fillers', serviceCount: 2 },
          { id: 'weight-loss', name: 'Weight Loss', slug: 'weight-loss', serviceCount: 3 },
          { id: 'facials', name: 'Facials & Skin', slug: 'facials', serviceCount: 5 },
          { id: 'iv-therapy', name: 'IV Therapy', slug: 'iv-therapy', serviceCount: 4 },
          { id: 'prp', name: 'PRP Treatments', slug: 'prp', serviceCount: 2 },
          { id: 'lash', name: 'Lash Services', slug: 'lash', serviceCount: 3 },
          { id: 'brow', name: 'Brow Services', slug: 'brow', serviceCount: 2 },
          { id: 'laser-hair', name: 'Laser Hair Removal', slug: 'laser-hair', serviceCount: 3 },
          { id: 'bhrt', name: 'Hormone Therapy', slug: 'bhrt', serviceCount: 3 },
          { id: 'consultations', name: 'Consultations', slug: 'consultations', serviceCount: 2 },
        ]);
        return;
      }

      try {
        const { data } = await supabase
          .from('categories')
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
    requiresConsult: services.filter((s: Service) => s.requires_consultation).length,
  }), [services, categories]);

  // Format price
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
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
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);
      
      // Refresh would happen through real-time subscription
      window.location.reload();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500">Manage your service menu, pricing, and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Add category modal coming soon')}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Add Category
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
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
              {filteredServices.map((service: Service) => (
                <div
                  key={service.id}
                  className="px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        {service.requires_consultation && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                            Consult Required
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
                        {service.buffer_minutes ? ` + ${service.buffer_minutes} buffer` : ''}
                        {service.category?.name && ` • ${service.category.name}`}
                      </p>
                      {service.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Edit service: ${service.name}`)}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(service.id, service.is_active)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            service.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Service</h2>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Botox Treatment"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="Service description..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Requires Consultation</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Requires Consent</span>
                </label>
              </div>
            </form>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Service creation would save to Supabase');
                  setShowAddModal(false);
                }}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
