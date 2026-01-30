"use client";

import { FadeUp } from "./Section";

const ADDRESS = {
  street: "74 W. Washington St",
  city: "Oswego",
  state: "IL",
  zip: "60543",
  full: "74 W. Washington St, Oswego, IL 60543",
  phone: "630-636-6193",
  email: "hello@hellogorgeousmedspa.com",
};

// Google Maps embed URL (encoded address)
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.8!2d-88.3516!3d41.6828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880ef9a8f7c00001%3A0x1234567890abcdef!2s74%20W%20Washington%20St%2C%20Oswego%2C%20IL%2060543!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus`;

const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS.full)}`;

export function LocationMap() {
  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-pink-400 text-lg font-medium tracking-wide">VISIT US</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Location
              </span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Map */}
          <FadeUp delayMs={60}>
            <div className="h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden border border-pink-500/20">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hello Gorgeous Med Spa Location"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Contact Info */}
          <FadeUp delayMs={120}>
            <div className="h-full rounded-2xl border border-pink-500/20 bg-gradient-to-br from-black to-pink-950/20 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-6">Hello Gorgeous Med Spa</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-pink-400 transition">
                      {ADDRESS.street}
                    </p>
                    <p className="text-gray-400">
                      {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
                    </p>
                    <p className="text-pink-400 text-sm mt-1">Get Directions →</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${ADDRESS.phone}`}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-pink-400 transition">
                      {ADDRESS.phone}
                    </p>
                    <p className="text-gray-400">Call or text us</p>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Hours</p>
                    <p className="text-gray-400">By Appointment</p>
                    <p className="text-gray-500 text-sm">Botox Parties: Tue & Sat 6-9 PM</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-6 bg-pink-500 text-white font-semibold text-center rounded-full hover:bg-pink-600 transition shadow-lg shadow-pink-500/25"
                >
                  Book Appointment
                </a>
                <a
                  href={MAPS_LINK}
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

        {/* Serving Areas */}
        <FadeUp delayMs={180}>
          <div className="mt-10 text-center">
            <p className="text-gray-400">
              Proudly serving{" "}
              <span className="text-white">Oswego</span>,{" "}
              <span className="text-white">Naperville</span>,{" "}
              <span className="text-white">Aurora</span>,{" "}
              <span className="text-white">Plainfield</span>, and surrounding areas
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
