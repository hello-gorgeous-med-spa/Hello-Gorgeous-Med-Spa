import Image from "next/image";
import Link from "next/link";

import { appForHimUrl, GENTLEMENS_CLUB_HERO_IMAGE, GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { BOOKING_URL } from "@/lib/flows";

/** Homepage band — The Gentlemen's Club flyer + app For Him link. */
export function GentlemensClubHomeBand() {
  const appUrl = appForHimUrl({ utmMedium: "homepage_band" });

  return (
    <section
      className="relative border-y-4 border-black bg-[#030712]"
      aria-labelledby="gentlemens-club-home-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 10% 80%, rgba(255,45,142,0.12), transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">👑 For Him · In the app &amp; on site</p>
            <h2 id="gentlemens-club-home-heading" className="mt-2 text-2xl md:text-3xl font-black text-white">
              The Gentlemen&apos;s Club
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-lg">
              Brotox · hormones · peptide therapy · recovery. Membership from $99/mo — no contracts. Same experience in the{" "}
              <Link href={appUrl} className="font-semibold text-blue-300 underline decoration-blue-500/40 hover:text-white">
                Hello Gorgeous app
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href={GENTLEMENS_CLUB_PATH}
                className="inline-flex items-center justify-center rounded-xl bg-[#FF2D8E] px-6 py-3 text-sm font-bold text-white hover:bg-[#e0267d] transition-all"
              >
                Explore membership →
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-600 px-6 py-3 text-sm font-bold text-white hover:border-[#FF2D8E] transition-all"
              >
                Book consult
              </a>
            </div>
          </div>

          <Link
            href={GENTLEMENS_CLUB_PATH}
            className="group relative block overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)] transition hover:shadow-[10px_10px_0_0_rgba(59,130,246,0.4)]"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={GENTLEMENS_CLUB_HERO_IMAGE}
                alt="The Gentlemen's Club at Hello Gorgeous Med Spa"
                fill
                className="object-cover object-center transition group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
