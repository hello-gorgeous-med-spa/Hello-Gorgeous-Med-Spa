'use client';

// ============================================================
// ADMIN VENDORS PAGE
// Quick access to supplier portals and vendor management
// Owner: Danielle Glazier-Alcala | Hello Gorgeous Med Spa
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  category: string;
  logo?: string;
  portalUrl: string;
  description: string;
  repName?: string;
  repEmail?: string;
  repPhone?: string;
  accountNumber?: string;
  notes?: string;
  orderUrl?: string;
  isFavorite: boolean;
}

const VENDORS: Vendor[] = [
  // ===== INJECTABLES & AESTHETICS =====
  {
    id: 'allergan',
    name: 'Allergan Aesthetics',
    category: 'Injectables',
    portalUrl: 'https://www.allerganaesthetics.com/hcp',
    description: 'Botox, Juvederm, Kybella, SkinMedica',
    orderUrl: 'https://www.brilliantconnections.com/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Primary Botox & Juvederm supplier',
    isFavorite: true,
  },
  {
    id: 'alle',
    name: 'Allē Provider Portal',
    category: 'Loyalty Program',
    portalUrl: 'https://provider.alle.com/',
    description: 'Allergan patient rewards program',
    repName: '',
    repEmail: '',
    repPhone: '',
    notes: 'Check patient points, run Allē promotions',
    isFavorite: true,
  },
  {
    id: 'evolus',
    name: 'Evolus',
    category: 'Injectables',
    portalUrl: 'https://providers.evolus.com/',
    description: 'Jeuveau (NewTox) manufacturer',
    orderUrl: 'https://providers.evolus.com/ordering',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Jeuveau neurotoxin - great pricing',
    isFavorite: true,
  },
  {
    id: 'galderma',
    name: 'Galderma (GAIN)',
    category: 'Injectables',
    portalUrl: 'https://www.galdermagain.com/',
    description: 'Dysport, Restylane, Sculptra',
    orderUrl: 'https://www.galdermagain.com/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Dysport & Restylane supplier',
    isFavorite: false,
  },
  // ===== COMPOUNDING PHARMACIES =====
  {
    id: 'olympia',
    name: 'Olympia Pharmacy',
    category: 'Compounding',
    portalUrl: 'https://olympiapharmacy.drscriptportal.com/dashboard',
    description: 'Compounded Semaglutide, Tirzepatide, peptides',
    orderUrl: 'https://olympiapharmacy.drscriptportal.com/dashboard',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Weight loss compounds, NAD+, peptides',
    isFavorite: true,
  },
  {
    id: 'formulation',
    name: 'Formulation Compounding',
    category: 'Compounding',
    portalUrl: 'https://fccrxportal.com/dashboard',
    description: 'B12, MIC, Lipo injections, vitamins',
    orderUrl: 'https://fccrxportal.com/dashboard',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Vitamin injections, topical numbing',
    isFavorite: true,
  },
  // ===== MEDICAL SUPPLIES =====
  {
    id: 'mckesson',
    name: 'McKesson Connect',
    category: 'Medical Supplies',
    portalUrl: 'https://connect.mckesson.com/',
    description: 'Medical supplies, needles, PPE',
    orderUrl: 'https://connect.mckesson.com/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Main medical supply distributor',
    isFavorite: true,
  },
  {
    id: 'amazon',
    name: 'Amazon Business',
    category: 'General Supplies',
    portalUrl: 'https://www.amazon.com/gc/balance',
    description: 'Office supplies, gift cards, retail items',
    orderUrl: 'https://www.amazon.com/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Office & miscellaneous supplies, gift card balance',
    isFavorite: true,
  },
  // ===== SKINCARE LINES =====
  {
    id: 'anteage',
    name: 'AnteAGE',
    category: 'Skincare',
    portalUrl: 'https://provider.anteage.com/login.php',
    description: 'Stem cell skincare, microneedling serums',
    orderUrl: 'https://provider.anteage.com/login.php',
    repName: '',
    repEmail: '',
    repPhone: '877-350-6350',
    accountNumber: '',
    notes: 'Premium regenerative skincare - Cellese',
    isFavorite: true,
  },
  {
    id: 'skinscript',
    name: 'Skin Script Rx',
    category: 'Skincare',
    portalUrl: 'https://skinscriptrx.com/',
    description: 'Professional skincare & chemical peels',
    orderUrl: 'https://skinscriptrx.com/',
    repName: '',
    repEmail: 'info@skinscriptrx.com',
    repPhone: '480-543-1121',
    accountNumber: '',
    notes: 'Peels, facials, retail products - No minimums, free shipping $49+',
    isFavorite: true,
  },
  {
    id: 'skinmedica',
    name: 'SkinMedica',
    category: 'Skincare',
    portalUrl: 'https://www.skinmedica.com/professional',
    description: 'TNS, HA5, professional skincare',
    orderUrl: 'https://www.brilliantconnections.com/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Order through Allergan/Brilliant',
    isFavorite: false,
  },
  // ===== SOFTWARE & EHR =====
  {
    id: 'charm',
    name: 'Charm EHR',
    category: 'Software',
    portalUrl: 'https://accounts.charmtracker.com/signin',
    description: 'AI-Powered EHR & E-Prescribing',
    orderUrl: 'https://accounts.charmtracker.com/signin',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'E-prescribe Semaglutide, Tirzepatide - Free tier available',
    isFavorite: true,
  },
  {
    id: 'efax',
    name: 'eFax Portal',
    category: 'Software',
    portalUrl: 'https://myportal.efax.com/login',
    description: 'Electronic fax service',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Send and receive faxes electronically',
    isFavorite: true,
  },
  // ===== FINANCING =====
  {
    id: 'cherry',
    name: 'Cherry Financing',
    category: 'Patient Financing',
    portalUrl: 'https://providers.withcherry.com/',
    description: 'Patient payment plans & financing',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: '0% financing for patients',
    isFavorite: true,
  },
  // ===== OTHER =====
  {
    id: 'biote',
    name: 'BioTE',
    category: 'Hormone Therapy',
    portalUrl: 'https://providers.biote.com/',
    description: 'Hormone pellet therapy',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'BHRT pellet training & supplies',
    isFavorite: false,
  },
  {
    id: 'merz',
    name: 'Merz Aesthetics',
    category: 'Injectables',
    portalUrl: 'https://merzusa.com/professionals/',
    description: 'Xeomin, Radiesse, Belotero',
    orderUrl: 'https://merzusa.com/professionals/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Xeomin neurotoxin, Radiesse filler',
    isFavorite: false,
  },
  {
    id: 'revance',
    name: 'Revance (RHA)',
    category: 'Injectables',
    portalUrl: 'https://www.revance.com/for-professionals/',
    description: 'Daxxify, RHA fillers',
    orderUrl: 'https://www.revance.com/for-professionals/',
    repName: '',
    repEmail: '',
    repPhone: '',
    accountNumber: '',
    notes: 'Daxxify - longer lasting neurotoxin',
    isFavorite: false,
  },
];

