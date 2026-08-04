"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BUILD_YOUR_PROPOSAL_MARKETING,
} from "@/lib/build-your-proposal-marketing";
import { packageToProposalService, PROPOSAL_PACKAGES } from "@/lib/proposals/packages";
import { HELLO_GORGEOUS_SERVICES, type SeedService } from "@/lib/proposals/seed-services";
import {
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_MENU,
  type PeptideRetailCategory,
} from "@/lib/peptide-retail-pricing";
import {
  autoGenerateOptions,
  calculateSubtotal,
  calculateTotal,
  defaultQuantityForService,
  filterRxOnly,
  formatProposalServiceLine,
  hasRxConsultServices,
  isPerUnitService,
  NEUROTOXIN_UNIT_PRESETS,
  serviceLineTotal,
  type ProposalService,
} from "@/lib/proposals/utils";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { VitaminInjectionCheatSheet } from "@/components/proposals/VitaminInjectionCheatSheet";
import {
  EXOSOME_HEALING_ADDON,
  VITAMIN_B4G2_OFFER_BLURB,
  VITAMIN_TREATMENT_PLANS,
} from "@/lib/proposals/vitamin-injections";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

const CONCERN_OPTIONS = [
  { id: "wrinkles", label: "Fine lines / Wrinkles", icon: "✨" },
  { id: "laxity", label: "Skin laxity", icon: "🎯" },
  { id: "scars", label: "Acne scars", icon: "💎" },
  { id: "pigmentation", label: "Pigmentation", icon: "🌟" },
  { id: "body", label: "Body contouring", icon: "🔥" },
  { id: "weight", label: "Weight loss", icon: "⚡" },
  { id: "hair", label: "Hair restoration", icon: "🌱" },
];

const STEPS = [
  { id: "goals", label: "Goals", short: "Goals" },
  { id: "treatments", label: "Treatments", short: "Treatments" },
  { id: "review", label: "Review", short: "Review" },
  { id: "submit", label: "Submit", short: "Submit" },
] as const;

type StepId = typeof STEPS[number]["id"];

const POPULAR_SERVICE_IDS = [
  "botox", "dysport", "jeuveau", "lip-flip",
  "dermal-filler", "lip-filler", "filler-half-syringe",
  "morpheus8-face", "morpheus8-3pack",
  "solaria-co2-full", "quantum-rf-neck-pkg", "quantum-rf-abdomen-pkg",
  "hydrafacial-glow-special", "hydrafacial",
  "microneedling-ha", "baby-tox-luxe", "prp-facial",
  "laser-hair-listed-area",
  "iv-new-client-intro", "vitamin-plan-1mo",
  "exosomes-healing-addon", "flowwave-intro",
];

const PEPTIDE_CATEGORY_ORDER: PeptideRetailCategory[] = [
  "Recovery & Healing", "Hormone & GH Support", "Energy & Longevity",
  "Skin & Aesthetics", "Intimacy & Vitality", "Blends & Support",
];

const SERVICE_CATEGORIES = [
  { id: "packages", label: "Signature Packages", filter: (s: SeedService) => s.category === "Packages" || s.id.startsWith("pkg-") },
  { id: "injectables", label: "Injectables", filter: (s: SeedService) => ["Neurotoxins", "Dermal Fillers"].includes(s.category) },
  { id: "skin", label: "Skin Treatments", filter: (s: SeedService) => ["Morpheus8", "Laser Skin", "Facials"].includes(s.category) },
  { id: "weight", label: "Weight Loss", filter: (s: SeedService) => s.category === "Weight Loss Programs" },
  { id: "peptides", label: "Peptides", filter: (s: SeedService) => s.category === "Peptides" },
  { id: "vitamins", label: "Vitamin Injections", filter: (s: SeedService) => s.category === "Vitamin Injections" },
] as const;

const M = BUILD_YOUR_PROPOSAL_MARKETING;

