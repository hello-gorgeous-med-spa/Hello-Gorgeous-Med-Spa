import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Download Website QR Code | Hello Gorgeous Med Spa",
    description: "Download a print-ready QR code that opens hellogorgeousmedspa.com.",
    path: "/qr",
  }),
  robots: { index: false, follow: false },
};

const QR_PREVIEW = "/images/marketing/hello-gorgeous-website-qr.png";
const QR_DOWNLOAD =
  "/api/app/qr-code?target=website&download=1&width=1600";

export default function WebsiteQrDownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50">
      <section className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC] mb-4">
            Print · Signs · Windows
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Website{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              QR code
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Scan opens <strong className="text-white">www.hellogorgeousmedspa.com</strong>. Download the PNG for yard signs, windows, or the front desk.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-2xl border-4 border-black bg-white p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_PREVIEW}
                alt="QR code to hellogorgeousmedspa.com"
                width={280}
                height={280}
                className="block mx-auto"
              />
            </div>
            <p className="mt-6 text-sm font-bold text-[#E6007E] uppercase tracking-wider">
              {SITE.url.replace("https://", "")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={QR_DOWNLOAD}
                className="inline-flex items-center justify-center min-h-[48px] w-full md:w-auto bg-hg-pink hover:bg-hg-pinkDeep text-white uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
              >
                Download PNG
              </a>
              <CTA href={SITE.url} variant="outline">
                Open website
              </CTA>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-black/60">
          Need the app QR instead?{" "}
          <Link href="/get-app" className="font-semibold text-[#E6007E] underline decoration-[#FF2D8E]">
            Get the app
          </Link>
        </p>
      </section>
    </div>
  );
}
