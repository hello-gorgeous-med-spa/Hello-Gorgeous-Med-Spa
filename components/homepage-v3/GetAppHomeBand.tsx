import Link from "next/link";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";
import { CLIENT_APP } from "@/lib/client-app";

/** Always-visible homepage band — scan QR without waiting for popup. */
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
        <div className="rounded-3xl border-4 border-black bg-white/90 p-5 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] backdrop-blur-sm">
          <div className="mb-5 text-center md:text-left">
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
            <p className="mt-2 text-sm text-black/70 max-w-2xl">
              {CLIENT_APP.tagline}. No App Store — scan the QR or open{" "}
              <Link href={CLIENT_APP.path} className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]/40">
                hellogorgeousmedspa.com/app
              </Link>
              , then <strong>Add to Home Screen</strong>.
            </p>
          </div>

          <GetAppQrPromo qrSize={152} utmMedium="homepage_band" layout="row" theme="light" />

          <p className="mt-5 text-center text-[11px] text-black/45 md:text-left">
            Also at the front desk · link in footer ·{" "}
            <Link href="/get-app" className="font-semibold text-[#E6007E] hover:underline">
              full-screen QR page
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
