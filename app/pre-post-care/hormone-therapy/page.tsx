import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hormone Therapy Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official hormone optimization and replacement therapy pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/hormone-therapy",
});

export default function HormoneTherapyCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">HORMONE THERAPY</h2>
        <p className="text-sm text-black/70 mt-1">(Optimization + Replacement)</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Hormone therapy supports optimal levels of estrogen, progesterone, testosterone, or other hormones to restore balance, improve energy, enhance mood, support metabolism, and optimize overall wellness.
        </p>
        <p className="text-sm text-black/80 mb-2">Therapy may include:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Pellet therapy</li>
          <li>• Injectable hormones</li>
          <li>• Oral or topical prescriptions</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Hormone adjustments take time. Improvements may be gradual over several weeks.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Complete required lab work</li>
          <li>• Inform us of all medications</li>
          <li>• Notify us of history of hormone-sensitive cancers, blood clots, or cardiovascular disease</li>
          <li>• Follow specific instructions provided for your treatment type</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">Depending on therapy type, you may notice:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Improved energy</li>
          <li>• Mood stabilization</li>
          <li>• Improved sleep</li>
          <li>• Increased libido</li>
          <li>• Body composition changes</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 mb-2">Mild temporary effects may include:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Fluid retention</li>
          <li>• Breast tenderness</li>
          <li>• Mood fluctuations</li>
          <li>• Acne (in testosterone therapy)</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Hormone levels are monitored regularly to ensure safety and effectiveness.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE + MONITORING</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Follow lab schedule as directed</li>
          <li>• Report unusual symptoms immediately</li>
          <li>• Maintain hydration and healthy lifestyle habits</li>
        </ul>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ SEEK IMMEDIATE CARE IF YOU EXPERIENCE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Chest pain</li>
          <li>• Severe headaches</li>
          <li>• Leg swelling</li>
          <li>• Vision changes</li>
        </ul>
      </section>

      <section className="mb-6 p-3 bg-black/5 rounded-lg">
        <p className="text-sm text-black/80 text-center italic">Hormone therapy is individualized and medically supervised.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
