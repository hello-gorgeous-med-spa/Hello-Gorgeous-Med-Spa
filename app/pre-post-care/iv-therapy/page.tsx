import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "IV Therapy Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official IV therapy and vitamin injection pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/iv-therapy",
});

export default function IVTherapyCareGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @media print {
          @page { margin: 0.5in; size: letter; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print sticky top-0 bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between z-50">
        <Link href="/pre-post-care" className="text-[#E6007E] font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Patient Care
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-[#E6007E] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div className="max-w-[8.5in] mx-auto px-8 py-8">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide text-black">HELLO GORGEOUS MED SPA®</h1>
          <div className="mt-2 text-sm text-black/80">
            <p>74 W. Washington Street</p>
            <p>Oswego, IL 60543</p>
            <p>630-636-6193</p>
            <p>hellogorgeousskin@yahoo.com</p>
          </div>
          <div className="mt-4 h-1 bg-[#E6007E] w-full"></div>
        </header>

        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
          <h2 className="text-3xl font-bold text-black mt-1">IV THERAPY</h2>
          <p className="text-sm text-black/70 mt-1">(Wellness Drips + Vitamin Injections)</p>
        </div>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            IV Therapy delivers fluids, vitamins, minerals, and antioxidants directly into the bloodstream for optimal absorption and rapid cellular support.
          </p>
          <p className="text-sm text-black/80 mb-2">Common benefits may include:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Hydration support</li>
            <li>• Immune support</li>
            <li>• Energy enhancement</li>
            <li>• Recovery support</li>
            <li>• Skin glow enhancement</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Results may be felt within hours and can last several days to weeks depending on the formulation.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Eat a light meal 1–2 hours prior</li>
            <li>• Hydrate well before arrival</li>
            <li>• Inform us of any kidney disease, heart conditions, pregnancy, or medication changes</li>
            <li>• Notify us of any allergies</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">You may experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Mild soreness at injection site</li>
            <li>• Temporary bruising</li>
            <li>• Increased urination</li>
            <li>• Warm sensation during infusion</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">These are normal and typically resolve quickly.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Continue hydration</li>
            <li>• Avoid strenuous exercise for several hours</li>
            <li>• Monitor injection site for excessive redness or swelling</li>
          </ul>
        </section>

        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ CONTACT US IMMEDIATELY IF YOU EXPERIENCE</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Significant swelling</li>
            <li>• Persistent pain</li>
            <li>• Fever</li>
            <li>• Shortness of breath</li>
          </ul>
        </section>

        <section className="mb-6 p-3 bg-black/5 rounded-lg">
          <p className="text-sm text-black/80 text-center italic">
            IV Therapy is not a substitute for primary medical care.
          </p>
        </section>

        <footer className="mt-8 pt-4 border-t-4 border-[#E6007E]">
          <div className="text-center">
            <p className="text-sm font-semibold text-black mb-2">PROFESSIONAL CARE MATTERS</p>
            <p className="text-xs text-black/70 leading-relaxed">
              Results are optimized when all pre and post instructions are followed carefully.
              All treatments at Hello Gorgeous Med Spa® are performed by licensed medical professionals.
            </p>
            <p className="text-xs text-black/60 mt-3 italic">Individual results vary. A full consultation is required prior to treatment.</p>
            <p className="text-sm font-medium text-[#E6007E] mt-4">www.hellogorgeousmedspa.com</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
