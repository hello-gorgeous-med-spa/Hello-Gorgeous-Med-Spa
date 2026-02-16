'use client';

// ============================================================
// ADMIN MEDICATIONS PAGE - Interactive Drug Database
// Suppliers: Formulation, McKesson, Olympia
// ============================================================

import { useState, useEffect, useMemo } from 'react';

// Comprehensive medication database by supplier
const MEDICATION_DATABASE = {
  // NEUROTOXINS
  neurotoxins: {
    name: 'Neurotoxins',
    icon: '💉',
    items: [
      { id: 'botox', name: 'Botox (onabotulinumtoxinA)', brand: 'Allergan', supplier: 'McKesson', unit: 'units', defaultDose: 50, category: 'neurotoxin' },
      { id: 'dysport', name: 'Dysport (abobotulinumtoxinA)', brand: 'Galderma', supplier: 'McKesson', unit: 'units', defaultDose: 150, category: 'neurotoxin' },
      { id: 'jeuveau', name: 'Jeuveau (prabotulinumtoxinA)', brand: 'Evolus', supplier: 'McKesson', unit: 'units', defaultDose: 50, category: 'neurotoxin' },
      { id: 'xeomin', name: 'Xeomin (incobotulinumtoxinA)', brand: 'Merz', supplier: 'McKesson', unit: 'units', defaultDose: 50, category: 'neurotoxin' },
      { id: 'daxxify', name: 'Daxxify (daxibotulinumtoxinA)', brand: 'Revance', supplier: 'McKesson', unit: 'units', defaultDose: 40, category: 'neurotoxin' },
    ],
  },
  // DERMAL FILLERS
  fillers: {
    name: 'Dermal Fillers',
    icon: '✨',
    items: [
      // Juvederm Collection (Allergan)
      { id: 'juvederm-ultra', name: 'Juvederm Ultra XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'juvederm-ultra-plus', name: 'Juvederm Ultra Plus XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'juvederm-voluma', name: 'Juvederm Voluma XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'juvederm-vollure', name: 'Juvederm Vollure XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'juvederm-volbella', name: 'Juvederm Volbella XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'juvederm-volux', name: 'Juvederm Volux XC', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'skinvive', name: 'SkinVive by Juvederm', brand: 'Allergan', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      // Restylane Collection (Galderma)
      { id: 'restylane', name: 'Restylane', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-lyft', name: 'Restylane Lyft', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-silk', name: 'Restylane Silk', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-refyne', name: 'Restylane Refyne', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-defyne', name: 'Restylane Defyne', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-kysse', name: 'Restylane Kysse', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-contour', name: 'Restylane Contour', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'restylane-eyelight', name: 'Restylane Eyelight', brand: 'Galderma', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      // RHA Collection (Revance)
      { id: 'rha2', name: 'RHA 2', brand: 'Revance', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'rha3', name: 'RHA 3', brand: 'Revance', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'rha4', name: 'RHA 4', brand: 'Revance', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      { id: 'rha-redensity', name: 'RHA Redensity', brand: 'Revance', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'filler' },
      // Biostimulators
      { id: 'sculptra', name: 'Sculptra Aesthetic', brand: 'Galderma', supplier: 'McKesson', unit: 'vial', defaultDose: 1, category: 'biostimulator' },
      { id: 'radiesse', name: 'Radiesse', brand: 'Merz', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'biostimulator' },
      { id: 'radiesse-plus', name: 'Radiesse (+)', brand: 'Merz', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'biostimulator' },
      { id: 'bellafill', name: 'Bellafill', brand: 'Suneva', supplier: 'McKesson', unit: 'syringe', defaultDose: 1, category: 'biostimulator' },
    ],
  },
  // WEIGHT LOSS / PEPTIDES
  weightLoss: {
    name: 'Weight Loss & Peptides',
    icon: '💊',
    items: [
      { id: 'semaglutide', name: 'Semaglutide (Compounded)', brand: 'Compounded', supplier: 'Olympia', unit: 'mg', defaultDose: 0.25, category: 'weight_loss' },
      { id: 'tirzepatide', name: 'Tirzepatide (Compounded)', brand: 'Compounded', supplier: 'Olympia', unit: 'mg', defaultDose: 2.5, category: 'weight_loss' },
      { id: 'ozempic', name: 'Ozempic (Semaglutide)', brand: 'Novo Nordisk', supplier: 'McKesson', unit: 'mg', defaultDose: 0.25, category: 'weight_loss' },
      { id: 'wegovy', name: 'Wegovy (Semaglutide)', brand: 'Novo Nordisk', supplier: 'McKesson', unit: 'mg', defaultDose: 0.25, category: 'weight_loss' },
      { id: 'mounjaro', name: 'Mounjaro (Tirzepatide)', brand: 'Eli Lilly', supplier: 'McKesson', unit: 'mg', defaultDose: 2.5, category: 'weight_loss' },
      { id: 'zepbound', name: 'Zepbound (Tirzepatide)', brand: 'Eli Lilly', supplier: 'McKesson', unit: 'mg', defaultDose: 2.5, category: 'weight_loss' },
      { id: 'bpc157', name: 'BPC-157', brand: 'Compounded', supplier: 'Olympia', unit: 'mcg', defaultDose: 250, category: 'peptide' },
      { id: 'pt141', name: 'PT-141 (Bremelanotide)', brand: 'Compounded', supplier: 'Olympia', unit: 'mg', defaultDose: 1.75, category: 'peptide' },
      { id: 'aod9604', name: 'AOD 9604', brand: 'Compounded', supplier: 'Formulation', unit: 'mg', defaultDose: 300, category: 'peptide' },
      { id: 'cjc-ipamorelin', name: 'CJC-1295/Ipamorelin', brand: 'Compounded', supplier: 'Olympia', unit: 'mcg', defaultDose: 100, category: 'peptide' },
      { id: 'sermorelin', name: 'Sermorelin', brand: 'Compounded', supplier: 'Formulation', unit: 'mcg', defaultDose: 200, category: 'peptide' },
    ],
  },
  // VITAMIN INJECTIONS
  vitamins: {
    name: 'Vitamin Injections',
    icon: '💪',
    items: [
      { id: 'b12', name: 'Vitamin B12 (Cyanocobalamin)', brand: 'Compounded', supplier: 'Formulation', unit: 'mcg', defaultDose: 1000, category: 'vitamin' },
      { id: 'b12-methyl', name: 'Methylcobalamin B12', brand: 'Compounded', supplier: 'Olympia', unit: 'mcg', defaultDose: 1000, category: 'vitamin' },
      { id: 'b-complex', name: 'B-Complex', brand: 'Compounded', supplier: 'Formulation', unit: 'mL', defaultDose: 1, category: 'vitamin' },
      { id: 'mic', name: 'MIC (Methionine/Inositol/Choline)', brand: 'Compounded', supplier: 'Olympia', unit: 'mL', defaultDose: 1, category: 'vitamin' },
      { id: 'lipo-b', name: 'Lipo-B (MIC + B12)', brand: 'Compounded', supplier: 'Formulation', unit: 'mL', defaultDose: 1, category: 'vitamin' },
      { id: 'lipo-c', name: 'Lipo-C (MIC + B12 + Carnitine)', brand: 'Compounded', supplier: 'Olympia', unit: 'mL', defaultDose: 1, category: 'vitamin' },
      { id: 'glutathione', name: 'Glutathione', brand: 'Compounded', supplier: 'Olympia', unit: 'mg', defaultDose: 200, category: 'vitamin' },
      { id: 'vitamin-d', name: 'Vitamin D3', brand: 'Compounded', supplier: 'Formulation', unit: 'IU', defaultDose: 50000, category: 'vitamin' },
      { id: 'biotin', name: 'Biotin', brand: 'Compounded', supplier: 'Formulation', unit: 'mg', defaultDose: 1, category: 'vitamin' },
      { id: 'nad', name: 'NAD+', brand: 'Compounded', supplier: 'Olympia', unit: 'mg', defaultDose: 100, category: 'vitamin' },
      { id: 'vitamin-c', name: 'Vitamin C (Ascorbic Acid)', brand: 'Compounded', supplier: 'Formulation', unit: 'mg', defaultDose: 1000, category: 'vitamin' },
      { id: 'zinc', name: 'Zinc', brand: 'Compounded', supplier: 'Formulation', unit: 'mg', defaultDose: 5, category: 'vitamin' },
      { id: 'magnesium', name: 'Magnesium', brand: 'Compounded', supplier: 'Formulation', unit: 'mg', defaultDose: 200, category: 'vitamin' },
    ],
  },
  // IV THERAPY
  ivTherapy: {
    name: 'IV Therapy',
    icon: '💧',
    items: [
      { id: 'myers-cocktail', name: "Myers' Cocktail", brand: 'Compounded', supplier: 'Olympia', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'immunity-iv', name: 'Immunity IV (Vitamin C + Zinc)', brand: 'Compounded', supplier: 'Formulation', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'hydration-iv', name: 'Hydration IV (Saline)', brand: 'Compounded', supplier: 'McKesson', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'beauty-iv', name: 'Beauty IV (Biotin + Glutathione)', brand: 'Compounded', supplier: 'Olympia', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'athlete-iv', name: 'Athletic Recovery IV', brand: 'Compounded', supplier: 'Formulation', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'hangover-iv', name: 'Hangover Recovery IV', brand: 'Compounded', supplier: 'Olympia', unit: 'bag', defaultDose: 1, category: 'iv' },
      { id: 'nad-iv', name: 'NAD+ IV Infusion', brand: 'Compounded', supplier: 'Olympia', unit: 'bag', defaultDose: 1, category: 'iv' },
    ],
  },
  // SKIN TREATMENTS
  skinTreatments: {
    name: 'Skin Treatments',
    icon: '🌟',
    items: [
      { id: 'kybella', name: 'Kybella (Deoxycholic Acid)', brand: 'Allergan', supplier: 'McKesson', unit: 'vial', defaultDose: 1, category: 'skin' },
      { id: 'pdo-threads', name: 'PDO Threads', brand: 'Various', supplier: 'McKesson', unit: 'threads', defaultDose: 10, category: 'skin' },
      { id: 'prp', name: 'PRP (Platelet Rich Plasma)', brand: 'In-house', supplier: 'McKesson', unit: 'mL', defaultDose: 5, category: 'skin' },
      { id: 'prfm', name: 'PRFM (Platelet Rich Fibrin Matrix)', brand: 'In-house', supplier: 'McKesson', unit: 'mL', defaultDose: 5, category: 'skin' },
      { id: 'exosomes', name: 'Exosomes', brand: 'Various', supplier: 'Formulation', unit: 'vial', defaultDose: 1, category: 'skin' },
    ],
  },
  // LOCAL ANESTHETICS
  anesthetics: {
    name: 'Local Anesthetics',
    icon: '🩹',
    items: [
      { id: 'lidocaine-1', name: 'Lidocaine 1%', brand: 'Generic', supplier: 'McKesson', unit: 'mL', defaultDose: 1, category: 'anesthetic' },
      { id: 'lidocaine-2', name: 'Lidocaine 2%', brand: 'Generic', supplier: 'McKesson', unit: 'mL', defaultDose: 1, category: 'anesthetic' },
      { id: 'lidocaine-epi', name: 'Lidocaine with Epinephrine', brand: 'Generic', supplier: 'McKesson', unit: 'mL', defaultDose: 1, category: 'anesthetic' },
      { id: 'topical-numbing', name: 'BLT Topical Numbing Cream', brand: 'Compounded', supplier: 'Formulation', unit: 'application', defaultDose: 1, category: 'anesthetic' },
    ],
  },
};

const SUPPLIERS = [
  { id: 'all', name: 'All Suppliers', color: 'gray' },
  { id: 'McKesson', name: 'McKesson', color: 'blue' },
  { id: 'Olympia', name: 'Olympia Pharmacy', color: 'purple' },
  { id: 'Formulation', name: 'Formulation', color: 'green' },
];

interface Administration {
  id: string;
  medication_id: string;
  medication_name: string;
  dose: number;
  unit: string;
  client_name: string;
  provider_name: string;
  administered_at: string;
  lot_number?: string;
  notes?: string;
}

export default function AdminMedicationsPage() {
  const [administrations, setAdministrations] = useState<Administration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form for logging administration
  const [logForm, setLogForm] = useState({
    dose: 0,
    client_name: '',
    provider_name: '',
    lot_number: '',
    notes: '',
  });

  // Flatten all medications for searching
  const allMedications = useMemo(() => {
    const meds: any[] = [];
    Object.entries(MEDICATION_DATABASE).forEach(([catKey, category]) => {
      category.items.forEach(item => {
        meds.push({ ...item, categoryKey: catKey, categoryName: category.name, categoryIcon: category.icon });
      });
    });
    return meds;
  }, []);

  // Filter medications
  const filteredMedications = useMemo(() => {
    return allMedications.filter(med => {
      const matchesCategory = selectedCategory === 'all' || med.categoryKey === selectedCategory;
      const matchesSupplier = selectedSupplier === 'all' || med.supplier === selectedSupplier;
      const matchesSearch = !searchQuery || 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSupplier && matchesSearch;
    });
  }, [allMedications, selectedCategory, selectedSupplier, searchQuery]);

  // Group by category for display
  const groupedMedications = useMemo(() => {
    const groups: { [key: string]: { name: string; icon: string; items: any[] } } = {};
    filteredMedications.forEach(med => {
      if (!groups[med.categoryKey]) {
        groups[med.categoryKey] = { name: med.categoryName, icon: med.categoryIcon, items: [] };
      }
      groups[med.categoryKey].items.push(med);
    });
    return groups;
  }, [filteredMedications]);

  // Load recent administrations
  useEffect(() => {
    const fetchAdministrations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/medications?limit=50');
        if (res.ok) {
          const data = await res.json();
          setAdministrations(data.medications || []);
        }
      } catch (err) {
        console.error('Error loading medications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdministrations();
  }, []);

  // Log administration
  const handleLogAdministration = async () => {
    if (!selectedMed || !logForm.client_name || !logForm.provider_name) return;
    setSaving(true);
    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: selectedMed.id,
          medication_name: selectedMed.name,
          dose: logForm.dose || selectedMed.defaultDose,
          unit: selectedMed.unit,
          client_name: logForm.client_name,
          provider_name: logForm.provider_name,
          lot_number: logForm.lot_number || null,
          notes: logForm.notes || null,
          supplier: selectedMed.supplier,
          category: selectedMed.category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Logged ${selectedMed.name} administration!` });
        setShowLogModal(false);
        setSelectedMed(null);
        setLogForm({ dose: 0, client_name: '', provider_name: '', lot_number: '', notes: '' });
        // Add to local list
        setAdministrations(prev => [data.administration, ...prev]);
      } else {
        setMessage({ type: 'error', text: 'Failed to log administration' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to log administration' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = administrations.filter(a => new Date(a.administered_at) > weekAgo).length;
    const thisMonth = administrations.filter(a => new Date(a.administered_at) > monthAgo).length;

    return { thisWeek, thisMonth, total: administrations.length };
  }, [administrations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Medications</h1>
          <p className="text-black">Browse drugs & log administrations • Formulation, McKesson, Olympia</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">This Week</p>
          <p className="text-2xl font-bold text-black">{stats.thisWeek}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">This Month</p>
          <p className="text-2xl font-bold text-black">{stats.thisMonth}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Products</p>
          <p className="text-2xl font-bold text-pink-600">{allMedications.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Suppliers</p>
          <p className="text-2xl font-bold text-pink-600">3</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">🔍</span>
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Supplier Filter */}
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="px-4 py-2 border border-black rounded-lg"
          >
            {SUPPLIERS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-black rounded-lg"
          >
            <option value="all">All Categories</option>
            {Object.entries(MEDICATION_DATABASE).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Supplier Pills */}
        <div className="flex gap-2 mt-4">
          {SUPPLIERS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSupplier(s.id)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedSupplier === s.id
                  ? s.id === 'McKesson' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                  : s.id === 'Olympia' ? 'bg-pink-100 text-pink-700 ring-2 ring-purple-300'
                  : s.id === 'Formulation' ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                  : 'bg-pink-100 text-pink-700 ring-2 ring-pink-300'
                  : 'bg-white text-black hover:bg-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Grid by Category */}
      <div className="space-y-6">
        {Object.entries(groupedMedications).length === 0 ? (
          <div className="bg-white rounded-xl border border-black p-12 text-center text-black">
            <span className="text-4xl block mb-4">💊</span>
            <p>No medications match your search</p>
          </div>
        ) : (
          Object.entries(groupedMedications).map(([catKey, category]) => (
            <div key={catKey} className="bg-white rounded-xl border border-black overflow-hidden">
              <div className="px-5 py-3 bg-white border-b border-black flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <h2 className="font-semibold text-black">{category.name}</h2>
                <span className="text-sm text-black">({category.items.length})</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {category.items.map(med => (
                  <button
                    key={med.id}
                    onClick={() => {
                      setSelectedMed(med);
                      setLogForm({ ...logForm, dose: med.defaultDose });
                      setShowLogModal(true);
                    }}
                    className="text-left p-4 border border-black rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all group"
                  >
                    <p className="font-medium text-black text-sm group-hover:text-pink-700">{med.name}</p>
                    <p className="text-xs text-black mt-1">{med.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        med.supplier === 'McKesson' ? 'bg-blue-100 text-blue-700' :
                        med.supplier === 'Olympia' ? 'bg-pink-100 text-pink-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {med.supplier}
                      </span>
                      <span className="text-xs text-black">{med.defaultDose} {med.unit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Administrations */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Recent Administrations</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : administrations.length === 0 ? (
          <div className="p-8 text-center text-black">
            <p>No administrations logged yet</p>
            <p className="text-sm mt-1">Click any medication above to log an administration</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-black">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Medication</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Dose</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Client</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {administrations.slice(0, 20).map((admin) => (
                  <tr key={admin.id} className="hover:bg-white">
                    <td className="px-5 py-3 text-black text-sm">
                      {new Date(admin.administered_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-medium text-black">{admin.medication_name}</td>
                    <td className="px-5 py-3 text-black">{admin.dose} {admin.unit}</td>
                    <td className="px-5 py-3 text-black">{admin.client_name}</td>
                    <td className="px-5 py-3 text-black">{admin.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Administration Modal */}
      {showLogModal && selectedMed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Log Administration</h2>
              <p className="text-black">{selectedMed.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Dose *</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={logForm.dose || selectedMed.defaultDose}
                      onChange={(e) => setLogForm({ ...logForm, dose: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-4 py-2 border border-black rounded-l-lg"
                    />
                    <span className="px-3 py-2 bg-white border border-l-0 border-black rounded-r-lg text-black">
                      {selectedMed.unit}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Lot Number</label>
                  <input
                    type="text"
                    value={logForm.lot_number}
                    onChange={(e) => setLogForm({ ...logForm, lot_number: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Client Name *</label>
                <input
                  type="text"
                  value={logForm.client_name}
                  onChange={(e) => setLogForm({ ...logForm, client_name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Provider *</label>
                <select
                  value={logForm.provider_name}
                  onChange={(e) => setLogForm({ ...logForm, provider_name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                >
                  <option value="">Select provider...</option>
                  <option value="Danielle Alcala">Danielle Alcala</option>
                  <option value="Ryan Kent, APRN">Ryan Kent, APRN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Notes</label>
                <textarea
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={2}
                  placeholder="Optional notes..."
                />
              </div>

              <div className="p-3 bg-white rounded-lg text-sm">
                <p className="text-black">
                  <span className="font-medium">Supplier:</span> {selectedMed.supplier}
                </p>
                <p className="text-black">
                  <span className="font-medium">Brand:</span> {selectedMed.brand}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => { setShowLogModal(false); setSelectedMed(null); }}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogAdministration}
                disabled={saving || !logForm.client_name || !logForm.provider_name}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Logging...' : 'Log Administration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
