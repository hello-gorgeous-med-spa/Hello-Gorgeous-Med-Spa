import type { Metadata } from "next";

import { RxSecureMessages } from "@/components/rx/RxSecureMessages";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Secure RX Messages | Hello Gorgeous RX™",
  description:
    "Message Hello Gorgeous Med Spa's clinical team securely about your GLP-1 or peptide protocol — dosing, shipping, and telehealth questions.",
  alternates: { canonical: `${SITE.url}/rx/messages` },
};

type PageProps = {
  searchParams: Promise<{ ref?: string; email?: string }>;
};

export default async function RxMessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialRef = params.ref?.trim() || "";
  const initialEmail = params.email?.trim() || "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
          Hello Gorgeous RX™
        </p>
        <h1 className="mt-2 text-center font-serif text-3xl font-black text-black">
          Secure clinical messaging
        </h1>
        <p className="mt-3 text-center text-sm text-black/60 leading-relaxed">
          HIPAA-aware web messaging with our NP team — not SMS. Use the reference from your refill
          confirmation and the email on your chart.
        </p>
        <div className="mt-8">
          <RxSecureMessages initialRef={initialRef} initialEmail={initialEmail} />
        </div>
      </div>
    </main>
  );
}
