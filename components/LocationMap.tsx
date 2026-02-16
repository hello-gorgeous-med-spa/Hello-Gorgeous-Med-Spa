"use client";

import { FadeUp } from "./Section";
import { GoogleMapEmbed } from "./GoogleMapEmbed";
import { GeoInternalLinks } from "./GeoInternalLinks";
import { BOOKING_URL } from "@/lib/flows";
import { MAPS_DIRECTIONS_URL } from "@/lib/local-seo";
import { SITE } from "@/lib/seo";

export function LocationMap() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FDF7FA]">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">VISIT US</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-[#FF2D8E]">
              Our{" "}
              <span className="text-[#FF2D8E]">
                Location
              </span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Map */}
          <FadeUp delayMs={60}>
            <div className="h-full min-h-[300px] md:min-h-[400px]">
              <GoogleMapEmbed height="100%" className="h-full min-h-[300px]" loading="lazy" showDirectionsButton={false} />
            </div>
          </FadeUp>

          {/* Contact Info */}
          <FadeUp delayMs={120}>
            <div className="h-full rounded-xl border-2 border-black bg-white shadow-md p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#FF2D8E] mb-6">Hello Gorgeous Med Spa</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-[#FF2D8E] font-semibold group-hover:text-[#FF2D8E] transition">
                      {SITE.address.streetAddress}
                    </p>
                    <p className="text-[#FF2D8E]">
                      {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
                    </p>
                    <p className="text-[#FF2D8E] text-sm mt-1">Get Directions →</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-[#FF2D8E] font-semibold group-hover:text-[#FF2D8E] transition">
                      {SITE.phone}
                    </p>
                    <p className="text-[#FF2D8E]">Call or text us</p>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Hours</p>
                    <p className="text-[#FF2D8E]">By Appointment</p>
                    <p className="text-gray-500 text-sm">Botox Parties: Tue & Sat 6-9 PM</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-6 bg-pink-500 text-white font-semibold text-center rounded-full hover:bg-pink-600 transition shadow-lg shadow-pink-500/25"
                >
                  Book Appointment
                </a>
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-6 border border-white/20 text-white font-semibold text-center rounded-full hover:bg-white/10 transition"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Serving Areas + Geo Internal Links */}
        <FadeUp delayMs={180}>
          <div className="mt-10 text-center space-y-4">
            <p className="text-gray-400">
              Proudly serving{" "}
              <span className="text-white">Oswego</span>,{" "}
              <span className="text-white">Naperville</span>,{" "}
              <span className="text-white">Aurora</span>,{" "}
              <span className="text-white">Plainfield</span>,{" "}
              <span className="text-white">Yorkville</span>, and surrounding areas
            </p>
            <GeoInternalLinks />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
