import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brow Consultation & Intake | Hello Gorgeous Med Spa",
  description:
    "Complete your brow PMU consultation intake — health history, technique preferences, shape selection, and consent. Oswego, IL.",
  robots: { index: false, follow: false },
};

const FORM_SRC = "/forms/brow-consultation-intake.html";

export default function BrowIntakePage() {
  return (
    <main className="fixed inset-0 z-0 flex min-h-[100dvh] flex-col bg-[#fbf6f6]">
      <p className="sr-only">
        Brow consultation intake form for Hello Gorgeous Med Spa permanent makeup clients in Oswego, IL.
      </p>
      <iframe
        src={FORM_SRC}
        title="Hello Gorgeous Brow Consultation Intake"
        className="min-h-0 flex-1 w-full border-0"
        allow="clipboard-write"
      />
      <noscript>
        <div className="p-6 text-center text-sm">
          JavaScript is required for the intake wizard.{" "}
          <Link href={FORM_SRC} className="font-bold text-[#E6007E] underline">
            Open the form directly
          </Link>
          .
        </div>
      </noscript>
    </main>
  );
}
