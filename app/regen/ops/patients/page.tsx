"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { opsChartHref } from "@/lib/regen/ops-staff";

type Patient = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  orderCount?: number;
  totalSpent?: number;
};

export default function PatientsPage() {
  const [rows, setRows] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/regen/ops/patients?limit=80&search=${encodeURIComponent(search)}`, {
      cache: "no-store",
    });
    const json = await res.json();
    setRows(json.patients || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Patients</h1>
          <p className="text-white/50">{rows.length} people in REGEN</p>
        </div>
        <Link href="/ops/desk" className="px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold">
          New walk-in
        </Link>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email, phone"
        className="w-full max-w-md px-3 py-2 rounded-lg bg-white/10 text-white"
      />
      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && rows.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">
          No patients yet. Use Walk-in for a desk sale, or they will appear after an online screening.
        </div>
      )}
      <div className="space-y-2">
        {rows.map((r) => {
          const name = `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.email || "Patient";
          return (
            <Link
              key={r.id}
              href={opsChartHref(r.email || "")}
              className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10"
            >
              <p className="text-white font-medium">{name}</p>
              <p className="text-white/50 text-sm">
                {r.email} {r.phone ? `· ${r.phone}` : ""} · {r.orderCount || 0} orders
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
