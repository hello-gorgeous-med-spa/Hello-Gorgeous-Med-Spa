import Link from "next/link";

import { FadeUp } from "@/components/Section";
import {
  RX_PATIENT_JOURNEY_HEADLINE,
  RX_PATIENT_JOURNEY_STEPS,
  RX_PATIENT_JOURNEY_SUBLINE,
} from "@/lib/rx-patient-journey";

type Props = {
  surface?: "light" | "rose";
  className?: string;
};

export function RxPatientJourneyBand({ surface = "light", className = "" }: Props) {
  const isRose = surface === "rose";
  const wrap = isRose
    ? "bg-gradient-to-b from-white to-[#FFF0F7] border-y-4 border-black"
    : "bg-white border-y border-black/10";

  return (
    <section className={`${wrap} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-14 lg:px-6">
        <FadeUp>
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
            Hello Gorgeous RX™
          </p>
          <h2 className="mt-3 text-center text-2xl font-black text-black md:text-3xl">
            {RX_PATIENT_JOURNEY_HEADLINE}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium text-black/65 md:text-base">
            {RX_PATIENT_JOURNEY_SUBLINE}
          </p>
        </FadeUp>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RX_PATIENT_JOURNEY_STEPS.map((item, i) => (
            <FadeUp key={item.step} delayMs={i * 50}>
              <li className="flex h-full flex-col rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-bold text-black">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/65">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-4 text-sm font-bold text-[#E6007E] hover:underline"
                >
                  {item.cta} →
                </Link>
              </li>
            </FadeUp>
          ))}
        </ol>

        <p className="mt-8 text-center text-xs text-black/50">
          Returning patient?{" "}
          <Link href="/rx/care" className="font-semibold text-[#E6007E] hover:underline">
            Go straight to the care hub for refills
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
