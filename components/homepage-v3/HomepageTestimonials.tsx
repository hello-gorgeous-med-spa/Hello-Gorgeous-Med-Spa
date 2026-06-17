"use client";

import Link from "next/link";

import { HOME_TESTIMONIALS } from "@/lib/seo";
import { REVIEW_TRUST_HEADLINE, reviewTrustBody } from "@/lib/review-trust-copy";
import {
  SHOWCASE_ACCENTS,
  TrifectaShowcaseSection,
  useShowcaseVisible,
  type ShowcaseAccent,
} from "./trifecta-showcase";

function StarRating({ rating, accent }: { rating: number; accent: ShowcaseAccent }) {
  return (
    <span style={{ color: accent.subtitle }} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="mr-0.5 inline h-4 w-4"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  );
}

function TestimonialCard({
  name,
  location,
  service,
  text,
  rating,
  accent,
  delayMs,
}: {
  name: string;
  location: string;
  service: string;
  text: string;
  rating: number;
  accent: ShowcaseAccent;
  delayMs: number;
}) {
  const visible = useShowcaseVisible();

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <figure
        className="flex h-full flex-col rounded-2xl p-6 backdrop-blur-sm md:p-8"
        style={{
          backgroundColor: "rgba(24, 24, 27, 0.8)",
          border: `1px solid ${accent.border}`,
        }}
      >
        <StarRating rating={rating} accent={accent} />
        <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-white">&ldquo;{text}&rdquo;</blockquote>
        <figcaption className="mt-6 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <cite className="not-italic font-semibold text-white">{name}</cite>
          <span className="mt-0.5 block text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {location}
          </span>
          <span className="text-sm font-medium" style={{ color: accent.subtitle }}>
            {service}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

export function HomepageTestimonials() {
  return (
    <TrifectaShowcaseSection
      className="border-b-4 border-black"
      pill="Client love"
      title={
        <>
          What Our Clients Are{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)",
            }}
          >
            Saying
          </span>
        </>
      }
      description={reviewTrustBody()}
      footer={
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          <Link href="/reviews" className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E]/40">
            Read more reviews →
          </Link>
        </p>
      }
    >
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center md:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#FFB8DC]">
          {REVIEW_TRUST_HEADLINE}
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-white/75">
          {reviewTrustBody()}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="sr-only">
          What Our Clients Are Saying
        </h2>
        {HOME_TESTIMONIALS.map((t, index) => (
          <TestimonialCard
            key={t.name + t.service}
            name={t.name}
            location={t.location}
            service={t.service}
            text={t.text}
            rating={t.rating}
            accent={SHOWCASE_ACCENTS[index % SHOWCASE_ACCENTS.length]}
            delayMs={200 + (index % 2) * 150}
          />
        ))}
      </div>
    </TrifectaShowcaseSection>
  );
}
