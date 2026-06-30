"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { RegenLogo } from "@/components/regen/RegenLogo";
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
  const preselectedGoal = searchParams.get("goal") as RegenGoalId | null;

  const [step, setStep] = useState<"goal" | "details" | "done">(preselectedGoal ? "details" : "goal");
  const [selectedGoal, setSelectedGoal] = useState<RegenGoalId | null>(preselectedGoal);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const selectedGoalData = REGEN_GOALS.find((g) => g.id === selectedGoal);

  const handleGoalSelect = (goalId: RegenGoalId) => {
    setSelectedGoal(goalId);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("done");
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      <div className="mx-auto max-w-xl px-4 py-12">
        <Link href="/rx" className="mb-8 inline-block">
          <RegenLogo width={140} />
        </Link>

        {step === "goal" && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-semibold text-neutral-900">What brings you to RE GEN?</h1>
            <p className="mt-2 text-neutral-600">Pick a goal and we'll tailor your intake.</p>

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
                  <span className="font-semibold text-neutral-900">{goal.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-semibold text-neutral-900">A few details</h1>
            <p className="mt-2 text-neutral-600">
              So a provider can follow up about{" "}
              <strong className="text-[#E6007E]">{selectedGoalData?.title}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-[#E6007E] focus:outline-none focus:ring-2 focus:ring-[#E6007E]/20"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-[#E6007E] focus:outline-none focus:ring-2 focus:ring-[#E6007E]/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-[#E6007E] focus:outline-none focus:ring-2 focus:ring-[#E6007E]/20"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep("goal");
                    setSelectedGoal(null);
                  }}
                  className="rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#E6007E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "done" && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-neutral-900">You're all set!</h1>
            <p className="mt-2 text-neutral-600">
              Thanks for completing your intake. A nurse-practitioner-directed provider will review
              it and reach out — often the same day.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={`tel:+16306366193`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
              >
                Call {REGEN_SITE.phone}
              </Link>
              <button
                type="button"
                onClick={() => router.push("/rx")}
                className="rounded-lg bg-[#E6007E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RxStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    }>
      <IntakeContent />
    </Suspense>
  );
}
