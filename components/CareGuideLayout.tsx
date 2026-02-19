"use client";

import Link from "next/link";

interface CareGuideLayoutProps {
  children: React.ReactNode;
}

export function CareGuideLayout({ children }: CareGuideLayoutProps) {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print/Download Button - Hidden on print */}
      <div className="sticky top-0 bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between z-50 print:hidden">
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
        {children}
      </div>
    </div>
  );
}

export function CareGuideHeader() {
  return (
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
  );
}

export function CareGuideFooter() {
  return (
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
  );
}
