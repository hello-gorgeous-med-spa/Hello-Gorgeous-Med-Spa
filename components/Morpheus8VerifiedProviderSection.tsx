import Image from "next/image";
import Link from "next/link";

const VERIFIED_PROVIDER = "/images/home/morpheus8-burst-verified-provider-inmode.png";
const BODY_BURST = "/images/home/morpheus8-body-burst-technology-inmode.png";

/**
 * Homepage proof + SEO: InMode verified Morpheus8 Burst imagery with keyword-aligned
 * headings, body copy, and image alt text (RF microneedling, Burst, body, skin tightening).
 */
export function Morpheus8VerifiedProviderSection() {
  return (
    <section
      className="bg-gradient-to-b from-slate-50 to-white py-14 md:py-20 border-t border-black/5"
      aria-labelledby="morpheus8-verified-heading"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <p className="text-sm font-bold uppercase tracking-wider text-[#E91E8C] mb-2">
            InMode · Verified provider
          </p>
          <h2
            id="morpheus8-verified-heading"
            className="text-2xl md:text-4xl font-bold text-black font-serif mb-4"
          >
            Morpheus8 Burst: deep RF microneedling for skin tightening — face &amp; body in Oswego
          </h2>
          <p className="text-black/75 text-base md:text-lg leading-relaxed">
            Hello Gorgeous is a{" "}
            <strong>verified Morpheus8 Burst provider</strong> in Oswego, IL. We offer{" "}
            <strong>RF microneedling</strong> with <strong>Burst technology</strong> for controlled,{" "}
            <strong>deep</strong> remodeling — including <strong>Morpheus8 Body</strong> for larger
            areas — to support <strong>skin tightening</strong>, texture, and contour when you want
            more than a surface treatment.
          </p>
          <p className="text-black/65 text-sm md:text-base mt-3">
            InMode&apos;s platform uses <strong>bipolar radiofrequency</strong> delivered through
            microneedles, so energy targets the layers where collagen remodeling matters.
          </p>
          <Link
            href="/services/morpheus8"
            className="inline-flex mt-6 items-center gap-2 text-[#E91E8C] font-semibold hover:underline"
          >
            Morpheus8 Burst details &amp; pricing →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
          <figure className="rounded-2xl overflow-hidden border border-black/10 shadow-lg bg-white">
            <Image
              src={VERIFIED_PROVIDER}
              alt="Morpheus8 Burst verified provider performing RF microneedling for skin tightening on face — Hello Gorgeous Med Spa Oswego IL InMode"
              width={1024}
              height={1024}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <figcaption className="px-4 py-3 text-sm text-black/60 text-center">
              Morpheus8 Burst · Verified Provider — RF microneedling (InMode)
            </figcaption>
          </figure>
          <figure className="rounded-2xl overflow-hidden border border-black/10 shadow-lg bg-teal-900/5 flex flex-col items-center justify-center p-4 md:p-6">
            <Image
              src={BODY_BURST}
              alt="Morpheus8 Body Burst technology — deep RF microneedling for body skin tightening — InMode at Hello Gorgeous Med Spa Oswego IL"
              width={225}
              height={225}
              className="w-full max-w-[280px] h-auto object-contain"
              sizes="(max-width: 768px) 70vw, 280px"
            />
            <figcaption className="mt-4 text-sm text-black/60 text-center max-w-sm">
              Morpheus8 Body — Burst technology: RF microneedling for face &amp; body contouring
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
