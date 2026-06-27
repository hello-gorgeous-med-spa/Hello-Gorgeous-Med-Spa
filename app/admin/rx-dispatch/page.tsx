"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  CLINIC_SHIP_ADDRESS,
  RX_DISPATCH_STATUSES,
  RX_PHARMACY_PORTALS,
  buildCopyPackFromSubmission,
  type RxDispatchRecord,
  type RxDispatchStatus,
  type RxPharmacy,
  type RxShipTo,
} from "@/lib/rx-dispatch";
import type { ClinicDispatchQueueItem } from "@/lib/rx-clinic-refill";

type QueueItem = {
  submissionId: string;
  submittedAt: string;
  intakeRef: string;
  slug: string;
  templateTitle: string;
  track: "peptide" | "glp1" | "unknown";
  patientName: string;
  phone: string | null;
  email: string | null;
  qualified: boolean;
  summary: string[];
  responses: Record<string, unknown>;
  dispatch: RxDispatchRecord;
  payment: {
    id: string;
    status: string;
    amountUsd: number;
    paidAt: string | null;
    lineLabel: string | null;
  } | null;
};

const STATUS_FILTERS: { id: RxDispatchStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...RX_DISPATCH_STATUSES,
];

export default function RxDispatchPage() {
  const searchParams = useSearchParams();
  const refFilter = searchParams.get("ref")?.trim().toUpperCase() || "";
  const [items, setItems] = useState<QueueItem[]>([]);
  const [clinicItems, setClinicItems] = useState<ClinicDispatchQueueItem[]>([]);
  const [queueTab, setQueueTab] = useState<"online" | "clinic">("online");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RxDispatchStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RxDispatchRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [copyPreview, setCopyPreview] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const q =
        statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(`/api/admin/rx-dispatch${q}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setClinicItems(data.clinicItems || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const visibleItems = useMemo(() => {
    if (!refFilter) return items;
    return items.filter((i) => i.intakeRef.toUpperCase().startsWith(refFilter));
  }, [items, refFilter]);

  const selected = useMemo(
    () => visibleItems.find((i) => i.submissionId === selectedId) ?? items.find((i) => i.submissionId === selectedId) ?? null,
    [visibleItems, items, selectedId],
  );

  useEffect(() => {
    if (refFilter && visibleItems.length === 1) {
      setSelectedId(visibleItems[0].submissionId);
    }
  }, [refFilter, visibleItems]);

  useEffect(() => {
    if (selected) {
      setDraft({ ...selected.dispatch });
      setCopyMsg(null);
      setSaveError(null);
    } else {
      setDraft(null);
    }
  }, [selected]);

  const selectItem = (item: QueueItem) => {
    setSelectedId(item.submissionId);
  };

  const updateDraft = (patch: Partial<RxDispatchRecord>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const saveDraft = async (extra?: Partial<RxDispatchRecord>) => {
    if (!selected || !draft) return false;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/rx-dispatch/${selected.submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Could not save");
        return false;
      }
      await loadQueue();
      if (data.dispatch) {
        setDraft({ ...draft, ...data.dispatch });
      }
      return true;
    } catch {
      setSaveError("Network error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const copyForPortal = async (portal: RxPharmacy) => {
    if (!selected || !draft) return;
    const text = buildCopyPackFromSubmission({
      slug: selected.slug,
      signerName: selected.patientName,
      clientPhone: selected.phone,
      responses: selected.responses,
      dispatch: { ...draft, pharmacy: portal },
      portal,
      intakeRef: selected.intakeRef,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopyPreview(text);
      setCopyMsg(`Copied for ${RX_PHARMACY_PORTALS[portal].name}`);
      setTimeout(() => setCopyMsg(null), 2500);
      void saveDraft({ pharmacy: portal });
    } catch {
      setCopyMsg("Could not copy — check browser permissions");
    }
  };

  const markStatus = async (status: RxDispatchStatus) => {
    updateDraft({ status });
    await saveDraft({ status });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-3xl mx-auto pb-24">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-[#FF2D8E]">RX</span> Dispatch
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Online intakes + in-person clinic sales → ship to patient home.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Link href="/admin/rx" className="text-xs text-[#FFB8DC] hover:text-white">
            Command center →
          </Link>
          <Link href="/admin/rx-ledger" className="text-xs text-[#FFB8DC] hover:text-white">
            Payment ledger →
          </Link>
          <Link href="/admin/rx-invoices" className="text-xs text-[#FFB8DC] hover:text-white">
            RX Invoices →
          </Link>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white">
            ← Admin
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setQueueTab("online")}
          className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 ${
            queueTab === "online"
              ? "border-[#E6007E] bg-[#E6007E]/20 text-[#FFB8DC]"
              : "border-gray-700 text-gray-400"
          }`}
        >
          Online ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setQueueTab("clinic")}
          className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 ${
            queueTab === "clinic"
              ? "border-[#E6007E] bg-[#E6007E]/20 text-[#FFB8DC]"
              : "border-gray-700 text-gray-400"
          }`}
        >
          Clinic ({clinicItems.length})
        </button>
      </div>

      {queueTab === "clinic" ? (
        <div className="space-y-3 mb-8">
          {loading ? (
            <p className="text-sm text-gray-500 py-8 text-center">Loading…</p>
          ) : clinicItems.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No paid clinic sales awaiting ship.</p>
          ) : (
            clinicItems.map((c) => (
              <div
                key={c.encounterId}
                className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold">{c.patientName}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{c.intakeRef}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#FFB8DC]">
                    {c.dispatchStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {c.medication} {c.doseLabel} · {c.supplyCycle} · ${c.paymentAmountUsd}
                </p>
                <p className="text-xs text-gray-500">
                  Ship: {c.shipAddressLine1}, {c.shipCity}, {c.shipState} {c.shipZip}
                </p>
                <Link
                  href={`/admin/rx/clinic-sale?encounter=${c.encounterId}`}
                  className="inline-block text-xs font-bold text-[#FFB8DC] hover:underline"
                >
                  Ship / tracking →
                </Link>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 transition ${
              statusFilter === f.id
                ? "border-[#E6007E] bg-[#E6007E]/20 text-[#FFB8DC]"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {refFilter && (
        <p className="text-xs text-[#FFB8DC] mb-3">
          Filtered to ref <span className="font-mono font-bold">{refFilter}</span> ·{" "}
          <Link href="/admin/rx-dispatch" className="underline">
            clear
          </Link>
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading intake queue…</p>
      ) : visibleItems.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          {refFilter
            ? `No intake matching ref ${refFilter}.`
            : "No peptide or GLP-1 intakes yet. Submissions from /peptide-request and /glp1-intake appear here."}
        </p>
      ) : (
        <div className="space-y-2 mb-8">
          {visibleItems.map((item) => {
            const active = selectedId === item.submissionId;
            return (
              <button
                key={item.submissionId}
                type="button"
                onClick={() => selectItem(item)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                  active
                    ? "border-[#E6007E] bg-[#E6007E]/15"
                    : "border-gray-800 bg-gray-900 hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">{item.patientName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.track === "glp1" ? "GLP-1" : "Peptide"} · {item.templateTitle}
                      {item.intakeRef ? ` · ${item.intakeRef}` : ""}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {new Date(item.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.qualified
                          ? "bg-green-500/20 text-green-300"
                          : "bg-amber-500/20 text-amber-200"
                      }`}
                    >
                      {item.qualified ? "Qualified" : "Review"}
                    </span>
                    <p className="text-[10px] text-[#FFB8DC] mt-1 uppercase tracking-wide">
                      {item.dispatch.status.replace("_", " ")}
                    </p>
                    {item.payment && (
                      <p
                        className={`text-[10px] mt-1 font-bold uppercase ${
                          item.payment.status === "paid" ? "text-green-300" : "text-amber-200"
                        }`}
                      >
                        Pay {item.payment.status} · ${item.payment.amountUsd}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && draft ? (
        <div className="rounded-2xl border-4 border-black bg-gray-900 p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#FFB8DC]">Pharmacy order</p>
              <h2 className="font-black text-lg">{selected.patientName}</h2>
              <p className="text-xs text-gray-400">
                {[selected.phone, selected.email].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <ul className="text-xs text-gray-400 space-y-1 mb-4">
            {selected.summary.map((line) => (
              <li key={line}>▸ {line}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mb-4">
            {RX_DISPATCH_STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={saving}
                onClick={() => markStatus(s.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold border ${
                  draft.status === s.id
                    ? "border-[#E6007E] bg-[#E6007E]/25 text-white"
                    : "border-gray-700 text-gray-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <fieldset className="mb-3">
            <legend className="text-xs text-gray-400 mb-2">Ship to</legend>
            <div className="flex gap-2">
              {(
                [
                  ["patient", "Patient home"],
                  ["clinic", "Clinic (HG)"],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold border-2 ${
                    draft.ship_to === id
                      ? "border-[#E6007E] bg-[#E6007E]/20"
                      : "border-gray-700 text-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="ship_to"
                    className="sr-only"
                    checked={draft.ship_to === id}
                    onChange={() => {
                      if (id === "clinic") {
                        updateDraft({
                          ship_to: id,
                          address_line1: CLINIC_SHIP_ADDRESS.line1,
                          address_line2: CLINIC_SHIP_ADDRESS.line2,
                          city: CLINIC_SHIP_ADDRESS.city,
                          state: CLINIC_SHIP_ADDRESS.state,
                          zip: CLINIC_SHIP_ADDRESS.zip,
                        });
                      } else {
                        updateDraft({ ship_to: id });
                      }
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
            {draft.ship_to === "clinic" ? (
              <p className="text-[11px] text-gray-500 mt-2">
                {CLINIC_SHIP_ADDRESS.line1}, {CLINIC_SHIP_ADDRESS.city},{" "}
                {CLINIC_SHIP_ADDRESS.state} {CLINIC_SHIP_ADDRESS.zip}
              </p>
            ) : null}
          </fieldset>

          {draft.ship_to === "patient" ? (
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <label className="block sm:col-span-2">
                <span className="text-xs text-gray-400">Street address</span>
                <input
                  value={draft.address_line1 ?? ""}
                  onChange={(e) => updateDraft({ address_line1: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                  placeholder="123 Main St"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs text-gray-400">Apt / unit (optional)</span>
                <input
                  value={draft.address_line2 ?? ""}
                  onChange={(e) => updateDraft({ address_line2: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">City</span>
                <input
                  value={draft.city ?? ""}
                  onChange={(e) => updateDraft({ city: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">State · ZIP</span>
                <div className="flex gap-2 mt-1">
                  <input
                    value={draft.state ?? "IL"}
                    onChange={(e) => updateDraft({ state: e.target.value })}
                    className="w-16 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-sm"
                  />
                  <input
                    value={draft.zip ?? ""}
                    onChange={(e) => updateDraft({ zip: e.target.value })}
                    className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                  />
                </div>
              </label>
            </div>
          ) : null}

          <label className="block mb-3">
            <span className="text-xs text-gray-400">Drug (name, strength, vial size)</span>
            <input
              value={draft.drug ?? ""}
              onChange={(e) => updateDraft({ drug: e.target.value })}
              className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
            />
          </label>

          <label className="block mb-3">
            <span className="text-xs text-gray-400">Sig</span>
            <textarea
              value={draft.sig ?? ""}
              onChange={(e) => updateDraft({ sig: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm resize-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs text-gray-400">Internal notes (not copied)</span>
            <textarea
              value={draft.staff_notes ?? ""}
              onChange={(e) => updateDraft({ staff_notes: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm resize-none"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2 mb-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => copyForPortal("formulation")}
              className="rounded-xl border-2 border-rose-500/50 bg-rose-500/10 py-3 text-sm font-bold hover:bg-rose-500/20 disabled:opacity-50"
            >
              📋 Copy for Formulation
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => copyForPortal("boomrx")}
              className="rounded-xl border-2 border-violet-500/50 bg-violet-500/10 py-3 text-sm font-bold hover:bg-violet-500/20 disabled:opacity-50"
            >
              📋 Copy for BoomRx
            </button>
          </div>

          {copyPreview ? (
            <label className="block mb-4">
              <span className="text-xs text-gray-400">Copy preview — verify before pasting</span>
              <textarea
                readOnly
                value={copyPreview}
                rows={8}
                className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-xs font-mono text-gray-300 resize-y"
              />
            </label>
          ) : null}

          <div className="flex flex-wrap gap-2 mb-4">
            <a
              href={RX_PHARMACY_PORTALS.formulation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"
            >
              Open Formulation ↗
            </a>
            <a
              href={RX_PHARMACY_PORTALS.boomrx.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"
            >
              Open BoomRx ↗
            </a>
            <Link
              href={`/admin/rx-invoices?ref=${encodeURIComponent(selected.intakeRef)}&name=${encodeURIComponent(selected.patientName)}&email=${encodeURIComponent(selected.email || "")}&phone=${encodeURIComponent(selected.phone || "")}`}
              className="rounded-lg bg-gradient-to-r from-[#FF2D8E]/80 to-[#E6007E]/80 px-3 py-2 text-xs font-bold"
            >
              Send payment link →
            </Link>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => saveDraft()}
            className="w-full rounded-xl border-2 border-gray-600 py-2.5 text-sm font-bold text-gray-200 hover:border-gray-400 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>

          {copyMsg ? <p className="mt-3 text-sm text-green-300">{copyMsg}</p> : null}
          {saveError ? <p className="mt-3 text-sm text-red-300">{saveError}</p> : null}

          <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
            Copy pack order: Name → Address → Ship to → DOB → Allergies → Drug → Sig (+ phone/email).
            Paste into the pharmacy portal, then mark <strong className="text-gray-400">Sent to pharmacy</strong>.
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 py-4">
          Select an intake to prepare the pharmacy order.
        </p>
      )}
        </>
      )}
    </div>
  );
}
