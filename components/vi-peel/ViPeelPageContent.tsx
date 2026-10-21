import Image from "next/image";
import Link from "next/link";

import {
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_LICENSE_TITLE,
  MEDICAL_DIRECTOR_SPECIALTY,
} from "@/lib/medical-authority";
import {
  VI_PEEL_CONTACT,
  VI_PEEL_FAQS,
  VI_PEEL_MARKETING,
  VI_PEEL_PACKAGES,
  VI_PEEL_PROTOCOLS,
  VI_PEEL_TIMELINE,
  VI_PEEL_TOXBOOSTER,
} from "@/lib/vi-peel-marketing";

function BookBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1c3330] px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#f6f1ea] transition hover:bg-[#315650]"
    >
      {children}
    </Link>
  );
}

export function ViPeelPageContent() {
  const { bookHref, phoneTel, phoneDisplay, textTel, textDisplay, careHref, consentHref, facialsHref, neurotoxinHref } =
    VI_PEEL_CONTACT;

  return (
    <div className="min-h-[100dvh] bg-[#f6f1ea] font-sans text-[#1c3330]">
      <header className="border-b border-[#1c3330]/10 bg-[#f6f1ea]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-[13px] font-semibold uppercase tracking-[0.28em]">
            Hello Gorgeous
          </Link>
          <nav className="hidden items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1c3330]/70 md:flex">
            <a href="#protocols" className="hover:text-[#1c3330]">
              Protocols
            </a>
            <a href="#toxbooster" className="hover:text-[#1c3330]">
              ToxBooster
            </a>
            <a href="#expect" className="hover:text-[#1c3330]">
              What to expect
            </a>
            <a href="#physician" className="hover:text-[#1c3330]">
              Physician
            </a>
            <a href="#pricing" className="hover:text-[#1c3330]">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#1c3330]">
              FAQ
            </a>
          </nav>
          <BookBtn href={bookHref}>Book a consult</BookBtn>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#8c6244]">
            {VI_PEEL_MARKETING.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-[42px] font-semibold leading-[1.02] tracking-tight sm:text-[56px]">
            {VI_PEEL_MARKETING.headline}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#1c3330]/80">{VI_PEEL_MARKETING.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookBtn href={bookHref}>Book a free consult</BookBtn>
            <a
              href={phoneTel}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c3330]/30 px-7 text-[13px] font-semibold uppercase tracking-[0.16em] hover:border-[#1c3330]"
            >
              Call {phoneDisplay}
            </a>
          </div>
        </div>
        <figure>
          <Image
            src={VI_PEEL_MARKETING.image}
            alt={VI_PEEL_MARKETING.imageAlt}
            width={1024}
            height={723}
            priority
            className="h-auto w-full"
          />
          <figcaption className="mt-3 text-center text-[12px] uppercase tracking-[0.16em] text-[#1c3330]/55">
            {VI_PEEL_MARKETING.imageCaption}
          </figcaption>
        </figure>
      </section>

      <div className="border-y border-[#1c3330]/10 bg-white">
        <ul className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.18em]">
          <li>Physician-directed</li>
          <li>Medium-depth peel</li>
          <li>Peeling about 3–7 days</li>
          <li>Series when it fits</li>
          <li>Oswego, IL</li>
        </ul>
      </div>

      <section id="protocols" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="max-w-2xl font-serif text-[36px] font-semibold leading-tight tracking-tight sm:text-[48px]">
            Choose the peel for the concern, not a one-size formula
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#1c3330]/75">
            These are the current VI Peel protocols. Hello Gorgeous confirms which one belongs on your skin. Another
            clinic’s before-and-after is not your outcome.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {VI_PEEL_PROTOCOLS.map((peel) => (
              <article key={peel.id} className="flex h-full flex-col border border-[#1c3330]/10 bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6244]">{peel.focus}</p>
                <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight">VI Peel {peel.name}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-[#1c3330]/80">{peel.summary}</p>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c6244]">Considered for</p>
                <ul className="mt-2 space-y-1 text-sm text-[#1c3330]/80">
                  {peel.ideal.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <BookBtn href={bookHref}>Book a consult</BookBtn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="toxbooster" className="scroll-mt-20 border-y border-[#1c3330]/10 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#8c6244]">
              {VI_PEEL_TOXBOOSTER.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-[36px] font-semibold leading-tight sm:text-[48px]">
              {VI_PEEL_TOXBOOSTER.name}
            </h2>
            <p className="mt-3 font-serif text-2xl leading-snug text-[#1c3330]/90">{VI_PEEL_TOXBOOSTER.headline}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#1c3330]/75">{VI_PEEL_TOXBOOSTER.summary}</p>
            <ul className="mt-6 space-y-3 text-[16px] leading-relaxed text-[#1c3330]/80">
              {VI_PEEL_TOXBOOSTER.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookBtn href={bookHref}>Book a ToxBooster consult</BookBtn>
              <Link
                href={neurotoxinHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c3330]/30 px-7 text-[13px] font-semibold uppercase tracking-[0.16em] hover:border-[#1c3330]"
              >
                Neurotoxin menu
              </Link>
            </div>
          </div>
          <div className="border border-[#1c3330]/10 bg-[#f6f1ea] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6244]">Considered for</p>
            <ul className="mt-4 space-y-2 text-lg">
              {VI_PEEL_TOXBOOSTER.concerns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-[#1c3330]/70">{VI_PEEL_TOXBOOSTER.study}</p>
          </div>
        </div>
      </section>

      <section id="expect" className="scroll-mt-20 bg-[#1c3330] px-6 py-20 text-[#f6f1ea]">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-serif text-[36px] font-semibold leading-tight sm:text-[48px]">What the week looks like</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VI_PEEL_TIMELINE.map((step) => (
              <article key={step.day} className="border border-white/15 p-5">
                <h3 className="font-serif text-2xl">{step.day}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{step.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/70">
            Strict sunscreen, no picking, and pausing retinoids and scrubs are part of healing. Heat, workouts, and
            active products can make irritation worse.{" "}
            <Link href={careHref} className="font-semibold text-white underline underline-offset-4">
              Pre and post care
            </Link>
            {" · "}
            <Link href={consentHref} className="font-semibold text-white underline underline-offset-4">
              VI Peel consent
            </Link>
          </p>
        </div>
      </section>

      <section id="physician" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[220px_1fr]">
          <Image
            src={MEDICAL_DIRECTOR.image}
            alt={MEDICAL_DIRECTOR.imageAlt}
            width={440}
            height={560}
            className="w-full object-cover object-top"
          />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8c6244]">Physician-directed</p>
            <h2 className="mt-3 font-serif text-[36px] font-semibold leading-tight">{MEDICAL_DIRECTOR.displayName}</h2>
            <p className="mt-3 text-lg text-[#1c3330]/85">
              {MEDICAL_DIRECTOR_LICENSE_TITLE}, State of Illinois. Medical Director. {MEDICAL_DIRECTOR_SPECIALTY}.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-[#1c3330]/75">
              VI Peel at Hello Gorgeous is planned under Dr. Arora’s medical direction and performed by our clinical
              team. The visit includes a look at your skin and a yes, a different formula, or a no.
            </p>
            <div className="mt-6">
              <Link
                href={MEDICAL_DIRECTOR.profilePath}
                className="text-sm font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
              >
                Read Dr. Arora&apos;s profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-y border-[#1c3330]/10 bg-white px-6 py-20">
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-serif text-[36px] font-semibold leading-tight sm:text-[48px]">Pricing starts with a consult</h2>
          <p className="mt-4 max-w-2xl text-[#1c3330]/75">
            Formula and area change the quote. We do not publish a flat VI Peel price.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {VI_PEEL_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col border p-6 ${pkg.highlight ? "border-[#1c3330] bg-[#f6f1ea]" : "border-[#1c3330]/10"}`}
              >
                <h3 className="font-serif text-2xl">{pkg.name}</h3>
                <p className="mt-2 font-serif text-4xl">{pkg.price}</p>
                <p className="text-xs uppercase tracking-wider text-[#1c3330]/50">{pkg.detail}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-[#1c3330]/80">
                  {pkg.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <BookBtn href={bookHref}>Book a consult</BookBtn>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#1c3330]/60">
            <Link href={facialsHref} className="font-semibold underline underline-offset-2">
              Facials and lighter peels
            </Link>
            {" · "}
            <Link href="/services/ipl-photofacial" className="font-semibold underline underline-offset-2">
              IPL photofacial
            </Link>
            {" · "}
            <Link href="/services/morpheus8" className="font-semibold underline underline-offset-2">
              Morpheus8
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-[860px]">
          <h2 className="font-serif text-[36px] font-semibold">Questions</h2>
          <div className="mt-8 divide-y divide-[#1c3330]/15 border-y border-[#1c3330]/15">
            {VI_PEEL_FAQS.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.q}</span>
                    <span className="text-[#8c6244] group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#1c3330]/75">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1c3330] px-6 py-20 text-[#f6f1ea]">
        <div className="mx-auto grid max-w-[900px] gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="font-serif text-[36px] font-semibold leading-tight sm:text-[46px]">
              Book a VI Peel consult in Oswego
            </h2>
            <p className="mt-4 text-white/80">
              We will look at the skin, name the formula if one fits, and tell you how many days to plan for peeling.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-[#f6f1ea] p-6 text-[#1c3330]">
            <BookBtn href={bookHref}>Book a free consult</BookBtn>
            <a href={textTel} className="text-center text-sm font-semibold uppercase tracking-[0.14em]">
              Text {textDisplay}
            </a>
            <a href={phoneTel} className="text-center text-sm font-semibold uppercase tracking-[0.14em]">
              Call {phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
