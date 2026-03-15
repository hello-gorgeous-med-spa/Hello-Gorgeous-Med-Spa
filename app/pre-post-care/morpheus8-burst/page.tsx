import type { Metadata } from "next";
import Link from "next/link";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Morpheus8 Burst Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official Morpheus8 Burst RF microneedling pre and post care instructions. 8mm deep treatment preparation and recovery guide from Hello Gorgeous Med Spa Oswego IL.",
  path: "/pre-post-care/morpheus8-burst",
});

export default function Morpheus8BurstCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">MORPHEUS8 BURST</h2>
        <p className="text-sm text-black/60 mt-2">RF Microneedling — Up to 8mm Depth</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Morpheus8 Burst delivers radiofrequency energy at <strong>three depths simultaneously</strong>, penetrating up to 8mm — double the depth of standard Morpheus8. This creates a more comprehensive collagen response for dramatic skin tightening.
        </p>
        <p className="text-sm text-black/80 mb-2">Burst technology treats:</p>
        <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
          <li>• Loose/sagging skin</li>
          <li>• Fine lines & wrinkles</li>
          <li>• Acne scars</li>
          <li>• Jowls & jawline</li>
          <li>• Neck laxity</li>
          <li>• Crepey skin</li>
          <li>• Enlarged pores</li>
          <li>• Post-weight loss skin</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          Most clients see significant improvement after <strong>1–2 sessions</strong> spaced 4–6 weeks apart. Collagen remodeling continues for <strong>3–6 months</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">2 WEEKS BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Avoid sun exposure and tanning (including self-tanners)</li>
          <li>• Stop using retinoids (Retin-A, tretinoin, retinol)</li>
          <li>• Discontinue AHAs, BHAs, and glycolic acid products</li>
          <li>• Avoid waxing, threading, or depilatory creams on treatment area</li>
          <li>• Stay well-hydrated and maintain healthy skin barrier</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">1 WEEK BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Stop blood-thinning supplements if medically approved (fish oil, vitamin E, aspirin, ibuprofen)</li>
          <li>• No chemical peels, laser treatments, or microdermabrasion</li>
          <li>• Avoid Botox or filler injections in the treatment area</li>
          <li>• Begin antiviral medication if prescribed (history of cold sores)</li>
          <li>• No alcohol 48 hours before treatment</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">DAY OF TREATMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Arrive with clean skin — no makeup, lotions, or sunscreen</li>
          <li>• Eat a normal meal before your appointment</li>
          <li>• Wear comfortable, loose clothing</li>
          <li>• A topical numbing cream will be applied for 20–30 minutes</li>
          <li>• Treatment typically takes 30–60 minutes depending on area</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Redness and warmth (like a sunburn) — normal for 24–72 hours</li>
          <li>• Mild swelling, especially around eyes and jawline</li>
          <li>• Tiny pinpoint marks from the micro-pins (resolve in 1–3 days)</li>
          <li>• Slight tightness and dryness</li>
          <li>• Mild peeling or flaking days 3–5</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          <strong>Burst treatments may have slightly more redness/swelling</strong> than standard Morpheus8 due to deeper penetration. This is normal and temporary.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — FIRST 24 HOURS</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• <strong>No makeup</strong> for 24 hours minimum</li>
          <li>• <strong>No touching</strong> the treated area with unwashed hands</li>
          <li>• <strong>No sweating</strong> — avoid exercise, saunas, hot tubs</li>
          <li>• Apply recommended post-care serum (hyaluronic acid based)</li>
          <li>• Sleep on your back if face was treated</li>
          <li>• Use cool compresses for swelling if needed (not ice directly)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — DAYS 2–7</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Gentle cleanser only (Cetaphil, CeraVe, or recommended cleanser)</li>
          <li>• Hyaluronic acid serum and gentle moisturizer</li>
          <li>• <strong>SPF 30+ daily</strong> — reapply every 2 hours if outdoors</li>
          <li>• No retinol, vitamin C, or active ingredients for 7 days</li>
          <li>• No exfoliating, scrubbing, or picking at flaking skin</li>
          <li>• Avoid swimming pools, hot tubs, and saunas</li>
          <li>• Mineral makeup may be applied after 24–48 hours</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — WEEKS 2–4</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Gradually reintroduce your normal skincare routine</li>
          <li>• Continue SPF 30+ daily (critical for best results)</li>
          <li>• Retinol may be resumed after 2 weeks or as directed by provider</li>
          <li>• Stay hydrated — collagen production requires proper hydration</li>
          <li>• Results begin becoming visible — skin appears smoother and tighter</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">RESULTS TIMELINE</h3>
        <div className="space-y-2">
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 1–3</span>
            <span className="text-black/80">Redness, warmth, mild swelling</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 3–5</span>
            <span className="text-black/80">Micro-crusting, light peeling</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 7</span>
            <span className="text-black/80">Makeup-ready, visibly smoother skin</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 1–3</span>
            <span className="text-black/80">Progressive tightening, improved texture</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 3–6</span>
            <span className="text-black/80">Peak collagen remodeling — maximum results</span>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHEN TO CONTACT US</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Signs of infection (increasing pain, pus, spreading redness)</li>
          <li>• Blistering or burns</li>
          <li>• Redness lasting more than 7 days</li>
          <li>• Cold sore outbreak</li>
          <li>• Any concerns — we&apos;re always here for you</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 font-semibold">
          📞 630-636-6193 — Call or text anytime with questions.
        </p>
      </section>

      <div className="text-center mt-8 pt-6 border-t border-black/10">
        <p className="text-sm text-black/50 mb-3">
          See also:{" "}
          <Link href="/aftercare/morpheus8" className="text-[#E6007E] hover:underline">Detailed Morpheus8 Aftercare Guide</Link>
          {" · "}
          <Link href="/morpheus8-burst-oswego-il" className="text-[#E6007E] hover:underline">About Morpheus8 Burst</Link>
        </p>
      </div>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
