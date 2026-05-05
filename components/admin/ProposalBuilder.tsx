"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";
import {
  autoGenerateOptions,
  calculateDiscount,
  calculateMonthlyPayment,
  calculateSubtotal,
  calculateTotal,
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

export function ProposalBuilder() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [internalNotes, setInternalNotes] = useState("");
  const [selectedServices, setSelectedServices] = useState<ProposalService[]>([]);
  const [options, setOptions] = useState<ProposalOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupedServices = useMemo(() => {
    return HELLO_GORGEOUS_SERVICES.reduce<Record<string, typeof HELLO_GORGEOUS_SERVICES>>((acc, service) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    }, {});
  }, []);

  const toggleService = (serviceId: string) => {
    const service = HELLO_GORGEOUS_SERVICES.find((item) => item.id === serviceId);
    if (!service) return;

    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.id === serviceId);
      if (exists) return prev.filter((item) => item.id !== serviceId);
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, quantity: Math.max(1, quantity || 1) } : item))
    );
  };

  const toggleConcern = (concern: string) => {
    setConcerns((prev) => (prev.includes(concern) ? prev.filter((item) => item !== concern) : [...prev, concern]));
  };

  const handleGenerate = () => {
    setOptions(autoGenerateOptions(selectedServices));
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
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || null,
          clientPhone: clientPhone.trim() || null,
          concerns,
          options,
          internalNotes: internalNotes.trim() || null,
        }),
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-black text-black">Treatment Proposal Builder</h1>
        <p className="mt-2 text-sm text-black/70">
          Build Good / Better / Best treatment plans with pricing and timeline in one consult flow.
        </p>
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
          <p className="text-sm font-semibold text-black">Internal notes</p>
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
        <div className="flex items-center justify-between">
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
        <div className="mt-4 space-y-5">
          {Object.entries(groupedServices).map(([category, services]) => (
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
                        </p>
                      </div>
                      {selected ? (
                        <input
                          type="number"
                          min={1}
                          value={selected.quantity}
                          onChange={(event) => updateQuantity(service.id, Number(event.target.value))}
                          className="w-20 rounded-md border border-black/20 px-2 py-1 text-sm"
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
        <h2 className="text-2xl font-black text-black">Proposal options</h2>
        {!options.length ? (
          <div className="rounded-xl border border-dashed border-black/30 bg-white p-8 text-center text-sm text-black/70">
            Select services and click auto-generate to build Good / Better / Best plans.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {options.map((option, index) => {
              const subtotal = calculateSubtotal(option.services);
              const discount = calculateDiscount(subtotal, option.discountType, option.discountValue);
              const total = calculateTotal(option);
              const monthly = calculateMonthlyPayment(total, 24);

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
                      <li key={`${option.name}-${service.id}`}>- {service.name}{service.quantity > 1 ? ` (${service.quantity})` : ""}</li>
                    ))}
                  </ul>
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
          {saving ? "Saving..." : "Save proposal and open preview"}
        </button>
      </div>
    </div>
  );
}
