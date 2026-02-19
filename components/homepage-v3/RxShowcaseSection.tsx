"use client";

import Link from "next/link";
import Image from "next/image";

export function RxShowcaseSection() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* First Row - RX Authority */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Image */}
          <div className="relative">
            <Image
              src="/images/rx/hg-ryan-kent-rx-authority.png"
              alt="Ryan Kent, FNP-BC - Full Practice Authority prescriptions at Hello Gorgeous Med Spa"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-[#E6007E] text-white px-6 py-3 rounded-xl font-bold text-sm">
              Full Prescriptive Authority
            </div>
          </div>

          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider">Hello Gorgeous RX™</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Medical Authority You Can{" "}
              <span className="text-[#E6007E]">Trust</span>
            </h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Ryan Kent, FNP-BC brings full practice authority to Hello Gorgeous Med Spa. 
              This means we can prescribe, evaluate, and manage your complete wellness journey 
              — from medical weight loss to hormone optimization.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-2xl">GLP-1</p>
                <p className="text-white/70 text-sm">Semaglutide & Tirzepatide</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-2xl">HRT</p>
                <p className="text-white/70 text-sm">Hormone Replacement</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-2xl">TRT</p>
                <p className="text-white/70 text-sm">Testosterone Therapy</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-2xl">RX</p>
                <p className="text-white/70 text-sm">Prescription Skincare</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rx"
                className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Explore RX Programs
              </Link>
              <Link
                href="/rx/metabolic"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
              >
                Medical Weight Loss
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row - Peptides/Regenerative Medicine (Reversed) */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider">Longevity Medicine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Regenerative{" "}
              <span className="text-[#E6007E]">Peptide Therapy</span>
            </h2>
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Unlock your body's natural healing potential with cutting-edge peptide protocols. 
              From tissue repair to anti-aging, our regenerative medicine programs are designed 
              for optimal cellular function and longevity.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-lg">BPC-157</p>
                <p className="text-white/70 text-sm">Tissue Repair & Healing</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-lg">Sermorelin</p>
                <p className="text-white/70 text-sm">Growth Hormone Support</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-lg">CJC-1295</p>
                <p className="text-white/70 text-sm">Anti-Aging & Recovery</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-[#E6007E] font-bold text-lg">NAD+</p>
                <p className="text-white/70 text-sm">Cellular Energy & Repair</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/rx/peptides"
                className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Explore Peptides
              </Link>
              <Link
                href="/rx"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
              >
                All RX Programs
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <Image
              src="/images/services/hg-peptides-rx.png"
              alt="Regenerative Medicine Authority - BPC-157, Sermorelin, CJC-1295, Ipamorelin peptide therapy"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#E6007E] text-white px-6 py-3 rounded-xl font-bold text-sm">
              Regenerative Medicine Authority
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
