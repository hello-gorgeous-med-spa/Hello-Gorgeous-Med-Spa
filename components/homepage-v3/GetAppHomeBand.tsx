import Link from "next/link";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";
import { CLIENT_APP } from "@/lib/client-app";
import { GENTLEMENS_CLUB_PATH, GENTLEMENS_CLUB_TIERS } from "@/lib/gentlemens-club";
import { BOOKING_URL } from "@/lib/flows";

/** Always-visible homepage band — app QR on left, Gentlemen's Club on right. */
export function GetAppHomeBand() {
  return (
    <section
      id="get-the-app"
      className="relative border-b-4 border-black scroll-mt-20"
      style={{ background: "linear-gradient(180deg, #FFF0F7 0%, #ffffff 100%)" }}
      aria-labelledby="get-app-home-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 15% 50%, rgba(255,45,142,0.15), transparent 50%), radial-gradient(circle at 85% 30%, rgba(255,184,220,0.2), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">

          {/* ── LEFT: App Download ── */}
          <div className="rounded-3xl border-4 border-black bg-white/90 p-5 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] backdrop-blur-sm flex flex-col">
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">
                📱 Scan · tap · save to home screen
              </p>
              <h2 id="get-app-home-heading" className="mt-2 text-2xl md:text-3xl font-black text-black">
                Get the{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Hello Gorgeous App
                </span>
              </h2>
              <p className="mt-2 text-sm text-black/70 max-w-lg">
                {CLIENT_APP.tagline}. No App Store — scan the QR or open{" "}
                <Link href={CLIENT_APP.path} className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]/40">
                  hellogorgeousmedspa.com/app
                </Link>
                , then <strong>Add to Home Screen</strong>.
              </p>
            </div>

            <GetAppQrPromo qrSize={140} utmMedium="homepage_band" layout="row" theme="light" />

            <p className="mt-5 text-[11px] text-black/45">
              Also at the front desk · link in footer ·{" "}
              <Link href="/get-app" className="font-semibold text-[#E6007E] hover:underline">
                full-screen QR page
              </Link>
            </p>
          </div>

          {/* ── RIGHT: Gentlemen's Club / For Him ── */}
          <div
            className="rounded-3xl border-4 border-black p-5 md:p-8 shadow-[8px_8px_0_0_rgba(59,130,246,0.35)] flex flex-col"
            style={{
              background:
                "linear-gradient(135deg, #0a0a12 0%, #0f1520 60%, #0a0a12 100%)",
            }}
          >
            {/* Header */}
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7dd3fc]">
                👑 For Him · Oswego, IL
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-black text-white leading-tight">
                The{" "}
                <span className="bg-gradient-to-r from-[#7dd3fc] via-white to-[#7dd3fc] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}>
                  Gentlemen&apos;s Club
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/60 max-w-md">
                Brotox · Hormones · Peptides · Monthly wellness shots. The only men&apos;s wellness membership in the Fox Valley.
              </p>
            </div>

            {/* Service pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {["BROTOX", "HORMONES", "PEPTIDES", "RECOVERY", "IV DRIPS"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[#7dd3fc]/30 bg-[#7dd3fc]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#7dd3fc]"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Tier cards */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 flex-1">
              {GENTLEMENS_CLUB_TIERS.map((tier) => (
                <a
                  key={tier.id}
                  href={tier.squarePayUrl ?? BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex flex-col rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                    tier.highlight
                      ? "border-[#FF2D8E]/50 bg-[#FF2D8E]/10 hover:bg-[#FF2D8E]/15"
                      : "border-[#7dd3fc]/25 bg-[#7dd3fc]/5 hover:bg-[#7dd3fc]/10"
                  }`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-[#FF2D8E] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Most Popular
                    </span>
                  )}
                  <p className={`mt-1 text-xs font-bold uppercase tracking-wide ${tier.highlight ? "text-[#FFB8DC]" : "text-[#7dd3fc]"}`}>
                    {tier.name}
                  </p>
                  <p className={`text-2xl font-black tabular-nums ${tier.highlight ? "text-white" : "text-[#7dd3fc]"}`}>
                    ${tier.pricePerMonth}
                    <span className="text-sm font-semibold text-white/40">/mo</span>
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/55 line-clamp-2">{tier.summary}</p>
                  <p className={`mt-3 text-[11px] font-bold group-hover:underline ${tier.highlight ? "text-[#FFB8DC]" : "text-[#7dd3fc]"}`}>
                    Join now →
                  </p>
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={GENTLEMENS_CLUB_PATH}
                className="inline-flex items-center rounded-full border-2 border-[#7dd3fc]/50 px-4 py-2 text-xs font-bold text-[#7dd3fc] transition hover:bg-[#7dd3fc]/10"
              >
                View all For Him services →
              </Link>
              <Link
                href="/app?tab=forhim"
                className="inline-flex items-center rounded-full border-2 border-white/20 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-white/40 hover:text-white"
              >
                📱 Open in app
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
