import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Chemical Peel Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official chemical peel pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/chemical-peel",
});

export default function ChemicalPeelCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">CHEMICAL PEEL</h2>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Chemical peels improve skin tone, texture, pigmentation, and fine lines by removing damaged outer layers of skin and stimulating cellular renewal.
        </p>
        <p className="text-sm text-black/80">Peels vary in strength depending on your skin concerns and goals.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Discontinue retinol and exfoliating products 5–7 days prior</li>
          <li>• Avoid waxing or laser treatments for 1 week</li>
          <li>• Avoid sun exposure</li>
          <li>• Inform us of cold sores or skin infections</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">Immediately after:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Mild redness</li>
              <li>• Tightness</li>
              <li>• Warm sensation</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Within 2–3 days:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Peeling or flaking begins</li>
              <li>• Skin may appear dry</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-black/80 mt-3">Peeling typically resolves within 5–7 days.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">Day 1–2:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Gentle cleanser only</li>
              <li>• Apply recommended moisturizer</li>
              <li>• SPF 30+ mandatory</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Day 3–7:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Do NOT pick or peel skin</li>
              <li>• Avoid exfoliation</li>
              <li>• Avoid excessive heat and sweating</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-black/80 mt-3">Resume active skincare only when peeling is complete and sensitivity resolves.</p>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
        <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® if you experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Blistering</li>
          <li>• Excessive swelling</li>
          <li>• Signs of infection</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 font-medium">Proper aftercare significantly improves outcomes.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
