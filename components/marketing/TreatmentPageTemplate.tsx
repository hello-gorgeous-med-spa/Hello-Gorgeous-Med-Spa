"use client";

import { useState } from "react";
import Link from "next/link";
import type { TreatmentConfig } from "@/data/treatments";
import { SITE } from "@/lib/seo";

function HeroSection({ t }: { t: TreatmentConfig }) {
  return (
    <section className="bg-black text-white py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <p style={{ color: t.accentColor }} className="text-sm font-semibold uppercase tracking-widest mb-4">
          Advanced Treatment in Oswego, Illinois
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-serif">
          {t.name}
          <br />
          <span style={{ color: t.accentColor }}>{t.tagline}</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/85 mb-8 leading-relaxed max-w-2xl">
          {t.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book"
            style={{ backgroundColor: t.accentColor }}
            className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-lg text-lg transition-all hover:-translate-y-0.5 shadow-lg"
          >
            Book Free Consultation
          </Link>
          <a
            href="tel:6306366193"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg text-lg transition-all"
          >
            📞 630-636-6193
          </a>
        </div>
      </div>
    </section>
  );
}

function TechnologySection({ t }: { t: TreatmentConfig }) {
  if (!t.technologyLabel) return null;
  return (
    <section className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <p style={{ color: t.accentColor }} className="text-sm font-semibold uppercase tracking-widest mb-4">
          {t.technologyLabel}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          What Makes <span style={{ color: t.accentColor }}>{t.name}</span> Different
        </h2>
        <p className="text-white/75 text-lg mb-10 max-w-3xl">{t.technologyDescription}</p>
        <div className="space-y-4">
          {t.technologyPoints?.map((point, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: `${t.accentColor}10`, borderLeft: `4px solid ${t.accentColor}` }}>
              <span style={{ color: t.accentColor }} className="text-lg font-bold mt-0.5 flex-shrink-0">✓</span>
              <span className="text-white/90">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection({ t }: { t: TreatmentConfig }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 font-serif">
          How It Works
        </h2>
        <div className="space-y-6 mb-12">
          {t.howItWorks.map((step, i) => (
            <div key={i} className="flex items-start gap-5">
              <div
                style={{ backgroundColor: t.accentColor }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              >
                {i + 1}
              </div>
              <p className="text-black/80 text-lg pt-1.5">{step}</p>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-bold text-black mb-6">Benefits</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.benefits.map((b) => (
            <div key={b} className="flex items-center gap-3 p-4 rounded-xl border border-black/10">
              <span style={{ color: t.accentColor }} className="text-lg flex-shrink-0">✓</span>
              <span className="text-black/80">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConditionsSection({ t }: { t: TreatmentConfig }) {
  return (
    <section className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
          What Can {t.name} Treat?
        </h2>
        <p className="text-white/70 text-lg mb-10">
          {t.name} is effective for a wide range of skin and body concerns.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {t.conditions.map((c) => (
            <div key={c.label} className="flex items-center gap-3 p-4 rounded-xl" style={{ border: `1px solid ${t.accentColor}30`, background: `${t.accentColor}08` }}>
              <span style={{ color: t.accentColor }} className="text-lg flex-shrink-0">✓</span>
              <span className="text-white/90">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreasSection({ t }: { t: TreatmentConfig }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 font-serif">
          Treatment Areas
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {t.areas.map((a) => (
            <div key={a.area} className="p-6 rounded-2xl border border-black/10 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="text-xl font-bold text-black">{a.area}</h3>
              </div>
              <p className="text-black/70">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecoverySection({ t }: { t: TreatmentConfig }) {
  return (
    <section className="py-16 md:py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 font-serif">
          Recovery & Results
        </h2>
        <div className="space-y-4">
          {t.recovery.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-white/10">
              <div style={{ backgroundColor: `${t.accentColor}30`, color: t.accentColor }} className="px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0">
                {step.split(":")[0]}
              </div>
              <p className="text-white/85">{step.split(":").slice(1).join(":").trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VIPSection({ t }: { t: TreatmentConfig }) {
  if (!t.vipPrice) return null;
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
          {t.vipLabel || "Limited Special"}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 font-serif">VIP Launch Package</h2>
        <div className="rounded-3xl border-2 bg-black/50 p-10 md:p-14 shadow-2xl max-w-md mx-auto" style={{ borderColor: `${t.accentColor}40` }}>
          <div className="text-white/60 text-sm uppercase tracking-widest mb-4">{t.vipPackage}</div>
          <div className="text-white/50 mb-2">{t.name} Treatment</div>
          <div style={{ color: t.accentColor }} className="text-6xl md:text-7xl font-bold my-6">
            {t.vipPrice}
          </div>
          {t.regularPrice && (
            <div className="text-white/40 text-sm mb-8">
              Regular price: <span className="line-through">{t.regularPrice}</span>
            </div>
          )}
          <Link
            href="/book"
            style={{ backgroundColor: t.accentColor }}
            className="inline-flex items-center justify-center px-10 py-4 text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg"
          >
            Book Your VIP Session
          </Link>
          <p className="text-white/40 text-xs mt-6">
            Limited availability. Introductory pricing ends when spots fill.
          </p>
        </div>
      </div>
    </section>
  );
}

function FAQSectionClient({ t }: { t: TreatmentConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 font-serif">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {t.faqs.map((faq, i) => (
            <div key={i} className="border border-black/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="font-semibold text-black pr-4">{faq.question}</span>
                <span style={{ color: t.accentColor }} className="text-xl flex-shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-black/70 leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ t, crossLinks }: { t: TreatmentConfig; crossLinks?: { label: string; href: string }[] }) {
  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          Ready to Experience
          <br />
          <span style={{ color: t.accentColor }}>{t.name}</span>?
        </h2>
        <p className="text-white/70 text-lg mb-4">
          Schedule your free consultation and discover what {t.name} can do for you.
        </p>
        <p className="text-white/50 text-sm mb-10">
          Serving Oswego, Naperville, Aurora, Plainfield, Montgomery, and Yorkville.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/book"
            style={{ backgroundColor: t.accentColor }}
            className="inline-flex items-center justify-center px-10 py-4 text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg"
          >
            Book Your Consultation
          </Link>
          <a
            href="tel:6306366193"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full text-lg transition-all"
          >
            📞 630-636-6193
          </a>
        </div>

        {crossLinks && crossLinks.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4">Explore our other advanced treatments:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {crossLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-white/50 space-y-1 text-sm mt-10">
          <p className="font-semibold text-white/70">Hello Gorgeous Med Spa</p>
          <p>74 W Washington Street, Oswego, Illinois 60543</p>
        </div>
      </div>
    </section>
  );
}

interface TreatmentPageTemplateProps {
  treatment: TreatmentConfig;
  crossLinks?: { label: string; href: string }[];
}

export function TreatmentPageTemplate({ treatment: t, crossLinks }: TreatmentPageTemplateProps) {
  return (
    <main className="bg-white">
      <HeroSection t={t} />
      <TechnologySection t={t} />
      <OverviewSection t={t} />
      <ConditionsSection t={t} />
      <AreasSection t={t} />
      <RecoverySection t={t} />
      <VIPSection t={t} />
      <FAQSectionClient t={t} />
      <CTASection t={t} crossLinks={crossLinks} />
    </main>
  );
}
