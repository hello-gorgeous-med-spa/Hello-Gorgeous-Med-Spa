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

const CONCERN_OPTIONS = [
  "Fine lines / Wrinkles",
  "Skin laxity",
  "Acne scars",
  "Pigmentation",
  "Body contouring",
  "Weight loss",
  "Hair restoration",
];

const POPULAR_SERVICE_IDS = [
  "botox",
  "dysport",
  "jeuveau",
  "lip-flip",
  "dermal-filler",
  "lip-filler",
  "filler-half-syringe",
  "morpheus8-face",
  "morpheus8-3pack",
  "solaria-co2-full",
  "quantum-rf-neck-pkg",
  "quantum-rf-abdomen-pkg",
  "hydrafacial-glow-special",
  "hydrafacial",
  "microneedling-ha",
  "baby-tox-luxe",
  "prp-facial",
  "laser-hair-listed-area",
  "iv-new-client-intro",
  "vitamin-plan-1mo",
  "exosomes-healing-addon",
  "flowwave-intro",
];

const PEPTIDE_CATEGORY_ORDER: PeptideRetailCategory[] = [
  "Recovery & Healing",
  "Hormone & GH Support",
  "Energy & Longevity",
  "Skin & Aesthetics",
  "Intimacy & Vitality",
  "Blends & Support",
];

const M = BUILD_YOUR_PROPOSAL_MARKETING;

