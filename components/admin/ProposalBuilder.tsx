"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { packageToProposalService, PROPOSAL_PACKAGES } from "@/lib/proposals/packages";
import { HELLO_GORGEOUS_SERVICES, type SeedService } from "@/lib/proposals/seed-services";
import type { ProposalMediaItem, ProposalMediaKind, TreatmentProposalRecord } from "@/lib/proposals/types";
import {
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_MENU,
  type PeptideRetailCategory,
} from "@/lib/peptide-retail-pricing";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { VitaminInjectionCheatSheet } from "@/components/proposals/VitaminInjectionCheatSheet";
import {
  EXOSOME_HEALING_ADDON,
  VITAMIN_B4G2_OFFER_BLURB,
  VITAMIN_TREATMENT_PLANS,
} from "@/lib/proposals/vitamin-injections";
import {
  fillProposalWelcomeTemplate,
  PROPOSAL_WELCOME_TEMPLATES,
} from "@/lib/proposals/welcome-templates";
import {
  autoGenerateOptions,
  calculateDiscount,
  calculateMonthlyPayment,
  calculateSubtotal,
  calculateTotal,
  defaultQuantityForService,
  discountLabel,
  formatProposalServiceLine,
  generateTimeline,
  isPerUnitService,
  NEUROTOXIN_UNIT_PRESETS,
  serviceLineTotal,
  type DiscountType,
  type ProposalOption,
  type ProposalService,
} from "@/lib/proposals/utils";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const BG_COOL = "#E8ECF4";

