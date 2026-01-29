import type { Metadata } from "next";
import Link from "next/link";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, and Plainfield. Book a consultation or send a message.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <SiteJsonLd />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <Container className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Us
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Questions about Botox/Dysport, dermal fillers, GLP‑1 weight loss, hormone
              therapy, or PRF/PRP? Reach out—we’ll guide you to the right next step.
            </p>
          </FadeUp>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeUp>
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                <h2 className="text-2xl font-bold text-white">Hello Gorgeous Med Spa</h2>
                <p className="mt-3 text-gray-300">
                  {site.address.streetAddress}, {site.address.addressLocality},{" "}
                  {site.address.addressRegion} {site.address.postalCode}
                </p>
                <p className="mt-4 text-gray-300">
                  <span className="text-white font-semibold">Phone:</span> {site.phone}
                </p>
                <p className="mt-2 text-gray-300">
                  <span className="text-white font-semibold">Email:</span> {site.email}
                </p>
                <p className="mt-6 text-gray-400 text-sm">
                  Serving Oswego, Naperville, Aurora, and Plainfield.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="gradient" shape="pill">
                    <Link href="/book">Book Now</Link>
                  </Button>
                  <Button asChild variant="outline" shape="pill">
                    <Link href="/services">See Services</Link>
                  </Button>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
                <h2 className="text-2xl font-bold text-white">Send a message</h2>
                <p className="mt-3 text-gray-300">
                  This form is a placeholder for your email/SMS/CRM integration.
                </p>
                <form className="mt-6 grid gap-4">
                  <input
                    className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    placeholder="Name"
                    name="name"
                  />
                  <input
                    className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    placeholder="Email or phone"
                    name="contact"
                  />
                  <textarea
                    className="w-full min-h-[140px] rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    placeholder="How can we help?"
                    name="message"
                  />
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                    type="button"
                  >
                    Submit (integration needed)
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>
    </>
  );
}

