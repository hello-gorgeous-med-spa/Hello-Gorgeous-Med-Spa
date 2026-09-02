'use client';

import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  darkCard: '#1A1A1A',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export default function OrdersPage() {
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
        {['All', 'Processing', 'Shipped', 'Delivered'].map((filter, idx) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: idx === 0 ? `${BRAND.teal}20` : BRAND.darkCard,
              color: idx === 0 ? BRAND.teal : BRAND.gray,
              border: `1px solid ${idx === 0 ? BRAND.teal : BRAND.gray}30`,
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div 
        className="p-12 rounded-xl text-center"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
      >
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${BRAND.teal}10` }}
        >
          <svg className="w-10 h-10" style={{ color: BRAND.teal }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: BRAND.cream }}>No orders yet</h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
          When you complete a visit and get prescribed, your orders will appear here.
          You&apos;ll be able to track shipping and view your order history.
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

      {/* What to expect */}
      <div 
        className="p-6 rounded-xl"
        style={{ 
          backgroundColor: BRAND.darkCard,
          border: `1px solid ${BRAND.teal}20`,
        }}
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
