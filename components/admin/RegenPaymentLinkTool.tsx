'use client';

import { useState } from 'react';

// Quick products matching lib/regen-stripe.ts
const QUICK_PRODUCTS = [
  { key: 'telehealth_consult', label: 'Telehealth Consult', amount: 49, category: 'Consults' },
  { key: 'semaglutide_maint', label: 'Semaglutide (Maint)', amount: 195, category: 'GLP-1' },
  { key: 'semaglutide_titration', label: 'Semaglutide (Titration)', amount: 245, category: 'GLP-1' },
  { key: 'tirzepatide_maint', label: 'Tirzepatide (Maint)', amount: 295, category: 'GLP-1' },
  { key: 'tirzepatide_max', label: 'Tirzepatide 15mg', amount: 395, category: 'GLP-1' },
  { key: 'bpc157', label: 'BPC-157', amount: 169, category: 'Peptides' },
  { key: 'sermorelin', label: 'Sermorelin', amount: 149, category: 'Peptides' },
  { key: 'tb500', label: 'TB-500', amount: 169, category: 'Peptides' },
  { key: 'nad_injection', label: 'NAD+ Injectable', amount: 169, category: 'Peptides' },
  { key: 'pt141', label: 'PT-141', amount: 209, category: 'Peptides' },
  { key: 'hrt_women', label: "Women's HRT", amount: 150, category: 'Hormones' },
  { key: 'trt_men', label: "Men's TRT", amount: 200, category: 'Hormones' },
  { key: 'labs_peak', label: 'Peak Performance Labs', amount: 199, category: 'Labs' },
  { key: 'labs_hrt', label: 'HRT Baseline Labs', amount: 299, category: 'Labs' },
  { key: 'labs_metabolic', label: 'Metabolic Labs', amount: 249, category: 'Labs' },
  { key: 'shipping', label: 'Pharmacy Shipping', amount: 35, category: 'Other' },
];

const CATEGORIES = ['Consults', 'GLP-1', 'Peptides', 'Hormones', 'Labs', 'Other'];

interface GeneratedLink {
  url: string;
  product: string;
  amount: number;
}

export default function RegenPaymentLinkTool() {
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Custom link state
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const generateLink = async (productKey: string, label: string, amount: number) => {
    setLoading(productKey);
    setError(null);

    try {
      const response = await fetch('/api/regen/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedLinks((prev) => [
          { url: data.paymentLink.url, product: label, amount },
          ...prev,
        ]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate link');
    } finally {
      setLoading(null);
    }
  };

  const generateCustomLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customAmount) return;

    setLoading('custom');
    setError(null);

    try {
      const response = await fetch('/api/regen/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custom: {
            name: customName,
            amount: parseFloat(customAmount),
            description: customDescription || undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedLinks((prev) => [
          { url: data.paymentLink.url, product: customName, amount: parseFloat(customAmount) },
          ...prev,
        ]);
        setCustomName('');
        setCustomAmount('');
        setCustomDescription('');
        setShowCustom(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate link');
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Links</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate shareable Stripe payment URLs — text or email to patients
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Quick Products by Category */}
      <div className="space-y-6 mb-8">
        {CATEGORIES.map((category) => {
          const products = QUICK_PRODUCTS.filter((p) => p.category === category);
          if (products.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <button
                    key={product.key}
                    onClick={() => generateLink(product.key, product.label, product.amount)}
                    disabled={loading === product.key}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50 transition-colors"
                  >
                    {loading === product.key ? (
                      <span className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{product.label}</span>
                    )}
                    <span className="text-sm text-gray-500">${product.amount}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Link */}
      <div className="mb-8">
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            + Create custom payment link
          </button>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Custom Payment Link</h3>
            <form onSubmit={generateCustomLink} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Product name"
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Amount ($)"
                  min="1"
                  step="0.01"
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading === 'custom'}
                  className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
                >
                  {loading === 'custom' ? 'Creating...' : 'Create Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustom(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Generated Links */}
      {generatedLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Generated Links
          </h3>
          <div className="space-y-3">
            {generatedLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{link.product}</p>
                  <p className="text-sm text-gray-500">${link.amount}</p>
                  <p className="text-xs text-blue-600 truncate mt-1">{link.url}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(link.url)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      copied === link.url
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copied === link.url ? 'Copied!' : 'Copy'}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How to use</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Click a product button to generate a payment link</li>
          <li>Copy the link and text/email it to your patient</li>
          <li>Patient clicks the link and pays via Stripe checkout</li>
          <li>You get notified when payment completes</li>
        </ol>
      </div>
    </div>
  );
}
