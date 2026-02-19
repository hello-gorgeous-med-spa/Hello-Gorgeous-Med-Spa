"use client";

import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

export function ExperienceSection() {
  return (
    <section className="bg-white">
      {/* First Split - Consultation Image Left */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/services/hg-consultation-setup.png"
              alt="Hello Gorgeous consultation experience with iPad and branded materials"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-black leading-tight">
              Where Precision Meets{" "}
              <span className="text-[#E6007E]">Artistry</span>
            </h2>
            <p className="mt-6 text-lg text-black/70 leading-relaxed">
              At Hello Gorgeous, we combine medical expertise with artistic vision.
              Every treatment is tailored to enhance your natural features while
              maintaining the highest standards of safety and care.
            </p>
            <p className="mt-4 text-lg text-black/70 leading-relaxed">
              Our approach is intentional — we believe in subtle enhancement that
              lets your confidence shine through, never overdone results.
            </p>
            <Link
              href={BOOKING_URL}
              className="mt-8 inline-flex items-center text-black font-semibold hover:text-[#E6007E] transition-colors"
            >
              <span className="relative">
                Book Your Consultation
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E6007E]" />
              </span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Second Split - VIP Card Right */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-black/10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-semibold text-black leading-tight">
              Your Journey,{" "}
              <span className="text-[#E6007E]">Personalized</span>
            </h2>
            <p className="mt-6 text-lg text-black/70 leading-relaxed">
              We don't believe in one-size-fits-all aesthetics. Your consultation
              is a collaborative experience where we listen to your goals, assess
              your unique features, and create a customized treatment plan.
            </p>
            <p className="mt-4 text-lg text-black/70 leading-relaxed">
              From your first visit to ongoing care, you'll experience the Hello
              Gorgeous difference — where medical excellence meets genuine
              connection.
            </p>
            <Link
              href="/your-journey"
              className="mt-8 inline-flex items-center text-black font-semibold hover:text-[#E6007E] transition-colors"
            >
              <span className="relative">
                Explore Your Journey
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E6007E]" />
              </span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-1 md:order-2 shadow-2xl">
            <Image
              src="/images/services/hg-vip-membership-card.png"
              alt="Hello Gorgeous VIP membership card with rose petals"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
