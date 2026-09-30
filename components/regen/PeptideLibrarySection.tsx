"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PEPTIDE_LIBRARY,
  PEPTIDE_CATEGORIES,
  PEPTIDE_LIBRARY_HERO,
  type PeptideInfo,
} from "@/lib/regen/peptide-library";

const BRAND = {
  pink: "#FF6FAE",
  pinkDark: "#E91E8C",
  dark: "#0F0F0F",
  darkAlt: "#151515",
  cream: "#F5EEE6",
  gray: "#9A9A9A",
};

function MoleculeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 32" className={className} aria-hidden>
      <path
        d="M0 16 H42 L48 16 L54 2 L62 30 L70 8 L76 16 H90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M104 6 v8 M100 10 h8" />
        <path d="M128 8 v6 M125 11 h6" opacity="0.6" />
        <path d="M150 5 v8 M146 9 h8" opacity="0.8" />
      </g>
      <path
        d="M166 16 H200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function CategoryDivider({ label }: { label: string }) {
  return (
    <div className="col-span-full mt-14 mb-8 first:mt-0 flex items-center gap-4">
      <div className="h-px flex-1 bg-[#2A2A2A]" />
      <div className="flex items-center gap-3 px-1">
        <MoleculeIcon className="w-[76px] h-[20px] text-[#FF8FBB] drop-shadow-[0_0_8px_rgba(255,111,174,0.6)]" />
        <span className="text-[11px] tracking-[0.22em] font-medium text-[#FF8FBB] uppercase whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="h-px flex-1 bg-[#2A2A2A]" />
    </div>
  );
}

