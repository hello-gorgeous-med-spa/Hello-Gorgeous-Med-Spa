import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Weight Loss Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official GLP-1 and peptide weight loss therapy pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/weight-loss",
});

export default function WeightLossCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">MEDICAL WEIGHT LOSS</h2>
        <p className="text-sm text-black/70 mt-1">(GLP-1 / Peptide Therapy)</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          GLP-1 medications and peptide-based weight loss therapies work by regulating appetite, slowing gastric emptying, stabilizing blood sugar levels, and supporting metabolic balance.
        </p>
        <p className="text-sm text-black/80 mb-2">These medications are part of a medically supervised weight management program and are most effective when combined with:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Adequate protein intake</li>
          <li>• Strength training</li>
          <li>• Hydration</li>
          <li>• Lifestyle modifications</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Results develop gradually over weeks to months.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Eat a light meal prior to injection</li>
          <li>• Hydrate well</li>
          <li>• Avoid excessive alcohol</li>
          <li>• Inform us of any history of pancreatitis, gallbladder disease, thyroid cancer, or endocrine disorders</li>
          <li>• Notify us of all medications and supplements</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER STARTING TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">Common temporary side effects may include:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Nausea</li>
          <li>• Mild stomach discomfort</li>
          <li>• Reduced appetite</li>
          <li>• Constipation</li>
          <li>• Fatigue</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">These symptoms often improve as your body adjusts. Dose increases are gradual to minimize discomfort.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE + OPTIMIZATION</h3>
        <p className="text-sm text-black/80 mb-2">To reduce side effects:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Increase water intake</li>
          <li>• Prioritize protein (80–100g daily unless otherwise directed)</li>
          <li>• Avoid high-fat and high-sugar meals</li>
          <li>• Eat smaller, more frequent meals</li>
          <li>• Avoid overeating</li>
        </ul>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ CONTACT US IMMEDIATELY IF YOU EXPERIENCE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Severe abdominal pain</li>
          <li>• Persistent vomiting</li>
          <li>• Signs of dehydration</li>
          <li>• Severe constipation</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">MAINTENANCE</h3>
        <p className="text-sm text-black/80 mb-2">Weight loss medications are tools, not quick fixes. Long-term success depends on:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Nutrition</li>
          <li>• Muscle maintenance</li>
          <li>• Lifestyle consistency</li>
          <li>• Follow-up monitoring</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">All treatments are medically supervised.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
