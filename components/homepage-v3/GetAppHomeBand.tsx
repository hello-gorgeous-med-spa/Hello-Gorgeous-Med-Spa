import Link from "next/link";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";
import { CLIENT_APP } from "@/lib/client-app";

/** Trimmed homepage band — app install only (men's TRT linked from medical lane). */
export function GetAppHomeBand() {
  return (
    <section
      id="get-the-app"
      className="relative scroll-mt-20 border-b-4 border-black"
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

      <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-10">
        <div className="rounded-3xl border-4 border-black bg-white/90 p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] backdrop-blur-sm md:p-8">
          <div className="mb-5 text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">
              📱 Scan · tap · save to home screen
            </p>
            <h2 id="get-app-home-heading" className="mt-2 text-2xl font-black text-black md:text-3xl">
              Get the{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Hello Gorgeous App
              </span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-black/70 md:mx-0">
              {CLIENT_APP.tagline}. Book, My RX refills, deals &amp; messaging — no App Store. Open{" "}
              <Link
                href={`${CLIENT_APP.path}?rx=1`}
                className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]/40"
              >
                hellogorgeousmedspa.com/app
              </Link>{" "}
              and tap <strong>Add to Home Screen</strong>.
            </p>
          </div>

          <GetAppQrPromo qrSize={140} utmMedium="homepage_band" layout="row" theme="light" />

          <p className="mt-5 text-center text-[11px] text-black/45 md:text-left">
            Also at the front desk ·{" "}
            <Link href="/get-app" className="font-semibold text-[#E6007E] hover:underline">
              full-screen QR page
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
