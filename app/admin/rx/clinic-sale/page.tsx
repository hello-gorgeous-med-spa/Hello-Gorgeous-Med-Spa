"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import TerminalStatusModal from "@/components/TerminalStatusModal";
import {
  RX_CLINIC_ENCOUNTER_TYPES,
  RX_CLINIC_TITRATION_PRESETS,
  type RxClinicClinical,
  type RxClinicEncounterRow,
  type RxClinicEncounterType,
  type RxClinicPharmacy,
  type RxClinicPricingSnapshot,
} from "@/lib/rx-clinic-encounter";
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

type DoseTier = {
  id: string;
  doseLabel: string;
  priceUsd: number;
};

type MedicationOption = {
  id: string;
  label: string;
  tiers: DoseTier[];
};

type SupplyCycle = {
  id: RxSupplyCycleId;
  label: string;
  shortLabel: string;
};

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function ClinicRxSalePage() {
  const searchParams = useSearchParams();
  const prefillClientId = searchParams.get("client") || "";
  const prefillEncounterId = searchParams.get("encounter") || "";

  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [supplyCycles, setSupplyCycles] = useState<SupplyCycle[]>([]);
  const [recent, setRecent] = useState<RxClinicEncounterRow[]>([]);

  const [clientQuery, setClientQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [encounterType, setEncounterType] = useState<RxClinicEncounterType>("new_consult");
  const [medication, setMedication] = useState("Semaglutide");
  const [doseTierId, setDoseTierId] = useState("");
  const [supplyCycle, setSupplyCycle] = useState<RxSupplyCycleId>("90-day");
  const [consultFeeUsd, setConsultFeeUsd] = useState("0");
  const [discountUsd, setDiscountUsd] = useState("0");
  const [discountReason, setDiscountReason] = useState("");

  const [shipLine1, setShipLine1] = useState("");
  const [shipLine2, setShipLine2] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("IL");
  const [shipZip, setShipZip] = useState("");
  const [pharmacy, setPharmacy] = useState<RxClinicPharmacy>("formulation");
  const [sig, setSig] = useState("");
  const [staffNotes, setStaffNotes] = useState("");

  const [clinical, setClinical] = useState<RxClinicClinical>({
    allergiesReviewed: false,
    currentMedicationsReviewed: false,
    contraindicationsNone: false,
    labsOnFile: false,
    titrationNote: RX_CLINIC_TITRATION_PRESETS[0],
  });

  const [snapshot, setSnapshot] = useState<RxClinicPricingSnapshot | null>(null);
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
      if (res.ok) {
        setMedications(data.medications || []);
        setSupplyCycles(data.supplyCycles || []);
      }
    })();
    loadRecent();
  }, []);

  useEffect(() => {
    if (!prefillClientId) return;
    (async () => {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(prefillClientId)}`);
      const data = await res.json();
      if (res.ok && data.client) pickClient(data.client as Client);
    })();
  }, [prefillClientId]);

  useEffect(() => {
    if (!prefillEncounterId) return;
    (async () => {
      const res = await fetch(`/api/admin/rx/clinic-encounters/${prefillEncounterId}`);
      const data = await res.json();
      if (!res.ok || !data.encounter) return;
      const e = data.encounter as RxClinicEncounterRow;
      setSavedEncounter(e);
      setDispatchPreview(data.dispatchPreview || "");
      setEncounterType(e.encounter_type);
      setMedication(e.medication);
      setDoseTierId(e.dose_tier_id);
      setSupplyCycle(e.supply_cycle);
      setConsultFeeUsd(String(e.consult_fee_usd));
      setDiscountUsd(String(e.discount_usd));
      setDiscountReason(e.discount_reason || "");
      setShipLine1(e.ship_address_line1 || "");
      setShipLine2(e.ship_address_line2 || "");
      setShipCity(e.ship_city || "");
      setShipState(e.ship_state || "IL");
      setShipZip(e.ship_zip || "");
      setPharmacy(e.pharmacy || "formulation");
      setSig(e.sig || "");
      setStaffNotes(e.staff_notes || "");
      setClinical((e.clinical as RxClinicClinical) || {});
      setTrackingNumber(e.tracking_number || "");
      setCarrier(e.carrier || "");
      if (e.pricing_snapshot) setSnapshot(e.pricing_snapshot as RxClinicPricingSnapshot);
      const clientRes = await fetch(`/api/clients?id=${encodeURIComponent(e.client_id)}`);
      const clientData = await clientRes.json();
      if (clientRes.ok && clientData.client) pickClient(clientData.client as Client);
    })();
  }, [prefillEncounterId]);

  const loadRecent = async () => {
    const res = await fetch("/api/admin/rx/clinic-encounters?limit=12");
    const data = await res.json();
    if (res.ok) setRecent(data.rows || []);
  };

  const tiers = useMemo(() => {
    return medications.find((m) => m.id === medication)?.tiers ?? [];
  }, [medications, medication]);

  useEffect(() => {
    if (tiers.length && !tiers.some((t) => t.id === doseTierId)) {
      setDoseTierId(tiers[0]?.id || "");
    }
  }, [tiers, doseTierId]);

  useEffect(() => {
    if (clientQuery.length < 2) {
      setClients([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(clientQuery)}&limit=8`);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : data.clients ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [clientQuery]);

  const pickClient = (c: Client) => {
    setSelectedClient(c);
    setClientQuery(`${c.first_name} ${c.last_name}`.trim());
    setClients([]);
    setShipLine1(c.address_line1 || "");
    setShipCity(c.city || "");
    setShipState(c.state || "IL");
    setShipZip(c.postal_code || "");
  };

  const buildPayload = useCallback(
    () => ({
      clientId: selectedClient?.id,
      encounterType,
      medication,
      doseTierId,
      supplyCycle,
      consultFeeUsd: Number(consultFeeUsd) || 0,
      discountUsd: Number(discountUsd) || 0,
      discountReason: Number(discountUsd) > 0 ? discountReason : null,
      shipAddressLine1: shipLine1,
      shipAddressLine2: shipLine2,
      shipCity,
      shipState,
      shipZip,
      pharmacy,
      sig,
      staffNotes,
      clinical,
    }),
    [
      selectedClient,
      encounterType,
      medication,
      doseTierId,
      supplyCycle,
      consultFeeUsd,
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
    ],
  );

  useEffect(() => {
    if (!medication || !doseTierId) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/rx/clinic-encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), preview: true }),
      });
      const data = await res.json();
      if (!cancelled && res.ok) setSnapshot(data.snapshot);
      else if (!cancelled) setSnapshot(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [buildPayload, medication, doseTierId]);

  const saveEncounter = async () => {
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
      await loadRecent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const chargeTerminal = async () => {
    setCharging(true);
    setError(null);
    try {
      let encounter = savedEncounter;
      if (!encounter) {
        if (!selectedClient) throw new Error("Select a client first");
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
  };

  const markCashPaid = async () => {
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
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setSavedEncounter(data.encounter);
    await loadRecent();
  };

  const onTerminalComplete = async () => {
    if (!savedEncounter) return;
    await fetch(`/api/admin/rx/clinic-encounters/${savedEncounter.id}/complete-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setTerminalOpen(false);
    const detail = await fetch(`/api/admin/rx/clinic-encounters/${savedEncounter.id}`);
    const detailData = await detail.json();
    if (detail.ok) {
      setSavedEncounter(detailData.encounter);
      setDispatchPreview(detailData.dispatchPreview || "");
    }
    await loadRecent();
  };

  const resetForm = () => {
    setSavedEncounter(null);
    setDispatchPreview("");
    setError(null);
    setDiscountUsd("0");
    setDiscountReason("");
    setStaffNotes("");
    setSig("");
    setTrackingNumber("");
    setCarrier("");
  };

  const updateDispatch = async (dispatchStatus: string) => {
    if (!savedEncounter) return;
    setDispatchSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/rx/clinic-encounters/${savedEncounter.id}/dispatch`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dispatchStatus,
            trackingNumber,
            carrier,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSavedEncounter(data.encounter);
      const detail = await fetch(`/api/admin/rx/clinic-encounters/${savedEncounter.id}`);
      const detailData = await detail.json();
      if (detail.ok) setDispatchPreview(detailData.dispatchPreview || "");
      await loadRecent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dispatch update failed");
    } finally {
      setDispatchSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™
          </p>
          <h1 className="text-3xl font-black text-black">In-Person Clinic Sale</h1>
          <p className="text-black/70 mt-1 max-w-2xl">
            Consult in clinic, charge at the front desk, ship meds to the patient&apos;s home — no
            clinic drug inventory. Pricing auto-calculates from your tier table; owner discounts
            stay visible in the ledger.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/rx"
            className="px-4 py-2 rounded-full border-2 border-black text-sm font-bold hover:border-[#E6007E]"
          >
            RX Command
          </Link>
          <Link
            href="/admin/rx-ledger"
            className="px-4 py-2 rounded-full border-2 border-black text-sm font-bold hover:border-[#E6007E]"
          >
            Ledger
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border-2 border-red-600 bg-red-50 px-4 py-3 text-red-800 font-medium">
          {error}
        </div>
      )}

      {savedEncounter?.status === "paid" && (
        <div className="rounded-2xl border-4 border-black bg-green-50 p-4 shadow-[6px_6px_0_0_rgba(34,197,94,0.4)]">
          <p className="font-black text-green-900">Paid — ready to ship to patient</p>
          <p className="text-sm text-green-900/80 mt-1">
            Copy dispatch details below into Formulation / BoomRx. No meds stay at the clinic.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client */}
          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <h2 className="font-black text-lg mb-3">1. Client</h2>
            {selectedClient ? (
              <div className="flex items-center justify-between gap-3 bg-rose-50 rounded-xl p-3 border-2 border-black/10">
                <div>
                  <p className="font-bold">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </p>
                  <p className="text-sm text-black/60">
                    {selectedClient.phone} · {selectedClient.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(null);
                    setClientQuery("");
                  }}
                  className="text-sm font-bold text-[#E6007E]"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  value={clientQuery}
                  onChange={(e) => setClientQuery(e.target.value)}
                  placeholder="Search client name or phone…"
                  className="w-full rounded-xl border-2 border-black px-4 py-3"
                />
                {clients.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded-xl border-2 border-black bg-white shadow-lg overflow-hidden">
                    {clients.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => pickClient(c)}
                          className="w-full text-left px-4 py-2 hover:bg-rose-50"
                        >
                          {c.first_name} {c.last_name}
                          <span className="text-black/50 text-sm ml-2">{c.phone}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {selectedClient && (
              <Link
                href={`/admin/clients/${selectedClient.id}`}
                className="inline-block mt-2 text-sm font-bold text-[#E6007E] underline"
              >
                Open client profile →
              </Link>
            )}
          </section>

          {/* Protocol */}
          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <h2 className="font-black text-lg mb-3">2. Protocol & pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold">Visit type</span>
                <select
                  value={encounterType}
                  onChange={(e) => setEncounterType(e.target.value as RxClinicEncounterType)}
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
                >
                  {RX_CLINIC_ENCOUNTER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold">Medication</span>
                <select
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
                >
                  {medications.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold">Dose tier</span>
                <select
                  value={doseTierId}
                  onChange={(e) => setDoseTierId(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
                >
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.doseLabel} — {formatUsd(t.priceUsd)}/mo med
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="sm:col-span-2">
                <span className="text-sm font-bold">Supply cycle</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {supplyCycles.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSupplyCycle(c.id)}
                      className={`px-4 py-2 rounded-full border-2 font-bold text-sm ${
                        supplyCycle === c.id
                          ? "border-[#E6007E] bg-rose-50 text-[#E6007E]"
                          : "border-black/20 hover:border-[#E6007E]"
                      }`}
                    >
                      {c.shortLabel}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block">
                <span className="text-sm font-bold">Consult fee (optional)</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={consultFeeUsd}
                  onChange={(e) => setConsultFeeUsd(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
                />
              </label>
            </div>
          </section>

          {/* Owner override */}
          <section className="rounded-2xl border-4 border-black bg-amber-50/50 p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.15)]">
            <h2 className="font-black text-lg mb-1">Owner discount (visible in ledger)</h2>
            <p className="text-sm text-black/60 mb-3">
              Same price for everyone unless you override — reason is required and logged.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold">Discount $</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={discountUsd}
                  onChange={(e) => setDiscountUsd(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2 bg-white"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold">Reason (required if discount &gt; 0)</span>
                <input
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder="e.g. Staff family, promo, loyalty credit"
                  className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2 bg-white"
                />
              </label>
            </div>
          </section>

          {/* Ship + clinical */}
          <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
            <h2 className="font-black text-lg mb-3">3. Ship to home + chart (Ryan-friendly)</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <input
                value={shipLine1}
                onChange={(e) => setShipLine1(e.target.value)}
                placeholder="Address line 1"
                className="rounded-xl border-2 border-black px-3 py-2 sm:col-span-2"
              />
              <input
                value={shipLine2}
                onChange={(e) => setShipLine2(e.target.value)}
                placeholder="Apt / unit"
                className="rounded-xl border-2 border-black px-3 py-2 sm:col-span-2"
              />
              <input
                value={shipCity}
                onChange={(e) => setShipCity(e.target.value)}
                placeholder="City"
                className="rounded-xl border-2 border-black px-3 py-2"
              />
              <div className="flex gap-2">
                <input
                  value={shipState}
                  onChange={(e) => setShipState(e.target.value)}
                  placeholder="ST"
                  className="w-20 rounded-xl border-2 border-black px-3 py-2"
                />
                <input
                  value={shipZip}
                  onChange={(e) => setShipZip(e.target.value)}
                  placeholder="ZIP"
                  className="flex-1 rounded-xl border-2 border-black px-3 py-2"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              {(
                [
                  ["allergiesReviewed", "Allergies reviewed"],
                  ["currentMedicationsReviewed", "Meds reviewed"],
                  ["contraindicationsNone", "No contraindications"],
                  ["labsOnFile", "Labs on file"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={!!clinical[key]}
                    onChange={(e) =>
                      setClinical((c) => ({ ...c, [key]: e.target.checked }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <label className="block mb-3">
              <span className="text-sm font-bold">Titration plan</span>
              <select
                value={clinical.titrationNote || RX_CLINIC_TITRATION_PRESETS[0]}
                onChange={(e) => setClinical((c) => ({ ...c, titrationNote: e.target.value }))}
                className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
              >
                {RX_CLINIC_TITRATION_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-3">
              <span className="text-sm font-bold">Pharmacy</span>
              <select
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value as RxClinicPharmacy)}
                className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
              >
                <option value="formulation">Formulation</option>
                <option value="boomrx">BoomRx</option>
              </select>
            </label>
            <label className="block mb-3">
              <span className="text-sm font-bold">Sig</span>
              <textarea
                value={sig}
                onChange={(e) => setSig(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
                placeholder="Inject 0.25 mg SC weekly…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Staff notes (portal only)</span>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border-2 border-black px-3 py-2"
              />
            </label>
          </section>
        </div>

        {/* Sidebar: quote + actions */}
        <div className="space-y-4">
          <div className="sticky top-4 rounded-2xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <h2 className="font-black text-lg mb-3">Quote</h2>
            {snapshot?.quote ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-black/60">Med ({snapshot.quote.supplyCycle})</dt>
                  <dd className="font-bold">
                    {formatUsd(snapshot.quote.priceUsd - snapshot.quote.shippingUsd)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-black/60">Shipping</dt>
                  <dd className="font-bold">{formatUsd(snapshot.quote.shippingUsd)}</dd>
                </div>
                {snapshot.consultFeeUsd > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-black/60">Consult</dt>
                    <dd className="font-bold">{formatUsd(snapshot.consultFeeUsd)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <dt className="text-black/60">List</dt>
                  <dd>{formatUsd(snapshot.listTotalUsd)}</dd>
                </div>
                {snapshot.discountUsd > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <dt>Owner discount</dt>
                    <dd>-{formatUsd(snapshot.discountUsd)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-[#E6007E] border-t-2 border-black pt-2">
                  <dt>Due today</dt>
                  <dd>{formatUsd(snapshot.finalTotalUsd)}</dd>
                </div>
                {snapshot.quote.savingsNote && (
                  <p className="text-xs text-green-700 font-medium">{snapshot.quote.savingsNote}</p>
                )}
              </dl>
            ) : (
              <p className="text-black/50 text-sm">Select medication and dose tier.</p>
            )}

            <div className="mt-5 space-y-2">
              <button
                type="button"
                disabled={!selectedClient || saving}
                onClick={saveEncounter}
                className="w-full rounded-xl bg-black text-white font-bold py-3 disabled:opacity-40"
              >
                {saving ? "Saving…" : savedEncounter ? "Update record" : "Save to portal"}
              </button>
              <button
                type="button"
                disabled={!selectedClient || charging}
                onClick={chargeTerminal}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold py-3 disabled:opacity-40"
              >
                {charging ? "Sending…" : "Charge Square Terminal"}
              </button>
              <button
                type="button"
                disabled={!savedEncounter}
                onClick={markCashPaid}
                className="w-full rounded-xl border-2 border-black font-bold py-2 disabled:opacity-40"
              >
                Mark paid (cash)
              </button>
              {savedEncounter && (
                <button type="button" onClick={resetForm} className="w-full text-sm text-black/50 py-1">
                  Start new sale
                </button>
              )}
            </div>
          </div>

          {dispatchPreview && (
            <div className="rounded-2xl border-4 border-black bg-white p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-sm">Dispatch copy</h3>
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
                <p className="text-xs text-black/60">
                  Status: {savedEncounter.dispatch_status} · {savedEncounter.status.replace(/_/g, " ")}
                </p>
                {savedEncounter.chart_note_id && (
                  <Link
                    href={`/admin/clients/${savedEncounter.client_id}?tab=rx`}
                    className="text-xs font-bold text-[#E6007E] underline block"
                  >
                    Chart note saved in portal →
                  </Link>
                )}
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="Carrier (UPS, FedEx…)"
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
                      className="px-3 py-1.5 rounded-full border-2 border-black text-xs font-bold hover:border-[#E6007E] disabled:opacity-50"
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {recent.length > 0 && (
        <section className="rounded-2xl border-4 border-black bg-white p-5">
          <h2 className="font-black text-lg mb-3">Recent clinic sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black/50 border-b border-black/10">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Med</th>
                  <th className="py-2 pr-4">Cycle</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-black/5">
                    <td className="py-2 pr-4">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">
                      {r.medication} {r.dose_label}
                    </td>
                    <td className="py-2 pr-4">{r.supply_cycle}</td>
                    <td className="py-2 pr-4 font-bold">{formatUsd(r.final_total_usd)}</td>
                    <td className="py-2 capitalize">{r.status.replace(/_/g, " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <TerminalStatusModal
        isOpen={terminalOpen}
        saleId={terminalSaleId}
        amount={terminalAmount}
        onComplete={() => {
          void onTerminalComplete();
        }}
        onCancel={() => setTerminalOpen(false)}
        onRetry={() => {
          void chargeTerminal();
        }}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}
