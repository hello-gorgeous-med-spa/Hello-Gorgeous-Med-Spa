'use client';

import { useState } from 'react';

const CONCEPTS = [
  { q: "What does reconstitution actually mean?", a: "Dissolving a freeze-dried powder back into liquid so it can be measured. Most of these products ship as a dry powder or puck at the bottom of a sealed vial, because that's the only way they survive shipping and storage intact. Adding solvent turns it back into something measurable." },
  { q: "What does lyophilized mean?", a: "Freeze-dried. The solution is frozen and the water is drawn off under vacuum, leaving a stable dry powder that keeps for months instead of days. It's why the vial arrives looking like a white or off-white disc rather than a liquid — clients sometimes think something is wrong with it, and it's satisfying to be able to explain that it's the whole point." },
  { q: "Why can't it just ship as a liquid?", a: "Because peptides fall apart in solution. Heat, light and bacteria all degrade them, and a liquid product would lose potency in transit. Dry powder is a preservation strategy, not an inconvenience." },
  { q: "What is bacteriostatic water?", a: "Sterile water containing a small amount of benzyl alcohol as a preservative. The preservative inhibits bacterial growth, which is what allows a vial to be punctured more than once over a period of days or weeks without contaminating what's left. It's the standard solvent for this purpose." },
  { q: "Why not plain sterile water?", a: "Sterile water dissolves the powder perfectly well, but it has no preservative — so once the vial is punctured, anything introduced can grow. That's the difference: bacteriostatic water is what makes a multi-use vial defensible. Which solvent is appropriate for any given product is a pharmacy and provider decision, not a preference." },
  { q: "Does adding more water change how much peptide there is?", a: "No, and this is the single most common misunderstanding. The amount of peptide in the vial is fixed the moment it's manufactured. Solvent volume only changes the concentration — more water means a weaker solution and a larger volume to draw for the same amount; less water means the opposite. The arithmetic on this page is entirely about that relationship." },
  { q: "What do \"units\" mean on an insulin syringe?", a: "On a standard U-100 syringe, 100 units is one millilitre. So 50 units is 0.5 mL, 10 units is 0.1 mL, and so on. Units are just a volume scale printed on the barrel — they say nothing about how much of anything is in that volume. That's why concentration has to be known first." },
  { q: "How are reconstituted products stored?", a: "Refrigerated, away from light, and not frozen — freezing can damage the molecular structure. Stability windows vary by product and by solvent, and the specific window for anything we carry comes from the pharmacy's labeling and from Ryan, never from a general rule of thumb." }
];

const VIAL_PRESETS = [2, 5, 10, 15];
const WATER_PRESETS = [1, 2, 3, 5];
const TARGET_PRESETS = [100, 250, 500, 1000];

function trim(n: number, d: number): string {
  const s = n.toFixed(d);
  return s.indexOf(".") === -1 ? s : s.replace(/0+$/, "").replace(/\.$/, "");
}

