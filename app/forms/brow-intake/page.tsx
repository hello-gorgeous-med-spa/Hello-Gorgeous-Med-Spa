import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brow Consultation & Intake | Hello Gorgeous Med Spa",
  description:
    "Complete your brow PMU consultation intake — health history, technique preferences, shape selection, and consent. Oswego, IL.",
  robots: { index: false, follow: false },
};

export default function BrowIntakePage() {
  return (
    <main className="fixed inset-0 z-0 min-h-[100dvh] bg-[#fbf6f6]">
      <iframe
        src="/forms/brow-consultation-intake.html"
        title="Hello Gorgeous Brow Consultation Intake"
        className="h-full min-h-[100dvh] w-full border-0"
        allow="clipboard-write"
      />
    </main>
  );
}
