"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { FlowWaveIntakeRow, FlowWaveSessionRow } from "@/lib/flowwave-intake";
import {
  evaluateFlowWaveScreening,
  FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS,
  FLOWWAVE_BRAND,
  FLOWWAVE_CAUTION_FLAGS,
  FLOWWAVE_HANDLE_TYPES,
  FLOWWAVE_PRE_TREATMENT_CHECKS,
  FLOWWAVE_TREATMENT_AREAS,
} from "@/lib/flowwave-focus";

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth?: string | null;
};

type TabId = "intake" | "soap" | "session" | "policy" | "records";

const DEFAULT_POLICY = {
  practice_name: "Hello Gorgeous Med Spa",
  cancel_fee: "$50",
  late_mins: "15",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#DDE4EB] overflow-hidden mb-5 shadow-sm">
      <div className="bg-[#1A5F8A] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-black/50">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-[#2E7FB5] focus:ring-2 focus:ring-[#2E7FB5]/20 focus:bg-white outline-none";

function CheckItem({
  id,
  label,
  checked,
  onChange,
  variant,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  variant?: "danger" | "caution";
}) {
  const bg =
    variant === "danger"
      ? "border-red-200 bg-red-50 hover:bg-red-100"
      : variant === "caution"
        ? "border-amber-200 bg-amber-50 hover:bg-amber-100"
        : "border-gray-200 bg-gray-50 hover:bg-gray-100";
  return (
    <label className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer ${bg}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-[#1A5F8A]"
      />
      <span className="text-sm leading-snug">{label}</span>
    </label>
  );
}

function setField(
  setter: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  key: string,
  value: unknown,
) {
  setter((prev) => ({ ...prev, [key]: value }));
}

export function FlowWaveIntakeWorkspace({
  prefillClientId = "",
  prefillIntakeId = "",
  prefillAppointmentId = "",
}: {
  prefillClientId?: string;
  prefillIntakeId?: string;
  prefillAppointmentId?: string;
}) {
  const [tab, setTab] = useState<TabId>("intake");
  const [clientQuery, setClientQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [intakeId, setIntakeId] = useState(prefillIntakeId);
  const [intakeData, setIntakeData] = useState<Record<string, unknown>>({});
  const [soapData, setSoapData] = useState<Record<string, unknown>>({});
  const [policyData, setPolicyData] = useState<Record<string, unknown>>({ ...DEFAULT_POLICY });
  const [sessions, setSessions] = useState<FlowWaveSessionRow[]>([]);
  const [records, setRecords] = useState<FlowWaveIntakeRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sessionEntry, setSessionEntry] = useState({
    sessionDate: new Date().toISOString().slice(0, 10),
    treatmentArea: "",
    intensity: "",
    frequencyHz: "",
    shotsDelivered: "",
    clinician: "",
    notes: "",
  });

  const screening = useMemo(() => evaluateFlowWaveScreening(intakeData), [intakeData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const prefillFromClient = useCallback((c: Client) => {
    setIntakeData((prev) => ({
      ...prev,
      first_name: c.first_name,
      last_name: c.last_name,
      phone: c.phone || "",
      email: c.email || "",
      dob: c.date_of_birth?.slice(0, 10) || "",
    }));
    setSoapData((prev) => ({
      ...prev,
      soap_client: `${c.first_name} ${c.last_name}`.trim(),
    }));
    setPolicyData((prev) => ({
      ...prev,
      policy_client_name: `${c.first_name} ${c.last_name}`.trim(),
    }));
  }, []);

  const loadIntake = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/flowwave/intakes/${id}`);
    const data = await res.json();
    if (!res.ok) return;
    const intake = data.intake as FlowWaveIntakeRow;
    setIntakeId(intake.id);
    setIntakeData(intake.intake_data || {});
    setSoapData(intake.soap_data || {});
    setPolicyData({ ...DEFAULT_POLICY, ...(intake.policy_data || {}) });
  }, []);

  const loadSessions = useCallback(async (clientId: string) => {
    const res = await fetch(
      `/api/admin/flowwave/sessions?client_id=${encodeURIComponent(clientId)}&limit=50`,
    );
    const data = await res.json();
    if (res.ok) setSessions(data.rows || []);
  }, []);

  const loadRecords = useCallback(async (clientId: string) => {
    const res = await fetch(
      `/api/admin/flowwave/intakes?client_id=${encodeURIComponent(clientId)}&limit=30`,
    );
    const data = await res.json();
    if (res.ok) setRecords(data.rows || []);
  }, []);

  useEffect(() => {
    if (!prefillClientId) return;
    fetch(`/api/clients?id=${encodeURIComponent(prefillClientId)}`)
      .then((r) => r.json())
      .then((data) => {
        const c = data.client || data;
        if (c?.id) {
          setSelectedClient(c);
          prefillFromClient(c);
        }
      })
      .catch(() => {});
  }, [prefillClientId, prefillFromClient]);

  useEffect(() => {
    if (prefillIntakeId) void loadIntake(prefillIntakeId);
  }, [prefillIntakeId, loadIntake]);

  useEffect(() => {
    if (selectedClient?.id) {
      void loadSessions(selectedClient.id);
      void loadRecords(selectedClient.id);
    }
  }, [selectedClient?.id, loadSessions, loadRecords]);

  const searchClients = async () => {
    if (!clientQuery.trim()) return;
    const res = await fetch(
      `/api/clients?search=${encodeURIComponent(clientQuery)}&limit=8`,
    );
    const data = await res.json();
    setClients(data.clients || data || []);
  };

  const saveIntake = async () => {
    if (!selectedClient) {
      setError("Select a client first");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        clientId: selectedClient.id,
        appointmentId: prefillAppointmentId || null,
        intakeData,
        soapData,
        policyData,
        status: screening.status,
      };
      const url = intakeId
        ? `/api/admin/flowwave/intakes/${intakeId}`
        : "/api/admin/flowwave/intakes";
      const res = await fetch(url, {
        method: intakeId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      const saved = data.intake as FlowWaveIntakeRow;
      setIntakeId(saved.id);
      showToast("Record saved to portal");
      void loadRecords(selectedClient.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addSession = async () => {
    if (!selectedClient) {
      setError("Select a client first");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/flowwave/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient.id,
          intakeId: intakeId || null,
          appointmentId: prefillAppointmentId || null,
          sessionDate: sessionEntry.sessionDate,
          treatmentArea: sessionEntry.treatmentArea,
          intensity: sessionEntry.intensity ? Number(sessionEntry.intensity) : null,
          frequencyHz: sessionEntry.frequencyHz ? Number(sessionEntry.frequencyHz) : null,
          shotsDelivered: sessionEntry.shotsDelivered ? Number(sessionEntry.shotsDelivered) : null,
          clinician: sessionEntry.clinician || intakeData.clinician,
          notes: sessionEntry.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add session");
      showToast("Session logged");
      setSessionEntry((p) => ({ ...p, notes: "", shotsDelivered: "" }));
      void loadSessions(selectedClient.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "intake", label: "Intake Form" },
    { id: "soap", label: "SOAP Note" },
    { id: "session", label: "Session Log" },
    { id: "policy", label: "Policy Agreement" },
    { id: "records", label: "Portal Records" },
  ];

  return (
    <div className="min-h-screen bg-[#EEF3F7]">
      <div className="sticky top-0 z-20 bg-[#1A5F8A] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <p className="font-bold">{FLOWWAVE_BRAND.name}</p>
          <p className="text-xs opacity-75">{FLOWWAVE_BRAND.subtitle} — Client Intake</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-md border border-white/40 text-sm hover:bg-white/10"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => void saveIntake()}
            disabled={saving}
            className="px-4 py-1.5 rounded-md bg-white text-[#1A5F8A] text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to portal"}
          </button>
          <Link href="/admin/flowwave" className="px-3 py-1.5 rounded-md border border-white/40 text-sm">
            Command center
          </Link>
        </div>
      </div>

      <div className="bg-white border-b-2 border-[#D5E8F5] px-4 flex gap-0 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-0.5 ${
              tab === t.id
                ? "text-[#1A5F8A] border-[#1A5F8A]"
                : "text-black/50 border-transparent hover:text-[#1A5F8A]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Client picker */}
        <div className="mb-5 p-4 bg-white rounded-xl border border-[#DDE4EB] no-print">
          {selectedClient ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase text-[#1A5F8A]">Client</p>
                <p className="font-black">
                  {selectedClient.first_name} {selectedClient.last_name}
                </p>
                <p className="text-sm text-black/60">
                  {[selectedClient.phone, selectedClient.email].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Link
                href={`/admin/clients/${selectedClient.id}?tab=flowwave`}
                className="text-sm font-bold text-[#1A5F8A]"
              >
                Client tab →
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <input
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void searchClients()}
                placeholder="Search client by name, phone, email…"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => void searchClients()}
                className="px-4 py-2 rounded-md bg-[#1A5F8A] text-white text-sm font-bold"
              >
                Search
              </button>
            </div>
          )}
          {clients.length > 0 && !selectedClient && (
            <ul className="mt-2 border rounded-md divide-y">
              {clients.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#D5E8F5]"
                    onClick={() => {
                      setSelectedClient(c);
                      prefillFromClient(c);
                      setClients([]);
                    }}
                  >
                    {c.first_name} {c.last_name}
                    {c.phone ? ` · ${c.phone}` : ""}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {screening.screeningResult === "contraindicated" && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-900 text-sm flex gap-2">
            <span>⛔</span>
            <span>
              <strong>Absolute contraindication selected.</strong> Treatment cannot proceed until
              cleared by a licensed medical professional.
            </span>
          </div>
        )}
        {screening.screeningResult === "caution" && (
          <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            ⚠️ Caution flags present — clinician review required before treatment.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}

        {tab === "intake" && (
          <div>
            <Card title="1 — Client Information">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="First name">
                  <input
                    className={inputCls}
                    value={String(intakeData.first_name || "")}
                    onChange={(e) => setField(setIntakeData, "first_name", e.target.value)}
                  />
                </Field>
                <Field label="Last name">
                  <input
                    className={inputCls}
                    value={String(intakeData.last_name || "")}
                    onChange={(e) => setField(setIntakeData, "last_name", e.target.value)}
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(intakeData.dob || "")}
                    onChange={(e) => setField(setIntakeData, "dob", e.target.value)}
                  />
                </Field>
                <Field label="Age">
                  <input
                    type="number"
                    className={inputCls}
                    value={String(intakeData.age || "")}
                    onChange={(e) => setField(setIntakeData, "age", e.target.value)}
                  />
                </Field>
                <Field label="Sex assigned at birth">
                  <select
                    className={inputCls}
                    value={String(intakeData.sex || "")}
                    onChange={(e) => setField(setIntakeData, "sex", e.target.value)}
                  >
                    <option value="">Select…</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Phone">
                  <input
                    className={inputCls}
                    value={String(intakeData.phone || "")}
                    onChange={(e) => setField(setIntakeData, "phone", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputCls}
                    value={String(intakeData.email || "")}
                    onChange={(e) => setField(setIntakeData, "email", e.target.value)}
                  />
                </Field>
                <Field label="Emergency contact">
                  <input
                    className={inputCls}
                    value={String(intakeData.emergency || "")}
                    onChange={(e) => setField(setIntakeData, "emergency", e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card title="2 — Reason for Visit">
              <div className="space-y-3">
                <Field label="Primary complaint / treatment goal">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.complaint || "")}
                    onChange={(e) => setField(setIntakeData, "complaint", e.target.value)}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Treatment area">
                    <select
                      className={inputCls}
                      value={String(intakeData.treatment_area || "")}
                      onChange={(e) => setField(setIntakeData, "treatment_area", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {FLOWWAVE_TREATMENT_AREAS.map((a) => (
                        <option key={a.id} value={a.label}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Duration of symptoms">
                    <input
                      className={inputCls}
                      value={String(intakeData.duration || "")}
                      onChange={(e) => setField(setIntakeData, "duration", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Previous treatments tried">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.prev_treatment || "")}
                    onChange={(e) => setField(setIntakeData, "prev_treatment", e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card title="3 — Contraindication Screening">
              <p className="text-sm text-[#0A3F64] bg-[#D5E8F5] border border-[#A8CCE8] rounded-md p-3 mb-4">
                Check ALL that apply. Absolute contraindications disqualify treatment. Caution items
                require clinician review.
              </p>
              <p className="text-xs font-bold uppercase text-red-700 mb-2">
                Absolute contraindications
              </p>
              <div className="space-y-1.5 mb-4">
                {FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS.map((c) => (
                  <CheckItem
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    variant="danger"
                    checked={intakeData[c.id] === true}
                    onChange={(v) => setField(setIntakeData, c.id, v)}
                  />
                ))}
              </div>
              <p className="text-xs font-bold uppercase text-amber-800 mb-2">Caution flags</p>
              <div className="space-y-1.5">
                {FLOWWAVE_CAUTION_FLAGS.map((c) => (
                  <CheckItem
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    variant="caution"
                    checked={intakeData[c.id] === true}
                    onChange={(v) => setField(setIntakeData, c.id, v)}
                  />
                ))}
              </div>
            </Card>

            <Card title="4 — Health History">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Current medications">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.medications || "")}
                    onChange={(e) => setField(setIntakeData, "medications", e.target.value)}
                  />
                </Field>
                <Field label="Known allergies">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.allergies || "")}
                    onChange={(e) => setField(setIntakeData, "allergies", e.target.value)}
                  />
                </Field>
                <Field label="Relevant diagnoses">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.diagnoses || "")}
                    onChange={(e) => setField(setIntakeData, "diagnoses", e.target.value)}
                  />
                </Field>
                <Field label="Recent surgeries (12 mo)">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(intakeData.surgeries || "")}
                    onChange={(e) => setField(setIntakeData, "surgeries", e.target.value)}
                  />
                </Field>
                <Field label="Blood pressure">
                  <input
                    className={inputCls}
                    value={String(intakeData.bp || "")}
                    onChange={(e) => setField(setIntakeData, "bp", e.target.value)}
                  />
                </Field>
                <Field label="Height / Weight">
                  <input
                    className={inputCls}
                    value={String(intakeData.ht_wt || "")}
                    onChange={(e) => setField(setIntakeData, "ht_wt", e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card title="5 — Pre-Treatment Clinician Checklist">
              <div className="space-y-1.5 mb-4">
                {FLOWWAVE_PRE_TREATMENT_CHECKS.map((c) => (
                  <CheckItem
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    checked={intakeData[c.id] === true}
                    onChange={(v) => setField(setIntakeData, c.id, v)}
                  />
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Treating clinician">
                  <input
                    className={inputCls}
                    value={String(intakeData.clinician || "")}
                    onChange={(e) => setField(setIntakeData, "clinician", e.target.value)}
                  />
                </Field>
                <Field label="Session date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(intakeData.session_date || "")}
                    onChange={(e) => setField(setIntakeData, "session_date", e.target.value)}
                  />
                </Field>
                <Field label="Intensity (1–15)">
                  <input
                    type="number"
                    min={1}
                    max={15}
                    className={inputCls}
                    value={String(intakeData.intensity || "")}
                    onChange={(e) => setField(setIntakeData, "intensity", e.target.value)}
                  />
                </Field>
                <Field label="Frequency / PRF (Hz)">
                  <input
                    type="number"
                    min={30}
                    max={180}
                    className={inputCls}
                    value={String(intakeData.frequency || "")}
                    onChange={(e) => setField(setIntakeData, "frequency", e.target.value)}
                  />
                </Field>
                <Field label="Preset shots">
                  <input
                    type="number"
                    className={inputCls}
                    value={String(intakeData.shots || "")}
                    onChange={(e) => setField(setIntakeData, "shots", e.target.value)}
                  />
                </Field>
                <Field label="Session notes">
                  <input
                    className={inputCls}
                    value={String(intakeData.session_notes || "")}
                    onChange={(e) => setField(setIntakeData, "session_notes", e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card title="6 — Informed Consent">
              <p className="text-sm leading-relaxed mb-4">
                I confirm that the information provided above is accurate and complete. I understand
                the contraindications and precautions associated with the FlowWave FOCUS Cellular
                Reaction Technology System and agree to notify the clinician immediately of any
                unusual discomfort during the session.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Client signature (typed)">
                  <input
                    className={inputCls}
                    value={String(intakeData.client_sig || "")}
                    onChange={(e) => setField(setIntakeData, "client_sig", e.target.value)}
                  />
                </Field>
                <Field label="Client signature date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(intakeData.client_sig_date || "")}
                    onChange={(e) => setField(setIntakeData, "client_sig_date", e.target.value)}
                  />
                </Field>
                <Field label="Clinician signature (typed)">
                  <input
                    className={inputCls}
                    value={String(intakeData.clinician_sig || "")}
                    onChange={(e) => setField(setIntakeData, "clinician_sig", e.target.value)}
                  />
                </Field>
                <Field label="Clinician signature date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(intakeData.clinician_sig_date || "")}
                    onChange={(e) => setField(setIntakeData, "clinician_sig_date", e.target.value)}
                  />
                </Field>
              </div>
            </Card>
          </div>
        )}

        {tab === "soap" && (
          <div>
            <Card title="Session Info">
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Client name">
                  <input
                    className={inputCls}
                    value={String(soapData.soap_client || "")}
                    onChange={(e) => setField(setSoapData, "soap_client", e.target.value)}
                  />
                </Field>
                <Field label="Session date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(soapData.soap_date || "")}
                    onChange={(e) => setField(setSoapData, "soap_date", e.target.value)}
                  />
                </Field>
                <Field label="Session #">
                  <input
                    type="number"
                    className={inputCls}
                    value={String(soapData.soap_session_num || "")}
                    onChange={(e) => setField(setSoapData, "soap_session_num", e.target.value)}
                  />
                </Field>
                <Field label="Clinician">
                  <input
                    className={inputCls}
                    value={String(soapData.soap_clinician || "")}
                    onChange={(e) => setField(setSoapData, "soap_clinician", e.target.value)}
                  />
                </Field>
                <Field label="Treatment area(s)">
                  <input
                    className={inputCls}
                    value={String(soapData.soap_area || "")}
                    onChange={(e) => setField(setSoapData, "soap_area", e.target.value)}
                  />
                </Field>
                <Field label="Handle used">
                  <select
                    className={inputCls}
                    value={String(soapData.soap_handle || FLOWWAVE_HANDLE_TYPES[0])}
                    onChange={(e) => setField(setSoapData, "soap_handle", e.target.value)}
                  >
                    {FLOWWAVE_HANDLE_TYPES.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </Card>

            <Card title="S — Subjective">
              <div className="space-y-3">
                <Field label="Chief complaint / reason for today's session">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={String(soapData.soap_s_complaint || "")}
                    onChange={(e) => setField(setSoapData, "soap_s_complaint", e.target.value)}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Pain BEFORE (0–10)">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      className={inputCls}
                      value={String(soapData.soap_pain_before || "")}
                      onChange={(e) => setField(setSoapData, "soap_pain_before", e.target.value)}
                    />
                  </Field>
                  <Field label="Changes since last session">
                    <input
                      className={inputCls}
                      value={String(soapData.soap_changes || "")}
                      onChange={(e) => setField(setSoapData, "soap_changes", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            <Card title="O — Objective">
              <div className="grid sm:grid-cols-3 gap-3">
                {(
                  [
                    ["soap_intensity", "Intensity (1–15)"],
                    ["soap_freq", "Frequency (Hz)"],
                    ["soap_shots", "Preset shots"],
                    ["soap_actual_shots", "Actual shots"],
                    ["soap_energy", "Total energy (mJ)"],
                    ["soap_duration", "Duration (min)"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      className={inputCls}
                      value={String(soapData[key] || "")}
                      onChange={(e) => setField(setSoapData, key, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <Field label="Depth adjustment (1–5)">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={inputCls}
                    value={String(soapData.soap_depth || "")}
                    onChange={(e) => setField(setSoapData, "soap_depth", e.target.value)}
                  />
                </Field>
                <Field label="Output mode">
                  <select
                    className={inputCls}
                    value={String(soapData.soap_mode || "Automatic")}
                    onChange={(e) => setField(setSoapData, "soap_mode", e.target.value)}
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </Field>
              </div>
              <Field label="Objective findings" className="mt-3">
                <textarea
                  className={inputCls}
                  rows={2}
                  value={String(soapData.soap_o_findings || "")}
                  onChange={(e) => setField(setSoapData, "soap_o_findings", e.target.value)}
                />
              </Field>
            </Card>

            <Card title="A — Assessment">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Client tolerance">
                  <select
                    className={inputCls}
                    value={String(soapData.soap_tolerance || "Well tolerated")}
                    onChange={(e) => setField(setSoapData, "soap_tolerance", e.target.value)}
                  >
                    <option>Well tolerated</option>
                    <option>Mild discomfort</option>
                    <option>Moderate discomfort</option>
                    <option>Session stopped early</option>
                  </select>
                </Field>
                <Field label="Pain AFTER (0–10)">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className={inputCls}
                    value={String(soapData.soap_pain_after || "")}
                    onChange={(e) => setField(setSoapData, "soap_pain_after", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Progress toward goals" className="mt-3">
                <textarea
                  className={inputCls}
                  rows={2}
                  value={String(soapData.soap_progress || "")}
                  onChange={(e) => setField(setSoapData, "soap_progress", e.target.value)}
                />
              </Field>
              <Field label="Adverse reactions" className="mt-3">
                <textarea
                  className={inputCls}
                  rows={2}
                  value={String(soapData.soap_adverse || "")}
                  onChange={(e) => setField(setSoapData, "soap_adverse", e.target.value)}
                />
              </Field>
            </Card>

            <Card title="P — Plan">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Next session date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(soapData.soap_next_date || "")}
                    onChange={(e) => setField(setSoapData, "soap_next_date", e.target.value)}
                  />
                </Field>
                <Field label="Recommended frequency">
                  <input
                    className={inputCls}
                    value={String(soapData.soap_freq_rec || "")}
                    onChange={(e) => setField(setSoapData, "soap_freq_rec", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Parameter adjustments" className="mt-3">
                <textarea
                  className={inputCls}
                  rows={2}
                  value={String(soapData.soap_params_next || "")}
                  onChange={(e) => setField(setSoapData, "soap_params_next", e.target.value)}
                />
              </Field>
              <Field label="Home care instructions" className="mt-3">
                <textarea
                  className={inputCls}
                  rows={2}
                  value={String(soapData.soap_homecare || "")}
                  onChange={(e) => setField(setSoapData, "soap_homecare", e.target.value)}
                />
              </Field>
            </Card>
          </div>
        )}

        {tab === "session" && (
          <div>
            <Card title="Quick session entry">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Date">
                  <input
                    type="date"
                    className={inputCls}
                    value={sessionEntry.sessionDate}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, sessionDate: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Treatment area">
                  <select
                    className={inputCls}
                    value={sessionEntry.treatmentArea}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, treatmentArea: e.target.value }))
                    }
                  >
                    <option value="">Select…</option>
                    {FLOWWAVE_TREATMENT_AREAS.filter((a) => a.id !== "multi").map((a) => (
                      <option key={a.id} value={a.label}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Intensity (1–15)">
                  <input
                    type="number"
                    className={inputCls}
                    value={sessionEntry.intensity}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, intensity: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Frequency (Hz)">
                  <input
                    type="number"
                    className={inputCls}
                    value={sessionEntry.frequencyHz}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, frequencyHz: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Shots delivered">
                  <input
                    type="number"
                    className={inputCls}
                    value={sessionEntry.shotsDelivered}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, shotsDelivered: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Clinician">
                  <input
                    className={inputCls}
                    value={sessionEntry.clinician}
                    onChange={(e) =>
                      setSessionEntry((p) => ({ ...p, clinician: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Notes" className="sm:col-span-2">
                  <input
                    className={inputCls}
                    value={sessionEntry.notes}
                    onChange={(e) => setSessionEntry((p) => ({ ...p, notes: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={() => void addSession()}
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-[#1A6B3C] text-white text-sm font-bold"
                >
                  + Add to log
                </button>
              </div>
            </Card>

            <Card title="Session log">
              {sessions.length === 0 ? (
                <p className="text-sm text-black/50 text-center py-8">No sessions logged yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase text-white bg-[#1A5F8A]">
                        <th className="p-2">#</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Area</th>
                        <th className="p-2">Int.</th>
                        <th className="p-2">Hz</th>
                        <th className="p-2">Shots</th>
                        <th className="p-2">Clinician</th>
                        <th className="p-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, i) => (
                        <tr key={s.id} className="border-b hover:bg-[#D5E8F5]/40">
                          <td className="p-2">{s.session_number ?? i + 1}</td>
                          <td className="p-2">{s.session_date}</td>
                          <td className="p-2">{s.treatment_area}</td>
                          <td className="p-2">{s.intensity}</td>
                          <td className="p-2">{s.frequency_hz}</td>
                          <td className="p-2">{s.shots_delivered}</td>
                          <td className="p-2">{s.clinician}</td>
                          <td className="p-2">{s.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === "policy" && (
          <div>
            <Card title="Practice Information">
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Practice name">
                  <input
                    className={inputCls}
                    value={String(policyData.practice_name || "")}
                    onChange={(e) => setField(setPolicyData, "practice_name", e.target.value)}
                  />
                </Field>
                <Field label="Cancellation fee">
                  <input
                    className={inputCls}
                    value={String(policyData.cancel_fee || "")}
                    onChange={(e) => setField(setPolicyData, "cancel_fee", e.target.value)}
                  />
                </Field>
                <Field label="Late arrival cutoff (min)">
                  <input
                    type="number"
                    className={inputCls}
                    value={String(policyData.late_mins || "15")}
                    onChange={(e) => setField(setPolicyData, "late_mins", e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card title="Financial Policy & Cancellation Agreement">
              <div className="text-center mb-4">
                <p className="text-lg font-bold text-[#1A5F8A]">
                  {String(policyData.practice_name || "Hello Gorgeous Med Spa")}
                </p>
                <p className="text-sm text-black/60">FlowWave FOCUS — Financial Policy</p>
              </div>
              {[
                {
                  h: "Payment",
                  p: "Payment is due in full at the time of service unless a payment plan has been arranged in advance.",
                },
                {
                  h: "Cancellation & rescheduling",
                  p: `We require 24 hours notice. Late cancellations may incur a fee of ${String(policyData.cancel_fee || "$50")}.`,
                },
                {
                  h: "Late arrivals",
                  p: `Arrivals more than ${String(policyData.late_mins || "15")} minutes late may be shortened or rescheduled.`,
                },
                {
                  h: "Nature of service",
                  p: "FlowWave FOCUS CRT/shockwave is a wellness service and does not substitute for professional medical diagnosis or treatment.",
                },
              ].map((block) => (
                <div
                  key={block.h}
                  className="mb-3 p-3 bg-gray-50 rounded-md border-l-4 border-[#1A5F8A]"
                >
                  <h4 className="text-sm font-bold text-[#1A5F8A] mb-1">{block.h}</h4>
                  <p className="text-sm leading-relaxed">{block.p}</p>
                </div>
              ))}
              <Field label="Client name (print)" className="mt-4">
                <input
                  className={inputCls}
                  value={String(policyData.policy_client_name || "")}
                  onChange={(e) => setField(setPolicyData, "policy_client_name", e.target.value)}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Client signature (typed)">
                  <input
                    className={inputCls}
                    value={String(policyData.policy_client_sig || "")}
                    onChange={(e) => setField(setPolicyData, "policy_client_sig", e.target.value)}
                  />
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    className={inputCls}
                    value={String(policyData.policy_client_date || "")}
                    onChange={(e) => setField(setPolicyData, "policy_client_date", e.target.value)}
                  />
                </Field>
              </div>
            </Card>
          </div>
        )}

        {tab === "records" && (
          <Card title="Portal records">
            {!selectedClient ? (
              <p className="text-sm text-black/50">Select a client to view saved records.</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-black/50">No intakes saved yet for this client.</p>
            ) : (
              <ul className="divide-y">
                {records.map((r) => (
                  <li key={r.id} className="py-3 flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm">
                        {r.treatment_area || "Intake"} · {r.screening_result}
                      </p>
                      <p className="text-xs text-black/50">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-bold text-[#1A5F8A]"
                      onClick={() => {
                        void loadIntake(r.id);
                        setTab("intake");
                      }}
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1A3A2A] text-white px-5 py-3 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
