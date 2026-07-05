"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { RegenBannerLogo } from "@/components/regen/RegenLogo";
import { FlowWaveRxPromoBand } from "@/components/flowwave/FlowWaveRxPromoBand";
import { REGEN_LAUNCH_PRICING } from "@/lib/regen-brand";
import { REGEN_GOALS, REGEN_SITE, type RegenGoalId } from "@/lib/regen-site";

function GoalIcon({ icon }: { icon: string }) {
  const cls = "h-8 w-8";
  switch (icon) {
    case "scale":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    case "sun":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "dna":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case "beaker":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    default:
      return null;
  }
}

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSpa = searchParams.get("utm_source") === "spa";

  const handleGoalSelect = (goalId: RegenGoalId) => {
    const goal = REGEN_GOALS.find((g) => g.id === goalId);
    if (!goal) return;
    const utm = fromSpa ? "?utm_source=spa" : "";
    router.push(`${goal.href}${utm}`);
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Link href="/rx" className="mb-6 inline-block">
          <RegenBannerLogo width={300} priority />
        </Link>

        {fromSpa ? (
          <div className="mb-6 rounded-2xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3 text-sm font-medium text-[#9b0a4d]">
            Welcome from Hello Gorgeous Med Spa — pick a goal to start RE GEN on your phone.
          </div>
        ) : null}

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-neutral-900">What brings you to RE GEN?</h1>
          <p className="mt-2 text-neutral-600">
            NP-supervised prescriptions shipped across Illinois · GLP-1 {REGEN_LAUNCH_PRICING.glp1}
          </p>

          <div className="mt-8 grid gap-3">
            {REGEN_GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => handleGoalSelect(goal.id)}
                className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:border-[#E6007E]/30 hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition group-hover:bg-[#FFF0F7] group-hover:text-[#E6007E]">
                  <GoalIcon icon={goal.icon} />
                </div>
                <div>
                  <span className="font-semibold text-neutral-900">{goal.title}</span>
                  {goal.tag ? (
                    <span className="ml-2 rounded-full bg-[#E6007E]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#E6007E]">
                      {goal.tag}
                    </span>
                  ) : null}
                  <p className="mt-0.5 text-sm text-neutral-500">{goal.priceNote}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-neutral-100 pt-6 text-sm">
            <Link href="/rx/learn/how-regen-works" className="font-semibold text-[#E6007E] hover:underline">
              How RE GEN works →
            </Link>
            <a href={`tel:${REGEN_SITE.phone.replace(/\D/g, "")}`} className="text-neutral-600 hover:text-neutral-900">
              {REGEN_SITE.phone}
            </a>
          </div>
        </div>

        <FlowWaveRxPromoBand />
      </div>
    </div>
  );
}

export default function RxStartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-neutral-50">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      }
    >
      <IntakeContent />
    </Suspense>
  );
}
