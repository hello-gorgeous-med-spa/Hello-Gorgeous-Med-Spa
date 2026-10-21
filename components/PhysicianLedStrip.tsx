import Image from "next/image";
import Link from "next/link";

import {
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_LICENSE_TITLE,
  MEDICAL_DIRECTOR_PUBLIC_LINE,
  MEDICAL_DIRECTOR_SPECIALTY,
} from "@/lib/medical-authority";

type Props = {
  className?: string;
};

/** Compact physician-led bar for flagship service pages. */
export function PhysicianLedStrip({ className = "" }: Props) {
  return (
    <section className={`border-b border-white/10 bg-[#111111] text-white ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <Image
          src={MEDICAL_DIRECTOR.image}
          alt={MEDICAL_DIRECTOR.imageAlt}
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-full object-cover object-top"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9fd6cf]">
            Physician-led care · Oswego, IL
          </p>
          <p className="mt-1 text-base font-semibold text-white">{MEDICAL_DIRECTOR.displayName}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/75">{MEDICAL_DIRECTOR_PUBLIC_LINE}</p>
        </div>
        <Link
          href={MEDICAL_DIRECTOR.profilePath}
          className="shrink-0 text-sm font-semibold text-[#9fd6cf] underline-offset-4 hover:underline sm:ml-auto"
        >
          {MEDICAL_DIRECTOR_LICENSE_TITLE} · {MEDICAL_DIRECTOR_SPECIALTY} →
        </Link>
      </div>
    </section>
  );
}
