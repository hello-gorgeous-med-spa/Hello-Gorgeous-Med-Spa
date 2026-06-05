import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  INJECTION_MENU_BOOK_HREF,
  INJECTION_MENU_PDF,
  INJECTION_MENU_PEPTIDES_HREF,
  INJECTION_MENU_POSTER,
  INJECTION_MENU_SECTIONS,
} from "@/lib/injection-menu";
import { PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { SITE } from "@/lib/seo";

export function InjectionMenuContent() {
  return (
    <>
      <section className="border-b-4 border-black bg-gradient-to-br from-black via-[#1a0a12] to-black text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-[#FFB8DC] text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Oswego, IL · Provider-guided wellness
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              The{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Injection Menu
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto font-medium">
              Peptide therapies &amp; vitamin wellness shots, tailored to you. Choose what feels right — we&apos;ll
              guide you.
            </p>
            <p className="mt-3 text-sm text-white/60 max-w-xl mx-auto">
              All injections, peptides &amp; weight-loss therapies require a medical evaluation and prescription by Ryan
              Kent, FNP-BC. Pricing reserves a consultation only.
            </p>
          </FadeUp>
        </div>
      </section>

      <Section id="menu" className="scroll-mt-24 bg-white border-b-4 border-black py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={INJECTION_MENU_POSTER.src}
                alt={INJECTION_MENU_POSTER.alt}
                width={1200}
                height={1550}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <p className="mt-4 text-center text-sm text-black/60 font-medium">
              <a href={INJECTION_MENU_PDF} className="text-[#E6007E] font-bold hover:underline" download>
                Download PDF menu
              </a>
              {" · "}
              Book below or call {SITE.phone}
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="space-y-10">
            {INJECTION_MENU_SECTIONS.map((section, sIdx) => (
              <FadeUp key={section.id} delayMs={sIdx * 40}>
                <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
                  <h2 className="text-xl font-black text-[#E6007E]">{section.heading}</h2>
                  <p className="text-sm font-bold uppercase tracking-wider text-black/55 mt-1">{section.tagline}</p>
                  <ul className="mt-6 space-y-6">
                    {section.items.map((item) => (
                      <li
                        key={item.name}
                        className="border-b border-black/10 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-wrap items-baseline gap-2">
                          <p className="font-bold text-black text-lg">{item.name}</p>
                          {item.favorite ? (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-[#E6007E] text-[#E6007E]">
                              Favorite
                            </span>
                          ) : null}
                          {item.consultFirst ? (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black text-white">
                              Consult first
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-black/80 mt-2 font-medium">{item.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#FFF0F7] text-[#E6007E] border border-[#E6007E]/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={item.href}
                          className="mt-3 inline-block text-sm font-bold text-[#E6007E] hover:underline"
                        >
                          Learn more →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delayMs={120}>
            <div className="mt-10 rounded-3xl border-4 border-black bg-[#0a0a0a] text-white p-6 md:p-8 text-center">
              <p className="font-bold text-lg">
                Not sure what&apos;s right for you? Your provider will help you choose the perfect shot or stack for
                your goals.
              </p>
              <p className="mt-2 text-sm text-white/70">
                {PEPTIDE_CONSULT_SPECIAL.price} peptide consultation — {PEPTIDE_CONSULT_SPECIAL.detail}
              </p>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Book your consult or shot</h2>
          <p className="text-white/90 font-medium mb-8">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, IL · {SITE.phone}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={INJECTION_MENU_BOOK_HREF} variant="white">
              Book on Fresha
            </CTA>
            <CTA href={INJECTION_MENU_PEPTIDES_HREF} variant="outline">
              Peptides hub
            </CTA>
          </div>
        </div>
      </Section>
    </>
  );
}
