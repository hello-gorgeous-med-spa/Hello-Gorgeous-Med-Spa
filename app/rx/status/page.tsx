import type { Metadata } from "next";

import { RxPatientStatusCard } from "@/components/rx/RxPatientStatusCard";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Track Your RX Refill | Hello Gorgeous RX™",
  description:
    "See your Hello Gorgeous RX refill status — intake, telehealth, payment, pharmacy approval, and home delivery.",
  alternates: { canonical: `${SITE.url}/rx/status` },
};

type PageProps = {
  searchParams: Promise<{ ref?: string; email?: string; token?: string }>;
};

export default async function RxStatusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialRef = params.ref?.trim() || "";
  const initialEmail = params.email?.trim() || "";
  const initialToken = params.token?.trim() || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
          Hello Gorgeous RX™
        </p>
        <h1 className="mt-2 text-center font-serif text-3xl font-black text-black">
          Refill status
        </h1>
        <p className="mt-3 text-center text-sm text-black/60 leading-relaxed">
          One place to see telehealth, payment, and shipping — use your secure link from confirmation,
          or your reference code plus email.
        </p>
        <div className="mt-8">
          <RxPatientStatusCard
            initialRef={initialRef}
            initialEmail={initialEmail}
            initialToken={initialToken}
          />
        </div>
      </div>
    </main>
  );
}
