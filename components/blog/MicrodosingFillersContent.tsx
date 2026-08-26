import Image from "next/image";
import Link from "next/link";

import { HG_TAGLINE } from "@/lib/brand-tagline";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

const PHONE_DISPLAY = "(630) 636-6193";
const PHONE_TEL = "tel:+16306366193";
const ADDRESS = "74 W. Washington Street, Oswego, IL 60543";
const HERO_SRC = "/images/blog/microdosing-fillers-hero.webp";

const BENEFITS = [
  {
    title: "Natural-looking results",
    body: "Smaller amounts aim for subtle enhancement, not an obvious change. The goal is that people notice you look refreshed — not “done.” Your bone structure and expression stay yours.",
  },
  {
    title: "Typically less downtime",
    body: "Smaller injection quantities often mean less swelling, bruising, and tenderness than a large-volume session — and can lower the chance of lumps, asymmetry, or overfilling. That is not a guarantee. Every face responds differently.",
  },
  {
    title: "Better control",
    body: "Meticulous, incremental adjustments let our injectors fine-tune as we go and adapt as your face changes over time — nothing more, nothing less than what you asked for.",
  },
  {
    title: "Gradual, manageable enhancement",
    body: "You can build results over a few visits instead of committing to a dramatic change all at once — a lower-pressure way to explore filler if you are new to injectables.",
  },
] as const;

const REASONS = [
  {
    title: "NP-directed care",
    body: `Every treatment plan is designed and overseen by our on-site nurse practitioners — not a technician following a script. Clinical care is led by ${PRESCRIBING_NP.displayName}, with medical-director oversight from ${MEDICAL_DIRECTOR.displayName}.`,
  },
  {
    title: "Personalized from visit one",
    body: "We start with a real consultation — your facial structure, your goals, and how much change feels right to you. Same-day appointments are often available in downtown Oswego.",
  },
  {
    title: "Advanced filler technique",
    body: "Our injectors are trained in precise, layered placement that prioritizes control over volume. We use authentic manufacturer product — not gray-market filler.",
  },
  {
    title: "Support after you leave",
    body: "We follow up after treatment to make sure you are healing as expected. If something looks off, book a follow-up or call. Hyaluronic acid filler can be dissolved when medically appropriate — that is a clinical decision, not a DIY fix.",
  },
] as const;

const FAQS = [
  {
    q: "Does microdosing filler hurt?",
    a: "Most clients feel a quick pinch. We use fine needles and topical numbing to keep sessions comfortable. Sensitivity varies by area — lips often feel more than cheeks. Tell us if you are anxious; we can pause and adjust.",
  },
  {
    q: "How long do results last?",
    a: "Hyaluronic acid filler typically lasts about 6 to 12 months, depending on the product, the area treated, and your metabolism. Smaller amounts do not always last a shorter time — duration is still product- and patient-specific. Individual results vary. Your injector maps a maintenance plan at consult.",
  },
  {
    q: "How many sessions will I need?",
    a: "There is no set number. Many first-time clients start with one conservative session and add at a follow-up once swelling has settled — often around two weeks. Others prefer a short series of smaller visits. We stop when the result matches the change you asked for.",
  },
  {
    q: "What areas can you microdose?",
    a: "Lips, cheeks, under-eye hollows, and fine lines are common — only after we assess anatomy and whether filler is the right tool. Under-eyes in particular need a careful consult; not every hollow is a filler problem.",
  },
  {
    q: "Is this the same as “baby filler” or a half syringe?",
    a: "Related idea, different framing. A half syringe is a volume. Microdosing is a placement style — small aliquots, checked in the mirror, often built across visits. You might use part of a syringe in one session and save the rest of the plan for later.",
  },
] as const;

function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`m-0 text-[11px] font-bold uppercase tracking-[0.16em] ${
        onDark ? "text-white/50" : "text-black/50"
      }`}
    >
      {children}
    </p>
  );
}