const STEPS = [
  { id: "client", label: "Client Info", short: "Client" },
  { id: "services", label: "Services", short: "Services" },
  { id: "options", label: "Options & Pricing", short: "Pricing" },
  { id: "review", label: "Review & Save", short: "Save" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CONCERN_OPTIONS = [
  "Fine lines / Wrinkles",
  "Skin laxity",
  "Acne scars",
  "Pigmentation",
  "Body contouring",
  "Weight loss",
  "Hair restoration",
];

const CATEGORY_ORDER = [
  "Packages",
  "InMode Trifecta",
  "Injectables",
  "Advanced Healing",
  "Vitamin Injections",
  "Body & Wellness",
  "Regenerative",
  "Skin & Face",
  "Laser",
  "Retail",
];

const COMPACT_CATEGORIES = new Set([
  "Weight Loss Programs",
  "Peptides",
  "Vitamin Injections",
  "Advanced Healing",
]);

const PEPTIDE_CATEGORY_ORDER: PeptideRetailCategory[] = [
  "Recovery & Healing",
  "Hormone & GH Support",
  "Energy & Longevity",
  "Skin & Aesthetics",
  "Intimacy & Vitality",
  "Blends & Support",
];

const DISCOUNT_MODES: Array<{ value: DiscountType; label: string }> = [
  { value: "none", label: "No extra discount" },
  { value: "package", label: "Package pricing (as listed)" },
  { value: "percentage", label: "Percentage off" },
  { value: "dollar", label: "Dollar amount off" },
  { value: "custom", label: "Custom total price" },
];

const SERVICE_TABS = [
  { id: "packages", label: "Packages" },
  { id: "weight", label: "Weight Loss" },
  { id: "peptides", label: "Peptides" },
  { id: "vitamins", label: "Vitamins" },
  { id: "all", label: "All Services" },
] as const;

type ServiceTabId = (typeof SERVICE_TABS)[number]["id"];

function newDraftId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return `draft-${Date.now().toString(36)}`;
}

function servicesFromOptions(options: ProposalOption[]): ProposalService[] {
  const map = new Map<string, ProposalService>();
  for (const option of options) {
    for (const service of option.services || []) {
      if (!map.has(service.id)) map.set(service.id, { ...service });
    }
  }
  return [...map.values()];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type ProposalBuilderProps = {
  proposalId?: string;
};

export function ProposalBuilder({ proposalId }: ProposalBuilderProps) {
  const router = useRouter();
  const isEditing = Boolean(proposalId);
  const [draftId] = useState(() => proposalId?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || newDraftId());
  const [loadingExisting, setLoadingExisting] = useState(isEditing);
  const [step, setStep] = useState<StepId>("client");
  const [serviceTab, setServiceTab] = useState<ServiceTabId>("packages");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [internalNotes, setInternalNotes] = useState("");
  const [clientInstructions, setClientInstructions] = useState("");
  const [media, setMedia] = useState<ProposalMediaItem[]>([]);
  const [uploadingKind, setUploadingKind] = useState<ProposalMediaKind | null>(null);
  const [selectedServices, setSelectedServices] = useState<ProposalService[]>([]);
  const [options, setOptions] = useState<ProposalOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  useEffect(() => {
    if (!proposalId) return;
    let cancelled = false;

    const load = async () => {
      setLoadingExisting(true);
      setError(null);
      try {
        const response = await fetch(`/api/proposals/${proposalId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load proposal.");
        if (cancelled) return;

        const proposal = data.proposal as TreatmentProposalRecord;
        const loadedOptions = Array.isArray(proposal.options) ? proposal.options : [];
        setClientName(proposal.client_name || "");
        setClientEmail(proposal.client_email || "");
        setClientPhone(proposal.client_phone || "");
        setConcerns(Array.isArray(proposal.concerns) ? proposal.concerns : []);
        setInternalNotes(proposal.internal_notes || "");
        setClientInstructions(proposal.client_instructions || "");
        setMedia(Array.isArray(proposal.media) ? proposal.media : []);
        setOptions(loadedOptions);
        setSelectedServices(servicesFromOptions(loadedOptions));
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load proposal.");
        }
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [proposalId]);

  const weightLossServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((service) => service.category === "Weight Loss Programs"),
    []
  );

  const peptideServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((service) => service.category === "Peptides"),
    []
  );

  const vitaminPlanServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((service) => service.id.startsWith("vitamin-plan-")),
    []
  );

  const vitaminRetailServices = useMemo(
    () =>
      HELLO_GORGEOUS_SERVICES.filter(
        (service) =>
          service.category === "Vitamin Injections" && !service.id.startsWith("vitamin-plan-")
      ),
    []
  );

  const peptideByRetailCategory = useMemo(() => {
    const specials = peptideServices.filter(
      (service) =>
        service.id === "peptide-consult" ||
        service.id.startsWith("ghk-cu-formulation") ||
        service.id === "peptide-shipping"
    );
    const groups: Array<{ label: string; services: SeedService[] }> = [
      { label: "Consult & Formulation", services: specials },
    ];
    for (const category of PEPTIDE_CATEGORY_ORDER) {
      const retailIds = new Set(
        PEPTIDE_RETAIL_MENU.filter((row) => row.category === category).map((row) => `peptide-${row.id}`)
      );
      const services = peptideServices.filter((service) => retailIds.has(service.id));
      if (services.length) groups.push({ label: category, services });
    }
    return groups;
  }, [peptideServices]);

  const groupedServices = useMemo(() => {
    const grouped = HELLO_GORGEOUS_SERVICES.reduce<Record<string, typeof HELLO_GORGEOUS_SERVICES>>(
      (acc, service) => {
        if (COMPACT_CATEGORIES.has(service.category)) return acc;
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).sort(([a], [b]) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, []);

  const subtotal = useMemo(() => calculateSubtotal(selectedServices), [selectedServices]);
  const recommendedTotal = useMemo(
    () => (options.length ? calculateTotal(options[1] || options[0]) : subtotal),
    [options, subtotal]
  );

  const toggleService = (serviceId: string) => {
    const service = HELLO_GORGEOUS_SERVICES.find((item) => item.id === serviceId);
    if (!service) return;

    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.id === serviceId);
      if (exists) return prev.filter((item) => item.id !== serviceId);
      return [...prev, { ...service, quantity: defaultQuantityForService(service) }];
    });
    setOptions([]);
  };

  const addPackage = (packageId: string) => {
    const pkg = PROPOSAL_PACKAGES.find((item) => item.id === packageId);
    if (!pkg) return;

    setSelectedServices((prev) => {
      if (prev.some((item) => item.id === pkg.id)) return prev;
      return [...prev, packageToProposalService(pkg)];
    });
    setOptions([]);
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    const service =
      selectedServices.find((item) => item.id === serviceId) ||
      HELLO_GORGEOUS_SERVICES.find((item) => item.id === serviceId);
    const min = service && isPerUnitService(service) ? 1 : 1;
    const nextQty = Math.max(min, Math.round(Number(quantity) || min));
    setSelectedServices((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, quantity: nextQty } : item))
    );
    setOptions([]);
  };

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((item) => item !== concern) : [...prev, concern]
    );
  };

  const updateOptionPricing = (
    optionName: string,
    patch: Partial<Pick<ProposalOption, "discountType" | "discountValue">>
  ) => {
    setOptions((prev) =>
      prev.map((option) => {
        if (option.name !== optionName) return option;
        const nextType = patch.discountType ?? option.discountType;
        let nextValue = patch.discountValue ?? option.discountValue;
        if (patch.discountType === "custom" && option.discountType !== "custom") {
          nextValue = calculateTotal(option);
        }
        if (patch.discountType && patch.discountType !== "custom" && option.discountType === "custom") {
          nextValue = patch.discountType === "percentage" ? 10 : 0;
        }
        return { ...option, discountType: nextType, discountValue: nextValue };
      })
    );
  };

  const removeServiceFromOption = (optionName: string, serviceId: string) => {
    setOptions((prev) =>
      prev.map((option) => {
        if (option.name !== optionName) return option;
        const services = option.services.filter((service) => service.id !== serviceId);
        return {
          ...option,
          services,
          timeline: generateTimeline(services),
        };
      })
    );
  };

  const handleGenerate = () => {
    setOptions(autoGenerateOptions(selectedServices));
  };

  const uploadMedia = async (file: File, kind: ProposalMediaKind) => {
    setError(null);
    setUploadingKind(kind);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      formData.append("draftId", draftId);

      const response = await fetch("/api/proposals/upload-media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");

      const item: ProposalMediaItem = {
        id: `${kind}-${Date.now()}`,
        kind,
        url: data.url,
        label: kind === "before" ? "Before" : kind === "after" ? "After" : "Before & after",
        createdAt: new Date().toISOString(),
      };
      setMedia((prev) => [...prev, item]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploadingKind(null);
    }
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setError(null);
    if (!clientName.trim()) {
      setError("Client name is required.");
      return;
    }
    if (!options.length) {
      setError("Generate proposal options before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || null,
        clientPhone: clientPhone.trim() || null,
        concerns,
        options,
        internalNotes: internalNotes.trim() || null,
        clientInstructions: clientInstructions.trim() || null,
        media,
      };

      const response = await fetch(isEditing ? `/api/proposals/${proposalId}` : "/api/proposals", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save proposal.");

      router.push(`/admin/proposals/${data.proposal.id}/preview`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save proposal.");
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
  };

  if (loadingExisting) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: BG_COOL }}>
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E6007E] border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading proposal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: BG_COOL }}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/proposals"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              HG
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                {isEditing ? "Edit" : "Build"} Proposal
              </p>
              <p className="text-sm font-semibold text-white">{clientName || "New client"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/staff/protocols/guides/InMode-Packages-How-To-Sell.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 sm:inline-flex"
            >
              Selling guide
            </a>
            {isEditing && proposalId && (
              <Link
                href={`/admin/proposals/${proposalId}/preview`}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Preview
              </Link>
            )}
            <Link
              href="/admin/proposals"
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              ← Back
            </Link>
          </div>
        </div>
        {/* Step progress bar */}
        <div className="border-t border-white/10 bg-[#0f172a]/80 px-4 py-2.5 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                    i <= stepIndex
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                  style={i <= stepIndex ? { background: `linear-gradient(135deg, ${HOT}, ${PINK})` } : undefined}
                >
                  {s.short}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/15 sm:block">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${HOT}, ${PINK})` }}
                />
              </div>
              <span className="text-xs font-semibold text-white/60">{progress}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Main wizard panel */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Step header */}
            <div
              className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  Step {stepIndex + 1} of {STEPS.length}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {STEPS[stepIndex].label}
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
              </div>
            </div>

            {/* Step content */}
            <div className="p-5 md:p-6">
              {/* STEP 1: Client Info */}
              {step === "client" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">Client details</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <input
                        className="rounded-lg border-2 border-black/15 px-3 py-2.5 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                        placeholder="Client name *"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                      <input
                        className="rounded-lg border-2 border-black/15 px-3 py-2.5 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                        placeholder="Email"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                      <input
                        className="rounded-lg border-2 border-black/15 px-3 py-2.5 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                        placeholder="Phone"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">Consult concerns</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {CONCERN_OPTIONS.map((concern) => {
                        const active = concerns.includes(concern);
                        return (
                          <button
                            key={concern}
                            type="button"
                            onClick={() => toggleConcern(concern)}
                            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                              active
                                ? "border-[#E6007E] bg-[#FFF0F7] shadow-[3px_3px_0_0_rgba(230,0,126,0.2)]"
                                : "border-black/10 hover:border-[#E6007E]"
                            }`}
                          >
                            <span className={`font-semibold ${active ? "text-[#E6007E]" : "text-black"}`}>
                              {concern}
                            </span>
                            {active && <span className="ml-auto text-[#E6007E]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-black bg-[#FFF0F7] p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">
                      Welcome message to client
                    </h3>
                    <p className="mt-1 text-xs text-black/60">
                      Shows on their plan link, PDF, and preview. Use a template or write your own.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {PROPOSAL_WELCOME_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setClientInstructions(fillProposalWelcomeTemplate(template.body, clientName))}
                          className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                        >
                          {template.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={6}
                      value={clientInstructions}
                      onChange={(e) => setClientInstructions(e.target.value)}
                      className="mt-3 w-full rounded-lg border-2 border-black/15 bg-white px-3 py-2 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                      placeholder="Hi — Welcome to Hello Gorgeous…"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">
                      Internal notes (staff only)
                    </h3>
                    <textarea
                      rows={3}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      className="mt-2 w-full rounded-lg border-2 border-black/15 px-3 py-2 text-sm text-black focus:border-[#E6007E] focus:outline-none"
                      placeholder="Provider notes, objections, follow-up context."
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!clientName.trim()}
                      className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                    >
                      Continue to services →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Services */}
              {step === "services" && (
                <div className="space-y-5">
                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4">
                    {SERVICE_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setServiceTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                          serviceTab === tab.id
                            ? "bg-black text-white"
                            : "border border-black/20 text-black hover:border-black"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Packages */}
                  {serviceTab === "packages" && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {PROPOSAL_PACKAGES.map((pkg) => {
                        const selected = selectedServices.some((item) => item.id === pkg.id);
                        return (
                          <article
                            key={pkg.id}
                            className={`rounded-xl border-2 p-4 transition ${
                              selected
                                ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                                : "border-black/10 hover:border-[#E6007E]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-black">{pkg.name}</h3>
                                <p className="mt-1 text-xl font-black text-[#E6007E]">${pkg.price.toLocaleString()}</p>
                                <p className="mt-1 text-xs text-black/60">{pkg.description}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => (selected ? toggleService(pkg.id) : addPackage(pkg.id))}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                                  selected
                                    ? "border-2 border-black bg-white text-black"
                                    : "bg-[#E6007E] text-white"
                                }`}
                              >
                                {selected ? "Remove" : "Add"}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {/* Weight Loss */}
                  {serviceTab === "weight" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {weightLossServices.map((service) => {
                        const selected = selectedServices.find((s) => s.id === service.id);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`rounded-xl border-2 p-3 text-left transition ${
                              selected
                                ? "border-[#E6007E] bg-[#FFF0F7] shadow-[3px_3px_0_0_rgba(230,0,126,0.2)]"
                                : "border-black/10 hover:border-[#E6007E]"
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
                  )}

                  {/* Peptides */}
                  {serviceTab === "peptides" && (
                    <div className="space-y-5">
                      <p className="text-xs text-black/50">{PEPTIDE_PRICING_DISCLAIMER}</p>
                      {peptideByRetailCategory.map((group) => (
                        <div key={group.label}>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-black/45 mb-2">
                            {group.label}
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {group.services.map((service) => {
                              const selected = selectedServices.some((s) => s.id === service.id);
                              return (
                                <button
                                  key={service.id}
                                  type="button"
                                  onClick={() => toggleService(service.id)}
                                  className={`rounded-xl border-2 p-3 text-left transition ${
                                    selected
                                      ? "border-[#E6007E] bg-[#FFF0F7]"
                                      : "border-black/10 hover:border-[#E6007E]"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-bold text-black">{service.name}</p>
                                    <span className="shrink-0 text-sm font-black text-[#E6007E]">${service.price}</span>
                                  </div>
                                  <p className="mt-0.5 text-[10px] font-semibold uppercase text-black/45">
                                    {service.unit}
                                  </p>
                                  {selected && <p className="mt-2 text-[11px] font-bold text-[#E6007E]">Added ✓</p>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vitamins */}
                  {serviceTab === "vitamins" && (
                    <div className="space-y-5">
                      <p className="text-xs text-black/60">{VITAMIN_B4G2_OFFER_BLURB}</p>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-black/45 mb-2">
                          Plan length
                        </p>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {vitaminPlanServices.map((service) => {
                            const plan = VITAMIN_TREATMENT_PLANS.find((p) => p.id === service.id);
                            const selected = selectedServices.some((s) => s.id === service.id);
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className={`rounded-xl border-2 p-3 text-left transition ${
                                  selected
                                    ? "border-[#E6007E] bg-[#FFF0F7] shadow-[3px_3px_0_0_rgba(230,0,126,0.2)]"
                                    : "border-black/10 hover:border-[#E6007E]"
                                }`}
                              >
                                <p className="text-sm font-bold text-black">
                                  {plan ? `${plan.months}-month plan` : service.name}
                                </p>
                                <p className="mt-1 text-xl font-black text-[#E6007E]">${service.price}</p>
                                {plan && (
                                  <p className="text-[11px] text-black/60">{plan.shots} shots · list ${plan.retailUsd}</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleService(EXOSOME_HEALING_ADDON.id)}
                        className={`w-full rounded-xl border-2 p-3 text-left transition ${
                          selectedServices.some((s) => s.id === EXOSOME_HEALING_ADDON.id)
                            ? "border-[#E6007E] bg-[#FFF0F7] shadow-[3px_3px_0_0_rgba(230,0,126,0.2)]"
                            : "border-black hover:border-[#E6007E]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
                              Advanced healing
                            </p>
                            <p className="text-sm font-bold text-black">{EXOSOME_HEALING_ADDON.name}</p>
                          </div>
                          <p className="text-xl font-black text-[#E6007E]">+${EXOSOME_HEALING_ADDON.price}</p>
                        </div>
                      </button>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-black/45 mb-2">
                          À la carte shots
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {vitaminRetailServices.map((service) => {
                            const selected = selectedServices.some((s) => s.id === service.id);
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className={`rounded-xl border-2 p-3 text-left transition ${
                                  selected
                                    ? "border-[#E6007E] bg-[#FFF0F7]"
                                    : "border-black/10 hover:border-[#E6007E]"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-bold text-black">{service.name}</p>
                                  <span className="shrink-0 text-sm font-black text-[#E6007E]">${service.price}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <details className="rounded-xl border border-black/10 bg-white p-3">
                        <summary className="cursor-pointer text-sm font-bold text-black">
                          Quick cheat sheet — what to offer the client
                        </summary>
                        <div className="mt-3">
                          <VitaminInjectionCheatSheet variant="staff" />
                        </div>
                      </details>
                    </div>
                  )}

                  {/* All Services */}
                  {serviceTab === "all" && (
                    <div className="space-y-5">
                      {groupedServices.map(([category, services]) => (
                        <div key={category}>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E] mb-2">{category}</h3>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {services.map((service) => {
                              const selected = selectedServices.find((s) => s.id === service.id);
                              const perUnit = isPerUnitService(service);
                              return (
                                <div
                                  key={service.id}
                                  className={`rounded-xl border-2 p-3 transition ${
                                    selected
                                      ? "border-[#E6007E] bg-[#FFF0F7]"
                                      : "border-black/10 hover:border-[#E6007E]"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(selected)}
                                      onChange={() => toggleService(service.id)}
                                      className="mt-1"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-black">{service.name}</p>
                                      <p className="text-xs text-black/60">
                                        ${service.price} {service.unit}
                                      </p>
                                    </div>
                                  </div>
                                  {selected && perUnit && (
                                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-black/10 pt-2">
                                      <span className="text-xs text-black/60">Units:</span>
                                      {NEUROTOXIN_UNIT_PRESETS.map((preset) => (
                                        <button
                                          key={preset}
                                          type="button"
                                          onClick={() => updateQuantity(service.id, preset)}
                                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                            selected.quantity === preset
                                              ? "bg-[#E6007E] text-white"
                                              : "border border-black/20 text-black"
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
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Before/after photos */}
                  <div className="rounded-xl border-2 border-black/10 bg-white p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">
                      Before & after photos (optional)
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(["before", "after", "pair"] as ProposalMediaKind[]).map((kind) => (
                        <label
                          key={kind}
                          className="cursor-pointer rounded-full border-2 border-black bg-[#FFF0F7] px-4 py-2 text-sm font-bold text-black hover:border-[#E6007E]"
                        >
                          {uploadingKind === kind
                            ? "Uploading…"
                            : kind === "before"
                            ? "+ Before"
                            : kind === "after"
                            ? "+ After"
                            : "+ Pair"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={Boolean(uploadingKind)}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void uploadMedia(file, kind);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      ))}
                    </div>
                    {media.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {media.map((item) => (
                          <div key={item.id} className="relative h-16 w-16 overflow-hidden rounded-lg border border-black/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={item.label || item.kind} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeMedia(item.id)}
                              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm font-medium text-black/55 hover:text-black"
                    >
                      ← Back to client
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleGenerate();
                        nextStep();
                      }}
                      disabled={!selectedServices.length}
                      className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                    >
                      Generate options →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Options & Pricing */}
              {step === "options" && (
                <div className="space-y-5">
                  {!options.length ? (
                    <div className="rounded-xl border-2 border-dashed border-black/20 bg-white p-8 text-center">
                      <p className="font-semibold text-black/70">No options generated yet</p>
                      <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!selectedServices.length}
                        className="mt-3 rounded-full px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
                        style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                      >
                        Auto-generate options
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      {options.map((option, index) => {
                        const optSubtotal = calculateSubtotal(option.services);
                        const discount = calculateDiscount(optSubtotal, option.discountType, option.discountValue);
                        const total = calculateTotal(option);
                        const monthly = calculateMonthlyPayment(total, 24);
                        const showValueInput =
                          option.discountType === "percentage" ||
                          option.discountType === "dollar" ||
                          option.discountType === "custom";

                        return (
                          <article
                            key={option.name}
                            className={`rounded-xl border-2 p-4 ${
                              index === 1
                                ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                                : "border-black"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-black">{option.name}</h3>
                              {index === 1 && (
                                <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold text-white">
                                  Best value
                                </span>
                              )}
                            </div>

                            <ul className="mt-3 space-y-1 text-xs text-black/75">
                              {option.services.slice(0, 4).map((service) => (
                                <li key={`${option.name}-${service.id}`} className="flex justify-between gap-2">
                                  <span className="truncate">{formatProposalServiceLine(service)}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeServiceFromOption(option.name, service.id)}
                                    className="shrink-0 text-[10px] text-black/40 hover:text-red-600"
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                              {option.services.length > 4 && (
                                <li className="text-black/50">+{option.services.length - 4} more</li>
                              )}
                            </ul>

                            <div className="mt-3 space-y-2 rounded-lg border border-black/10 bg-white p-2">
                              <select
                                value={option.discountType}
                                onChange={(e) =>
                                  updateOptionPricing(option.name, { discountType: e.target.value as DiscountType })
                                }
                                className="w-full rounded-md border border-black/15 bg-white px-2 py-1 text-xs"
                              >
                                {DISCOUNT_MODES.map((mode) => (
                                  <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                  </option>
                                ))}
                              </select>
                              {showValueInput && (
                                <input
                                  type="number"
                                  min={0}
                                  value={option.discountValue}
                                  onChange={(e) =>
                                    updateOptionPricing(option.name, { discountValue: Number(e.target.value) || 0 })
                                  }
                                  className="w-full rounded-md border border-black/15 bg-white px-2 py-1 text-xs"
                                  placeholder={
                                    option.discountType === "percentage"
                                      ? "Percent"
                                      : option.discountType === "custom"
                                      ? "Custom total"
                                      : "$ off"
                                  }
                                />
                              )}
                              <p className="text-[10px] text-black/50">{discountLabel(option)}</p>
                            </div>

                            <div className="mt-3 border-t border-black/10 pt-2 text-xs">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${optSubtotal.toFixed(0)}</span>
                              </div>
                              <div className="flex justify-between text-[#E6007E]">
                                <span>Discount</span>
                                <span>-${discount.toFixed(0)}</span>
                              </div>
                              <div className="mt-1 flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(0)}</span>
                              </div>
                              <p className="mt-1 text-[10px] text-black/50">~${monthly.toFixed(0)}/mo at 24mo</p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}

                  <div className="rounded-xl border border-black/10 bg-[#FFF0F7] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Financing</p>
                    <p className="mt-1 text-sm text-black/70">
                      Clients can pay monthly with Cherry — apply in minutes, often with a soft credit check.
                    </p>
                    <a
                      href={CHERRY_PAY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-white"
                    >
                      Apply with Cherry
                    </a>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm font-medium text-black/55 hover:text-black"
                    >
                      ← Back to services
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!options.length}
                      className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                    >
                      Review & save →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Save */}
              {step === "review" && (
                <div className="space-y-5">
                  <div className="rounded-xl border-2 border-black bg-[#FFF0F7] p-4">
                    <h3 className="font-bold text-black">Proposal Summary</h3>
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                      <p>
                        <span className="text-black/60">Client:</span>{" "}
                        <span className="font-semibold">{clientName || "—"}</span>
                      </p>
                      <p>
                        <span className="text-black/60">Email:</span>{" "}
                        <span className="font-semibold">{clientEmail || "—"}</span>
                      </p>
                      <p>
                        <span className="text-black/60">Phone:</span>{" "}
                        <span className="font-semibold">{clientPhone || "—"}</span>
                      </p>
                      <p>
                        <span className="text-black/60">Services:</span>{" "}
                        <span className="font-semibold">{selectedServices.length} items</span>
                      </p>
                      <p>
                        <span className="text-black/60">Options:</span>{" "}
                        <span className="font-semibold">{options.length} plans</span>
                      </p>
                      <p>
                        <span className="text-black/60">Photos:</span>{" "}
                        <span className="font-semibold">{media.length}</span>
                      </p>
                    </div>
                    {concerns.length > 0 && (
                      <p className="mt-2 text-sm">
                        <span className="text-black/60">Concerns:</span>{" "}
                        <span className="font-semibold">{concerns.join(", ")}</span>
                      </p>
                    )}
                  </div>

                  {options.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3">
                      {options.map((option, index) => {
                        const total = calculateTotal(option);
                        return (
                          <div
                            key={option.name}
                            className={`rounded-xl border-2 p-3 ${
                              index === 1 ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/20"
                            }`}
                          >
                            <p className="font-bold text-black">{option.name}</p>
                            <p className="mt-1 text-xl font-black text-[#E6007E]">{formatCurrency(total)}</p>
                            <p className="text-xs text-black/60">{option.services.length} services</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-3">
                      <p className="text-sm font-semibold text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm font-medium text-black/55 hover:text-black"
                    >
                      ← Back to pricing
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || !options.length || !clientName.trim()}
                      className="rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
                    >
                      {saving
                        ? "Saving…"
                        : isEditing
                        ? "Save changes & preview"
                        : "Save proposal & preview"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live estimate sidebar */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:sticky lg:top-24">
            <div
              className="border-b border-white/15 px-5 py-5"
              style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Live estimate</p>
              <h3 className="mt-2 text-xl font-bold text-white">
                {clientName || "New client"}
              </h3>
            </div>

            <div className="space-y-4 p-5">
              {selectedServices.length === 0 ? (
                <p className="text-sm text-slate-400">Add services to see your estimate.</p>
              ) : (
                <>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {selectedServices.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                      >
                        <span className="truncate text-sm text-slate-700">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: PINK }}>${serviceLineTotal(s).toFixed(0)}</span>
                          <button
                            type="button"
                            onClick={() => toggleService(s.id)}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Subtotal</span>
                      <span className="text-2xl font-bold text-slate-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {options.length > 0 && (
                      <p className="mt-2 text-xs" style={{ color: PINK }}>
                        Recommended: {formatCurrency(recommendedTotal)}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2 pt-2">
                <a
                  href={CHERRY_PAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                >
                  Apply with Cherry
                </a>
                <a
                  href="tel:+16303839918"
                  className="flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Call (630) 383-9918
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