export function ReconstitutionCalculator() {
  const [vialMg, setVialMg] = useState("5");
  const [waterMl, setWaterMl] = useState("2");
  const [targetMcg, setTargetMcg] = useState("250");
  const [openConcept, setOpenConcept] = useState<number | null>(null);

  const mg = parseFloat(vialMg);
  const ml = parseFloat(waterMl);
  const mcg = parseFloat(targetMcg);
  
  const okConc = isFinite(mg) && isFinite(ml) && mg > 0 && ml > 0;
  const cMg = okConc ? mg / ml : 0;
  const cMcg = cMg * 1000;
  const okVol = okConc && isFinite(mcg) && mcg > 0;
  const vol = okVol ? mcg / cMcg : 0;
  const units = vol * 100;

  const concMgDisplay = okConc ? trim(cMg, 3) : "—";
  const concMcgDisplay = okConc 
    ? `= ${trim(cMcg, 0)} mcg per mL · ${trim(cMcg / 100, 1)} mcg per unit` 
    : "Enter a vial size and a solvent volume";
  const volMlDisplay = okVol ? trim(vol, 3) : "—";
  const unitsDisplay = okVol ? trim(units, 1) : "—";
  const fillWidth = okVol ? `${Math.min(units, 100)}%` : "0%";
  
  const showWarn = okVol && (units > 100 || units < 2);
  const warnText = okVol && units > 100
    ? `That volume is ${trim(units, 1)} units — more than a single U-100 syringe holds. The arithmetic is fine; it just means the concentration and the amount don't fit one barrel.`
    : (okVol && units < 2 
      ? "Under 2 units. Volumes this small are hard to read on a barrel marked in whole units — worth noting when you're checking someone's math." 
      : "");

  const steps = okVol ? [
    { n: "1", label: "Peptide divided by solvent gives concentration", math: `${trim(mg, 3)} mg ÷ ${trim(ml, 3)} mL = ${trim(cMg, 3)} mg/mL` },
    { n: "2", label: "Same number in micrograms", math: `${trim(cMg, 3)} mg/mL × 1000 = ${trim(cMcg, 0)} mcg/mL` },
    { n: "3", label: "Amount divided by concentration gives volume", math: `${trim(mcg, 0)} mcg ÷ ${trim(cMcg, 0)} mcg/mL = ${trim(vol, 3)} mL` },
    { n: "4", label: "Volume expressed on a U-100 barrel", math: `${trim(vol, 3)} mL × 100 = ${trim(units, 1)} units` }
  ] : [
    { n: "1", label: "Peptide divided by solvent gives concentration", math: "mg ÷ mL = mg/mL" },
    { n: "2", label: "Same number in micrograms", math: "mg/mL × 1000 = mcg/mL" },
    { n: "3", label: "Amount divided by concentration gives volume", math: "mcg ÷ mcg/mL = mL" },
    { n: "4", label: "Volume expressed on a U-100 barrel", math: "mL × 100 = units" }
  ];

  const tickLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="space-y-8">
      {/* Hero / Intro */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <div className="text-[#FF92CC] text-xs font-bold tracking-[0.22em] uppercase mb-4">Unit conversion tool</div>
        <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Reconstitution math, worked out loud
        </h1>
        <p className="text-lg text-white/80 max-w-3xl mb-6">
          Powder plus solvent gives you a concentration. A concentration plus an amount gives you a volume. 
          That&apos;s all this does — arithmetic, shown step by step, so the numbers are never a mystery.
        </p>
        
        {/* Warning callout */}
        <div className="border-2 border-[#FFD700] bg-[rgba(255,215,0,0.06)] rounded-xl p-5 max-w-4xl">
          <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#FFD86B] mb-2">Read this before you touch it</div>
          <p className="text-[15px] leading-relaxed text-white/90">
            This is a math illustration, not a dose. Nothing on this page recommends an amount, a schedule or a preparation method. 
            Ryan determines every dose for every client after a medical screen — no one else on the team uses these outputs with a client, 
            and no number from this page goes into a conversation, a caption or a text message.
          </p>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-black/45 mb-8">What&apos;s in front of you</div>

          {/* Vial Input */}
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-bold">Peptide in the vial</span>
              <span className="text-sm text-black/50">milligrams</span>
            </div>
            <input
              type="number"
              step="any"
              min="0"
              value={vialMg}
              onChange={(e) => setVialMg(e.target.value)}
              className="w-full border-2 border-black rounded-xl px-5 py-4 text-2xl font-bold focus:border-[#FF2D8E] focus:outline-none transition-colors"
            />
            <div className="flex gap-2 flex-wrap mt-3">
              {VIAL_PRESETS.map((v) => {
                const isActive = parseFloat(vialMg) === v;
                return (
                  <button
                    key={v}
                    onClick={() => setVialMg(String(v))}
                    className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:border-[#FF2D8E]"
                    style={{
                      background: isActive ? '#000' : 'transparent',
                      color: isActive ? '#fff' : '#000',
                      borderColor: isActive ? '#000' : 'rgba(0,0,0,0.15)',
                    }}
                  >
                    {v} mg
                  </button>
                );
              })}
            </div>
          </div>

          {/* Water Input */}
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-bold">Bacteriostatic water added</span>
              <span className="text-sm text-black/50">millilitres</span>
            </div>
            <input
              type="number"
              step="any"
              min="0"
              value={waterMl}
              onChange={(e) => setWaterMl(e.target.value)}
              className="w-full border-2 border-black rounded-xl px-5 py-4 text-2xl font-bold focus:border-[#FF2D8E] focus:outline-none transition-colors"
            />
            <div className="flex gap-2 flex-wrap mt-3">
              {WATER_PRESETS.map((v) => {
                const isActive = parseFloat(waterMl) === v;
                return (
                  <button
                    key={v}
                    onClick={() => setWaterMl(String(v))}
                    className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:border-[#FF2D8E]"
                    style={{
                      background: isActive ? '#000' : 'transparent',
                      color: isActive ? '#fff' : '#000',
                      borderColor: isActive ? '#000' : 'rgba(0,0,0,0.15)',
                    }}
                  >
                    {v} mL
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-black/10 my-6" />

          {/* Target Input */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-bold">Amount you&apos;re converting</span>
              <span className="text-sm text-black/50">micrograms</span>
            </div>
            <input
              type="number"
              step="any"
              min="0"
              value={targetMcg}
              onChange={(e) => setTargetMcg(e.target.value)}
              className="w-full border-2 border-black rounded-xl px-5 py-4 text-2xl font-bold focus:border-[#FF2D8E] focus:outline-none transition-colors"
            />
            <div className="flex gap-2 flex-wrap mt-3">
              {TARGET_PRESETS.map((v) => {
                const isActive = parseFloat(targetMcg) === v;
                return (
                  <button
                    key={v}
                    onClick={() => setTargetMcg(String(v))}
                    className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:border-[#FF2D8E]"
                    style={{
                      background: isActive ? '#000' : 'transparent',
                      color: isActive ? '#fff' : '#000',
                      borderColor: isActive ? '#000' : 'rgba(0,0,0,0.15)',
                    }}
                  >
                    {v} mcg
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-black/50 mt-3">
              Round numbers for arithmetic, chosen because they&apos;re easy to divide — not because they&apos;re recommended amounts.
            </p>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-5">
          {/* Main Result Card */}
          <div className="rounded-3xl bg-black p-8">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF92CC] mb-6">The result</div>
            
            {/* Concentration */}
            <div className="mb-6">
              <div className="text-xs font-bold tracking-[0.14em] uppercase text-white/50 mb-2">Concentration</div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-5xl font-black text-[#FF2D8E]" style={{ fontFamily: 'Georgia, serif' }}>{concMgDisplay}</span>
                <span className="text-lg text-white/60">mg / mL</span>
              </div>
              <span className="text-[15px] text-white/55">{concMcgDisplay}</span>
            </div>

            <div className="h-px bg-white/15 my-6" />

            {/* Volume & Units */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold tracking-[0.14em] uppercase text-white/50 mb-2">Equivalent volume</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>{volMlDisplay}</span>
                  <span className="text-[15px] text-white/60">mL</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold tracking-[0.14em] uppercase text-white/50 mb-2">On a U-100 syringe</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>{unitsDisplay}</span>
                  <span className="text-[15px] text-white/60">units</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {showWarn && (
              <div className="mt-6 border-2 border-[#FFD700] bg-[rgba(255,215,0,0.1)] rounded-xl px-5 py-4 text-[15px] leading-relaxed text-[#FFD86B]">
                {warnText}
              </div>
            )}
          </div>

          {/* Syringe Visual */}
          <div className="rounded-3xl bg-white p-7 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/45">Insulin syringe · 100 units = 1 mL</span>
              <span className="text-sm font-bold text-[#FF2D8E]">{unitsDisplay} units</span>
            </div>
            
            <div className="relative h-11 border-2 border-black rounded-lg bg-white overflow-hidden">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[rgba(255,45,142,0.28)] border-r-2 border-[#FF2D8E] transition-all duration-300"
                style={{ width: fillWidth }}
              />
              <div className="absolute inset-0 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-black/15" />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              {tickLabels.map((n) => (
                <span key={n} className="text-xs font-semibold text-black/45">{n}</span>
              ))}
            </div>
            
            <p className="text-sm text-black/50 mt-4">
              Illustrative markings for the arithmetic above. Not a preparation or administration instruction.
            </p>
          </div>

          {/* Step-by-step */}
          <div className="rounded-3xl bg-white p-7 border-2 border-dashed border-black/20">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#E6007E] mb-4">The arithmetic, step by step</div>
            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-bold text-[#FF2D8E] w-5 flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>{s.n}</span>
                  <div>
                    <div className="text-[15px] text-black/60">{s.label}</div>
                    <div className="font-mono text-[15px] font-bold">{s.math}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concepts Accordion */}
      <div className="rounded-3xl bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-bold tracking-[0.22em] uppercase text-[#FF2D8E] mb-3">The concepts behind it</div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Why any of this is necessary</h2>
          <p className="text-black/70">Everyone on the team should be able to explain these. They come up constantly and none of them are clinical.</p>
        </div>
        
        <div className="space-y-3">
          {CONCEPTS.map((c, i) => {
            const isOpen = openConcept === i;
            return (
              <button
                key={i}
                onClick={() => setOpenConcept(isOpen ? null : i)}
                className="w-full text-left rounded-2xl p-6 border-2 transition-all hover:border-[#FF2D8E]"
                style={{ borderColor: isOpen ? '#FF2D8E' : '#000' }}
              >
                <div className="flex items-center justify-between gap-5">
                  <span className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{c.q}</span>
                  <span className="text-2xl font-bold text-[#FF2D8E] flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p className="mt-4 text-[17px] leading-relaxed text-black/80 max-w-4xl">{c.a}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Disclaimer */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#2d1020] p-8 border-4 border-black">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFD86B] mb-4">Full disclaimer</div>
        <p className="text-[15px] leading-relaxed text-white/70 max-w-5xl">
          Educational unit-conversion illustration only. This page is not medical advice, is not a dosing recommendation, 
          and is not an instruction for preparing or administering anything. Example amounts and syringe markings are chosen 
          for arithmetic clarity. Compounded medications are prepared and dispensed by licensed pharmacies; research-use-only 
          products are not approved for human treatment. At Hello Gorgeous Med Spa, every clinical decision — including 
          whether a product is appropriate, in what amount, and on what schedule — is made by Ryan Kent, NP following a 
          medical screen. Staff use of this page is limited to understanding the underlying arithmetic and vocabulary.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-black/50 py-4">
        RE GEN Academy by Hello Gorgeous Med Spa · 74 W. Washington Street, Oswego, IL 60543 · (630) 636-6193
        <br />
        Internal staff reference. Educational only — not medical, legal or financial advice, and not authorization to prescribe, dose, diagnose or treat.
      </div>
    </div>
  );
}
