"use client";

import { useState } from "react";

interface ComparisonRow {
  label: string;
  glow: string;
  luxe: string;
  platinum: string;
}

const TIER_CONFIG = [
  { key: "glow" as const,     name: "Glow",     icon: "🌸", color: "#FF2D8E", price: "$79" },
  { key: "luxe" as const,     name: "Luxe",     icon: "💎", color: "#3b82f6", price: "$149", highlight: true },
  { key: "platinum" as const, name: "Platinum", icon: "👑", color: "#f59e0b", price: "$249" },
];

function CellValue({ value, color }: { value: string; color: string }) {
  if (value === "—") return <span className="text-white/20">—</span>;
  if (value === "✓") return <span style={{ color }} className="font-bold text-lg">✓</span>;
  return <span className="text-white/80 text-sm">{value}</span>;
}

export function MembershipComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  const [mobileTab, setMobileTab] = useState<"glow" | "luxe" | "platinum">("luxe");

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/50 w-[30%]">Feature</th>
              {TIER_CONFIG.map((t) => (
                <th
                  key={t.key}
                  className="px-6 py-4 text-center"
                  style={{
                    background: t.highlight ? "rgba(59,130,246,0.10)" : undefined,
                    borderLeft: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-black text-white text-base">{t.name}</span>
                    <span className="text-sm font-bold" style={{ color: t.color }}>{t.price}/mo</span>
                    {t.highlight && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                        style={{ background: t.color }}
                      >
                        Most Popular
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}
              >
                <td className="px-6 py-3.5 text-sm font-medium text-white/60">{row.label}</td>
                {TIER_CONFIG.map((t) => (
                  <td
                    key={t.key}
                    className="px-6 py-3.5 text-center"
                    style={{
                      background: t.highlight ? "rgba(59,130,246,0.06)" : undefined,
                      borderLeft: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <CellValue value={row[t.key]} color={t.color} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="sm:hidden">
        {/* Tab switcher */}
        <div className="mb-6 flex rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.10)" }}>
          {TIER_CONFIG.map((t) => (
            <button
              key={t.key}
              onClick={() => setMobileTab(t.key)}
              className="flex-1 py-3 text-sm font-bold transition"
              style={{
                background: mobileTab === t.key ? t.color : "transparent",
                color: mobileTab === t.key ? "#fff" : "rgba(255,255,255,0.40)",
              }}
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>

        {/* Selected tier column */}
        {TIER_CONFIG.filter((t) => t.key === mobileTab).map((t) => (
          <div
            key={t.key}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${t.color}30` }}
          >
            <div
              className="px-5 py-4 text-center"
              style={{ background: `${t.color}15` }}
            >
              <p className="text-2xl font-black text-white">
                {t.icon} {t.name}
              </p>
              <p className="text-xl font-bold mt-1" style={{ color: t.color }}>
                {t.price}/mo
              </p>
            </div>
            <div className="divide-y divide-white/6">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="text-sm text-white/50">{row.label}</span>
                  <span className="text-sm font-semibold text-right">
                    <CellValue value={row[t.key]} color={t.color} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
