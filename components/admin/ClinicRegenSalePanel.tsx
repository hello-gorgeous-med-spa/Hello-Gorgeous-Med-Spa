"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import TerminalStatusModal from "@/components/TerminalStatusModal";
import { RegenSoldByPicker } from "@/components/admin/RegenSoldByPicker";
import {
  RX_CLINIC_TITRATION_PRESETS,
  type RxClinicClinical,
  type RxClinicEncounterRow,
  type RxClinicPharmacy,
} from "@/lib/rx-clinic-encounter";
import type { RxClinicLineItem, RxClinicRegenPricingSnapshot } from "@/lib/rx-clinic-regen-sale";
import { regenClinicEncounterTitle } from "@/lib/rx-clinic-regen-sale";
import type { RegenProductPrice } from "@/lib/regen/pricing-sync";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
};

type CatalogGroup = {
  id: string;
  label: string;
  products: RegenProductPrice[];
};

type CartLine = {
  productId: string;
  quantity: number;
  supplyCycle: RxSupplyCycleId;
};

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

type Props = {
  client: Client;
  appointmentId?: string;
  onSaved?: () => void;
};

export function ClinicRegenSalePanel({ client, appointmentId, onSaved }: Props) {
  const [catalog, setCatalog] = useState<CatalogGroup[]>([]);
  const [activeCategory, setActiveCategory] = useState("peptide-therapy");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [includeShipping, setIncludeShipping] = useState(true);
  const [discountUsd, setDiscountUsd] = useState("0");
  const [discountReason, setDiscountReason] = useState("");
  const [soldByUserId, setSoldByUserId] = useState("");
  const [shipLine1, setShipLine1] = useState(client.address_line1 || "");
  const [shipLine2, setShipLine2] = useState("");
  const [shipCity, setShipCity] = useState(client.city || "");
  const [shipState, setShipState] = useState(client.state || "IL");
  const [shipZip, setShipZip] = useState(client.postal_code || "");
  const [pharmacy, setPharmacy] = useState<RxClinicPharmacy>("boomrx");
  const [sig, setSig] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [clinical, setClinical] = useState<RxClinicClinical>({
    allergiesReviewed: false,
    currentMedicationsReviewed: false,
    contraindicationsNone: false,
    labsOnFile: false,
    titrationNote: RX_CLINIC_TITRATION_PRESETS[0],
  });

  const [snapshot, setSnapshot] = useState<RxClinicRegenPricingSnapshot | null>(null);
  const [lineItems, setLineItems] = useState<RxClinicLineItem[]>([]);
  const [savedEncounter, setSavedEncounter] = useState<RxClinicEncounterRow | null>(null);
  const [dispatchPreview, setDispatchPreview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [charging, setCharging] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalSaleId, setTerminalSaleId] = useState("");
  const [terminalAmount, setTerminalAmount] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [dispatchSaving, setDispatchSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/rx/clinic-encounters?catalog=1");
      const data = await res.json();
      if (res.ok && data.regenCatalog) {
        setCatalog(data.regenCatalog);
        setActiveCategory(data.regenCatalog[0]?.id || "peptide-therapy");
      }
    })();
  }, []);

  const buildPayload = useCallback(
    () => ({
      saleMode: "regen_catalog",
      clientId: client.id,
      lineItems: cart,
      includeShipping,
      discountUsd: Number(discountUsd) || 0,
      discountReason,
      shipAddressLine1: shipLine1,
      shipAddressLine2: shipLine2,
      shipCity,
      shipState,
      shipZip,
      pharmacy,
      sig,
      staffNotes,
      clinical,
      appointmentId: appointmentId || undefined,
      soldByUserId: soldByUserId || undefined,
    }),
    [
      client.id,
      cart,
      includeShipping,
      discountUsd,
      discountReason,
      shipLine1,
      shipLine2,
      shipCity,
      shipState,
      shipZip,
      pharmacy,
      sig,
      staffNotes,
      clinical,
      appointmentId,
      soldByUserId,
    ],
  );

  useEffect(() => {
    if (!cart.length) {
      setSnapshot(null);
      setLineItems([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/rx/clinic-encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), preview: true }),
      });
      const data = await res.json();
      if (!cancelled && res.ok) {
        setSnapshot(data.snapshot);
        setLineItems(data.lineItems || []);
      } else if (!cancelled) {
        setSnapshot(null);
        setLineItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildPayload, cart.length]);

  const activeProducts = useMemo(
    () => catalog.find((g) => g.id === activeCategory)?.products ?? [],
    [catalog, activeCategory],
  );

  function addProduct(product: RegenProductPrice) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { productId: product.id, quantity: 1, supplyCycle: "30-day" }];
    });
  }

  function updateCartLine(productId: string, patch: Partial<CartLine>) {
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, ...patch } : c)));
  }

  function removeCartLine(productId: string) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  async function saveEncounter() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/rx/clinic-encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedEncounter(data.encounter);
      const detail = await fetch(`/api/admin/rx/clinic-encounters/${data.encounter.id}`);
      const detailData = await detail.json();
      if (detail.ok) setDispatchPreview(detailData.dispatchPreview || "");
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function chargeTerminal() {
    setCharging(true);
    setError(null);
    try {
      let encounter = savedEncounter;
      if (!encounter) {
        const saveRes = await fetch("/api/admin/rx/clinic-encounters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok) throw new Error(saveData.error || "Save failed");
        encounter = saveData.encounter;
        setSavedEncounter(encounter);
      }

      const res = await fetch(
        `/api/admin/rx/clinic-encounters/${encounter!.id}/charge-terminal`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terminal charge failed");

      const startRes = await fetch(
        `/api/pos/invoices/${data.saleId}/square/start-terminal-charge`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
      );
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || "Could not send to terminal");

      setTerminalSaleId(data.saleId);
      setTerminalAmount(data.amountUsd);
      setTerminalOpen(true);
      setSavedEncounter(data.encounter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terminal failed");
    } finally {
      setCharging(false);
    }
  }

  async function onTerminalComplete() {
    if (!savedEncounter) return;
    const res = await fetch(
      `/api/admin/rx/clinic-encounters/${savedEncounter.id}/complete-payment`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
    );
    const data = await res.json();
    if (res.ok) {
      setSavedEncounter(data.encounter);
      setTerminalOpen(false);
      onSaved?.();
    }
  }

  async function markCashPaid() {
    if (!savedEncounter) {
      setError("Save the encounter first");
      return;
    }
    const res = await fetch(`/api/admin/rx/clinic-encounters/${savedEncounter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_paid_cash" }),
    });
    const data = await res.json();
    if (res.ok) {
      setSavedEncounter(data.encounter);
      onSaved?.();
    } else {
      setError(data.error || "Could not mark paid");
    }
  }

  async function updateDispatch(dispatchStatus: string) {
    if (!savedEncounter) return;
    setDispatchSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/rx/clinic-encounters/${savedEncounter.id}/dispatch`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dispatchStatus, trackingNumber, carrier }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSavedEncounter(data.encounter);
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dispatch update failed");
    } finally {
      setDispatchSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-4 border-[#E6007E] bg-gradient-to-r from-[#FFF0F7] to-white p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">RE GEN in-clinic</p>
        <p className="font-black text-lg mt-1">Peptides, wellness & Rx upsells</p>
        <p className="text-sm text-black/65 mt-1">
          Record the sale before charging the terminal — chart note, ledger, dispatch, and patient portal all update automatically.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border-2 border-red-600 bg-red-50 px-4 py-3 text-red-800 font-medium">
          {error}
        </div>
      )}

      {savedEncounter?.status === "paid" && (
        <div className="rounded-2xl border-4 border-black bg-green-50 p-4">
          <p className="font-black text-green-900">Paid — place pharmacy order & ship</p>
          <p className="text-sm text-green-900/80 mt-1">
            Ref CL-{savedEncounter.id.replace(/-/g, "").slice(0, 8).toUpperCase()} ·{" "}
            {regenClinicEncounterTitle(savedEncounter)}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <h2 className="font-black text-lg mb-3">Products</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {catalog.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveCategory(g.id)}
                  className={`px-3 py-1.5 rounded-full border-2 text-sm font-bold ${
                    activeCategory === g.id
                      ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]"
                      : "border-black/20"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {activeProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="text-left rounded-xl border-2 border-black/15 p-3 hover:border-[#E6007E] hover:bg-rose-50/50"
                >
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs text-black/55 mt-0.5">{p.priceLabel}</p>
                  {p.rx && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase text-[#E6007E]">
                      Rx
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {cart.length > 0 && (
            <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
              <h2 className="font-black text-lg mb-3">Cart</h2>
              <ul className="space-y-3">
                {cart.map((line) => {
                  const product = activeProducts.find((p) => p.id === line.productId)
                    || catalog.flatMap((g) => g.products).find((p) => p.id === line.productId);
                  const resolved = lineItems.find((li) => li.productId === line.productId);
                  return (
                    <li key={line.productId} className="rounded-xl border-2 border-black/10 p-3">
                      <div className="flex justify-between gap-2">
                        <p className="font-bold text-sm">{product?.name || line.productId}</p>
                        <button
                          type="button"
                          onClick={() => removeCartLine(line.productId)}
                          className="text-xs text-red-600 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 items-center">
                        <label className="text-xs">
                          Qty
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={line.quantity}
                            onChange={(e) =>
                              updateCartLine(line.productId, {
                                quantity: Math.max(1, Number(e.target.value) || 1),
                              })
                            }
                            className="ml-1 w-14 rounded border border-black/20 px-2 py-1"
                          />
                        </label>
                        <div className="flex gap-1">
                          {(["30-day", "90-day"] as const).map((cycle) => (
                            <button
                              key={cycle}
                              type="button"
                              onClick={() => updateCartLine(line.productId, { supplyCycle: cycle })}
                              className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                line.supplyCycle === cycle
                                  ? "border-[#E6007E] bg-[#FFF0F7]"
                                  : "border-black/20"
                              }`}
                            >
                              {cycle === "30-day" ? "30-day" : "90-day"}
                            </button>
                          ))}
                        </div>
                        {resolved && (
                          <span className="text-sm font-bold ml-auto">
                            {formatUsd(resolved.lineTotalUsd)}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <label className="mt-4 flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={includeShipping}
                  onChange={(e) => setIncludeShipping(e.target.checked)}
                />
                Include $30 RE GEN shipping
              </label>
            </section>
          )}

          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <h2 className="font-black text-lg mb-3">Ship-to & clinical</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={shipLine1}
                onChange={(e) => setShipLine1(e.target.value)}
                placeholder="Address line 1"
                className="sm:col-span-2 rounded-xl border-2 border-black px-3 py-2"
              />
              <input
                value={shipCity}
                onChange={(e) => setShipCity(e.target.value)}
                placeholder="City"
                className="rounded-xl border-2 border-black px-3 py-2"
              />
              <input
                value={shipZip}
                onChange={(e) => setShipZip(e.target.value)}
                placeholder="ZIP"
                className="rounded-xl border-2 border-black px-3 py-2"
              />
              <select
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value as RxClinicPharmacy)}
                className="rounded-xl border-2 border-black px-3 py-2"
              >
                <option value="boomrx">BoomRx</option>
                <option value="formulation">Formulation</option>
              </select>
              <input
                value={sig}
                onChange={(e) => setSig(e.target.value)}
                placeholder="Sig (optional)"
                className="sm:col-span-2 rounded-xl border-2 border-black px-3 py-2"
              />
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Staff notes (e.g. upsold after Morpheus)"
                className="sm:col-span-2 rounded-xl border-2 border-black px-3 py-2 min-h-[72px]"
              />
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
              {(
                [
                  ["allergiesReviewed", "Allergies reviewed"],
                  ["currentMedicationsReviewed", "Medications reviewed"],
                  ["contraindicationsNone", "No contraindications"],
                  ["labsOnFile", "Labs on file if needed"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(clinical[key])}
                    onChange={(e) =>
                      setClinical((c) => ({ ...c, [key]: e.target.checked }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-4 border-black bg-white p-5 sticky top-4">
            <h3 className="font-black">Order total</h3>
            {snapshot ? (
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatUsd(snapshot.subtotalUsd)}</dd>
                </div>
                {snapshot.shippingUsd > 0 && (
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd>{formatUsd(snapshot.shippingUsd)}</dd>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg pt-2 border-t border-black/10">
                  <dt>Total</dt>
                  <dd>{formatUsd(snapshot.finalTotalUsd)}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-black/50 text-sm mt-2">Add products to see pricing.</p>
            )}

            <RegenSoldByPicker
              value={soldByUserId}
              onChange={setSoldByUserId}
              className="mt-4"
            />

            <label className="block mt-4 text-sm">
              <span className="font-bold">Owner discount ($)</span>
              <input
                value={discountUsd}
                onChange={(e) => setDiscountUsd(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
              />
            </label>
            {Number(discountUsd) > 0 && (
              <input
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="Discount reason (required)"
                className="mt-2 w-full rounded-xl border-2 border-black px-3 py-2 text-sm"
              />
            )}

            <div className="mt-5 space-y-2">
              <button
                type="button"
                disabled={!cart.length || saving}
                onClick={() => void saveEncounter()}
                className="w-full rounded-xl bg-black text-white font-bold py-3 disabled:opacity-40"
              >
                {saving ? "Saving…" : savedEncounter ? "Update record" : "Save to chart & portal"}
              </button>
              <button
                type="button"
                disabled={!cart.length || charging}
                onClick={() => void chargeTerminal()}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold py-3 disabled:opacity-40"
              >
                {charging ? "Sending…" : "Charge Square Terminal"}
              </button>
              <button
                type="button"
                disabled={!savedEncounter}
                onClick={() => void markCashPaid()}
                className="w-full rounded-xl border-2 border-black font-bold py-2 disabled:opacity-40"
              >
                Mark paid (cash)
              </button>
            </div>
          </div>

          {dispatchPreview && (
            <div className="rounded-2xl border-4 border-black bg-white p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-sm">Pharmacy dispatch copy</h3>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(dispatchPreview)}
                  className="text-xs font-bold text-[#E6007E]"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs whitespace-pre-wrap font-mono text-black/80">{dispatchPreview}</pre>
            </div>
          )}

          {savedEncounter &&
            (savedEncounter.status === "paid" ||
              savedEncounter.status === "ready_to_ship" ||
              savedEncounter.status === "shipped") && (
              <div className="rounded-2xl border-4 border-black bg-white p-4 space-y-3">
                <h3 className="font-black text-sm">Ship to patient</h3>
                {savedEncounter.chart_note_id && (
                  <Link
                    href={`/admin/clients/${savedEncounter.client_id}?tab=rx`}
                    className="text-xs font-bold text-[#E6007E] underline block"
                  >
                    Chart note in client file →
                  </Link>
                )}
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="Carrier"
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm"
                />
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number"
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {(["reviewed", "sent", "shipped"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={dispatchSaving}
                      onClick={() => void updateDispatch(s)}
                      className="px-3 py-1.5 rounded-full border-2 border-black text-xs font-bold"
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      <TerminalStatusModal
        isOpen={terminalOpen}
        saleId={terminalSaleId}
        amount={terminalAmount}
        onComplete={() => void onTerminalComplete()}
        onCancel={() => setTerminalOpen(false)}
        onRetry={() => void chargeTerminal()}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}
