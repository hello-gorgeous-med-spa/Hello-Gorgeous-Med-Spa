import Image from "next/image";
import Link from "next/link";
import { ContourBookLink } from "@/components/marketing/ContourBookLink";
import { SITE } from "@/lib/seo";

const PINK = "#E6007E";
const YT_PREVIEW_ID = "loJOgWGCkK8";
const SMS_HREF = `sms:${SITE.phone.replace(/\D/g, "")}`;

/** Signature procedure + who it’s for + video preview — homepage flagship stack */
export function ContourSignatureSection() {
  return (
    <section className="border-b-2 border-black bg-white py-12 md:py-16" aria-labelledby="contour-signature-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14 md:px-8">
        <div className="relative aspect-[4/3] w-full min-h-[200px] overflow-hidden border-2 border-black shadow-lg md:min-h-0">
          <Image
            src="/images/quantum-rf/clinical-ba-jawline-neck-tightening.png"
            alt="Hello Gorgeous Contour Lift clinical result: jawline and neck definition using Quantum RF, minimally invasive subdermal radiofrequency, Oswego med spa"
            fill
            className="object-cover object-center sm:object-[50%_40%]"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
            priority
          />
        </div>
        <div>
          <p
            className="text-[0.65rem] font-bold uppercase tracking-[0.4em] md:text-xs"
            style={{ color: PINK }}
            id="contour-signature-kicker"
          >
            Signature procedure
          </p>
          <h2
            id="contour-signature-heading"
            className="mt-2 font-serif text-3xl font-bold leading-tight text-black md:text-4xl"
          >
            Hello Gorgeous Contour Lift™
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/90">Powered by Quantum RF</p>
          <p className="mt-4 text-base leading-relaxed text-black md:text-lg">
            A minimally invasive procedure designed to improve the appearance of loose skin and contour targeted
            areas by working beneath the surface of the skin.
          </p>
          <p className="mt-3 text-sm font-medium text-black/80">For patients exploring options beyond traditional surface-level treatments.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/services/quantum-rf"
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-bold uppercase tracking-widest text-black underline decoration-2 underline-offset-4 transition hover:opacity-80"
              style={{ textDecorationColor: PINK }}
              data-cl-only
              data-cl-event="contour_lift_home_cta_click"
              data-cl-action="explore"
              data-cl-placement="featured_signature"
            >
              Explore Contour Lift
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contour-lift/inquiry"
              className="inline-flex min-h-[48px] items-center text-sm font-bold uppercase tracking-widest text-black/90 underline decoration-2 underline-offset-4 transition hover:opacity-80"
              style={{ textDecorationColor: PINK }}
              data-cl-only
              data-cl-event="contour_lift_candidate_cta_click"
              data-cl-placement="featured_signature"
            >
              See if I’m a candidate
            </Link>
          </div>
          <p className="mt-6 max-w-md border-t border-black/10 pt-5 text-sm leading-relaxed text-black/80">
            <span className="font-semibold text-black">May 4 · Oswego —</span> Limited Contour Lift™ clinical model
            spots. Full story, video, and application for candidates who are a fit.{" "}
            <Link
              href="/contour-lift/model-experience"
              className="font-semibold text-black underline decoration-2 underline-offset-[3px] transition hover:opacity-80"
              style={{ textDecorationColor: PINK }}
              data-cl-only
              data-cl-event="contour_lift_home_cta_click"
              data-cl-action="model_landing"
              data-cl-placement="featured_signature"
            >
              Model experience
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContourWhoForSection() {
  return (
    <section className="border-b-2 border-black bg-black py-10 text-white md:py-14" aria-labelledby="who-for-heading">
      <div className="mx-auto max-w-3xl px-6">
        <h2 id="who-for-heading" className="text-center font-serif text-2xl font-bold md:text-3xl">
          Who This Is For
        </h2>
        <ul className="mt-8 space-y-3 text-left text-sm leading-relaxed text-white/95 md:mx-auto md:max-w-xl md:text-base">
          {[
            "Loose skin after weight loss",
            "Early signs of sagging or loss of definition",
            "Areas that haven’t responded to other treatments",
            "Patients exploring options without surgery",
          ].map((line) => (
            <li key={line} className="flex gap-2 border-l-4 pl-4" style={{ borderColor: PINK }}>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContourVideoPreviewSection() {
  return (
    <section className="border-b-2 border-black bg-white py-10 md:py-14" aria-label="See how Contour Lift works">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-black md:text-3xl">See How It Works</h2>
        <p className="mt-2 text-sm text-black/70">Real procedure view — no autoplay. Opens the full experience.</p>
        <div className="relative mx-auto mt-6 max-w-2xl">
          <Link
            href="/services/quantum-rf#contour-lift-videos"
            className="group relative block aspect-video overflow-hidden border-2 border-black shadow-xl"
            data-cl-only
            data-cl-event="contour_lift_home_cta_click"
            data-cl-action="video_preview"
            data-cl-placement="home_video_card"
          >
            <Image
              src={`https://i.ytimg.com/vi/${YT_PREVIEW_ID}/hqdefault.jpg`}
              alt="Video preview: InMode Quantum RF subdermal procedure for Hello Gorgeous Contour Lift, Oswego IL — tap to watch"
              fill
              className="object-cover transition group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white shadow-lg md:h-20 md:w-20"
                style={{ backgroundColor: PINK }}
                aria-hidden
              >
                <span className="ml-1 text-2xl">▶</span>
              </span>
            </span>
          </Link>
        </div>
        <div className="mt-5">
          <Link
            href="/services/quantum-rf#contour-lift-videos"
            className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-md px-8 text-sm font-bold uppercase tracking-widest text-white transition hover:opacity-95"
            style={{ backgroundColor: PINK }}
          >
            Watch procedure
          </Link>
        </div>
        <p className="mt-3 text-xs text-black/50">Procedure videos and clinical information on the Contour Lift page.</p>
      </div>
    </section>
  );
}

export function ContourMobileStickyCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-black bg-black p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1.5">
        <Link
          href="/services/quantum-rf"
          className="flex min-h-[48px] items-center justify-center rounded-md text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white sm:text-xs"
          style={{ backgroundColor: PINK }}
          data-cl-only
          data-cl-event="contour_lift_home_cta_click"
          data-cl-action="explore"
          data-cl-placement="home_sticky"
        >
          Contour Lift
        </Link>
        <ContourBookLink
          className="flex min-h-[48px] items-center justify-center rounded-md border-2 border-white text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white sm:text-xs"
          data-cl-placement="home_sticky"
        >
          Book
        </ContourBookLink>
        <a
          href={SMS_HREF}
          data-sms-click
          data-cl-only
          data-cl-event="contour_lift_sms_click"
          data-cl-placement="home_sticky"
          className="flex min-h-[48px] items-center justify-center rounded-md border-2 border-white/80 bg-white/5 text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white sm:text-xs"
        >
          Text
        </a>
      </div>
    </div>
  );
}
