import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Chemical Peel Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official chemical peel pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/chemical-peel",
});

export default function ChemicalPeelCareGuidePage() {
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
          <h2 className="text-3xl font-bold text-black mt-1">CHEMICAL PEEL</h2>
        </div>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            Chemical peels improve skin tone, texture, pigmentation, and fine lines by removing damaged outer layers of skin and stimulating cellular renewal.
          </p>
          <p className="text-sm text-black/80">
            Peels vary in strength depending on your skin concerns and goals.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Discontinue retinol and exfoliating products 5–7 days prior</li>
            <li>• Avoid waxing or laser treatments for 1 week</li>
            <li>• Avoid sun exposure</li>
            <li>• Inform us of cold sores or skin infections</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-black">Immediately after:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Mild redness</li>
                <li>• Tightness</li>
                <li>• Warm sensation</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Within 2–3 days:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Peeling or flaking begins</li>
                <li>• Skin may appear dry</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-black/80 mt-3">
            Peeling typically resolves within 5–7 days.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-black">Day 1–2:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Gentle cleanser only</li>
                <li>• Apply recommended moisturizer</li>
                <li>• SPF 30+ mandatory</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Day 3–7:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Do NOT pick or peel skin</li>
                <li>• Avoid exfoliation</li>
                <li>• Avoid excessive heat and sweating</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-black/80 mt-3">
            Resume active skincare only when peeling is complete and sensitivity resolves.
          </p>
        </section>

        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
          <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® if you experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Blistering</li>
            <li>• Excessive swelling</li>
            <li>• Signs of infection</li>
          </ul>
          <p className="text-sm text-black/80 mt-3 font-medium">
            Proper aftercare significantly improves outcomes.
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
