"use client";

import { useState } from "react";
import { FadeUp, Section } from "@/components/Section";
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
    <>
      {/* Hero */}
      <Section className="relative py-20 bg-gradient-to-b from-blue-950/30 via-purple-950/20 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF2D8E]/20 rounded-full blur-3xl" />
        </div>
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#FF2D8E]/20 text-[#FF2D8E] text-sm font-medium mb-4">
              🖥️ HIPAA Compliant Virtual Care
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Telehealth{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                Virtual Visits
              </span>
            </h1>
            <p className="text-black text-lg mb-8">
              Get expert medical care from the comfort of your home. Connect with
              Ryan Kent, FNP-BC for consultations, follow-ups, and prescription management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold hover:opacity-90 transition"
              >
                Book Telehealth Visit →
              </a>
              <a
                href={DOXY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold hover:opacity-90 transition animate-pulse"
              >
                🖥️ Join Your Appointment
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Join Appointment Banner */}
      <Section className="py-6 bg-gradient-to-r from-fuchsia-600/20 to-pink-500/20 border-y border-[#FF2D8E]/30">
        <FadeUp>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#FF2D8E] animate-pulse" />
              <span className="text-white font-semibold">Have an Appointment?</span>
            </div>
            <a
              href={DOXY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#FF2D8E] text-white font-bold hover:opacity-90 transition flex items-center gap-2"
            >
              <span className="text-xl">🖥️</span>
              Join Video Visit Now →
            </a>
            <span className="text-black text-sm">No download required</span>
          </div>
        </FadeUp>
      </Section>

      {/* Provider Card */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-pink-500/10 rounded-3xl border border-blue-500/20 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-blue-950/50 to-pink-950/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mx-auto mb-4 text-6xl">
                        👨‍⚕️
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/20 border border-[#FF2D8E]/30">
                        <span className="w-2 h-2 rounded-full bg-[#FF2D8E] animate-pulse" />
                        <span className="text-[#FF2D8E] text-sm font-medium">Available for Telehealth</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-8">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-1">Ryan Kent</h2>
                    <p className="text-blue-400 font-semibold">FNP-BC | Full Practice Authority NP</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-[#FF2D8E]">✓</span>
                      <div>
                        <p className="text-white font-medium">Board Certified Family Nurse Practitioner</p>
                        <p className="text-black text-sm">FNP-BC credentialed through ANCC</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#FF2D8E]">✓</span>
                      <div>
                        <p className="text-white font-medium">Full Practice Authority</p>
                        <p className="text-black text-sm">Independent prescriptive authority in Illinois</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#FF2D8E]">✓</span>
                      <div>
                        <p className="text-white font-medium">Specializations</p>
                        <p className="text-black text-sm">Weight Management, Hormone Optimization, Regenerative Medicine</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white border border-black mb-6">
                    <p className="text-black text-sm italic">
                      &ldquo;Telehealth allows me to provide the same high-quality care you&apos;d receive in-office, 
                      with the convenience of connecting from wherever you are. I&apos;m committed to 
                      making healthcare accessible and personalized for every patient.&rdquo;
                    </p>
                  </div>
                  
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold text-center hover:opacity-90 transition"
                  >
                    Book with Ryan →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Benefits */}
      <Section className="py-16 bg-gradient-to-b from-black to-pink-950/10">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Telehealth?
            </h2>
          </div>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <FadeUp key={benefit.title} delayMs={i * 60}>
              <div className="p-6 rounded-2xl bg-white border border-black text-center hover:border-[#FF2D8E]/30 transition h-full">
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-black text-sm">{benefit.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Telehealth Services
            </h2>
            <p className="text-black">
              Services available via secure video visit with Ryan Kent, FNP-BC
            </p>
          </div>
        </FadeUp>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {telehealthServices.map((service, i) => (
            <FadeUp key={service.id} delayMs={i * 40}>
              <div className="p-6 rounded-2xl bg-white border border-black hover:border-[#FF2D8E]/30 transition h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{service.name}</h3>
                    <p className="text-black text-sm">{service.duration}</p>
                  </div>
                </div>
                <p className="text-black text-sm flex-1 mb-4">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[#FF2D8E] font-bold">{service.price}</span>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#FF2D8E]/20 text-[#FF2D8E] text-sm font-medium hover:bg-[#FF2D8E]/30 transition"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-16 bg-gradient-to-b from-black to-blue-950/10">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How Telehealth Works
            </h2>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Book Online", desc: "Schedule your telehealth visit through our booking system", icon: "📅" },
            { step: "2", title: "Get Your Link", desc: "Receive a secure video link via email/text", icon: "📧" },
            { step: "3", title: "Connect", desc: "Click the link at your appointment time to join", icon: "🖥️" },
            { step: "4", title: "Get Care", desc: "Meet with Ryan, get your treatment plan & prescriptions", icon: "✅" },
          ].map((item, i) => (
            <FadeUp key={item.step} delayMs={i * 60}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-[#FF2D8E] text-sm font-medium mb-1">Step {item.step}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-black text-sm">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* What You'll Need */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                📋 Prepare for Your Visit
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[#FF2D8E] font-semibold mb-3">You&apos;ll Need:</h3>
                  <ul className="space-y-2">
                    {[
                      "Device with camera & microphone",
                      "Stable internet connection",
                      "Quiet, private space",
                      "Good lighting on your face",
                      "List of current medications",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-black text-sm">
                        <span className="text-[#FF2D8E]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">Have Ready:</h3>
                  <ul className="space-y-2">
                    {[
                      "Questions for Ryan",
                      "Recent lab results (if applicable)",
                      "Pharmacy information",
                      "Insurance card (if using)",
                      "Payment method",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-black text-sm">
                        <span className="text-blue-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* FAQs */}
      <Section className="py-16 bg-gradient-to-b from-black to-pink-950/10">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Telehealth FAQs
            </h2>
          </div>
        </FadeUp>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delayMs={i * 40}>
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full text-left p-4 rounded-xl bg-white border border-black hover:border-[#FF2D8E]/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <span className="text-black text-xl flex-shrink-0">
                    {expandedFaq === i ? "−" : "+"}
                  </span>
                </div>
                {expandedFaq === i && (
                  <p className="mt-3 text-black text-sm">{faq.a}</p>
                )}
              </button>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Platform Info */}
      <Section className="py-12 bg-black border-t border-black">
        <FadeUp>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-black mb-6">
              <span className="text-2xl">🔒</span>
              <span className="text-white font-semibold">Powered by Doxy.me</span>
            </div>
            <p className="text-black text-sm mb-6">
              We use Doxy.me, a HIPAA-compliant telemedicine platform trusted by over 1 million 
              healthcare providers. Your visit is encrypted end-to-end, ensuring complete privacy 
              and security. No downloads required—just click your link and connect.
            </p>
            <a
              href={DOXY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF2D8E]/20 border border-[#FF2D8E]/30 text-[#FF2D8E] font-medium hover:bg-[#FF2D8E]/30 transition"
            >
              <span>🖥️</span>
              Join Ryan&apos;s Waiting Room →
            </a>
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-b from-black to-pink-950/20">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Your Virtual Visit?
            </h2>
            <p className="text-black mb-6">
              Book your telehealth appointment with Ryan Kent, FNP-BC today.
              Same-day appointments often available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold hover:opacity-90 transition"
              >
                Book Telehealth Visit →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white border border-black text-white font-medium hover:bg-white transition"
              >
                📞 630-636-6193
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
