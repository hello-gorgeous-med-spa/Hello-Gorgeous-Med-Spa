import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PRP/PRF Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official PRP and PRF platelet-rich plasma therapy pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/prp-prf",
});

export default function PRPPRFCareGuidePage() {
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
          <h2 className="text-3xl font-bold text-black mt-1">PRP / PRF</h2>
          <p className="text-sm text-black/70 mt-1">(Platelet-Rich Plasma / Platelet-Rich Fibrin)</p>
        </div>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            PRP and PRF are regenerative treatments that use your body's own platelets and growth factors to stimulate collagen production, tissue repair, and cellular regeneration.
          </p>
          <p className="text-sm text-black/80 mb-2">A small amount of your blood is drawn, processed, and reinjected into targeted areas such as:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Under-eye hollows</li>
            <li>• Face (skin rejuvenation)</li>
            <li>• Scalp (hair restoration)</li>
            <li>• Acne scars</li>
            <li>• Combined with microneedling</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            PRF releases growth factors more slowly than PRP, providing prolonged regenerative support.
          </p>
          <p className="text-sm text-black/80 mt-2">
            Results develop gradually over several weeks as collagen rebuilds.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Avoid alcohol 24 hours prior</li>
            <li>• Avoid aspirin, NSAIDs, fish oil, and blood thinners 5–7 days prior (unless medically necessary)</li>
            <li>• Hydrate well 24 hours before treatment</li>
            <li>• Eat a light meal prior to appointment</li>
            <li>• Avoid active skin infection or illness</li>
          </ul>
          <p className="text-sm text-black/80 mt-3 italic">
            If you are pregnant, breastfeeding, or have blood disorders, notify us prior to treatment.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">Immediately after treatment, you may experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Redness</li>
            <li>• Swelling</li>
            <li>• Tenderness</li>
            <li>• Mild bruising</li>
            <li>• Small injection marks</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Swelling may be more noticeable under the eyes and can last 2–5 days.
          </p>
          <p className="text-sm text-black/80 mt-2">
            Results appear gradually over 4–8 weeks as collagen stimulation progresses.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE INSTRUCTIONS</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-black">First 24 Hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Avoid strenuous exercise</li>
                <li>• Avoid excessive heat (saunas, hot tubs)</li>
                <li>• Do not massage treated areas</li>
                <li>• Avoid alcohol</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">First 48–72 Hours:</p>
              <ul className="text-sm text-black/80 ml-4">
                <li>• Gentle cleansing only</li>
                <li>• Avoid retinol and exfoliants</li>
                <li>• SPF 30+ required</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-black/80 mt-3 p-3 bg-pink-50 rounded-lg border border-[#E6007E]/30">
            <strong>Note:</strong> Avoid anti-inflammatory medications (Ibuprofen, Motrin, Advil) unless medically necessary, as they may interfere with the natural inflammatory healing process.
          </p>
        </section>

        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
          <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® immediately if you experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Severe pain</li>
            <li>• Increasing swelling</li>
            <li>• Signs of infection</li>
            <li>• Vision changes (for facial injections)</li>
          </ul>
        </section>

        <section className="mb-6 p-3 bg-black/5 rounded-lg">
          <p className="text-sm text-black/80 text-center">
            PRP/PRF is a regenerative procedure. <strong>Optimal results often require a series of treatments.</strong>
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
