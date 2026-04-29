"use client";

import { useState } from "react";

/**
 * Copy a public page URL (e.g. patient-documents) for staff to paste into SMS or email.
 */
export function CopyPageUrlButton({ url, label }: { url: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "err">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("err");
      window.setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
    >
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {status === "copied"
        ? "Copied!"
        : status === "err"
          ? "Copy failed — tap URL below"
          : (label ?? "Copy page link")}
    </button>
  );
}
