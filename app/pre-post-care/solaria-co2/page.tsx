import type { Metadata } from "next";
import Link from "next/link";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ Laser Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official Solaria CO₂ fractional laser pre and post care instructions. Preparation, recovery timeline, and aftercare from Hello Gorgeous Med Spa Oswego IL.",
  path: "/pre-post-care/solaria-co2",
});

export default function SolariaCO2CareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">SOLARIA CO₂ LASER</h2>
        <p className="text-sm text-black/60 mt-2">Fractional CO₂ Skin Resurfacing</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Solaria CO₂ is a <strong>fractional ablative laser</strong> — the gold standard in skin resurfacing. It removes damaged outer skin layers while stimulating deep collagen production. This is a more intensive treatment than RF microneedling, with more dramatic results and a longer recovery.
        </p>
        <p className="text-sm text-black/80 mb-2">Solaria treats:</p>
        <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
          <li>• Deep wrinkles</li>
          <li>• Acne scars</li>
          <li>• Sun damage</li>
          <li>• Age spots</li>
          <li>• Skin laxity</li>
          <li>• Crepey skin</li>
          <li>• Enlarged pores</li>
          <li>• Stretch marks</li>
          <li>• Surgical scars</li>
        </ul>
      </section>

      <section className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ IMPORTANT — ANTIVIRAL MEDICATION</h3>
        <p className="text-sm text-black/80 leading-relaxed">
          If you have <strong>any history of cold sores (HSV-1)</strong>, you <strong>MUST</strong> take antiviral medication (Valtrex/valacyclovir) starting <strong>2 days before treatment</strong> and continuing for <strong>7–10 days after</strong>. CO₂ laser can trigger a severe outbreak. Notify your provider during consultation — they will prescribe medication if needed.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">4 WEEKS BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Stop all retinoids (Retin-A, tretinoin, retinol)</li>
          <li>• Avoid prolonged sun exposure — use SPF 30+ daily</li>
          <li>• No tanning beds or self-tanners</li>
          <li>• Your provider may prescribe a pre-treatment skincare regimen</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">2 WEEKS BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Discontinue AHAs, BHAs, glycolic acid, vitamin C serums</li>
          <li>• No waxing, threading, or chemical peels on treatment area</li>
          <li>• Stop blood thinners if medically approved (aspirin, ibuprofen, fish oil, vitamin E)</li>
          <li>• Avoid Botox or filler in the treatment area</li>
          <li>• Begin antiviral medication if prescribed</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">DAY OF TREATMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Arrive with completely clean skin — no makeup, lotions, or sunscreen</li>
          <li>• Eat a normal meal before your appointment</li>
          <li>• Arrange for someone to drive you home (recommended for full face)</li>
          <li>• Wear a button-up shirt to avoid pulling clothing over treated skin</li>
          <li>• Numbing cream will be applied for 30–45 minutes before treatment</li>
          <li>• Treatment takes 30–60 minutes depending on area and depth</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER</h3>
        <p className="text-sm text-black/80 mb-3">
          CO₂ laser recovery is <strong>more intensive than RF microneedling</strong>. Plan for 5–7 days of social downtime.
        </p>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Significant redness and swelling (especially first 48 hours)</li>
          <li>• Oozing/weeping skin is normal for 24–48 hours</li>
          <li>• Skin will feel tight, hot, and sensitive</li>
          <li>• Peeling and flaking begins around day 3–5</li>
          <li>• A bronze/brown crusting may form — DO NOT pick</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — FIRST 48 HOURS</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• <strong>Soak and apply ointment</strong> every 2–4 hours (Aquaphor or recommended barrier cream)</li>
          <li>• Gently clean with diluted white vinegar solution or prescribed cleanser</li>
          <li>• <strong>Keep skin moist at all times</strong> — do NOT let it dry out or scab</li>
          <li>• <strong>No makeup</strong> whatsoever</li>
          <li>• Sleep elevated on 2 pillows to reduce swelling</li>
          <li>• Apply cool compresses for comfort (not ice directly on skin)</li>
          <li>• Take prescribed pain medication as directed</li>
          <li>• Continue antiviral medication</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — DAYS 3–7</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Continue gentle cleansing and moisturizing</li>
          <li>• Skin will begin peeling — <strong>DO NOT pick, pull, or scrub</strong></li>
          <li>• Let dead skin shed naturally</li>
          <li>• Switch from Aquaphor to a gentle moisturizer when peeling begins</li>
          <li>• <strong>No sun exposure</strong> — skin is extremely vulnerable</li>
          <li>• No exercise, sweating, hot tubs, saunas, or swimming</li>
          <li>• No retinol, acids, or active ingredients</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — WEEKS 2–4</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• New pink skin will be visible — this is healthy new tissue</li>
          <li>• Pink color fades over 2–8 weeks</li>
          <li>• <strong>SPF 30+ is CRITICAL</strong> — reapply every 2 hours when outdoors</li>
          <li>• Gentle cleanser and moisturizer only</li>
          <li>• Mineral makeup may be applied after provider approval</li>
          <li>• No retinol or active ingredients until provider clears you (usually 4 weeks)</li>
          <li>• Stay hydrated — drink plenty of water</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">RESULTS TIMELINE</h3>
        <div className="space-y-2">
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 1–3</span>
            <span className="text-black/80">Intense redness, swelling, oozing — keep skin moist</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 3–5</span>
            <span className="text-black/80">Peeling begins, skin feels tight and dry</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 7–10</span>
            <span className="text-black/80">Most peeling complete, new pink skin visible</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Week 2–4</span>
            <span className="text-black/80">Pinkness fades, smoother texture emerging</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 1–3</span>
            <span className="text-black/80">Collagen remodeling begins — visible tightening</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 3–6</span>
            <span className="text-black/80">Peak results — maximum collagen production</span>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHEN TO CONTACT US</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Signs of infection (increasing pain, pus, fever, spreading redness)</li>
          <li>• Blistering or burns that worsen</li>
          <li>• Cold sore outbreak (start/increase antiviral medication immediately)</li>
          <li>• Redness that worsens instead of improving after day 5</li>
          <li>• Any unusual changes in skin color (hyperpigmentation concerns)</li>
          <li>• Any concerns at all — we&apos;re here for you</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 font-semibold">
          📞 630-636-6193 — Call or text anytime with questions.
        </p>
      </section>

      <div className="text-center mt-8 pt-6 border-t border-black/10">
        <p className="text-sm text-black/50 mb-3">
          See also:{" "}
          <Link href="/aftercare/solaria-co2" className="text-[#E6007E] hover:underline">Detailed Solaria Aftercare Guide</Link>
          {" · "}
          <Link href="/solaria-co2-laser-oswego-il" className="text-[#E6007E] hover:underline">About Solaria CO₂ Laser</Link>
        </p>
      </div>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
