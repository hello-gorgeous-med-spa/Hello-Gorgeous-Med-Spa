'use client';

// ============================================================
// QUICK SALE PAGE
// Walk-in sales without appointment
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

// Mock services and products for quick sale
const QUICK_ITEMS = {
  services: [
    { id: 's1', name: 'Vitamin B12 Injection', price: 25, category: 'IV Therapy' },
    { id: 's2', name: 'Lipo-B Injection', price: 35, category: 'IV Therapy' },
    { id: 's3', name: 'Dermaplaning', price: 75, category: 'Facials' },
    { id: 's4', name: 'Add-On: LED Therapy', price: 50, category: 'Facials' },
    { id: 's5', name: 'Consultation', price: 0, category: 'Consultations' },
  ],
  products: [
    { id: 'p1', name: 'SkinScript Cleanser', price: 32, category: 'Skincare' },
    { id: 'p2', name: 'SkinScript Moisturizer', price: 45, category: 'Skincare' },
    { id: 'p3', name: 'AnteAge Serum', price: 175, category: 'AnteAge' },
    { id: 'p4', name: 'Lip Balm', price: 12, category: 'Retail' },
    { id: 'p5', name: 'Sunscreen SPF 50', price: 28, category: 'Skincare' },
  ],
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
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

  const items = activeTab === 'services' ? QUICK_ITEMS.services : QUICK_ITEMS.products;
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0; // Add tax logic if needed
  const total = subtotal + tax;

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setCompleted(true);
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
            onClick={() => setActiveTab('services')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'services'
                ? 'text-pink-400 border-b-2 border-pink-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'products'
                ? 'text-pink-400 border-b-2 border-pink-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Products
          </button>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4">
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
                    <p className="font-medium text-white">{item.name}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-400"
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
                    <p className="font-semibold text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
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
