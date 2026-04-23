import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContourLiftInquiryForm } from "./ContourLiftInquiryForm";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "See if you’re a candidate — Hello Gorgeous Contour Lift™ (Quantum RF)",
    description:
      "Request a brief consult for the Hello Gorgeous Contour Lift™ powered by InMode Quantum RF. Minimally invasive contouring — Oswego, IL. We’ll follow up by your preferred method.",
    path: "/contour-lift/inquiry",
  }),
};

export default function ContourLiftInquiryPage() {
  return (
    <main className="min-h-[80vh] border-b-2 border-black bg-white py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[#E6007E]">Hello Gorgeous Contour Lift™</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-black md:text-4xl">See if you’re a candidate</h1>
        <p className="mt-3 text-base leading-relaxed text-black/85">
          A quick request — we’ll follow up to schedule a private consultation. No pressure, no clinical questionnaire.
        </p>
        <div className="mt-8">
          <ContourLiftInquiryForm />
        </div>
      </div>
    </main>
  );
}
