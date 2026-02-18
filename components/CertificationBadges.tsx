"use client";

import Image from "next/image";

const certifications = [
  {
    name: "Allergan Partner",
    description: "Certified Botox & Juvederm Provider",
    icon: "💉",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Biote Certified",
    description: "Hormone Optimization Specialist",
    icon: "⚖️",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Galderma Trained",
    description: "Dysport & Restylane Expert",
    icon: "✨",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "5-Star Rated",
    description: "100+ Verified Google Reviews",
    icon: "⭐",
    color: "from-amber-500 to-orange-500",
  },
];

const trustIndicators = [
  { label: "Licensed Medical Professionals", icon: "🏥" },
  { label: "HIPAA Compliant", icon: "🔒" },
  { label: "FDA-Approved Products Only", icon: "✅" },
  { label: "Locally Owned & Operated", icon: "💗" },
];

export function CertificationBadges() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#FF2D8E] text-sm font-bold tracking-wider uppercase mb-2">
            Trusted & Certified
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Why Choose <span className="text-[#FF2D8E]">Hello Gorgeous?</span>
          </h2>
        </div>

        {/* Certification Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-3xl shadow-lg`}>
                {cert.icon}
              </div>
              <h3 className="font-bold text-black text-sm md:text-base">{cert.name}</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-1">{cert.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators Bar */}
        <div className="bg-black rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-white">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Logos (placeholder for actual logos) */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-6">Trusted Partners & Product Lines</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <span className="text-2xl font-bold text-gray-400">ALLERGAN</span>
            <span className="text-2xl font-bold text-gray-400">GALDERMA</span>
            <span className="text-2xl font-bold text-gray-400">BIOTE</span>
            <span className="text-2xl font-bold text-gray-400">SKINMEDICA</span>
            <span className="text-2xl font-bold text-gray-400">OLYMPIA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
