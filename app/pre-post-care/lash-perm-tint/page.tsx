import type { Metadata } from "next";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Lash Perm & Tint Pre & Post Care | Hello Gorgeous Med Spa",
  description:
    "Official lash lift/perm and tint pre-care and aftercare instructions from Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care/lash-perm-tint",
});

export default function LashPermTintCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
          Pre + Post Care Guide
        </p>
        <h2 className="mt-1 text-3xl font-bold text-black">LASH PERM &amp; TINT</h2>
        <p className="mt-2 text-sm text-black/60">Lash lift · Lash perm · Tint</p>
      </div>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          ABOUT YOUR TREATMENT
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-black/80">
          A lash perm (lash lift) uses rods and a gentle lifting solution to curl your natural lashes
          from the root — no extensions. Tint darkens the lash shaft for a mascara-like finish that
          lasts through the growth cycle. Together they give open, polished eyes with low daily
          maintenance.
        </p>
        <p className="text-sm text-black/80">
          Results typically last 6–8 weeks as your natural lashes grow out. Appointment time is usually
          45–75 minutes.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b-2 border-[#E6007E] pb-1 text-lg font-bold text-[#E6007E]">
          BEFORE YOUR APPOINTMENT
        </h3>
        <ul className="ml-4 space-y-1 text-sm text-black/80">
          <li>• Come with clean, makeup-free lashes and lids</li>
          <li>• Remove contact lenses before your appointment</li>
          <li>• Avoid oil cleansers or heavy eye creams the morning of your visit</li>
          <li>• Do not use lash growth serums for 48 hours before (oils can weaken the lift)</li>
          <li>• Skip waterproof mascara for several days prior if possible</li>
          <li>
            • Tell us about eye infections, recent eye procedures, pregnancy, or known allergies to
            hair dye / peroxide / PPD
          </li>
          <li>• If you have very short or sparse lashes, we may adjust expectations or recommend tint only</li>
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
              <li>• Lashes look lifted and (if tinted) darker right away</li>
              <li>• Mild lid awareness or coolness from the solutions is normal</li>
              <li>• Curl continues to set over the first 24–48 hours</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Over the next weeks:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Softening of the curl as natural lashes grow is expected</li>
              <li>• Tint gradually fades with cleansing and oil exposure</li>
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
              <li>• Keep lashes completely dry — no water, steam, sauna, or sweat on the eyes</li>
              <li>• No makeup, mascara, or eye cream on the lash line</li>
              <li>• Do not rub, pull, or sleep face-down</li>
              <li>• Avoid swimming and hot yoga</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">After 48 hours:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Resume gentle cleansing; pat dry — do not rub</li>
              <li>• Water-based or oil-free mascara only if needed (many clients skip mascara)</li>
              <li>• Avoid oil-based removers and heavy oils near the lash line — they shorten tint life</li>
              <li>• Hold off on lash serums for 48–72 hours, then use sparingly if directed</li>
              <li>• No keratin straighteners, perms, or harsh chemical treatments near the eyes</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Maintenance:</p>
            <ul className="ml-4 text-sm text-black/80">
              <li>• Rebook every 6–8 weeks as lashes grow out</li>
              <li>• Tint-only refreshes can be scheduled sooner if desired</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border-2 border-[#E6007E] bg-pink-50/50 p-4">
        <h3 className="mb-2 text-lg font-bold text-[#E6007E]">⚠️ IMPORTANT</h3>
        <p className="mb-2 text-sm text-black/80">Contact Hello Gorgeous Med Spa® if you experience:</p>
        <ul className="ml-4 space-y-1 text-sm text-black/80">
          <li>• Persistent stinging, swelling, or rash around the eyes</li>
          <li>• Vision changes or significant eye pain</li>
          <li>• Unexpected bald patches or sudden lash loss (rare)</li>
        </ul>
        <p className="mt-3 text-sm font-medium text-black/80">
          Keeping lashes dry for the first 24–48 hours protects both the lift and the tint.
        </p>
        <p className="mt-2 text-sm text-black/80">Questions: (630) 636-6193</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
