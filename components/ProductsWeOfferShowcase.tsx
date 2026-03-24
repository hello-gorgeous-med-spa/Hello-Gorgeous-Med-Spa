"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BOOKING_URL } from "@/lib/flows";
import PRODUCT_OFFER_LEARN from "@/lib/products-we-offer-learn.json";
import {
  PRODUCT_OFFER_CATEGORIES,
  type ProductOfferBadge,
  type ProductOfferCard,
} from "@/lib/products-we-offer-cards";
import { productOfferAnchorId } from "@/lib/products-we-offer-seo";

type LearnBlock = {
  what: string;
  how: string;
  good: string;
  expect: string;
  side: string;
};

type LearnByCategory = Record<string, LearnBlock[]>;

const LEARN = PRODUCT_OFFER_LEARN as LearnByCategory;

const MODAL_SECTIONS: { key: keyof LearnBlock; label: string }[] = [
  { key: "what", label: "What is it?" },
  { key: "how", label: "How is it taken?" },
  { key: "good", label: "Who is it good for?" },
  { key: "expect", label: "What to expect" },
  { key: "side", label: "Side effects" },
];

const BADGE_CLASS: Record<ProductOfferBadge, string> = {
  rx: "bg-[#FFF0F7] text-[#E6007E] border border-[#E6007E]/30",
  popular: "bg-[#FFF8E8] text-black border border-black/15",
  controlled: "bg-white text-[#C90A68] border-2 border-black",
  cold: "bg-[#EEF6FF] text-black border border-black/15",
};

