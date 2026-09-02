'use client';

import { useState } from 'react';
import RegenInvoiceTool from '@/components/admin/RegenInvoiceTool';
import RegenPaymentLinkTool from '@/components/admin/RegenPaymentLinkTool';

type Tab = 'links' | 'invoice';

export default function RegenPayPage() {
  const [activeTab, setActiveTab] = useState<Tab>('links');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Re Gen Payments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Stripe-powered payments for Re Gen RX (bypasses Square)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Stripe Connected
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-200 -mb-px">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'links'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment Links
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'invoice'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'links' && <RegenPaymentLinkTool />}
        {activeTab === 'invoice' && <RegenInvoiceTool />}
      </div>
    </div>
  );
}
