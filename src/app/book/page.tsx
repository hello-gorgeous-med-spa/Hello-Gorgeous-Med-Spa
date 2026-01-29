import type { Metadata } from "next";
import Link from "next/link";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Book Now",
  description:
    "Schedule your consultation with Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, and Plainfield.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <SiteJsonLd />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <Container className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              READY WHEN YOU ARE
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Book{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Now
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              This page is ready for your booking tool integration (Acuity, Vagaro, Jane,
              etc.). For now, use the CTA below.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="gradient" shape="pill">
                <Link href="/contact">Contact to Schedule</Link>
              </Button>
              <Button asChild variant="outline" shape="pill">
                <Link href="/services">See Services</Link>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </Section>

      <Section>
        <Container>
          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6 md:p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Booking integration placeholder
              </h2>
              <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
                Embed a scheduler widget here or link to an external booking URL.
              </p>
              <div className="mt-8">
                <a
                  className="group px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                  href="/contact"
                >
                  Start with Contact
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-8">
                No auth-gated pages. Fully crawlable and ad-ready.
              </p>
            </div>
          </FadeUp>
        </Container>
      </Section>
    </>
  );
}

