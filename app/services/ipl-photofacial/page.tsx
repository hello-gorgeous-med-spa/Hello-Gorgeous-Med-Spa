import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/services/ipl-photofacial";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;
const HERO_IMAGE = "/images/ipl-photofacial/ipl-photofacial-treatment-cheek.png";

const IPL_FAQS = [
  {
    question: "What is an IPL photofacial?",
    answer:
      "IPL (Intense Pulsed Light) is a broadband light treatment that targets the pigment in sun spots, freckles, brown spots, broken capillaries, and rosacea redness. Unlike a single-wavelength laser, IPL releases a spectrum of light that hits multiple targets in one pass — making it the most efficient way to even out tone, reduce redness, and reverse years of sun damage in a single session.",
  },
  {
    question: "What does IPL treat?",
    answer:
      "Sun spots and age spots, freckles you don't love, post-inflammatory hyperpigmentation, broken capillaries (those thin red threads on the cheeks and nose), facial redness and rosacea, dull and uneven skin tone, large pores, and even some early fine lines. IPL also stimulates collagen quietly underneath while it's clearing pigment on the surface.",
  },
  {
    question: "Will I see results after one treatment?",
    answer:
      "Yes — and that's what people love. Within 7–10 days of a single IPL session, brown spots darken first (called 'coffee grounding'), then flake off, leaving clearer skin. For deeper sun damage, a series of 3–5 treatments spaced 3–4 weeks apart gives the best result. We re-photograph every visit so the progress is documented, not vibes.",
  },
  {
    question: "How is IPL different from a laser?",
    answer:
      "Lasers fire a single wavelength at one specific target. IPL fires a spectrum and treats multiple concerns in the same pass. That makes IPL faster and more cost-effective for general rejuvenation, sun damage, and redness — while a fractional laser like Solaria CO₂ goes deeper for wrinkles, scars, and texture. They're complementary, not competing.",
  },
  {
    question: "How much does IPL cost in Oswego?",
    answer:
      "From $250 per single area (face, neck, chest, hands). Series of 3 are bundled at preferred pricing. Spot-only treatments are quoted lower. We do free consults for IPL — and we always check your skin type, recent sun exposure, and any active conditions before booking, because IPL safety depends on choosing the right candidate.",
  },
  {
    question: "Does IPL hurt?",
    answer:
      "It's described as a quick rubber-band snap or warm pinch. We use a chilled handpiece and topical numbing if needed. Sessions take 20–45 minutes depending on area. Most clients say it's tolerable without any prep.",
  },
  {
    question: "What's the downtime?",
    answer:
      "Mild redness for a few hours, like a workout flush. Brown spots will darken before they flake off over 7–10 days — that's the treatment working. You can wear makeup the next day. Strict SPF for 2 weeks after is non-negotiable.",
  },
  {
    question: "Can I get IPL in summer?",
    answer:
      "We avoid IPL on actively tanned or recently sun-exposed skin — it's a safety issue, not a preference. Best window is fall through spring, or any time you've been diligent with sunscreen and shade. We screen at consult and reschedule if your skin needs it.",
  },
  {
    question: "Is IPL safe for darker skin tones?",
    answer:
      "IPL is best suited for Fitzpatrick I–III. For Fitzpatrick IV–VI we recommend RF microneedling (Morpheus8) or Solaria CO₂ instead — they work in pigmented skin without the burn risk IPL carries. We always evaluate your skin in person before recommending a plan.",
  },
  {
    question: "Can I combine IPL with other treatments?",
    answer:
      "Absolutely. Most popular combos: IPL + HydraFacial for monthly tone-and-glow maintenance; IPL + Botox + filler for full facial reset; IPL + Morpheus8 (spaced out) when sun damage and skin laxity are both on the table; IPL + medical-grade skincare to prevent the pigment from coming back.",
  },
];

export const metadata: Metadata = pageMetadata({
  title:
    "Lumecca IPL Photofacial in Oswego, IL — Sun Damage, Brown Spots & Rosacea | Hello Gorgeous Med Spa",
  description:
    "Lumecca IPL photofacial in Oswego, IL — InMode intense pulsed light fades sun spots, age spots, redness & rosacea. Hello Gorgeous Med Spa, 10+ years in the Fox Valley. From $250. Free consultation.",
  path: PAGE_PATH,
});

