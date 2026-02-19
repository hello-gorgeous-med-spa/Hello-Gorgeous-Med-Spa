import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dermal Filler Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official dermal filler pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/filler",
});

export default function FillerCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">DERMAL FILLER</h2>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Dermal fillers are FDA-approved injectable gels designed to restore lost volume, enhance facial contours, and smooth deeper lines. Most fillers are composed of hyaluronic acid, a naturally occurring substance in the body that provides hydration and structure to the skin.
        </p>
        <p className="text-sm text-black/80 mb-2">Common treatment areas include:</p>
        <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
          <li>• Lips</li>
          <li>• Cheeks</li>
          <li>• Jawline</li>
          <li>• Chin</li>
          <li>• Nasolabial folds</li>
          <li>• Marionette lines</li>
          <li>• Under-eye hollows</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Results are visible immediately, with final results settling within 10–14 days.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <p className="text-sm text-black/80 mb-2">To reduce bruising and swelling:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Avoid alcohol 24–48 hours prior</li>
          <li>• Avoid aspirin, ibuprofen, naproxen, fish oil, vitamin E, garlic supplements, and other blood thinners for 5–7 days (unless medically necessary)</li>
          <li>• Avoid strenuous exercise the day of treatment</li>
          <li>• Discontinue retinol 3 days prior</li>
          <li>• Avoid dental procedures 2 weeks before and after treatment</li>
          <li>• Reschedule if you develop cold sores, infection, rash, or illness</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 italic">If you are prone to cold sores, notify us prior to treatment — preventive medication may be recommended.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">Immediately after treatment, you may experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Swelling</li>
          <li>• Tenderness</li>
          <li>• Bruising</li>
          <li>• Firmness</li>
          <li>• Mild asymmetry</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Swelling is normal and may peak at 48 hours. Lips may swell more than other areas. Most swelling resolves within 3–7 days. Final results are evaluated at 14 days.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE INSTRUCTIONS</h3>
        <p className="text-sm text-black/80 mb-3">For best results and safety:</p>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">First 6 hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Do not touch, press, or massage treated areas</li>
              <li>• Avoid makeup if possible</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">First 24 hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Avoid strenuous exercise</li>
              <li>• Avoid alcohol</li>
              <li>• Avoid excessive heat (saunas, hot tubs)</li>
              <li>• Sleep with head elevated</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">First 48 hours:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Avoid facials, lasers, chemical peels</li>
              <li>• Avoid extreme temperatures</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">For 2 weeks:</p>
            <ul className="text-sm text-black/80 ml-4">
              <li>• Avoid dental work</li>
              <li>• Avoid aggressive facial massage</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-black/80 mt-3">Cold compress may be applied gently to reduce swelling.</p>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT SAFETY INFORMATION</h3>
        <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® immediately if you experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Severe or increasing pain</li>
          <li>• Skin discoloration (white, gray, or purple patches)</li>
          <li>• Blistering</li>
          <li>• Vision changes</li>
          <li>• Severe asymmetry</li>
          <li>• Signs of infection</li>
        </ul>
        <p className="text-sm text-black/80 mt-2 italic">These are rare but require immediate evaluation.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">LONGEVITY + MAINTENANCE</h3>
        <p className="text-sm text-black/80 mb-2">Depending on area treated and product used, results may last:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• <strong>Lips:</strong> 6–12 months</li>
          <li>• <strong>Cheeks/Jawline:</strong> 9–18 months</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">We recommend follow-up evaluation at 2 weeks if needed. Consistent maintenance preserves facial balance and structure over time.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
