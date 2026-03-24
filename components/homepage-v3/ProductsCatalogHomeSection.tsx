import Image from "next/image";
import Link from "next/link";

import { PRODUCT_OFFER_CATEGORIES } from "@/lib/products-we-offer-cards";
import { PRODUCT_OFFER_CATEGORY_IMAGE } from "@/lib/products-offer-category-assets";

/**
 * Homepage block linking to the interactive products-we-offer catalog (with category imagery).
 */
export function ProductsCatalogHomeSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F9] via-white to-white py-20 md:py-28 border-y border-[#E6007E]/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, rgba(230,0,126,0.12), transparent 45%), radial-gradient(circle at 80% 60%, rgba(201,10,104,0.08), transparent 40%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-[0.72rem] tracking-[0.14em] uppercase text-[#E6007E] font-semibold font-sans mb-3">
            Hello Gorgeous RX™
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-black font-serif leading-tight mb-5">
            Explore our compounded <span className="text-[#E6007E] italic">Rx catalog</span> — built for Oswego &amp; the western suburbs
          </h2>
          <p className="text-lg text-black/75 font-sans font-light leading-relaxed">
            We built a dedicated catalog for the medication families we may prescribe after your visit — GLP-1 weight loss,
            peptides, hormones, longevity, hair loss, sexual wellness, and IV nutrients. Tap a category to open that tab;
            every card includes <strong className="text-black font-medium">Learn more</strong> and{" "}
            <strong className="text-black font-medium">Book now</strong>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
            <Link
              href="/products-we-offer"
              className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-semibold px-8 py-4 text-sm uppercase tracking-wide hover:bg-[#C90A68] transition-colors shadow-md shadow-[#E6007E]/20"
            >
              Open full catalog
            </Link>
            <Link
              href="/blog?filter=rx"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#E6007E]/40 text-[#C90A68] font-semibold px-8 py-4 text-sm hover:bg-[#FFF5F9] transition-colors"
            >
              Read Hello Gorgeous RX™ articles
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {PRODUCT_OFFER_CATEGORIES.map((cat) => {
            const img = PRODUCT_OFFER_CATEGORY_IMAGE[cat.id];
            if (!img) return null;

            return (
              <Link
                key={cat.id}
                href={`/products-we-offer?cat=${encodeURIComponent(cat.id)}`}
                className="group flex flex-col rounded-2xl border border-[#E6007E]/15 bg-white shadow-sm hover:shadow-lg hover:border-[#E6007E]/35 transition-all duration-200 overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-[#FAFAFA]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent h-1/2 pointer-events-none" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold drop-shadow-sm">
                    {cat.navLabel}
                  </p>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-wider text-[#E6007E]/90 font-semibold mb-1">{cat.eyebrow}</p>
                  <p className="text-sm text-black/70 font-light leading-snug line-clamp-2 mb-3">{cat.description}</p>
                  <span className="mt-auto text-sm font-semibold text-[#E6007E] group-hover:underline">
                    View {cat.cards.length} options →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
