import Image from "next/image";
import Link from "next/link";

const BOOK = "/book";

const NAV = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#tirzepatide", label: "Tirzepatide" },
  { href: "#semaglutide", label: "Semaglutide" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const MARQUEE =
  "Online intake • Clear pricing • Shipped to your door • Licensed Illinois providers • No insurance needed • NP on-site 6 days • Screened like a medical practice • Treated like family • ";

export function Glp1CareLanding() {
  return (
    <div className="bg-[#FFFBF9] pb-24 text-[#0A0A0A] antialiased lg:pb-0">
      <style>{`@keyframes hg-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.hg-marquee{animation:hg-marquee 40s linear infinite}`}</style>

      <div className="sticky top-[4.25rem] z-30 border-b border-[#FFE4EC] bg-[#FFFBF9]/90 backdrop-blur-xl lg:top-[7.75rem]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-6">
          <p className="font-serif text-[20px] font-bold">
            HELLO <span className="font-light italic">GORGEOUS</span>{" "}
            <span className="ml-2 rounded-full bg-black px-2 py-1 align-middle font-sans text-[9px] font-normal tracking-widest text-white">
              MED SPA • RX
            </span>
          </p>
          <nav className="hidden gap-7 text-[13px] font-medium lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <Link href={BOOK} className="rounded-full bg-[#E91E63] px-6 py-2.5 text-[13px] font-semibold text-white">
            Book Free Consult →
          </Link>
        </div>
      </div>

      <section className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex rounded-full border border-[#FFE4EC] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest">
            Doctor-guided GLP-1 care • Illinois Licensed
          </p>
          <h1 className="mt-6 font-serif text-[44px] font-semibold leading-[0.9] tracking-tight md:text-[68px]">
            Weight loss,
            <br />
            simplified with
            <br />
            <span className="font-normal italic">personalized care.</span>
          </h1>
          <p className="mt-5 max-w-[540px] text-[18px] leading-[1.6] text-black/60">
            A smarter approach to GLP-1 therapy — built around your day in Oswego. Clinician-approved, fairly priced, screened like a medical practice.
          </p>
          <div className="mt-8 space-y-3 text-[14px] font-medium">
            <div className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>
                <b>Everything included:</b> Prescription GLP-1 semaglutide & tirzepatide
              </span>
            </div>
            <div className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>1:1 IL clinician guidance + Care coaching</span>
            </div>
            <div className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black text-[11px] text-white">✓</span>
              <span>24/7 support + Free discreet shipping</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={BOOK} className="rounded-full bg-black px-8 py-4 text-[14px] font-semibold text-white">
              Start Free Intake →
            </Link>
            <a href="#pricing" className="rounded-full border border-black/15 px-8 py-4 text-[14px] font-semibold">
              See Pricing
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-[12px]">
            <div>⭐ 4.6/5 171 Reviews</div>
            <div>✓ 1,931 Verified Visits</div>
            <div>✓ Dr Arora MD 30+ Yrs</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-10 -top-10 h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-[80px]" />
          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-[#FFE4EC] bg-white p-6 shadow-xl">
              <Image src="/images/weight-loss/tirzepatide-vial.png" alt="Tirzepatide vial" width={480} height={640} className="h-[280px] w-full object-contain" />
              <div className="mt-4 font-serif font-semibold">Tirzepatide</div>
              <div className="text-[12px] opacity-60">Dual GIP/GLP-1 • $279/mo</div>
            </div>
            <div className="mt-8 rounded-[24px] border border-[#FFE4EC] bg-white p-6 shadow-xl">
              <Image src="/images/weight-loss/semaglutide-vial.png" alt="Semaglutide vial" width={480} height={640} className="h-[280px] w-full object-contain" />
              <div className="mt-4 font-serif font-semibold">Semaglutide</div>
              <div className="text-[12px] opacity-60">GLP-1 • $179/mo</div>
            </div>
          </div>
          <div className="relative mt-4 flex justify-between rounded-full bg-black px-6 py-3 text-[12px] font-bold text-white">
            <span>20% OFF FIRST REGEN RX</span>
            <span>→</span>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[#FFE4EC] bg-white py-3">
        <div className="hg-marquee flex w-max gap-12 whitespace-nowrap text-[12px] font-bold uppercase tracking-widest opacity-60">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>

      <section id="how-it-works" className="mx-auto max-w-[1440px] px-6 py-20">
        <h2 className="font-serif text-[40px] font-semibold">Three simple steps from intake to doorstep.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#FFE4EC] bg-white p-8">
            <div className="font-serif text-[48px] opacity-10">01</div>
            <h3 className="mt-2 font-semibold">Start your intake</h3>
            <p className="mt-3 text-[14px] leading-relaxed opacity-70">Share health history and goals in a short online intake. No credit card needed, no waiting room. Screening like a medical practice.</p>
          </div>
          <div className="rounded-[24px] border border-[#FFE4EC] bg-white p-8">
            <div className="font-serif text-[48px] opacity-10">02</div>
            <h3 className="mt-2 font-semibold">Licensed IL provider reviews</h3>
            <p className="mt-3 text-[14px] leading-relaxed opacity-70">NP on-site 6 days + Dr Arora MD oversight reviews your intake and writes prescription if eligible. We turn away 1 in 12 if not appropriate.</p>
          </div>
          <div className="rounded-[24px] border border-[#FFE4EC] bg-white p-8">
            <div className="font-serif text-[48px] opacity-10">03</div>
            <h3 className="mt-2 font-semibold">Ships from U.S. 503A pharmacy</h3>
            <p className="mt-3 text-[14px] leading-relaxed opacity-70">Compounded and shipped discreet, unmarked packaging with ongoing clinician support and secure messaging.</p>
          </div>
        </div>
      </section>

      <section id="tirzepatide" className="border-y border-[#FFE4EC] bg-white py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-white">FDA-APPROVED ZEPBOUND® AVAILABLE</span>
            <span className="rounded-full bg-[#FFE4EC] px-3 py-1 text-[10px] font-bold tracking-widest">COMPOUNDED OPTION • 503A</span>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-serif text-[46px] font-semibold leading-[0.9]">
                Tirzepatide
                <br />
                Weight Loss
              </h2>
              <p className="mt-4 text-[18px] opacity-60">Compounded tirzepatide therapy — dual GIP and GLP-1 receptor agonist prescribed by licensed IL provider and shipped from U.S. 503A pharmacy.</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#FFE4EC] p-5">
                  <div className="text-[13px] font-semibold">Licensed IL clinician</div>
                  <div className="mt-1 text-[12px] opacity-60">Real provider reviews intake — never automated. NP on-site 6 days.</div>
                </div>
                <div className="rounded-2xl border border-[#FFE4EC] p-5">
                  <div className="text-[13px] font-semibold">503A pharmacy</div>
                  <div className="mt-1 text-[12px] opacity-60">U.S.-based state-licensed partners — never offshore.</div>
                </div>
                <div className="rounded-2xl border border-[#FFE4EC] p-5">
                  <div className="text-[13px] font-semibold">Free discreet shipping</div>
                  <div className="mt-1 text-[12px] opacity-60">Unmarked packaging with ongoing support.</div>
                </div>
                <div className="rounded-2xl border border-[#FFE4EC] p-5">
                  <div className="text-[13px] font-semibold">Cancel anytime</div>
                  <div className="mt-1 text-[12px] opacity-60">No contracts. Pause or cancel one click.</div>
                </div>
              </div>
              <div className="mt-10 space-y-8 text-[14px] leading-[1.7]">
                <div>
                  <h4 className="font-bold">What it is</h4>
                  <p className="mt-2 opacity-70">A compounded tirzepatide program supervised by licensed IL clinician. Individualized, titrated over weeks, paired with ongoing care. Compounded preparation is not FDA-approved, not generic, not substitute, not equivalent of any FDA-approved product. Prescription only under qualified supervision.</p>
                </div>
                <div>
                  <h4 className="font-bold">How it works</h4>
                  <p className="mt-2 opacity-70">Dual agonist: activates GIP and GLP-1 receptors influencing appetite, satiety, insulin, gastric emptying. Distinct mechanism vs single-pathway GLP-1. SURMOUNT trials showed meaningful weight reduction with nutrition/lifestyle. Individual results vary by starting point, dose, tolerance, diet, movement, sleep.</p>
                </div>
                <div>
                  <h4 className="font-bold">Who it&apos;s for</h4>
                  <p className="mt-2 opacity-70">IL adults 21+ BMI 30+ or 27+ with weight-related condition (T2D, HTN, high cholesterol). Not for pregnant, planning, breastfeeding. Not for MTC, MEN2, pancreatitis history. Provider screens 20+ contraindications.</p>
                </div>
                <div>
                  <h4 className="font-bold">What to expect</h4>
                  <p className="mt-2 opacity-70">Once-weekly subcutaneous injection titrated gradually low → up to minimize side effects. Common: nausea, constipation, reflux, diarrhea, fatigue during dose increases, usually mild transient. Secure messaging — clinician can slow titration, hold, adjust.</p>
                </div>
              </div>
              <Link href={BOOK} className="mt-10 inline-flex rounded-full bg-[#E91E63] px-8 py-4 font-semibold text-white">
                Start Tirzepatide - $279/mo →
              </Link>
            </div>
            <div>
              <div className="sticky top-[12rem] rounded-[32px] border border-[#FFE4EC] bg-[#FFFBF9] p-8 text-center">
                <Image src="/images/weight-loss/tirzepatide-vial.png" alt="Tirzepatide vial" width={640} height={800} className="mx-auto h-[520px] w-full object-contain" />
                <div className="mt-6 rounded-2xl border bg-white p-4 text-left">
                  <div className="text-[10px] font-bold tracking-widest opacity-50">RE GEN • TIRZEPATIDE GLP-1 / GIP SUPPORT</div>
                  <div className="mt-1 font-serif">Sterile For Subcutaneous Use</div>
                  <div className="text-[12px] opacity-60">Tirzepatide / glycine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="semaglutide" className="py-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <div className="sticky top-[12rem] rounded-[32px] border border-[#FFE4EC] bg-white p-8 text-center">
              <Image src="/images/weight-loss/semaglutide-vial.png" alt="Semaglutide vial" width={640} height={800} className="mx-auto h-[520px] w-full object-contain" />
              <div className="mt-6 rounded-2xl border bg-[#FFFBF9] p-4 text-left">
                <div className="text-[10px] font-bold tracking-widest opacity-50">RE GEN • SEMAGLUTIDE GLP-1 SUPPORT</div>
                <div className="mt-1 font-serif">Sterile For Subcutaneous Use</div>
                <div className="text-[12px] opacity-60">Semaglutide / B6</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-white">FDA-APPROVED WEGOVY® AVAILABLE</span>
              <span className="rounded-full bg-[#FFE4EC] px-3 py-1 text-[10px] font-bold tracking-widest">COMPOUNDED OPTION</span>
            </div>
            <h2 className="font-serif text-[46px] font-semibold leading-[0.9]">
              Semaglutide
              <br />
              Weight Loss
            </h2>
            <p className="mt-4 text-[18px] opacity-60">The original GLP-1 for sustainable weight management. Starter-friendly dosing from licensed IL clinician. STEP trials ~15% mean weight loss over 68 weeks.</p>
            <div className="mt-10 space-y-8 text-[14px] leading-[1.7]">
              <div>
                <h4 className="font-bold">What it is</h4>
                <p className="mt-2 opacity-70">Single GLP-1 receptor agonist, starter-friendly, titrated gradually. Not FDA-approved compounded version — not generic of Wegovy®.</p>
              </div>
              <div>
                <h4 className="font-bold">How it works</h4>
                <p className="mt-2 opacity-70">Mimics natural GLP-1 released after eating — stimulates insulin, lowers blood sugar, tells brain reduce cravings, slows gastric emptying, central appetite control. STEP trials Garvey 2022 showed 15.2% mean change at week 104.</p>
              </div>
              <div>
                <h4 className="font-bold">Safety</h4>
                <p className="mt-2 opacity-70">Same class warnings: pancreatitis, gallbladder, kidney injury from dehydration, allergic reactions, thyroid C-cell boxed warning rodent studies. Tell provider all meds/supplements.</p>
              </div>
            </div>
            <Link href={BOOK} className="mt-10 inline-flex rounded-full bg-black px-8 py-4 font-semibold text-white">
              Start Semaglutide - $179/mo →
            </Link>

            <div className="mt-16 flex flex-col items-center gap-6 rounded-[24px] bg-[#0A0A0A] p-8 text-white sm:flex-row">
              <Image src="/images/weight-loss/nad-vial.png" alt="NAD+ vial" width={240} height={280} className="h-[140px] w-[120px] rounded-2xl bg-white object-contain p-2" />
              <div>
                <div className="text-[11px] tracking-widest opacity-50">REGEN RX • LONGEVITY</div>
                <div className="mt-1 font-serif text-[22px]">NAD+ 100 mg/mL</div>
                <div className="mt-2 text-[13px] opacity-60">Sterile • For Subcutaneous Use • Cellular energy & longevity support</div>
                <Link href={BOOK} className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-[12px] font-bold text-black">
                  Add NAD+ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#0A0A0A] py-20 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <h2 className="font-serif text-[44px]">One price. No contracts. Cancel anytime.</h2>
          <p className="mt-3 opacity-60">Pay monthly. Pause whenever. Free intake, free shipping, ongoing relationship with prescribing clinician included.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[24px] bg-white p-8 text-black">
              <Image src="/images/weight-loss/semaglutide-vial.png" alt="Semaglutide" width={320} height={400} className="mx-auto h-[180px] w-auto object-contain" />
              <div className="mt-6 text-[10px] font-bold tracking-widest opacity-50">GLP-1 AGONIST • WEIGHT LOSS</div>
              <div className="mt-1 font-serif text-[24px] font-semibold">Semaglutide</div>
              <div className="mt-2 text-[32px] font-bold">
                $179 <span className="text-[14px] font-normal opacity-60">/month</span>
              </div>
              <p className="mt-3 text-[13px] opacity-70">The original GLP-1 for sustainable weight management. Starter-friendly dosing.</p>
              <ul className="mt-6 space-y-2 text-[13px]">
                <li>✓ Provider consultation included</li>
                <li>✓ Free discreet shipping</li>
                <li>✓ Monthly titration support</li>
              </ul>
              <Link href={BOOK} className="mt-8 flex justify-center rounded-full bg-black py-3 font-semibold text-white">
                Get started
              </Link>
            </div>

            <div className="relative rounded-[24px] border-2 border-[#E91E63] bg-[#FFE4EC] p-8 text-black">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E91E63] px-4 py-1 text-[10px] font-bold tracking-widest text-white">MOST POPULAR</div>
              <Image src="/images/weight-loss/tirzepatide-vial.png" alt="Tirzepatide" width={320} height={400} className="mx-auto mt-4 h-[180px] w-auto object-contain" />
              <div className="mt-6 text-[10px] font-bold tracking-widest opacity-50">DUAL GLP-1/GIP • WEIGHT LOSS</div>
              <div className="mt-1 font-serif text-[24px] font-semibold">Tirzepatide</div>
              <div className="mt-2 text-[32px] font-bold">
                $279 <span className="text-[14px] font-normal opacity-60">/month</span>
              </div>
              <p className="mt-3 text-[13px] opacity-70">Dual-receptor therapy for patients ready to make real push toward goal weight.</p>
              <ul className="mt-6 space-y-2 text-[13px]">
                <li>✓ Provider consultation included</li>
                <li>✓ Free discreet shipping</li>
                <li>✓ Adjustable dose protocol</li>
              </ul>
              <Link href={BOOK} className="mt-8 flex justify-center rounded-full bg-[#E91E63] py-3 font-semibold text-white">
                Get started
              </Link>
            </div>

            <div className="rounded-[24px] border border-white/20 bg-white/10 p-8">
              <Image src="/images/weight-loss/nad-vial.png" alt="NAD+" width={240} height={280} className="mx-auto h-[180px] w-auto rounded-2xl bg-white object-contain p-3" />
              <div className="mt-6 text-[10px] font-bold tracking-widest opacity-50">LONGEVITY • NAD+</div>
              <div className="mt-1 font-serif text-[24px] font-semibold">NAD+ Support</div>
              <div className="mt-2 text-[20px] font-bold">Custom dosing</div>
              <p className="mt-3 text-[13px] opacity-70">100 mg/mL longevity support — sterile for subcutaneous use.</p>
              <Link href={BOOK} className="mt-8 flex justify-center rounded-full bg-white py-3 font-semibold text-black">
                Add to plan
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-[11px] opacity-40">Free shipping • No insurance required • HIPAA-compliant intake • 20% off first REGEN RX order • IL patients 21+</div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[900px] px-6 py-20">
        <h2 className="text-center font-serif text-[36px] font-semibold">Common questions.</h2>
        <div className="mt-12 space-y-4">
          <details className="rounded-2xl border border-[#FFE4EC] bg-white p-6 open:bg-[#FFFBF9]">
            <summary className="cursor-pointer font-semibold">Where is Hello Gorgeous Med Spa located?</summary>
            <p className="mt-3 text-[14px] opacity-70">74 W Washington St, Oswego IL 60543 — serving Naperville, Aurora, Plainfield, Kendall County. Free parking.</p>
          </details>
          <details className="rounded-2xl border border-[#FFE4EC] bg-white p-6">
            <summary className="cursor-pointer font-semibold">Is this FDA-approved or compounded?</summary>
            <p className="mt-3 text-[14px] opacity-70">We prescribe FDA-approved Wegovy® and Zepbound® when clinically appropriate and available. Compounded semaglutide/tirzepatide via 503A pharmacy only when appropriate per clinician judgment. Compounded not FDA-approved.</p>
          </details>
          <details className="rounded-2xl border border-[#FFE4EC] bg-white p-6">
            <summary className="cursor-pointer font-semibold">Who provides oversight?</summary>
            <p className="mt-3 text-[14px] opacity-70">Dr Mukesh Arora MD 30+ years Internal Medicine is Medical Director. Owner Danielle Alcala-Glazier RN-S leads daily practice. NP on-site 6 days.</p>
          </details>
          <details className="rounded-2xl border border-[#FFE4EC] bg-white p-6">
            <summary className="cursor-pointer font-semibold">What&apos;s the difference between Tirzepatide and Semaglutide?</summary>
            <p className="mt-3 text-[14px] opacity-70">Tirzepatide dual GIP/GLP-1, SURMOUNT trials 16-22.5% weight reduction. Semaglutide single GLP-1, STEP trials ~15%. Different mechanisms — not necessarily better for every patient.</p>
          </details>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] border-y border-[#FFE4EC] bg-[#FFE4EC]/50 px-6 py-10 text-[11px] leading-[1.7] opacity-60">
        <b>Safety & Compliance:</b> We prescribe FDA-approved Wegovy® and Zepbound® when clinically appropriate. Compounded medications dispensed by state-licensed U.S. 503A pharmacies and are not FDA-approved, not generic, not substitute. Prescription only if clinically appropriate. IL 21+. Screening required. Do not use if MTC/MEN2 history. Warnings: pancreatitis, gallbladder, kidney injury, allergic reactions, thyroid C-cell boxed warning. Seek urgent care for severe abdominal pain, persistent vomiting, allergic reaction. SURMOUNT/STEP data for FDA-approved products with lifestyle intervention — compounded not studied in those trials. Not medical advice.
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[#FFE4EC] bg-white p-4 lg:hidden">
        <div className="text-[12px]">
          <div className="font-bold">Start free intake — 2 min</div>
          <div className="opacity-60">$179 • $279/mo • Free shipping</div>
        </div>
        <Link href={BOOK} className="rounded-full bg-[#E91E63] px-6 py-3 text-[13px] font-bold text-white">
          Book →
        </Link>
      </div>
    </div>
  );
}
