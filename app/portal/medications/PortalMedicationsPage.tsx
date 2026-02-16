"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";

type Medication = {
  id: string;
  medName: string;
  dosage: string | null;
  unit: string | null;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
  refillStatus: string;
  refillRequestedAt: string | null;
  notes: string | null;
  createdAt: string;
};

const CATEGORIES = [
  { value: "hormone", label: "Hormone" },
  { value: "peptide", label: "Peptide" },
  { value: "iv", label: "IV Therapy" },
  { value: "supplement", label: "Supplement" },
  { value: "other", label: "Other" },
];

export function PortalMedicationsPage() {
  const [email, setEmail] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [refilling, setRefilling] = useState<string | null>(null);
  const [form, setForm] = useState({
    medName: "",
    dosage: "",
    unit: "units",
    category: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hg_portal_email") : null;
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (!email.trim()) {
      setMedications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/memberships/wellness/medications?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setMedications(d.medications || []))
      .catch(() => setMedications([]))
      .finally(() => setLoading(false));
  }, [email]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !form.medName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/memberships/wellness/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          medName: form.medName.trim(),
          dosage: form.dosage.trim() || undefined,
          unit: form.unit.trim() || undefined,
          category: form.category || undefined,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setForm({ medName: "", dosage: "", unit: "units", category: "", startDate: "", endDate: "", notes: "" });
      setShowAddForm(false);
      setMedications((prev) => [
        {
          id: data.id,
          medName: form.medName.trim(),
          dosage: form.dosage.trim() || null,
          unit: form.unit.trim() || null,
          category: form.category || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          refillStatus: "active",
          refillRequestedAt: null,
          notes: form.notes.trim() || null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch {
      alert("Could not add medication. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRefill = async (id: string) => {
    if (!email) return;
    setRefilling(id);
    try {
      const res = await fetch(`/api/memberships/wellness/medications/${id}/refill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMedications((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, refillStatus: "pending", refillRequestedAt: new Date().toISOString() } : m
        )
      );
    } catch {
      alert("Could not request refill.");
    } finally {
      setRefilling(null);
    }
  };

  const refillLabel = (status: string) => {
    if (status === "pending") return "Requested";
    if (status === "refilled") return "Refilled";
    if (status === "expired") return "Expired";
    return "Request Refill";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Medications & Supplements</h1>
        <p className="text-black mt-1">
          Track prescriptions, peptides, IV therapies. Request refills.
        </p>
      </div>

      {!email && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">Enter your email to access medication tracking.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mt-3 w-full max-w-md px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <p className="mt-2 text-amber-700 text-xs">
            <Link href="/memberships" className="font-semibold underline">Join a wellness program</Link>
          </p>
        </div>
      )}

      {email && (
        <>
          {/* Fullscript Supplements */}
          <section className="bg-white rounded-2xl border border-black p-6">
            <h2 className="text-lg font-semibold text-black mb-2">Supplements</h2>
            <p className="text-black text-sm mb-4">
              Browse recommended supplements through our Fullscript dispensary.
            </p>
            <a
              href={FULLSCRIPT_DISPENSARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-full hover:opacity-90 transition"
            >
              View Fullscript Store →
            </a>
          </section>

          {/* Medication List */}
          <section className="bg-white rounded-2xl border border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Your Medications</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-full hover:opacity-90"
              >
                + Add
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAdd} className="mb-6 p-4 rounded-xl bg-white border border-black space-y-3">
                <input
                  required
                  placeholder="Medication name *"
                  value={form.medName}
                  onChange={(e) => setForm((f) => ({ ...f, medName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-pink-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Dosage"
                    value={form.dosage}
                    onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                  <input
                    placeholder="Unit"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="">Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Notes"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-black focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={adding}
                    className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {adding ? "Adding…" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p className="text-black py-8 text-center">Loading…</p>
            ) : medications.length === 0 ? (
              <div className="py-12 text-center text-black">
                <p className="mb-4">No medications tracked yet.</p>
                <p className="text-sm">Add medications or request your provider to add them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white border border-black"
                  >
                    <div>
                      <p className="font-semibold text-black">{m.medName}</p>
                      <p className="text-sm text-black">
                        {m.dosage && `${m.dosage} ${m.unit || ""}`}
                        {m.category && ` • ${m.category}`}
                        {m.refillStatus === "pending" && " • Refill requested"}
                      </p>
                    </div>
                    {m.refillStatus === "active" && (
                      <button
                        onClick={() => handleRefill(m.id)}
                        disabled={refilling === m.id}
                        className="px-4 py-2 text-sm font-medium text-pink-600 border border-pink-300 rounded-lg hover:bg-pink-50 disabled:opacity-50"
                      >
                        {refilling === m.id ? "Requesting…" : "Request Refill"}
                      </button>
                    )}
                    {m.refillStatus === "pending" && (
                      <span className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
