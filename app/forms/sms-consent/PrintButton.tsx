'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600"
    >
      Print Form
    </button>
  );
}
