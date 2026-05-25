import type { Metadata } from "next";
import { YOUR_BROW_JOURNEY_HTML } from "@/data/brow-microblading-care";

export const metadata: Metadata = {
  title: "Your Brow Journey | Hello Gorgeous Med Spa",
  description:
    "Step-by-step brow PMU guide from Hello Gorgeous Med Spa — consultation, mapping, healing timeline, and aftercare. Oswego, IL.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.hellogorgeousmedspa.com/education/your-brow-journey" },
};

export default function YourBrowJourneyPage() {
  return (
    <main className="fixed inset-0 z-0 min-h-[100dvh] bg-[#fbf6f6]">
      <iframe
        src={YOUR_BROW_JOURNEY_HTML}
        title="Hello Gorgeous — Your Brow Journey"
        className="h-full min-h-[100dvh] w-full border-0"
      />
    </main>
  );
}
