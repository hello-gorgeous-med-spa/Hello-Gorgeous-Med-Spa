import type { Metadata } from "next";
import Link from "next/link";

import { AppGetQrCard } from "@/components/client-app/AppGetQrCard";
import { CTA } from "@/components/CTA";
import { CLIENT_APP } from "@/lib/client-app";
import { getAppInstallUrl } from "@/lib/app-install-url";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get the Hello Gorgeous App — Scan QR | Oswego, IL",
  description:
    "Scan the QR code to open the Hello Gorgeous Med Spa client app — book, Vitamin Bar, Build Your IV Bag, deals, memberships & rewards. Oswego, IL.",
  path: "/get-app",
});

const FEATURES = [
  "Book Botox, facials, Morpheus8, weight loss & more (Fresha)",
  "Build Your IV Bag — custom hydration from $89",
  "Vitamin Bar — pre-pay shots & drive-thru wellness",
  "Deals, gift cards & monthly memberships",
  "HG Rewards points · loyalty tiers · birthday treats",
  "GLP-1 screening, peptides, hormones & Fullscript shop",
  "Portal — appointments, documents, account & referrals",
  "Add to home screen — works like a native app (no download)",
] as const;

export default function GetAppPage() {
  const appUrl = getAppInstallUrl({ utmMedium: "get_app_page", utmCampaign: "website_qr" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50">
      <section className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-4">Oswego, IL · Fox Valley</p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Scan for the{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Hello Gorgeous App
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            {CLIENT_APP.tagline}. Point your camera at the QR code — book, build your IV bag, and save us to your home screen.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-2xl border-4 border-black bg-white p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/app/qr-code?target=app&utm_medium=get_app_page&utm_campaign=website_qr"
                alt="QR code — scan to open Hello Gorgeous app"
                width={280}
                height={280}
                className="block mx-auto"
              />
            </div>
            <p className="mt-6 text-sm font-bold text-[#E6007E] uppercase tracking-wider">Scan with your phone camera</p>
            <p className="mt-2 text-black/70 max-w-md">
              Opens <strong>{appUrl.replace("https://", "")}</strong> — then tap <strong>Add to Home Screen</strong> for one-tap access.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA href={appUrl} variant="gradient">
                Open the app
              </CTA>
              <CTA href="/book" variant="outline">
                Book a visit
              </CTA>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
          <h2 className="text-xl font-black text-black mb-4">
            Everything in one app
          </h2>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-black/85 font-medium text-sm md:text-base">
                <span className="text-[#E6007E] font-bold shrink-0">▸</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-sm text-black/60">
          Print flyer for the front desk?{" "}
          <Link href="/get-app/flyer" className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]">
            Download / print scan poster
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-black/60">
          Prefer a link?{" "}
          <Link href={CLIENT_APP.path} className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]">
            hellogorgeousmedspa.com/app
          </Link>
          {" · "}
          <Link href={`/blog/build-your-iv-bag-hello-gorgeous-app-oswego-il`} className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]">
            Read the launch guide
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-black/50">
          {SITE.name} · {CLIENT_APP.address} · {CLIENT_APP.phone}
        </p>
      </section>
    </div>
  );
}
