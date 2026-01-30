"use client";

import { useState } from "react";

const BOOKING_URL = "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

const benefits = [
  {
    icon: "🎁",
    title: "FREE Service Up to $75",
    description: "New subscribers receive a complimentary service valued up to $75 at Hello Gorgeous Med Spa",
    highlight: true,
  },
  {
    icon: "⚡",
    title: "No Waiting Required",
    description: "Skip the traditional healthcare delays. Get the care you need when you need it",
  },
  {
    icon: "📋",
    title: "No Prior Authorization",
    description: "No insurance hoops to jump through. No referrals needed. Direct access to treatments",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    description: "Know exactly what you&apos;re paying upfront. No surprise bills or hidden fees",
  },
  {
    icon: "🏥",
    title: "Quality Healthcare",
    description: "Board-certified providers delivering medical-grade treatments and services",
  },
  {
    icon: "📱",
    title: "Telehealth Available",
    description: "Consult with our providers from the comfort of your home via secure video",
  },
];

const freeServices = [
  { name: "B12 Injection", value: "$35", icon: "💉" },
  { name: "Vitamin D Injection", value: "$45", icon: "☀️" },
  { name: "Lipotropic (Fat Burner) Injection", value: "$55", icon: "🔥" },
  { name: "Biotin Injection", value: "$40", icon: "💅" },
  { name: "Glutathione Injection", value: "$65", icon: "✨" },
  { name: "Mini Consultation", value: "$50", icon: "👩‍⚕️" },
  { name: "Trigger Point Injection (1 site)", value: "$75", icon: "🎯" },
  { name: "Basic Skin Analysis", value: "$50", icon: "🔬" },
];

const howItWorks = [
  {
    step: "1",
    title: "Subscribe",
    description: "Join No Prior Authorization with a simple subscription",
    icon: "📝",
  },
  {
    step: "2",
    title: "Get Verified",
    description: "Quick verification process - no lengthy paperwork",
    icon: "✅",
  },
  {
    step: "3",
    title: "Claim Your Free Service",
    description: "Choose any service up to $75 at Hello Gorgeous Med Spa",
    icon: "🎁",
  },
  {
    step: "4",
    title: "Enjoy Ongoing Benefits",
    description: "Continue enjoying member perks, discounts, and priority booking",
    icon: "⭐",
  },
];

const memberPerks = [
  "10% off all services",
  "Priority appointment booking",
  "Exclusive member events",
  "Early access to new treatments",
  "Birthday bonus service",
  "Referral rewards program",
  "Monthly wellness newsletter",
  "Free annual skin consultation",
];

const faqs = [
  {
    q: "What is No Prior Authorization?",
    a: "No Prior Authorization is a membership program that gives you direct access to healthcare services without the traditional insurance hassles, referrals, or waiting periods. We believe everyone deserves immediate access to quality care.",
  },
  {
    q: "How do I claim my free $75 service?",
    a: "After subscribing, you&apos;ll receive a welcome email with your member code. Simply mention your membership when booking at Hello Gorgeous Med Spa and choose any service up to $75 value - it&apos;s completely free!",
  },
  {
    q: "Is this really free? What&apos;s the catch?",
    a: "Yes, it&apos;s truly free! We want you to experience the quality of care at Hello Gorgeous Med Spa. We&apos;re confident you&apos;ll love it and become a returning client. Think of it as our way of saying &apos;welcome to the family.&apos;",
  },
  {
    q: "Can I use insurance with this?",
    a: "No Prior Authorization operates independently of insurance. This gives you freedom to access services without pre-approvals, referrals, or coverage limitations. You pay transparent, upfront prices.",
  },
  {
    q: "What happens after my free service?",
    a: "You&apos;ll continue enjoying member benefits including 10% off all services, priority booking, and exclusive perks. There&apos;s no obligation to continue, but most members love the convenience!",
  },
  {
    q: "Who are the providers?",
    a: "Hello Gorgeous Med Spa is staffed by board-certified nurse practitioners including Danielle Glazier, FNP-BC (founder) and Ryan Kent, FNP-BC, both with Full Practice Authority credentials.",
  },
];

