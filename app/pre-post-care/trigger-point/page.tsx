import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Trigger Point Injections Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official trigger point injection pre and post care instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/trigger-point",
});

export default function TriggerPointCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">TRIGGER POINT INJECTIONS</h2>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Trigger point injections are administered into tight bands of muscle (knots) to relieve pain, reduce muscle tension, and improve mobility.
        </p>
        <p className="text-sm text-black/80 mb-2">These injections may contain:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Local anesthetic</li>
          <li>• Saline</li>
          <li>• Vitamin blends</li>
          <li>• Other physician-directed formulations</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 mb-2">Trigger point injections are commonly used for:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Neck pain</li>
          <li>• Shoulder tension</li>
          <li>• Upper back pain</li>
          <li>• Headaches</li>
          <li>• Muscle spasms</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Relief may be felt immediately or within 24–72 hours.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">BEFORE YOUR APPOINTMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Inform us of all medications</li>
          <li>• Avoid blood thinners 3–5 days prior (if medically appropriate)</li>
          <li>• Eat a light meal</li>
          <li>• Stay hydrated</li>
          <li>• Notify us of infection, fever, or illness</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER TREATMENT</h3>
        <p className="text-sm text-black/80 mb-2">You may experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Mild soreness at injection site</li>
          <li>• Temporary muscle stiffness</li>
          <li>• Bruising</li>
          <li>• Fatigue</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">Soreness may last 24–48 hours. Improvement in muscle tension may be immediate or gradual.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE</h3>
        <div>
          <p className="text-sm font-semibold text-black">First 24 Hours:</p>
          <ul className="text-sm text-black/80 ml-4">
            <li>• Avoid strenuous exercise</li>
            <li>• Apply ice to injection site if needed</li>
            <li>• Gentle stretching is encouraged</li>
          </ul>
        </div>
        <p className="text-sm text-black/80 mt-3">Continue hydration.</p>
        <p className="text-sm text-black/80 mt-2">You may use Tylenol for discomfort unless otherwise directed.</p>
      </section>

      <section className="mb-6 p-4 border-2 border-[#E6007E] rounded-lg bg-pink-50/50">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">⚠️ IMPORTANT</h3>
        <p className="text-sm text-black/80 mb-2">Contact Hello Gorgeous Med Spa® if you experience:</p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Increasing pain</li>
          <li>• Fever</li>
          <li>• Significant swelling</li>
          <li>• Signs of infection</li>
        </ul>
      </section>

      <section className="mb-6 p-3 bg-black/5 rounded-lg">
        <p className="text-sm text-black/80 text-center">Trigger point therapy may require repeat sessions depending on muscle tension severity.</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
