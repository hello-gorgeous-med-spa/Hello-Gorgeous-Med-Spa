'use client';

// ============================================================
// SERVICE PACKAGES PAGE
// Create and manage bundled service packages
// ============================================================

import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  price_cents: number;
  duration_minutes: number;
}

interface PackageService {
  service_id: string;
  quantity: number;
  services?: Service;
}

interface Package {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  regular_price_cents: number;
  savings_cents: number;
  savings_percent: number;
  validity_days: number | null;
  max_uses: number | null;
  is_featured: boolean;
  is_active: boolean;
  package_services: PackageService[];
  created_at: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    validity_days: '',
    max_uses: '',
    is_featured: false,
    selectedServices: [] as { service_id: string; quantity: number }[],
  });

  // Load packages and services
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, servicesRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/services'),
      ]);
      const packagesData = await packagesRes.json();
      const servicesData = await servicesRes.json();
      setPackages(packagesData.packages || []);
      setServices(servicesData.services || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate package value
  const calculateValue = () => {
    let regularPrice = 0;
    form.selectedServices.forEach(ss => {
      const service = services.find(s => s.id === ss.service_id);
      if (service) {
        regularPrice += service.price_cents * ss.quantity;
      }
    });
    return {
      regularPrice,
      savings: regularPrice - (form.price * 100),
      savingsPercent: regularPrice > 0 ? Math.round((1 - (form.price * 100) / regularPrice) * 100) : 0,
    };
  };

  // Save package
  const handleSave = async () => {
    if (!form.name || form.price <= 0 || form.selectedServices.length === 0) return;
    setSaving(true);
    try {
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        name: form.name,
        description: form.description || null,
        price_cents: form.price * 100,
        validity_days: form.validity_days ? parseInt(form.validity_days) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_featured: form.is_featured,
        services: form.selectedServices,
      };

      const res = await fetch('/api/packages', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: editing ? 'Package updated!' : 'Package created!' });
        setShowModal(false);
        setEditing(null);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save package' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save package' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete package
  const handleDelete = async (pkg: Package) => {
    if (!window.confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/packages?id=${pkg.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages(prev => prev.filter(p => p.id !== pkg.id));
        setMessage({ type: 'success', text: 'Package deleted' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete package' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Toggle featured
  const toggleFeatured = async (pkg: Package) => {
    try {
      await fetch('/api/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkg.id, is_featured: !pkg.is_featured }),
      });
      setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_featured: !p.is_featured } : p));
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: 0,
      validity_days: '',
      max_uses: '',
      is_featured: false,
      selectedServices: [],
    });
  };

  // Open edit modal
  const openEdit = (pkg: Package) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price_cents / 100,
      validity_days: pkg.validity_days?.toString() || '',
      max_uses: pkg.max_uses?.toString() || '',
      is_featured: pkg.is_featured,
      selectedServices: pkg.package_services.map(ps => ({
        service_id: ps.service_id,
        quantity: ps.quantity,
      })),
    });
    setShowModal(true);
  };

  // Add service to package
  const addService = (serviceId: string) => {
    if (form.selectedServices.some(s => s.service_id === serviceId)) return;
    setForm({
      ...form,
      selectedServices: [...form.selectedServices, { service_id: serviceId, quantity: 1 }],
    });
  };

  // Remove service from package
  const removeService = (serviceId: string) => {
    setForm({
      ...form,
      selectedServices: form.selectedServices.filter(s => s.service_id !== serviceId),
    });
  };

  // Update service quantity
  const updateQuantity = (serviceId: string, quantity: number) => {
    setForm({
      ...form,
      selectedServices: form.selectedServices.map(s =>
        s.service_id === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s
      ),
    });
  };

  const value = calculateValue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Packages</h1>
          <p className="text-gray-500">Bundle services together at a discount</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Create Package
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
          Loading packages...
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
          <span className="text-4xl block mb-4">📦</span>
          <p>No packages yet</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="mt-4 text-pink-600 font-medium"
          >
            Create your first package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${pkg.is_featured ? 'border-pink-300 ring-2 ring-pink-100' : 'border-gray-100'}`}>
              {pkg.is_featured && (
                <div className="bg-pink-500 text-white text-center text-xs font-medium py-1">
                  ⭐ FEATURED
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
                {pkg.description && (
                  <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                )}

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-pink-500">${(pkg.price_cents / 100).toFixed(0)}</span>
                  {pkg.regular_price_cents > pkg.price_cents && (
                    <>
                      <span className="text-lg text-gray-400 line-through">${(pkg.regular_price_cents / 100).toFixed(0)}</span>
                      <span className="text-sm font-medium text-green-600">Save {pkg.savings_percent}%</span>
                    </>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Includes:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.package_services.map((ps, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {ps.quantity > 1 && <span className="font-medium">{ps.quantity}x</span>}
                        {ps.services?.name || 'Service'}
                      </li>
                    ))}
                  </ul>
                </div>

                {(pkg.validity_days || pkg.max_uses) && (
                  <div className="mt-4 text-xs text-gray-500">
                    {pkg.validity_days && <p>Valid for {pkg.validity_days} days</p>}
                    {pkg.max_uses && <p>Max {pkg.max_uses} uses</p>}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(pkg)}
                  className={`text-sm ${pkg.is_featured ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
                >
                  {pkg.is_featured ? '★ Featured' : '☆ Feature'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(pkg)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Package' : 'Create Package'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., New Client Glow Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={2}
                  placeholder="What's included and why it's great..."
                />
              </div>

              {/* Services Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Services *</label>
                <select
                  onChange={(e) => { if (e.target.value) addService(e.target.value); e.target.value = ''; }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3"
                >
                  <option value="">+ Add a service...</option>
                  {services
                    .filter(s => !form.selectedServices.some(ss => ss.service_id === s.id))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${(s.price_cents / 100).toFixed(0)})</option>
                    ))}
                </select>

                {form.selectedServices.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No services selected yet</p>
                ) : (
                  <div className="space-y-2">
                    {form.selectedServices.map(ss => {
                      const service = services.find(s => s.id === ss.service_id);
                      return (
                        <div key={ss.service_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="1"
                              value={ss.quantity}
                              onChange={(e) => updateQuantity(ss.service_id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                            />
                            <span className="text-gray-900">{service?.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600">${((service?.price_cents || 0) * ss.quantity / 100).toFixed(0)}</span>
                            <button
                              onClick={() => removeService(ss.service_id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Price & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Price ($) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value Summary</label>
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                    <p>Regular: <span className="font-medium">${(value.regularPrice / 100).toFixed(0)}</span></p>
                    <p className="text-green-700">Savings: <span className="font-bold">${(value.savings / 100).toFixed(0)} ({value.savingsPercent}%)</span></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid for (days)</label>
                  <input
                    type="number"
                    value={form.validity_days}
                    onChange={(e) => setForm({ ...form, validity_days: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="No expiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Feature this package (show prominently on booking page)</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || form.price <= 0 || form.selectedServices.length === 0}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Update Package' : 'Create Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