export function SubscribeContent() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate submission - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-black pt-24" itemScope itemType="https://schema.org/WebPage">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden" aria-label="Subscribe for Free Service">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-black to-purple-900/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-2xl">🏥</span>
            <span className="text-white font-bold text-lg">No Prior Authorization</span>
            <span className="text-gray-400">×</span>
            <span className="text-fuchsia-400 font-bold">Hello Gorgeous</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Subscribe & Get a{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400">
                FREE Service
              </span>
              <span className="absolute -top-2 -right-8 text-2xl animate-bounce">🎁</span>
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl text-gray-300">
              Up to $75 Value
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join No Prior Authorization and experience healthcare the way it should be — 
            <span className="text-white font-semibold"> immediate, transparent, and hassle-free.</span>
          </p>

          {/* CTA Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-fuchsia-500/25 whitespace-nowrap"
                >
                  {isSubmitting ? "Subscribing..." : "Get FREE Service →"}
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                No credit card required • Cancel anytime • Instant access
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <span className="text-4xl mb-3 block">🎉</span>
              <h3 className="text-xl font-bold text-white mb-2">Welcome to the Family!</h3>
              <p className="text-gray-300 mb-4">
                Check your email for your member code and instructions to claim your FREE service!
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition"
              >
                Book Your Free Service Now →
              </a>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: "👥", text: "2,500+ Members" },
              { icon: "⭐", text: "5-Star Rated" },
              { icon: "🔒", text: "HIPAA Compliant" },
              { icon: "✅", text: "Board Certified" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-gray-400">
                <span>{badge.icon}</span>
                <span className="text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is No Prior Authorization */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-fuchsia-950/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
                No Prior Authorization?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We&apos;re revolutionizing healthcare access. No more waiting weeks for insurance approvals, 
              no more referral runarounds, no more surprise bills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Problem */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span>😤</span> The Old Way (Frustrating)
              </h3>
              <ul className="space-y-3">
                {[
                  "Wait weeks for insurance approval",
                  "Need referrals from primary care",
                  "Surprise bills months later",
                  "Limited treatment options",
                  "Endless paperwork",
                  "Denied claims",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-400">
                    <span className="text-red-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span>😊</span> The NPA Way (Simple)
              </h3>
              <ul className="space-y-3">
                {[
                  "Book same-day appointments",
                  "No referrals needed - ever",
                  "Know your price upfront",
                  "Access all treatments",
                  "One simple membership",
                  "100% transparent",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-400">
                    <span className="text-green-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Member Benefits
            </h2>
            <p className="text-gray-400">
              More than just a subscription — it&apos;s a better way to access healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                  benefit.highlight
                    ? "bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/50"
                    : "bg-white/5 border-white/10 hover:border-fuchsia-500/30"
                }`}
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Services You Can Choose */}
      <section className="py-20 px-4 bg-gradient-to-b from-fuchsia-950/10 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-4">
              🎁 Your FREE Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Any Service Up to $75
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              As a new subscriber, pick ONE of these services completely FREE:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {freeServices.map((service) => (
              <div
                key={service.name}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition text-center group hover:bg-fuchsia-500/5"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition">{service.icon}</span>
                <p className="text-white font-medium text-sm mb-1">{service.name}</p>
                <p className="text-fuchsia-400 font-bold">{service.value}</p>
                <p className="text-green-400 text-xs mt-1">FREE</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            * Additional services available at member-discounted rates
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500" />
                )}
                
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Member Perks */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                ⭐ Ongoing Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Member Perks That Keep Giving
              </h2>
              <p className="text-gray-400 mb-6">
                Your free service is just the beginning. As a member, you&apos;ll enjoy exclusive 
                perks and savings on all future visits.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {memberPerks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2">
                    <span className="text-fuchsia-400">✓</span>
                    <span className="text-gray-300 text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/30">
                <div className="text-center mb-6">
                  <span className="text-5xl mb-4 block">💎</span>
                  <h3 className="text-2xl font-bold text-white mb-2">VIP Membership</h3>
                  <p className="text-gray-400">Unlock the full experience</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <span className="text-gray-300">Free Service Value</span>
                    <span className="text-fuchsia-400 font-bold">Up to $75</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <span className="text-gray-300">Ongoing Discount</span>
                    <span className="text-fuchsia-400 font-bold">10% Off</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <span className="text-gray-300">Priority Booking</span>
                    <span className="text-green-400 font-bold">✓ Included</span>
                  </div>
                </div>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
                >
                  Subscribe Now — It&apos;s Free to Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-white/5 transition"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <span className={`text-fuchsia-400 transition-transform flex-shrink-0 ${expandedFaq === index ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-fuchsia-950/20 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
              Healthcare Freedom?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands who&apos;ve ditched the insurance runaround. 
            Your free $75 service is waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-10 py-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-fuchsia-500/25 transform hover:scale-105"
            >
              🎁 Claim Your FREE Service →
            </button>
            <a
              href="tel:630-636-6193"
              className="px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
            >
              📞 Call 630-636-6193
            </a>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            Questions? Email us at{" "}
            <a href="mailto:hello@nopriorauthorization.com" className="text-fuchsia-400 hover:underline">
              hello@nopriorauthorization.com
            </a>
          </p>
        </div>
      </section>

      {/* Partner Locations */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-4">
            Redeem your free service at
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                <span className="text-2xl">💋</span>
              </div>
              <div>
                <p className="text-white font-bold">Hello Gorgeous Med Spa</p>
                <p className="text-gray-400 text-sm">74 W. Washington St, Oswego, IL 60543</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
