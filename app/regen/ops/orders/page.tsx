'use client';

import { useState } from 'react';
import Link from 'next/link';

type OrderStatus = 'pending' | 'processing' | 'compounding' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  formulation_id?: string;
  patient: {
    name: string;
    email: string;
  };
  items: Array<{
    sku: string;
    name: string;
    strength: string;
    qty: number;
    price: number;
  }>;
  total: number;
  status: OrderStatus;
  tracking?: string;
  created: string;
  updated: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '📋' },
  compounding: { label: 'Compounding', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '🧪' },
  shipped: { label: 'Shipped', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: '📦' },
  delivered: { label: 'Delivered', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: '❌' },
};

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    formulation_id: 'FRX-789012',
    patient: { name: 'Sarah Mitchell', email: 'sarah.m@email.com' },
    items: [{ sku: '2491', name: 'Semaglutide / B6', strength: '4mL · 2.5mg/10mg/mL', qty: 1, price: 299 }],
    total: 299,
    status: 'shipped',
    tracking: '1Z999AA10123456784',
    created: '2024-09-01T10:30:00Z',
    updated: '2024-09-03T14:20:00Z',
  },
  {
    id: 'ORD-2024-002',
    formulation_id: 'FRX-789013',
    patient: { name: 'Michael Rodriguez', email: 'mrodriguez@email.com' },
    items: [{ sku: '2499', name: 'Tirzepatide / B6', strength: '2mL · 12.5mg/10mg/mL', qty: 1, price: 349 }],
    total: 349,
    status: 'compounding',
    created: '2024-09-02T09:15:00Z',
    updated: '2024-09-03T11:00:00Z',
  },
  {
    id: 'ORD-2024-003',
    patient: { name: 'Jennifer Lee', email: 'jlee@email.com' },
    items: [
      { sku: '4041', name: 'B12 Methylcobalamin', strength: '10mL · 5mg/mL', qty: 1, price: 55 },
      { sku: '4039', name: 'Biotin', strength: '10mL · 10mg/mL', qty: 1, price: 82 },
    ],
    total: 137,
    status: 'pending',
    created: '2024-09-03T08:45:00Z',
    updated: '2024-09-03T08:45:00Z',
  },
  {
    id: 'ORD-2024-004',
    formulation_id: 'FRX-789010',
    patient: { name: 'David Kim', email: 'dkim@email.com' },
    items: [{ sku: '3839', name: 'NAD+ Sterile Injection', strength: '10mL · 200mg/mL', qty: 1, price: 375 }],
    total: 375,
    status: 'delivered',
    tracking: '1Z999AA10123456780',
    created: '2024-08-28T14:00:00Z',
    updated: '2024-09-01T16:30:00Z',
  },
  {
    id: 'ORD-2024-005',
    formulation_id: 'FRX-789014',
    patient: { name: 'Amanda Thompson', email: 'athompson@email.com' },
    items: [{ sku: '2884', name: 'Sermorelin Injection', strength: '6mL · 1mg/mL', qty: 2, price: 195 }],
    total: 195,
    status: 'processing',
    created: '2024-09-02T16:30:00Z',
    updated: '2024-09-03T09:00:00Z',
  },
];

export default function OrdersPage() {
  const [orders] = useState(SAMPLE_ORDERS);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      order.patient.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-white/50">{orders.length} total orders</p>
        </div>
        <Link
          href="/ops/orders/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all flex items-center gap-2"
        >
          <span>+</span> New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status as OrderStatus)}
              className={`p-3 rounded-xl border transition-all ${
                filter === status
                  ? config.color + ' ring-2 ring-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span>{config.icon}</span>
                <span className={filter === status ? '' : 'text-white/70'}>{count}</span>
              </div>
              <p className={`text-xs font-medium ${filter === status ? '' : 'text-white/50'}`}>
                {config.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, patients..."
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-teal-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          All Orders
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{order.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[order.status].color}`}>
                    {STATUS_CONFIG[order.status].icon} {STATUS_CONFIG[order.status].label}
                  </span>
                </div>
                <p className="text-white/50 text-sm">
                  {order.patient.name} • {order.patient.email}
                </p>
                {order.formulation_id && (
                  <p className="text-white/40 text-xs mt-1 font-mono">
                    Formulation Rx: {order.formulation_id}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">${order.total}</p>
                <p className="text-white/40 text-xs">Updated {formatDate(order.updated)}</p>
              </div>
            </div>

            {/* Items Preview */}
            <div className="flex flex-wrap gap-2">
              {order.items.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70">
                  {item.name} ({item.qty})
                </span>
              ))}
            </div>

            {/* Tracking */}
            {order.tracking && (
              <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20 flex items-center justify-between">
                <div>
                  <p className="text-teal-300 text-sm font-medium">📦 Tracking Number</p>
                  <p className="text-white font-mono text-sm">{order.tracking}</p>
                </div>
                <a
                  href={`https://www.ups.com/track?tracknum=${order.tracking}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-400 transition-colors"
                >
                  Track
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">No orders found</p>
          <p className="text-white/30 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{selectedOrder.id}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[selectedOrder.status].color}`}>
                    {STATUS_CONFIG[selectedOrder.status].icon} {STATUS_CONFIG[selectedOrder.status].label}
                  </span>
                </div>
                {selectedOrder.formulation_id && (
                  <p className="text-white/40 text-sm font-mono">
                    Formulation Rx: {selectedOrder.formulation_id}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Patient */}
            <div className="p-4 bg-white/5 rounded-xl mb-4">
              <p className="text-white/40 text-sm mb-1">Patient</p>
              <p className="text-white font-medium">{selectedOrder.patient.name}</p>
              <p className="text-white/50 text-sm">{selectedOrder.patient.email}</p>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/50 text-sm">{item.strength}</p>
                      <p className="text-white/40 text-xs font-mono">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${item.price}</p>
                      <p className="text-white/50 text-sm">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-teal-500/10 rounded-xl border border-teal-500/20 mb-6">
              <span className="text-white/70 font-medium">Total</span>
              <span className="text-2xl font-bold text-teal-400">${selectedOrder.total}</span>
            </div>

            {/* Tracking */}
            {selectedOrder.tracking && (
              <div className="p-4 bg-white/5 rounded-xl mb-6">
                <p className="text-white/40 text-sm mb-1">Tracking Number</p>
                <p className="text-white font-mono">{selectedOrder.tracking}</p>
                <a
                  href={`https://www.ups.com/track?tracknum=${selectedOrder.tracking}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-400 transition-colors"
                >
                  Track Package →
                </a>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-teal-400 rounded-full" />
                  <span className="text-white/70">Created</span>
                  <span className="text-white/50">{formatDate(selectedOrder.created)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-teal-400 rounded-full" />
                  <span className="text-white/70">Last Updated</span>
                  <span className="text-white/50">{formatDate(selectedOrder.updated)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all">
                💬 Message Patient
              </button>
              <button className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all">
                🔄 Refresh Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
