import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dermal Filler Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official dermal filler pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL. Optimize your results and ensure safety.",
  path: "/pre-post-care/filler",
});

export default function FillerCareGuidePage() {
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
          <h2 className="text-3xl font-bold text-black mt-1">DERMAL FILLER</h2>
        </div>

        {/* About Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            Dermal fillers are FDA-approved injectable gels designed to restore lost volume, enhance facial contours, and smooth deeper lines. Most fillers are composed of hyaluronic acid, a naturally occurring substance in the body that provides hydration and structure to the skin.
          </p>
          <p className="text-sm text-black/80 mb-2">Common treatment areas include:</p>
          <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
            <li>• Lips</li>
            <li>• Cheeks</li>
            <li>• Jawline</li>
            <li>• Chin</li>
            <li>• Nasolabial folds</li>
            <li>• Marionette lines</li>
            <li>• Under-eye hollows</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Results are visible immediately, with final results settling within 10–14 days.
          </p>
        </section>

        {/* Before Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <p className="text-sm text-black/80 mb-2">To reduce bruising and swelling:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Avoid alcohol 24–48 hours prior</li>
            <li>• Avoid aspirin, ibuprofen, naproxen, fish oil, vitamin E, garlic supplements, and other blood thinners for 5–7 days (unless medically necessary)</li>
            <li>• Avoid strenuous exercise the day of treatment</li>
            <li>• Discontinue retinol 3 days prior</li>
            <li>• Avoid dental procedures 2 weeks before and after treatment</li>
            <li>• Reschedule if you develop cold sores, infection, rash, or illness</li>
          </ul>
          <p className="text-sm text-black/80 mt-3 italic">
            If you are prone to cold sores, notify us prior to treatment — preventive medication may be recommended.
          </p>
        </section>

        {/* What to Expect Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">Immediately after treatment, you may experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Swelling</li>
            <li>• Tenderness</li>
            <li>• Bruising</li>
            <li>• Firmness</li>
            <li>• Mild asymmetry</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Swelling is normal and may peak at 48 hours. Lips may swell more than other areas. Most swelling resolves within 3–7 days. Final results are evaluated at 14 days.
          </p>
        </section>

        {/* Aftercare Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE INSTRUCTIONS</h3>
          <p className="text-sm text-black/80 mb-3">For best results and safety:</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-black">First 6 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Do not touch, press, or massage treated areas</li>
                <li>• Avoid makeup if possible</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">First 24 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Avoid strenuous exercise</li>
                <li>• Avoid alcohol</li>
                <li>• Avoid excessive heat (saunas, hot tubs)</li>
                <li>• Sleep with head elevated</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">First 48 hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Avoid facials, lasers, chemical peels</li>
                <li>• Avoid extreme temperatures</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">For 2 weeks:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Avoid dental work</li>
                <li>• Avoid aggressive facial massage</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-black/80 mt-3">Cold compress may be applied gently to reduce swelling.</p>
        </section>

        {/* Important Safety Section */}
        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT SAFETY INFORMATION</h3>
          <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® immediately if you experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Severe or increasing pain</li>
            <li>• Skin discoloration (white, gray, or purple patches)</li>
            <li>• Blistering</li>
            <li>• Vision changes</li>
            <li>• Severe asymmetry</li>
            <li>• Signs of infection</li>
          </ul>
          <p className="text-sm text-black/80 mt-2 italic">These are rare but require immediate evaluation.</p>
        </section>

        {/* Longevity Section */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">LONGEVITY + MAINTENANCE</h3>
          <p className="text-sm text-black/80 mb-2">
            Depending on area treated and product used, results may last:
          </p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• <strong>Lips:</strong> 6–12 months</li>
            <li>• <strong>Cheeks/Jawline:</strong> 9–18 months</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            We recommend follow-up evaluation at 2 weeks if needed. Consistent maintenance preserves facial balance and structure over time.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t-4 border-[#E6007E]">
          <div className="text-center">
            <p className="text-sm font-semibold text-black mb-2">PROFESSIONAL CARE MATTERS</p>
            <p className="text-xs text-black/70 leading-relaxed">
              Results are optimized when all pre and post instructions are followed carefully.
              All injectable treatments at Hello Gorgeous Med Spa® are performed by licensed medical professionals in a controlled clinical setting.
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
