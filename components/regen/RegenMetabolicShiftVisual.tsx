import Image from "next/image";

const IMAGE_SRC = "/images/regen/metabolic-shift.png";
const IMAGE_ALT =
  "Peptide-supported metabolic shift — glucose-burning versus fat-burning energy utilization with RE GEN by Hello Gorgeous";

type Props = {
  /** `landing` = category hub band; `intake` = inside post-payment weight-loss screening */
  variant?: "landing" | "intake";
};

export function RegenMetabolicShiftVisual({ variant = "landing" }: Props) {
  if (variant === "intake") {
    return (
      <div className="mb-6 overflow-hidden rounded-2xl border-2 border-[#E6007E]/25 bg-[#0a0a0a]">
        <Image
          src={IMAGE_SRC}
          alt={IMAGE_ALT}
          width={1200}
          height={675}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 640px"
          priority={false}
        />
        <p className="border-t border-white/10 px-4 py-3 text-[11px] leading-relaxed text-white/50">
          For educational purposes. Individual results vary. Provider-guided peptide and GLP-1
          therapy requires consultation and approval before any prescription ships.
        </p>
      </div>
    );
  }

  return (
    <section className="border-y border-neutral-100 bg-neutral-950 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB8DC]">
          How RE GEN supports your goals
        </p>
        <h2 className="mt-3 text-center text-2xl font-semibold text-white sm:text-3xl">
          Peptide-supported{" "}
          <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
            metabolic shift
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/65">
          Provider-guided therapy may support the body&apos;s transition from glucose-driven energy
          toward improved fat utilization and metabolic efficiency — under NP supervision at Hello
          Gorgeous Med Spa.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(230,0,126,0.15)]">
          <Image
            src={IMAGE_SRC}
            alt={IMAGE_ALT}
            width={1200}
            height={675}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority={false}
          />
        </div>

        <p className="mt-4 text-center text-[11px] text-white/40">
          For educational purposes only. Individual results vary. Consultation and clinical approval
          required. hellogorgeousmedspa.com/rx
        </p>
      </div>
    </section>
  );
}
