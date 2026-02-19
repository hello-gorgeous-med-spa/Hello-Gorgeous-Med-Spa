import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Trigger Point Injections Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official trigger point injection pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/trigger-point",
});

export default function TriggerPointCareGuidePage() {
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
          <h2 className="text-3xl font-bold text-black mt-1">TRIGGER POINT INJECTIONS</h2>
        </div>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            Trigger point injections are administered into tight bands of muscle (knots) to relieve pain, reduce muscle tension, and improve mobility.
          </p>
          <p className="text-sm text-black/80 mb-2">These injections may contain:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Local anesthetic</li>
            <li>• Saline</li>
            <li>• Vitamin blends</li>
            <li>• Other physician-directed formulations</li>
          </ul>
          <p className="text-sm text-black/80 mt-3 mb-2">Trigger point injections are commonly used for:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Neck pain</li>
            <li>• Shoulder tension</li>
            <li>• Upper back pain</li>
            <li>• Headaches</li>
            <li>• Muscle spasms</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Relief may be felt immediately or within 24–72 hours.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Inform us of all medications</li>
            <li>• Avoid blood thinners 3–5 days prior (if medically appropriate)</li>
            <li>• Eat a light meal</li>
            <li>• Stay hydrated</li>
            <li>• Notify us of infection, fever, or illness</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">You may experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Mild soreness at injection site</li>
            <li>• Temporary muscle stiffness</li>
            <li>• Bruising</li>
            <li>• Fatigue</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">
            Soreness may last 24–48 hours. Improvement in muscle tension may be immediate or gradual.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
          
          <div>
            <p className="text-sm font-semibold text-black">First 24 Hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Avoid strenuous exercise</li>
              <li>• Apply ice to injection site if needed</li>
              <li>• Gentle stretching is encouraged</li>
            </ul>
          </div>
          
          <p className="text-sm text-black/80 mt-3">Continue hydration.</p>
          <p className="text-sm text-black/80 mt-2">
            You may use Tylenol for discomfort unless otherwise directed.
          </p>
        </section>

        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
          <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® if you experience:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Increasing pain</li>
            <li>• Fever</li>
            <li>• Significant swelling</li>
            <li>• Signs of infection</li>
          </ul>
        </section>

        <section className="mb-6 p-3 bg-black/5 rounded-lg">
          <p className="text-sm text-black/80 text-center">
            Trigger point therapy may require repeat sessions depending on muscle tension severity.
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
