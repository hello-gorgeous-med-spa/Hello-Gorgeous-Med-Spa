import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = pageMetadata({
  title: "Procedures | Solaria, Morpheus8, Quantum RF | Hello Gorgeous Med Spa",
  description:
    "Signature device procedures at Hello Gorgeous Med Spa, Oswego: Solaria CO₂, Morpheus8 Burst & Deep, and InMode QuantumRF 10, 15 & 25. Pre/post guides and patient documents.",
  path: "/procedures",
});

const PROCEDURES = [
  {
    name: "Solaria CO₂ Laser",
    tag: "Fractional resurfacing",
    href: "/services/solaria-co2",
    icon: "✨",
  },
  {
    name: "Morpheus8 Burst",
    tag: "24-pin · up to 8mm · texture & tightening",
    href: "/morpheus8-burst-oswego-il",
    icon: "⚡",
  },
  {
    name: "Morpheus8 Deep",
    tag: "12-pin · subdermal focus · laxity & contour",
    href: "/services/morpheus8#morpheus8-deep",
    icon: "🎯",
  },
  {
    name: "QuantumRF",
    tag: "Handpieces: 10, 15 & 25 — subdermal RF",
    href: "/services/quantum-rf#quantum-handpieces",
    icon: "👑",
  },
];

export default function ProceduresHubPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b-2 border-black bg-gradient-to-br from-rose-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#E6007E]">Clinical procedures</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Procedures</h1>
          <p className="mt-4 text-base leading-relaxed text-black/70">
            These are our <strong>device-based, signature procedures</strong>—distinct from the broader service menu
            (injectables, facials, wellness, and more). Pre/post instructions and consents for each live under{" "}
            <Link href="/patient-documents" className="font-semibold text-[#E6007E] underline-offset-2 hover:underline">
              Patient documents
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <ul className="space-y-4">
          {PROCEDURES.map((p) => (
            <li key={p.name}>
              <Link
                href={p.href}
                className="group flex items-start gap-4 rounded-2xl border-2 border-black bg-white p-5 transition hover:border-[#E6007E] hover:shadow-md md:p-6"
              >
                <span className="text-3xl" aria-hidden>
                  {p.icon}
                </span>
                <div className="min-w-0 text-left">
                  <h2 className="text-lg font-bold text-black group-hover:text-[#E6007E] md:text-xl">{p.name}</h2>
                  <p className="mt-1 text-sm text-black/60">{p.tag}</p>
                  <p className="mt-2 text-sm font-medium text-[#E6007E] group-hover:underline">View details →</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/patient-documents"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-black bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#E6007E]"
          >
            Pre / post & consent
          </Link>
          <a
            href={BOOKING_URL}
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-[#E6007E] bg-[#E6007E] px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#c9006a]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book (Fresha)
          </a>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-black/55">
          Looking for injectables, HydraFacial, laser hair, or other offerings? See{" "}
          <Link href="/services" className="font-semibold text-[#E6007E] hover:underline">
            Services
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
