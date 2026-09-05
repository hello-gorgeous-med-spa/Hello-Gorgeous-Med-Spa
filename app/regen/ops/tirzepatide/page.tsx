'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TirzepatidePlanPicker } from '@/components/regen/TirzepatidePlanPicker';
import {
  TIRZ_TERM_DAYS,
  TIRZ_WEEKLY_DOSES,
  quoteTirzepatide,
  type TirzTermDays,
  type TirzWeeklyDose,
} from '@/lib/regen/tirzepatide-vial-pricing';
import { formatUsd } from '@/lib/regen/vitamin-vial-pricing';

export default function TirzepatideOpsPage() {
  const [weeklyMg, setWeeklyMg] = useState<TirzWeeklyDose>(2.5);
  const [termDays, setTermDays] = useState<TirzTermDays>(30);
  const quote = useMemo(() => quoteTirzepatide(weeklyMg, termDays), [weeklyMg, termDays]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Tirzepatide</h1>
          <p className="text-white/50 mt-1">
            Formulation $40 / 1 mL at 12.5 mg/mL · retail 2.5× · 10% off 90-day. Same picker clients use on Start.
          </p>
        </div>
        <Link href="/ops/reconstitution" className="text-sm text-teal-400 hover:text-teal-300">
          Reconstitution →
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <TirzepatidePlanPicker
          variant="ops"
          weeklyMg={weeklyMg}
          termDays={termDays}
          onWeeklyChange={setWeeklyMg}
          onTermChange={setTermDays}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 overflow-x-auto">
        <h2 className="text-white font-semibold mb-3">Quote board</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-left">
              <th className="pb-2 pr-3">Request</th>
              {TIRZ_TERM_DAYS.map((days) => (
                <th key={days} className="pb-2 pr-3">{days}-day{days === 90 ? ' −10%' : ''}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIRZ_WEEKLY_DOSES.map((dose) => (
              <tr key={dose} className={dose === weeklyMg ? 'text-white' : 'text-white/70'}>
                <td className="py-2 pr-3">{dose} mg/wk · {quoteTirzepatide(dose, 30).monthlyVials} vial/mo</td>
                {TIRZ_TERM_DAYS.map((days) => {
                  const q = quoteTirzepatide(dose, days);
                  const selected = dose === weeklyMg && days === termDays;
                  return (
                    <td key={days} className={`py-2 pr-3 ${selected ? 'text-pink-400 font-bold' : ''}`}>
                      {formatUsd(q.retail)}
                      <span className="block text-xs text-white/35">{q.vials} vial{q.vials === 1 ? '' : 's'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-white/35 text-xs mt-4">
          Selected: order {quote.vials} × 1 mL 12.5 mg/mL in Formulation. Client paid or will pay {formatUsd(quote.total)} including shipping.
        </p>
      </div>
    </div>
  );
}
