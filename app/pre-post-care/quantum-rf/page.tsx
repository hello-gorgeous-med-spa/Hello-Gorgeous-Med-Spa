import type { Metadata } from "next";
import Link from "next/link";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "QuantumRF Pre & Post Care Guide | Hello Gorgeous Med Spa",
  description: "Official QuantumRF subdermal skin tightening pre and post care instructions. Preparation, compression garment guidance, and recovery from Hello Gorgeous Med Spa Oswego IL.",
  path: "/pre-post-care/quantum-rf",
});

export default function QuantumRFCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">QUANTUMRF</h2>
        <p className="text-sm text-black/60 mt-2">Subdermal Radiofrequency Skin Tightening</p>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">ABOUT YOUR TREATMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          QuantumRF delivers radiofrequency energy <strong>beneath the skin surface</strong> (subdermal) to tighten tissue and stimulate collagen production. This internal approach creates tissue contraction that mimics surgical lifting — without incisions or general anesthesia.
        </p>
        <p className="text-sm text-black/80 mb-2">QuantumRF treats:</p>
        <ul className="text-sm text-black/80 grid grid-cols-2 gap-1 ml-4">
          <li>• Loose facial skin</li>
          <li>• Sagging neck & jowls</li>
          <li>• Double chin</li>
          <li>• Abdominal laxity</li>
          <li>• Arm laxity</li>
          <li>• Thigh laxity</li>
          <li>• Post-weight loss skin</li>
          <li>• Body contouring</li>
        </ul>
        <p className="text-sm text-black/80 mt-3">
          Most areas require only <strong>1 treatment</strong>. Results continue improving for <strong>3–6 months</strong> as collagen rebuilds.
        </p>
      </section>

      <section className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <h3 className="text-lg font-bold text-amber-700 mb-2">📋 IMPORTANT — COMPRESSION GARMENT</h3>
        <p className="text-sm text-black/80 leading-relaxed">
          For <strong>body treatments</strong> (abdomen, arms, thighs), you will need a <strong>compression garment</strong> to wear for 1–2 weeks post-treatment. Your provider will discuss this during consultation and recommend the appropriate garment before your appointment.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">2 WEEKS BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Avoid prolonged sun exposure and tanning</li>
          <li>• Stop smoking (impairs healing and collagen production)</li>
          <li>• Stay well-hydrated</li>
          <li>• Inform your provider of all medications and supplements</li>
          <li>• Purchase compression garment if treating body areas</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">1 WEEK BEFORE</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Stop blood thinners if medically approved (aspirin, ibuprofen, fish oil, vitamin E)</li>
          <li>• No alcohol for 48 hours before treatment</li>
          <li>• No new skincare products on treatment area</li>
          <li>• Arrange for someone to drive you home (recommended)</li>
          <li>• Plan for 3–5 days of reduced activity</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">DAY OF TREATMENT</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Arrive with clean skin — no makeup, lotions, or deodorant on treatment area</li>
          <li>• Eat a light meal before your appointment</li>
          <li>• Wear loose, comfortable clothing (button-up if treating face/neck)</li>
          <li>• Bring your compression garment for body treatments</li>
          <li>• Local anesthesia will be administered (not general — you will be awake)</li>
          <li>• Treatment takes 45–90 minutes depending on area</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHAT TO EXPECT AFTER</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Swelling and tenderness in the treated area (most significant first 48 hours)</li>
          <li>• Mild bruising is possible</li>
          <li>• Numbness or tingling in the treated area (temporary)</li>
          <li>• Small entry point marks (resolve within a few days)</li>
          <li>• Immediate tissue contraction — you may notice tightening right away</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — FIRST 48 HOURS</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• <strong>Wear compression garment</strong> as directed (body areas — 24/7 except for showering)</li>
          <li>• Apply ice packs 20 minutes on / 20 minutes off for swelling</li>
          <li>• Take prescribed pain medication as directed</li>
          <li>• Keep entry points clean and dry</li>
          <li>• <strong>No exercise or strenuous activity</strong></li>
          <li>• Sleep elevated if face/neck was treated</li>
          <li>• Stay hydrated</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — DAYS 3–14</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Continue wearing compression garment for body areas (1–2 weeks as directed)</li>
          <li>• Light walking is encouraged — promotes circulation and healing</li>
          <li>• No heavy lifting, running, or intense exercise for 2 weeks</li>
          <li>• Gentle showering is fine — avoid hot water on treated area</li>
          <li>• No hot tubs, saunas, swimming pools, or baths</li>
          <li>• Swelling and bruising will gradually resolve</li>
          <li>• Numbness may persist for days to weeks — this is normal</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">AFTERCARE — WEEKS 2–6</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Most normal activities can resume by week 2</li>
          <li>• Resume exercise gradually (start light, build up)</li>
          <li>• Continue SPF 30+ daily on facial treatments</li>
          <li>• Tightening becomes progressively more visible</li>
          <li>• Follow up with your provider at 4–6 weeks</li>
          <li>• Discuss whether a second session is beneficial</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">RESULTS TIMELINE</h3>
        <div className="space-y-2">
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 1–3</span>
            <span className="text-black/80">Swelling, tenderness, some immediate tightening visible</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Day 3–7</span>
            <span className="text-black/80">Swelling subsides, bruising fades, compression garment continues</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Week 2–4</span>
            <span className="text-black/80">Return to normal activity, progressive tightening</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 1–3</span>
            <span className="text-black/80">Significant collagen remodeling — skin continues tightening</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="font-bold text-[#E6007E] w-24 flex-shrink-0">Month 3–6</span>
            <span className="text-black/80">Peak results — maximum contraction and collagen production</span>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">WHEN TO CONTACT US</h3>
        <ul className="text-sm text-black/80 space-y-1 ml-4">
          <li>• Signs of infection (increasing redness, warmth, pus, fever)</li>
          <li>• Severe or worsening pain not controlled by medication</li>
          <li>• Fluid collection or unusual swelling</li>
          <li>• Numbness that worsens or causes concern</li>
          <li>• Any concerns at all — never hesitate to reach out</li>
        </ul>
        <p className="text-sm text-black/80 mt-3 font-semibold">
          📞 630-636-6193 — Call or text anytime with questions.
        </p>
      </section>

      <div className="text-center mt-8 pt-6 border-t border-black/10">
        <p className="text-sm text-black/50 mb-3">
          See also:{" "}
          <Link href="/aftercare/quantum-rf" className="text-[#E6007E] hover:underline">Detailed QuantumRF Aftercare Guide</Link>
          {" · "}
          <Link href="/quantum-rf-oswego-il" className="text-[#E6007E] hover:underline">About QuantumRF</Link>
        </p>
      </div>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
