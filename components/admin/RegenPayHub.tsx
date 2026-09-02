"use client";

import { useState } from "react";

const QUICK_ITEMS = [
  { id: "consult", name: "Telehealth Consultation", price: 99, description: "Initial provider consultation" },
  { id: "consult-followup", name: "Follow-Up Consultation", price: 49, description: "Follow-up visit" },
  { id: "rx-consult", name: "RX Consultation + Rx", price: 149, description: "Consultation with prescription" },
];

type Tab = "checkout" | "invoice" | "link";

export function RegenPayHub() {
  const [tab, setTab] = useState<Tab>("checkout");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; url?: string } | null>(null);

  // Checkout state
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [selectedItem, setSelectedItem] = useState(QUICK_ITEMS[0]);

  // Invoice state
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([{ description: "", amount: "" }]);
  const [invoiceMemo, setInvoiceMemo] = useState("");

  // Payment link state
  const [linkName, setLinkName] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{ name: string; url: string; amount: number }[]>([]);

  const clearResult = () => setResult(null);

  // Send checkout link
  const sendCheckout = async () => {
    if (!checkoutEmail) {
      setResult({ type: "error", message: "Email is required" });
      return;
    }
    setLoading(true);
    clearResult();
    try {
      const res = await fetch("/api/regen/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: checkoutEmail,
          name: checkoutName || undefined,
          items: [{ name: selectedItem.name, amount: selectedItem.price, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.url);
      setResult({ 
        type: "success", 
        message: `Checkout link copied! Send to ${checkoutEmail}`,
        url: data.url 
      });
      setCheckoutEmail("");
      setCheckoutName("");
    } catch (err) {
      setResult({ type: "error", message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  // Send invoice
  const sendInvoice = async () => {
    if (!invoiceEmail) {
      setResult({ type: "error", message: "Email is required" });
      return;
    }
    const items = invoiceItems.filter(i => i.description && i.amount);
    if (items.length === 0) {
      setResult({ type: "error", message: "Add at least one item" });
      return;
    }
    setLoading(true);
    clearResult();
    try {
      const res = await fetch("/api/regen/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invoiceEmail,
          name: invoiceName || undefined,
          items: items.map(i => ({ description: i.description, amount: parseFloat(i.amount) })),
          memo: invoiceMemo || undefined,
          autoSend: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invoice");
      setResult({ type: "success", message: `Invoice sent to ${invoiceEmail}!` });
      setInvoiceEmail("");
      setInvoiceName("");
      setInvoiceItems([{ description: "", amount: "" }]);
      setInvoiceMemo("");
    } catch (err) {
      setResult({ type: "error", message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  // Create payment link
  const createLink = async () => {
    if (!linkName || !linkAmount) {
      setResult({ type: "error", message: "Name and amount required" });
      return;
    }
    setLoading(true);
    clearResult();
    try {
      const res = await fetch("/api/regen/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: linkName,
          amount: parseFloat(linkAmount),
          description: linkDescription || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create link");
      
      await navigator.clipboard.writeText(data.url);
      setGeneratedLinks(prev => [{ name: linkName, url: data.url, amount: parseFloat(linkAmount) }, ...prev]);
      setResult({ type: "success", message: "Payment link copied!", url: data.url });
      setLinkName("");
      setLinkAmount("");
      setLinkDescription("");
    } catch (err) {
      setResult({ type: "error", message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  // Quick link from catalog
  const quickLink = async (item: typeof QUICK_ITEMS[0]) => {
    setLoading(true);
    clearResult();
    try {
      const res = await fetch("/api/regen/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          amount: item.price,
          description: item.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await navigator.clipboard.writeText(data.url);
      setResult({ type: "success", message: `${item.name} link copied!`, url: data.url });
    } catch (err) {
      setResult({ type: "error", message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Payment Links</h3>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => quickLink(item)}
              disabled={loading}
              className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-left"
            >
              <div className="font-bold text-lg">${item.price}</div>
              <div className="text-sm text-pink-100">{item.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Result Banner */}
      {result && (
        <div className={`mb-6 p-4 rounded-xl ${result.type === "success" ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${result.type === "success" ? "text-green-800" : "text-red-800"}`}>
                {result.type === "success" ? "✓" : "✕"} {result.message}
              </p>
              {result.url && (
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                  {result.url}
                </a>
              )}
            </div>
            <button onClick={clearResult} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {[
          { id: "checkout" as Tab, label: "Send Checkout" },
          { id: "invoice" as Tab, label: "Send Invoice" },
          { id: "link" as Tab, label: "Payment Link" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); clearResult(); }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              tab === t.id 
                ? "bg-white text-pink-600 shadow-md" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Checkout Tab */}
      {tab === "checkout" && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Send Checkout Link</h3>
          <p className="text-gray-500 text-sm mb-4">Patient receives a link to pay securely via Stripe</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email *</label>
              <input
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="patient@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name (optional)</label>
              <input
                type="text"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                value={selectedItem.id}
                onChange={(e) => setSelectedItem(QUICK_ITEMS.find(i => i.id === e.target.value) || QUICK_ITEMS[0])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none bg-white"
              >
                {QUICK_ITEMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — ${item.price}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={sendCheckout}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : `Send $${selectedItem.price} Checkout Link`}
            </button>
          </div>
        </div>
      )}

      {/* Invoice Tab */}
      {tab === "invoice" && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Send Invoice</h3>
          <p className="text-gray-500 text-sm mb-4">Patient receives an email invoice with a pay button</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email *</label>
                <input
                  type="email"
                  value={invoiceEmail}
                  onChange={(e) => setInvoiceEmail(e.target.value)}
                  placeholder="patient@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={invoiceName}
                  onChange={(e) => setInvoiceName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...invoiceItems];
                      updated[idx].description = e.target.value;
                      setInvoiceItems(updated);
                    }}
                    placeholder="Description"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const updated = [...invoiceItems];
                      updated[idx].amount = e.target.value;
                      setInvoiceItems(updated);
                    }}
                    placeholder="$"
                    className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
                  />
                  {invoiceItems.length > 1 && (
                    <button
                      onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                      className="px-3 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setInvoiceItems([...invoiceItems, { description: "", amount: "" }])}
                className="text-pink-600 hover:text-pink-700 text-sm font-semibold"
              >
                + Add item
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Memo (optional)</label>
              <input
                type="text"
                value={invoiceMemo}
                onChange={(e) => setInvoiceMemo(e.target.value)}
                placeholder="Thank you for choosing RE GEN!"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
              />
            </div>

            <button
              onClick={sendInvoice}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Invoice"}
            </button>
          </div>
        </div>
      )}

      {/* Payment Link Tab */}
      {tab === "link" && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Create Payment Link</h3>
          <p className="text-gray-500 text-sm mb-4">Generate a reusable link you can share anywhere</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product/Service Name *</label>
              <input
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Semaglutide 10mg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={linkAmount}
                  onChange={(e) => setLinkAmount(e.target.value)}
                  placeholder="299"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input
                type="text"
                value={linkDescription}
                onChange={(e) => setLinkDescription(e.target.value)}
                placeholder="4-week supply, injectable"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-0 outline-none"
              />
            </div>
            <button
              onClick={createLink}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create & Copy Link"}
            </button>
          </div>

          {/* Recent Links */}
          {generatedLinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Links</h4>
              <div className="space-y-2">
                {generatedLinks.slice(0, 5).map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{link.name}</span>
                      <span className="text-gray-500 ml-2">${link.amount}</span>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(link.url)}
                      className="text-pink-600 hover:text-pink-700 text-sm font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
