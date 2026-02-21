"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface VIPWaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  age_range?: string;
  concerns?: string[];
  prior_treatment?: boolean;
  downtime_ok?: boolean;
  investment_ready?: boolean;
  status: string;
  notes?: string;
  created_at: string;
  contacted_at?: string;
  booked_at?: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800" },
  { value: "scheduled", label: "Scheduled", color: "bg-purple-100 text-purple-800" },
  { value: "booked", label: "Booked", color: "bg-green-100 text-green-800" },
  { value: "declined", label: "Declined", color: "bg-gray-100 text-gray-800" },
  { value: "no_response", label: "No Response", color: "bg-red-100 text-red-800" },
];

const CONCERN_LABELS: Record<string, string> = {
  acne_scars: "Acne Scars",
  deep_wrinkles: "Deep Wrinkles",
  fine_lines: "Fine Lines",
  skin_laxity: "Skin Laxity",
  texture_tone: "Texture & Tone",
  sun_damage: "Sun Damage",
  hyperpigmentation: "Hyperpigmentation",
  enlarged_pores: "Enlarged Pores",
};

export default function CO2VIPWaitlistPage() {
  const [entries, setEntries] = useState<VIPWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "qualified">("all");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedEntry, setSelectedEntry] = useState<VIPWaitlistEntry | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        campaign: "co2_solaria",
        ...(filter === "qualified" && { qualified: "true" }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/vip-waitlist?${params}`);
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, statusFilter]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch("/api/vip-waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        fetchEntries();
        if (selectedEntry?.id === id) {
          setSelectedEntry((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const qualifiedCount = entries.filter(
    (e) => e.investment_ready && e.downtime_ok
  ).length;

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        {status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/admin" className="hover:text-pink-500">
            Admin
          </Link>
          <span>/</span>
          <span>CO₂ VIP Waitlist</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">CO₂ VIP Waitlist</h1>
        <p className="text-gray-600 mt-1">
          Manage Solaria CO₂ Laser VIP early access requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 bg-green-50">
          <p className="text-sm text-green-600">Qualified Leads</p>
          <p className="text-2xl font-bold text-green-700">{qualifiedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {entries.filter((e) => e.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Booked</p>
          <p className="text-2xl font-bold text-green-600">
            {entries.filter((e) => e.status === "booked").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Filter</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Entries
              </button>
              <button
                onClick={() => setFilter("qualified")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "qualified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Qualified Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={fetchEntries}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No entries found. Share the VIP waitlist link to start collecting leads!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Investment Ready
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Downtime OK
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gray-50 ${
                      entry.investment_ready && entry.downtime_ok
                        ? "bg-green-50/30"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="font-medium text-gray-900 hover:text-pink-500"
                      >
                        {entry.name}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{entry.email}</div>
                      <div className="text-sm text-gray-500">{entry.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.investment_ready ? (
                        <span className="text-green-600 font-bold">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.downtime_ok ? (
                        <span className="text-green-600 font-bold">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(entry.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(entry.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={entry.status}
                        onChange={(e) => updateStatus(entry.id, e.target.value)}
                        disabled={updating}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEntry.name}
                </h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {getStatusBadge(selectedEntry.status)}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Contact
                </h3>
                <p className="text-gray-900">{selectedEntry.email}</p>
                <p className="text-gray-900">{selectedEntry.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Qualification
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Age Range</p>
                    <p className="font-medium">{selectedEntry.age_range || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Prior CO₂</p>
                    <p className="font-medium">
                      {selectedEntry.prior_treatment ? "Yes" : "No"}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      selectedEntry.investment_ready
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Investment Ready</p>
                    <p
                      className={`font-bold ${
                        selectedEntry.investment_ready
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedEntry.investment_ready ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      selectedEntry.downtime_ok ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Downtime OK</p>
                    <p
                      className={`font-bold ${
                        selectedEntry.downtime_ok
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedEntry.downtime_ok ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedEntry.concerns && selectedEntry.concerns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Concerns
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.concerns.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                      >
                        {CONCERN_LABELS[c] || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Timeline
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Submitted: {formatDate(selectedEntry.created_at)}</p>
                  {selectedEntry.contacted_at && (
                    <p>Contacted: {formatDate(selectedEntry.contacted_at)}</p>
                  )}
                  {selectedEntry.booked_at && (
                    <p>Booked: {formatDate(selectedEntry.booked_at)}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Update Status
                </h3>
                <select
                  value={selectedEntry.status}
                  onChange={(e) => {
                    updateStatus(selectedEntry.id, e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={`tel:${selectedEntry.phone}`}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-center font-medium rounded-lg transition-colors"
                >
                  📞 Call
                </a>
                <a
                  href={`sms:${selectedEntry.phone}`}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-center font-medium rounded-lg transition-colors"
                >
                  💬 Text
                </a>
                <a
                  href={`mailto:${selectedEntry.email}`}
                  className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white text-center font-medium rounded-lg transition-colors"
                >
                  ✉️ Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
