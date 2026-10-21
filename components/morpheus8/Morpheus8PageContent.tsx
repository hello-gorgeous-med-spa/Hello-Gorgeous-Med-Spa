import Image from "next/image";
import Link from "next/link";

import { JourneyResultsCinema } from "@/components/marketing/JourneyResultsCinema";
import { JourneySoundVideo } from "@/components/marketing/JourneySoundVideo";
import {
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_EXPERIENCE,
  MEDICAL_DIRECTOR_LICENSE_TITLE,
  MEDICAL_DIRECTOR_SPECIALTY,
} from "@/lib/medical-authority";
import {
  MORPHEUS8_CONTACT,
  MORPHEUS8_FAQS,
  MORPHEUS8_MARKETING,
  MORPHEUS8_PACKAGES,
  MORPHEUS8_RESULTS,
  MORPHEUS8_STEPS,
  MORPHEUS8_TREATMENT_AREAS,
  MORPHEUS8_WHAT_IT_DOES,
} from "@/lib/morpheus8-marketing";

function BookBtn({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const cls = dark
    ? "inline-flex min-h-12 items-center justify-center bg-white px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#111] transition hover:bg-[#9fd6cf]"
    : "inline-flex min-h-12 items-center justify-center bg-[#e7e7e7] px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#161616] transition hover:bg-white";
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Morpheus8PageContent() {
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay } = MORPHEUS8_CONTACT;
  const { images } = MORPHEUS8_MARKETING;

  return (
    <div className="min-h-[100dvh] bg-[#0e0e0e] font-sans text-white">
      <header className="border-b border-white/10 bg-[#111]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white">
            Hello Gorgeous
          </Link>
          <nav className="hidden items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70 md:flex">
            <a href="#technology" className="hover:text-white">
              Technology
            </a>
            <a href="#results" className="hover:text-white">
              Results
            </a>
            <a href="#physician" className="hover:text-white">
              Physician
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>
          <BookBtn href={bookHref}>Book a consult</BookBtn>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(80%_80%_at_78%_40%,#1c2424_0%,#101010_55%,#0a0a0a_100%)]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#9fd6cf]">
              InMode verified provider · Oswego, IL
            </p>
            <h1 className="mt-4 max-w-xl text-[40px] font-semibold uppercase leading-[0.98] tracking-tight text-white sm:text-[56px]">
              Deep RF microneedling for{" "}
              <span className="text-[#9fd6cf]">firmer skin</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              {MORPHEUS8_MARKETING.subhead} Individual results vary. A consult confirms whether Morpheus8 is appropriate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookBtn href={bookHref}>Book a free consult</BookBtn>
              <a
                href={phoneTel}
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-white hover:border-white"
              >
                Call {phoneDisplay}
              </a>
            </div>
          </div>
          <div className="overflow-hidden bg-black/40">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.workstationVideo}
              poster={MORPHEUS8_MARKETING.workstationPoster}
              label="Official InMode Morpheus8 workstation animation"
              preload="auto"
            />
          </div>
        </div>
      </section>

      <div className="border-y border-black/10 bg-white text-[#161616]">
        <ul className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.18em]">
          <li>InMode verified</li>
          <li>Physician-led</li>
          <li>{MEDICAL_DIRECTOR_LICENSE_TITLE}</li>
          <li>Face and body</li>
          <li>From $799</li>
        </ul>
      </div>

      <section id="technology" className="scroll-mt-20 bg-[linear-gradient(180deg,#16302e_0%,#0e0e0e_100%)] px-6 py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[34px] font-semibold uppercase leading-[1.02] tracking-tight sm:text-[46px]">
              Advanced technology for <span className="text-[#9fd6cf]">custom depth</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              Morpheus8 delivers bipolar radiofrequency through gold-coated needles, with Burst and Deep settings up to 8mm. Hello Gorgeous runs the real InMode platform in Oswego — Morpheus8, Solaria CO₂, and Quantum RF.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {MORPHEUS8_WHAT_IT_DOES.map((item) => (
                <article key={item.id} className="border border-white/15 bg-black/25 p-4">
                  <p className="text-2xl font-semibold text-[#9fd6cf]">{item.stat}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">{item.statLabel}</p>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.body3dVideo}
              poster={MORPHEUS8_MARKETING.body3dPoster}
              label="Official InMode Morpheus8 Body animation"
            />
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-20 bg-[#0e0e0e] px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center text-[34px] font-semibold uppercase leading-tight tracking-tight sm:text-[46px]">
            Results clients can <span className="text-[#9fd6cf]">see</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
            Hello Gorgeous cases and InMode clinical photography. Individual results vary. Photos are not a promise of your outcome.
          </p>
          <div className="mt-10">
            <JourneyResultsCinema productName="Morpheus8" slides={MORPHEUS8_RESULTS} showAreaFilter />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {MORPHEUS8_TREATMENT_AREAS.map((area) => (
              <span key={area} className="border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-[#161616]">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] font-semibold uppercase leading-tight tracking-tight">What you can expect</h2>
            <ul className="mt-6 space-y-4 text-[16px] leading-relaxed text-black/75">
              <li>Minimally invasive RF microneedling for face and body, without an operating room.</li>
              <li>A plan mapped to laxity, scars, or texture — including when Solaria or Quantum RF is the better fit.</li>
              <li>Typical social downtime of 2–5 days. Collagen keeps remodeling for months.</li>
              <li>Most face plans are a series of 3, spaced 4–6 weeks apart. Body areas are quoted by zone.</li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Image
              src={images.faceTreats}
              alt="Morpheus8 treats dull texture, fine lines, acne scars, and collagen loss"
              width={640}
              height={640}
              className="h-full w-full object-cover"
            />
            <Image
              src={images.bodyBenefits}
              alt="Morpheus8 Body — skin quality, fat remodeling, and collagen"
              width={640}
              height={640}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="physician" className="scroll-mt-20 border-y border-white/10 bg-[#111] px-6 py-20">
        <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[220px_1fr]">
          <Image
            src={MEDICAL_DIRECTOR.image}
            alt={MEDICAL_DIRECTOR.imageAlt}
            width={440}
            height={560}
            className="w-full object-cover object-top"
          />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#9fd6cf]">Physician-led</p>
            <h2 className="mt-3 text-[34px] font-semibold uppercase leading-tight tracking-tight">
              {MEDICAL_DIRECTOR.displayName}
            </h2>
            <p className="mt-3 text-lg text-white/85">
              {MEDICAL_DIRECTOR_LICENSE_TITLE}, State of Illinois. Medical Director. {MEDICAL_DIRECTOR_SPECIALTY}.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              Morpheus8 at Hello Gorgeous is part of a physician-led medical practice in Oswego, with {MEDICAL_DIRECTOR_EXPERIENCE}. Dr. Arora is the physician accountable for medical oversight. A consult comes before treatment. Prescriptions, when needed, are written by a licensed Illinois clinician.
            </p>
            <div className="mt-6">
              <Link href={MEDICAL_DIRECTOR.profilePath} className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9fd6cf] underline-offset-4 hover:underline">
                Read Dr. Arora&apos;s profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[34px] font-semibold uppercase leading-tight tracking-tight">How a visit works</h2>
            <ol className="mt-8 space-y-4">
              {MORPHEUS8_STEPS.map((step) => (
                <li key={step.step} className="flex gap-4 border border-white/15 p-4">
                  <span className="text-lg font-semibold text-[#9fd6cf]">{step.step}</span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="overflow-hidden">
            <JourneySoundVideo
              src={MORPHEUS8_MARKETING.scienceVideo}
              label="Morpheus8 Burst depth compared with standard microneedling"
              hasAudio={false}
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-white px-6 py-20 text-[#161616]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-[34px] font-semibold uppercase leading-tight tracking-tight">Pricing starts with a consult</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MORPHEUS8_PACKAGES.map((pkg) => (
              <article key={pkg.id} className={`flex h-full flex-col border p-5 ${pkg.highlight ? "border-[#16302e] bg-[#f4f7f6]" : "border-black/10"}`}>
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-[#16302e]">{pkg.price}</p>
                <p className="text-xs uppercase tracking-wider text-black/50">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-black/75">
                  {pkg.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <BookBtn href={"href" in pkg && pkg.href ? pkg.href : bookHref}>
                    {"href" in pkg && pkg.href ? "View specials" : "Book consult"}
                  </BookBtn>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-black/60">
            Face sessions start at $799. Face and neck, and body areas, are quoted at your visit.{" "}
            <Link href={MORPHEUS8_MARKETING.careHref} className="font-semibold underline underline-offset-2">
              Pre and post care
            </Link>
            {" · "}
            <Link href={MORPHEUS8_MARKETING.compareSolariaHref} className="font-semibold underline underline-offset-2">
              Solaria CO₂
            </Link>
            {" · "}
            <Link href={MORPHEUS8_MARKETING.quantumHref} className="font-semibold underline underline-offset-2">
              Quantum RF
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-[34px] font-semibold uppercase tracking-tight">Questions</h2>
          <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
            {MORPHEUS8_FAQS.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.q}</span>
                    <span className="text-[#9fd6cf] group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#16302e] px-6 py-20">
        <div className="mx-auto grid max-w-[900px] gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="text-[34px] font-semibold uppercase leading-tight tracking-tight sm:text-[44px]">
              Book a Morpheus8 consult in Oswego
            </h2>
            <p className="mt-4 text-white/80">
              We will look at your skin, talk through downtime, and tell you honestly if Morpheus8, Solaria, Quantum RF, or a combination fits.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-[#0e0e0e] p-6">
            <BookBtn href={bookHref}>Book a free consult</BookBtn>
            <a href={textTel} className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white">
              Text {textDisplay}
            </a>
            <a href={phoneTel} className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white">
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
