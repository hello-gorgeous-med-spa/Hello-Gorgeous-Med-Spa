import type { Metadata } from "next";
import Link from "next/link";
import { LaserAcneCareAccordion } from "@/components/care/LaserAcneCareAccordion";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Laser Acne Protocol & Aftercare | Morpheus8 & Solaria CO₂ | Oswego IL",
    description:
      "Pre- and post-care for acne-prone skin: Morpheus8 Burst & Solaria CO₂ at Hello Gorgeous Oswego IL. Breakout prevention, prescription options, hygiene, and healing timeline — serving Naperville, Aurora & Plainfield.",
    path: "/care/laser-acne-protocol",
  }),
  keywords: [
    "Morpheus8 aftercare acne",
    "CO2 laser aftercare breakout",
    "RF microneedling post care",
    "Solaria CO2 Oswego",
    "acne protocol laser",
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why can breakouts happen after Morpheus8 or Solaria CO₂?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Heat-based treatments temporarily increase inflammation and can shift oil activity and barrier function. Acne-prone skin may develop temporary congestion or acneiform bumps. Proper aftercare and, when appropriate, prescription support reduce risk and severity.",
      },
    },
    {
      "@type": "Question",
      name: "When should I start acne medications after treatment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unless your provider tells you otherwise, topical protocols often begin 24–48 hours after treatment—not immediately on the day of the procedure. Oral medications are only used when prescribed for your situation.",
      },
    },
    {
      "@type": "Question",
      name: "Can Hello Gorgeous send prescriptions to my pharmacy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When medically appropriate, your provider may prescribe medications and send them to your pharmacy. All prescriptions require an evaluation and are individualized.",
      },
    },
  ],
};

