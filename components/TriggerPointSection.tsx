"use client";

import { useEffect, useState } from "react";

import { FadeUp } from "./Section";
import { StreamVideo } from "./StreamVideo";
import { BOOKING_URL } from "@/lib/flows";

function getYoutubeEmbedId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
  return m?.[1] ?? null;
}

const benefits = [
  {
    icon: "⚡",
    title: "Instant Relief",
    description: "Feel the difference immediately after treatment",
  },
  {
    icon: "🎯",
    title: "Targeted Treatment",
    description: "Precise injections directly into muscle knots",
  },
  {
    icon: "💊",
    title: "No Downtime",
    description: "Return to normal activities right away",
  },
  {
    icon: "🔄",
    title: "Long-Lasting",
    description: "Relief that lasts weeks to months",
  },
];

const treatedAreas = [
  "Neck & Shoulders",
  "Upper Back",
  "Lower Back",
  "Headache Trigger Points",
  "Hip & Glutes",
  "Jaw (TMJ)",
];

const conditions = [
  "Chronic muscle pain",
  "Tension headaches",
  "Fibromyalgia",
  "Sports injuries",
  "Desk/computer strain",
  "Stress-related tension",
];

export function TriggerPointSection() {
  const [streamUid, setStreamUid] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_TRIGGER_POINT_VIDEO_URL ?? "";
    if (envUrl) {
      setVideoUrl(envUrl);
      return;
    }
    Promise.all([
      fetch("/api/config?category=website").then((r) => r.json()),
      fetch("/api/media?use_case=trigger_point").then((r) => r.json()),
    ])
      .then(([configRes, mediaRes]) => {
        const uid = configRes?.config?.website?.trigger_point_stream_uid;
        const url = configRes?.config?.website?.trigger_point_video_url;
        const media = mediaRes?.media?.[0];
        setStreamUid(typeof uid === "string" ? uid : media?.stream_uid ?? null);
        setVideoUrl(typeof url === "string" ? url : "");
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-sm font-bold mb-4">
              🎯 Pain Relief Specialists
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-black mb-4">
              Trigger Point <span className="text-[#FF2D8E]">Injections</span>
            </h2>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Tired of living with muscle pain? Our trigger point injections provide 
              fast, targeted relief for chronic pain and muscle tension.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Video Section */}
          <FadeUp delayMs={60}>
            <div className="relative rounded-2xl overflow-hidden border-2 border-black bg-white">
              {streamUid ? (
                <div className="aspect-video relative">
                  <StreamVideo uid={streamUid} loading="lazy" className="w-full h-full" />
                </div>
              ) : videoUrl ? (
                <div className="aspect-video relative">
                  {getYoutubeEmbedId(videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeEmbedId(videoUrl)}`}
                      title="Trigger Point Injections"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                <div className="aspect-video relative flex items-center justify-center bg-[#FF2D8E]/10">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-[#FF2D8E]/20 border-2 border-[#FF2D8E] flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl">🎬</span>
                    </div>
                    <p className="text-black font-bold mb-2">Video Coming Soon</p>
                    <p className="text-black text-sm">
                      See trigger point injections in action
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Info Section */}
          <FadeUp delayMs={120}>
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">
                What Are Trigger Point Injections?
              </h3>
              <p className="text-black mb-6">
                Trigger points are tight knots in your muscles that cause pain—sometimes 
                in areas far from the knot itself. Our injections deliver medication 
                directly into these problem areas, releasing tension and providing 
                rapid relief.
              </p>
              
              <div className="p-4 rounded-xl border-2 border-black mb-6">
                <p className="text-black font-bold mb-2">What&apos;s Injected?</p>
                <p className="text-black text-sm">
                  A combination of local anesthetic (lidocaine) and sometimes a small 
                  amount of corticosteroid to reduce inflammation. Some patients opt 
                  for &quot;dry needling&quot; without medication.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {treatedAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-full border-2 border-black text-black text-sm hover:border-[#FF2D8E] transition"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[#FF2D8E] text-white font-bold hover:bg-black transition"
              >
                <span className="text-xl">🎯</span>
                Book Trigger Point Treatment
              </a>
            </div>
          </FadeUp>
        </div>

        {/* Benefits Grid */}
        <FadeUp delayMs={180}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl border-2 border-black bg-white hover:border-[#FF2D8E] transition text-center"
              >
                <span className="text-3xl mb-3 block">{benefit.icon}</span>
                <h4 className="text-black font-bold mb-1">{benefit.title}</h4>
                <p className="text-black text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Conditions Treated */}
        <FadeUp delayMs={240}>
          <div className="p-8 rounded-2xl border-2 border-black bg-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">
                  Conditions We Treat
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center gap-2">
                      <span className="text-[#FF2D8E]">✓</span>
                      <span className="text-black text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-black mb-4">
                  Performed by <span className="text-[#FF2D8E] font-bold">Ryan Kent, FNP-BC</span>
                  <br />
                  <span className="text-sm">Board-Certified Nurse Practitioner</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg bg-[#FF2D8E] text-white font-bold hover:bg-black transition"
                  >
                    Book Now →
                  </a>
                  <a
                    href="tel:630-636-6193"
                    className="px-6 py-3 rounded-lg bg-black text-white font-bold hover:bg-[#FF2D8E] transition"
                  >
                    📞 630-636-6193
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* FAQ */}
        <FadeUp delayMs={300}>
          <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-black text-center mb-6">
              Common Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Does it hurt?",
                  a: "Most patients feel only a brief pinch. The local anesthetic provides numbing, and relief often begins within minutes.",
                },
                {
                  q: "How long does it take?",
                  a: "The procedure typically takes 15-30 minutes depending on how many trigger points are treated.",
                },
                {
                  q: "How many treatments will I need?",
                  a: "Many patients feel significant relief after one session. Others benefit from a series of 2-3 treatments spaced 1-2 weeks apart.",
                },
                {
                  q: "Is there downtime?",
                  a: "Minimal to none. You may have slight soreness at the injection site for 1-2 days. Most people return to normal activities immediately.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="p-4 rounded-xl border-2 border-black"
                >
                  <p className="text-black font-bold mb-1">{faq.q}</p>
                  <p className="text-black text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
