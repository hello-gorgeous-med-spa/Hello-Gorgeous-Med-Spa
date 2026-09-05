'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0f172a',
};

// Common medication presets
const MEDICATION_PRESETS = [
  { 
    name: 'Semaglutide 12.5mg/mL', 
    concentration: 12.5, 
    vialVolume: 3, 
    costPerVial: 40,
    typicalDoses: [0.25, 0.5, 1.0, 1.7, 2.4],
    unit: 'mg',
  },
  { 
    name: 'Semaglutide 5mg/mL', 
    concentration: 5, 
    vialVolume: 2, 
    costPerVial: 35,
    typicalDoses: [0.25, 0.5, 1.0],
    unit: 'mg',
  },
  { 
    name: 'Tirzepatide 12.5mg/mL (Formulation 1mL)', 
    concentration: 12.5, 
    vialVolume: 1, 
    costPerVial: 40,
    typicalDoses: [2.5, 5.0, 7.5, 10.0, 12.5, 15.0],
    unit: 'mg',
  },
  { 
    name: 'Tirzepatide 30mg/mL', 
    concentration: 30, 
    vialVolume: 2, 
    costPerVial: 95,
    typicalDoses: [2.5, 5.0, 7.5, 10.0, 12.5, 15.0],
    unit: 'mg',
  },
  { 
    name: 'Tirzepatide 60mg/mL', 
    concentration: 60, 
    vialVolume: 2, 
    costPerVial: 150,
    typicalDoses: [5.0, 7.5, 10.0, 12.5, 15.0],
    unit: 'mg',
  },
  { 
    name: 'Testosterone Cypionate 200mg/mL', 
    concentration: 200, 
    vialVolume: 10, 
    costPerVial: 45,
    typicalDoses: [100, 150, 200],
    unit: 'mg',
  },
  { 
    name: 'BPC-157 5mg/vial', 
    concentration: 5, 
    vialVolume: 1, 
    costPerVial: 65,
    typicalDoses: [0.25, 0.5],
    unit: 'mg',
  },
  { 
    name: 'Custom', 
    concentration: 0, 
    vialVolume: 0, 
    costPerVial: 0,
    typicalDoses: [],
    unit: 'mg',
  },
];

