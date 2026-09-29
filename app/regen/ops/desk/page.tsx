"use client";

import { useState } from "react";

import { REGEN_REQUEST_SKUS, formatRequestPrice, regenRequestSkuGroups } from "@/lib/regen/refill-request-catalog";

export default function OpsDeskPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [skuId, setSkuId] = useState(REGEN_REQUEST_SKUS[0]?.id || "manual");
  const [manualName, setManualName] = useState("");
  const [manualSku, setManualSku] = useState("");
  const [manualPack, setManualPack] = useState("");
  const [applyGorgeous20, setApplyGorgeous20] = useState(false);
  const [invoiceNow, setInvoiceNow] = useState(true);
  const [overrideUsd, setOverrideUsd] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [payUrl, setPayUrl] = useState("");

  const isManual = skuId === "manual";
  const sku = REGEN_REQUEST_SKUS.find((s) => s.id === skuId);

  async function submit() {
    setBusy(true);
    setMsg("");
    setPayUrl("");
    const res = await fetch("/api/regen/ops/desk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        dob,
        skuId,
        manualName,
        manualSku,
        manualPack,
        applyGorgeous20,
        invoiceNow,
        overrideUsd: overrideUsd ? Number(overrideUsd) : undefined,
        notes,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(json.error || "Could not save the walk-in.");
      return;
    }
    setMsg(json.message || "Saved.");
    if (json.payUrl) setPayUrl(json.payUrl);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setDob("");
    setOverrideUsd("");
    setManualName("");
    setManualSku("");
    setManualPack("");
    setNotes("");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Walk-in / desk</h1>
        <p className="text-white/50 mt-1">
          Patient is at the desk or on the phone. Pick a catalog SKU or type a manual protocol. Your note saves on the
          visit and the order.
        </p>
      </div>

      <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-white/70">
            First name
            <input
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="text-sm text-white/70">
            Last name
            <input
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm text-white/70">
          Phone
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="630-555-0100"
          />
        </label>
        <label className="block text-sm text-white/70">
          Email
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm text-white/70">
          Date of birth
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </label>
        <label className="block text-sm text-white/70">
          Protocol
          <select
            className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 text-white border border-white/20"
            value={skuId}
            onChange={(e) => setSkuId(e.target.value)}
          >
            <option value="manual">Manual — type name, SKU, and dollars</option>
            {regenRequestSkuGroups().map((group) => (
              <optgroup key={group.hub} label={group.label}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · SKU {item.sku} · {formatRequestPrice(item)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {isManual ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-sm text-white/70 sm:col-span-1">
              Protocol name
              <input
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="NAD+ 10 mL"
              />
            </label>
            <label className="text-sm text-white/70">
              Formulation SKU
              <input
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                value={manualSku}
                onChange={(e) => setManualSku(e.target.value)}
                placeholder="3119"
              />
            </label>
            <label className="text-sm text-white/70">
              Pack / strength
              <input
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                value={manualPack}
                onChange={(e) => setManualPack(e.target.value)}
                placeholder="10 mL · 100 mg/mL"
              />
            </label>
          </div>
        ) : sku ? (
          <p className="text-white/60 text-sm">
            {sku.name} · SKU {sku.sku} · {sku.pack}
            {sku.investigational ? " · Ryan types the dollars" : ""}
          </p>
        ) : null}
        <label className="block text-sm text-white/70">
          {isManual ? "Total to invoice" : "Override total (optional)"}
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white"
            value={overrideUsd}
            onChange={(e) => setOverrideUsd(e.target.value)}
            inputMode="decimal"
            placeholder={isManual ? "Required — dollars Ryan or the desk set" : "Leave blank to use catalog"}
          />
        </label>
        <label className="block text-sm text-white/70">
          Note — type whatever you want Ryan, Damara, or the pharmacy to see
          <textarea
            className="mt-1 w-full min-h-[140px] px-3 py-2 rounded-lg bg-white/10 text-white"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sig, strength, ship vs pickup, allergies, what Ryan said, Charm number…"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={applyGorgeous20} onChange={(e) => setApplyGorgeous20(e.target.checked)} />
          GORGEOUS20 (20% off medication)
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={invoiceNow} onChange={(e) => setInvoiceNow(e.target.checked)} />
          Send PayConex invoice now
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void submit()}
          className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold disabled:opacity-50"
        >
          {busy ? "Saving…" : invoiceNow ? "Save and send pay link" : "Save to Today queue"}
        </button>
        {msg ? <p className="text-[#FFB8DC] text-sm">{msg}</p> : null}
        {payUrl ? (
          <p className="text-sm">
            <a href={payUrl} className="text-teal-300 underline" target="_blank" rel="noreferrer">
              Open pay page
            </a>
          </p>
        ) : null}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-white font-semibold">Catalog SKUs on this form</h2>
        <p className="text-white/45 text-sm mt-1">Sheet price × 2.5 + $30 ship, unless in-office. Anything else = Manual.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead>
              <tr className="text-white/40 text-xs uppercase">
                <th className="py-2 pr-3">Protocol</th>
                <th className="py-2 pr-3">SKU</th>
                <th className="py-2">Patient price</th>
              </tr>
            </thead>
            <tbody>
              {REGEN_REQUEST_SKUS.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="py-2 pr-3">{item.name}</td>
                  <td className="py-2 pr-3 font-mono">{item.sku}</td>
                  <td className="py-2">{formatRequestPrice(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
