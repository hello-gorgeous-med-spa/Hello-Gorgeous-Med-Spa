import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hello Gorgeous App — Print Flyer (Scan QR)",
  description: "Print-ready in-spa flyer with a scannable QR code for the Hello Gorgeous client app.",
  path: "/get-app/flyer",
  robots: { index: false, follow: false },
});

/** High-res QR from API — same URL as lib/app-install-url (spa_flyer medium). */
const QR_SRC =
  "/api/app/qr-code?target=app&utm_medium=spa_flyer&utm_campaign=app_install&width=512";

export default function GetAppFlyerPrintPage() {
  return (
    <div className="min-h-screen bg-neutral-200 print:bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:p-0">
        <p className="mb-4 text-center text-sm text-black/60 print:hidden">
          Print this page (portrait) or download{" "}
          <a
            href="/images/marketing/hello-gorgeous-app-scan-flyer.jpg"
            className="font-semibold text-[#E6007E] underline"
          >
            the fixed JPG flyer
          </a>
          . QR opens{" "}
          <strong>www.hellogorgeousmedspa.com/app</strong>.
        </p>

        <article className="overflow-hidden rounded-2xl border-4 border-black bg-black shadow-xl print:rounded-none print:border-0 print:shadow-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/marketing/hello-gorgeous-app-scan-flyer.jpg"
            alt="Hello Gorgeous Med Spa — scan QR to get the app"
            className="block w-full h-auto"
          />
        </article>

        <div className="mt-8 hidden print:block text-center">
          <p className="text-xs text-black/50">Backup QR (512px) if poster image fails to print:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QR_SRC} alt="" width={200} height={200} className="mx-auto mt-2" />
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: letter portrait; margin: 0.25in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
