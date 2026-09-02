import Image from "next/image";
import Link from "next/link";

import {
  CLINIC_SERVICES_BAND_ID,
  CLINIC_SERVICES_ITEMS,
  CLINIC_SERVICES_PHOTOS,
} from "@/lib/clinic-services-band";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export function ClinicServicesBand() {
  return (
    <section
      id={CLINIC_SERVICES_BAND_ID}
      className="relative scroll-mt-20 overflow-hidden border-b border-black/10 bg-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 0%, transparent 46%, #d4d4d4 46.5%, transparent 47%),
            linear-gradient(115deg, transparent 0%, transparent 72%, #d4d4d4 72.5%, transparent 73%),
            linear-gradient(-25deg, transparent 0%, transparent 38%, #d4d4d4 38.5%, transparent 39%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f4f4f4] to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 h-px w-16 bg-black/70" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/55">
            Chicagoland
          </p>
          <h2 className="mt-2 font-serif text-[1.85rem] font-semibold tracking-tight text-black sm:text-4xl md:text-[2.65rem]">
            Skin Care Clinic Services
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-black/70" />
        </header>

        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-14">
          <div className="relative mx-auto h-[400px] w-full max-w-[540px] sm:h-[460px] lg:h-[520px]">
            {CLINIC_SERVICES_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className={`absolute aspect-[4/5] overflow-hidden bg-white p-[7px] shadow-[0_16px_36px_rgba(0,0,0,0.16)] ring-1 ring-black/5 ${photo.className}`}
              >
                <div className="relative h-full w-full overflow-hidden bg-[#e8e2dc]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 280px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[15px] leading-relaxed text-black/80 sm:text-base">
              Some clients come in hoping to soften a few lines. Others want volume back,
              firmer skin, or a glow that lasts past the weekend. We do not do one-size-fits-all.
              Our medical-grade skin and aesthetic care in Oswego is planned with you in the
              chair — clinical treatments, explained clearly, never rushed. Our most-requested
              cosmetic and skin services include:
            </p>

            <ul className="mt-7 space-y-4">
              {CLINIC_SERVICES_ITEMS.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#E6007E]"
                    aria-hidden
                  />
                  <p className="text-[15px] leading-relaxed text-black/80 sm:text-base">
                    <Link
                      href={item.href}
                      className="font-semibold text-[#E6007E] underline decoration-[#E6007E]/25 underline-offset-3 hover:decoration-[#E6007E]"
                    >
                      {item.title}
                    </Link>
                    <span className="text-black/80">: {item.body}</span>
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-8">
              <Link
                href={PRIMARY_BOOKING_CTA.href}
                className="text-sm font-bold uppercase tracking-[0.16em] text-[#E6007E] underline decoration-[#E6007E]/35 underline-offset-4 hover:decoration-[#E6007E]"
              >
                {PRIMARY_BOOKING_CTA.label} →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