export default function DosingCalculatorPage() {
  const [selectedPreset, setSelectedPreset] = useState(MEDICATION_PRESETS[0]);
  const [customMode, setCustomMode] = useState(false);
  
  // Calculator inputs
  const [concentration, setConcentration] = useState(12.5); // mg per mL
  const [vialVolume, setVialVolume] = useState(3); // mL per vial
  const [costPerVial, setCostPerVial] = useState(40); // $ per vial
  const [weeklyDose, setWeeklyDose] = useState(1.0); // mg per week
  const [treatmentWeeks, setTreatmentWeeks] = useState(12); // weeks of treatment
  const [wastageBuffer, setWastageFactor] = useState(10); // % extra for wastage
  
  // Retail pricing
  const [patientMonthlyPrice, setPatientMonthlyPrice] = useState(299);

  // Select preset
  const handlePresetSelect = (preset: typeof MEDICATION_PRESETS[0]) => {
    setSelectedPreset(preset);
    if (preset.name === 'Custom') {
      setCustomMode(true);
    } else {
      setCustomMode(false);
      setConcentration(preset.concentration);
      setVialVolume(preset.vialVolume);
      setCostPerVial(preset.costPerVial);
      if (preset.typicalDoses.length > 0) {
        setWeeklyDose(preset.typicalDoses[0]);
      }
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    if (concentration <= 0 || vialVolume <= 0 || weeklyDose <= 0) {
      return null;
    }

    // How much medication per vial
    const mgPerVial = concentration * vialVolume;
    
    // Weekly consumption in mL
    const mlPerWeek = weeklyDose / concentration;
    
    // How many weeks does one vial last?
    const weeksPerVial = mgPerVial / weeklyDose;
    
    // Total mg needed for treatment
    const totalMgNeeded = weeklyDose * treatmentWeeks;
    
    // Vials needed (with wastage buffer)
    const vialsNeededExact = totalMgNeeded / mgPerVial;
    const vialsWithWastage = vialsNeededExact * (1 + wastageBuffer / 100);
    const vialsToOrder = Math.ceil(vialsWithWastage);
    
    // Cost calculations
    const totalCost = vialsToOrder * costPerVial;
    const costPerWeek = totalCost / treatmentWeeks;
    const costPerMonth = costPerWeek * 4.33;
    
    // Patient pricing (if applicable)
    const revenuePerMonth = patientMonthlyPrice;
    const months = treatmentWeeks / 4.33;
    const totalRevenue = revenuePerMonth * months;
    const profitPerMonth = revenuePerMonth - costPerMonth;
    const profitMargin = ((revenuePerMonth - costPerMonth) / revenuePerMonth) * 100;
    
    // Supply info
    const daysSupply = weeksPerVial * 7 * vialsToOrder;

    return {
      mgPerVial,
      mlPerWeek: mlPerWeek.toFixed(3),
      weeksPerVial: weeksPerVial.toFixed(1),
      totalMgNeeded: totalMgNeeded.toFixed(1),
      vialsNeededExact: vialsNeededExact.toFixed(2),
      vialsToOrder,
      totalCost: totalCost.toFixed(2),
      costPerWeek: costPerWeek.toFixed(2),
      costPerMonth: costPerMonth.toFixed(2),
      daysSupply: Math.round(daysSupply),
      // Profit calculations
      revenuePerMonth,
      totalRevenue: totalRevenue.toFixed(2),
      profitPerMonth: profitPerMonth.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
    };
  }, [concentration, vialVolume, costPerVial, weeklyDose, treatmentWeeks, wastageBuffer, patientMonthlyPrice]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dosing Calculator</h1>
          <p className="text-white/60">Calculate vials needed, costs, and profit margins</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/ops/reconstitution"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
          >
            Reconstitution →
          </Link>
          <Link
            href="/ops/analytics"
            className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Medication Presets */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Select Medication</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {MEDICATION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                selectedPreset.name === preset.name
                  ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                  : 'hover:bg-white/10'
              }`}
              style={{
                backgroundColor: selectedPreset.name === preset.name ? `${BRAND.teal}30` : 'rgba(255,255,255,0.05)',
                color: selectedPreset.name === preset.name ? BRAND.teal : 'white',
                ringColor: BRAND.teal,
              }}
            >
              {preset.name.split(' ')[0]}
              {preset.name !== 'Custom' && (
                <span className="block text-xs opacity-60 mt-1">
                  {preset.concentration}mg/mL
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-6">📊 Calculator Inputs</h2>
          
          <div className="space-y-5">
            {/* Concentration */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Concentration (mg per mL)
              </label>
              <input
                type="number"
                value={concentration}
                onChange={(e) => setConcentration(parseFloat(e.target.value) || 0)}
                step="0.5"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
                style={{ focusRingColor: BRAND.teal }}
              />
              <p className="text-xs text-white/40 mt-1">e.g., 12.5mg/mL means 12.5mg of medication per 1mL of liquid</p>
            </div>

            {/* Vial Volume */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Vial Volume (mL per vial)
              </label>
              <input
                type="number"
                value={vialVolume}
                onChange={(e) => setVialVolume(parseFloat(e.target.value) || 0)}
                step="0.5"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
              />
            </div>

            {/* Cost per Vial */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Formulation Rx Cost ($ per vial)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  value={costPerVial}
                  onChange={(e) => setCostPerVial(parseFloat(e.target.value) || 0)}
                  step="5"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Weekly Dose */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Weekly Dose (mg per week)
              </label>
              <input
                type="number"
                value={weeklyDose}
                onChange={(e) => setWeeklyDose(parseFloat(e.target.value) || 0)}
                step="0.25"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
              />
              {selectedPreset.typicalDoses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPreset.typicalDoses.map((dose) => (
                    <button
                      key={dose}
                      onClick={() => setWeeklyDose(dose)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        weeklyDose === dose ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {dose}mg
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment Duration */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Treatment Duration (weeks)
              </label>
              <input
                type="number"
                value={treatmentWeeks}
                onChange={(e) => setTreatmentWeeks(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
              />
              <div className="flex gap-2 mt-2">
                {[4, 8, 12, 24, 52].map((weeks) => (
                  <button
                    key={weeks}
                    onClick={() => setTreatmentWeeks(weeks)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      treatmentWeeks === weeks ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {weeks}w
                  </button>
                ))}
              </div>
            </div>

            {/* Wastage Buffer */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Wastage Buffer (%)
              </label>
              <input
                type="number"
                value={wastageBuffer}
                onChange={(e) => setWastageFactor(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
              />
              <p className="text-xs text-white/40 mt-1">Account for dead space in syringes, spills, etc.</p>
            </div>

            {/* Patient Monthly Price */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Patient Monthly Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  value={patientMonthlyPrice}
                  onChange={(e) => setPatientMonthlyPrice(parseFloat(e.target.value) || 0)}
                  step="25"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-semibold focus:outline-none focus:ring-2"
                />
              </div>
              <p className="text-xs text-white/40 mt-1">What you charge the patient per month</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {calculations ? (
            <>
              {/* Vials to Order - Big Display */}
              <div 
                className="rounded-2xl p-8 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${BRAND.teal}30 0%, ${BRAND.pink}20 100%)`,
                  border: `2px solid ${BRAND.teal}`,
                }}
              >
                <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Vials to Order</p>
                <p className="text-7xl font-black text-white mb-2">{calculations.vialsToOrder}</p>
                <p className="text-white/60">
                  ({calculations.vialsNeededExact} exact + {wastageBuffer}% buffer)
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider">Total Cost</p>
                  <p className="text-2xl font-bold text-white">${calculations.totalCost}</p>
                  <p className="text-sm text-white/40">for {treatmentWeeks} weeks</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider">Cost/Month</p>
                  <p className="text-2xl font-bold text-white">${calculations.costPerMonth}</p>
                  <p className="text-sm text-white/40">your cost</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider">Days Supply</p>
                  <p className="text-2xl font-bold text-white">{calculations.daysSupply}</p>
                  <p className="text-sm text-white/40">total days</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider">Weeks/Vial</p>
                  <p className="text-2xl font-bold text-white">{calculations.weeksPerVial}</p>
                  <p className="text-sm text-white/40">at this dose</p>
                </div>
              </div>

              {/* Profit Analysis */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">💰 Profit Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Patient Pays (Monthly)</span>
                    <span className="text-xl font-bold text-white">${calculations.revenuePerMonth}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Your Cost (Monthly)</span>
                    <span className="text-xl font-bold text-red-400">-${calculations.costPerMonth}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80 font-medium">Profit/Month</span>
                    <span className="text-2xl font-black" style={{ color: BRAND.teal }}>
                      ${calculations.profitPerMonth}
                    </span>
                  </div>
                  <div 
                    className="mt-4 p-4 rounded-xl text-center"
                    style={{ backgroundColor: `${BRAND.teal}20` }}
                  >
                    <p className="text-sm text-white/60">Profit Margin</p>
                    <p className="text-4xl font-black" style={{ color: BRAND.teal }}>
                      {calculations.profitMargin}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">📋 Detailed Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Medication per vial</span>
                    <span className="text-white">{calculations.mgPerVial}mg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Volume per dose</span>
                    <span className="text-white">{calculations.mlPerWeek}mL/week</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Total medication needed</span>
                    <span className="text-white">{calculations.totalMgNeeded}mg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Cost per week</span>
                    <span className="text-white">${calculations.costPerWeek}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white/50">Total revenue</span>
                    <span className="text-white">${calculations.totalRevenue}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <p className="text-white/40">Enter valid values to see calculations</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">📚 Quick Reference: Common Dosing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-3 px-4 text-white/50 font-medium">Medication</th>
                <th className="py-3 px-4 text-white/50 font-medium">Starting Dose</th>
                <th className="py-3 px-4 text-white/50 font-medium">Maintenance</th>
                <th className="py-3 px-4 text-white/50 font-medium">Max Dose</th>
                <th className="py-3 px-4 text-white/50 font-medium">Titration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-medium">Semaglutide</td>
                <td className="py-3 px-4 text-white/70">0.25mg/wk</td>
                <td className="py-3 px-4 text-white/70">1.0mg/wk</td>
                <td className="py-3 px-4 text-white/70">2.4mg/wk</td>
                <td className="py-3 px-4 text-white/70">Q4 weeks</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-medium">Tirzepatide</td>
                <td className="py-3 px-4 text-white/70">2.5mg/wk</td>
                <td className="py-3 px-4 text-white/70">10mg/wk</td>
                <td className="py-3 px-4 text-white/70">15mg/wk</td>
                <td className="py-3 px-4 text-white/70">Q4 weeks</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-medium">Testosterone Cypionate</td>
                <td className="py-3 px-4 text-white/70">100mg/wk</td>
                <td className="py-3 px-4 text-white/70">150mg/wk</td>
                <td className="py-3 px-4 text-white/70">200mg/wk</td>
                <td className="py-3 px-4 text-white/70">Per labs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">BPC-157</td>
                <td className="py-3 px-4 text-white/70">250mcg/day</td>
                <td className="py-3 px-4 text-white/70">250-500mcg/day</td>
                <td className="py-3 px-4 text-white/70">500mcg 2x/day</td>
                <td className="py-3 px-4 text-white/70">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
