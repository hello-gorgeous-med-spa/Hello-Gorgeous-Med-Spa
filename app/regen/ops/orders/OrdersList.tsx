'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { requestStatusLabel } from '@/lib/regen/request-status';

interface InvoiceQuote {
  amountUsd: number;
  productUsd: number;
  shippingUsd: number;
  discountUsd: number;
  consultCreditUsd: number;
  label: string;
  ready: boolean;
  reason?: string;
  charmManual?: boolean;
  lines: { label: string; amountUsd: number }[];
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total?: number;
  pharmacy_order_id?: string | null;
  pharmacyError?: string | null;
  pharmacy_error?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  intake_id?: string | null;
  notes?: string | null;
  created_at: string;
  items?: Array<{ name?: string }>;
}

function isTestOrder(o: Order) {
  const blob = `${o.notes || ''} ${o.pharmacy_error || ''} ${o.pharmacyError || ''} ${o.pharmacy_order_id || ''}`;
  return /STAGE2 TEST|\bTEST:|TEST-FC-|TESTTRACK/i.test(blob);
}

export default function OrdersList({ initialOrders = [] }: { initialOrders?: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [pharmacyId, setPharmacyId] = useState<Record<string, string>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [invoiceMsg, setInvoiceMsg] = useState<Record<string, string>>({});
  const [quotes, setQuotes] = useState<Record<string, InvoiceQuote>>({});
  const [gorgeous20, setGorgeous20] = useState<Record<string, boolean>>({});
  const [consultCredit, setConsultCredit] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<Record<string, string>>({});
  const [showTests, setShowTests] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/regen/ops/orders?status=all', { cache: 'no-store' });
    const j = await res.json();
    setOrders(j.orders || []);
    setLoading(false);
  }, []);

  async function patchOrder(order: Order, status: string, extra: Record<string, unknown> = {}) {
    const res = await fetch('/api/regen/ops/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status, ...extra }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setInvoiceMsg((prev) => ({ ...prev, [order.id]: json.error || 'Update blocked.' }));
      return;
    }
    await load();
  }

  async function quoteInvoice(order: Order, previewOnly: boolean) {
    setSending(order.id);
    const typed = amounts[order.id]?.trim();
    const res = await fetch('/api/regen/ops/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        amountUsd: typed ? Number(typed) : undefined,
        applyGorgeous20: gorgeous20[order.id] ?? true,
        applyConsultCredit: Boolean(consultCredit[order.id]),
        previewOnly,
      }),
    });
    const json = await res.json();
    setSending(null);
    if (!res.ok) {
      setInvoiceMsg((prev) => ({ ...prev, [order.id]: json.error || 'Could not build the invoice quote.' }));
      return;
    }
    if (json.quote) setQuotes((prev) => ({ ...prev, [order.id]: json.quote }));
    const dollars = json.quote?.amountUsd != null ? `$${Number(json.quote.amountUsd).toFixed(2)}` : '';
    if (previewOnly) {
      setInvoiceMsg((prev) => ({
        ...prev,
        [order.id]: `Quote ${dollars}. Create this amount in Charm → Send Invoice → Payment Link. Do not send Formulation until paid.`,
      }));
      return;
    }
    if (json.charmManual) {
      setInvoiceMsg((prev) => ({
        ...prev,
        [order.id]: `Charm-manual quote saved ${dollars}. Staff sends the Charm payment link. After Bluefin posts, mark Paid, then send Formulation.`,
      }));
    } else {
      setInvoiceMsg((prev) => ({
        ...prev,
        [order.id]: `Sent ${dollars}${json.emailed ? ' · email' : ''}${json.texted ? ' · text' : ''}.`,
      }));
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-white/50">
            Manual clinic invoice (Charm + Bluefin). Preview the quote, send that amount from Charm, then after Bluefin
            posts paste the payment id. Then Formulation. TEST rows stay hidden unless you open Tests.
          </p>
          <p className="text-white/35 text-xs mt-2">
            Daily: Danielle — unpaid quotes. Ryan — Today review. Danielle or Damara — pharmacy issue. Do not mark paid without a Charm/Bluefin id.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTests((v) => !v)}
            className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
          >
            {showTests ? 'Hide TEST' : 'Show TEST'}
          </button>
          <button onClick={load} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Refresh</button>
        </div>
      </div>
      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">
          No pharmacy orders yet. If you just approved on Today, tap Refresh. The visit also stays on Today → Approved — awaiting payment.
        </div>
      )}
      <div className="space-y-3">
        {orders.filter((o) => (showTests ? isTestOrder(o) : !isTestOrder(o))).map((o) => {
          const quote = quotes[o.id];
          return (
            <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white font-semibold">{o.order_number}</p>
              <p className="text-white/50 text-sm">
                {o.items?.[0]?.name || 'REGEN RX'} · {requestStatusLabel(o.status)}
                {o.total != null ? ` · $${o.total}` : ''}
              </p>
              {o.pharmacy_order_id ? (
                <p className="text-teal-300 text-sm mt-2">Formulation confirmation: {o.pharmacy_order_id}</p>
              ) : (
                <p className="text-amber-300 text-sm mt-2">
                  Not sent to Formulation yet. Wait for Charm payment, then send in the Formulation portal and record the confirmation.
                </p>
              )}
              {(o.pharmacyError || o.pharmacy_error) && (
                <p className="text-red-400 text-sm mt-2">{o.pharmacyError || o.pharmacy_error}</p>
              )}
              {o.tracking_number && (
                <p className="text-white/70 text-sm mt-1">{o.tracking_carrier} {o.tracking_number}</p>
              )}
              {quote && (
                <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-white/80">
                  {quote.lines.map((line) => (
                    <p key={line.label} className="flex justify-between gap-4">
                      <span>{line.label}</span>
                      <span>${line.amountUsd.toFixed(2)}</span>
                    </p>
                  ))}
                  {!quote.ready && quote.reason && <p className="text-amber-200 mt-2">{quote.reason}</p>}
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-white/80">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={gorgeous20[o.id] ?? true}
                    onChange={(e) => setGorgeous20({ ...gorgeous20, [o.id]: e.target.checked })}
                  />
                  GORGEOUS20 (20% off medication)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(consultCredit[o.id])}
                    onChange={(e) => setConsultCredit({ ...consultCredit, [o.id]: e.target.checked })}
                  />
                  $49 consult credit
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <input
                  value={amounts[o.id] || ''}
                  onChange={(e) => setAmounts({ ...amounts, [o.id]: e.target.value })}
                  placeholder="Override total if needed"
                  inputMode="decimal"
                  className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm w-44"
                />
                <button
                  onClick={() => void quoteInvoice(o, true)}
                  disabled={sending === o.id}
                  className="px-3 py-2 rounded-lg bg-white/15 text-white text-sm disabled:opacity-50"
                >
                  {sending === o.id ? 'Working…' : 'Preview invoice'}
                </button>
                <button
                  onClick={() => void quoteInvoice(o, false)}
                  disabled={sending === o.id}
                  className="px-3 py-2 rounded-lg bg-[#E6007E] text-white text-sm disabled:opacity-50"
                >
                  Save Charm quote
                </button>
                <input
                  value={paymentRef[o.id] || ''}
                  onChange={(e) => setPaymentRef({ ...paymentRef, [o.id]: e.target.value })}
                  placeholder="Charm / Bluefin payment id"
                  className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm w-56"
                />
                <button
                  onClick={() => void patchOrder(o, 'paid', { payment_id: paymentRef[o.id] })}
                  className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm"
                >
                  Record posted payment
                </button>
                <input
                  value={pharmacyId[o.id] || ''}
                  onChange={(e) => setPharmacyId({ ...pharmacyId, [o.id]: e.target.value })}
                  placeholder="Formulation confirmation"
                  className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
                />
                <button
                  onClick={() =>
                    void patchOrder(o, 'sent_to_pharmacy', { pharmacy_order_id: pharmacyId[o.id] || undefined })
                  }
                  className="px-3 py-2 rounded-lg bg-cyan-700 text-white text-sm"
                >
                  Sent to pharmacy
                </button>
                <button
                  onClick={() => void patchOrder(o, 'pharmacy_issue')}
                  className="px-3 py-2 rounded-lg bg-red-800 text-white text-sm"
                >
                  Pharmacy issue
                </button>
                <input
                  value={tracking[o.id] || ''}
                  onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })}
                  placeholder="Tracking number"
                  className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
                />
                <button
                  onClick={() =>
                    void patchOrder(o, 'shipped', {
                      tracking_number: tracking[o.id],
                      tracking_carrier: 'USPS',
                      pharmacy_order_id: o.pharmacy_order_id || pharmacyId[o.id] || undefined,
                    })
                  }
                  className="px-3 py-2 rounded-lg bg-teal-500 text-white text-sm"
                >
                  Mark shipped
                </button>
                {o.intake_id && (
                  <Link href="/ops" className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Today</Link>
                )}
              </div>
              {invoiceMsg[o.id] && <p className="text-[#FFB8DC] text-sm mt-2">{invoiceMsg[o.id]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
