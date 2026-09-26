"use client";

import Image from "next/image";

import {
  formatRequestPrice,
  REGEN_REQUEST_HUB_LABEL,
  REGEN_REQUEST_SKUS,
  requestSkuImage,
  type RegenRequestIntent,
  type RegenRequestSku,
} from "@/lib/regen/refill-request-catalog";

const HUBS = ["peptides", "sexual-health", "dermatology"] as const;

export function RegenCompoundShop({
  selectedId,
  intent,
  serifClassName,
  staffView = false,
  onIntent,
  onPick,
}: {
  selectedId: string;
  intent: string;
  serifClassName: string;
  staffView?: boolean;
  onIntent: (intent: RegenRequestIntent) => void;
  onPick: (sku: RegenRequestSku) => void;
}) {
  return (
    <section className="border-b border-white/10 bg-[#08080c]">
      <div className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5c2c7]">REGEN RX · Compound shop</p>
        <h1 className={`${serifClassName} mt-3 text-[42px] leading-[0.9] tracking-[-0.03em] md:text-[56px]`}>
          Shop a protocol.
          <br />
          <span className="italic font-normal text-[#f5c2c7]">Request review.</span>
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55">
          Prices below are what you would pay if prescribed. This is not a cart — you pick what you want,
          complete screening, and Ryan reviews before any clinic invoice.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Pick a protocol", "See pack and patient price."],
            ["02", "Screen", "Same medical form. Ryan reviews before anything ships."],
            ["03", "Invoice after yes", "We send a clinic invoice. Then the pharmacy fills."],
          ].map(([n, title, body]) => (
            <li key={n} className="rounded-2xl border border-white/10 bg-[#0d0d11] px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-[#f5c2c7]">{n}</p>
              <p className={`${serifClassName} mt-1 text-[20px]`}>{title}</p>
              <p className="mt-1 text-[12px] text-white/45">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["refill", "I am requesting a refill"],
              ["add", "I would like to add"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onIntent(id)}
              className={`rounded-full border px-4 py-2 text-[12px] ${
                intent === id ? "border-[#f5c2c7] bg-[#f5c2c7] text-black" : "border-white/15 text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {HUBS.map((hub) => {
          const items = REGEN_REQUEST_SKUS.filter((s) => s.hub === hub);
          if (!items.length) return null;
          return (
            <div key={hub} className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">{REGEN_REQUEST_HUB_LABEL[hub]}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((sku) => {
                  const selected = selectedId === sku.id;
                  return (
                    <button
                      key={sku.id}
                      type="button"
                      onClick={() => onPick(sku)}
                      className={`group overflow-hidden rounded-[22px] border text-left transition ${
                        selected
                          ? "border-[#f5c2c7] bg-[#f5c2c7]/10"
                          : "border-white/10 bg-[#0d0d11] hover:border-[#f5c2c7]/50"
                      }`}
                    >
                      <div className="relative aspect-square bg-[#f6efe8]">
                        <Image
                          src={requestSkuImage(sku.id)}
                          alt={sku.name}
                          fill
                          className="object-contain p-5"
                          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                        />
                      </div>
                      <div className="px-4 pb-4 pt-2">
                        <p className={`${serifClassName} text-[22px] leading-tight`}>{sku.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-widest text-white/35">
                          {[
                            staffView && sku.sku !== "review" ? `SKU ${sku.sku}` : null,
                            sku.sku === "review" ? "Provider review" : null,
                            sku.investigational ? "Investigational" : null,
                            sku.inOffice ? "In-office" : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "\u00a0"}
                        </p>
                        <p className="mt-2 text-[13px] text-white/50">{sku.pack}</p>
                        <p className="mt-2 text-[15px] text-[#f5c2c7]">{formatRequestPrice(sku)}</p>
                        <p className="mt-3 text-[12px] text-white/55">
                          {selected
                            ? "Selected — complete screening below"
                            : intent === "add"
                              ? "Add this to my plan"
                              : "Request this protocol"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
