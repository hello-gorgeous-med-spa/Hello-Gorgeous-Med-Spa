import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "IV Therapy Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official IV therapy and vitamin injection pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/iv-therapy",
});

export default function IVTherapyCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">IV THERAPY</h2>
        <p className="text-sm text-black/70 mt-1">(Wellness Drips + Vitamin Injections)</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          IV Therapy delivers fluids, vitamins, minerals, and antioxidants directly into the bloodstream for optimal absorption and rapid cellular support.
        </p>
        <p className="text-sm text-black/80 mb-2">Common benefits may include:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Hydration support</li>
          <li>• Immune support</li>
          <li>• Energy enhancement</li>
          <li>• Recovery support</li>
          <li>• Skin glow enhancement</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Results may be felt within hours and can last several days to weeks depending on the formulation.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Eat a light meal 1–2 hours prior</li>
          <li>• Hydrate well before arrival</li>
          <li>• Inform us of any kidney disease, heart conditions, pregnancy, or medication changes</li>
          <li>• Notify us of any allergies</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">You may experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Mild soreness at injection site</li>
          <li>• Temporary bruising</li>
          <li>• Increased urination</li>
          <li>• Warm sensation during infusion</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">These are normal and typically resolve quickly.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Continue hydration</li>
          <li>• Avoid strenuous exercise for several hours</li>
          <li>• Monitor injection site for excessive redness or swelling</li>
        </ul>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ CONTACT US IMMEDIATELY IF YOU EXPERIENCE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Significant swelling</li>
          <li>• Persistent pain</li>
          <li>• Fever</li>
          <li>• Shortness of breath</li>
        </ul>
      </section>

      <section className="mb-6 p-3 bg-black/5 rounded-lg">
        <p className="text-sm text-black/80 text-center italic">IV Therapy is not a substitute for primary medical care.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
