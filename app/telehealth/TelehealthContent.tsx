"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";

const telehealthServices = [
  {
    id: "weight-loss",
    name: "Weight Loss Consultation",
    description: "Initial consultation or follow-up for GLP-1 medications (Semaglutide, Tirzepatide). Discuss progress, adjust dosing, and address concerns.",
    duration: "15-30 min",
    price: "$75",
    icon: "⚖️",
    available: true,
  },
  {
    id: "hormone-followup",
    name: "Hormone Therapy Follow-Up",
    description: "Review lab results, discuss symptoms, and optimize your Biote hormone therapy protocol.",
    duration: "15-20 min",
    price: "$50",
    icon: "🧬",
    available: true,
  },
  {
    id: "lab-review",
    name: "Lab Results Review",
    description: "Comprehensive review of your lab work with personalized recommendations and next steps.",
    duration: "15 min",
    price: "$50",
    icon: "🔬",
    available: true,
  },
  {
    id: "new-patient",
    name: "New Patient Consultation",
    description: "Initial virtual consultation to discuss your health goals and determine the best treatment plan.",
    duration: "30 min",
    price: "$99",
    icon: "👋",
    available: true,
  },
  {
    id: "medication-refill",
    name: "Medication Refill Request",
    description: "Quick check-in for established patients needing prescription refills.",
    duration: "10 min",
    price: "$35",
    icon: "💊",
    available: true,
  },
  {
    id: "peptide-consult",
    name: "Peptide Therapy Consultation",
    description: "Discuss peptide options like BPC-157, Sermorelin, and more for your wellness goals.",
    duration: "20 min",
    price: "$75",
    icon: "🧪",
    available: true,
  },
];

const benefits = [
  {
    icon: "🏠",
    title: "From Your Home",
    description: "No travel, no waiting room. Connect from anywhere.",
  },
  {
    icon: "🔒",
    title: "HIPAA Compliant",
    description: "Secure, encrypted video platform protects your privacy.",
  },
  {
    icon: "📱",
    title: "Any Device",
    description: "Works on phone, tablet, or computer. No app download needed.",
  },
  {
    icon: "⚡",
    title: "Same-Day Available",
    description: "Often available for same-day or next-day appointments.",
  },
];

const faqs = [
  {
    q: "How do I join my telehealth appointment?",
    a: "You'll receive a link via email or text before your appointment. Simply click the link at your scheduled time—no app download required. Make sure you have a stable internet connection and your camera/microphone enabled.",
  },
  {
    q: "What do I need for a telehealth visit?",
    a: "A smartphone, tablet, or computer with a camera and microphone. A quiet, private space with good lighting. Have any relevant information ready (medications, symptoms, questions).",
  },
  {
    q: "Is telehealth as effective as in-person visits?",
    a: "For many services like medication management, follow-ups, and consultations, telehealth is equally effective. Some treatments require in-person visits, and Ryan will let you know if that's needed.",
  },
  {
    q: "Can I get prescriptions through telehealth?",
    a: "Yes! Ryan can prescribe medications during telehealth visits when clinically appropriate. Prescriptions are sent directly to your preferred pharmacy or our compounding pharmacy.",
  },
  {
    q: "Is my telehealth visit private and secure?",
    a: "Absolutely. We use HIPAA-compliant video technology with end-to-end encryption. Your visit is just as private as an in-office appointment.",
  },
  {
    q: "What if I have technical issues?",
    a: "Call us at 630-636-6193 and we'll help troubleshoot. If we can't resolve it, we'll reschedule at no charge.",
  },
];

const DOXY_URL = "https://doxy.me/ryankent";

