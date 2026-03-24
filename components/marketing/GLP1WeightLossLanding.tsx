"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const FAQS = [
  {
    q: "Am I a good candidate for GLP-1 therapy?",
    a: "GLP-1 therapy is typically recommended for adults with a BMI of 27+ (with weight-related conditions) or BMI 30+. Our team will assess your full health history during your consultation to determine if this program is right for you.",
  },
  {
    q: "Do I need insurance for this program?",
    a: "No insurance required. Our GLP-1 program is offered as a self-pay service so you can start right away without dealing with prior authorizations or coverage headaches. HSA and FSA cards are accepted.",
  },
  {
    q: "What medications are used?",
    a: "We work with clinically proven GLP-1 medications including semaglutide and tirzepatide. Your provider will recommend the best option based on your health profile and goals.",
  },
  {
    q: "How quickly will I see results?",
    a: "Many patients begin to see weight loss within the first 4–8 weeks. Results vary by individual. Our team monitors your progress closely and adjusts your plan to keep you moving toward your goals.",
  },
  {
    q: "Is this different from online GLP-1 telehealth services?",
    a: "Yes — we're local, in-person, and relationship-based. You see the same team in our Oswego office. Real clinical care from people who know your name.",
  },
];

export function GLP1WeightLossLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="bg-white text-black">
      {/* Slim top bar — complements site header */}
      <div className="border-b-2 border-black bg-gradient-to-r from-[#E6007E]/10 to-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/80 text-sm font-sans font-medium tracking-wide">MED SPA</span>
          </Link>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase tracking-wider bg-[#E6007E] text-white px-5 py-2 rounded-lg hover:bg-black transition-colors"
          >
            Book GLP-1 Consult
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50/80 py-16 md:py-24 px-4 text-center">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E6007E]/10 blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-black/5 blur-2xl translate-y-1/2 -translate-x-1/4" aria-hidden />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            GLP-1 Weight Loss Program
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-black leading-tight mb-4">
            Lose the weight.
            <br />
            <em className="text-[#E6007E] not-italic font-serif">Keep your life.</em>
          </h1>
          <p className="text-lg text-black/70 max-w-xl mx-auto mb-10 font-light">
            Medically supervised GLP-1 therapy, personalized to you — right here in Oswego, IL. Serving Naperville, Aurora, Plainfield & the Fox Valley. No insurance hassle. Just real, in-person care.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Book Your Consultation
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center border-2 border-black text-black px-8 py-4 font-semibold rounded-xl hover:bg-black hover:text-white transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/10 bg-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-black/70">
          {["NP-supervised", "No insurance required", "In-person · Oswego, IL", "HSA / FSA accepted"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xs">✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">The Process</p>
          <h2 className="font-serif text-3xl md:text-4xl text-black mb-3">
            Simple. Supported.
            <br />
            <em className="text-[#E6007E] not-italic">Sustainable.</em>
          </h2>
          <p className="text-black/65 max-w-xl mb-12 font-light">
            We handle everything — from your initial assessment to ongoing support. You focus on feeling better.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "1", t: "Consult & Qualify", d: "Meet with our team for a full health assessment and find out if GLP-1 therapy is right for you." },
              { n: "2", t: "Personalized Plan", d: "Your dose, your timeline, your goals. We build a program around your body — not a one-size template." },
              { n: "3", t: "Start & Adjust", d: "Begin your medication with in-person guidance. We monitor your progress and adjust as needed." },
              { n: "4", t: "Ongoing Support", d: "Regular check-ins, accountability, and access to our team every step of the way." },
            ].map((s) => (
              <div
                key={s.n}
                className="bg-white border-2 border-black/10 rounded-2xl p-6 text-center hover:border-[#E6007E]/40 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#E6007E] text-[#E6007E] font-serif text-xl flex items-center justify-center mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-serif text-lg font-semibold text-black mb-2">{s.t}</h3>
                <p className="text-sm text-black/60 font-light">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">What You Get</p>
          <h2 className="font-serif text-3xl md:text-4xl text-black mb-12">
            Everything in one place.
            <br />
            <em className="text-[#E6007E] not-italic">No runaround.</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { t: "Initial Consultation", d: "Comprehensive health intake, goal-setting, and eligibility assessment with our licensed team." },
              { t: "GLP-1 Prescription", d: "Semaglutide or tirzepatide therapy prescribed and managed in-house by our clinical staff." },
              { t: "Medication Management", d: "Dose tracking, side effect monitoring, and titration adjustments included with your program." },
              { t: "Follow-Up Appointments", d: "Scheduled check-ins to review progress, adjust your plan, and keep you motivated." },
              { t: "Lifestyle Guidance", d: "Nutrition and lifestyle coaching to amplify your results and build lasting habits." },
              { t: "Local, In-Person Care", d: "See a real provider in Oswego — not a telehealth-only experience. Real relationship, real results." },
            ].map((c) => (
              <div key={c.t} className="bg-pink-50/80 border-l-4 border-[#E6007E] rounded-r-xl p-5">
                <h3 className="font-serif text-lg text-black mb-1">{c.t}</h3>
                <p className="text-sm text-black/65 font-light">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/services/weight-loss-therapy" className="text-[#E6007E] font-semibold hover:underline">
              Full weight loss program details →
            </Link>
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">Real Results</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Our clients say it best.</h2>
          <p className="text-white/50 text-sm mb-10 max-w-lg">Individual results vary. These testimonials reflect real experiences; not all patients achieve the same outcomes.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "I've tried everything over the years. This program finally gave me something that actually worked — and the team here made me feel supported every step.",
              },
              {
                text: "No judgment, no pressure. Just real help from people who actually care. I'm down 22 lbs and I actually feel like myself again.",
              },
              {
                text: "What I love most is that it's in-person. I see the same team every time, they know my name, and they're invested in my progress.",
              },
            ].map((r, i) => (
              <div key={i} className="border border-white/15 rounded-xl p-6 bg-white/5">
                <div className="text-[#E6007E] text-sm mb-3 tracking-widest">★★★★★</div>
                <p className="font-serif text-lg italic text-white/90 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Verified patient · Fox Valley IL</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">Questions</p>
          <h2 className="font-serif text-3xl md:text-4xl text-black mb-8">
            We&apos;ve got <em className="text-[#E6007E] not-italic">answers.</em>
          </h2>
          <div className="divide-y divide-black/10">
            {FAQS.map((item, i) => (
              <div key={item.q} className="py-1">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left font-serif text-lg text-black hover:text-[#E6007E] transition-colors"
                >
                  {item.q}
                  <span className={`text-2xl text-[#E6007E] shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && <p className="pb-4 text-black/65 text-sm leading-relaxed font-light">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 py-10 bg-neutral-100 border-t border-black/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-3">Important medical disclaimer</h3>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
            This page is for general information only and does not constitute medical advice, diagnosis, or treatment. GLP-1 medications (including semaglutide and tirzepatide) are prescription drugs that require an in-person evaluation by a licensed provider. Not everyone is a candidate. Side effects can occur; your provider will discuss risks and benefits at consultation.{" "}
            <strong className="text-black/70">Individual results vary and are not guaranteed.</strong>{" "}
            Programs at Hello Gorgeous Med Spa are medically supervised; eligibility and dosing are determined only after clinical assessment. If you have a medical emergency, call 911. For our policies, see{" "}
            <Link href="/privacy" className="text-[#E6007E] underline hover:no-underline">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="text-[#E6007E] underline hover:no-underline">
              Terms
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 text-center bg-gradient-to-br from-pink-50 via-white to-rose-50/80 border-t-2 border-black">
        <h2 className="font-serif text-3xl md:text-5xl text-black mb-4">
          Ready to feel <em className="text-[#E6007E] not-italic">gorgeous</em>
          <br />
          in your own skin?
        </h2>
        <p className="text-black/65 mb-8 max-w-md mx-auto">Book your GLP-1 consultation today. Same-week appointments often available.</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 font-bold rounded-xl hover:bg-black transition-colors"
        >
          Book My Consultation →
        </a>
        <p className="mt-10 text-sm text-black/50">
          <strong className="text-black">{SITE.name}</strong>
          <br />
          {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
          {SITE.address.postalCode}
          <br />
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-[#E6007E] font-semibold hover:underline">
            {SITE.phone}
          </a>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/" className="text-[#E6007E] hover:underline">
            Home
          </Link>
          <Link href="/services/weight-loss-therapy" className="text-[#E6007E] hover:underline">
            Weight loss services
          </Link>
          <Link href="/blog/should-i-start-medical-weight-loss-morpheus8-body" className="text-[#E6007E] hover:underline">
            GLP-1 + skin tightening blog
          </Link>
        </div>
      </section>
    </main>
  );
}
