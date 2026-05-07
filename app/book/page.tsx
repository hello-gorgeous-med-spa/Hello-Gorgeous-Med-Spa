// ============================================================
// Public booking page
// Previously this route hard-redirected to the external booking engine.
// Google marked `/book` as "Excluded by noindex tag" because the destination
// emits noindex. Keeping this route as an indexable landing page preserves
// SEO visibility while still sending users to booking quickly.
// ============================================================

import Link from "next/link";
import type { Metadata } from "next";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata } from "@/lib/seo";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { bookingUrlForService } from "@/lib/square/booking-url";
import { resolveServiceIdForSlug } from "@/lib/square/service-slugs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = pageMetadata({
  title: "Book Consultation | Hello Gorgeous Med Spa",
  description:
    "Book your consultation at Hello Gorgeous Med Spa in Oswego, IL. Schedule injectables, Morpheus8, Quantum RF, Solaria CO2, medical weight loss, and wellness visits.",
  path: "/book",
});

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const slugParam = sp["service"];
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  let baseUrl = BOOKING_URL;
  if (slug) {
    const serviceId = await resolveServiceIdForSlug(slug);
    if (serviceId) baseUrl = bookingUrlForService(serviceId);
  }

  // Strip `service` from forwarded params so it doesn't leak into Square's URL.
  const forwarded: Record<string, string | string[] | undefined> = { ...sp };
  delete forwarded["service"];

  const dest = mergeBookRedirectUrl(baseUrl, forwarded);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
        <p className="inline-flex items-center rounded-full border-2 border-black bg-[#FFF0F7] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#E6007E]">
          Hello Gorgeous Med Spa Booking
        </p>
        <h1 className="mt-4 text-4xl font-black text-black">Book Your Consultation</h1>
        <p className="mt-3 max-w-2xl text-black/75">
          Schedule with the Hello Gorgeous team in Oswego, IL for injectables, skin tightening, resurfacing,
          medical weight loss, and wellness care. Same-day or next-day options may be available.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={dest}
            className="rounded-lg bg-[#E6007E] px-6 py-3 text-sm font-bold text-white hover:bg-[#c3006b]"
          >
            Open Live Booking Calendar
          </a>
          <Link
            href="/services"
            className="rounded-lg border-2 border-black px-6 py-3 text-sm font-bold text-black hover:bg-black/5"
          >
            Explore Services First
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-black/15 bg-[#FFF8FC] p-4">
          <p className="text-sm font-semibold text-black">Need help choosing a treatment first?</p>
          <p className="mt-1 text-sm text-black/70">
            Call <a href={`tel:${SITE.phone}`} className="font-semibold text-[#E6007E]">{SITE.phone}</a> or visit{" "}
            <Link href="/contact" className="font-semibold text-[#E6007E]">contact</Link> and our team can guide you.
          </p>
        </div>
      </div>
    </main>
  );
}
