import type { Metadata } from "next";
import Link from "next/link";
import { SITE, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { THE_BOOK, getBookSquareCheckoutUrl } from "@/lib/the-book";

export const metadata: Metadata = pageMetadata({
  title: "The Book — No Prior Authorization | Clinical Aesthetics Guide | Hello Gorgeous",
  description:
    "24 chapters on skin, lasers, injectables, GLP-1s, hormones, and peptides — the book your provider never handed you. Sneak peek, digital download via Square, by Danielle Alcala · Hello Gorgeous Med Spa Oswego.",
  path: "/the-book",
});

export default function TheBookPage() {
  const checkoutUrl = getBookSquareCheckoutUrl();
  const pageUrl = `${SITE.url}/the-book`;

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: THE_BOOK.title,
    author: { "@type": "Person", name: THE_BOOK.author },
    description: THE_BOOK.description,
    url: pageUrl,
    bookFormat: "https://schema.org/EBook",
    inLanguage: "en-US",
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  const productJsonLd =
    checkoutUrl != null
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: THE_BOOK.title,
          description: THE_BOOK.description,
          brand: { "@type": "Brand", name: SITE.name },
          offers: {
            "@type": "Offer",
            url: checkoutUrl,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE.name },
          },
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      {productJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "The Book", url: pageUrl },
            ])
          ),
        }}
      />

      <main className="bg-white text-black min-h-screen">
        {/* Hero */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(230,0,126,0.25),transparent_55%)]" />
          <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
            <p className="text-[#E6007E] text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Hello Gorgeous · Clinical education
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-[1.05]">
              Hello <span className="italic text-[#E6007E]">Gorgeous</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/85 font-light max-w-2xl mx-auto leading-snug">
              {THE_BOOK.subtitle}
            </p>
            <p className="mt-6 text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {THE_BOOK.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={THE_BOOK.sneakPeekUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-8 py-3.5 hover:border-[#E6007E] hover:text-[#E6007E] transition-colors w-full sm:w-auto"
              >
                Open full sneak peek (scroll site) ↗
              </a>
              <a
                href="#buy"
                className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-semibold px-8 py-3.5 hover:bg-[#c90a68] transition-colors w-full sm:w-auto"
              >
                Get the digital book
              </a>
            </div>
            <p className="mt-8 text-sm text-white/40">
              {THE_BOOK.author} · {THE_BOOK.authorRole}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-black/5 bg-black/[0.02] py-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {THE_BOOK.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#E6007E]">{s.value}</div>
                <div className="text-sm text-black/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Six parts */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">Six parts. Nothing held back.</h2>
            <p className="text-center text-black/65 max-w-2xl mx-auto mb-14">
              Written the way we run consultations — completely, honestly, without the industry habit of keeping patients partially informed.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {THE_BOOK.parts.map((part) => (
                <div
                  key={part.n}
                  className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-sm hover:border-[#E6007E]/30 transition-colors"
                >
                  <div className="text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-2">Part {part.n}</div>
                  <h3 className="text-xl font-bold font-serif mb-4">{part.title}</h3>
                  <ul className="space-y-2 text-sm text-black/75">
                    {part.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-[#E6007E] flex-shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sneak peek on-site teaser */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">Sneak peek</h2>
            <p className="text-center text-white/65 max-w-2xl mx-auto mb-12">
              For the full interactive preview (chapter openers, layouts, and visuals), open our dedicated book experience — then come back here to purchase the complete digital edition.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { t: "How skin actually works", sub: "Part One · Your Skin" },
                { t: "Lasers & devices — the science", sub: "Part Two · Fitzpatrick safety matrix" },
                { t: "What Botox actually does", sub: "Part Three · Injectables" },
              ].map((card) => (
                <div
                  key={card.t}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-6 min-h-[140px] flex flex-col justify-between"
                >
                  <p className="text-xs text-[#E6007E] uppercase tracking-wider">{card.sub}</p>
                  <p className="text-lg font-semibold mt-2 leading-snug">{card.t}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={THE_BOOK.sneakPeekUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-semibold px-8 py-3.5 hover:bg-[#c90a68] transition-colors"
              >
                Continue to full sneak peek at nopriorauthorization.com ↗
              </a>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Who this is for</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {THE_BOOK.whoItsFor.map((w) => (
                <div key={w.title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0" aria-hidden>
                    {w.emoji}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{w.title}</h3>
                    <p className="text-black/70 text-sm mt-2 leading-relaxed">{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buy */}
        <section id="buy" className="py-16 md:py-24 px-6 bg-gradient-to-b from-[#E6007E]/[0.06] to-white scroll-mt-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Get the book</h2>
            <p className="mt-4 text-black/70">
              Digital download. Complete your purchase securely through Square — you’ll receive fulfillment instructions from Square after payment.
            </p>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-[#E6007E] text-white font-bold text-lg px-10 py-4 hover:bg-[#c90a68] transition-colors shadow-lg shadow-[#E6007E]/25"
              >
                Buy digital edition on Square
              </a>
            ) : (
              <div className="mt-10 rounded-2xl border border-black/10 bg-white p-8 text-left">
                <p className="text-black/80 font-medium">Digital checkout is being connected.</p>
                <p className="mt-2 text-sm text-black/60">
                  Call{" "}
                  <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-[#E6007E] font-semibold">
                    {SITE.phone}
                  </a>{" "}
                  or visit us at {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
                  {SITE.address.postalCode} to get the book — or check back soon for one-click purchase.
                </p>
              </div>
            )}
            <p className="mt-8 text-xs text-black/45 max-w-md mx-auto">
              Not medical advice. Educational content for informed consent and general understanding only. Consult a qualified provider for your situation.
            </p>
            <div className="mt-10">
              <Link href="/" className="text-[#E6007E] font-semibold hover:underline">
                ← Back to Hello Gorgeous
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
