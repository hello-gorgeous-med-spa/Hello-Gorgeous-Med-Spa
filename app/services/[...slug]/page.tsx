import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd, type Service } from "@/lib/seo";
import {
  ATLAS_CLUSTERS,
  maybeCategorySlug,
  servicesForCluster,
  getClusterForService,
  type ServiceAtlasClusterId,
} from "@/lib/services-atlas";

type Params = { slug: string[] };

export function generateStaticParams() {
  const categoryParams = ATLAS_CLUSTERS.map((c) => ({ slug: [c.id] }));
  const serviceParams = SERVICES.map((s) => ({ slug: [s.slug] }));
  return [...categoryParams, ...serviceParams];
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const [one] = params.slug;
  if (!one) return pageMetadata({ title: "Services", description: "Services.", path: "/services" });

  if (maybeCategorySlug(one)) {
    const cluster = ATLAS_CLUSTERS.find((c) => c.id === one);
    return pageMetadata({
      title: cluster?.title ?? "Services",
      description:
        cluster?.description ??
        "Explore services at Hello Gorgeous Med Spa—education-first clusters with optional booking.",
      path: `/services/${one}`,
    });
  }

  const s = SERVICES.find((x) => x.slug === one);
  if (!s)
    return pageMetadata({
      title: "Service",
      description: "Service details.",
      path: "/services",
    });

  return pageMetadata({
    title: s.name,
    description: `${s.heroTitle} — ${s.short} Serving Oswego, Naperville, Aurora, and Plainfield.`,
    path: `/services/${s.slug}`,
  });
}

