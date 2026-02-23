import { Suspense } from "react";
import { FaceBlueprintContent } from "./FaceBlueprintContent";

function FaceBlueprintFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#FF2D8D]/40 border-t-[#FF2D8D] rounded-full animate-spin" />
        <p className="text-black/60 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function FaceBlueprintPage() {
  return (
    <Suspense fallback={<FaceBlueprintFallback />}>
      <FaceBlueprintContent />
    </Suspense>
  );
}
