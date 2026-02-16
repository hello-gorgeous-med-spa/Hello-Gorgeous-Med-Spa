// ============================================================
// NEW CHART-TO-CART SESSION
// Start a treatment, chart products, checkout seamlessly
// ============================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  sku?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Product categories with common med spa products
const PRODUCT_CATEGORIES = [
  { id: 'recently-used', name: 'Recently Used', icon: '🕐' },
  { id: 'medical-supplies', name: 'Medical Supplies', icon: '🩹' },
  { id: 'botox', name: 'Botox', icon: '💉' },
  { id: 'fillers', name: 'Fillers', icon: '💋' },
  { id: 'skincare', name: 'Skincare', icon: '✨' },
  { id: 'iv-therapy', name: 'IV Therapy', icon: '💧' },
];

// Default products for demo
const DEFAULT_PRODUCTS: Product[] = [
  // Botox
  { id: 'botox-1', name: 'Botox Cosmetic', category: 'botox', price: 15, unit: 'Units' },
  { id: 'botox-2', name: 'Dysport', category: 'botox', price: 5, unit: 'Units' },
  { id: 'botox-3', name: 'Jeuveau', category: 'botox', price: 10, unit: 'Units' },
  { id: 'botox-4', name: 'Xeomin', category: 'botox', price: 12, unit: 'Units' },
  // Fillers
  { id: 'filler-1', name: 'Restylane Lyft', category: 'fillers', price: 750, unit: 'Syringe' },
  { id: 'filler-2', name: 'Restylane Defyne', category: 'fillers', price: 699, unit: 'Syringe' },
  { id: 'filler-3', name: 'Restylane Contour', category: 'fillers', price: 762.50, unit: 'Syringe' },
  { id: 'filler-4', name: 'Juvederm Voluma', category: 'fillers', price: 850, unit: 'Syringe' },
  { id: 'filler-5', name: 'Juvederm Volbella', category: 'fillers', price: 650, unit: 'Syringe' },
  { id: 'filler-6', name: 'Revanesse Versa +', category: 'fillers', price: 725, unit: 'Syringe' },
  { id: 'filler-7', name: 'RHA Collection', category: 'fillers', price: 700, unit: 'Syringe' },
  // IV Therapy
  { id: 'iv-1', name: "Myers' Cocktail IV", category: 'iv-therapy', price: 175, unit: 'Treatment' },
  { id: 'iv-2', name: 'Beauty Glow IV', category: 'iv-therapy', price: 200, unit: 'Treatment' },
  { id: 'iv-3', name: 'Immunity Boost IV', category: 'iv-therapy', price: 150, unit: 'Treatment' },
  // Medical Supplies
  { id: 'supply-1', name: 'Lidocaine 2%', category: 'medical-supplies', price: 25, unit: 'Vial' },
  { id: 'supply-2', name: 'Ice Pack', category: 'medical-supplies', price: 5, unit: 'Each' },
  { id: 'supply-3', name: 'Topical Numbing Cream', category: 'medical-supplies', price: 35, unit: 'Tube' },
];

