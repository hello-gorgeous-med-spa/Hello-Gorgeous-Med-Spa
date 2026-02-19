import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Microneedling Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official microneedling pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/microneedling",
});

export default function MicroneedlingCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">MICRONEEDLING</h2>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Microneedling stimulates collagen and elastin production by creating controlled micro-injuries in the skin.
        </p>
        <p className="text-sm text-black/80 mb-2">It improves:</p>
        <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
          <li>• Acne scars</li>
          <li>• Fine lines</li>
          <li>• Skin texture</li>
          <li>• Pigmentation</li>
          <li>• Pore size</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          Optimal results require a series of treatments spaced <strong>4–6 weeks apart</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• No retinol, exfoliants, benzoyl peroxide for 3 days</li>
          <li>• No waxing, laser, or chemical peel 5–7 days prior</li>
          <li>• Avoid excessive sun exposure</li>
          <li>• Arrive with clean skin</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Redness similar to sunburn</li>
          <li>• Mild swelling</li>
          <li>• Sensitivity</li>
          <li>• Tightness</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          Redness typically resolves within 24–72 hours. Skin may feel dry or flaky for several days.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">First 24 Hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• No makeup</li>
              <li>• No sweating</li>
              <li>• Avoid touching face</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">First 72 Hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Gentle cleanser only</li>
              <li>• Hyaluronic acid allowed</li>
              <li>• Avoid retinol and active ingredients</li>
              <li>• SPF 30+ daily</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-black/80 mt-3">Avoid anti-inflammatory medications unless medically necessary.</p>
        <p className="text-sm text-black/80 mt-2">Resume normal skincare after 3–5 days (except retinol — wait 2 weeks).</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">RESULTS</h3>
        <p className="text-sm text-black/80 mb-2">Skin becomes smoother and more radiant over several weeks as collagen rebuilds.</p>
        <p className="text-sm text-black/80 font-medium">For optimal results, a series of <strong>3–5 treatments</strong> is recommended.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