const CATEGORIES = ['All', 'Injectables', 'Compounding', 'Medical Supplies', 'General Supplies', 'Skincare', 'Software', 'Patient Financing', 'Loyalty Program', 'Hormone Therapy'];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(VENDORS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteVendors = vendors.filter((v) => v.isFavorite);

  const toggleFavorite = (vendorId: string) => {
    setVendors(vendors.map((v) => 
      v.id === vendorId ? { ...v, isFavorite: !v.isFavorite } : v
    ));
  };

  const updateVendor = (updatedVendor: Vendor) => {
    setVendors(vendors.map((v) => 
      v.id === updatedVendor.id ? updatedVendor : v
    ));
    setEditingVendor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Vendor Portal</h1>
          <p className="text-black">Quick access to all your suppliers and partners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
        >
          + Add Vendor
        </button>
      </div>

      {/* Quick Access - Favorites */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-6">
        <h2 className="font-semibold text-black mb-4 flex items-center gap-2">
          ⭐ Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {favoriteVendors.map((vendor) => (
            <a
              key={vendor.id}
              href={vendor.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-black"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {vendor.name.charAt(0)}
              </div>
              <p className="font-medium text-black text-sm truncate">{vendor.name}</p>
              <p className="text-xs text-black">{vendor.category}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">🔍</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#FF2D8E] text-white'
                  : 'bg-white text-black hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-xl border border-black shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-white flex items-center justify-center text-2xl font-bold text-black">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{vendor.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-white text-black rounded">
                      {vendor.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(vendor.id)}
                  className="text-xl hover:scale-110 transition-transform"
                >
                  {vendor.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              <p className="text-sm text-black mb-4">{vendor.description}</p>

              {/* Rep Info */}
              {vendor.repName && (
                <div className="text-sm text-black mb-3 p-2 bg-white rounded-lg">
                  <p className="font-medium text-black">{vendor.repName}</p>
                  {vendor.repPhone && <p>{vendor.repPhone}</p>}
                  {vendor.repEmail && <p className="text-pink-600">{vendor.repEmail}</p>}
                </div>
              )}

              {/* Account Number */}
              {vendor.accountNumber && (
                <p className="text-xs text-black mb-3">
                  Account: <span className="font-mono">{vendor.accountNumber}</span>
                </p>
              )}

              {/* Notes */}
              {vendor.notes && (
                <p className="text-xs text-black italic mb-4">{vendor.notes}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={vendor.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-[#FF2D8E] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors text-center"
                >
                  Open Portal →
                </a>
                {vendor.orderUrl && (
                  <a
                    href={vendor.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-black text-black text-sm font-medium rounded-lg hover:bg-white transition-colors"
                  >
                    Order
                  </a>
                )}
                <button
                  onClick={() => setEditingVendor(vendor)}
                  className="px-3 py-2 border border-black text-black text-sm rounded-lg hover:bg-white transition-colors"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVendor && (
        <VendorModal
          vendor={editingVendor}
          onSave={updateVendor}
          onClose={() => setEditingVendor(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <VendorModal
          vendor={{
            id: `vendor-${Date.now()}`,
            name: '',
            category: 'Injectables',
            portalUrl: '',
            description: '',
            isFavorite: false,
          }}
          onSave={(newVendor) => {
            setVendors([...vendors, newVendor]);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
          isNew
        />
      )}
    </div>
  );
}

// Vendor Edit/Add Modal Component
function VendorModal({
  vendor,
  onSave,
  onClose,
  isNew = false,
}: {
  vendor: Vendor;
  onSave: (vendor: Vendor) => void;
  onClose: () => void;
  isNew?: boolean;
}) {
  const [formData, setFormData] = useState(vendor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-black">
          <h2 className="text-xl font-bold text-black">
            {isNew ? 'Add Vendor' : `Edit ${vendor.name}`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Vendor Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber || ''}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Portal URL *
              </label>
              <input
                type="url"
                required
                value={formData.portalUrl}
                onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                placeholder="https://"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Order URL
              </label>
              <input
                type="url"
                value={formData.orderUrl || ''}
                onChange={(e) => setFormData({ ...formData, orderUrl: e.target.value })}
                placeholder="https://"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Rep Info */}
          <div className="border-t border-black pt-4">
            <h3 className="font-medium text-black mb-3">Sales Rep Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  Rep Name
                </label>
                <input
                  type="text"
                  value={formData.repName || ''}
                  onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Rep Phone
                </label>
                <input
                  type="tel"
                  value={formData.repPhone || ''}
                  onChange={(e) => setFormData({ ...formData, repPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Rep Email
                </label>
                <input
                  type="email"
                  value={formData.repEmail || ''}
                  onChange={(e) => setFormData({ ...formData, repEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
            >
              {isNew ? 'Add Vendor' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
