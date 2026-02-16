"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminWellnessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/wellness/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-black">Loading…</p>
      </div>
    );
  }

  const stats = data?.stats || { activeMembers: 0, totalLabs: 0, pendingRefills: 0, unreadMessages: 0 };
  const subscriptions = data?.subscriptions || [];
  const refillRequests = data?.refillRequests || [];
  const recentMessages = data?.recentMessages || [];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Wellness Members</h1>
        <p className="text-black">Precision Hormone & Metabolic Reset programs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-black p-4">
          <p className="text-2xl font-bold text-pink-600">{stats.activeMembers}</p>
          <p className="text-sm text-black">Active members</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.totalLabs}</p>
          <p className="text-sm text-black">Lab uploads</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.pendingRefills}</p>
          <p className="text-sm text-black">Refill requests</p>
        </div>
        <div className="bg-white rounded-xl border border-black p-4">
          <p className="text-2xl font-bold text-emerald-600">{stats.unreadMessages}</p>
          <p className="text-sm text-black">Recent messages</p>
        </div>
      </div>

      {/* Refill requests */}
      {refillRequests.length > 0 && (
        <section className="bg-white rounded-xl border border-black overflow-hidden">
          <h2 className="px-6 py-4 font-semibold text-black border-b border-black">
            Pending refill requests
          </h2>
          <div className="divide-y divide-black">
            {refillRequests.map((r: any) => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-black">{r.med_name}</p>
                  <p className="text-sm text-black">
                    Requested {r.refill_requested_at ? new Date(r.refill_requested_at).toLocaleDateString() : "—"}
                  </p>
                </div>
                <Link
                  href={`/admin/clients/${r.client_id}`}
                  className="text-pink-600 text-sm font-medium hover:underline"
                >
                  View client →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent messages */}
      {recentMessages.length > 0 && (
        <section className="bg-white rounded-xl border border-black overflow-hidden">
          <h2 className="px-6 py-4 font-semibold text-black border-b border-black">
            Recent member messages
          </h2>
          <div className="divide-y divide-black max-h-64 overflow-y-auto">
            {recentMessages.map((m: any) => (
              <div key={m.id} className="px-6 py-3">
                <p className="text-sm text-black line-clamp-2">{m.message_body}</p>
                <p className="text-xs text-black mt-1">
                  {new Date(m.sent_at).toLocaleString()} • Client
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subscriptions */}
      <section className="bg-white rounded-xl border border-black overflow-hidden">
        <h2 className="px-6 py-4 font-semibold text-black border-b border-black">
          Member subscriptions
        </h2>
        {subscriptions.length === 0 ? (
          <div className="px-6 py-12 text-center text-black">
            No wellness memberships yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black bg-white">
                  <th className="text-left px-6 py-3 font-medium text-black">Client</th>
                  <th className="text-left px-6 py-3 font-medium text-black">Program</th>
                  <th className="text-left px-6 py-3 font-medium text-black">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-black">Credits</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s: any) => (
                  <tr key={s.id} className="border-b border-black hover:bg-white0">
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/clients/${s.client?.id}`}
                        className="text-pink-600 hover:underline"
                      >
                        {s.client?.first_name} {s.client?.last_name}
                      </Link>
                      <p className="text-xs text-black">{s.client?.email}</p>
                    </td>
                    <td className="px-6 py-3">{s.program?.name || "—"}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700"
                            : s.status === "inactive"
                            ? "bg-white text-black"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{s.wellnessCredits ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
