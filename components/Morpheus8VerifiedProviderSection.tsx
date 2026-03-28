import Image from "next/image";
import Link from "next/link";

const VERIFIED_PROVIDER = "/images/home/morpheus8-burst-verified-provider-inmode.png";
const BODY_BURST = "/images/home/morpheus8-body-burst-technology-inmode.png";

const MORPHEUS_SERVICE = "/services/morpheus8";
const MORPHEUS_LANDING = "/morpheus8-burst-oswego-il";

/**
 * Compact InMode proof badges + keyword-rich copy for crawlers (Morpheus8 Burst, Body, RF microneedling).
 * Full-size assets remain in JSON-LD via getMorpheus8HomepageImages() on the homepage.
 */
export function Morpheus8VerifiedProviderSection() {
  return (
    <section
      className="bg-gradient-to-b from-slate-50 to-white py-8 md:py-10 border-t border-black/5"
      aria-labelledby="morpheus8-verified-heading"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E91E8C] mb-1.5">
            InMode · Verified provider
          </p>
          <h2
            id="morpheus8-verified-heading"
            className="text-xl md:text-2xl font-bold text-black font-serif mb-3 leading-snug"
          >
            Morpheus8 Burst &amp; Morpheus8 Body — deep RF microneedling for skin tightening in Oswego, IL
          </h2>
          <p className="text-black/75 text-sm md:text-base leading-relaxed">
            Hello Gorgeous is a{" "}
            <strong>verified Morpheus8 Burst provider</strong> in Oswego. We offer{" "}
            <strong>InMode RF microneedling</strong> with <strong>Burst technology</strong> for{" "}
            <strong>face, neck, and body</strong> — including <strong>Morpheus8 Body</strong> for larger
            areas — supporting <strong>skin tightening</strong>, texture, and contour.
          </p>
          <p className="text-black/65 text-xs md:text-sm mt-2">
            Bipolar <strong>radiofrequency</strong> through microneedles targets layers where{" "}
            <strong>collagen remodeling</strong> matters.
          </p>
        </div>

        {/* Compact badge row — same images & alts as before for image SEO; small footprint on screen */}
        <ul
          className="flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-3 sm:gap-4 list-none p-0 m-0"
          aria-label="InMode Morpheus8 Burst and Morpheus8 Body credentials"
        >
          <li className="flex-1 min-w-[min(100%,260px)] sm:max-w-[340px] flex justify-center sm:justify-end">
          <Link
            href={MORPHEUS_LANDING}
            className="group w-full flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2.5 shadow-sm hover:border-[#E91E8C]/40 hover:shadow-md transition-all"
          >
            <figure className="flex items-center gap-3 m-0 shrink-0">
              <Image
                src={VERIFIED_PROVIDER}
                alt="Morpheus8 Burst verified InMode provider — RF microneedling skin tightening face — Hello Gorgeous Med Spa Oswego IL"
                width={88}
                height={88}
                className="h-[72px] w-[72px] sm:h-20 sm:w-20 rounded-lg object-cover ring-1 ring-black/5"
                sizes="80px"
              />
              <figcaption className="text-left">
                <span className="block text-sm font-bold text-black group-hover:text-[#E91E8C] transition-colors">
                  Morpheus8 Burst
                </span>
                <span className="block text-xs text-black/60 leading-tight mt-0.5">
                  Verified Provider · InMode · RF microneedling
                </span>
              </figcaption>
            </figure>
          </Link>
          </li>

          <li className="flex-1 min-w-[min(100%,260px)] sm:max-w-[340px] flex justify-center sm:justify-start">
          <Link
            href={MORPHEUS_SERVICE}
            className="group w-full flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2.5 shadow-sm hover:border-[#E91E8C]/40 hover:shadow-md transition-all"
          >
            <figure className="flex items-center gap-3 m-0 shrink-0">
              <Image
                src={BODY_BURST}
                alt="Morpheus8 Body Burst technology — deep RF microneedling for body skin tightening — InMode Hello Gorgeous Med Spa Oswego IL"
                width={88}
                height={88}
                className="h-[72px] w-[72px] sm:h-20 sm:w-20 rounded-lg object-contain bg-teal-900/[0.06] p-1 ring-1 ring-black/5"
                sizes="80px"
              />
              <figcaption className="text-left">
                <span className="block text-sm font-bold text-black group-hover:text-[#E91E8C] transition-colors">
                  Morpheus8 Body
                </span>
                <span className="block text-xs text-black/60 leading-tight mt-0.5">
                  Burst · Face &amp; body contouring · InMode
                </span>
              </figcaption>
            </figure>
          </Link>
          </li>
        </ul>

        <p className="text-center mt-5">
          <Link
            href={MORPHEUS_SERVICE}
            className="inline-flex items-center gap-1.5 text-sm text-[#E91E8C] font-semibold hover:underline"
          >
            Morpheus8 Burst details &amp; pricing →
          </Link>
        </p>
      </div>
    </section>
  );
}
