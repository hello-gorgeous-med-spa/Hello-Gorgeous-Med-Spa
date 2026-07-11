"use client";

import { useEffect, useState } from "react";

import type { SalesStaffOption } from "@/lib/regen/sales-attribution";

type Props = {
  value: string;
  onChange: (userId: string) => void;
  className?: string;
  label?: string;
};

export function RegenSoldByPicker({
  value,
  onChange,
  className = "",
  label = "Sold by",
}: Props) {
  const [staff, setStaff] = useState<SalesStaffOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [staffRes, sessionRes] = await Promise.all([
          fetch("/api/admin/rx/sales-staff"),
          fetch("/api/auth/session"),
        ]);
        const staffData = await staffRes.json();
        const sessionData = await sessionRes.json();
        if (cancelled) return;

        const options: SalesStaffOption[] = staffRes.ok ? staffData.staff || [] : [];
        setStaff(options);

        const sessionUserId = sessionData.userId ? String(sessionData.userId) : "";
        if (sessionUserId && !value) {
          onChange(sessionUserId);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init default seller once
  }, []);

  if (loading) {
    return (
      <p className={`text-xs text-black/50 ${className}`}>Loading staff…</p>
    );
  }

  if (!staff.length) return null;

  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-black/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-semibold text-black"
      >
        {staff.map((s) => (
          <option key={s.userId} value={s.userId}>
            {s.displayName}
            {s.email ? ` (${s.email})` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

export function useRegenSoldBySession(): {
  soldByUserId: string;
  setSoldByUserId: (id: string) => void;
  ready: boolean;
} {
  const [soldByUserId, setSoldByUserId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (cancelled) return;
      if (data.userId) {
        setSoldByUserId(String(data.userId));
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { soldByUserId, setSoldByUserId, ready };
}
