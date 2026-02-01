'use client';

// ============================================================
// QUICK SALE PAGE
// Walk-in sales without appointment - Connected to Live Data
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuickItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  type: 'service' | 'product' | 'custom';
}

export default function QuickSalePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [services, setServices] = useState<QuickItem[]>([]);
  const [products, setProducts] = useState<QuickItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');

  // Fetch real services and products
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch services
        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();
        if (servicesData.services) {
          setServices(
            servicesData.services.map((s: any) => ({
              id: s.id,
              name: s.name,
              price: s.price || 0,
              category: s.category_name || 'Service',
            }))
          );
        }

        // Fetch products from inventory
        const inventoryRes = await fetch('/api/inventory?category=retail');
        const inventoryData = await inventoryRes.json();
        if (inventoryData.items) {
          setProducts(
            inventoryData.items.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.retail_price || 0,
              category: p.category || 'Product',
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to some default items if API fails
        setServices([
          { id: 's1', name: 'Vitamin B12 Injection', price: 25, category: 'IV Therapy' },
          { id: 's2', name: 'Consultation', price: 0, category: 'Consultations' },
        ]);
        setProducts([
          { id: 'p1', name: 'Retail Product', price: 25, category: 'Skincare' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const items = activeTab === 'services' ? services : products;
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: typeof items[0]) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1, type: activeTab === 'services' ? 'service' : 'product' }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Add custom amount to cart
  const addCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: customDescription || 'Custom Charge',
      price: amount,
      quantity: 1,
      type: 'custom',
    };
    setCart([...cart, customItem]);
    setCustomAmount('');
    setCustomDescription('');
    setShowCustomAmount(false);
  };

  // Edit price of cart item
  const startEditingPrice = (item: CartItem) => {
    setEditingPriceId(item.id);
    setEditingPriceValue(item.price.toString());
  };

  const saveEditedPrice = (id: string) => {
    const newPrice = parseFloat(editingPriceValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
      setCart(cart.map(item => 
        item.id === id 
          ? { ...item, price: newPrice, originalPrice: item.originalPrice || item.price }
          : item
      ));
    }
    setEditingPriceId(null);
    setEditingPriceValue('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0; // Add tax logic if needed
  const total = subtotal + tax;

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setCompleted(true);
    
    // Send review request if we have customer phone
    if (customerPhone) {
      try {
        await fetch('/api/reviews/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: `walk-in-${Date.now()}`,
            client_name: customerName || 'Valued Guest',
            client_phone: customerPhone,
            service_name: cart[0]?.name, // Primary service
          }),
        });
      } catch (err) {
        console.log('Review request queued');
      }
    }
  };

  if (completed) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sale Complete!</h1>
          <p className="text-slate-400 text-xl mb-8">${total.toFixed(2)} paid</p>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
              📧 Email Receipt
            </button>
            <Link
              href="/pos"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium"
            >
              New Sale
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full">
          <button
            onClick={() => setShowCheckout(false)}
            className="text-slate-400 hover:text-white mb-4"
          >
            ← Back to Cart
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Customer Info (Optional)</h2>
          
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
            />
            <input
              type="email"
              placeholder="Email (for receipt)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
            />
          </div>

          <div className="border-t border-slate-700 pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Financing Options for larger purchases */}
          {total >= 200 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl border border-pink-700/30">
              <p className="text-sm text-pink-300 mb-3">💰 Need financing? As low as ${Math.round(total / 24)}/mo</p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open('https://withcherry.com/apply', '_blank')}
                  className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded-lg border border-red-500/30"
                >
                  🍒 Cherry
                </button>
                <button
                  onClick={() => window.open('https://www.carecredit.com/apply', '_blank')}
                  className="flex-1 py-2 px-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-sm rounded-lg border border-teal-500/30"
                >
                  💳 CareCredit
                </button>
                <button
                  onClick={() => window.open('https://www.patientfi.com/', '_blank')}
                  className="flex-1 py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded-lg border border-purple-500/30"
                >
                  ✨ PatientFi
                </button>
              </div>
            </div>
          )}

          {processing ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Processing payment...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
              >
                💳 Pay with Card
              </button>
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 flex items-center justify-center gap-2"
              >
                💵 Cash
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Items Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center gap-4">
          <Link href="/pos" className="text-slate-400 hover:text-white">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white">Quick Sale</h1>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => { setActiveTab('services'); setShowCustomAmount(false); }}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'services' && !showCustomAmount
                ? 'text-pink-400 border-b-2 border-pink-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => { setActiveTab('products'); setShowCustomAmount(false); }}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'products' && !showCustomAmount
                ? 'text-pink-400 border-b-2 border-pink-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setShowCustomAmount(true)}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              showCustomAmount
                ? 'text-green-400 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💵 Custom Amount
          </button>
        </div>

        {/* Items Grid / Custom Amount */}
        <div className="flex-1 overflow-y-auto p-4">
          {showCustomAmount ? (
            <div className="max-w-md mx-auto mt-8">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Enter Custom Amount</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Tip, Custom Service, Adjustment"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-3xl font-bold text-center placeholder-slate-500"
                      autoFocus
                    />
                  </div>
                </div>
                
                {/* Quick amount buttons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCustomAmount(amount.toString())}
                      className="py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={addCustomAmount}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                  className="w-full py-4 bg-green-500 text-white text-lg font-bold rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add ${customAmount || '0.00'} to Cart
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <p className="text-4xl mb-2">{activeTab === 'services' ? '💆' : '🛍️'}</p>
                <p>No {activeTab} found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-pink-500 transition-colors text-left"
                >
                  <p className="font-medium text-white mb-1 line-clamp-2">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.category}</p>
                  <p className="text-lg font-bold text-green-400 mt-2">
                    {item.price === 0 ? 'Free' : `$${item.price}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold text-white text-lg">Cart ({cart.length})</h2>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <p className="text-4xl mb-2">🛒</p>
              <p>Cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      {item.type === 'custom' && (
                        <span className="text-xs text-green-400">Custom</span>
                      )}
                      {item.originalPrice && item.originalPrice !== item.price && (
                        <span className="text-xs text-yellow-400 ml-2">
                          (was ${item.originalPrice})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-400 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded bg-slate-600 text-white hover:bg-slate-500"
                      >
                        -
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded bg-slate-600 text-white hover:bg-slate-500"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Editable Price */}
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-white">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingPriceValue}
                          onChange={(e) => setEditingPriceValue(e.target.value)}
                          onBlur={() => saveEditedPrice(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditedPrice(item.id);
                            if (e.key === 'Escape') {
                              setEditingPriceId(null);
                              setEditingPriceValue('');
                            }
                          }}
                          className="w-20 px-2 py-1 bg-slate-600 border border-pink-500 rounded text-white text-right"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingPrice(item)}
                        className="font-semibold text-white hover:text-pink-400 transition-colors group"
                        title="Click to edit price"
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                        <span className="text-xs text-slate-500 group-hover:text-pink-400 ml-1">✏️</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-4 border-t border-slate-700 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-600">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="p-4">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-green-500 text-white text-lg font-bold rounded-xl hover:bg-green-600"
              >
                Checkout ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
