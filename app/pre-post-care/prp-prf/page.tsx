import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PRP/PRF Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official PRP and PRF platelet-rich plasma therapy pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/prp-prf",
});

export default function PRPPRFCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">PRP / PRF</h2>
        <p className="text-sm text-black/70 mt-1">(Platelet-Rich Plasma / Platelet-Rich Fibrin)</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          PRP and PRF are regenerative treatments that use your body&apos;s own platelets and growth factors to stimulate collagen production, tissue repair, and cellular regeneration.
        </p>
        <p className="text-sm text-black/80 mb-2">A small amount of your blood is drawn, processed, and reinjected into targeted areas such as:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Under-eye hollows</li>
          <li>• Face (skin rejuvenation)</li>
          <li>• Scalp (hair restoration)</li>
          <li>• Acne scars</li>
          <li>• Combined with microneedling</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">PRF releases growth factors more slowly than PRP, providing prolonged regenerative support.</p>
        <p className="text-sm text-black/80 mt-2">Results develop gradually over several weeks as collagen rebuilds.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Avoid alcohol 24 hours prior</li>
          <li>• Avoid aspirin, NSAIDs, fish oil, and blood thinners 5–7 days prior (unless medically necessary)</li>
          <li>• Hydrate well 24 hours before treatment</li>
          <li>• Eat a light meal prior to appointment</li>
          <li>• Avoid active skin infection or illness</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 italic">If you are pregnant, breastfeeding, or have blood disorders, notify us prior to treatment.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">Immediately after treatment, you may experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Redness</li>
          <li>• Swelling</li>
          <li>• Tenderness</li>
          <li>• Mild bruising</li>
          <li>• Small injection marks</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Swelling may be more noticeable under the eyes and can last 2–5 days.</p>
        <p className="text-sm text-black/80 mt-2">Results appear gradually over 4–8 weeks as collagen stimulation progresses.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE INSTRUCTIONS</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">First 24 Hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Avoid strenuous exercise</li>
              <li>• Avoid excessive heat (saunas, hot tubs)</li>
              <li>• Do not massage treated areas</li>
              <li>• Avoid alcohol</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">First 48–72 Hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Gentle cleansing only</li>
              <li>• Avoid retinol and exfoliants</li>
              <li>• SPF 30+ required</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-black/80 mt-3 p-3 bg-pink-50 rounded-lg border border-[#E6007E]/30">
          <strong>Note:</strong> Avoid anti-inflammatory medications (Ibuprofen, Motrin, Advil) unless medically necessary, as they may interfere with the natural inflammatory healing process.
        </p>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
        <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® immediately if you experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Severe pain</li>
          <li>• Increasing swelling</li>
          <li>• Signs of infection</li>
          <li>• Vision changes (for facial injections)</li>
        </ul>
      </section>

      <section className="mb-6 p-3 bg-black/5 rounded-lg">
        <p className="text-sm text-black/80 text-center">PRP/PRF is a regenerative procedure. <strong>Optimal results often require a series of treatments.</strong></p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
