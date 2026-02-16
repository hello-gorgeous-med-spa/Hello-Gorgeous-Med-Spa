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
  category?: string;
}

// Hormone Membership Package Templates
const HORMONE_PACKAGE_TEMPLATES = [
  {
    name: "Hormone Starter Package",
    description: "3-month intro to hormone therapy. Lab work, consultation, post-lab appointment, hormone therapy initiation, and prescription coordination.",
    price: 350,
    duration: "3 Months",
    validity_days: 90,
    category: "hormone",
    includes: [
      "Initial consultation",
      "Basic tier lab panel",
      "Post-lab review appointment",
      "Hormone therapy initiation",
      "Prescription coordination (if insurance covers)",
      "Provider messaging support",
    ],
  },
  {
    name: "Hormone Essential Program",
    description: "6-month comprehensive hormone optimization with ongoing support, vitamin injections, IV drips, and wellness perks.",
    price: 749,
    duration: "6 Months",
    validity_days: 180,
    category: "hormone",
    is_featured: true,
    includes: [
      "Everything in Starter, plus:",
      "2 comprehensive lab panels",
      "Dosage review & optimization",
      "Pellet therapy option included",
      "Bioidentical hormone therapy",
      "Monthly vitamin injection (6 total)",
      "Monthly IV drip (6 total)",
      "Fullscript account setup",
      "Wellness check-ups",
      "Priority scheduling",
    ],
    highlight: "Best Value",
  },
  {
    name: "Hormone Premium Program",
    description: "9-month enhanced program with bonus service credits. Includes 2x $150 service credits at months 4 and 8.",
    price: 1200,
    duration: "9 Months",
    validity_days: 270,
    category: "hormone",
    includes: [
      "Everything in Essential, plus:",
      "3 comprehensive lab panels",
      "Extended hormone optimization",
      "Monthly vitamin injection (9 total)",
      "Monthly IV drip (9 total)",
      "Quarterly wellness reviews",
      "VIP scheduling priority",
    ],
    bonuses: [
      "Month 4: $150 service credit",
      "Month 8: $150 service credit",
    ],
    highlight: "$300 in Free Services",
  },
  {
    name: "Hormone Elite Annual",
    description: "12-month ultimate hormone wellness experience with 4x $150 service credits throughout the year.",
    price: 1499,
    duration: "12 Months",
    validity_days: 365,
    category: "hormone",
    includes: [
      "Everything in Premium, plus:",
      "4 comprehensive lab panels",
      "Year-round hormone optimization",
      "Monthly vitamin injection (12 total)",
      "Monthly IV drip (12 total)",
      "Dedicated provider team",
      "Same-day appointment access",
      "Annual wellness strategy session",
    ],
    bonuses: [
      "Month 3: $150 service credit",
      "Month 6: $150 service credit",
      "Month 9: $150 service credit",
      "Month 12: $150 service credit",
    ],
    highlight: "$600 in Free Services",
  },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'hormone' | 'service'>('all');
  const [showHormoneTemplates, setShowHormoneTemplates] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    validity_days: '',
    max_uses: '',
    is_featured: false,
    category: '',
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
    if (!form.name || form.price <= 0) return;
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
        services: form.selectedServices.length > 0 ? form.selectedServices : undefined,
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

  // Create hormone package from template
  const createHormonePackage = async (template: typeof HORMONE_PACKAGE_TEMPLATES[0]) => {
    setSaving(true);
    try {
      const payload = {
        name: template.name,
        description: template.description,
        price_cents: template.price * 100,
        validity_days: template.validity_days,
        is_featured: template.is_featured || false,
        services: [], // Hormone packages don't need service links - they're membership programs
      };

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `${template.name} created!` });
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to create package' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create package' });
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
      category: '',
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
      category: pkg.category || '',
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

  // Filter packages by tab
  const filteredPackages = packages.filter(pkg => {
    if (activeTab === 'all') return true;
    if (activeTab === 'hormone') {
      return pkg.name.toLowerCase().includes('hormone') || pkg.description?.toLowerCase().includes('hormone');
    }
    return !pkg.name.toLowerCase().includes('hormone');
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Service Packages</h1>
          <p className="text-black">Bundle services together or create membership programs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHormoneTemplates(true)}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
          >
            + Hormone Package
          </button>
          <button
            onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
          >
            + Custom Package
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-black">
        {[
          { id: 'all', label: 'All Packages' },
          { id: 'hormone', label: '💊 Hormone Memberships' },
          { id: 'service', label: '📦 Service Bundles' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab.id
                ? 'border-[#FF2D8E] text-pink-600'
                : 'border-transparent text-black hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hormone Membership Info Banner */}
      {activeTab === 'hormone' && (
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚖️</span>
            <div>
              <h2 className="text-xl font-bold">Hormone Optimization Memberships</h2>
              <p className="text-fuchsia-100">Comprehensive hormone therapy programs with lab work, treatments, and bonuses</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-fuchsia-100">Starter</p>
              <p className="font-semibold">$350 / 3mo</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-fuchsia-100">Essential</p>
              <p className="font-semibold">$749 / 6mo</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-fuchsia-100">Premium</p>
              <p className="font-semibold">$1,200 / 9mo</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-fuchsia-100">Elite Annual</p>
              <p className="font-semibold">$1,499 / 12mo</p>
            </div>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          Loading packages...
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-12 text-center text-black">
          <span className="text-4xl block mb-4">{activeTab === 'hormone' ? '💊' : '📦'}</span>
          <p>No {activeTab === 'hormone' ? 'hormone membership' : ''} packages yet</p>
          {activeTab === 'hormone' ? (
            <button
              onClick={() => setShowHormoneTemplates(true)}
              className="mt-4 text-[#FF2D8E] font-medium"
            >
              Create hormone packages from templates
            </button>
          ) : (
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="mt-4 text-pink-600 font-medium"
            >
              Create your first package
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${pkg.is_featured ? 'border-pink-300 ring-2 ring-pink-100' : 'border-black'}`}>
              {pkg.is_featured && (
                <div className="bg-[#FF2D8E] text-white text-center text-xs font-medium py-1">
                  ⭐ FEATURED
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg text-black">{pkg.name}</h3>
                {pkg.description && (
                  <p className="text-sm text-black mt-1 line-clamp-2">{pkg.description}</p>
                )}

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#FF2D8E]">${(pkg.price_cents / 100).toFixed(0)}</span>
                  {pkg.regular_price_cents > pkg.price_cents && (
                    <>
                      <span className="text-lg text-black line-through">${(pkg.regular_price_cents / 100).toFixed(0)}</span>
                      <span className="text-sm font-medium text-green-600">Save {pkg.savings_percent}%</span>
                    </>
                  )}
                </div>

                {pkg.package_services && pkg.package_services.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-black">Includes:</p>
                    <ul className="text-sm text-black space-y-1">
                      {pkg.package_services.map((ps, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {ps.quantity > 1 && <span className="font-medium">{ps.quantity}x</span>}
                          {ps.services?.name || 'Service'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pkg.validity_days && (
                  <div className="mt-4 text-xs text-black">
                    <p>Valid for {pkg.validity_days} days</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-white border-t border-black flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(pkg)}
                  className={`text-sm ${pkg.is_featured ? 'text-pink-600' : 'text-black hover:text-pink-600'}`}
                >
                  {pkg.is_featured ? '★ Featured' : '☆ Feature'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(pkg)}
                    className="px-3 py-1.5 text-sm text-black hover:bg-white rounded"
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

      {/* Hormone Package Templates Modal */}
      {showHormoneTemplates && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Hormone Membership Templates</h2>
                <p className="text-black text-sm mt-1">Click to create a package from template</p>
              </div>
              <button onClick={() => setShowHormoneTemplates(false)} className="text-black hover:text-black text-2xl">×</button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              {HORMONE_PACKAGE_TEMPLATES.map((template, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    template.is_featured ? 'border-[#FF2D8E] bg-fuchsia-50' : 'border-black hover:border-fuchsia-300'
                  }`}
                  onClick={() => {
                    createHormonePackage(template);
                    setShowHormoneTemplates(false);
                  }}
                >
                  {template.highlight && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-[#FF2D8E] text-white rounded mb-2">
                      {template.highlight}
                    </span>
                  )}
                  <h3 className="font-bold text-lg text-black">{template.name}</h3>
                  <p className="text-[#FF2D8E] font-semibold">${template.price} / {template.duration}</p>
                  <p className="text-sm text-black mt-2">{template.description}</p>
                  
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-black mb-2">Includes:</p>
                    <ul className="text-xs text-black space-y-1">
                      {template.includes.slice(0, 5).map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-green-500">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {template.includes.length > 5 && (
                        <li className="text-black">+{template.includes.length - 5} more...</li>
                      )}
                    </ul>
                  </div>

                  {template.bonuses && (
                    <div className="mt-3 pt-3 border-t border-black">
                      <p className="text-xs font-semibold text-[#FF2D8E] mb-1">🎁 Bonuses:</p>
                      <ul className="text-xs text-black space-y-1">
                        {template.bonuses.map((bonus, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-[#FF2D8E]">★</span>
                            <span>{bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <span className="text-sm text-[#FF2D8E] font-medium">Click to create →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">{editing ? 'Edit Package' : 'Create Package'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Package Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="e.g., New Client Glow Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={2}
                  placeholder="What's included and why it's great..."
                />
              </div>

              {/* Services Selector */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Select Services (optional for membership packages)</label>
                <select
                  onChange={(e) => { if (e.target.value) addService(e.target.value); e.target.value = ''; }}
                  className="w-full px-4 py-2 border border-black rounded-lg mb-3"
                >
                  <option value="">+ Add a service...</option>
                  {services
                    .filter(s => !form.selectedServices.some(ss => ss.service_id === s.id))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${(s.price_cents / 100).toFixed(0)})</option>
                    ))}
                </select>

                {form.selectedServices.length === 0 ? (
                  <p className="text-sm text-black text-center py-4">No services selected (OK for membership packages)</p>
                ) : (
                  <div className="space-y-2">
                    {form.selectedServices.map(ss => {
                      const service = services.find(s => s.id === ss.service_id);
                      return (
                        <div key={ss.service_id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="1"
                              value={ss.quantity}
                              onChange={(e) => updateQuantity(ss.service_id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-black rounded text-center"
                            />
                            <span className="text-black">{service?.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-black">${((service?.price_cents || 0) * ss.quantity / 100).toFixed(0)}</span>
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
                  <label className="block text-sm font-medium text-black mb-1">Package Price ($) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="0"
                  />
                </div>
                {form.selectedServices.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Value Summary</label>
                    <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <p>Regular: <span className="font-medium">${(value.regularPrice / 100).toFixed(0)}</span></p>
                      <p className="text-green-700">Savings: <span className="font-bold">${(value.savings / 100).toFixed(0)} ({value.savingsPercent}%)</span></p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Valid for (days)</label>
                  <input
                    type="number"
                    value={form.validity_days}
                    onChange={(e) => setForm({ ...form, validity_days: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="No expiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#FF2D8E] border-black rounded"
                />
                <span className="text-sm text-black">Feature this package (show prominently on booking page)</span>
              </label>
            </div>

            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || form.price <= 0}
                className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
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
