import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Weight Loss Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description:
    "Official GLP-1 and peptide weight loss therapy pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/weight-loss",
});

export default function WeightLossCareGuidePage() {
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
          <h2 className="text-3xl font-bold text-black mt-1">MEDICAL WEIGHT LOSS</h2>
          <p className="text-sm text-black/70 mt-1">(GLP-1 / Peptide Therapy)</p>
        </div>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
          <p className="text-sm text-black/80 leading-relaxed mb-3">
            GLP-1 medications and peptide-based weight loss therapies work by regulating appetite, slowing gastric emptying, stabilizing blood sugar levels, and supporting metabolic balance.
          </p>
          <p className="text-sm text-black/80 mb-2">These medications are part of a medically supervised weight management program and are most effective when combined with:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Adequate protein intake</li>
            <li>• Strength training</li>
            <li>• Hydration</li>
            <li>• Lifestyle modifications</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">Results develop gradually over weeks to months.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Eat a light meal prior to injection</li>
            <li>• Hydrate well</li>
            <li>• Avoid excessive alcohol</li>
            <li>• Inform us of any history of pancreatitis, gallbladder disease, thyroid cancer, or endocrine disorders</li>
            <li>• Notify us of all medications and supplements</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER STARTING TREATMENT</h3>
          <p className="text-sm text-black/80 mb-2">Common temporary side effects may include:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Nausea</li>
            <li>• Mild stomach discomfort</li>
            <li>• Reduced appetite</li>
            <li>• Constipation</li>
            <li>• Fatigue</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">These symptoms often improve as your body adjusts. Dose increases are gradual to minimize discomfort.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE + OPTIMIZATION</h3>
          <p className="text-sm text-black/80 mb-2">To reduce side effects:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Increase water intake</li>
            <li>• Prioritize protein (80–100g daily unless otherwise directed)</li>
            <li>• Avoid high-fat and high-sugar meals</li>
            <li>• Eat smaller, more frequent meals</li>
            <li>• Avoid overeating</li>
          </ul>
        </section>

        <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
          <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ CONTACT US IMMEDIATELY IF YOU EXPERIENCE</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Severe abdominal pain</li>
            <li>• Persistent vomiting</li>
            <li>• Signs of dehydration</li>
            <li>• Severe constipation</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">MAINTENANCE</h3>
          <p className="text-sm text-black/80 mb-2">Weight loss medications are tools, not quick fixes. Long-term success depends on:</p>
          <ul className="text-sm text-black/80 space-y-1 ml-4">
            <li>• Nutrition</li>
            <li>• Muscle maintenance</li>
            <li>• Lifestyle consistency</li>
            <li>• Follow-up monitoring</li>
          </ul>
          <p className="text-sm text-black/80 mt-3">All treatments are medically supervised.</p>
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
