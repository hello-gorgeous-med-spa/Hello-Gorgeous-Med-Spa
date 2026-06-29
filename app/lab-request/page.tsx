import type { Metadata } from "next";

import { LabRequestForm } from "@/components/forms/LabRequestForm";
import {
  RxIntakeLegalFooter,
  RxIntakeShell,
  RxIntakeTrustStrip,
} from "@/components/rx/intake/RxIntakeShell";
import { RxIntakePricingAccordion } from "@/components/rx/intake/RxIntakePricingAccordion";
import { BOOKING_URL, LAB_REQUEST_PATH, LABS_HUB_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import { LAB_PANELS, LAB_PAYMENT_FIRST_COPY, LAB_PRICING_DISCLAIMER } from "@/lib/lab-panel-catalog";
import { LAB_REQUEST_DISCLAIMER } from "@/lib/lab-request-intake";
import { labPanelById, type LabDrawOptionId } from "@/lib/lab-panel-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order Lab Panels | Hello Gorgeous Med Spa | Oswego, IL",
  description:
    "Cash-pay lab panels from $199 — Peak Performance, hormone baseline, GLP-1 metabolic, and comprehensive wellness. Pay online, NP review, Quest/LabCorp or in-office draw.",
  path: LAB_REQUEST_PATH,
});

type PageProps = {
  searchParams: Promise<{
    panel?: string;
    draw?: string;
    paid?: string;
    ref?: string;
  }>;
};

export default async function LabRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const panel = params.panel?.trim();
  const draw = params.draw?.trim() as LabDrawOptionId | undefined;
  const selected = panel ? labPanelById(panel) : null;

  return (
    <RxIntakeShell
      maxWidthClass="max-w-4xl"
      navLinks={[
        { href: LABS_HUB_PATH, label: "All lab panels", highlight: true },
        { href: RX_PATIENT_CARE_PATH, label: "Patient care hub" },
        { href: "/blood-work", label: "Lab education guide" },
        { href: BOOKING_URL, label: "Book in-house draw", external: true },
      ]}
      hero={{
        pill: "Cash-pay · no insurance required",
        locality: "Hello Gorgeous Med Spa · Oswego, IL",
        title: "Order",
        titleAccent: "lab panels",
        imageSrc: "/images/promo/peak-performance-profile-flyer.png",
        imageAlt: "Peak Performance Profile lab panel — Hello Gorgeous Med Spa",
        body: (
          <>
            {selected ? (
              <>
                <strong className="text-black">{selected.name}</strong> — ${selected.retailUsd}.{" "}
              </>
            ) : null}
            {LAB_PAYMENT_FIRST_COPY}
          </>
        ),
      }}
    >
      {params.paid === "1" && (
        <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-5 py-4 text-center text-sm text-green-900">
          <p className="font-bold">Payment received — thank you!</p>
          <p className="mt-1 text-green-800">Your requisition is being prepared. Check your email.</p>
        </div>
      )}

      <RxIntakeTrustStrip />

      <RxIntakePricingAccordion title="Panel pricing">
        <ul className="space-y-2 text-sm">
          {LAB_PANELS.map((p) => (
            <li key={p.id}>
              <strong className="text-black">{p.name}</strong> — ${p.retailUsd} · {p.markerCount}{" "}
              markers
            </li>
          ))}
        </ul>
        <p className="mt-3 text-black/55">{LAB_PRICING_DISCLAIMER}</p>
        <p className="text-black/55">{LAB_REQUEST_DISCLAIMER}</p>
      </RxIntakePricingAccordion>

      <LabRequestForm
        panelId={panel}
        drawOptionId={draw}
        paid={params.paid === "1"}
        paidRef={params.ref?.trim()}
      />

      <RxIntakeLegalFooter />
    </RxIntakeShell>
  );
}
