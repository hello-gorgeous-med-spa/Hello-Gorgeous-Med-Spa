'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRegenAuth } from '@/components/regen/RegenAuthProvider';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

type OrderStatus = 'pending' | 'processing' | 'compounding' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  order_number: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  status: OrderStatus;
  tracking_number?: string;
  tracking_carrier?: string;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: '#F59E0B', icon: '⏳' },
  processing: { label: 'Processing', color: BRAND.teal, icon: '⚙️' },
  compounding: { label: 'Compounding', color: '#8B5CF6', icon: '🧪' },
  shipped: { label: 'Shipped', color: '#3B82F6', icon: '📦' },
  delivered: { label: 'Delivered', color: '#22C55E', icon: '✓' },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: '✕' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const { user } = useRegenAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/regen/patient/dashboard');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const FILTERS: Array<'all' | OrderStatus> = ['all', 'processing', 'shipped', 'delivered'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: BRAND.cream }}>Orders</h1>
          <p style={{ color: BRAND.gray }}>Track your orders and view order history.</p>
        </div>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: BRAND.pink, color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              backgroundColor: filter === f ? `${BRAND.teal}20` : BRAND.darkCard,
              color: filter === f ? BRAND.teal : BRAND.gray,
              border: `1px solid ${filter === f ? BRAND.teal : BRAND.gray}30`,
            }}
          >
            {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: BRAND.darkCard }}>
          <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto" />
        </div>
      )}

      {/* Orders List */}
      {!loading && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
            >
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg" style={{ color: BRAND.cream }}>
                        {order.order_number}
                      </h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ 
                          backgroundColor: `${STATUS_CONFIG[order.status].color}20`,
                          color: STATUS_CONFIG[order.status].color,
                        }}
                      >
                        {STATUS_CONFIG[order.status].icon} {STATUS_CONFIG[order.status].label}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: BRAND.gray }}>
                      Ordered {formatDate(order.created_at)}
                    </p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: BRAND.teal }}>
                    ${order.total?.toFixed(2)}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span style={{ color: BRAND.cream }}>{item.name} × {item.qty}</span>
                      <span style={{ color: BRAND.gray }}>${item.price?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking */}
                {order.tracking_number && (
                  <div 
                    className="p-3 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: `${BRAND.teal}10` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: BRAND.cream }}>
                          {order.tracking_carrier || 'USPS'} Tracking
                        </p>
                        <p className="text-xs font-mono" style={{ color: BRAND.teal }}>
                          {order.tracking_number}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/search?q=${order.tracking_carrier || 'USPS'}+tracking+${order.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{ backgroundColor: BRAND.teal, color: 'white' }}
                    >
                      Track
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div 
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${BRAND.teal}10` }}
          >
            <svg className="w-10 h-10" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>
            {filter === 'all' ? 'No orders yet' : `No ${STATUS_CONFIG[filter]?.label.toLowerCase()} orders`}
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
            When you complete a visit and get prescribed, your orders will appear here.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: BRAND.pink, color: 'white' }}
          >
            Start Your First Visit
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* What to expect */}
      <div 
        className="p-6 rounded-xl"
        style={{ backgroundColor: BRAND.darkCard, border: `1px solid ${BRAND.teal}20` }}
      >
        <h3 className="font-semibold mb-4" style={{ color: BRAND.cream }}>What to expect</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Fast Processing', desc: 'Orders are processed within 24-48 hours after provider approval.' },
            { title: 'Free Shipping', desc: 'All prescriptions ship free via USPS or FedEx with tracking.' },
            { title: 'Discreet Packaging', desc: 'Plain packaging with no indication of contents.' },
          ].map((item) => (
            <div key={item.title}>
              <h4 className="font-medium mb-1" style={{ color: BRAND.teal }}>{item.title}</h4>
              <p className="text-sm" style={{ color: BRAND.gray }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
