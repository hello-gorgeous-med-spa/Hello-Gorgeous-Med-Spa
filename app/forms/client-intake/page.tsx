import type { Metadata } from "next";
import { EnhancedClientIntakeForm } from "@/components/forms/EnhancedClientIntakeForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Intake Form | Hello Gorgeous Med Spa",
  description:
    "Secure client intake for treatment planning at Hello Gorgeous Med Spa. Share goals, medical history, and preferences so our team can build your personalized proposal.",
  path: "/forms/client-intake",
});

export default function ClientIntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-white py-10">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E6007E]">Hello Gorgeous Med Spa</p>
        <h1 className="mt-2 text-3xl font-black text-black md:text-4xl">Personalized client intake</h1>
        <p className="mt-3 max-w-2xl text-sm text-black/75 md:text-base">
          Complete this secure intake and our team will prepare a tailored treatment plan before your consultation.
        </p>
        <div className="mt-6">
          <EnhancedClientIntakeForm />
        </div>
      </div>
    </main>
  );
}