export const revalidate = 3600;

export default function IPLPhotofacialPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "IPL Photofacial", url: PAGE_URL },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(IPL_FAQS, PAGE_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "IPL Photofacial — Intense Pulsed Light Skin Rejuvenation",
            alternateName: ["Lumecca IPL", "Photofacial", "IPL", "Intense Pulsed Light", "BBL", "Lumecca Oswego"],
            procedureType: "https://schema.org/NoninvasiveProcedure",
            description:
              "IPL Photofacial uses broadband intense pulsed light to fade sun spots, age spots, freckles, broken capillaries, and rosacea redness, while stimulating collagen for clearer, more even skin tone.",
            bodyLocation: ["Face", "Neck", "Chest", "Hands"],
            performer: {
              "@type": "MedicalBusiness",
              name: SITE.name,
              url: SITE.url,
              telephone: SITE.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.streetAddress,
                addressLocality: SITE.address.addressLocality,
                addressRegion: SITE.address.addressRegion,
                postalCode: SITE.address.postalCode,
                addressCountry: "US",
              },
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: "250",
              priceValidUntil: `${new Date().getFullYear()}-12-31`,
              description: "From $250 per area. Series of 3 bundled at preferred pricing.",
              availability: "https://schema.org/InStock",
              url: PAGE_URL,
            },
            image: `${SITE.url}${HERO_IMAGE}`,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(80% 50% at 90% 0%, rgba(230,0,126,0.35) 0%, rgba(0,0,0,0) 60%), radial-gradient(60% 50% at 10% 100%, rgba(255,45,142,0.25) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
                <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" />
                NEW · Now Booking
              </span>
              <p className="text-[#FFB8DC] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-5">
                Lumecca IPL Photofacial
                <br />
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Oswego, IL — Sun Damage Gone
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-xl mb-3 font-semibold">
                Fade brown spots, redness, and rosacea — fast.
              </p>
              <p className="text-base md:text-lg text-white/80 max-w-xl mb-8">
                InMode Lumecca-class intense pulsed light treats sun spots, age spots, broken capillaries,
                and uneven tone in 20–45 minutes. Most clients see visible clearing
                within 7–10 days of a single session. From{" "}
                <span className="font-bold text-white">$250</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/book?service=ipl-photofacial"
                  className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition shadow-[0_8px_24px_rgba(230,0,126,0.45)]"
                >
                  Book Free Consultation →
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
                >
                  Call {SITE.phone}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                <span>✓ Single session results</span>
                <span>✓ 20–45 minute treatments</span>
                <span>✓ No real downtime</span>
                <span>✓ Free consultation</span>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <Image
                src={HERO_IMAGE}
                alt="IPL Photofacial treatment in progress at Hello Gorgeous Med Spa Oswego, IL — Zemits 530nm intense pulsed light handpiece treating face for sun damage and pigmentation"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav strip */}
      <nav className="bg-white/70 backdrop-blur sticky top-16 z-10 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center">
          {[
            ["What it treats", "#what-it-treats"],
            ["How it works", "#how-it-works"],
            ["Pricing", "#pricing"],
            ["Results", "#results"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center rounded-full border-2 border-black bg-gradient-to-br from-white to-rose-50 px-4 py-1.5 text-sm font-semibold text-black hover:border-[#E6007E] hover:text-[#E6007E] transition"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* What it treats */}
      <section id="what-it-treats" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold tracking-widest uppercase text-white mb-4">
              01
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black">
              What IPL{" "}
              <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                actually treats
              </span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto mt-4 text-lg">
              IPL hits multiple targets in a single pass — that's why people love it.
              One treatment, multiple wins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "☀️", title: "Sun Spots & Age Spots", desc: "Brown patches from years of sun exposure — gone in 7–10 days." },
              { icon: "🌹", title: "Rosacea & Redness", desc: "Diffuse facial redness and flushing dialed back significantly." },
              { icon: "🩸", title: "Broken Capillaries", desc: "Those thin red threads on cheeks and nose — vaporized." },
              { icon: "✨", title: "Freckles", desc: "Fade or remove sun-induced freckles you don't love." },
              { icon: "🎨", title: "Uneven Tone", desc: "Smooth out the patchwork from inflammation and sun damage." },
              { icon: "🫶", title: "Hands & Chest", desc: "Reverse sun damage on the décolleté and backs of hands." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-black text-[#E6007E] mb-1">▸ {item.title}</h3>
                <p className="text-black/85 font-medium text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-rose-50 via-white to-rose-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold tracking-widest uppercase text-white mb-4">
              02
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black">
              How a Photofacial{" "}
              <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                actually works
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Targeted light absorption",
                body: "Broadband pulsed light is absorbed by melanin (pigment) and hemoglobin (red vessels) — without harming surrounding skin.",
              },
              {
                step: "02",
                title: "Pigment + vessels neutralized",
                body: "Brown spots heat up and rise to the surface (the 'coffee-grounding' effect). Broken capillaries collapse and clear.",
              },
              {
                step: "03",
                title: "Skin sheds + rebuilds",
                body: "Over the next 7–10 days, the surface flakes off revealing clearer skin. Underneath, collagen production quietly ramps up.",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
              >
                <div className="text-5xl font-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent mb-3">
                  {step.step}
                </div>
                <h3 className="text-xl font-black text-black mb-2">{step.title}</h3>
                <p className="text-black/80 font-medium text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold tracking-widest uppercase text-white mb-4">
              03
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black">
              Simple, honest{" "}
              <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: "Single area", price: "$250+", body: "Face, neck, chest, or hands. One area, one session.", popular: false },
              { tier: "Series of 3", price: "Bundled", body: "Preferred pricing for the standard 3-session protocol — best for sun damage that's been building for years.", popular: true },
              { tier: "Add-on", price: "Quoted", body: "Stack with HydraFacial, peels, or microneedling at consult-only pricing.", popular: false },
            ].map((p) => (
              <div
                key={p.tier}
                className={`rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] ${
                  p.popular ? "ring-4 ring-[#E6007E] ring-offset-2" : ""
                }`}
              >
                {p.popular && (
                  <span className="inline-block mb-3 rounded-full bg-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Most Booked
                  </span>
                )}
                <h3 className="text-xl font-black text-black">{p.tier}</h3>
                <div className="my-2 text-4xl font-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  {p.price}
                </div>
                <p className="text-black/80 font-medium text-sm">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-black/60 text-sm mt-8">
            Free consultations are required before first treatment. Pricing finalized at consult based on
            skin type and area.
          </p>
        </div>
      </section>

      {/* Results / FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold tracking-widest uppercase text-white mb-4">
              04
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black">
              IPL Photofacial{" "}
              <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                FAQ
              </span>
            </h2>
          </div>
          <div className="space-y-4">
            {IPL_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-bold text-[#E6007E] text-lg">▸ {faq.question}</span>
                  <span className="text-2xl text-black/60 group-open:rotate-90 transition-transform">
                    →
                  </span>
                </summary>
                <p className="mt-3 text-black/85 font-medium leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        className="py-16 md:py-24 text-white"
        style={{
          background:
            "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5">
            Sun damage didn't show up overnight.
            <br />
            <span className="text-white/95">It can leave in one session.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto">
            Book your free IPL consult — we'll evaluate your skin, walk through what
            it'll actually do, and price your plan with no pressure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/book?service=ipl-photofacial"
              className="inline-flex items-center justify-center rounded-lg bg-white text-[#E6007E] px-8 py-4 font-bold hover:bg-black hover:text-white transition shadow-2xl"
            >
              Book Free Consultation →
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-[#E6007E] transition"
            >
              Call {SITE.phone}
            </a>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            Serving Oswego, Naperville, Aurora, Plainfield, Yorkville, and the Fox Valley.
          </p>
        </div>
      </section>
    </>
  );
}
