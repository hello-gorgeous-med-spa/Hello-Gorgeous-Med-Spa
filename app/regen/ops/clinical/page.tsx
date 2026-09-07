import { Suspense } from "react";
import ClinicalRefsClient from "./ClinicalRefsClient";

export const metadata = {
  title: "Clinical reference | REGEN RX Ops",
  robots: { index: false, follow: false },
};

export default function OpsClinicalPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading clinical reference…</p>}>
      <ClinicalRefsClient />
    </Suspense>
  );
}
