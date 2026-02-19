import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official Botox pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL. Optimize your results and ensure safety.",
  path: "/pre-post-care/botox",
});

export default function BotoxCareGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Print-optimized styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: letter;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
        }
      `}</style>

      {/* Print/Download Button - Hidden on print */}
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

      {/* Document Content */}
      <div className="max-w-[8.5in] mx-auto px-8 py-8">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide text-black">HELLO GORGEOUS MED SPA®</h1>
          <div className="mt-2 text-sm text-black/80">
            <p>74 W. Washington Street</p>
            <p>Oswego, IL 60543</p>
            <p>630-636-6193</p>
            <p>hellogorgeousskin@yahoo.com</p>
          </div>
          {/* Pink divider */}
          <div className="mt-4 h-1 bg-[#E6007E] w-full"></div>
        </header>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
          <h2 className="text-3xl font-bold text-black mt-1">BOTOX®</h2>
          <p className="text-sm text-black/70 mt-1">(Neurotoxin Treatment)</p>
        </div>

        {/* About Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            Botox® is a purified neuromodulator designed to temporarily relax targeted facial muscles responsible for dynamic wrinkles. By softening repetitive muscle movement, Botox® smooths fine lines and prevents deeper wrinkle formation over time.
          </p>
          <p className="text-sm text-black/80 mb-2">Common treatment areas include:</p>
          <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
            <li>• Forehead lines</li>
            <li>• Frown lines (11s)</li>
            <li>• Crow's feet</li>
            <li>• Lip flip</li>
            <li>• Chin dimpling</li>
            <li>• Bunny lines</li>
            <li>• Masseter (jaw slimming / clenching)</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Results typically begin appearing within 3–5 days, with full effect visible at 10–14 days.
          </p>
        </section>

        {/* Before Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <p className="text-sm text-black/80 mb-2">To minimize bruising and optimize results:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Avoid alcohol 24 hours prior to treatment</li>
            <li>• Avoid aspirin, ibuprofen, naproxen, fish oil, vitamin E, and other blood-thinning supplements for 5–7 days unless medically necessary</li>
            <li>• Discontinue retinol products 3 days prior</li>
            <li>• Avoid facials, chemical peels, or laser treatments within 1 week</li>
            <li>• Arrive with clean skin (no makeup in treatment area)</li>
          </ul>
          <p className="text-sm text-black/80 mt-3 italic">
            If you are pregnant, breastfeeding, have a neuromuscular disorder, or are taking muscle relaxants, please notify us before treatment.
          </p>
        </section>

        {/* What to Expect Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">Immediately after treatment you may notice:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Mild redness</li>
            <li>• Small injection marks</li>
            <li>• Slight swelling</li>
            <li>• Tenderness at injection sites</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            These effects are normal and typically resolve within 24 hours. You may begin noticing results in 3–5 days. Full results develop within 14 days.
          </p>
        </section>

        {/* Aftercare Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE INSTRUCTIONS</h3>
          <p className="text-sm text-black/80 mb-3">For optimal safety and results:</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-black">For the first 4 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Remain upright</li>
                <li>• Do not lie flat</li>
                <li>• Avoid bending excessively</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">For 24 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Do not rub or massage treated areas</li>
                <li>• Avoid strenuous exercise</li>
                <li>• Avoid saunas, hot tubs, or excessive heat</li>
                <li>• Avoid alcohol</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">For 48 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Avoid facials or skin treatments</li>
                <li>• Avoid excessive pressure to the area</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-black/80 mt-3">Makeup may be applied gently after 4 hours.</p>
        </section>

        {/* Important Section */}
        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
          <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® immediately if you experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Vision changes</li>
            <li>• Difficulty swallowing or breathing</li>
            <li>• Severe or worsening swelling</li>
            <li>• Drooping beyond expected mild asymmetry</li>
          </ul>
          <p className="text-sm text-black/80 mt-2 italic">These are rare but require prompt evaluation.</p>
        </section>

        {/* Longevity Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">LONGEVITY + MAINTENANCE</h3>
          <p className="text-sm text-black/80 mb-2">
            Results typically last 3–4 months depending on metabolism and treatment area.
          </p>
          <p className="text-sm text-black/80 mb-2">Consistent maintenance appointments can:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Improve longevity</li>
            <li>• Prevent deep wrinkle formation</li>
            <li>• Train muscles to relax over time</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            We recommend scheduling your next visit before full muscle movement returns.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t-4 border-[#E6007E]">
          <div className="text-center">
            <p className="text-sm font-semibold text-black mb-2">PROFESSIONAL CARE MATTERS</p>
            <p className="text-xs text-black/70 leading-relaxed">
              Your results are optimized when all pre and post instructions are followed carefully.
              All treatments at Hello Gorgeous Med Spa® are performed by licensed medical professionals in a safe, clinical environment.
            </p>
            <p className="text-xs text-black/60 mt-3 italic">
              Individual results vary. A full consultation is required prior to treatment.
            </p>
            <p className="text-sm font-medium text-[#E6007E] mt-4">www.hellogorgeousmedspa.com</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
