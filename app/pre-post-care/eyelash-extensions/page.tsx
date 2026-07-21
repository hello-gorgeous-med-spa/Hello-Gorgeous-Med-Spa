import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Eyelash Extensions Pre & Post Care | Hello Gorgeous Med Spa",
  description:
    "Official eyelash extension pre-care and aftercare for classic, hybrid, and volume sets and fills at Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/eyelash-extensions",
});

export default function EyelashExtensionsCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
          Pre + Post Care Guide
        </p>
        <h2 className="mt-1 text-3xl font-bold text-black">EYELASH EXTENSIONS</h2>
        <p className="mt-2 text-sm text-black/60">Classic · Hybrid · Volume · Fills</p>
      </div>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          ABOUT YOUR TREATMENT
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-black/80">
          Eyelash extensions are semi-permanent synthetic lashes bonded one-by-one (or in soft fans)
          to your natural lashes with medical-grade adhesive. Results look fullest after a full set;
          fills keep the set looking fresh as your natural lashes shed.
        </p>
        <p className="text-sm text-black/80">
          Typical appointment times: full set 2–2.5 hours · fill 45–90 minutes. Your eyes stay closed
          and the process is painless.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          BEFORE YOUR APPOINTMENT
        </h3>
        <ul className="ml-4 space-y-1 text-sm text-black/80">
          <li>• Arrive with clean lashes — no mascara, eyeliner, or eye makeup</li>
          <li>• Remove contact lenses (bring glasses if you need them)</li>
          <li>• Shower beforehand — lashes must stay dry for 24 hours after</li>
          <li>• Avoid caffeine if you tend to fidget; staying still helps retention</li>
          <li>• Wear comfortable clothing; you will be reclined for most of the visit</li>
          <li>• Tell us about eye infections, recent eye surgery, or allergies to adhesives/latex</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          WHAT TO EXPECT AFTER TREATMENT
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">Immediately after:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Lashes look longer and fuller right away</li>
              <li>• Mild awareness of the set as you blink is normal</li>
              <li>• Adhesive continues to cure over the first 24 hours</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">First week:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Natural shedding of 2–5 lashes per day is expected</li>
              <li>• Some twisting after sleep is normal — brush gently with a spoolie</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          AFTERCARE
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-black">First 24–48 hours (critical):</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• No water, steam, saunas, or hot yoga on the lashes</li>
              <li>• No swimming, hot showers aimed at the face, or steam from cooking</li>
              <li>• Do not touch, rub, or pick at the extensions</li>
              <li>• Sleep on your back or side — avoid face-down</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Daily care (ongoing):</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Brush daily with a clean spoolie</li>
              <li>• Clean with a gentle oil-free lash cleanser every 2–3 days</li>
              <li>• Use oil-free makeup and removers only near the eyes</li>
              <li>• Skip waterproof mascara and heavy oil-based products</li>
              <li>• Avoid cotton pads/balls near the lash line (fibers snag)</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Maintenance:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Book fills every 2–3 weeks for best fullness</li>
              <li>• After ~4 weeks without a fill, a full-set refresh may be needed</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border-2 border-[#E6007E] bg-pink-50/50 p-4">
        <h3 className="mb-2 text-lg font-bold text-[#E6007E]">⚠️ IMPORTANT</h3>
        <p className="mb-2 text-sm text-black/80">Call Hello Gorgeous Med Spa® if you experience:</p>
        <ul className="ml-4 space-y-1 text-sm text-black/80">
          <li>• Significant swelling, redness, or itching that worsens</li>
          <li>• Eye pain, discharge, or vision changes</li>
          <li>• Large clumps of lashes falling out suddenly</li>
        </ul>
        <p className="mt-3 text-sm font-medium text-black/80">
          Proper aftercare is the #1 factor in how long your set lasts.
        </p>
        <p className="mt-2 text-sm text-black/80">Questions or fills: (630) 636-6193</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
