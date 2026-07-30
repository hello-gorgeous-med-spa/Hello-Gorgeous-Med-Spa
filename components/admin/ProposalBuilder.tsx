"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { packageToProposalService, PROPOSAL_PACKAGES } from "@/lib/proposals/packages";
import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";
import type { ProposalMediaItem, ProposalMediaKind, TreatmentProposalRecord } from "@/lib/proposals/types";
import {
  autoGenerateOptions,
  calculateDiscount,
  calculateMonthlyPayment,
  calculateSubtotal,
  calculateTotal,
  discountLabel,
  type DiscountType,
  type ProposalOption,
  type ProposalService,
} from "@/lib/proposals/utils";

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
  "Weight Loss Programs",
  "Peptides",
  "InMode Trifecta",
  "Injectables",
  "Body & Wellness",
  "Regenerative",
  "Skin & Face",
  "Laser",
  "Retail",
];

const DISCOUNT_MODES: Array<{ value: DiscountType; label: string }> = [
  { value: "none", label: "No extra discount" },
  { value: "package", label: "Package pricing (as listed)" },
  { value: "percentage", label: "Percentage off" },
  { value: "dollar", label: "Dollar amount off" },
  { value: "custom", label: "Custom total price" },
];

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

type ProposalBuilderProps = {
  proposalId?: string;
};