export function MicrodosingFillersContent() {
  return (
    <main className="bg-white text-black">
      <section className="section-white px-6 pb-12 pt-10 md:px-8 md:pb-16 md:pt-14">
        <div className="mx-auto mb-10 max-w-[840px]">
          <p className="mb-5 text-[13px] text-black/55">
            <Link href="/" className="text-black/55 no-underline hover:text-[#E6007E]">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/blog" className="text-black/55 no-underline hover:text-[#E6007E]">
              Blog
            </Link>
            <span className="mx-1.5">/</span>
            <span>Microdosing Fillers</span>
          </p>
          <Eyebrow>Dermal Fillers · Med Spa Journal</Eyebrow>
          <h1 className="mt-3.5 font-serif text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-tight">
            Microdosing Fillers: Why <span className="accent">Less Is More</span> for Natural
            Results
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3.5">
            <span className="text-sm text-black/60">Published August 26, 2026 · 4 min read</span>
            <span className="accent rounded-full border-2 border-black bg-[#FFF0F7] px-3 py-1 text-xs font-bold">
              Reviewed by our NP-directed team
            </span>
          </div>
          <p className="mt-6 text-xl leading-relaxed text-black/80">
            At Hello Gorgeous, true beauty means enhancing what&apos;s already there — not changing
            it. As Oswego&apos;s NP-directed injectables team, we&apos;re seeing more clients ask
            for a technique built entirely around that idea: microdosing. It&apos;s a subtler, more
            deliberate way to use dermal filler, and it&apos;s quickly become one of our favorite
            ways to deliver results that read as you, just rested.
          </p>
          <p className="mt-4 text-sm font-medium text-black/55">
            This is general education, not a diagnosis or a promise of a specific look. Individual
            results vary. Filler is prescription product placed after a medical consult.
          </p>
        </div>
        <div className="mx-auto max-w-[1040px]">
          <div className="relative h-[240px] overflow-hidden rounded-[22px] border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:h-[340px] md:h-[420px]">
            <Image
              src={HERO_SRC}
              alt="Close-up of a lower cheek and mouth area before and after hyaluronic acid filler. Individual results vary."
              fill
              priority
              sizes="(max-width: 1040px) 100vw, 1040px"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-black/50">
            Individual results vary. Photos are for education — not a promise of a specific look.
          </p>
        </div>
      </section>

      <section className="section-white px-6 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h2 className="font-serif">What Does “Microdosing Fillers” Mean?</h2>
            <p className="mt-4 text-[17px] leading-[1.7] text-black/80">
              To microdose filler means using smaller amounts of{" "}
              <Link href="/dermal-fillers-oswego-il" className="accent font-semibold underline decoration-[#E6007E]/40 underline-offset-2">
                dermal filler
              </Link>
              , placed across multiple precise injections, instead of one large-volume treatment.
              Our injectors build your results in careful layers — checking your reflection at every
              step — so each addition works with your facial anatomy instead of overriding it.
            </p>
            <div className="mt-6 rounded-2xl bg-[#FFF5F9] p-7">
              <Eyebrow>How It Works</Eyebrow>
              <ul className="mt-3.5 grid list-none gap-3.5 p-0 text-[15px] leading-relaxed text-black/80">
                <li>
                  <strong>Small doses:</strong> we inject fractions of a milliliter — often 0.1 to
                  0.3 mL — per site, rather than an entire syringe at once.
                </li>
                <li>
                  <strong>Layered approach:</strong> results can build gradually over time to support
                  your natural facial contours and expressions.
                </li>
                <li>
                  <strong>Common areas:</strong> used subtly in the lips, cheeks, under-eye hollows,
                  and fine lines when that plan fits you.
                </li>
              </ul>
            </div>
            <p className="mt-6 text-[17px] leading-[1.7] text-black/80">
              Here&apos;s why our clients — and our providers — ask for it.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((item) => (
                <div key={item.title} className="hg-card">
                  <h3 className="accent mt-0 font-serif text-xl">{item.title}</h3>
                  <p className="mb-0 mt-2 text-[15px] leading-relaxed text-black/70">{item.body}</p>
                </div>
              ))}
            </div>

            <blockquote className="mt-8 border-l-4 border-[#FF2D8E] bg-[#FFF5F9] px-5 py-4 text-[15px] leading-relaxed text-black/80">
              “Best med spa experience I&apos;ve ever had. The team really listens to what you want.
              My lip filler looks incredible and I&apos;ve gotten so many compliments!” — Jennifer
              K., Oswego, IL
            </blockquote>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border-4 border-black bg-white p-7 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Eyebrow>Free Consultation</Eyebrow>
              <h3 className="mb-3.5 mt-2.5 font-serif text-2xl">Book Your Filler Consultation</h3>
              <p className="text-sm font-semibold text-black/80">
                ⭐ {SITE.reviewRating} on Google · {SITE.reviewCount}+ reviews
              </p>
              <ul className="my-4 grid list-none gap-2.5 p-0 text-sm text-black/75">
                <li>— Full-authority NP on site</li>
                <li>— {ADDRESS}</li>
                <li>— Same-day appointments often available</li>
              </ul>
              <Link
                href={PRIMARY_BOOKING_CTA.href}
                className="btn-primary mt-2 w-full min-h-12 px-5 py-3 text-center text-sm"
              >
                {PRIMARY_BOOKING_CTA.shortLabel}
              </Link>
              <p className="mb-0 mt-3.5 text-center text-[13px] text-black/60">
                or call{" "}
                <a href={PHONE_TEL} className="accent font-semibold">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-black px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <Eyebrow onDark>Why Hello Gorgeous</Eyebrow>
          <h2 className="mt-3 font-serif text-white">
            {HG_TAGLINE.split(", ")[0]},{" "}
            <span className="accent">{HG_TAGLINE.split(", ")[1]}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-base text-white/80">
            Choosing the right approach to filler matters — here&apos;s how we keep a microdosing
            plan precise and yours.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1100px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#FF2D8E]/35 bg-white/[0.04] p-7"
            >
              <h4 className="accent mb-2.5 mt-0 font-serif text-lg">{item.title}</h4>
              <p className="mb-0 text-sm leading-relaxed text-white/80">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-white px-6 py-16 md:px-8">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-8 text-center">
            <Eyebrow>Common Questions</Eyebrow>
            <h2 className="mt-3.5 font-serif">
              Good to <span className="accent">know</span>
            </h2>
          </div>
          <div>
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group border-b-2 border-black/10 py-4 first:border-t-2"
              >
                <summary className="cursor-pointer list-none font-serif text-lg font-semibold text-black marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="accent transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mb-1 mt-3 text-[15px] leading-relaxed text-black/75">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="book"
        className="px-6 py-16 text-center md:px-8 md:py-20"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-serif text-white">Ready to Feel Effortlessly Gorgeous?</h2>
          <p className="mt-3.5 text-lg text-white/90">
            Book a free filler consultation with our NP-directed team — same-day appointments often
            available in Oswego, IL.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href={PRIMARY_BOOKING_CTA.href} className="btn-white min-h-12 px-8 py-3.5">
              Book Free Consult
            </Link>
            <a
              href={PHONE_TEL}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white bg-black px-8 py-3.5 font-semibold text-white hover:bg-white hover:text-black"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Last reviewed August 26, 2026 by {MEDICAL_DIRECTOR.displayName}, Medical Director.
            Clinical care on site is led by {PRESCRIBING_NP.displayName}.
          </p>
        </div>
      </section>
    </main>
  );
}