function PeptideCard({ peptide, onClick }: { peptide: PeptideInfo; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left p-6 rounded-[16px] border border-[#2A2A2A] bg-[#151515] transition-all hover:border-[#FF6FAE]/40 hover:bg-[#1A1A1A] min-h-[192px] flex flex-col"
    >
      <p className="text-[10px] tracking-[0.18em] font-medium text-[#8A8A8A] uppercase mb-1">
        {peptide.category}
      </p>
      <h3 className="text-[18px] font-bold tracking-[-0.01em] text-[#E8E8E8] mb-3">
        {peptide.name}
      </h3>
      <p className="text-[13px] leading-[1.55] text-[#9A9A9A] flex-1">
        {peptide.oneLiner}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#FF8FBB]">
          {peptide.priceFrom}
        </span>
        <span className="text-[12px] font-medium text-[#666] group-hover:text-[#FF8FBB] transition-colors">
          Learn more →
        </span>
      </div>
    </button>
  );
}

function PeptideModal({
  peptide,
  onClose,
}: {
  peptide: PeptideInfo | null;
  onClose: () => void;
}) {
  if (!peptide) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] max-h-[92vh] overflow-y-auto rounded-t-[24px] bg-[#111111] border border-[#212121] animate-[in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111111]/95 backdrop-blur px-6 py-5 border-b border-[#1E1E1E]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-medium text-[#FF8FBB] uppercase mb-1">
                {peptide.category}
              </p>
              <h2 className="text-[26px] font-bold tracking-[-0.02em] text-white">
                {peptide.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* One-liner */}
          <div className="rounded-[12px] bg-[#161616] border border-[#2A2A2A] p-[1px]">
            <div className="bg-[radial-gradient(ellipse_at_top,rgba(255,111,174,0.08),transparent_60%)] rounded-[12px] px-5 py-[14px]">
              <p className="text-[14.5px] leading-[1.5] text-white font-medium italic">
                "{peptide.oneLiner}"
              </p>
            </div>
          </div>

          {/* What it does */}
          <div>
            <h3 className="text-[11px] tracking-[0.14em] font-semibold text-[#FF8FBB]/80 uppercase mb-2">
              What it does
            </h3>
            <p className="text-[14px] leading-[1.6] text-[#CCCCCC]">
              {peptide.whatItDoes}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-[11px] tracking-[0.14em] font-semibold text-[#FF8FBB]/80 uppercase mb-3">
              Benefits
            </h3>
            <div className="space-y-2.5">
              {peptide.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-[7px] w-[5px] h-[5px] rounded-full shrink-0 bg-[#FF6FAE] shadow-[0_0_8px_rgba(255,111,174,0.6)]" />
                  <span className="text-[13.5px] leading-[1.5] text-[#CCCCCC]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal for */}
          <div className="rounded-[12px] bg-[#0E0E0E] border border-[#1E1E1E] px-5 py-[14px]">
            <p className="text-[11px] tracking-[0.12em] font-semibold text-[#666] uppercase mb-1">
              Ideal for
            </p>
            <p className="text-[14px] leading-[1.5] text-[#E8E8E8]">
              {peptide.idealFor}
            </p>
          </div>

          {/* Clinician note */}
          <div className="rounded-[12px] bg-gradient-to-r from-transparent via-[#FF6FAE] to-transparent h-[1px] opacity-[0.07]" />
          <div>
            <p className="text-[11px] tracking-[0.12em] font-semibold text-[#555] uppercase mb-2">
              Clinician note
            </p>
            <p className="text-[13px] leading-[1.6] text-[#8A8A8A] italic">
              "{peptide.clinicianNote}"
            </p>
          </div>

          {/* Price + CTA */}
          <div className="pt-5 pb-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] text-[#666] uppercase tracking-[0.08em]">From</p>
              <p className="text-[26px] font-bold text-[#FF8FBB]">{peptide.priceFrom}</p>
            </div>
            <a
              href="/start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6FAE] text-black font-semibold text-[14px] transition-all hover:brightness-110 shadow-[0_0_20px_rgba(255,111,174,0.4)]"
            >
              Start a request
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PeptideLibrarySection() {
  const [selectedPeptide, setSelectedPeptide] = useState<PeptideInfo | null>(null);

  // Group peptides by category
  const peptidesByCategory = PEPTIDE_CATEGORIES.map((cat) => ({
    category: cat,
    peptides: PEPTIDE_LIBRARY.filter((p) => p.category === cat),
  }));

  return (
    <section className="relative py-16 px-6" style={{ backgroundColor: BRAND.dark }}>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,111,174,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-4 mb-8">
            <Image
              src="/images/regen/logo-full.png"
              alt="REGEN RX"
              width={140}
              height={72}
              className="h-[72px] md:h-[88px] w-auto object-contain drop-shadow-[0_0_22px_rgba(255,143,187,0.35)]"
            />
            <MoleculeIcon className="w-[120px] h-[24px] text-[#FF8FBB] opacity-90" />
          </div>
          <p className="text-[11px] md:text-[12px] tracking-[0.38em] font-medium text-[#FF8FBB] uppercase mb-6">
            {PEPTIDE_LIBRARY_HERO.eyebrow}
          </p>
          <h2 className="font-serif text-[38px] leading-[0.95] md:text-[56px] md:leading-[0.9] tracking-[-0.02em] max-w-[760px] mx-auto font-normal text-white">
            {PEPTIDE_LIBRARY_HERO.headline.split("actually").map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <em className="text-[#FF8FBB] drop-shadow-[0_0_18px_rgba(255,111,174,0.35)]">
                    actually
                  </em>
                  {part}
                </span>
              )
            )}
          </h2>
          <p className="mt-6 max-w-[640px] mx-auto text-[14px] md:text-[15px] leading-[1.6] text-[#CCCCCC] font-light">
            {PEPTIDE_LIBRARY_HERO.subhead}
          </p>
        </div>

        {/* Peptide Grid by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {peptidesByCategory.map(({ category, peptides }) => (
            <>
              <CategoryDivider key={`cat-${category}`} label={category} />
              {peptides.map((peptide) => (
                <PeptideCard
                  key={peptide.id}
                  peptide={peptide}
                  onClick={() => setSelectedPeptide(peptide)}
                />
              ))}
            </>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-[13px] text-[#666] mb-4">
            Not sure which peptide is right for you?
          </p>
          <a
            href="/consult"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FF6FAE]/40 text-[#FF8FBB] font-semibold text-[14px] transition-all hover:border-[#FF6FAE] hover:bg-[#FF6FAE]/10"
          >
            Book a consult with our clinician
          </a>
        </div>
      </div>

      {/* Modal */}
      <PeptideModal peptide={selectedPeptide} onClose={() => setSelectedPeptide(null)} />

      {/* Google Fonts for serif */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .font-serif { font-family: 'Instrument Serif', Georgia, serif; }
      `}</style>
    </section>
  );
}

export default PeptideLibrarySection;
