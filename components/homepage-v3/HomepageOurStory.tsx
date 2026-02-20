"use client";

import Link from "next/link";

export function HomepageOurStory() {
  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby="our-story-heading">
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
        <h2 id="our-story-heading" className="text-2xl md:text-3xl font-bold text-black mb-6">
          Our Story
        </h2>
        <p className="text-lg text-black/80 leading-relaxed mb-6">
          Hello Gorgeous was built around a simple idea: medical aesthetics should feel
          personal, safe, and aligned with how you want to look and feel. We combine
          clinical expertise with an artist&apos;s eye so your results look like you—elevated.
        </p>
        <p className="text-lg text-black/80 leading-relaxed mb-8">
          Founded by providers who care as much about your experience as your outcome,
          we serve Oswego, Naperville, Aurora, and Plainfield with premium, natural-looking care.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center font-semibold text-[#E6007E] hover:underline focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:ring-offset-2 rounded"
        >
          Read our story
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
