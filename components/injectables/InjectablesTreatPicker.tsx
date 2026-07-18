"use client";

import { useState } from "react";
import Link from "next/link";

import { INJECTABLES_TREAT_GOALS } from "@/lib/injectables-treat-goals";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export function InjectablesTreatPicker() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const bookHref =
    selected.length > 0
      ? `${PRIMARY_BOOKING_CTA.href}?goals=${encodeURIComponent(selected.join(","))}`
      : PRIMARY_BOOKING_CTA.href;

  return (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
      <h2 className="font-serif text-2xl font-black tracking-tight text-black sm:text-3xl">
        What do you want to treat with Botox?
      </h2>
      <p className="mt-2 text-sm font-medium text-black/55">
        Tap what you’d like to address — we’ll tailor your plan at your free consult.
      </p>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-2.5">
        {INJECTABLES_TREAT_GOALS.map((goal) => {
          const active = selected.includes(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggle(goal.id)}
              className={`rounded-2xl border px-3 py-3.5 text-left text-sm font-semibold transition ${
                active
                  ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E] shadow-[0_0_0_1px_#E6007E]"
                  : "border-black/12 bg-white text-black hover:border-[#E6007E]/50"
              }`}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
      <Link
        href={bookHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full border-2 border-[#E6007E] bg-white px-6 py-3.5 text-sm font-extrabold text-[#E6007E] transition hover:bg-[#E6007E] hover:text-white"
      >
        Book my free consult →
      </Link>
    </div>
  );
}
