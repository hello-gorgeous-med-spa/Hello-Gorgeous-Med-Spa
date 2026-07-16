import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  SIGNATURE_MENU_POSTER,
  SIGNATURE_MENU_SECTIONS,
} from "@/lib/signature-treatment-menu";
import { SITE } from "@/lib/seo";

export function SignatureTreatmentMenuContent() {
  return (
    <>
      <section className="border-b-4 border-black bg-gradient-to-br from-black via-[#1a0a12] to-black text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Oswego, IL · Fresha booking
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Signature{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Treatment Menu
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto font-medium">
              We screen you like a medical practice, because we are one. NP-directed medical aesthetics with the InMode
              Trifecta — only here in the western suburbs.
            </p>
          </FadeUp>
        </div>
      </section>

      <Section id="menu" className="scroll-mt-24 bg-white border-b-4 border-black py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={SIGNATURE_MENU_POSTER.src}
                alt={SIGNATURE_MENU_POSTER.alt}
                width={1200}
                height={1550}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <p className="mt-4 text-center text-sm text-black/60 font-medium">
              Scan the QR on the poster to book on Square, or use the button below.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-10">
              Menu highlights
            </h2>
          </FadeUp>
          <div className="space-y-10">
            {SIGNATURE_MENU_SECTIONS.map((section, sIdx) => (
              <FadeUp key={section.id} delayMs={sIdx * 40}>
                <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
                  <h3 className="text-xl font-black text-[#E6007E]">{section.heading}</h3>
                  {section.tagline ? (
                    <p className="text-sm font-bold uppercase tracking-wider text-black/55 mt-1">
                      {section.tagline}
                    </p>
                  ) : null}
                  <ul className="mt-6 space-y-5">
                    {section.items.map((item) => (
                      <li
                        key={item.title}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-black/10 pb-5 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-bold text-black">{item.title}</p>
                          {item.details?.map((d) => (
                            <p key={d} className="text-sm text-black/70 mt-1">
                              {d}
                            </p>
                          ))}
                          <Link
                            href={item.href}
                            className="mt-2 inline-block text-sm font-bold text-[#E6007E] hover:underline"
                          >
                            Learn more →
                          </Link>
                        </div>
                        <p className="text-lg font-black text-[#E6007E] shrink-0">{item.price}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Beautifully you. Confidently gorgeous.</h2>
          <p className="text-white/90 font-medium mb-8">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book online
            </CTA>
            <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
              Call {SITE.phone}
            </CTA>
          </div>
        </div>
      </Section>
    </>
  );
}
