"use client";

import Link from "next/link";

/** Promo section linking to laser hair removal memberships. Blast across Oswego and surrounding areas. */
export function LaserHairMembershipsPromo({
  city,
  title = "Laser Hair Memberships — 30% Less Than Competitors",
  subtitle = "From $69/month. We see excellent results after 2 visits! Guaranteed permanent results. Small, Medium, Large & Full Body plans.",
}: {
  city?: string;
  title?: string;
  subtitle?: string;
}) {
  const baseHref = city ? `/laser-hair-memberships/${city}-il` : "/laser-hair-memberships";

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-[#FF2D8E]/5 to-transparent border-t border-[#FF2D8E]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">
          {title}
        </h2>
        <p className="text-black/70 text-center mb-6 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <p className="text-[#FF2D8E] font-bold text-center mb-8">
          We see excellent results after 2 visits!!!!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={baseHref}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-black transition-all"
          >
            View Membership Plans →
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#FF2D8E] text-[#FF2D8E] font-bold rounded-xl hover:bg-[#FF2D8E] hover:text-white transition-all"
          >
            Book Free Consultation
          </Link>
        </div>
        <p className="text-center mt-6 text-sm text-black/50">
          Serving{" "}
          {["oswego", "naperville", "aurora", "plainfield", "yorkville", "montgomery"].map((slug, i) => (
            <span key={slug}>
              {i > 0 && ", "}
              <Link href={`/laser-hair-memberships/${slug}-il`} className="text-[#FF2D8E] hover:underline font-medium">
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </Link>
            </span>
          ))}{" "}
          & the Fox Valley
        </p>
      </div>
    </section>
  );
}
