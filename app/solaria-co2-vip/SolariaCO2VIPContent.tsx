"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE } from "@/lib/seo";

const AGE_RANGES = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46-55", label: "46-55" },
  { value: "56+", label: "56+" },
];

const SKIN_CONCERNS = [
  { value: "acne_scars", label: "Acne Scars" },
  { value: "deep_wrinkles", label: "Deep Wrinkles" },
  { value: "fine_lines", label: "Fine Lines" },
  { value: "skin_laxity", label: "Skin Laxity" },
  { value: "texture_tone", label: "Texture & Tone" },
  { value: "sun_damage", label: "Sun Damage" },
  { value: "hyperpigmentation", label: "Hyperpigmentation" },
  { value: "enlarged_pores", label: "Enlarged Pores" },
];

export function SolariaCO2VIPContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age_range: "",
    concerns: [] as string[],
    prior_co2: "",
    downtime_ok: "",
    investment_ready: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConcernToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(value)
        ? prev.concerns.filter((c) => c !== value)
        : [...prev.concerns, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.downtime_ok) {
      setError("Please confirm you understand the downtime requirements.");
      return;
    }

    if (!formData.investment_ready) {
      setError("Please confirm you understand the investment level.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vip-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign: "co2_solaria",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age_range: formData.age_range,
          concerns: formData.concerns,
          prior_treatment: formData.prior_co2 === "yes",
          downtime_ok: formData.downtime_ok === "yes",
          investment_ready: formData.investment_ready === "yes",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Track conversion event
      if (typeof window !== "undefined") {
        // Google Analytics
        if ((window as any).gtag) {
          (window as any).gtag("event", "CO2_VIP_SUBMISSION", {
            event_category: "Lead",
            event_label: "Solaria CO2 VIP Waitlist",
          });
        }
        // Meta Pixel
        if ((window as any).fbq) {
          (window as any).fbq("track", "Lead", {
            content_name: "Solaria CO2 VIP Waitlist",
          });
        }
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 text-4xl mb-6">
              ✓
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              You&apos;re on the VIP List
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for joining the Solaria CO₂ VIP Early Access list.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-black mb-4">What Happens Next?</h2>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold">1.</span>
                <span>Check your email for a confirmation message</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold">2.</span>
                <span>We&apos;ll contact qualified VIP members to schedule consultations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 font-bold">3.</span>
                <span>Your $100 VIP credit will be applied to your first treatment</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-full transition-colors"
            >
              Return Home
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-colors"
            >
              Call Us: {SITE.phone}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
              <span>VIP EARLY ACCESS</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            Solaria CO₂ Laser
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            VIP Early Access
          </p>
          <p className="text-lg text-pink-500 font-medium">
            Limited Launch Access | Priority Booking | $100 Off
          </p>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            About Solaria CO₂ Treatment
          </h2>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              <strong>Solaria CO₂</strong> is a fractional ablative resurfacing laser 
              designed to stimulate deep collagen remodeling and improve:
            </p>

            <ul className="grid sm:grid-cols-2 gap-2 my-6 list-none pl-0">
              {["Acne scars", "Deep wrinkles", "Skin laxity", "Texture & tone", "Sun damage", "Hyperpigmentation"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 border-l-4 border-pink-500 p-4 my-6">
              <p className="font-semibold text-black mb-1">Important to Know:</p>
              <p className="text-gray-600 mb-0">
                This is an advanced resurfacing treatment requiring <strong>5–7 days of social downtime</strong>. 
                A consultation is required prior to booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-3">
              Request VIP Access
            </h2>
            <p className="text-gray-600">
              Complete the form below to join our exclusive VIP waitlist
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-5 mb-8">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                Contact Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="(630) 555-0123"
                />
              </div>
            </div>

            {/* Qualification Questions */}
            <div className="space-y-6 mb-8">
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                Qualification Questions
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  value={formData.age_range}
                  onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                >
                  <option value="">Select age range</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Skin Concerns (select all that apply)
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {SKIN_CONCERNS.map((concern) => (
                    <label
                      key={concern.value}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                        formData.concerns.includes(concern.value)
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.concerns.includes(concern.value)}
                        onChange={() => handleConcernToggle(concern.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.concerns.includes(concern.value)
                            ? "border-pink-500 bg-pink-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.concerns.includes(concern.value) && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-gray-700">{concern.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you had CO₂ laser treatment before?
                </label>
                <div className="flex gap-4">
                  {["yes", "no"].map((option) => (
                    <label
                      key={option}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                        formData.prior_co2 === option
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="prior_co2"
                        value={option}
                        checked={formData.prior_co2 === option}
                        onChange={(e) => setFormData({ ...formData, prior_co2: e.target.value })}
                        className="sr-only"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you comfortable with 5–7 days of social downtime? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  CO₂ resurfacing requires time for healing. Redness and peeling are normal.
                </p>
                <div className="flex gap-4">
                  {["yes", "no"].map((option) => (
                    <label
                      key={option}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                        formData.downtime_ok === option
                          ? option === "yes" ? "border-green-500 bg-green-50" : "border-gray-400 bg-gray-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="downtime_ok"
                        value={option}
                        checked={formData.downtime_ok === option}
                        onChange={(e) => setFormData({ ...formData, downtime_ok: e.target.value })}
                        className="sr-only"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you prepared for an investment starting at $1,500+? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  CO₂ laser is a premium treatment. Pricing varies based on treatment area and depth.
                </p>
                <div className="flex gap-4">
                  {["yes", "no"].map((option) => (
                    <label
                      key={option}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                        formData.investment_ready === option
                          ? option === "yes" ? "border-green-500 bg-green-50" : "border-gray-400 bg-gray-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="investment_ready"
                        value={option}
                        checked={formData.investment_ready === option}
                        onChange={(e) => setFormData({ ...formData, investment_ready: e.target.value })}
                        className="sr-only"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold text-lg rounded-xl transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Request VIP Access"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By submitting, you agree to receive communications from Hello Gorgeous Med Spa.
              We respect your privacy and will never share your information.
            </p>
          </form>
        </div>
      </section>

      {/* VIP Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-black text-center mb-10">
            VIP Member Benefits
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Priority Booking",
                description: "Schedule before public launch",
              },
              {
                icon: "💰",
                title: "$100 Off",
                description: "Applied to your first treatment",
              },
              {
                icon: "⏰",
                title: "Early Access",
                description: "First to know about launch dates",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-lg font-bold text-black mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-2">Questions?</p>
          <p className="text-xl font-bold text-pink-400 mb-4">Hello Gorgeous Med Spa</p>
          <p className="text-gray-300 mb-6">74 W. Washington Street, Oswego, IL 60543</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <span>📞</span>
              <span>Call: {SITE.phone}</span>
            </a>
            <a
              href="sms:630-881-3398"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <span>💬</span>
              <span>Text: 630-881-3398</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