export default function LaserAcneProtocolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <main className="bg-white min-h-screen">
        <section className="bg-black text-white">
          <div className="max-w-3xl mx-auto px-4 py-14 md:py-20">
            <p className="text-[#E6007E] text-sm font-semibold tracking-wide uppercase mb-3">Patient education</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Post-treatment acne protocol &amp; aftercare
            </h1>
            <p className="text-white/85 text-lg leading-relaxed mb-4">
              For <strong className="text-white">Morpheus8 Burst</strong> (RF microneedling) and{" "}
              <strong className="text-white">Solaria CO₂</strong> fractional laser — heat-based treatments that renew skin.
              If you are treating <strong className="text-white">acne or acne-prone skin</strong>, this page explains how we help
              you heal well and reduce post-procedure breakouts.
            </p>
            <p className="text-white/60 text-sm">
              Hello Gorgeous Med Spa · Oswego, IL · Serving Naperville, Aurora, Plainfield &amp; the Fox Valley
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services/morpheus8"
                className="inline-flex rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Morpheus8
              </Link>
              <Link
                href="/services/solaria-co2"
                className="inline-flex rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Solaria CO₂
              </Link>
              <Link
                href="/book"
                className="inline-flex rounded-lg bg-[#E6007E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10">
          <div className="rounded-xl border border-black/10 bg-zinc-50 p-5 text-sm text-black/80 mb-10">
            <p className="font-semibold text-black mb-2">Important</p>
            <p>
              This page is for <strong>education</strong> only. Your provider personalizes timing, products, and prescriptions.
              Nothing here replaces medical advice.{" "}
              <strong>Prescriptions require an evaluation</strong> and are sent to your pharmacy only when clinically appropriate.
            </p>
          </div>

          <LaserAcneCareAccordion
            items={[
              {
                id: "pre",
                title: "Pre-treatment guidelines",
                children: (
                  <>
                    <p className="font-medium text-black">Prepare your skin for the best possible results</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Avoid sun exposure and tanning 7–10 days prior</li>
                      <li>Discontinue retinol, exfoliants, and active acids 5–7 days before (unless your provider directs otherwise)</li>
                      <li>No waxing, chemical peels, or aggressive treatments for 1 week prior</li>
                      <li>Stay hydrated; keep skin moisturized with a gentle routine</li>
                      <li>Arrive with clean, makeup-free skin</li>
                      <li>Tell us about active breakouts, infections, or new medications</li>
                    </ul>
                    <p className="text-black/70 mt-3">
                      <strong className="text-black">Acne-prone clients:</strong> tell us in advance so we can customize your plan
                      and post-care — including whether prescription support may help.
                    </p>
                  </>
                ),
              },
              {
                id: "post",
                title: "Post-treatment care (what to expect & general rules)",
                children: (
                  <>
                    <p className="font-medium text-black">Protect your results. Heal beautifully.</p>
                    <p className="font-medium text-black mt-3">What to expect</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Redness, warmth, and mild swelling (often 24–72 hours; CO₂ may be longer)</li>
                      <li>Skin may feel tight, dry, or rough while renewing</li>
                      <li>Mild flaking or texture changes as skin turns over</li>
                    </ul>
                    <p className="font-medium text-black mt-4">Do</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Cleanse gently as directed (often morning and night)</li>
                      <li>Use a lightweight, non-comedogenic moisturizer unless we specify otherwise</li>
                      <li>Apply <strong>mineral SPF 30+</strong> daily starting when your provider clears you (often from day 2)</li>
                      <li>Change pillowcases nightly during early healing</li>
                      <li>Keep hair and hands off treated areas</li>
                    </ul>
                    <p className="font-medium text-black mt-4">Do not</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Heavy workouts, saunas, or heavy sweating for 48–72 hours (or as directed)</li>
                      <li>Makeup until your provider says it is safe (often at least 48 hours for many RF treatments; CO₂ may be longer)</li>
                      <li>Picking, scratching, or peeling skin manually</li>
                      <li>Retinols, acids, or exfoliants until fully healed</li>
                      <li>Thick occlusive ointments unless we tell you to use them</li>
                    </ul>
                  </>
                ),
              },
              {
                id: "breakout",
                title: "Breakout prevention (why it happens & what we do)",
                highlight: true,
                children: (
                  <>
                    <p>
                      Heat-based treatments can temporarily increase inflammation and oil activity. Some clients get{" "}
                      <strong>temporary congestion or &ldquo;purging&rdquo;-type bumps</strong> while skin renews — usually manageable
                      with the right topicals and hygiene.
                    </p>
                    <p className="font-medium text-black mt-3">Why breakouts can happen</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Heat + inflammation during healing</li>
                      <li>Temporary pore congestion</li>
                      <li>Heavy or occlusive products</li>
                      <li>Sweat, friction, bacteria on phones, pillowcases, or hands</li>
                    </ul>
                    <p className="mt-3 text-black/80">
                      <strong className="text-black">Early signs:</strong> small red bumps, clustered irritation, extra oiliness. If
                      this starts, follow your provider&apos;s plan and contact us if it worsens.
                    </p>
                  </>
                ),
              },
              {
                id: "rx",
                title: "Prescription acne prevention (pharmacy — when appropriate)",
                highlight: true,
                children: (
                  <>
                    <p>
                      For acne-prone patients or those at higher risk of post-procedure breakouts, your{" "}
                      <strong>medical provider may prescribe</strong> short-term medications and{" "}
                      <strong>send them to your pharmacy</strong> — so you get professional-grade support, not guesswork from the
                      drugstore aisle alone.
                    </p>
                    <p className="font-medium text-black mt-4">Examples we may use (individualized)</p>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <strong>Topical clindamycin</strong> — often first-line; thin layer to affected areas as directed; many
                        protocols start <strong>24–48 hours</strong> after treatment unless we instruct otherwise.
                      </li>
                      <li>
                        <strong>Benzoyl peroxide 2.5–5%</strong> — common adjunct; helps reduce acne bacteria; use as directed on
                        acne-prone zones.
                      </li>
                      <li>
                        <strong>Oral doxycycline (short course)</strong> — may be considered for moderate flare risk or
                        acne-prone/oily skin types; <strong>dose and duration only per prescription</strong>.
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-black/70">
                      Not every patient needs every medication. We align prescriptions with your history, severity, and treatment
                      type (Morpheus8 vs CO₂ depth/downtime).
                    </p>
                  </>
                ),
              },
              {
                id: "avoid",
                title: "Products to avoid after treatment",
                children: (
                  <>
                    <p>
                      Typically avoid <strong>at least 5–7 days</strong> or until your provider clears you — especially occlusive
                      or irritating products:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Petroleum-heavy ointments (e.g. thick Aquaphor/Vaseline) unless medically directed</li>
                      <li>Thick balms that trap heat and bacteria</li>
                      <li>Pore-clogging oils or heavy makeup</li>
                      <li>Retinoids / tretinoin</li>
                      <li>AHAs, BHAs, and other exfoliating acids</li>
                      <li>Scrubs or physical exfoliation</li>
                    </ul>
                    <p className="mt-3">These can trap heat, clog pores, and raise breakout risk while skin is vulnerable.</p>
                  </>
                ),
              },
              {
                id: "hygiene",
                title: "Hygiene protocol (pillowcases, phone, hands, hair)",
                children: (
                  <>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <strong>Pillowcases:</strong> change <strong>nightly</strong> for several nights to reduce bacteria and oil
                        transfer.
                      </li>
                      <li>
                        <strong>Phone &amp; surfaces:</strong> disinfect your phone daily; avoid pressing a dirty screen against
                        treated skin.
                      </li>
                      <li>
                        <strong>Hands off:</strong> do not pick, squeeze, or rub. Picking raises risk of{" "}
                        <strong>PIH, scarring, and prolonged redness</strong>.
                      </li>
                      <li>
                        <strong>Hair:</strong> keep hair off your face; avoid heavy oils and styling products contacting treated
                        skin.
                      </li>
                      <li>
                        <strong>Sleep:</strong> try not to sleep on one side only if it presses treated areas; fresh pillowcases help.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                id: "sweat",
                title: "Sweat, heat & workouts",
                children: (
                  <p>
                    Avoid strenuous exercise, saunas, steam rooms, and excessive heat for <strong>48–72 hours</strong> (or longer for
                    deeper CO₂ — follow your written instructions). Sweat + bacteria + compromised barrier = higher breakout risk.
                  </p>
                ),
              },
              {
                id: "timeline",
                title: "Typical healing timeline (varies by treatment depth)",
                children: (
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Morpheus8 / RF:</strong> redness and marks often improve over several days; texture continues to refine
                      for weeks.
                    </li>
                    <li>
                      <strong>Solaria CO₂:</strong> more downtime — redness, swelling, peeling often part of the process; full
                      results evolve over weeks to months as collagen remodels.
                    </li>
                    <li>
                      <strong>Breakout-type bumps:</strong> when they occur, they often improve over days to a couple of weeks with
                      adherence to plan.
                    </li>
                  </ul>
                ),
              },
              {
                id: "contact",
                title: "When to contact the office",
                children: (
                  <>
                    <p className="font-medium text-black">Call us if you have:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Rapidly worsening breakout or pain</li>
                      <li>Spreading redness, warmth, pus, or fever (possible infection — seek timely care)</li>
                      <li>Vision changes, severe swelling, or anything that feels emergency-level — use 911 / ER</li>
                    </ul>
                    <p className="mt-4">
                      <a href="tel:6306366193" className="font-semibold text-[#E6007E] hover:underline">
                        (630) 636-6193
                      </a>
                    </p>
                  </>
                ),
              },
            ]}
          />

          <div className="mt-12 rounded-2xl border-2 border-black bg-black text-white p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Ready to book or have questions?</h2>
            <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">
              We&apos;ll match treatment depth, downtime, and aftercare — including whether prescription support is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/book"
                className="inline-flex justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book consultation
              </Link>
              <Link
                href="/shop"
                className="inline-flex justify-center rounded-lg border-2 border-white/40 px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Shop skincare
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/50">
              &ldquo;Recovery kit&rdquo; retail bundles may be added later — ask us what we recommend at your visit.
            </p>
          </div>

          <p className="mt-10 text-center text-sm text-black/50">
            <Link href="/services/morpheus8" className="text-[#E6007E] font-medium hover:underline">
              Morpheus8 Burst
            </Link>
            {" · "}
            <Link href="/services/solaria-co2" className="text-[#E6007E] font-medium hover:underline">
              Solaria CO₂
            </Link>
            {" · "}
            <Link href="/financing" className="text-[#E6007E] font-medium hover:underline">
              Financing
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