export function TelehealthContent() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — black, white text, brand pink only */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <p className="text-[#E6007E] text-lg md:text-xl font-semibold mb-4 tracking-wide uppercase">
                HIPAA Compliant Virtual Care
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Telehealth{" "}
                <span className="text-[#E6007E]">Virtual Visits</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Get expert medical care from the comfort of your home. Connect with Ryan Kent, FNP-BC for consultations, follow-ups, and prescription management.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
                  Book Telehealth Visit
                </CTA>
                <a
                  href={DOXY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
                >
                  Join Video Visit Now
                </a>
              </div>
              <p className="mt-4 text-white/60 text-sm">No download required</p>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="relative">
                <Image
                  src="/images/rx/hg-ryan-kent-rx-authority.png"
                  alt="Ryan Kent FNP-BC - Telehealth and full prescriptive authority at Hello Gorgeous Med Spa"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Join appointment strip */}
      <div className="bg-[#E6007E] py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <span className="text-white font-semibold">Have an appointment?</span>
            <a
              href={DOXY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#E6007E] font-bold hover:bg-black hover:text-white transition-colors"
            >
              Join Video Visit Now
            </a>
          </div>
        </div>
      </div>

      {/* Provider card — white card on light bg */}
      <div className="bg-white border-t border-black/10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <FadeUp>
            <div className="rounded-2xl border-2 border-black p-8 md:p-10 bg-white shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-4xl mb-4">
                    👨‍⚕️
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6007E]/10 border border-[#E6007E]/30 text-[#E6007E] text-sm font-medium">
                    Available for Telehealth
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1">Ryan Kent</h2>
                  <p className="text-[#E6007E] font-semibold mb-6">FNP-BC | Full Practice Authority NP</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E6007E] mt-0.5">✓</span>
                      <div>
                        <p className="text-black font-medium">Board Certified Family Nurse Practitioner</p>
                        <p className="text-black/60 text-sm">FNP-BC credentialed through ANCC</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E6007E] mt-0.5">✓</span>
                      <div>
                        <p className="text-black font-medium">Full Practice Authority</p>
                        <p className="text-black/60 text-sm">Independent prescriptive authority in Illinois</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E6007E] mt-0.5">✓</span>
                      <div>
                        <p className="text-black font-medium">Specializations</p>
                        <p className="text-black/60 text-sm">Weight Management, Hormone Optimization, Regenerative Medicine</p>
                      </div>
                    </li>
                  </ul>
                  <div className="p-4 rounded-xl bg-black/5 border border-black/10 mb-6">
                    <p className="text-black/80 text-sm italic">
                      &ldquo;Telehealth allows me to provide the same high-quality care you&apos;d receive in-office, with the convenience of connecting from wherever you are. I&apos;m committed to making healthcare accessible and personalized for every patient.&rdquo;
                    </p>
                  </div>
                  <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
                    Book with Ryan
                  </CTA>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Benefits — white section, black text */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Why Choose <span className="text-[#E6007E]">Telehealth?</span>
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <FadeUp key={benefit.title} delayMs={i * 60}>
                <div className="p-6 rounded-2xl border-2 border-white/20 bg-white/5 text-center hover:border-[#E6007E]/50 transition h-full">
                  <span className="text-4xl mb-4 block">{benefit.icon}</span>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Services — white section */}
      <div className="bg-white py-16 md:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
              Telehealth <span className="text-[#E6007E]">Services</span>
            </h2>
            <p className="text-black/70 text-center max-w-2xl mx-auto mb-12">
              Services available via secure video visit with Ryan Kent, FNP-BC
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {telehealthServices.map((service, i) => (
              <FadeUp key={service.id} delayMs={i * 40}>
                <div className="p-6 rounded-2xl border-2 border-black/10 bg-white hover:border-[#E6007E]/30 transition h-full flex flex-col shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="text-black font-semibold">{service.name}</h3>
                      <p className="text-black/60 text-sm">{service.duration}</p>
                    </div>
                  </div>
                  <p className="text-black/80 text-sm flex-1 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[#E6007E] font-bold">{service.price}</span>
                    <CTA href={BOOKING_URL} variant="outline" className="!px-4 !py-2 !text-sm">
                      Book Now
                    </CTA>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* How it works — black strip */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              How Telehealth <span className="text-[#E6007E]">Works</span>
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Book Online", desc: "Schedule your telehealth visit through our booking system", icon: "📅" },
              { step: "2", title: "Get Your Link", desc: "Receive a secure video link via email/text", icon: "📧" },
              { step: "3", title: "Connect", desc: "Click the link at your appointment time to join", icon: "🖥️" },
              { step: "4", title: "Get Care", desc: "Meet with Ryan, get your treatment plan & prescriptions", icon: "✅" },
            ].map((item, i) => (
              <FadeUp key={item.step} delayMs={i * 60}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#E6007E] text-white text-2xl flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-[#E6007E] text-sm font-semibold mb-1">Step {item.step}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Prepare for visit — white */}
      <div className="bg-white py-16 md:py-24 border-t border-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <FadeUp>
            <div className="rounded-2xl border-2 border-black/10 bg-white p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">
                Prepare for Your Visit
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[#E6007E] font-semibold mb-3">You&apos;ll Need:</h3>
                  <ul className="space-y-2">
                    {[
                      "Device with camera & microphone",
                      "Stable internet connection",
                      "Quiet, private space",
                      "Good lighting on your face",
                      "List of current medications",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-black text-sm">
                        <span className="text-[#E6007E]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#E6007E] font-semibold mb-3">Have Ready:</h3>
                  <ul className="space-y-2">
                    {[
                      "Questions for Ryan",
                      "Recent lab results (if applicable)",
                      "Pharmacy information",
                      "Insurance card (if using)",
                      "Payment method",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-black text-sm">
                        <span className="text-[#E6007E]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* FAQs — white */}
      <div className="bg-white py-16 md:py-24 border-t border-black/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <FadeUp>
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Telehealth <span className="text-[#E6007E]">FAQs</span>
            </h2>
          </FadeUp>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delayMs={i * 30}>
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full text-left p-5 rounded-xl border-2 border-black/10 bg-white hover:border-[#E6007E]/30 transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-black font-medium">{faq.q}</span>
                    <span className="text-[#E6007E] text-xl flex-shrink-0">
                      {expandedFaq === i ? "−" : "+"}
                    </span>
                  </div>
                  {expandedFaq === i && (
                    <p className="mt-3 text-black/70 text-sm">{faq.a}</p>
                  )}
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Platform — black strip */}
      <div className="bg-black py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-2xl">🔒</span>
              <span className="text-white font-semibold">Powered by Doxy.me</span>
            </div>
            <p className="text-white/70 text-sm mb-6">
              We use Doxy.me, a HIPAA-compliant telemedicine platform trusted by over 1 million healthcare providers. Your visit is encrypted end-to-end, ensuring complete privacy and security. No downloads required—just click your link and connect.
            </p>
            <a
              href={DOXY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#E6007E] text-[#E6007E] font-semibold hover:bg-[#E6007E] hover:text-white transition-colors"
            >
              Join Ryan&apos;s Waiting Room
            </a>
          </FadeUp>
        </div>
      </div>

      {/* CTA — black */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Your Virtual Visit?
            </h2>
            <p className="text-white/80 mb-8">
              Book your telehealth appointment with Ryan Kent, FNP-BC today. Same-day appointments often available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
                Book Telehealth Visit
              </CTA>
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
              >
                630-636-6193
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
