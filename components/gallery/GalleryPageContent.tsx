"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

/* ─────────────────────────────────────────────────────────────
   DATA TYPES
───────────────────────────────────────────────────────────── */

type BeforeAfterCase = {
  type: "before-after";
  id: string;
  treatment: string;
  category: string;
  tagline: string;
  before: string;
  after: string;
  duringVideo?: string;
  note: string;
  serviceHref: string;
};

type VideoCase = {
  type: "video";
  id: string;
  treatment: string;
  category: string;
  tagline: string;
  video: string;
  note: string;
  serviceHref: string;
};

type YoutubeCase = {
  type: "youtube";
  id: string;
  treatment: string;
  category: string;
  tagline: string;
  youtubeId: string;
  note: string;
  serviceHref: string;
};

type SingleImageCase = {
  type: "single-image";
  id: string;
  treatment: string;
  category: string;
  tagline: string;
  image: string;
  imageAlt: string;
  note: string;
  serviceHref: string;
};

type GalleryCase = BeforeAfterCase | VideoCase | YoutubeCase | SingleImageCase;

/* ─────────────────────────────────────────────────────────────
   CASES — add more here
───────────────────────────────────────────────────────────── */

const CASES: GalleryCase[] = [
  {
    type: "single-image",
    id: "morpheus8-thigh-1",
    treatment: "Morpheus8 Burst — Thigh & Cellulite",
    category: "RF Microneedling",
    tagline: "Cellulite and skin laxity on the thighs — visibly smoother after Morpheus8 Burst.",
    image: "/gallery/morpheus8-thigh-1/before-after.jpg",
    imageAlt: "Morpheus8 Burst thigh cellulite before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 Burst RF microneedling — body. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-thigh-2",
    treatment: "Morpheus8 Burst — Body Contouring",
    category: "RF Microneedling",
    tagline: "Tighter, smoother skin on the outer thigh — Morpheus8 Burst body results.",
    image: "/gallery/morpheus8-thigh-2/before-after.jpg",
    imageAlt: "Morpheus8 Burst body contouring thigh before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 Burst RF microneedling — body. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-face-hyperpig",
    treatment: "Morpheus8 — Hyperpigmentation & Tone",
    category: "RF Microneedling",
    tagline: "Sun spots, uneven tone and texture corrected — Morpheus8 RF microneedling.",
    image: "/gallery/morpheus8-face-hyperpig/before-after.jpg",
    imageAlt: "Morpheus8 face hyperpigmentation before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 RF microneedling — face. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-face-wrinkles",
    treatment: "Morpheus8 — Fine Lines & Wrinkles",
    category: "RF Microneedling",
    tagline: "Deep wrinkles and skin laxity visibly reduced — Morpheus8 RF microneedling.",
    image: "/gallery/morpheus8-face-wrinkles/before-after.jpg",
    imageAlt: "Morpheus8 face wrinkles fine lines before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 RF microneedling — face. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-acne-scars-1",
    treatment: "Morpheus8 — Acne Scars",
    category: "RF Microneedling",
    tagline: "Active acne and post-acne scarring treated with Morpheus8 RF microneedling.",
    image: "/gallery/morpheus8-acne-scars-1/before-after.jpg",
    imageAlt: "Morpheus8 acne scars before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 RF microneedling — acne scars. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-acne-scars-2",
    treatment: "Morpheus8 — Acne Scars & Redness",
    category: "RF Microneedling",
    tagline: "Redness, scarring and texture dramatically improved — Morpheus8 at Hello Gorgeous.",
    image: "/gallery/morpheus8-acne-scars-2/before-after.jpg",
    imageAlt: "Morpheus8 acne scars and redness before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 RF microneedling — acne scars. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-burst-face",
    treatment: "Morpheus8 Burst — Fine Lines & Laxity",
    category: "RF Microneedling",
    tagline: "Morpheus8 Burst + Lumecca — deep wrinkles and skin laxity visibly lifted.",
    image: "/gallery/morpheus8-burst-face/before-after.jpg",
    imageAlt: "Morpheus8 Burst fine lines and skin laxity before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 Burst RF microneedling — face. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "morpheus8-acne-scars-3",
    treatment: "Morpheus8 — Surgical Scar & Acne Scars",
    category: "RF Microneedling",
    tagline: "Surgical scarring and acne scars faded — Morpheus8 RF microneedling.",
    image: "/gallery/morpheus8-acne-scars-3/before-after.jpg",
    imageAlt: "Morpheus8 surgical scar and acne scars before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Morpheus8 RF microneedling — scars. Clinical result. Now available at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "single-image",
    id: "solaria-client-7",
    treatment: "Solaria CO₂ Laser — Before, During & After",
    category: "Laser Resurfacing",
    tagline: "Acne scars, texture & dullness — completely transformed in one session.",
    image: "/gallery/solaria-client-7/before-during-after.jpg",
    imageAlt: "Solaria CO₂ laser before, during healing, and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Solaria fractional CO₂ laser. Left: before. Center: immediately post. Right: healed result. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "single-image",
    id: "lip-filler-jen-2",
    treatment: "Lip Filler — Before, During & After",
    category: "Injectables",
    tagline: "Fuller lips, defined shape — natural enhancement from one syringe.",
    image: "/gallery/lip-filler-jen-2/before-during-after.jpg",
    imageAlt: "Lip filler before, during injection, and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Dermal filler for natural lip enhancement. Left: before. Center: live injection. Right: after. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/services/lip-filler",
  },
  {
    type: "single-image",
    id: "solaria-client-5",
    treatment: "Solaria CO₂ Laser — Before, During & After",
    category: "Laser Resurfacing",
    tagline: "Real skin transformation — redness, texture & tone corrected in one session.",
    image: "/gallery/solaria-client-5/before-during-after.jpg",
    imageAlt: "Solaria CO₂ laser before, during, and healed after — Hello Gorgeous Med Spa Oswego IL",
    note: "Solaria fractional CO₂ laser. Left: before. Center: immediately post. Right: healed result. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "single-image",
    id: "solaria-client-6",
    treatment: "Solaria CO₂ Laser — Before, During & After",
    category: "Laser Resurfacing",
    tagline: "Dramatic renewal — fine lines, laxity & sun damage treated in a single CO₂ session.",
    image: "/gallery/solaria-client-6/before-during-after.jpg",
    imageAlt: "Solaria CO₂ laser before, 4 days post, and healed after — Hello Gorgeous Med Spa Oswego IL",
    note: "Solaria fractional CO₂ laser. Left: before. Center: 4 days post. Right: healed result. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "single-image",
    id: "lip-filler-jen",
    treatment: "Lip Filler — Before, During & After",
    category: "Injectables",
    tagline: "Natural volume — defined cupid's bow, soft overall shape. Real client result.",
    image: "/gallery/lip-filler-jen/before-during-after.jpg",
    imageAlt: "Lip filler before, during procedure, and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Dermal filler placed for natural lip enhancement. Left: before. Center: live injection. Right: after. Performed at Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/services/lip-filler",
  },
  {
    type: "before-after",
    id: "solaria-client-4",
    treatment: "Solaria CO₂ Laser",
    category: "Laser Resurfacing",
    tagline: "Hyperpigmentation, texture, and redness — corrected. Real client, real result.",
    before: "/gallery/solaria-client-4/before.jpg",
    after: "/gallery/solaria-client-4/after.jpg",
    note: "Solaria fractional CO₂ laser resurfacing. Performed at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "before-after",
    id: "solaria-client-2",
    treatment: "Solaria CO₂ Laser",
    category: "Laser Resurfacing",
    tagline: "Smoother texture, lifted tone, and a natural glow — real client result.",
    before: "/gallery/client-2/before.jpg",
    after: "/gallery/client-2/after.jpg",
    note: "Solaria fractional CO₂ laser resurfacing. Performed at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "single-image",
    id: "solaria-client-3",
    treatment: "Solaria CO₂ Laser — Full Face Result",
    category: "Laser Resurfacing",
    tagline: "Dramatic skin renewal — one treatment, full face transformation.",
    image: "/gallery/solaria-client-2/result.jpg",
    imageAlt: "Solaria CO₂ laser full face before and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Solaria fractional CO₂ laser resurfacing. One treatment result. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "single-image",
    id: "solaria-client-1",
    treatment: "Solaria CO₂ Laser — Before, During & After",
    category: "Laser Resurfacing",
    tagline: "Real client transformation — skin texture, tone, and fine lines treated in one session.",
    image: "/gallery/solaria-client-1/before-during-after.jpg",
    imageAlt: "Solaria CO₂ laser before, during, and after — Hello Gorgeous Med Spa Oswego IL",
    note: "Solaria fractional CO₂ laser resurfacing. Left: before. Center: immediately after. Right: healed result. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "before-after",
    id: "quantum-rf-chin-1",
    treatment: "Quantum RF — Chin & Neck Contouring",
    category: "RF Treatments",
    tagline: "Defined jawline in just 1 week — no surgery, no downtime. Real client result.",
    before: "/gallery/quantum-rf-chin-1/before.jpg",
    after: "/gallery/quantum-rf-chin-1/after.jpg",
    note: "Quantum RF subdermal contouring — chin & neck. Result shown at 1 week post-treatment. Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/quantum-rf-oswego-il",
  },
  {
    type: "before-after",
    id: "quantum-rf-body-1",
    treatment: "Quantum RF — Body Contouring",
    category: "RF Treatments",
    tagline: "Loose skin tightened without surgery — real client before & after.",
    before: "/gallery/quantum-rf-body-1/before.jpg",
    after: "/gallery/quantum-rf-body-1/after.jpg",
    note: "Quantum RF subdermal body contouring. Performed at Hello Gorgeous Med Spa, Oswego, IL. Individual results vary.",
    serviceHref: "/quantum-rf-oswego-il",
  },
  {
    type: "video",
    id: "quantum-rf-stomach",
    treatment: "Quantum RF — Body Contouring",
    category: "RF Treatments",
    tagline: "Quantum RF subdermal contouring on the abdomen.",
    video: "/videos/gallery/quantum-rf-stomach.mp4",
    note: "Live Quantum RF body treatment. Performed at Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/quantum-rf-oswego-il",
  },
  {
    type: "video",
    id: "morpheus8-burst-procedure",
    treatment: "Morpheus8 Burst",
    category: "RF Microneedling",
    tagline: "Deepest RF microneedling — live Morpheus8 Burst procedure.",
    video: "/videos/gallery/morpheus8-burst-procedure.mp4",
    note: "Morpheus8 Burst RF microneedling procedure footage. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
  {
    type: "video",
    id: "luxora-inmode-event",
    treatment: "Luxora by InMode — Event Launch",
    category: "Advanced Technology",
    tagline: "Introducing Luxora — InMode's latest body contouring platform at Hello Gorgeous.",
    video: "/videos/gallery/luxora-inmode-event.mp4",
    note: "Luxora InMode event launch footage. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/trifecta-vip",
  },
  {
    type: "video",
    id: "solaria-procedure-2",
    treatment: "Solaria CO₂ Laser — Procedure Clip",
    category: "Laser Resurfacing",
    tagline: "Live Solaria CO₂ fractional laser treatment in clinic.",
    video: "/videos/gallery/solaria-procedure-2.mp4",
    note: "Solaria CO₂ laser procedure footage. Performed at Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "video",
    id: "solaria-procedure",
    treatment: "Solaria CO₂ Laser",
    category: "Laser Resurfacing",
    tagline: "Gold-standard fractional CO₂ resurfacing — live in clinic.",
    video: "/videos/gallery/solaria-procedure.mp4",
    note: "Solaria fractional CO₂ laser procedure at Hello Gorgeous Med Spa. Treats wrinkles, texture, tone & acne scars.",
    serviceHref: "/solaria-co2-laser-oswego-il",
  },
  {
    type: "video",
    id: "quantum-rf-clip-2",
    treatment: "Quantum RF — Live Technique",
    category: "RF Treatments",
    tagline: "Subdermal RF contouring by Ryan Kent, FNP-BC.",
    video: "/videos/quantum-rf/ryan-quantum-rf-action-2.mp4",
    note: "Real Quantum RF treatment footage showing controlled subdermal pass. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/quantum-rf-oswego-il",
  },
  {
    type: "video",
    id: "quantum-rf-clip-3",
    treatment: "Quantum RF — Procedure Continuation",
    category: "RF Treatments",
    tagline: "Real-time provider handling during Quantum RF session.",
    video: "/videos/quantum-rf/ryan-quantum-rf-action-3.mp4",
    note: "Procedure continuation clip with Ryan Kent, FNP-BC. Individual candidacy and results vary.",
    serviceHref: "/quantum-rf-oswego-il",
  },
  {
    type: "youtube",
    id: "morpheus8-burst-youtube",
    treatment: "Morpheus8 Burst — Full Procedure",
    category: "RF Microneedling",
    tagline: "Watch a full Morpheus8 Burst RF microneedling session from start to finish.",
    youtubeId: "SPJPb-sBWKk",
    note: "Morpheus8 Burst RF microneedling — deepest treatment at 8mm. Hello Gorgeous Med Spa, Oswego, IL.",
    serviceHref: "/morpheus8-burst-oswego-il",
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(CASES.map((c) => c.category)))];

/* ─────────────────────────────────────────────────────────────
   CARDS
───────────────────────────────────────────────────────────── */

function BeforeAfterCard({ item }: { item: BeforeAfterCase }) {
  const [showVideo, setShowVideo] = useState(false);
  const [side, setSide] = useState<"before" | "after">("after");

  return (
    <article className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/20 px-3 py-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
            {item.category}
          </p>
          <h3 className="text-sm font-black text-black leading-tight">{item.treatment}</h3>
        </div>
        {item.duringVideo && (
          <button
            type="button"
            onClick={() => setShowVideo((v) => !v)}
            className={`flex items-center gap-1 rounded-full border border-black px-2.5 py-1 text-[10px] font-bold transition ${
              showVideo
                ? "bg-[#E6007E] text-white border-[#E6007E]"
                : "bg-white text-black hover:bg-[#FFF0F7]"
            }`}
          >
            {showVideo ? (
              <>
                <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="2" y="2" width="8" height="8" rx="1" />
                </svg>
                Photos
              </>
            ) : (
              <>
                <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M3 2l7 4-7 4V2z" />
                </svg>
                Watch
              </>
            )}
          </button>
        )}
      </div>

      {showVideo && item.duringVideo ? (
        <div className="bg-black">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full h-auto block max-h-[320px] object-contain"
          >
            <source src={item.duringVideo} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="relative">
          <div className="flex border-b border-black/20">
            {(["before", "after"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition ${
                  side === s
                    ? "bg-[#E6007E] text-white"
                    : "bg-white text-black/40 hover:bg-[#FFF0F7]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative aspect-[1/1] w-full overflow-hidden bg-gray-100">
            <Image
              src={side === "before" ? item.before : item.after}
              alt={`${item.treatment} ${side} — Hello Gorgeous Med Spa Oswego IL`}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={side === "after"}
            />
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {side}
            </span>
          </div>
        </div>
      )}

      <div className="border-t border-black/20 px-3 py-2.5">
        <p className="text-xs font-medium text-black/65 leading-snug">{item.tagline}</p>
        <p className="mt-1 text-[10px] text-black/35 leading-relaxed">{item.note}</p>
        <Link
          href={item.serviceHref}
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#E6007E] underline underline-offset-2 hover:text-[#c9006e] transition-colors"
        >
          Learn about this treatment →
        </Link>
      </div>
    </article>
  );
}

function VideoCard({ item }: { item: VideoCase }) {
  return (
    <article className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/20 px-3 py-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
            {item.category} · Procedure Clip
          </p>
          <h3 className="text-sm font-black text-black leading-tight">{item.treatment}</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#E6007E] px-2.5 py-1 text-[9px] font-bold text-white">
          <svg className="h-2 w-2" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 2l7 4-7 4V2z" />
          </svg>
          VIDEO
        </span>
      </div>

      <div className="bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          className="w-full h-auto block max-h-[320px] object-contain"
        >
          <source src={item.video} type="video/mp4" />
        </video>
      </div>

      <div className="border-t border-black/20 px-3 py-2.5">
        <p className="text-xs font-medium text-black/65 leading-snug">{item.tagline}</p>
        <p className="mt-1 text-[10px] text-black/35 leading-relaxed">{item.note}</p>
        <Link
          href={item.serviceHref}
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#E6007E] underline underline-offset-2 hover:text-[#c9006e] transition-colors"
        >
          Learn about this treatment →
        </Link>
      </div>
    </article>
  );
}

function SingleImageCard({ item }: { item: SingleImageCase }) {
  return (
    <article className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/20 px-3 py-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
            {item.category} · Real Client
          </p>
          <h3 className="text-sm font-black text-black leading-tight">{item.treatment}</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-black/20 bg-[#FFF0F7] px-2.5 py-1 text-[9px] font-bold text-[#E6007E]">
          Before · After
        </span>
      </div>

      <div className="relative w-full overflow-hidden bg-black">
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={1080}
          height={720}
          className="w-full h-auto block max-h-[320px] object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="border-t border-black/20 px-3 py-2.5">
        <p className="text-xs font-medium text-black/65 leading-snug">{item.tagline}</p>
        <p className="mt-1 text-[10px] text-black/35 leading-relaxed">{item.note}</p>
        <Link
          href={item.serviceHref}
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#E6007E] underline underline-offset-2 hover:text-[#c9006e] transition-colors"
        >
          Learn about this treatment →
        </Link>
      </div>
    </article>
  );
}

function YoutubeCard({ item }: { item: YoutubeCase }) {
  return (
    <article className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/20 px-3 py-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
            {item.category} · Procedure Video
          </p>
          <h3 className="text-sm font-black text-black leading-tight">{item.treatment}</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold text-white">
          <svg className="h-2 w-2" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 2l7 4-7 4V2z" />
          </svg>
          YouTube
        </span>
      </div>

      <div className="bg-black aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
          title={item.treatment}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>

      <div className="border-t border-black/20 px-3 py-2.5">
        <p className="text-xs font-medium text-black/65 leading-snug">{item.tagline}</p>
        <p className="mt-1 text-[10px] text-black/35 leading-relaxed">{item.note}</p>
        <Link
          href={item.serviceHref}
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#E6007E] underline underline-offset-2 hover:text-[#c9006e] transition-colors"
        >
          Learn about this treatment →
        </Link>
      </div>
    </article>
  );
}

function CaseCard({ item }: { item: GalleryCase }) {
  if (item.type === "before-after") return <BeforeAfterCard item={item} />;
  if (item.type === "youtube") return <YoutubeCard item={item} />;
  if (item.type === "single-image") return <SingleImageCard item={item} />;
  return <VideoCard item={item} />;
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

export function GalleryPageContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? CASES
      : CASES.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Ambient wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(230,0,126,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(255,45,142,0.05) 0%, transparent 70%), linear-gradient(180deg,#FFF0F7 0%,#fff 40%,#f9f9f9 100%)",
        }}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b-4 border-black py-12 md:py-16"
        style={{
          background: "linear-gradient(135deg,#0a0a0a 0%,#2d1020 50%,#1a0a14 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 10% 50%, rgba(230,0,126,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 90% 40%, rgba(255,45,142,0.18) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          aria-hidden
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6007E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
              Real patients · Real results
            </span>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FFB8DC]">
            Hello Gorgeous Med Spa · Oswego, IL
          </p>

          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
            Before &amp;{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              After Gallery
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Unfiltered, unedited results and live procedure clips from our patients in
            Oswego, Naperville, Aurora &amp; surrounding communities. Every procedure
            performed by a licensed medical provider.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/50">
            <span className="rounded-full border border-white/20 px-3 py-1">
              {CASES.filter((c) => c.type === "before-after").length} Before &amp; Afters
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1">
              {CASES.length} Total showcases
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1">
              {ALL_CATEGORIES.length - 1} Treatment categories
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-7 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Book a Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-16 z-30 border-b-2 border-black bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl overflow-x-auto px-4 py-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition ${
                  activeCategory === cat
                    ? "border-[#E6007E] bg-[#E6007E] text-white"
                    : "border-black/20 bg-white text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({cat === "All" ? CASES.length : CASES.filter((c) => c.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-black/50">
            No results in this category yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-10 rounded-xl border border-black/10 bg-[#FFF0F7] p-4 text-[11px] leading-relaxed text-black/50">
          <strong className="text-black/70">Disclaimer:</strong> Photos and videos are
          from real patients of Hello Gorgeous Med Spa and are published with consent.
          Results are individual and cannot be guaranteed. All procedures are performed
          by licensed medical professionals. Consult with your provider to determine
          candidacy.
        </p>
      </section>

      {/* CTA band */}
      <section
        className="border-t-4 border-black py-16"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-black text-white">
            Ready for your transformation?
          </h2>
          <p className="mt-3 text-base text-white/80">
            Book a free consultation at Hello Gorgeous Med Spa in Oswego, IL. Walk
            in as you are — leave looking and feeling gorgeous.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={BOOKING_URL}
              className="rounded-full bg-white px-8 py-3 text-sm font-bold text-[#E6007E] transition hover:bg-white/90"
            >
              Book Now — It&apos;s Free
            </Link>
            <Link
              href="/fix-what-bothers-me"
              className="rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Fix What Bothers Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
