import type { Metadata } from "next";

import { HrtRequestForm } from "@/components/forms/HrtRequestForm";
import {
  RxIntakeLegalFooter,
  RxIntakeShell,
  RxIntakeTrustStrip,
} from "@/components/rx/intake/RxIntakeShell";
import { RxIntakePricingAccordion } from "@/components/rx/intake/RxIntakePricingAccordion";
import { HRT_REQUEST_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import { HRT_HORMONES_HERO_IMAGE } from "@/lib/hrt-banner-images";
import { HRT_REQUEST_DISCLAIMER } from "@/lib/hrt-intake";
import { HRT_PAYMENT_FIRST_COPY, HRT_PRICING_DISCLAIMER } from "@/lib/hrt-supply-pricing";
import { parseRxSupplyCycle } from "@/lib/rx-supply-cycle";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hormone Therapy Request | Hello Gorgeous RX™ | Oswego, IL",
  description:
    "Request compounded hormone therapy — pay online, book NP telehealth, ship to home. 30-day or 90-day supply with 10% off prepay. Oswego, IL.",
  path: HRT_REQUEST_PATH,
});

type PageProps = {
  searchParams: Promise<{
    ingredient?: string;
    form?: string;
    supply?: string;
    paid?: string;
    ref?: string;
  }>;
};

export default async function HrtRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supplyCycle = parseRxSupplyCycle(params.supply ?? "90-day");

  return (
    <RxIntakeShell
      maxWidthClass="max-w-3xl"
      navLinks={[
        { href: RX_PATIENT_CARE_PATH, label: "Patient care hub", highlight: true },
        { href: "/rx/hormones", label: "Hormone ingredients" },
        { href: "/rx/request", label: "RX request portal" },
      ]}
      hero={{
        pill: "Pay first · telehealth before ship",
        locality: "Hello Gorgeous RX™ · Oswego, IL",
        title: "Hormone",
        titleAccent: "request",
        imageSrc: HRT_HORMONES_HERO_IMAGE,
        imageAlt: "Hello Gorgeous RX hormone therapy — bioidentical HRT",
        body: (
          <>
            Choose your ingredient and supply cycle, pay at checkout, then book your NP video visit.{" "}
            <strong className="text-black">Nothing ships until Ryan Kent, FNP-BC approves your protocol.</strong>
          </>
        ),
      }}
    >
      {params.paid === "1" && (
        <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-5 py-4 text-center text-sm text-green-900">
          <p className="font-bold">Payment received — thank you!</p>
          <p className="mt-1 text-green-800">Book your NP telehealth visit on Fresha below.</p>
        </div>
      )}

      <RxIntakeTrustStrip />

      <RxIntakePricingAccordion title="Hormone therapy pricing">
        <p>{HRT_PAYMENT_FIRST_COPY}</p>
        <p>
          <strong className="text-black">90-day supply</strong> — 10% off product + one $35 shipping fee for three
          months (most popular).
        </p>
        <p>
          <strong className="text-black">30-day supply</strong> — pay monthly + shipping each order.
        </p>
        <p className="text-black/55">{HRT_PRICING_DISCLAIMER}</p>
        <p className="text-black/55">{HRT_REQUEST_DISCLAIMER}</p>
      </RxIntakePricingAccordion>

      <HrtRequestForm
        ingredientId={params.ingredient?.trim()}
        formId={params.form?.trim()}
        supplyCycle={supplyCycle}
        paid={params.paid === "1"}
        paidRef={params.ref?.trim()}
      />

      <RxIntakeLegalFooter />
    </RxIntakeShell>
  );
}
