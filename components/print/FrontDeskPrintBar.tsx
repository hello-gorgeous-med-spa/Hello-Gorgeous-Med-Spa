"use client";

export function FrontDeskPrintBar() {
  return (
    <div className="print:hidden sticky top-0 z-50 border-b-4 border-black bg-white shadow-md">
      <div className="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-semibold text-black">
          Front desk pricing sheet — use <strong>Print</strong> → <strong>Save as PDF</strong>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border-2 border-black bg-[#E6007E] px-5 py-2 text-sm font-bold text-white hover:bg-black transition"
          >
            Print / Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