function CategoryPage({ categoryId }: { categoryId: ServiceAtlasClusterId }) {
  const cluster = ATLAS_CLUSTERS.find((c) => c.id === categoryId);
  if (!cluster) notFound();
  const cards = servicesForCluster(categoryId);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
              <span className="text-2xl">{cluster.icon}</span>
              <span className="text-pink-400 text-sm font-semibold uppercase tracking-wider">Service Category</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-black">{cluster.title.split(' ')[0]} </span>
              <span className="text-[#E6007E]">
                {cluster.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-black/80 max-w-3xl leading-relaxed">{cluster.description}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-8 py-4">
                Book a Consultation
              </CTA>
              <CTA href="/quiz" variant="outline" className="text-lg px-8 py-4">
                Find My Treatment
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E] text-center mb-4">
            Explore {cluster.title}
          </h2>
          <p className="text-black/80 text-center max-w-2xl mx-auto mb-12">
            Click any treatment below to learn more about benefits, what to expect, and whether it's right for you.
          </p>
        </FadeUp>
        
        {cards.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, idx) => (
              <FadeUp key={c.slug} delayMs={40 * idx}>
                <Link
                  href={`/services/${c.slug}`}
                  className="group block rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white p-6 hover:border-[#E6007E] hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-xs text-black/60 mb-3">
                    <span className="px-2 py-1 rounded bg-pink-100">{c.intensity}</span>
                    <span>•</span>
                    <span>{c.commitment}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-black group-hover:text-[#E6007E] transition-colors">{c.name}</h2>
                  <p className="mt-3 text-black/80 leading-relaxed">{c.plainLanguage}</p>
                  <div className="mt-6 flex items-center gap-2 text-[#E6007E] font-semibold">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white p-8 text-center">
            <p className="text-black font-semibold text-lg">This category is coming soon.</p>
            <p className="mt-2 text-black/80">
              Contact us to learn more about available treatments in this area.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <CTA href="/contact" variant="outline">Contact Us</CTA>
              <CTA href="/services" variant="gradient">View All Services</CTA>
            </div>
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100" />
        <div className="relative z-10 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E] mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-xl text-black/80 max-w-2xl mx-auto mb-8">
              Book a consultation and let our expert team create a personalized treatment plan just for you.
            </p>
            <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-4">
              Book Your Free Consultation
            </CTA>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}

// Get service-specific content
function getServiceContent(s: Service) {
  const baseContent = {
    benefits: [
      { icon: "✨", title: "Natural Results", description: "Subtle enhancements that look like the best version of you" },
      { icon: "⏱️", title: "Minimal Downtime", description: "Get back to your life quickly with most treatments" },
      { icon: "👩‍⚕️", title: "Expert Providers", description: "Administered by trained, certified professionals" },
      { icon: "💝", title: "Personalized Care", description: "Every treatment plan is customized to your goals" },
    ],
    process: [
      { step: 1, title: "Consultation", description: "We discuss your goals, concerns, and create a personalized plan" },
      { step: 2, title: "Preparation", description: "Review pre-treatment guidelines and answer any questions" },
      { step: 3, title: "Treatment", description: "Relax while our experts deliver your customized treatment" },
      { step: 4, title: "Aftercare", description: "Receive detailed aftercare instructions and follow-up support" },
    ],
    testimonial: {
      quote: "I was nervous at first, but the team made me feel so comfortable. The results exceeded my expectations!",
      author: "Sarah M.",
      location: "Naperville, IL",
    },
  };

  // Service-specific overrides
  const serviceOverrides: Record<string, Partial<typeof baseContent>> = {
    "botox-dysport-jeuveau": {
      benefits: [
        { icon: "⏰", title: "Quick 15-Min Treatment", description: "Perfect for your lunch break - be in and out in under 30 minutes" },
        { icon: "🎯", title: "Precise Results", description: "Target specific areas like frown lines, forehead, and crow's feet" },
        { icon: "🔄", title: "Preventative Benefits", description: "Regular treatments can help prevent deeper wrinkles from forming" },
        { icon: "💫", title: "No Surgery Needed", description: "Achieve a refreshed look without going under the knife" },
      ],
      testimonial: {
        quote: "I look refreshed and natural - not frozen. My friends keep asking what my secret is!",
        author: "Jennifer K.",
        location: "Oswego, IL",
      },
    },
    "dermal-fillers": {
      benefits: [
        { icon: "📍", title: "Strategic Volume", description: "Restore lost volume exactly where you need it most" },
        { icon: "⏳", title: "Long-Lasting", description: "Results can last 6-18 months depending on the product and area" },
        { icon: "🔄", title: "Reversible", description: "HA fillers can be dissolved if needed for peace of mind" },
        { icon: "💎", title: "Instant Gratification", description: "See beautiful results immediately after treatment" },
      ],
    },
    "lip-filler": {
      benefits: [
        { icon: "👄", title: "Natural Enhancement", description: "Subtle, balanced lips that complement your facial features" },
        { icon: "💧", title: "Hydration Boost", description: "HA fillers add moisture for plumper, healthier-looking lips" },
        { icon: "🎨", title: "Customizable Shape", description: "Define your cupid's bow, add volume, or improve symmetry" },
        { icon: "⏱️", title: "Quick & Comfortable", description: "Numbing cream makes the 15-30 minute treatment comfortable" },
      ],
    },
    "weight-loss-therapy": {
      benefits: [
        { icon: "📉", title: "Medical-Grade Results", description: "GLP-1 medications help reduce appetite and cravings naturally" },
        { icon: "👩‍⚕️", title: "Provider-Supervised", description: "Regular check-ins ensure safe, effective progress" },
        { icon: "🎯", title: "Sustainable Approach", description: "Focus on long-term lifestyle changes, not quick fixes" },
        { icon: "💪", title: "Comprehensive Support", description: "Nutrition guidance and accountability built into your plan" },
      ],
      process: [
        { step: 1, title: "Medical Evaluation", description: "Complete health assessment and lab work to ensure candidacy" },
        { step: 2, title: "Personalized Protocol", description: "Custom medication dosing and nutrition guidance" },
        { step: 3, title: "Weekly/Monthly Check-ins", description: "Regular monitoring to track progress and adjust as needed" },
        { step: 4, title: "Maintenance Plan", description: "Transition to sustainable habits for long-term success" },
      ],
      testimonial: {
        quote: "Down 35 lbs and feeling incredible. The support from the team made all the difference.",
        author: "Michelle R.",
        location: "Aurora, IL",
      },
    },
    "biote-hormone-therapy": {
      benefits: [
        { icon: "⚡", title: "Restored Energy", description: "Say goodbye to fatigue and feel like yourself again" },
        { icon: "😊", title: "Balanced Mood", description: "Reduce mood swings and feel more emotionally stable" },
        { icon: "😴", title: "Better Sleep", description: "Experience deeper, more restorative sleep" },
        { icon: "🔥", title: "Improved Metabolism", description: "Support healthy weight management naturally" },
      ],
      process: [
        { step: 1, title: "Consultation & Labs", description: "We review your symptoms, medical history, and run in-office labs (metabolic panel, thyroid, hormones, vitamins). Results in ~36 hours." },
        { step: 2, title: "Lab Review & Plan", description: "We interpret your results and create a personalized protocol—pellets, compounded options, or a combination based on your needs." },
        { step: 3, title: "Treatment", description: "BioTE pellet insertion or prescription for Olympia-compounded medications. Quick, in-office procedure for pellets." },
        { step: 4, title: "Follow-Up & Monitoring", description: "Regular check-ins and repeat labs ensure optimal levels and adjust dosing as needed." },
      ],
      testimonial: {
        quote: "I was skeptical but within a few weeks my energy came back and I started sleeping through the night. Game changer.",
        author: "Lisa T.",
        location: "Oswego, IL",
      },
    },
    "iv-therapy": {
      benefits: [
        { icon: "💧", title: "100% Absorption", description: "Bypass digestion for immediate nutrient delivery" },
        { icon: "⚡", title: "Instant Energy", description: "Feel revitalized within hours, not days" },
        { icon: "🛡️", title: "Immune Support", description: "High-dose vitamins to boost your body's defenses" },
        { icon: "✨", title: "Glowing Skin", description: "Hydration from the inside out for radiant results" },
      ],
    },
    "rf-microneedling": {
      benefits: [
        { icon: "🔬", title: "Collagen Stimulation", description: "RF energy triggers your body's natural healing response" },
        { icon: "🎯", title: "Precise Depth Control", description: "Customizable settings for your specific skin concerns" },
        { icon: "📉", title: "Reduces Pores & Scars", description: "Improves texture, acne scars, and enlarged pores" },
        { icon: "⏰", title: "Progressive Results", description: "Skin continues improving for months after treatment" },
      ],
    },
  };

  return { ...baseContent, ...serviceOverrides[s.slug] };
}

function ServiceDetailPage({ serviceSlug }: { serviceSlug: string }) {
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  if (!s) notFound();

  const content = getServiceContent(s);
  const cluster = getClusterForService(s.slug);

  const quickFacts =
    s.category === "Injectables"
      ? [
          { icon: "⏱️", k: "Treatment Time", v: "15–30 min" },
          { icon: "⬇️", k: "Downtime", v: "Minimal" },
          { icon: "📅", k: "Results In", v: "2–14 days" },
          { icon: "🔄", k: "Lasts", v: "3–12 months" },
        ]
      : s.category === "Wellness"
        ? [
            { icon: "🩺", k: "First Step", v: "Consult + Labs" },
            { icon: "📊", k: "Monitoring", v: "Ongoing" },
            { icon: "📅", k: "Timeline", v: "Varies" },
            { icon: "🎯", k: "Goal", v: "Sustainable" },
          ]
        : s.category === "Regenerative"
          ? [
              { icon: "🧬", k: "Approach", v: "Regenerative" },
              { icon: "⬇️", k: "Downtime", v: "1–3 days" },
              { icon: "📅", k: "Results In", v: "2–6 weeks" },
              { icon: "🔄", k: "Series", v: "Recommended" },
            ]
          : [
              { icon: "✨", k: "Experience", v: "Luxury" },
              { icon: "⬇️", k: "Downtime", v: "Varies" },
              { icon: "📅", k: "Results", v: "Progressive" },
              { icon: "🔄", k: "Maintenance", v: "Optional" },
            ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(s.faqs)) }}
      />

      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            {cluster && (
              <Link 
                href={`/services/${cluster.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6 hover:bg-pink-500/20 transition-colors"
              >
                <span className="text-xl">{cluster.icon}</span>
                <span className="text-pink-400 text-sm font-medium">{cluster.title}</span>
                <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#E6007E]">
              {s.name}
            </h1>
            <p className="mt-2 text-lg text-black/70">{s.heroTitle}</p>
            <p className="mt-6 text-xl md:text-2xl text-black/80 max-w-3xl leading-relaxed">{s.heroSubtitle}</p>
            
            {/* Quick Stats */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickFacts.map((f, idx) => (
                <div key={f.k} className="flex items-center gap-3 p-4 rounded-xl bg-pink-50 border-2 border-black">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-xs text-black/60 uppercase tracking-wide">{f.k}</p>
                    <p className="text-lg font-bold text-black">{f.v}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-pink-500/20">
                Book Now — Limited Availability
              </CTA>
              <CTA href="/contact" variant="outline" className="text-lg px-8 py-4">
                Have Questions? Contact Us
              </CTA>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-black/80">
              <span>Or book with:</span>
              <Link
                href={`${BOOKING_URL}?provider=danielle`}
                className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2"
              >
                Danielle
              </Link>
              <Link
                href={`${BOOKING_URL}?provider=ryan`}
                className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2"
              >
                Ryan
              </Link>
              <Link href="/providers" className="text-black/70 hover:text-[#E6007E]">
                Meet the experts →
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
              Why Choose {s.name} at Hello Gorgeous
            </h2>
            <p className="mt-4 text-xl text-black/80 max-w-2xl mx-auto">
              Experience the difference that expert care and personalized attention makes
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.benefits.map((b, idx) => (
            <FadeUp key={b.title} delayMs={60 * idx}>
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-black hover:border-[#E6007E] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-[#E6007E] mb-2">{b.title}</h3>
                <p className="text-black/80">{b.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* What It Is / Who It's For / What to Expect */}
      <Section className="bg-gradient-to-b from-pink-50/50 via-white to-pink-50/50">
        <div className="grid lg:grid-cols-3 gap-8">
          {(s.slug === "biote-hormone-therapy"
            ? [
                { icon: "💡", title: "What It Is", body: "Bioidentical hormone optimization using BioTE pellets and, when appropriate, Olympia Pharmacy compounded formulations. We tailor delivery (pellets, creams, injectables) to your labs and goals." },
                { icon: "👤", title: "Who It's For", body: "Adults experiencing fatigue, sleep issues, mood changes, weight gain, low libido, or other hormone-related symptoms. A full consultation and lab work determine candidacy." },
                { icon: "📋", title: "What to Expect", body: "Consultation, in-office labs (results in ~36 hours), lab review, and personalized treatment—pellets, compounded prescriptions, or both—with ongoing monitoring." },
              ]
            : [
                { icon: "💡", title: "What It Is", body: s.short },
                { icon: "👤", title: "Who It's For", body: "Anyone looking for natural-looking results with expert guidance. Perfect for those who value quality, safety, and a personalized experience." },
                { icon: "📋", title: "What to Expect", body: "A thorough consultation to understand your goals, clear explanation of the process, comfortable treatment, and comprehensive aftercare support." },
              ]
          ).map((c, idx) => (
            <FadeUp key={c.title} delayMs={60 * idx}>
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-black">
                <span className="text-4xl mb-4 block">{c.icon}</span>
                <h2 className="text-2xl font-bold text-[#E6007E] mb-4">{c.title}</h2>
                <p className="text-black/80 leading-relaxed">{c.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Process Steps */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
              Your Treatment Journey
            </h2>
            <p className="mt-4 text-xl text-black/80">Simple, seamless, and stress-free</p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-4 gap-6">
          {content.process.map((p, idx) => (
            <FadeUp key={p.step} delayMs={80 * idx}>
              <div className="relative">
                {idx < content.process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-pink-500/50 to-transparent" />
                )}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-black">
                  <div className="w-12 h-12 rounded-full bg-[#E6007E] flex items-center justify-center text-white font-bold text-lg mb-4">
                    {p.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#E6007E] mb-2">{p.title}</h3>
                  <p className="text-black/80 text-sm">{p.description}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Social Proof */}
      <Section className="bg-gradient-to-b from-transparent via-pink-950/10 to-transparent">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <FadeUp>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-black">
                <div className="flex items-center gap-1 text-pink-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl text-black font-medium italic leading-relaxed">
                  "{content.testimonial.quote}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
                    {content.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-black font-semibold">{content.testimonial.author}</p>
                    <p className="text-black/60 text-sm">{content.testimonial.location}</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Trust Badges */}
            <FadeUp delayMs={100}>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: "🏥", label: "Medical-Grade" },
                  { icon: "✅", label: "FDA-Approved" },
                  { icon: "🎓", label: "Certified Experts" },
                ].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center p-4 rounded-xl bg-pink-50 border-2 border-black">
                    <span className="text-2xl mb-2">{badge.icon}</span>
                    <span className="text-sm text-black/80 text-center">{badge.label}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget serviceName={s.name} slug={s.slug} category={s.category} />
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* Before/After Results Gallery - Dermal Fillers & Lip Filler */}
      {(s.slug === "dermal-fillers" || s.slug === "lip-filler") && (
        <Section>
          <FadeUp>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
                <span className="text-pink-400 text-sm font-semibold uppercase tracking-wider">Real Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Before & After
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                See the beautiful, natural-looking transformations our clients achieve
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2">
            <FadeUp delayMs={60}>
              <div className="rounded-2xl overflow-hidden border-2 border-black bg-white">
                <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                  <Image
                    src="/images/results/revanesse-1.png"
                    alt="Lip filler before and after - Patient 1"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="rounded-2xl overflow-hidden border-2 border-black bg-white">
                <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                  <Image
                    src="/images/results/revanesse-2.png"
                    alt="Lip filler before and after - Patient 2"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delayMs={180}>
            <div className="mt-10 text-center">
              <p className="text-sm text-black/60 mb-6">
                Results shown are from actual clients. Individual results may vary.
              </p>
            </div>
          </FadeUp>
        </Section>
      )}

      {/* Before/After Results Gallery - RF Microneedling with AnteAge */}
      {s.slug === "rf-microneedling" && (
        <Section>
          <FadeUp>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-4">
                <span className="text-fuchsia-400 text-sm font-semibold uppercase tracking-wider">Real Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Before & After
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                RF microneedling with AnteAge® biosomes—improved texture, pores, and skin quality
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2">
            <FadeUp delayMs={60}>
              <div className="rounded-2xl overflow-hidden border-2 border-black bg-white">
                <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                  <Image
                    src="/images/results/anteage-1.png"
                    alt="RF microneedling with AnteAge before and after - Patient 1"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="rounded-2xl overflow-hidden border-2 border-black bg-white">
                <div className="relative aspect-[9/16] w-full max-w-md mx-auto">
                  <Image
                    src="/images/results/anteage-2.png"
                    alt="RF microneedling with AnteAge before and after - Patient 2"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delayMs={180}>
            <div className="mt-10 text-center">
              <p className="text-sm text-black/60 mb-6">
                Results shown are from actual clients. Individual results may vary. AnteAge® biosomes used in treatment.
              </p>
            </div>
          </FadeUp>
        </Section>
      )}

      {/* Hormone Clinical Info - BioTE only */}
      {s.slug === "biote-hormone-therapy" && (
        <Section className="bg-gradient-to-b from-pink-50/50 via-white to-pink-50/50">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Formulations, Prescriptions & Safety
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                What we prescribe, how we formulate, and when we may need to pause or adjust your plan.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delayMs={60}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>💊</span> Olympia & Formulations
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-3">
                  We use <strong className="text-black">BioTE bioidentical hormone pellets</strong> for sustained release, plus <strong className="text-black">Olympia Pharmacy</strong> compounded medications when appropriate. Olympia offers Biest (50/50 and 80/20 ratios), estradiol, progesterone, testosterone (creams and injectables including testosterone cypionate), and anastrozole—all customized to your dosing needs.
                </p>
                <p className="text-black/60 text-xs">
                  Your provider selects the best delivery method based on your labs and goals.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>📋</span> Most Common Prescriptions
                </h3>
                <ul className="text-black/80 text-sm space-y-2">
                  <li><strong className="text-black">Women:</strong> Biest, progesterone, testosterone pellets or cream</li>
                  <li><strong className="text-black">Men:</strong> Testosterone pellets or testosterone cypionate</li>
                  <li><strong className="text-black">Both:</strong> Anastrozole (when indicated for balance)</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  Dosing is individualized based on lab results and symptom response.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>⚠️</span> Contraindications
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We do not initiate hormone therapy if you have:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Active or history of breast, endometrial, or prostate cancer</li>
                  <li>Untreated venous thromboembolism (VTE), stroke, or coronary event within 6 months</li>
                  <li>Active liver disease or unexplained vaginal bleeding</li>
                  <li>Pregnancy or breastfeeding</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We screen thoroughly before treatment and discuss any concerns with you.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>🔬</span> Lab Red Flags
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  These lab findings may delay or prevent treatment until addressed:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li><strong className="text-black">Men:</strong> Elevated PSA or uncertain PSA status</li>
                  <li>Markedly elevated hemoglobin/hematocrit (polycythemia risk)</li>
                  <li>Severely abnormal liver function</li>
                  <li>Active cardiovascular concerns or clotting disorders</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We review all labs and discuss next steps before initiating or continuing therapy.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* BHRT Women Product Info PDF */}
          <FadeUp delayMs={140}>
            <div className="mt-8 max-w-5xl mx-auto">
              <a
                href="/documents/BHRT-Women-Product-Info.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white hover:border-[#E6007E] transition-colors group"
              >
                <span className="text-3xl">📄</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#E6007E] group-hover:underline">
                    BHRT for Women – Product Information
                  </h3>
                  <p className="text-black/80 text-sm mt-1">
                    Download our Bioidentical Hormone Replacement Therapy product information for women.
                  </p>
                </div>
                <span className="shrink-0 text-[#E6007E] font-semibold group-hover:translate-x-1 transition-transform">
                  View PDF →
                </span>
              </a>
            </div>
          </FadeUp>
        </Section>
      )}

      {/* Weight Loss GLP-1 Clinical Info */}
      {s.slug === "weight-loss-therapy" && (
        <Section className="bg-gradient-to-b from-pink-50/50 via-white to-pink-50/50">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                GLP-1 Medications & Safety
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                What we prescribe, how we titrate, and when we may need to pause or adjust your plan.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delayMs={60}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>💊</span> Medications & Formulations
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-3">
                  We offer <strong className="text-black">Semaglutide</strong> (similar to Wegovy®/Ozempic®) and <strong className="text-black">Tirzepatide</strong> (similar to Zepbound®/Mounjaro®)—both GLP-1 receptor agonists. Medications are compounded by a licensed pharmacy and titrated gradually to minimize side effects and maximize results.
                </p>
                <p className="text-black/60 text-xs">
                  Your provider selects the best medication and starting dose based on your health history and goals.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>📋</span> Most Common Prescriptions
                </h3>
                <ul className="text-black/80 text-sm space-y-2">
                  <li><strong className="text-black">Semaglutide:</strong> Weekly injection, gradual dose increase over weeks</li>
                  <li><strong className="text-black">Tirzepatide:</strong> Weekly injection, dual GIP/GLP-1 agonist</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  Dosing is individualized. We start low and titrate based on tolerance and response.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>⚠️</span> Contraindications
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We do not initiate GLP-1 therapy if you have:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Personal or family history of medullary thyroid cancer</li>
                  <li>Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)</li>
                  <li>Pregnancy or planning pregnancy</li>
                  <li>History of pancreatitis</li>
                  <li>Severe gastroparesis</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We screen thoroughly before treatment and discuss any concerns with you.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-[#E6007E] mb-3 flex items-center gap-2">
                  <span>🔬</span> Lab & Monitoring
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We may check or monitor:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Baseline metabolic panel, A1C if diabetic</li>
                  <li>Regular check-ins for nausea, appetite, and weight</li>
                  <li>Dose adjustments based on tolerance and goals</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  Medically supervised. We review progress and adjust your plan as needed.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>
      )}

      {/* Botox, Dysport & Jeuveau Clinical Info */}
      {s.slug === "botox-dysport-jeuveau" && (
        <Section className="bg-gradient-to-b from-transparent via-pink-950/10 to-transparent">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
                <span className="text-pink-400 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Neurotoxins, Safety &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                  What to Expect
                </span>
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                FDA-approved neuromodulators, treatment areas, and when we may need to pause or adjust.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delayMs={60}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                  <span>💉</span> Products We Use
                </h3>
                <div className="mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src="/images/jeuveau-product.png"
                    alt="Jeuveau neuromodulator vial and syringe - FDA-approved botulinum toxin type A at Hello Gorgeous Med Spa"
                    width={400}
                    height={300}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <p className="text-black/80 text-sm leading-relaxed mb-3">
                  We use <strong className="text-black">Botox®</strong>, <strong className="text-black">Dysport®</strong>, and <strong className="text-black">Jeuveau®</strong>—all FDA-approved neuromodulators (botulinum toxin type A). Each works similarly to relax targeted muscles and smooth lines. Your provider selects the best product and dosing for your anatomy and goals.
                </p>
                <p className="text-black/60 text-xs">
                  All are safe, effective, and administered by trained injectors.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                  <span>🎯</span> Treatment Areas
                </h3>
                <ul className="text-black/80 text-sm space-y-2">
                  <li><strong className="text-black">Forehead:</strong> Horizontal lines</li>
                  <li><strong className="text-black">Glabella (11s):</strong> Frown lines between brows</li>
                  <li><strong className="text-black">Crow&apos;s feet:</strong> Lines around eyes</li>
                  <li><strong className="text-black">Bunny lines, lip flip:</strong> Subtle enhancements</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  Results typically visible in 3–7 days; full effect at 2 weeks. Lasts about 3–4 months.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Contraindications
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We do not treat if you have:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Pregnancy or breastfeeding</li>
                  <li>Neuromuscular disease (e.g., myasthenia gravis, ALS)</li>
                  <li>Allergy to botulinum toxin or any ingredient</li>
                  <li>Infection at the injection site</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We screen before treatment and discuss any concerns with you.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                  <span>📋</span> What to Expect
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  Quick in-office treatment:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>No downtime; return to normal activities</li>
                  <li>Avoid lying down 4 hours; no strenuous exercise 24 hours</li>
                  <li>No massaging treated areas</li>
                  <li>Results last 3–4 months; touch-ups as needed</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We provide detailed aftercare instructions at your visit.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>
      )}

      {/* Lip Filler Clinical Info - Revanesse + Salmon DNA */}
      {s.slug === "lip-filler" && (
        <Section className="bg-gradient-to-b from-transparent via-rose-950/10 to-transparent">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
                <span className="text-rose-400 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Products, Safety &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                  What to Expect
                </span>
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                What we use for lip enhancement, contraindications, and aftercare.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delayMs={60}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <span>💋</span> Products We Use
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-3">
                  We use <strong className="text-black">Revanesse®</strong> for lip enhancement—a smooth, resilient hyaluronic acid (HA) filler. We also use <strong className="text-black">Revanesse® with salmon DNA</strong>, which adds polydeoxyribonucleotide (PDRN) for enhanced tissue repair and a more natural feel. Your provider selects the best formulation for your goals.
                </p>
                <p className="text-black/60 text-xs">
                  HA fillers are reversible; results are customizable and natural-looking.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <span>👄</span> Treatment Areas
                </h3>
                <ul className="text-black/80 text-sm space-y-2">
                  <li><strong className="text-black">Lip body:</strong> Volume and fullness</li>
                  <li><strong className="text-black">Lip border:</strong> Definition and shape</li>
                  <li><strong className="text-black">Cupid&apos;s bow:</strong> Balance and symmetry</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  Results are immediate. Some swelling for 24–48 hours. Results typically last 6–12+ months.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Contraindications
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We do not treat if you have:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Active infection or cold sore at or near the treatment site</li>
                  <li>Allergy to hyaluronic acid, lidocaine, or bacterial proteins</li>
                  <li>Pregnancy or breastfeeding</li>
                  <li>History of severe scarring or keloids</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We screen before treatment and discuss any concerns with you.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <span>📋</span> What to Expect
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  In-office treatment with topical numbing:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Minimal downtime; avoid makeup, intense exercise for 24 hours</li>
                  <li>Possible bruising or swelling for a few days</li>
                  <li>Results settle and look natural within 1–2 weeks</li>
                  <li>Follow aftercare instructions for best outcomes</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We provide detailed aftercare at your visit.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>
      )}

      {/* RF Microneedling Clinical Info - AnteAge + Allergan Baby Tox */}
      {s.slug === "rf-microneedling" && (
        <Section className="bg-gradient-to-b from-transparent via-fuchsia-950/10 to-transparent">
          <FadeUp>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-4">
                <span className="text-fuchsia-400 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E6007E]">
                Products, Safety &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                  What to Expect
                </span>
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl mx-auto">
                Science-backed bioceuticals and neuromodulators we use for optimal RF microneedling results.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delayMs={60}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-3 flex items-center gap-2">
                  <span>✨</span> Products We Use
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-3">
                  We partner with <strong className="text-black">AnteAge®</strong> for bioceuticals and <strong className="text-black">biosomes</strong>—stem cell–derived growth factors and peptides that support collagen, elastin, and healing. We also use <strong className="text-black">Allergan</strong> for &quot;baby tox&quot;—micro-diluted neuromodulator (Botox Cosmetic®) applied during or after treatment to refine pores and reduce sebum. Your provider selects the best combination for your skin goals.
                </p>
                <p className="text-black/60 text-xs">
                  AnteAge + RF microneedling + baby tox = a complete, science-backed approach to texture and rejuvenation.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={80}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-3 flex items-center gap-2">
                  <span>🎯</span> Treatment Areas & Benefits
                </h3>
                <ul className="text-black/80 text-sm space-y-2">
                  <li><strong className="text-black">Texture:</strong> Fine lines, pores, acne scars</li>
                  <li><strong className="text-black">AnteAge biosomes:</strong> Support collagen and healing</li>
                  <li><strong className="text-black">Baby tox:</strong> Refines pores, reduces oiliness</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  A series of 3–4 treatments is typically recommended for best results.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Contraindications
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  We do not treat if you have:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Active breakout, infection, or cold sore in treatment area</li>
                  <li>Keloid scarring tendency</li>
                  <li>Pregnancy or breastfeeding</li>
                  <li>Recent isotretinoin (Accutane) use</li>
                  <li>Uncontrolled bleeding disorder</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We screen before treatment and discuss any concerns with you.
                </p>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="p-6 rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white">
                <h3 className="text-lg font-bold text-fuchsia-400 mb-3 flex items-center gap-2">
                  <span>📋</span> What to Expect
                </h3>
                <p className="text-black/80 text-sm leading-relaxed mb-2">
                  RF microneedling with AnteAge and baby tox:
                </p>
                <ul className="text-black/80 text-sm space-y-1 list-disc list-inside">
                  <li>Topical numbing applied; procedure 30–45 minutes</li>
                  <li>Mild redness and pinpoint bleeding; resolves in a few days</li>
                  <li>Minimal downtime; avoid sun, harsh products for 24–48 hours</li>
                  <li>Results improve over weeks as collagen remodels</li>
                </ul>
                <p className="text-black/60 text-xs mt-3">
                  We provide detailed aftercare at your visit.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>
      )}

      {/* Powered by Olympia - Hormone, Weight Loss */}
      {(s.slug === "biote-hormone-therapy" || s.slug === "weight-loss-therapy") && (
        <Section className="bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
          <FadeUp>
            <div className="max-w-3xl mx-auto rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-violet-400 mb-2">💊 Our Compounding Partner</h3>
                  <p className="text-black/80 text-sm leading-relaxed">
                    We source compounded medications from <strong>Olympia Pharmacy</strong>—a licensed 503A/503B facility. 
                    Browse their full medication directory for hormones, weight loss, peptides, IV therapy, vitamins, and more.
                  </p>
                </div>
                <a
                  href="https://www.olympiapharmacy.com/medication-directory/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-semibold hover:bg-violet-500/30 transition"
                >
                  Browse Olympia Directory
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <Link href="/pharmacy-partner" className="mt-4 inline-block text-sm text-violet-400/80 hover:text-violet-400">
                Learn more about our pharmacy partner →
              </Link>
            </div>
          </FadeUp>
        </Section>
      )}

      {/* FAQ Section */}
      <Section>
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Questions
              </span>
            </h2>
              <p className="mt-4 text-black/80">Everything you need to know about {s.name}</p>
          </div>
        </FadeUp>

        <div className="max-w-3xl mx-auto space-y-4">
          {s.faqs.map((f, idx) => (
            <FadeUp key={f.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white overflow-hidden">
                <summary className="cursor-pointer p-6 flex items-center justify-between text-lg font-semibold text-black hover:text-[#E6007E] transition-colors">
                  <span>{f.question}</span>
                  <span className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center group-open:rotate-45 transition-transform">
                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-black/80 leading-relaxed">{f.answer}</p>
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E6007E] mb-6">
              Ready to Look and Feel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500">
                Gorgeous
              </span>
              ?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Book your consultation today and take the first step toward the results you deserve. 
              Our expert team is ready to create your personalized treatment plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-4 shadow-xl shadow-pink-500/25">
                Book Your Consultation Now
              </CTA>
              <CTA href="/contact" variant="outline" className="text-lg px-10 py-4">
                Contact Us First
              </CTA>
            </div>
            <p className="mt-6 text-sm text-black/60">
              📍 Serving Oswego, Naperville, Aurora & Plainfield | 📞 (630) 636-6193
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Related Services */}
      {cluster && (
        <Section>
          <FadeUp>
            <h2 className="text-2xl font-bold text-[#E6007E] mb-8">
              More in {cluster.title}
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.filter(
              (service) => 
                cluster.services.includes(service.slug) && 
                service.slug !== s.slug
            )
              .slice(0, 3)
              .map((service, idx) => (
                <FadeUp key={service.slug} delayMs={60 * idx}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-black hover:border-[#E6007E] transition-all"
                  >
                    <h3 className="text-xl font-bold text-black group-hover:text-[#E6007E] transition-colors">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-black/80 text-sm line-clamp-2">{service.short}</p>
                    <span className="mt-4 inline-flex items-center text-[#E6007E] text-sm font-medium">
                      Learn more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </FadeUp>
              ))}
          </div>
        </Section>
      )}
    </>
  );
}

export default function ServicesCatchAllPage({ params }: { params: Params }) {
  const [one] = params.slug;
  if (!one) notFound();

  if (maybeCategorySlug(one)) return <CategoryPage categoryId={one} />;
  return <ServiceDetailPage serviceSlug={one} />;
}
