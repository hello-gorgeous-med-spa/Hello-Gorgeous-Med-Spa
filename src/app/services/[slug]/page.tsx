import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) return pageMetadata({ title: "Service", description: "Service details.", path: "/services" });

  return pageMetadata({
    title: s.name,
    description: `${s.hero.title} — ${s.short} Serving Oswego, Naperville, Aurora, and Plainfield.`,
    path: `/services/${s.slug}`,
  });
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) notFound();

  return (
    <>
      <SiteJsonLd />
      <FAQJsonLd faqs={s.faqs} />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <Container className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              {s.category.toUpperCase()}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                {s.name}
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              {s.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="gradient" shape="pill">
                <Link href="/book">Book Now</Link>
              </Button>
              <Button asChild variant="outline" shape="pill">
                <Link href="/services">Back to Services</Link>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "What it is",
                body: s.short,
              },
              {
                title: "What to expect",
                body: "A consult-first approach, personalized recommendations, and a clear plan for results and maintenance.",
              },
              {
                title: "Local care",
                body: "Conveniently located for clients in Oswego, Naperville, Aurora, and Plainfield.",
              },
            ].map((c, idx) => (
              <FadeUp key={c.title} delay={0.06 * idx}>
                <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                  <h2 className="text-xl font-bold text-white">{c.title}</h2>
                  <p className="mt-3 text-gray-300">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Questions
              </span>
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl">
              Quick answers to common questions about {s.name}.
            </p>
          </FadeUp>

          <div className="mt-10 grid gap-4">
            {s.faqs.map((f, idx) => (
              <FadeUp key={f.question} delay={0.04 * idx}>
                <details className="group rounded-2xl border border-gray-800 bg-black/40 p-6">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-white flex items-center justify-between">
                    <span>{f.question}</span>
                    <span className="text-white/60 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-300">{f.answer}</p>
                </details>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

