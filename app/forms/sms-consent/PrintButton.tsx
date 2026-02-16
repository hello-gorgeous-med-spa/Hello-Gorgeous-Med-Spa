'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg font-medium hover:bg-black"
    >
      Print Form
    </button>
  );
}
