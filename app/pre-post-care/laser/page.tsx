import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Laser Hair Removal Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official laser hair removal pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/laser",
});

export default function LaserCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">LASER HAIR REMOVAL</h2>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Laser hair removal uses controlled light energy to target and disable hair follicles during their growth phase.
        </p>
        <p className="text-sm text-black/80">
          For best results, treatments are performed in a series of <strong>6–8 sessions</strong> spaced <strong>4–6 weeks apart</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• <strong>Shave treatment area 24 hours prior</strong></li>
          <li>• Do NOT wax, pluck, or tweeze</li>
          <li>• Avoid tanning (sun, spray tan, tanning beds) for 2 weeks</li>
          <li>• Avoid photosensitizing medications</li>
          <li>• Avoid active skin irritation or infection</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 p-3 bg-pink-50 rounded-lg border border-[#E6007E]/30">
          <strong>⚠️ Important:</strong> Laser cannot be performed on tanned skin.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Mild redness</li>
          <li>• Slight swelling around follicles</li>
          <li>• Warmth similar to mild sunburn</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          These symptoms typically resolve within 24–48 hours. Hair will shed over 1–2 weeks.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Avoid sun exposure for 7 days</li>
          <li>• Wear SPF 30+ daily</li>
          <li>• Avoid hot showers, saunas, and strenuous workouts for 24 hours</li>
          <li>• Do not scratch or exfoliate aggressively for several days</li>
        </ul>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
        <p className="text-sm text-black/80">
          If blistering occurs, <strong>do not puncture</strong>. Contact us immediately.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">RESULTS</h3>
        <p className="text-sm text-black/80 mb-2">Hair reduction improves with each session.</p>
        <p className="text-sm text-black/80 font-medium">Consistency is key for long-term smooth results.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