export function ProposalBuilderWizard() {
  const [step, setStep] = useState<StepId>("goals");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<ProposalService[]>([]);
  const [activeCategory, setActiveCategory] = useState("packages");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const popularServices = useMemo(
    () => POPULAR_SERVICE_IDS.map((id) => HELLO_GORGEOUS_SERVICES.find((s) => s.id === id)).filter((s): s is SeedService => Boolean(s)),
    []
  );

  const packageServices = useMemo(
    () => [...PROPOSAL_PACKAGES.map(packageToProposalService)],
    []
  );

  const categoryServices = useMemo(() => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === activeCategory);
    if (!cat) return [];
    if (activeCategory === "packages") return packageServices;
    return HELLO_GORGEOUS_SERVICES.filter(cat.filter);
  }, [activeCategory, packageServices]);

  const peptideServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((s) => s.category === "Peptides"),
    []
  );

  const peptideGroups = useMemo(() => {
    const specials = peptideServices.filter(
      (s) => s.id === "peptide-consult" || s.id.startsWith("ghk-cu-formulation") || s.id === "peptide-shipping"
    );
    const groups: Array<{ label: string; services: SeedService[] }> = [
      { label: "Consult & Formulation", services: specials },
    ];
    for (const category of PEPTIDE_CATEGORY_ORDER) {
      const ids = new Set(
        PEPTIDE_RETAIL_MENU.filter((r) => r.category === category).map((r) => `peptide-${r.id}`)
      );
      const services = peptideServices.filter((s) => ids.has(s.id));
      if (services.length) groups.push({ label: category, services });
    }
    return groups;
  }, [peptideServices]);

  const options = useMemo(
    () => (selectedServices.length ? autoGenerateOptions(selectedServices) : []),
    [selectedServices]
  );

  const rxServices = useMemo(() => filterRxOnly(selectedServices), [selectedServices]);
  const hasRxItems = rxServices.length > 0;

  const toggleConcern = (concernId: string) => {
    setConcerns((prev) =>
      prev.includes(concernId) ? prev.filter((c) => c !== concernId) : [...prev, concernId]
    );
  };

  const upsertService = (service: SeedService | ProposalService) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s.id === service.id)) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, { ...service, quantity: defaultQuantityForService(service) }];
    });
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((item) =>
        item.id === serviceId
          ? { ...item, quantity: Math.max(1, Math.min(500, Math.round(quantity) || 1)) }
          : item
      )
    );
  };

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/public/build-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          concerns: concerns.map((id) => CONCERN_OPTIONS.find((c) => c.id === id)?.label || id),
          notes: notes.trim(),
          consent,
          hp,
          services: selectedServices.map((s) => ({ id: s.id, quantity: s.quantity })),
          hasRxItems,
        }),
      });
      const text = await response.text();
      const data = text.trim() ? (JSON.parse(text) as Record<string, unknown>) : {};
      if (!response.ok) throw new Error(String(data.error || "Could not save your proposal."));
      setSuccessUrl(String(data.proposalUrl || ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successUrl) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
        <div
          className="px-6 py-8 md:px-10 md:py-10"
          style={{
            background: "radial-gradient(ellipse 70% 80% at 85% 20%, rgba(230,0,126,0.35), transparent 55%), linear-gradient(125deg, #1a0a12 0%, #2d1020 45%, #0a0a0a 100%)",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">Proposal saved</span>
          </div>
          <h2 className="mt-4 text-3xl font-medium text-white md:text-4xl" style={{ fontFamily: SERIF }}>
            Your proposal is{" "}
            <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
              ready
            </span>
          </h2>
          {hasRxItems ? (
            <div className="mt-4 rounded-xl border border-amber-400/50 bg-amber-950/30 p-4">
              <p className="text-sm font-bold text-amber-200">Consultation required for RX items</p>
              <p className="mt-1 text-sm text-amber-100/80">
                Your selection includes prescription items. Our nurse practitioner will review your goals and confirm eligibility at your visit.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/75">
              We saved your plan and notified our team. Review it anytime or apply for Cherry financing.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={successUrl}
              className="inline-flex rounded-full border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000]"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              View my proposal
            </a>
            {hasRxItems ? (
              <Link href="/book" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black">
                Book consult now
              </Link>
            ) : (
              <a href={CHERRY_PAY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black">
                Apply with Cherry
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* Main wizard panel */}
      <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.3)]">
        {/* Progress header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-4 md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1 text-xl font-medium text-white md:text-2xl" style={{ fontFamily: SERIF }}>
              {STEPS[stepIndex].label}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">Live estimate</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-3 md:px-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-black/50">
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                    i <= stepIndex ? "bg-[#E6007E] text-white" : "bg-black/10 text-black/50"
                  }`}
                >
                  {s.short}
                </button>
              ))}
            </div>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${HOT}, ${PINK})` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="p-5 md:p-8">
          {/* STEP 1: Goals */}
          {step === "goals" && (
            <div>
              <p className="text-sm text-black/70 mb-4">Select your primary concerns — we&apos;ll suggest relevant treatments.</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {CONCERN_OPTIONS.map((concern) => {
                  const active = concerns.includes(concern.id);
                  return (
                    <li key={concern.id}>
                      <button
                        type="button"
                        onClick={() => toggleConcern(concern.id)}
                        className={`flex h-full w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition ${
                          active
                            ? "border-black bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                            : "border-black/10 bg-white hover:border-[#E6007E]"
                        }`}
                      >
                        <span className="text-2xl">{concern.icon}</span>
                        <span className="font-bold text-black">{concern.label}</span>
                        {active && <span className="ml-auto text-[#E6007E] font-bold">✓</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                >
                  Continue to treatments →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Treatments */}
          {step === "treatments" && (
            <div>
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-black/10 pb-4">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      activeCategory === cat.id
                        ? "bg-black text-white"
                        : "border border-black/20 text-black hover:border-black"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Services grid */}
              {activeCategory === "peptides" ? (
                <div className="space-y-6">
                  <p className="text-xs text-black/50">{PEPTIDE_PRICING_DISCLAIMER}</p>
                  {peptideGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-black/45 mb-3">{group.label}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {group.services.map((service) => {
                          const selected = selectedServices.some((s) => s.id === service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => upsertService(service)}
                              className={`rounded-xl border-2 p-3 text-left transition ${
                                selected ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/10 hover:border-[#E6007E]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-bold text-black">{service.name}</p>
                                <span className="shrink-0 text-sm font-black text-[#E6007E]">${service.price}</span>
                              </div>
                              <p className="mt-0.5 text-[10px] font-semibold uppercase text-black/45">{service.unit}</p>
                              {selected && <p className="mt-2 text-[11px] font-bold text-[#E6007E]">Added ✓</p>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryServices.map((service) => {
                    const selected = selectedServices.find((s) => s.id === service.id);
                    const perUnit = isPerUnitService(service);
                    return (
                      <div
                        key={service.id}
                        className={`rounded-xl border-2 p-4 transition ${
                          selected ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/10 hover:border-[#E6007E]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-bold text-black">{service.name}</p>
                            <p className="text-xs text-black/60 mt-0.5">
                              ${service.price} {service.unit}
                            </p>
                            {service.description && (
                              <p className="text-xs text-black/50 mt-1 line-clamp-2">{service.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => upsertService(service)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              selected ? "bg-black text-white" : "bg-[#E6007E] text-white"
                            }`}
                          >
                            {selected ? "Remove" : "Add"}
                          </button>
                        </div>
                        {selected && perUnit && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/10 pt-3">
                            <span className="text-xs text-black/60">Units:</span>
                            {NEUROTOXIN_UNIT_PRESETS.map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => updateQuantity(service.id, preset)}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  selected.quantity === preset ? "bg-[#E6007E] text-white" : "border border-black/20 text-black"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                            <input
                              type="number"
                              min={1}
                              value={selected.quantity}
                              onChange={(e) => updateQuantity(service.id, Number(e.target.value))}
                              className="w-16 rounded-md border border-black/20 px-2 py-1 text-sm"
                              aria-label={`${service.name} units`}
                            />
                            <span className="text-xs font-bold text-[#E6007E]">
                              = ${serviceLineTotal(selected).toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <button type="button" onClick={prevStep} className="text-sm font-medium text-black/55 hover:text-black">
                  ← Back to goals
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedServices.length}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                >
                  Review your plan →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === "review" && (
            <div>
              {hasRxItems && (
                <div className="mb-6 rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-800">⚠️ Consultation required</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Your selection includes RX items: {rxServices.map((s) => s.name).join(", ")}. Medical eligibility confirmed at consult.
                  </p>
                </div>
              )}

              {options.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  {options.map((option, index) => (
                    <article
                      key={option.name}
                      className={`rounded-2xl border-2 p-4 ${
                        index === 1 ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-black">{option.name}</h3>
                        {index === 1 && (
                          <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold text-white">
                            Popular
                          </span>
                        )}
                      </div>
                      <ul className="mt-3 space-y-1 text-xs text-black/75">
                        {option.services.slice(0, 5).map((s) => (
                          <li key={`${option.name}-${s.id}`}>{formatProposalServiceLine(s)}</li>
                        ))}
                        {option.services.length > 5 && (
                          <li className="text-black/50">+{option.services.length - 5} more</li>
                        )}
                      </ul>
                      <p className="mt-4 text-2xl font-black text-[#E6007E]">
                        ${calculateTotal(option).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-3">
                <button type="button" onClick={prevStep} className="text-sm font-medium text-black/55 hover:text-black">
                  ← Edit treatments
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                >
                  Continue to submit →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Submit */}
          {step === "submit" && (
            <div>
              <p className="text-sm text-black/70 mb-4">
                We&apos;ll save your shareable plan and notify our team so we can confirm medical fit and book you.
              </p>
              <div className="grid gap-3 md:grid-cols-3 mb-4">
                <input
                  className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm focus:border-[#E6007E] focus:outline-none"
                  placeholder="Full name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm focus:border-[#E6007E] focus:outline-none"
                  placeholder="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm focus:border-[#E6007E] focus:outline-none"
                  placeholder="Phone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <textarea
                className="w-full rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm focus:border-[#E6007E] focus:outline-none"
                rows={3}
                placeholder="Anything else we should know? (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <input
                type="text"
                name="company"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              <label className="mt-4 flex items-start gap-2 text-sm text-black/80">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I understand this is an educational estimate only. Final pricing and medical eligibility are confirmed at a Hello Gorgeous consult.
                </span>
              </label>
              {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <button type="button" onClick={prevStep} className="text-sm font-medium text-black/55 hover:text-black">
                  ← Back to review
                </button>
                <button
                  type="button"
                  disabled={submitting || !selectedServices.length || !clientName || !email || !phone || !consent}
                  onClick={() => void submit()}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                >
                  {submitting ? "Saving…" : "Save & send my proposal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live estimate sidebar (dark instrument panel) */}
      <aside className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] shadow-[10px_10px_0_0_rgba(230,0,126,0.4)] lg:sticky lg:top-24">
        <div
          className="border-b border-white/15 px-5 py-5"
          style={{ background: "radial-gradient(ellipse 70% 120% at 100% 0%, rgba(230,0,126,0.4), transparent 55%)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">Live estimate</p>
          <h3 className="mt-2 text-2xl font-medium text-white" style={{ fontFamily: SERIF }}>
            Your treatment plan
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {selectedServices.length === 0 ? (
            <p className="text-sm text-white/50">Add treatments to see your estimate.</p>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
                    <span className="text-sm text-white truncate">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FFB8DC]">${serviceLineTotal(s).toFixed(0)}</span>
                      <button
                        type="button"
                        onClick={() => upsertService(s)}
                        className="text-[10px] font-bold text-white/50 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/15 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-white/50">Subtotal</span>
                  <span className="text-2xl font-medium text-white" style={{ fontFamily: SERIF }}>
                    ${calculateSubtotal(selectedServices).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                {options.length > 0 && (
                  <p className="mt-2 text-xs text-[#FFB8DC]">
                    Recommended plan: ${calculateTotal(options[1] || options[0]).toLocaleString(undefined, { maximumFractionDigits: 0 })} (with savings)
                  </p>
                )}
              </div>

              {hasRxItems && (
                <div className="rounded-lg border border-amber-400/40 bg-amber-950/20 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">RX items included</p>
                  <p className="text-xs text-amber-100/70 mt-1">Consult required for eligibility</p>
                </div>
              )}
            </>
          )}

          <div className="pt-2 space-y-2">
            <a
              href={CHERRY_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black"
            >
              Apply with Cherry
            </a>
            <a
              href={M.phoneHref}
              className="flex w-full items-center justify-center rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white"
            >
              Call {M.phoneDisplay}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
