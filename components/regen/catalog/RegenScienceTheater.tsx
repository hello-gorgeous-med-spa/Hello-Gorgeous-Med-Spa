"use client";

import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  { label: "Tissue repair", detail: "BPC-157 · TB-500" },
  { label: "GH axis", detail: "Sermorelin · CJC / Ipamorelin" },
  { label: "Metabolic", detail: "GLP-1 · peptide support" },
  { label: "Cellular energy", detail: "NAD+ · MOTS-c" },
] as const;

type Props = {
  onShopGoals?: () => void;
};

export function RegenScienceTheater({ onShopGoals }: Props) {
  return (
    <section
      id="science"
      className="scroll-mt-[148px] relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(255,45,142,0.2) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 0% 70%, rgba(184,129,115,0.12) 0%, transparent 50%), linear-gradient(180deg, #0a0610 0%, #050308 50%, #12081a 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden
        style={{
          background:
            "linear-gradient(125deg, transparent 26%, rgba(255,220,180,0.12) 48%, rgba(255,45,142,0.1) 55%, transparent 76%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF2D8E]/35 bg-[#FF2D8E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC] backdrop-blur">
            The science
          </p>
          <h2 className="mt-4 font-serif text-4xl font-black tracking-tight text-white lg:text-5xl">
            What peptides are —{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              before you shop
            </span>
          </h2>
          <p
            className="mt-2 text-sm font-black uppercase tracking-[0.28em]"
            style={{
              background: "linear-gradient(90deg, #F5D76E 0%, #FF2D8E 55%, #E6007E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Learn · Then choose your goal
          </p>
          <p className="mt-3 text-base font-medium leading-relaxed text-white/65">
            Peptides are short chains of amino acids — precision messengers that tell cells to
            repair tissue, support metabolism, balance hormones, or boost cellular energy. Not one
            drug. A toolkit matched to your goals after NP review.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-[#FF2D8E]/25 bg-white/5 px-4 py-4 backdrop-blur"
            >
              <p
                className="text-[11px] font-black uppercase tracking-[0.16em]"
                style={{
                  background: "linear-gradient(90deg, #F5D76E, #FFD700)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {p.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-white/80">{p.detail}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-[#FF2D8E]/30 shadow-[0_28px_60px_-20px_rgba(230,0,126,0.45)]">
          <div className="relative aspect-[16/9] w-full bg-black sm:aspect-[21/9]">
            <Image
              src="/images/regen/science/metabolic-shift.jpg"
              alt="Peptide-supported metabolic shift — glucose-burning versus fat-burning"
              fill
              className="object-contain object-center sm:object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
          <p className="border-t border-white/10 bg-black/80 px-4 py-3 text-center text-[11px] font-medium text-white/50">
            For educational purposes. Individual results vary. Consultation required.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:gap-4">
          <article className="group overflow-hidden rounded-2xl border border-[#B88173]/40 bg-[#0a0610] shadow-[0_14px_28px_-12px_rgba(184,129,115,0.35)]">
            <div className="relative aspect-[2/1] w-full">
              <Image
                src="/images/regen/science/hcg-mens.jpg"
                alt="HCG — supports natural hormone production and reproductive health"
                fill
                className="object-cover object-top transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E8C4B8]">
                  Men&apos;s hormone science
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-black text-white">HCG</h3>
                <p className="mt-0.5 text-xs font-medium leading-snug text-white/70">
                  Fertility · testosterone · testicular function
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3.5 py-2.5">
              <p className="text-[10px] font-medium text-white/50">NP-reviewed</p>
              <Link
                href="/rx?goal=hormones"
                className="text-xs font-black text-[#FF2D8E] hover:text-white"
              >
                Shop →
              </Link>
            </div>
          </article>

          <article className="group overflow-hidden rounded-2xl border border-[#B88173]/40 bg-[#0a0610] shadow-[0_14px_28px_-12px_rgba(184,129,115,0.35)]">
            <div className="relative aspect-[2/1] w-full">
              <Image
                src="/images/regen/science/enclomiphene-mens.jpg"
                alt="Enclomiphene — stimulates natural testosterone production"
                fill
                className="object-cover object-top transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E8C4B8]">
                  Men&apos;s hormone science
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-black text-white">Enclomiphene</h3>
                <p className="mt-0.5 text-xs font-medium leading-snug text-white/70">
                  Testosterone · fertility · energy &amp; libido
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3.5 py-2.5">
              <p className="text-[10px] font-medium text-white/50">Clinical match required</p>
              <Link
                href="/rx?goal=hormones"
                className="text-xs font-black text-[#FF2D8E] hover:text-white"
              >
                Shop →
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onShopGoals ? (
            <button
              type="button"
              onClick={onShopGoals}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 text-sm font-black text-white shadow-[0_0_28px_rgba(255,45,142,0.45)] transition hover:brightness-110"
            >
              Shop by goal →
            </button>
          ) : null}
          <Link
            href="/peptides"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-[#FF2D8E] hover:bg-[#FF2D8E]/15"
          >
            Full peptide hub →
          </Link>
        </div>
      </div>
    </section>
  );
}