export function ProposalBuilder({ proposalId }: ProposalBuilderProps) {
  const router = useRouter();
  const isEditing = Boolean(proposalId);
  const [draftId] = useState(() => proposalId?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || newDraftId());
  const [loadingExisting, setLoadingExisting] = useState(isEditing);
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

  const groupedServices = useMemo(() => {
    const grouped = HELLO_GORGEOUS_SERVICES.reduce<Record<string, typeof HELLO_GORGEOUS_SERVICES>>(
      (acc, service) => {
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

  const toggleService = (serviceId: string) => {
    const service = HELLO_GORGEOUS_SERVICES.find((item) => item.id === serviceId);
    if (!service) return;

    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.id === serviceId);
      if (exists) return prev.filter((item) => item.id !== serviceId);
      return [...prev, { ...service, quantity: 1 }];
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
    setSelectedServices((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, quantity: Math.max(1, quantity || 1) } : item))
    );
    setOptions([]);
  };

  const toggleConcern = (concern: string) => {
    setConcerns((prev) => (prev.includes(concern) ? prev.filter((item) => item !== concern) : [...prev, concern]));
  };

  const updateOptionPricing = (optionName: string, patch: Partial<Pick<ProposalOption, "discountType" | "discountValue">>) => {
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

  if (loadingExisting) {
    return <div className="p-8 text-sm text-black/70">Loading proposal…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-black">
            {isEditing ? "Edit treatment proposal" : "Treatment Proposal Builder"}
          </h1>
          <p className="mt-2 text-sm text-black/70">
            Packages, discounts, instructions, and before/after photos — all synced to the shareable client link.
          </p>
        </div>
        {isEditing && proposalId ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/proposals/${proposalId}/preview`}
              className="rounded-full border border-black px-4 py-2 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Preview
            </Link>
            <Link href="/admin/proposals" className="rounded-full border border-black/30 px-4 py-2 text-sm font-bold text-black/70">
              All proposals
            </Link>
          </div>
        ) : null}
      </div>

      <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#FF2D8E]">
        <h2 className="text-xl font-bold text-black">Client information</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-lg border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Client name"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
          />
          <input
            className="rounded-lg border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Email"
            type="email"
            value={clientEmail}
            onChange={(event) => setClientEmail(event.target.value)}
          />
          <input
            className="rounded-lg border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Phone"
            value={clientPhone}
            onChange={(event) => setClientPhone(event.target.value)}
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-black">Consult concerns</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {CONCERN_OPTIONS.map((concern) => (
              <label key={concern} className="flex items-center gap-2 rounded-lg border border-black/15 px-3 py-2 text-sm">
                <input type="checkbox" checked={concerns.includes(concern)} onChange={() => toggleConcern(concern)} />
                {concern}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-black">Client instructions (shown on share link)</p>
          <textarea
            rows={4}
            value={clientInstructions}
            onChange={(event) => setClientInstructions(event.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Example: Arrive 15 min early. No retinoids 5 days before Solaria. Text us to book your first Morpheus8."
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-black">Internal notes (staff only)</p>
          <textarea
            rows={3}
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-black/20 px-3 py-2 text-sm text-black"
            placeholder="Provider notes, objections, follow-up context."
          />
        </div>
      </section>

      <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#FF2D8E]">
        <h2 className="text-xl font-bold text-black">Before & after photos</h2>
        <p className="mt-1 text-sm text-black/70">
          Upload reference photos so the proposal, share link, and PDF stay in sync.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
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
                    : "+ Before & after pair"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(uploadingKind)}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadMedia(file, kind);
                  event.target.value = "";
                }}
              />
            </label>
          ))}
        </div>
        {media.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {media.map((item) => (
              <figure key={item.id} className="overflow-hidden rounded-xl border-2 border-black bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label || item.kind} className="h-40 w-full object-cover" />
                <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="font-semibold uppercase tracking-wide text-[#E6007E]">{item.label || item.kind}</span>
                  <button type="button" onClick={() => removeMedia(item.id)} className="font-bold text-black/60 hover:text-red-600">
                    Remove
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-black/55">No photos yet — optional, but great for consult follow-up.</p>
        )}
      </section>

      <section className="rounded-2xl border-4 border-black bg-[#FFF0F7] p-6 shadow-[8px_8px_0_0_#FF2D8E]">
        <h2 className="text-xl font-bold text-black">Quick-add packages</h2>
        <p className="mt-1 text-sm text-black/70">One tap adds the fixed package price — then discount or set a custom total below.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PROPOSAL_PACKAGES.map((pkg) => {
            const selected = selectedServices.some((item) => item.id === pkg.id);
            return (
              <article key={pkg.id} className="rounded-xl border-2 border-black bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-black">{pkg.name}</h3>
                    <p className="mt-1 text-2xl font-black text-[#E6007E]">${pkg.price.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-black/70">{pkg.description}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-black/80">
                      {pkg.bullets.map((bullet) => (
                        <li key={bullet}>• {bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => (selected ? toggleService(pkg.id) : addPackage(pkg.id))}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                      selected ? "border-2 border-black bg-white text-black" : "bg-[#E6007E] text-white"
                    }`}
                  >
                    {selected ? "Remove" : "Add"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#FF2D8E]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-black">Service selection</h2>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedServices.length}
            className="rounded-full bg-[#E6007E] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            Auto-generate options
          </button>
        </div>
        {selectedServices.length ? (
          <p className="mt-2 text-xs font-semibold text-[#E6007E]">
            {selectedServices.length} selected · ${calculateSubtotal(selectedServices).toLocaleString()} before plan discounts
          </p>
        ) : null}
        <div className="mt-4 space-y-5">
          {groupedServices.map(([category, services]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#E6007E]">{category}</h3>
              <div className="mt-2 space-y-2">
                {services.map((service) => {
                  const selected = selectedServices.find((item) => item.id === service.id);
                  return (
                    <div key={service.id} className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-3">
                      <input type="checkbox" checked={Boolean(selected)} onChange={() => toggleService(service.id)} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">{service.name}</p>
                        <p className="text-xs text-black/70">
                          ${service.price} {service.unit}
                          {service.description ? ` · ${service.description}` : ""}
                        </p>
                      </div>
                      {selected && !service.id.startsWith("pkg-") ? (
                        <input
                          type="number"
                          min={1}
                          value={selected.quantity}
                          onChange={(event) => updateQuantity(service.id, Number(event.target.value))}
                          className="w-20 rounded-md border border-black/20 px-2 py-1 text-sm"
                          aria-label={`${service.name} quantity`}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black text-black">Proposal options & pricing</h2>
        {!options.length ? (
          <div className="rounded-xl border border-dashed border-black/30 bg-white p-8 text-center text-sm text-black/70">
            Select a package and/or services, then click auto-generate. You can set % off, $ off, or a custom total on each plan.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {options.map((option, index) => {
              const subtotal = calculateSubtotal(option.services);
              const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
              const total = calculateTotal(option);
              const monthly = calculateMonthlyPayment(total, 24);
              const showValueInput = option.discountType === "percentage" || option.discountType === "dollar" || option.discountType === "custom";

              return (
                <article
                  key={option.name}
                  className="rounded-2xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#FF2D8E]"
                >
                  <h3 className="text-xl font-bold text-black">{option.name}</h3>
                  {index === 1 ? (
                    <span className="mt-2 inline-block rounded-full bg-[#E6007E] px-3 py-1 text-xs font-bold text-white">
                      BEST VALUE
                    </span>
                  ) : null}
                  <ul className="mt-4 space-y-1 text-sm text-black/80">
                    {option.services.map((service) => (
                      <li key={`${option.name}-${service.id}`}>
                        - {service.name}
                        {service.quantity > 1 ? ` (${service.quantity})` : ""}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-2 rounded-lg border border-black/15 bg-[#FFF0F7] p-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-black/60">
                      Discount / price
                    </label>
                    <select
                      value={option.discountType}
                      onChange={(event) =>
                        updateOptionPricing(option.name, { discountType: event.target.value as DiscountType })
                      }
                      className="w-full rounded-md border border-black/20 bg-white px-2 py-1.5 text-sm"
                    >
                      {DISCOUNT_MODES.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                    {showValueInput ? (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wide text-black/60">
                          {option.discountType === "percentage"
                            ? "Percent"
                            : option.discountType === "dollar"
                              ? "Dollars off"
                              : "Custom total ($)"}
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={option.discountType === "percentage" ? 1 : 1}
                          value={option.discountValue}
                          onChange={(event) =>
                            updateOptionPricing(option.name, { discountValue: Number(event.target.value) || 0 })
                          }
                          className="mt-1 w-full rounded-md border border-black/20 bg-white px-2 py-1.5 text-sm"
                        />
                      </div>
                    ) : null}
                    <p className="text-[11px] text-black/55">{discountLabel(option)}</p>
                  </div>

                  <div className="mt-4 border-t border-black/15 pt-3 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#E6007E]">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-xs text-black/60">${monthly.toFixed(2)}/mo at 24 months (0% APR example)</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !options.length}
          className="rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save changes and open preview" : "Save proposal and open preview"}
        </button>
      </div>
    </div>
  );
}
