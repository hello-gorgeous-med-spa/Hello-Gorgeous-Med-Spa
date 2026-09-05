'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const TEAL = '#0D9488';
const VIAL_PRESETS = [2, 5, 10, 15, 20, 30];
const WATER_PRESETS = [1, 2, 3, 5];
const DRAW_ROWS = [
  { units: 5, ml: 0.05 },
  { units: 10, ml: 0.1 },
  { units: 20, ml: 0.2 },
  { units: 25, ml: 0.25 },
  { units: 50, ml: 0.5 },
  { units: 100, ml: 1 },
];

function fmt(n: number, digits = 1) {
  if (!Number.isFinite(n)) return '—';
  const s = n.toFixed(digits);
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

export default function ReconstitutionPage() {
  const [vialMg, setVialMg] = useState(10);
  const [waterMl, setWaterMl] = useState(2);
  const [targetMcg, setTargetMcg] = useState(250);

  const math = useMemo(() => {
    const mg = Number(vialMg);
    const ml = Number(waterMl);
    const want = Number(targetMcg);
    if (!(mg > 0 && ml > 0)) return null;
    const mgPerMl = mg / ml;
    const mcgPerMl = mgPerMl * 1000;
    const mcgPerUnit = mcgPerMl / 100;
    const mcgPerTen = mcgPerUnit * 10;
    const unitsForTarget = want > 0 ? want / mcgPerUnit : null;
    return { mgPerMl, mcgPerMl, mcgPerUnit, mcgPerTen, unitsForTarget, want };
  }, [vialMg, waterMl, targetMcg]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Reconstitution</h1>
          <p className="text-white/50 mt-1">
            Vial milligrams + bacteriostatic water → concentration and U-100 syringe draws.
          </p>
        </div>
        <Link href="/ops/calculator" className="text-sm text-teal-400 hover:text-teal-300">
          Cost / dosing calculator →
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Lyophilized material in vial</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                step="0.1"
                value={vialMg}
                onChange={(e) => setVialMg(parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <span className="text-white/50">mg</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {VIAL_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setVialMg(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    vialMg === n ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {n} mg
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bacteriostatic water added</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                step="0.1"
                value={waterMl}
                onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <span className="text-white/50">mL</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={waterMl}
              onChange={(e) => setWaterMl(parseFloat(e.target.value))}
              className="w-full mt-3"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {WATER_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setWaterMl(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    waterMl === n ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {n} mL
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Optional — amount to convert
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                step="10"
                value={targetMcg}
                onChange={(e) => setTargetMcg(parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <span className="text-white/50">mcg</span>
            </div>
            <p className="text-xs text-white/40 mt-2">Shows how many U-100 units that amount is at this concentration. Not a recommended dose.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: TEAL, background: `${TEAL}18` }}>
            <p className="text-white/60 text-xs uppercase tracking-wider">Resulting concentration</p>
            <p className="text-5xl font-black text-white mt-2">
              {math ? fmt(math.mgPerMl, 2) : '—'}
              <span className="text-lg font-semibold text-white/60 ml-2">mg/mL</span>
            </p>
            <p className="text-white/70 mt-2">{math ? `${fmt(math.mcgPerMl, 0)} mcg per mL` : ''}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/45 text-xs">Per 1 unit (0.01 mL)</p>
              <p className="text-2xl font-bold text-white mt-1">{math ? fmt(math.mcgPerUnit, 1) : '—'} <span className="text-sm text-white/50">mcg</span></p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/45 text-xs">Per 10 units (0.1 mL)</p>
              <p className="text-2xl font-bold text-white mt-1">{math ? fmt(math.mcgPerTen, 0) : '—'} <span className="text-sm text-white/50">mcg</span></p>
            </div>
          </div>

          {math?.unitsForTarget != null && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/45 text-xs">To draw {fmt(math.want, 0)} mcg</p>
              <p className="text-3xl font-black text-white mt-1">
                {fmt(math.unitsForTarget, 1)} <span className="text-base font-semibold text-white/50">units</span>
              </p>
              <p className="text-white/45 text-sm">{fmt(math.unitsForTarget / 100, 3)} mL on a U-100 syringe</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Amount by draw volume — U-100 syringe</h2>
          <p className="text-white/40 text-sm">100 units = 1 mL. Units are volume, not a dose.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/45">
                <th className="px-5 py-3 font-medium">Syringe units</th>
                <th className="px-5 py-3 font-medium">Volume</th>
                <th className="px-5 py-3 font-medium">Material drawn</th>
              </tr>
            </thead>
            <tbody>
              {DRAW_ROWS.map((row) => {
                const mcg = math ? math.mcgPerMl * row.ml : null;
                const mg = mcg != null ? mcg / 1000 : null;
                return (
                  <tr key={row.units} className="border-t border-white/5">
                    <td className="px-5 py-3 text-white font-medium">{row.units} units</td>
                    <td className="px-5 py-3 text-white/70">{row.ml.toFixed(2)} mL</td>
                    <td className="px-5 py-3 text-white">
                      {mcg != null ? `${fmt(mcg, mcg >= 100 ? 0 : 1)} mcg` : '—'}
                      {mg != null && mg >= 1 ? <span className="text-white/45"> · {fmt(mg, 2)} mg</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-white/40 max-w-3xl">
        Staff measurement reference only. Adding water does not change how much is in the vial — it only changes concentration.
        Ryan Kent, FNP-BC sets any dose after intake. Do not send these numbers to a patient as “your dose.”
      </p>
    </div>
  );
}