export function PublicProposalBuilder() {
  const [concerns, setConcerns] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<ProposalService[]>([]);
  const [weightLossPick, setWeightLossPick] = useState("");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const weightLossServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((s) => s.category === "Weight Loss Programs"),
    []
  );
  const peptideServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((s) => s.category === "Peptides"),
    []
  );
  const vitaminPlanServices = useMemo(
    () => HELLO_GORGEOUS_SERVICES.filter((s) => s.id.startsWith("vitamin-plan-")),
    []
  );
  const vitaminRetailServices = useMemo(
    () =>
      HELLO_GORGEOUS_SERVICES.filter(
        (s) => s.category === "Vitamin Injections" && !s.id.startsWith("vitamin-plan-")
      ),
    []
  );
  const popularServices = useMemo(
    () =>
      POPULAR_SERVICE_IDS.map((id) => HELLO_GORGEOUS_SERVICES.find((s) => s.id === id)).filter(
        (s): s is SeedService => Boolean(s)
      ),
    []
  );

  const peptideGroups = useMemo(() => {
    const specials = peptideServices.filter(
      (s) =>
        s.id === "peptide-consult" ||
        s.id.startsWith("ghk-cu-formulation") ||
        s.id === "peptide-shipping"
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
  const isRxOnly = hasRxItems && rxServices.length === selectedServices.length;

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const upsertService = (service: SeedService) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s.id === service.id)) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, { ...service, quantity: defaultQuantityForService(service) }];
    });
  };

  const addPackage = (packageId: string) => {
    const pkg = PROPOSAL_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return;
    setSelectedServices((prev) => {
      if (prev.some((s) => s.id === pkg.id)) return prev.filter((s) => s.id !== pkg.id);
      return [...prev, packageToProposalService(pkg)];
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

  const addWeightLoss = (serviceId: string) => {
    if (!serviceId) return;
    const service = weightLossServices.find((s) => s.id === serviceId);
    if (!service) return;
    setSelectedServices((prev) => {
      if (prev.some((s) => s.id === serviceId)) return prev;
      return [...prev, { ...service, quantity: 1 }];
    });
    setWeightLossPick("");
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
          concerns,
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
      <section className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6007E]">You&apos;re all set</p>
        <h2 className="mt-2 text-3xl font-black text-black">Your proposal is ready</h2>
        {hasRxItems ? (
          <>
            <p className="mt-3 text-sm text-black/75">
              We saved your plan and notified our team. Because your selection includes RX items
              (weight loss, peptides, or hormone therapy), <strong>a consultation is required</strong>{" "}
              before we can confirm eligibility and pricing.
            </p>
            <div className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">Next step: book your consult</p>
              <p className="mt-1 text-sm text-amber-700">
                Our nurse practitioner will review your goals, confirm medical eligibility, and finalize
                your treatment plan. No self-checkout is available for prescription items.
              </p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-black/75">
            We saved your plan and notified our team. Review it anytime, choose a package on the share page, or apply for
            Cherry financing.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={successUrl}
            className="rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white"
          >
            View my proposal
          </a>
          {hasRxItems ? (
            <Link href="/book" className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white">
              Book consult now
            </Link>
          ) : (
            <a
              href={CHERRY_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              Apply now with Cherry
            </a>
          )}
          <Link href="/book" className="rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black">
            {hasRxItems ? "Call us" : "Book consult"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Concerns */}
      <section className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">What are you hoping to improve?</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CONCERN_OPTIONS.map((concern) => {
            const on = concerns.includes(concern);
            return (
              <button
                key={concern}
                type="button"
                onClick={() => toggleConcern(concern)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  on ? "bg-[#E6007E] text-white" : "border-2 border-black/15 text-black hover:border-[#E6007E]"
                }`}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </section>

      {/* Packages */}
      <section className="rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Signature packages</h2>
        <p className="mt-1 text-sm text-black/70">Fixed package pricing — great starting points for transformation plans.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PROPOSAL_PACKAGES.map((pkg) => {
            const selected = selectedServices.some((s) => s.id === pkg.id);
            return (
              <article key={pkg.id} className="rounded-2xl border-2 border-black bg-white p-4">
                <h3 className="text-lg font-bold text-black">{pkg.name}</h3>
                <p className="mt-1 text-2xl font-black text-[#E6007E]">${pkg.price.toLocaleString()}</p>
                <p className="mt-1 text-xs text-black/70">{pkg.description}</p>
                <button
                  type="button"
                  onClick={() => addPackage(pkg.id)}
                  className={`mt-3 rounded-full px-4 py-2 text-sm font-bold ${
                    selected ? "border-2 border-black text-black" : "bg-[#E6007E] text-white"
                  }`}
                >
                  {selected ? "Remove package" : "Add package"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Popular treatments */}
      <section className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Popular treatments</h2>
        <p className="mt-1 text-sm text-black/70">
          Neurotoxins default to 20 units — tap presets (20–60) or enter your own count.
        </p>
        <div className="mt-4 space-y-2">
          {popularServices.map((service) => {
            const selected = selectedServices.find((s) => s.id === service.id);
            const perUnit = isPerUnitService(service);
            return (
              <div
                key={service.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-white p-3"
              >
                <input
                  type="checkbox"
                  checked={Boolean(selected)}
                  onChange={() => upsertService(service)}
                  className="h-4 w-4"
                />
                <div className="min-w-[12rem] flex-1">
                  <p className="text-sm font-semibold text-black">{service.name}</p>
                  <p className="text-xs text-black/65">
                    ${service.price} {service.unit}
                  </p>
                  {selected && perUnit ? (
                    <p className="mt-1 text-xs font-bold text-[#E6007E]">
                      {selected.quantity} units × ${service.price} = ${serviceLineTotal(selected).toFixed(0)}
                    </p>
                  ) : null}
                </div>
                {selected && perUnit ? (
                  <div className="flex flex-wrap justify-end gap-1">
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
                      className="w-20 rounded-md border border-black/20 px-2 py-1 text-sm"
                      aria-label={`${service.name} units`}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Weight loss */}
      <section className="rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Weight loss programs</h2>
        <p className="mt-1 text-sm text-black/70">Choose consult, dose tier, or multi-month options from one menu.</p>
        <select
          value={weightLossPick}
          onChange={(e) => addWeightLoss(e.target.value)}
          className="mt-3 w-full max-w-xl rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Add a weight loss option…</option>
          {weightLossServices.map((service) => (
            <option
              key={service.id}
              value={service.id}
              disabled={selectedServices.some((s) => s.id === service.id)}
            >
              {service.name} — ${service.price} {service.unit}
            </option>
          ))}
        </select>
        <ul className="mt-3 space-y-1 text-sm">
          {selectedServices
            .filter((s) => weightLossServices.some((w) => w.id === s.id))
            .map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
                <span className="font-semibold text-black">{s.name}</span>
                <button type="button" onClick={() => upsertService(s)} className="text-xs font-bold text-[#E6007E]">
                  Remove
                </button>
              </li>
            ))}
        </ul>
      </section>

      {/* Peptides */}
      <section className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Peptides · Hello Gorgeous RX</h2>
        <p className="mt-1 text-sm text-black/70">Tap to add. Prices are published retail “from” monthly rates.</p>
        <p className="mt-1 text-[11px] text-black/50">{PEPTIDE_PRICING_DISCLAIMER}</p>
        <div className="mt-4 space-y-5">
          {peptideGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-black/45">{group.label}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.services.map((service) => {
                  const selected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => upsertService(service)}
                      className={`rounded-xl border-2 p-3 text-left ${
                        selected
                          ? "border-[#E6007E] bg-[#FFF0F7]"
                          : "border-black/10 hover:border-[#E6007E]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-black">{service.name}</p>
                        <span className="shrink-0 text-sm font-black text-[#E6007E]">${service.price}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase text-black/45">{service.unit}</p>
                      {service.description ? (
                        <p className="mt-1 text-xs leading-snug text-black/70">{service.description}</p>
                      ) : null}
                      <p className="mt-2 text-[11px] font-bold text-[#E6007E]">
                        {selected ? "Added ✓" : "Tap to add"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vitamin injections + exosomes */}
      <section className="rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Vitamin injections while treating</h2>
        <p className="mt-1 text-sm text-black/70">{VITAMIN_B4G2_OFFER_BLURB}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {vitaminPlanServices.map((service) => {
            const plan = VITAMIN_TREATMENT_PLANS.find((p) => p.id === service.id);
            const selected = selectedServices.some((s) => s.id === service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => upsertService(service)}
                className={`rounded-xl border-2 p-3 text-left ${
                  selected ? "border-[#E6007E] bg-white" : "border-black/10 bg-white hover:border-[#E6007E]"
                }`}
              >
                <p className="text-sm font-bold text-black">
                  {plan ? `${plan.months}-month plan` : service.name}
                </p>
                <p className="mt-1 text-2xl font-black text-[#E6007E]">${service.price}</p>
                {plan ? (
                  <p className="text-[11px] text-black/65">
                    {plan.shots} shots · save ${plan.retailUsd - plan.priceUsd}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => upsertService(EXOSOME_HEALING_ADDON)}
          className={`mt-4 w-full rounded-xl border-2 p-3 text-left ${
            selectedServices.some((s) => s.id === EXOSOME_HEALING_ADDON.id)
              ? "border-[#E6007E] bg-white"
              : "border-black bg-white hover:border-[#E6007E]"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
            Advanced healing add-on
          </p>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-bold text-black">{EXOSOME_HEALING_ADDON.name}</p>
            <span className="text-lg font-black text-[#E6007E]">+${EXOSOME_HEALING_ADDON.price}</span>
          </div>
          <p className="mt-1 text-xs text-black/70">{EXOSOME_HEALING_ADDON.description}</p>
        </button>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-black/45">À la carte shots</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {vitaminRetailServices.map((service) => {
            const selected = selectedServices.some((s) => s.id === service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => upsertService(service)}
                className={`rounded-xl border-2 p-3 text-left ${
                  selected ? "border-[#E6007E] bg-white" : "border-black/10 bg-white hover:border-[#E6007E]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-black">{service.name}</p>
                  <span className="font-black text-[#E6007E]">${service.price}</span>
                </div>
                {service.description ? (
                  <p className="mt-1 text-xs text-black/70">{service.description}</p>
                ) : null}
              </button>
            );
          })}
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-bold text-black">
            Cheat sheet — what each injection does
          </summary>
          <div className="mt-3">
            <VitaminInjectionCheatSheet variant="client" />
          </div>
        </details>
      </section>

      {/* Live estimate */}
      <section className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-black">Your estimated plans</h2>
            <p className="mt-1 text-sm text-black/70">
              {selectedServices.length
                ? `${selectedServices.length} items · $${calculateSubtotal(selectedServices).toLocaleString()} list before plan discounts`
                : "Add treatments above to see Essential / Recommended / VIP estimates."}
            </p>
          </div>
          <a
            href={CHERRY_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white"
          >
            Apply now with Cherry
          </a>
        </div>

        {/* RX consult-required notice */}
        {hasRxItems ? (
          <div className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-800">
              ⚠️ Consultation required for RX items
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Your selection includes{" "}
              <strong>
                {rxServices.map((s) => s.name).join(", ")}
              </strong>
              . These require a medical consultation with our nurse practitioner before starting.
              We&apos;ll confirm eligibility and pricing at your visit — no self-checkout for
              prescription items.
            </p>
            <Link
              href="/book"
              className="mt-3 inline-flex items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
            >
              Book consult first
            </Link>
          </div>
        ) : null}
        {options.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {options.map((option, index) => (
              <article
                key={option.name}
                className={`rounded-2xl border-4 p-4 ${
                  index === 1 ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black bg-white"
                }`}
              >
                <h3 className="font-bold text-black">{option.name}</h3>
                {index === 1 ? (
                  <span className="mt-1 inline-block rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold text-white">
                    Most popular
                  </span>
                ) : null}
                <ul className="mt-3 space-y-1 text-xs text-black/75">
                  {option.services.slice(0, 8).map((s) => (
                    <li key={`${option.name}-${s.id}`}>{formatProposalServiceLine(s)}</li>
                  ))}
                  {option.services.length > 8 ? (
                    <li className="text-black/50">+{option.services.length - 8} more…</li>
                  ) : null}
                </ul>
                <p className="mt-4 text-2xl font-black text-[#E6007E]">
                  ${calculateTotal(option).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {/* Contact + submit */}
      <section className="rounded-3xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <h2 className="text-xl font-black text-black">Send this proposal to Hello Gorgeous</h2>
        <p className="mt-1 text-sm text-black/70">
          We’ll save your shareable plan and text/email our team so we can confirm medical fit and book you.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm"
            placeholder="Full name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm"
            placeholder="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm"
            placeholder="Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <textarea
          className="mt-3 w-full rounded-lg border-2 border-black/15 bg-white px-3 py-2.5 text-sm"
          rows={3}
          placeholder="Anything else we should know? (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {/* honeypot */}
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
        <label className="mt-3 flex items-start gap-2 text-sm text-black/80">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>
            I understand this is an educational estimate only. Final pricing and medical eligibility are confirmed at a
            Hello Gorgeous consult.
          </span>
        </label>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={submitting || !selectedServices.length}
            onClick={() => void submit()}
            className="rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save & send my proposal"}
          </button>
          <a
            href={CHERRY_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
          >
            Apply now with Cherry
          </a>
          <a href={M.phoneHref} className="rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black">
            Call {M.phoneDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}