export function ProductsWeOfferShowcase() {
  const [activeId, setActiveId] = useState(PRODUCT_OFFER_CATEGORIES[0]?.id ?? "weight");
  const [modal, setModal] = useState<{
    card: ProductOfferCard;
    learn: LearnBlock;
  } | null>(null);

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modal]);

  return (
    <div className="max-w-[1060px] mx-auto w-full">
      <p className="text-[0.72rem] tracking-[0.12em] uppercase text-[#E6007E] font-medium font-sans mb-2">
        Services &amp; treatments
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-light text-black leading-tight mb-7">
        What we <em className="italic text-[#E6007E]">offer</em>
      </h1>

      <div
        className="flex flex-wrap gap-2 mb-7"
        role="tablist"
        aria-label="Product categories"
      >
        {PRODUCT_OFFER_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`prod-tab-${cat.id}`}
              aria-controls={`prod-panel-${cat.id}`}
              onClick={() => setActiveId(cat.id)}
              className={`px-4 py-2 rounded-full border text-sm font-sans font-normal transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "bg-[#E6007E] border-[#E6007E] text-white font-medium shadow-sm"
                  : "bg-white border-[#E6007E]/35 text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              }`}
            >
              {cat.navLabel}
            </button>
          );
        })}
      </div>

      {PRODUCT_OFFER_CATEGORIES.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <div
            key={cat.id}
            id={`prod-panel-${cat.id}`}
            role="tabpanel"
            aria-labelledby={`prod-tab-${cat.id}`}
            hidden={!isActive}
            className={isActive ? "block" : "hidden"}
          >
            <header className="mb-6">
              <p className="text-[0.68rem] tracking-[0.12em] uppercase text-[#E6007E] font-medium font-sans mb-1">
                {cat.eyebrow}
              </p>
              <h3 className="font-serif text-[1.9rem] font-light text-black leading-tight">
                {cat.titleBefore}
                <em className="italic text-[#E6007E]">{cat.titleEm}</em>
                {cat.titleAfter}
              </h3>
              <p className="mt-2 font-sans text-sm text-black/80 font-light leading-relaxed max-w-[560px]">
                {cat.description}
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {cat.cards.map((p, idx) => {
                const learn = LEARN[cat.id]?.[idx];
                return (
                  <article
                    id={productOfferAnchorId(cat.id, idx)}
                    key={p.name}
                    className="bg-white border border-[#E6007E]/25 rounded-md px-[1.1rem] py-5 flex flex-col transition-transform duration-150 hover:-translate-y-0.5 shadow-sm scroll-mt-24"
                  >
                    <span
                      className={`inline-block self-start text-[0.65rem] font-medium tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full mb-2.5 ${BADGE_CLASS[p.badge]}`}
                    >
                      {p.label}
                    </span>
                    <h4 className="font-serif text-[1.05rem] font-normal text-black leading-snug mb-1">{p.name}</h4>
                    <p className="font-sans text-[0.75rem] text-black/70 font-light mb-2.5">{p.form}</p>
                    <p className="font-sans text-[0.8rem] text-black/75 font-light leading-relaxed mb-3.5 flex-1">
                      {p.desc}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-2 border-t border-[#E6007E]/20 pt-3 ${learn ? "justify-between" : "justify-end"}`}
                    >
                      {learn ? (
                        <button
                          type="button"
                          onClick={() => setModal({ card: p, learn })}
                          className="inline-flex items-center justify-center border border-[#E6007E]/35 text-[#C90A68] bg-white text-[0.75rem] font-medium tracking-wide px-3.5 py-1.5 rounded-sm hover:bg-[#FFF5F9] hover:border-[#E6007E] transition-colors"
                        >
                          Learn more
                        </button>
                      ) : null}
                      <Link
                        href={BOOKING_URL}
                        className="inline-flex items-center justify-center bg-[#E6007E] text-white text-[0.75rem] font-medium tracking-wide px-3.5 py-1.5 rounded-sm hover:bg-[#C90A68] transition-colors"
                      >
                        Book now
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 rounded-md border border-[#E6007E]/25 bg-[#FFF5F9] px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="font-sans text-sm text-black/80 font-light">
                <strong className="text-black font-medium">{cat.consultBold}</strong>
                {cat.consultRest}
              </p>
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center shrink-0 bg-[#E6007E] text-white font-sans text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-[#C90A68] transition-colors"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        );
      })}

      {modal ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prod-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/45"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-[560px] max-h-[88vh] overflow-y-auto rounded-lg bg-white shadow-lg border border-[#E6007E]/20 px-6 sm:px-8 pt-8 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 text-2xl leading-none text-black/45 hover:text-black hover:bg-black/5 rounded px-2 py-0.5 transition-colors"
            >
              ×
            </button>
            <span
              className={`inline-block text-[0.65rem] font-medium tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full mb-2 ${BADGE_CLASS[modal.card.badge]}`}
            >
              {modal.card.label}
            </span>
            <h2
              id="prod-modal-title"
              className="font-serif text-[1.5rem] font-light text-black leading-tight pr-8"
            >
              {modal.card.name}
            </h2>
            <p className="font-sans text-[0.78rem] text-black/60 font-light mb-4">{modal.card.form}</p>
            <hr className="border-0 border-t border-[#E6007E]/25 my-3" />
            <div className="space-y-4">
              {MODAL_SECTIONS.map(({ key, label }) => {
                const text = modal.learn[key];
                if (!text) return null;
                return (
                  <div key={key}>
                    <p className="text-[0.68rem] tracking-[0.1em] uppercase text-[#E6007E] font-medium font-sans mb-1.5">
                      {label}
                    </p>
                    <p className="font-sans text-[0.88rem] text-black/80 font-light leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-[#E6007E]/20 flex flex-wrap gap-3">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center bg-[#E6007E] text-white text-[0.8rem] font-medium px-4 py-2 rounded-sm hover:bg-[#C90A68] transition-colors"
              >
                Book a consultation
              </Link>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="inline-flex items-center justify-center border border-[#E6007E]/35 text-[#C90A68] bg-white text-[0.8rem] font-medium px-4 py-2 rounded-sm hover:bg-[#FFF5F9] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
