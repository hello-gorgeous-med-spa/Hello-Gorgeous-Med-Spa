import type { Metadata } from "next";
import { Suspense } from "react";
import ContourLiftClinicalIntakeForm from "./ContourLiftClinicalIntakeForm";

export const metadata: Metadata = {
  title: "Clinical Intake | Contour Lift",
  description: "Secure clinical intake for Contour Lift / Quantum RF at Hello Gorgeous Med Spa.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ContourLiftIntakePage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-black/50">Loading…</p>}>
      <ContourLiftClinicalIntakeForm />
    </Suspense>
  );
}
