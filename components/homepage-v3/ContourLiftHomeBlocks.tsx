import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

const PINK = "#E6007E";
const YT_PREVIEW_ID = "loJOgWGCkK8";

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
          <Link
            href="/services/quantum-rf"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-bold uppercase tracking-widest text-black underline decoration-2 underline-offset-4 transition hover:opacity-80"
            style={{ textDecorationColor: PINK }}
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
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
      <div className="mx-auto flex max-w-lg gap-2">
        <Link
          href="/services/quantum-rf"
          className="flex flex-1 min-h-[48px] items-center justify-center rounded-md text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: PINK }}
        >
          Contour Lift
        </Link>
        <a
          href={BOOKING_URL}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-md border-2 border-white text-xs font-bold uppercase tracking-widest text-white"
          data-book-now
        >
          Book
        </a>
      </div>
    </div>
  );
}
