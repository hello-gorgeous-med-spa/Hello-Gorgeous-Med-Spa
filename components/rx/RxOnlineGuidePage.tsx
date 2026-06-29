"use client";

import Image from "next/image";
import Link from "next/link";

import { GetAppQrPromo } from "@/components/GetAppQrPromo";
import { CLIENT_APP } from "@/lib/client-app";
import {
  RX_GUIDE_APP_FEATURES,
  RX_GUIDE_LINKS,
  RX_GUIDE_PATHS,
  RX_GUIDE_PILLS,
  RX_GUIDE_STEPS,
  RX_GUIDE_TIPS,
  rxGuideDisplayUrl,
} from "@/lib/rx-online-guide";
import { SITE } from "@/lib/seo";

export function RxOnlineGuidePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] print:bg-white">
      <div className="sticky top-0 z-20 border-b-[3px] border-black bg-white px-4 py-3 print:hidden">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-black">
            Patient guide — bookmark or print to save
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/portal/rx"
              className="rounded-full border-2 border-black px-4 py-2 text-xs font-bold hover:border-[#E6007E]"
            >
              My RX portal →
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border-2 border-black bg-[#E6007E] px-4 py-2 text-xs font-bold text-white hover:bg-black"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <article className="mx-auto my-5 max-w-[8.5in] border-4 border-black bg-white shadow-[0_8px_32px_rgba(230,0,126,0.12)] print:my-0 print:border-0 print:shadow-none">
        <header className="flex flex-col items-start gap-5 border-b-4 border-black bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-6 text-white sm:flex-row sm:items-center">
          <div className="relative h-[108px] w-[108px] shrink-0 overflow-hidden rounded-[14px] border-[3px] border-white bg-[#0d0508] shadow-[4px_4px_0_rgba(0,0,0,0.25)]">
            <Image
              src="/images/homepage-buyer-paths/hello-gorgeous-rx.png"
              alt="Hello Gorgeous RX"
              fill
              className="object-contain p-1"
              sizes="108px"
              priority
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
              Hello Gorgeous RX™
            </p>
            <h1 className="mt-1 font-sans text-2xl font-black leading-tight sm:text-[1.65rem]">
              Your Online Refill Guide
            </h1>
            <p className="mt-2 font-sans text-sm text-white/95">
              Peptides & medical weight loss · Ryan Kent, FNP-BC · Oswego, IL
            </p>
          </div>
        </header>

        <div className="border-b-4 border-black bg-[#FFF0F7] px-6 py-5 font-sans text-[15px] text-black/85">
          <p>
            <strong>Welcome!</strong> Most of your refill happens on your phone — forms,
            telehealth booking, payment, tracking, and private messaging with our team. Save
            this page and bookmark your <strong>care hub</strong> link below.
          </p>
        </div>

        <div className="grid grid-cols-2 border-b-4 border-black sm:grid-cols-4">
          {RX_GUIDE_PILLS.map((pill, i) => (
            <div
              key={pill.label}
              className={`border-black/10 px-3 py-4 text-center font-sans ${
                i < RX_GUIDE_PILLS.length - 1 ? "border-r" : ""
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {pill.emoji}
              </span>
              <p className="mt-1 text-[11px] font-extrabold leading-tight text-[#E6007E]">
                {pill.label}
              </p>
            </div>
          ))}
        </div>

        <p className="px-6 pt-3 font-sans text-[11px] font-black uppercase tracking-[0.12em] text-[#E6007E]">
          Your journey — five simple steps
        </p>
        <div className="grid border-b-4 border-black sm:grid-cols-5">
          {RX_GUIDE_STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`min-h-[108px] border-black/10 px-3 py-4 text-center font-sans ${
                i % 2 === 1 ? "bg-[#FFF0F7]" : "bg-white"
              } ${i < RX_GUIDE_STEPS.length - 1 ? "sm:border-r" : ""} border-b sm:border-b-0`}
            >
              <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-black bg-[#E6007E] text-xs font-black text-white">
                {i + 1}
              </span>
              <p className="mt-2 text-[11px] font-extrabold text-black">{step.title}</p>
              <p className="mt-1 text-[10px] leading-snug text-black/60">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid border-b-4 border-black md:grid-cols-2">
          {RX_GUIDE_PATHS.map((path) => (
            <div
              key={path.id}
              className={`border-black/10 px-5 py-4 font-sans md:border-r ${
                path.highlight ? "bg-[#FFF0F7]" : "bg-white"
              }`}
            >
              <h2 className="text-[13px] font-black text-[#E6007E]">{path.title}</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed text-black/85">
                {path.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <section className="font-sans">
          <h2 className="border-b-2 border-black bg-white px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#E6007E]">
            Your links — save these on your phone
          </h2>
          <div className="grid md:grid-cols-2">
            {RX_GUIDE_LINKS.map((link, i) => (
              <div
                key={link.title}
                className={`border-b border-black/10 px-5 py-3.5 ${
                  i % 2 === 0 ? "md:border-r" : ""
                } ${i >= 8 ? "bg-[#FFF0F7]/50" : ""}`}
              >
                <strong className="block text-[13px] text-black">{link.title}</strong>
                <span className="mt-0.5 block text-[11px] leading-snug text-black/55">
                  {link.description}
                </span>
                <Link
                  href={link.href}
                  className="mt-1.5 block break-all text-[11px] font-bold text-[#E6007E] hover:underline"
                >
                  {rxGuideDisplayUrl(link.href)}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t-4 border-black bg-white px-6 py-4 font-sans">
          <h2 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#E6007E]">
            Helpful to know
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-black/80">
            {RX_GUIDE_TIPS.map((tip) => (
              <li key={tip.strong}>
                <strong>{tip.strong}</strong> {tip.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid items-center gap-6 border-y-4 border-black bg-gradient-to-br from-[#FFF0F7] via-white to-[#FFF0F7] px-6 py-5 font-sans md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-black/55">
              📱 Free · No App Store
            </p>
            <h2 className="mt-1 text-lg font-black text-[#E6007E]">Get the Hello Gorgeous App</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-black/80">
              {RX_GUIDE_APP_FEATURES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href={`${CLIENT_APP.path}?rx=1`}
              className="mt-2 block break-all text-xs font-extrabold text-[#E6007E] hover:underline"
            >
              {rxGuideDisplayUrl(`${CLIENT_APP.path}?rx=1`)}
            </Link>
            <p className="mt-2 text-[11px] leading-snug text-black/65">
              <strong>How:</strong> Scan the QR → open the link on your phone → tap{" "}
              <strong>Share</strong> → <strong>Add to Home Screen</strong>.
            </p>
          </div>
          <GetAppQrPromo qrSize={118} utmMedium="rx_guide" layout="stack" theme="light" />
        </section>

        <div className="border-t-4 border-black bg-black px-6 py-5 text-center font-sans text-white">
          <p className="text-[15px] font-extrabold text-[#FFB8DC]">We&apos;re here for you</p>
          <a
            href={`tel:${SITE.phone.replace(/\D/g, "")}`}
            className="mt-1 block text-[22px] font-black tracking-wide hover:text-[#FFB8DC]"
          >
            {SITE.phone}
          </a>
          <p className="mt-2 text-[11px] text-white/65">
            {SITE.address.streetAddress} · {SITE.address.addressLocality},{" "}
            {SITE.address.addressRegion} {SITE.address.postalCode}
            <br />
            {SITE.url}
          </p>
        </div>

        <footer className="border-t border-black/10 px-4 py-2.5 text-center font-sans text-[9px] text-black/45">
          Hello Gorgeous RX™ · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · ©{" "}
          {new Date().getFullYear()} Hello Gorgeous Med Spa
        </footer>
      </article>
    </div>
  );
}