export default function NewChartToCartPage() {
  const router = useRouter();
  const [step, setStep] = useState<'client' | 'treatment'>('client');
  
  // Client selection
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(false);
  
  // Treatment/Products
  const [selectedCategory, setSelectedCategory] = useState('botox');
  const [products] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchProducts, setSearchProducts] = useState('');
  
  // Treatment notes
  const [treatmentArea, setTreatmentArea] = useState('');
  const [notes, setNotes] = useState('');

  // Photo upload
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Fetch clients: entire DB when no search (limit 500), search when typing
  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const params = new URLSearchParams();
      if (clientSearch.trim()) params.append('search', clientSearch.trim());
      params.append('limit', clientSearch.trim() ? '100' : '500');
      
      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [clientSearch]);

  useEffect(() => {
    const debounce = setTimeout(fetchClients, 300);
    return () => clearTimeout(debounce);
  }, [fetchClients]);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'recently-used' || p.category === selectedCategory;
    const matchesSearch = !searchProducts || 
      p.name.toLowerCase().includes(searchProducts.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;
    e.target.value = '';

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const imageData = reader.result as string;
        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: selectedClient.id,
            type: 'before',
            image_data: imageData,
            treatment_area: treatmentArea || 'Full Face',
            notes: notes ? `Treatment session: ${notes}` : 'Chart-to-cart session',
          }),
        });
        if (res.ok) {
          alert(`Photo saved for ${selectedClient.first_name} ${selectedClient.last_name}. View in their Photos tab.`);
        } else {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'Failed to upload photo');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const surcharge = cartTotal * 0.0275;
  const salesTax = cartTotal * 0.0875;
  const grandTotal = cartTotal + surcharge + salesTax;

  // Start session: save to API (persists to client profile), then redirect
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleStartSession = async () => {
    if (!selectedClient || cart.length === 0) return;
    setSaving(true);
    setSaveError('');
    try {
      const clientName = [selectedClient.first_name, selectedClient.last_name].filter(Boolean).join(' ') || selectedClient.email || 'Client';
      const treatmentSummary = cart.map(i => `${i.name} (${i.quantity} ${i.unit}${i.quantity !== 1 ? 's' : ''})`).join(', ');
      const productsPayload = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      }));

      const res = await fetch('/api/chart-to-cart/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          client_name: clientName,
          provider: 'Staff',
          status: 'ready_to_checkout',
          treatment_summary: treatmentSummary,
          products: productsPayload,
          total: grandTotal,
          paperwork: { consents: false, questionnaires: false },
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || 'Failed to save session');
        return;
      }
      router.push('/admin/chart-to-cart');
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/chart-to-cart"
                className="text-black hover:text-black transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-semibold text-black">New Treatment Session</h1>
            </div>
            <div className="flex items-center gap-3">
              {step === 'treatment' && selectedClient && (
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg">
                  <span className="text-pink-600 font-medium">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </span>
                  <button
                    onClick={() => { setStep('client'); setSelectedClient(null); }}
                    className="text-pink-400 hover:text-pink-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Step 1: Client Selection */}
        {step === 'client' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
              <div className="p-6 border-b border-black">
                <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                  <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Select Client
                </h2>
                <p className="text-black text-sm mt-1">Search from your full client list or add a new client</p>
              </div>

              <div className="p-6">
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Search by name, email, or phone..."
                      className="w-full px-4 py-3 pl-12 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black">🔍</span>
                  </div>
                  <Link
                    href="/admin/clients/new?returnTo=/admin/chart-to-cart/new"
                    className="shrink-0 px-5 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <span>➕</span> Create New Client
                  </Link>
                </div>

                <p className="text-xs text-black mb-3">
                  {clientSearch.trim() ? `Showing matches for "${clientSearch}"` : 'Showing your full client list (A–Z). Use search to narrow.'}
                </p>

                <div className="mt-2 max-h-80 overflow-y-auto">
                  {loadingClients ? (
                    <div className="py-8 text-center text-black">Loading clients...</div>
                  ) : clients.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-black mb-4">
                        {clientSearch.trim() ? 'No clients match your search.' : 'No clients in your database yet.'}
                      </p>
                      <Link
                        href="/admin/clients/new?returnTo=/admin/chart-to-cart/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium"
                      >
                        <span>➕</span> Create New Client
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            setSelectedClient(client);
                            setStep('treatment');
                          }}
                          className="w-full p-4 text-left rounded-xl border border-black hover:border-pink-300 hover:bg-pink-50/50 transition-colors flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-black">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-sm text-black">{client.email}</p>
                          </div>
                          <span className="text-black">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Treatment & Products */}
        {step === 'treatment' && selectedClient && (
          <div className="flex gap-6">
            {/* Left: Product Selection */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
                {/* Category Tabs */}
                <div className="border-b border-black overflow-x-auto">
                  <div className="flex items-center p-2 gap-1 min-w-max">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          selectedCategory === cat.id
                            ? 'bg-pink-100 text-pink-700'
                            : 'text-black hover:bg-white'
                        }`}
                      >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & Products */}
                <div className="p-4">
                  <input
                    type="text"
                    value={searchProducts}
                    onChange={(e) => setSearchProducts(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 mb-4"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="p-4 text-left border border-black rounded-xl hover:border-pink-300 hover:bg-pink-50/30 transition-all group"
                      >
                        <p className="font-medium text-black text-sm group-hover:text-pink-700">
                          {product.name}
                        </p>
                        <p className="text-pink-600 font-semibold mt-1">
                          ${product.price.toFixed(2)}
                          <span className="text-black font-normal text-xs">/{product.unit}</span>
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-black bg-white">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/charting/injection-map?client=${selectedClient.id}`}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium text-center flex items-center justify-center gap-2"
                    >
                      <span>💉</span> Open Injection Map
                    </Link>
                    <>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-4 py-3 border border-black rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {uploadingPhoto ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <span>📷</span>
                        )}
                        {uploadingPhoto ? 'Uploading…' : 'Upload Photo'}
                      </button>
                    </>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Cart Summary */}
            <div className="w-96">
              <div className="bg-white rounded-2xl border border-black shadow-sm sticky top-24">
                <div className="p-4 border-b border-black">
                  <h3 className="font-semibold text-black flex items-center justify-between">
                    <span>Current Sale</span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </h3>
                </div>

                {/* Cart Items */}
                <div className="p-4 max-h-80 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-center text-black py-8">
                      Add products to start the sale
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-black last:border-0">
                          <div className="flex-1">
                            <p className="text-pink-600 font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-black">${item.price.toFixed(2)}/{item.unit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-white rounded-lg hover:bg-white text-black flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 bg-white rounded-lg hover:bg-white text-black flex items-center justify-center"
                            >
                              +
                            </button>
                            <span className="w-20 text-right font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 ml-2"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals */}
                {cart.length > 0 && (
                  <div className="p-4 bg-white border-t border-black">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-black">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-black">
                        <span>Surcharge (2.75%)</span>
                        <span>${surcharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-black">
                        <span>Sales Tax (8.75%)</span>
                        <span>${salesTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-black">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-black space-y-2">
                  {saveError && (
                    <p className="text-sm text-red-600 text-center">{saveError}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-black mb-3">
                    <span className="flex-1 flex items-center gap-1">
                      <span>^</span> Option
                    </span>
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <span>🗑</span> Remove All
                    </button>
                  </div>
                  <button
                    onClick={handleStartSession}
                    disabled={cart.length === 0 || saving}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving to client profile…' : 'Save & Checkout'}
                  </button>
                  <p className="text-xs text-black text-center">Session is saved to this client&apos;s profile</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
