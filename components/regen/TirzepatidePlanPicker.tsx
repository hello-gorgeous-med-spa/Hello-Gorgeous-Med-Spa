'use client';

import {
  TIRZ_RETAIL_PER_VIAL,
  TIRZ_STRENGTH_MG_PER_ML,
  TIRZ_TERM_DAYS,
  TIRZ_WEEKLY_DOSES,
  TIRZ_WHOLESALE_PER_ML,
  doseLabel,
  quoteTirzepatide,
  termLabel,
  type TirzTermDays,
  type TirzWeeklyDose,
} from '@/lib/regen/tirzepatide-vial-pricing';
import { formatUsd } from '@/lib/regen/vitamin-vial-pricing';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

export function TirzepatidePlanPicker({
  weeklyMg,
  termDays,
  onWeeklyChange,
  onTermChange,
  variant = 'client',
}: {
  weeklyMg: TirzWeeklyDose;
  termDays: TirzTermDays;
  onWeeklyChange: (dose: TirzWeeklyDose) => void;
  onTermChange: (days: TirzTermDays) => void;
  variant?: 'client' | 'ops';
}) {
  const quote = quoteTirzepatide(weeklyMg, termDays);
  const ops = variant === 'ops';

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={`block text-sm font-medium mb-2 ${ops ? 'text-white/70' : ''}`} style={ops ? undefined : { color: BRAND.gray }}>
            Monthly request
          </span>
          <select
            value={weeklyMg}
            onChange={(e) => onWeeklyChange(Number(e.target.value) as TirzWeeklyDose)}
            className={`w-full px-4 py-3 rounded-xl ${ops ? 'bg-white/10 border border-white/20 text-white' : ''}`}
            style={ops ? undefined : { backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}40`, color: BRAND.cream }}
          >
            {TIRZ_WEEKLY_DOSES.map((dose) => {
              const month = quoteTirzepatide(dose, 30);
              return (
                <option key={dose} value={dose}>
                  {doseLabel(dose)} — {formatUsd(month.retail)}
                </option>
              );
            })}
          </select>
        </label>
        <label className="block">
          <span className={`block text-sm font-medium mb-2 ${ops ? 'text-white/70' : ''}`} style={ops ? undefined : { color: BRAND.gray }}>
            Supply
          </span>
          <select
            value={termDays}
            onChange={(e) => onTermChange(Number(e.target.value) as TirzTermDays)}
            className={`w-full px-4 py-3 rounded-xl ${ops ? 'bg-white/10 border border-white/20 text-white' : ''}`}
            style={ops ? undefined : { backgroundColor: BRAND.dark, border: `1px solid ${BRAND.teal}40`, color: BRAND.cream }}
          >
            {TIRZ_TERM_DAYS.map((days) => {
              const q = quoteTirzepatide(weeklyMg, days);
              const extra = days === 90 ? ` (save ${formatUsd(q.discount)})` : '';
              return (
                <option key={days} value={days}>
                  {termLabel(days)} — {formatUsd(q.retail)}{extra}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div
        className={`rounded-2xl p-5 ${ops ? 'border border-white/10 bg-white/5' : ''}`}
        style={ops ? undefined : { backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}40` }}
      >
        <p className={`text-sm ${ops ? 'text-white/50' : ''}`} style={ops ? undefined : { color: BRAND.gray }}>
          Requested plan — Ryan confirms the prescribed dose
        </p>
        <p className={`text-xl font-bold mt-1 ${ops ? 'text-white' : ''}`} style={ops ? undefined : { color: BRAND.cream }}>
          {quote.requestLabel}
        </p>
        <p className="text-3xl font-black mt-3" style={{ color: BRAND.pink }}>
          {formatUsd(quote.retail)}
          {quote.discount > 0 && (
            <span className="ml-2 text-base font-normal line-through" style={{ color: BRAND.gray }}>
              {formatUsd(quote.retailBeforeDiscount)}
            </span>
          )}
        </p>
        <p className={`text-sm mt-1 ${ops ? 'text-white/50' : ''}`} style={ops ? undefined : { color: BRAND.gray }}>
          + {formatUsd(quote.shipping)} pharmacy shipping · due {formatUsd(quote.total)}
        </p>
        <p className={`text-xs mt-3 ${ops ? 'text-white/40' : ''}`} style={ops ? undefined : { color: BRAND.gray }}>
          Formulation 1 mL @ {TIRZ_STRENGTH_MG_PER_ML} mg/mL · {quote.vials} vial{quote.vials === 1 ? '' : 's'} · {quote.mlPerWeek} mL / {quote.unitsPerWeek} units per week on a U-100
        </p>
        {ops && (
          <p className="text-xs text-teal-300 mt-2">
            COGS {formatUsd(quote.wholesale)} ({quote.vials} × {formatUsd(TIRZ_WHOLESALE_PER_ML)}) · retail {formatUsd(TIRZ_RETAIL_PER_VIAL)}/vial · margin {formatUsd(quote.retail - quote.wholesale)}
          </p>
        )}
      </div>
    </div>
  );
}
