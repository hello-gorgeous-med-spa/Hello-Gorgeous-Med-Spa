"use client";

import { useCallback, useMemo, useState } from "react";

import {
  AREA_LABELS,
  CONCERN_LABELS,
  FITZPATRICK_OPTIONS,
  MICRONEEDLING_INTELLIGENCE_PATH,
  MICRONEEDLING_TIERS,
  UNDERTONE_OPTIONS,
  type ExperienceLevel,
  type FitzpatrickType,
  type MicroneedlingConcern,
  type MicroneedlingPlan,
  type SkinUndertone,
  type TreatmentArea,
} from "@/data/microneedling-intelligence";

const BRAND = { pink: "#E6007E", hot: "#FF2D8E", soft: "#FFB8DC", navy: "#0a1628", plum: "#3E2B5E" };

type VisionResult = {
  suggested_concerns: MicroneedlingConcern[];
  suggested_fitzpatrick: FitzpatrickType | null;
  suggested_undertone: SkinUndertone | null;
  observations: string[];
  confidence: string;
};

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function MicroneedlingIntelligenceStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [fitzpatrick, setFitzpatrick] = useState<FitzpatrickType>("III");
  const [undertone, setUndertone] = useState<SkinUndertone>("neutral");
  const [concerns, setConcerns] = useState<MicroneedlingConcern[]>(["texture"]);
  const [areas, setAreas] = useState<TreatmentArea[]>(["face"]);
  const [experience, setExperience] = useState<ExperienceLevel>("first_time");
  const [useVision, setUseVision] = useState(true);

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [plan, setPlan] = useState<MicroneedlingPlan | null>(null);
  const [vision, setVision] = useState<VisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleConcern = (c: MicroneedlingConcern) => {
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const toggleArea = (a: TreatmentArea) => {
    setAreas((prev) => (prev.includes(a) ? (prev.length > 1 ? prev.filter((x) => x !== a) : prev) : [...prev, a]));
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setUploadError("Use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageSrc(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyze = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/microneedling/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fitzpatrick,
          undertone,
          concerns,
          areas,
          experience,
          image_base64: useVision ? imageBase64 : null,
          use_vision: useVision && !!imageBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Analysis failed.");
        return;
      }
      setPlan(data.plan);
      setVision(data.vision);
      if (data.vision?.suggested_fitzpatrick) setFitzpatrick(data.vision.suggested_fitzpatrick);
      if (data.vision?.suggested_undertone) setUndertone(data.vision.suggested_undertone);
      if (data.vision?.suggested_concerns?.length) {
        setConcerns((prev) => [...new Set([...prev, ...data.vision.suggested_concerns])]);
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error — try again.");
    }
  }, [areas, concerns, experience, fitzpatrick, imageBase64, undertone, useVision]);

  const intensityColor = useMemo(() => {
    if (!plan) return BRAND.pink;
    if (plan.intensity_direction === "conservative") return "#e63946";
    if (plan.intensity_direction === "aggressive_ok") return "#2d7a55";
    return BRAND.pink;
  }, [plan]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#1a2230]">
      <header className="border-b-4 border-black bg-[#0a1628] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-6 md:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">Internal · Chairside only</p>
            <h1 className="font-serif text-3xl md:text-4xl">
              Microneedling <span className="text-[#FFB8DC]">Intelligence</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Upload a photo → get tier, serum, device path, depth guidance, and what to offer. Built from HG microneedling menu + skin-type logic.
            </p>
          </div>
          <a
            href="/handouts/education/microneedling-selection-cheatsheet.html"
            className="rounded-full border-2 border-white/30 px-4 py-2 text-sm font-bold hover:border-[#FFB8DC]"
          >
            Printable cheat sheet
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1fr_1.1fr] md:px-6">
        {/* Intake */}
        <div className="space-y-5">
          <section className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <h2 className="text-lg font-black">1 · Upload photo</h2>
            <p className="mt-1 text-sm text-black/60">Front-facing, neutral light, no makeup if possible.</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/20 bg-[#FFF0F7] px-4 py-8 hover:border-[#E6007E]">
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFile} />
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc} alt="Uploaded client reference" className="max-h-48 rounded-xl object-contain" />
              ) : (
                <span className="text-sm font-semibold text-[#E6007E]">Tap to upload · JPG / PNG</span>
              )}
            </label>
            {uploadError ? <p className="mt-2 text-sm text-red-600">{uploadError}</p> : null}
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useVision} onChange={(e) => setUseVision(e.target.checked)} />
              AI photo scan (suggest concerns + Fitzpatrick hints)
            </label>
          </section>

          <section className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <h2 className="text-lg font-black">2 · Skin profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/50">Fitzpatrick</p>
                <select
                  value={fitzpatrick}
                  onChange={(e) => setFitzpatrick(e.target.value as FitzpatrickType)}
                  className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm"
                >
                  {FITZPATRICK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/50">Undertone</p>
                <select
                  value={undertone}
                  onChange={(e) => setUndertone(e.target.value as SkinUndertone)}
                  className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm"
                >
                  {UNDERTONE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-3 rounded-lg border-l-4 border-[#E6007E] bg-[#FFF0F7] px-3 py-2 text-xs text-black/75">
              {UNDERTONE_OPTIONS.find((u) => u.value === undertone)?.healShift}
            </p>
          </section>

          <section className="rounded-3xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <h2 className="text-lg font-black">3 · Concerns & areas</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(CONCERN_LABELS) as MicroneedlingConcern[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleConcern(c)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
                    concerns.includes(c) ? "border-[#E6007E] bg-[#E6007E] text-white" : "border-black/15 bg-white"
                  }`}
                >
                  {CONCERN_LABELS[c]}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-black/50">Treatment areas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(AREA_LABELS) as TreatmentArea[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArea(a)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${
                    areas.includes(a) ? "border-[#3E2B5E] bg-[#3E2B5E] text-white" : "border-black/15"
                  }`}
                >
                  {AREA_LABELS[a]}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-black/50">Experience</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["first_time", "First time"],
                  ["returning", "Returning"],
                  ["maintenance", "Maintenance"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setExperience(val)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${
                    experience === val ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/15"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={() => void analyze()}
            disabled={status === "loading" || areas.length === 0}
            className="w-full rounded-2xl border-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-4 text-lg font-black text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {status === "loading" ? "Analyzing…" : "Generate treatment plan"}
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        {/* Results */}
        <div className="space-y-5">
          {!plan ? (
            <div className="rounded-3xl border-4 border-dashed border-black/20 bg-white p-10 text-center text-black/50">
              <p className="text-lg font-bold">Your chairside plan appears here</p>
              <p className="mt-2 text-sm">Tier · serum · device · depth · offers · watch-fors</p>
            </div>
          ) : (
            <>
              {vision ? (
                <div className="rounded-2xl border border-[#2a9d8f]/40 bg-[#e7f5f3] p-4 text-sm">
                  <p className="font-bold text-[#2a9d8f]">AI photo scan ({vision.confidence} confidence)</p>
                  <ul className="mt-2 list-disc pl-5 text-black/80">
                    {vision.observations.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <article className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="bg-[#0a1628] px-5 py-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFB8DC]">Recommended tier</p>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="rounded bg-[#E6007E] px-2 py-0.5 font-black">{plan.tier.label}</span>
                    <h3 className="text-2xl font-black">{plan.tier.name}</h3>
                    <span className="text-[#FFB8DC] font-bold">{plan.tier.price}</span>
                  </div>
                </div>
                <div className="space-y-4 p-5 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase text-black/45">Serum protocol</p>
                    <p className="font-bold text-[#0a1628]">{plan.serum_protocol}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black/45">Device track</p>
                    <p className="font-bold">{plan.device_track === "rf_morpheus8" ? "RF Morpheus8 path" : "Classic microneedling pen"}</p>
                    <p className="text-black/75">{plan.device_rationale}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-black/10 bg-[#fafbfd] p-3">
                      <p className="text-xs font-bold uppercase text-black/45">Depth guidance</p>
                      <p>{plan.depth_guidance}</p>
                    </div>
                    <div className="rounded-xl border border-black/10 bg-[#fafbfd] p-3">
                      <p className="text-xs font-bold uppercase text-black/45">Session plan</p>
                      <p>{plan.session_plan}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border-l-4 p-3" style={{ borderColor: intensityColor, background: "#fff8ef" }}>
                    <p className="text-xs font-bold uppercase" style={{ color: intensityColor }}>
                      Intensity · {plan.intensity_direction}
                    </p>
                    <p className="mt-1">{plan.intensity_note}</p>
                  </div>
                </div>
              </article>

              <section className="rounded-3xl border-4 border-black bg-white p-5">
                <h3 className="font-black text-[#E6007E]">What to offer</h3>
                <ul className="mt-3 space-y-3">
                  {plan.offers.map((o) => (
                    <li key={o.id} className="rounded-xl border border-black/10 p-3">
                      <p className="font-bold">{o.title}{o.priceHint ? ` · ${o.priceHint}` : ""}</p>
                      <p className="text-sm text-black/70">{o.rationale}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border-4 border-black bg-white p-5">
                <h3 className="font-black text-[#7b2d8b]">Watch for (chairside)</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {plan.watch_fors.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="text-[#E6007E]">▸</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border-4 border-black bg-[#fdeced] p-5">
                <h3 className="font-black text-[#e63946]">Screen before treating</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {plan.screen_before_treating.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border-4 border-black bg-[#0a1628] p-5 text-white">
                <h3 className="font-black text-[#FFB8DC]">Client conversation starter</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{plan.client_summary}</p>
                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/50">{plan.confidence_message}</p>
              </section>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(MICRONEEDLING_TIERS) as Array<keyof typeof MICRONEEDLING_TIERS>).map((id) => (
                  <span
                    key={id}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      plan.recommended_tier === id ? "bg-[#E6007E] text-white" : "bg-black/10 text-black/50"
                    }`}
                  >
                    {MICRONEEDLING_TIERS[id].label}: {MICRONEEDLING_TIERS[id].name}
                  </span>
                ))}
              </div>
            </>
          )}

          <p className="text-xs text-black/45">
            Route: <code className="rounded bg-black/5 px-1">{MICRONEEDLING_INTELLIGENCE_PATH}</code> · Internal only ·
            Provider confirms all clinical decisions
          </p>
        </div>
      </div>
    </div>
  );
}
