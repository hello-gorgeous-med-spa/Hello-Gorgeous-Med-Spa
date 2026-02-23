import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";
import { CherryWidget } from "@/components/CherryWidget";

export const metadata: Metadata = pageMetadata({
  title: "Financing Options | Hello Gorgeous Med Spa",
  description: "Flexible payment plans for Botox, fillers, weight loss, and more. Cherry financing, Affirm, and other options available. Get the treatments you want today.",
  path: "/financing",
});

const financingOptions = [
  {
    name: "Cherry",
    description: "0% APR financing available",
    features: [
      "Apply in minutes",
      "No hard credit check to apply",
      "Flexible payment plans (3-24 months)",
      "0% APR options available",
      "Use for any treatment",
    ],
    cta: "Apply with Cherry",
    url: "https://withcherry.com/",
    highlight: true,
    icon: "🍒",
  },
  {
    name: "Affirm",
    description: "Buy now, pay over time",
    features: [
      "Quick & easy application",
      "Split into monthly payments",
      "Know upfront what you'll pay",
      "No hidden fees",
      "Check eligibility without impacting credit",
    ],
    cta: "Learn About Affirm",
    url: "https://www.affirm.com/",
    highlight: false,
    icon: "✨",
  },
  {
    name: "CareCredit",
    description: "Healthcare credit card",
    features: [
      "Special financing options",
      "Use for multiple treatments",
      "Accepted at thousands of providers",
      "Easy monthly payments",
      "Reusable credit line",
    ],
    cta: "Apply for CareCredit",
    url: "https://www.carecredit.com/",
    highlight: false,
    icon: "💳",
  },
];

const popularPackages = [
  {
    name: "Botox Touch-Up",
    price: "$250",
    monthly: "$42/mo",
    description: "Perfect for maintenance visits",
  },
  {
    name: "Lip Filler",
    price: "$650",
    monthly: "$54/mo",
    description: "1 syringe of premium filler",
  },
  {
    name: "Weight Loss Program",
    price: "$399/mo",
    monthly: "$100/wk",
    description: "Semaglutide or Tirzepatide",
  },
  {
    name: "Full Face Rejuvenation",
    price: "$2,500",
    monthly: "$104/mo",
    description: "Botox + fillers package",
  },
];

export default function FinancingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      {/* Hero */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#E6007E] text-sm font-semibold tracking-widest uppercase mb-4">
              FLEXIBLE PAYMENT OPTIONS
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
              Look Your Best <span className="text-[#E6007E]">Today</span>,
              <br />Pay Over Time
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Don't let cost hold you back from feeling confident. We offer flexible financing 
              options so you can get the treatments you want now and pay at your own pace.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Cherry financing widget */}
      <Section className="bg-gray-50" id="cherry-widget">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Apply with <span className="text-[#E6007E]">Cherry</span>
            </h2>
            <p className="text-gray-600 mt-2">Check your rate in seconds. No impact on your credit score.</p>
          </div>
          <CherryWidget />
        </div>
      </Section>

      {/* Financing Options */}
      <Section className="bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">
              Choose Your <span className="text-[#E6007E]">Payment Plan</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {financingOptions.map((option, idx) => (
              <FadeUp key={option.name} delayMs={idx * 100}>
                <div className={`rounded-2xl p-6 h-full flex flex-col ${
                  option.highlight 
                    ? "bg-gradient-to-br from-[#E6007E] to-pink-600 text-white shadow-xl shadow-[#E6007E]/25" 
                    : "bg-white border border-gray-200 shadow-sm"
                }`}>
                  {option.highlight && (
                    <span className="self-start px-3 py-1 bg-white text-[#E6007E] text-xs font-bold rounded-full mb-4">
                      MOST POPULAR
                    </span>
                  )}
                  
                  <div className="text-4xl mb-4">{option.icon}</div>
                  
                  <h3 className={`text-2xl font-bold ${option.highlight ? "text-white" : "text-black"}`}>
                    {option.name}
                  </h3>
                  <p className={`mt-2 ${option.highlight ? "text-white/80" : "text-gray-600"}`}>
                    {option.description}
                  </p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className={option.highlight ? "text-white" : "text-[#E6007E]"}>✓</span>
                        <span className={`text-sm ${option.highlight ? "text-white/90" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 block text-center py-3 px-6 rounded-full font-bold transition ${
                      option.highlight
                        ? "bg-white text-[#E6007E] hover:bg-gray-100"
                        : "bg-[#E6007E] text-white hover:bg-[#C4006B]"
                    }`}
                  >
                    {option.cta}
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Example Monthly Payments */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">
              Sample <span className="text-[#E6007E]">Monthly Payments</span>
            </h2>
            <p className="mt-4 text-gray-600">
              With 12-month financing at 0% APR*
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPackages.map((pkg) => (
              <div key={pkg.name} className="bg-gray-50 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-black">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#E6007E]">{pkg.monthly}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Total: {pkg.price}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            *Subject to credit approval. Terms and conditions apply. Example payments shown for illustrative purposes.
          </p>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              How It <span className="text-[#E6007E]">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Apply Online",
                description: "Quick application takes just 2 minutes. Get approved instantly with no impact to your credit score.",
              },
              {
                step: "2",
                title: "Book Your Treatment",
                description: "Schedule your appointment and let us know you'll be using financing at checkout.",
              },
              {
                step: "3",
                title: "Pay Over Time",
                description: "Enjoy your results now and pay in comfortable monthly installments.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E6007E] flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">
              Frequently Asked <span className="text-[#E6007E]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Will applying affect my credit score?",
                a: "No! Checking your eligibility with Cherry or Affirm does not impact your credit score. Only a soft credit check is performed during the application.",
              },
              {
                q: "Can I use financing for any treatment?",
                a: "Yes! You can use financing for any service we offer including Botox, fillers, weight loss programs, hormone therapy, and more.",
              },
              {
                q: "How quickly will I know if I'm approved?",
                a: "Most applications are processed instantly. You'll know within minutes if you're approved and for how much.",
              },
              {
                q: "Is there a minimum purchase amount?",
                a: "Minimum amounts may vary by financing provider. Cherry typically has a $200 minimum, while others may vary.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-black">{faq.q}</h3>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-[#E6007E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Book your consultation today and ask about our financing options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="white">
              Book Consultation
            </CTA>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full font-bold border-2 border-white text-white hover:bg-white hover:text-[#E6007E] transition"
            >
              Questions? Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
