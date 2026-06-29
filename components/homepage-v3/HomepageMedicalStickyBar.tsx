"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { GLP1_INTAKE_PATH } from "@/lib/flows";

type Props = {
  sectionId: string;
};

/** Mobile-only sticky bar while scrolling the medical lane. */
export function HomepageMedicalStickyBar({ sectionId }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const inSection = rect.top < window.innerHeight * 0.55 && rect.bottom > 72;
      setVisible(inSection);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionId]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-black bg-[#0a0a0a]/95 px-3 py-2.5 backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick RX actions"
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <Link
          href="#find-your-treatment"
          className="flex flex-1 items-center justify-center rounded-full bg-[#E6007E] px-3 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          Get prescribed
        </Link>
        <Link
          href="/portal/rx"
          className="flex flex-1 items-center justify-center rounded-full border border-white/25 px-3 py-2.5 text-xs font-bold text-white"
        >
          My RX
        </Link>
        <Link
          href={GLP1_INTAKE_PATH}
          className="hidden min-[380px]:flex flex-1 items-center justify-center rounded-full border border-white/25 px-3 py-2.5 text-xs font-bold text-[#FFB8DC]"
        >
          GLP-1
        </Link>
      </div>
    </div>
  );
}
