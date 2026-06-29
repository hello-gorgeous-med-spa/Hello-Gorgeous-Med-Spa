import Image from "next/image";
import Link from "next/link";

import { CLIENT_APP } from "@/lib/client-app";

export const HELLO_GORGEOUS_APP_HOME_BANNER =
  "/images/marketing/hello-gorgeous-app-home-banner.png" as const;

/** Homepage app install band — full promotional banner with QR. */
export function GetAppHomeBand() {
  return (
    <section
      id="get-the-app"
      className="scroll-mt-20 border-b border-white/10 bg-black"
      aria-labelledby="get-app-home-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 md:py-14">
        <h2 id="get-app-home-heading" className="sr-only">
          Get the Hello Gorgeous App
        </h2>

        <Link
          href={`${CLIENT_APP.path}?utm_source=homepage&utm_medium=get_app_band&utm_campaign=pwa_install`}
          className="group block overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition hover:border-white/20"
        >
          <Image
            src={HELLO_GORGEOUS_APP_HOME_BANNER}
            alt="Get the Hello Gorgeous App — scan the QR code to add to your home screen. Book Botox, facials, Morpheus8, build your IV bag, Vitamin Bar, deals, gift cards, and rewards at Hello Gorgeous Med Spa Oswego."
            width={1024}
            height={576}
            className="h-auto w-full transition duration-300 group-hover:brightness-[1.03]"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority={false}
          />
        </Link>

        <p className="mt-4 text-center text-sm text-white/50">
          Open{" "}
          <Link
            href={CLIENT_APP.path}
            className="font-medium text-white/75 underline underline-offset-2 hover:text-white"
          >
            hellogorgeousmedspa.com/app
          </Link>{" "}
          ·{" "}
          <Link href="/get-app" className="font-medium text-white/75 underline underline-offset-2 hover:text-white">
            Full-screen QR page
          </Link>
        </p>
      </div>
    </section>
  );
}
