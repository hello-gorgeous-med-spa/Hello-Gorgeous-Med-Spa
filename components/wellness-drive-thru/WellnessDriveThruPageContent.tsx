"use client";

import { Space_Grotesk, Syne } from "next/font/google";
import { useRef, useState } from "react";

import {
  WELLNESS_DRIVE_THRU_BOOK_HREF,
  WELLNESS_SHOTS,
  type WellnessShot,
} from "@/lib/wellness-drive-thru";

const body = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });
const displayFont = Syne({ subsets: ["latin"], weight: ["700", "800"] });

const display = `${displayFont.className} font-black tracking-[-0.04em] uppercase`;

const MENU_PHOTO = "/images/marketing/peptide-bar-menu-20.jpg";
const QR = "/images/marketing/20-minute-wellness-square-qr.png";

function Marquee({ text, invert }: { text: string; invert?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden border-y-[3px] border-black py-[10px] font-black tracking-[-0.02em] ${
        invert ? "bg-black text-white" : "bg-[#FF1493] text-black"
      }`}
    >
      <div className="flex w-max animate-[hg-marquee_20s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="mx-6 flex items-center text-[14px] uppercase md:text-[16px]">
            {text}
            <span className="mx-2 h-2 w-2 rounded-full bg-current" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function WellnessDriveThruPageContent() {
  const [shot, setShot] = useState<WellnessShot>(WELLNESS_SHOTS[0]);
  const menuRef = useRef<HTMLElement>(null);

  return (
    <div className={`${body.className} overflow-x-hidden bg-[#FFF8F0] text-[#0A0A0A]`}>
      <style>{`
        @keyframes hg-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes hg-float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-6px) rotate(1deg); } }
        @keyframes hg-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,20,147,.6); } 50% { box-shadow: 0 0 0 16px rgba(255,20,147,0); } }
      `}</style>

      <header className="sticky top-0 z-30 border-b-[3px] border-black bg-[#FFF8F0]">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center bg-black text-[18px] font-black tracking-tighter text-white">
              HG
            </div>
            <div className="leading-[0.9]">
              <div className="text-[16px] font-black uppercase tracking-[-0.02em]">Hello Gorgeous</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF1493]">
                Medical Spa • Oswego IL
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-[11px] font-bold uppercase tracking-widest md:flex">
            <span className="rounded-full bg-black px-3 py-1 text-white">In & Out in 20</span>
            <span className="rounded-full bg-[#FF1493] px-3 py-1 text-black">Walk-ins Welcome</span>
          </div>
          <a
            href={WELLNESS_DRIVE_THRU_BOOK_HREF}
            className="grid h-[40px] place-items-center border-[3px] border-black bg-black px-5 text-[13px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#FF1493] hover:text-black md:h-[44px] md:px-7 md:text-[14px]"
          >
            Book $20 Shot
          </a>
        </div>
      </header>

      <Marquee text="$20 SHOTS • NO GREASY FOOD • JUST GLOW • 20 MIN LUNCH BREAK • $20 SHOTS • INTRAMUSCULAR 90% ABSORPTION • SKIP THE LINE" />

      <section className="mx-auto grid max-w-[1280px] items-start gap-8 px-4 pb-10 pt-8 md:gap-10 md:px-8 md:pt-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-5 inline-flex flex-wrap gap-2">
            <span className="border-[3px] border-black bg-[#FF1493] px-3 py-1 text-[11px] font-black uppercase tracking-[0.15em] text-black">
              20 Minute Lunch Break Special
            </span>
            <span className="border-[3px] border-black bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.15em] text-white">
              20 Options • $20 Each • 15 Min Arrival
            </span>
          </div>
          <h1 className={`${display} text-[44px] uppercase leading-[0.85] tracking-[-0.04em] md:text-[88px]`}>
            <span className="block">Skip The</span>
            <span className="inline-block -rotate-[1deg] bg-black px-2 text-white md:px-4">Drive-Thru.</span>
            <span className="mt-1 block">Get Your</span>
            <span className="block text-[#FF1493]">Wellness Shot.</span>
          </h1>
          <div className="mt-6 grid items-end gap-6 md:mt-8 md:grid-cols-[1fr_auto]">
            <p className="max-w-[52ch] text-[18px] font-medium leading-[1.25] md:text-[22px]">
              What if in <span className="bg-black px-2 font-black text-white">20 minutes</span> you could stop in,
              pick your vitamin, and be back to work{" "}
              <span className="font-black underline decoration-[#FF1493] decoration-[6px] underline-offset-[-2px]">
                GLOWING
              </span>
              ? No drive-thru line. No greasy food. Just a $20 IM wellness shot, absorbed straight to your bloodstream.
            </p>
            <div
              className="hidden h-[140px] w-[140px] rotate-[6deg] place-items-center border-[3px] border-black bg-[#FFEB3B] p-3 text-center text-[12px] font-black uppercase leading-[1.1] md:grid"
              style={{ animation: "hg-float 3s ease-in-out infinite" }}
            >
              <div className="text-[42px] leading-none">20</div>
              <div className="text-[13px]">
                vitamins
                <br />
                im shots
                <br />
                $20 each
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WELLNESS_DRIVE_THRU_BOOK_HREF}
              className="grid h-[56px] place-items-center border-[3px] border-black bg-[#FF1493] px-8 text-[16px] font-black uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
              style={{ animation: "hg-pulse 2s infinite" }}
            >
              Book Your $20 Shot Now →
            </a>
            <button
              type="button"
              onClick={() => menuRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="h-[56px] border-[3px] border-black bg-white px-8 text-[14px] font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
            >
              See Menu ↓
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-[12px] font-bold uppercase tracking-widest">
            <div className="flex -space-x-2">
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-black text-[12px] text-white">✦</div>
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#FF1493] text-[12px] text-black">✦</div>
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#FFEB3B] text-[12px] text-black">✦</div>
            </div>
            <span>Administered by healthcare professionals only</span>
          </div>
        </div>

        <div className="relative">
          <div className="border-[4px] border-black bg-black p-2 text-white shadow-[8px_8px_0_0_#FF1493] md:p-3">
            <div className="border-[3px] border-white/20 bg-[#111] p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF1493]">
                  Now Serving • Hello Gorgeous Drive-Thru
                </span>
                <span className="bg-[#FF1493] px-2 py-1 text-[10px] font-black uppercase text-black">Open 11am-6pm</span>
              </div>
              <div className="space-y-3 font-mono text-[13px] uppercase md:text-[14px]">
                {[
                  ["▶ B12 Energy Shot", "$20"],
                  ["▶ Lipo Skinny Shot", "$20"],
                  ["▶ Glow Glutathione", "$20"],
                  ["▶ Tri-Immune Boost", "$20"],
                  ["▶ Biotin Beauty", "$20"],
                  ["▶ D3 Sunshine", "$20"],
                ].map(([name, price]) => (
                  <div key={name} className="flex justify-between border-b border-dashed border-white/20 pb-2">
                    <span>{name}</span>
                    <span className="font-black">{price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between bg-[#FF1493] p-3 text-[11px] font-black uppercase tracking-widest text-black">
                <span>Total Vitamins: 20</span>
                <span>Combo? No. Glow? Yes.</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-white p-2 text-center text-black">
                  <div className="text-[22px] font-black leading-none">90%</div>
                  <div className="text-[9px] font-bold uppercase leading-[1.1]">IM absorption vs 20% oral</div>
                </div>
                <div className="border-l-[3px] border-black bg-[#FFEB3B] p-2 text-center text-black">
                  <div className="text-[22px] font-black leading-none">5min</div>
                  <div className="text-[9px] font-bold uppercase leading-[1.1]">Healthcare pro + go</div>
                </div>
                <div className="border-l-[3px] border-black bg-white p-2 text-center text-black">
                  <div className="text-[22px] font-black leading-none">15min</div>
                  <div className="text-[9px] font-bold uppercase leading-[1.1]">Arrive after booking</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full -rotate-[2deg] border-[3px] border-black bg-white p-4 font-mono text-[11px] uppercase shadow-[6px_6px_0_0_black] md:absolute md:-bottom-10 md:-left-6 md:w-[300px]">
            <div className="mb-2 border-b-[2px] border-dashed border-black pb-2 text-center font-black">
              Hello Gorgeous Med Spa
              <br />
              74 W Washington St Oswego IL
              <br />
              Receipt # HG20MIN
            </div>
            <div className="flex justify-between">
              <span>Fast Food Combo</span>
              <span>$12.99 = Crash</span>
            </div>
            <div className="flex justify-between font-black text-[#FF1493]">
              <span>Wellness Shot</span>
              <span>$20 = Glow 4 Days</span>
            </div>
            <div className="mt-2 border-t-[2px] border-dashed border-black pt-2 text-center text-[9px]">
              Thank u, gorgeous. See u in 15.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 border-y-[4px] border-black bg-black text-white md:mt-16">
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
            <h2 className={`${display} text-[36px] uppercase leading-[0.9] tracking-[-0.03em] md:text-[64px]`}>
              How The
              <br />
              <span className="text-[#FF1493]">Drive-Thru</span> Works
            </h2>
            <div className="border-[3px] border-white bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-black md:text-[13px]">
              3 Steps • 20 Minutes • Zero Drive-Thru Regret
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              ["01", "BOOK NOW", "30 sec", "Tap BOOK YOUR GLOW. Pick your shot. We hold it for you. Arrive within 15 min — no waiting in line.", "📱", "Book in 30 sec"],
              ["02", "PICK YOUR SHOT", "2 min", "Choose from 20 medical-grade vitamins. Healthcare professional consult at check-in. Real medical bar menu, not a combo meal.", "💉", "20 options"],
              ["03", "GET YOUR GLOW", "5 min", "IM injection by a healthcare professional. Direct to bloodstream in minutes. Back to work before your latte gets cold.", "⚡", "In & out in 20"],
            ].map(([n, t, sub, d, icon, cta]) => (
              <div key={n} className="border-[3px] border-white bg-white p-5 text-black transition-colors hover:bg-[#FFF8F0] md:p-7">
                <div className="mb-6 flex items-start justify-between">
                  <div className="grid h-14 w-14 place-items-center bg-black text-[22px] text-white">{icon}</div>
                  <div className="text-right">
                    <div className="text-[42px] font-black leading-none tracking-[-0.05em] opacity-20">{n}</div>
                    <div className="-mt-1 bg-[#FF1493] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black">{sub}</div>
                  </div>
                </div>
                <h3 className={`${display} text-[22px] uppercase leading-[0.9] md:text-[26px]`}>{t}</h3>
                <p className="mt-3 text-[14px] font-medium leading-[1.4] opacity-80">{d}</p>
                <div className="mt-6 flex items-center justify-between border-t-[3px] border-black pt-3 text-[11px] font-black uppercase tracking-widest">
                  <span>{cta}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        invert
        text="STOP GOING THROUGH FAST FOOD DRIVE THRUS • GET YOUR WELLNESS INJECTION INSTEAD • $20 • STOP GOING THROUGH FAST FOOD DRIVE THRUS"
      />

      <section ref={menuRef} id="menu" className="mx-auto max-w-[1280px] scroll-mt-24 px-4 py-10 md:px-8 md:py-20">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF1493]" />
              Most Popular $20 Menu
            </div>
            <h2 className={`${display} text-[40px] uppercase leading-[0.85] tracking-[-0.04em] md:text-[72px]`}>
              Pick Your
              <br />
              Shot Menu
            </h2>
          </div>
          <div className="max-w-[380px]">
            <p className="text-[15px] font-medium leading-[1.35] md:text-[17px]">
              Fast-food menu board but make it medical-grade. Each shot = one IM injection, $20,{" "}
              <span className="font-black underline decoration-[#FF1493] decoration-4">
                administered by healthcare professionals only.
              </span>{" "}
              <span className="font-black underline decoration-[#FF1493] decoration-4">Not self-administered.</span>
            </p>
            <div className="mt-3 flex gap-2">
              <span className="border-[2px] border-black bg-[#FFEB3B] px-2 py-1 text-[10px] font-black uppercase">
                20 total vitamins available
              </span>
              <span className="border-[2px] border-black bg-[#FF1493] px-2 py-1 text-[10px] font-black uppercase">
                In-stock menu ↓
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {WELLNESS_SHOTS.map((item) => {
            const on = shot.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setShot(item)}
                className={`relative cursor-pointer border-[3px] border-black p-[18px] transition-all md:p-6 ${
                  on ? "bg-black text-white shadow-[8px_8px_0_0_#FF1493]" : "bg-white hover:bg-[#FFF8F0]"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center border-[3px] border-black text-[22px] font-black ${
                      on ? "bg-[#FF1493] text-black" : "bg-black text-white"
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black tracking-[0.2em] opacity-60">NO {item.code}</div>
                    <div
                      className={`mt-1 border-[2px] border-black px-2 py-1 text-[11px] font-black uppercase ${
                        on ? "bg-white text-black" : "bg-[#FF1493] text-black"
                      }`}
                    >
                      {item.aka}
                    </div>
                  </div>
                </div>
                <h3 className={`${display} text-[24px] uppercase leading-[0.9] tracking-[-0.02em] md:text-[28px]`}>
                  {item.name}
                </h3>
                <div className={`mt-1 text-[12px] font-black uppercase tracking-widest ${on ? "text-[#FF1493]" : "text-black"}`}>
                  {item.tagline}
                </div>
                <div className="mt-4 space-y-3 text-[13px] leading-[1.35]">
                  <div className="flex gap-2">
                    <span className={`h-fit shrink-0 px-2 py-1 text-[10px] font-black uppercase tracking-widest ${on ? "bg-white text-black" : "bg-black text-white"}`}>
                      Does
                    </span>
                    <span className="font-medium">{item.does}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-fit shrink-0 bg-[#FF1493] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black">
                      Best for
                    </span>
                    <span className="font-medium">{item.bestFor}</span>
                  </div>
                  <div className="mt-3 border-t-[2px] border-dashed border-current/20 pt-3">
                    <div className="mb-1 text-[10px] font-black uppercase tracking-[0.15em] opacity-60">
                      Why IM &gt; Pills • 90% vs 20% absorption
                    </div>
                    <div className="text-[12px] font-medium italic opacity-80">{item.oral}</div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-black leading-none">$20</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest line-through opacity-60">{item.dose}</span>
                  </div>
                  <a
                    href={WELLNESS_DRIVE_THRU_BOOK_HREF}
                    onClick={(e) => e.stopPropagation()}
                    className={`grid h-[36px] place-items-center border-[3px] border-black px-4 text-[11px] font-black uppercase tracking-widest transition-colors ${
                      on ? "bg-[#FF1493] text-black" : "bg-black text-white hover:bg-[#FF1493] hover:text-black"
                    }`}
                  >
                    Select →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid items-center gap-4 border-[3px] border-black bg-white p-3 md:grid-cols-[220px_1fr] md:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MENU_PHOTO}
            alt="Hello Gorgeous peptide bar menu, full vitamin list"
            className="h-[280px] w-full border-[2px] border-black bg-[#FFF8F0] object-contain p-2 md:h-[360px]"
          />
          <div className="p-2 md:p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF1493]">Source • Real Medical Menu</div>
            <h4 className={`${display} mt-2 text-[22px] uppercase leading-[0.9] md:text-[28px]`}>
              We pulled your $20 favorites from the full 20-vitamin peptide bar.
            </h4>
            <p className="mt-3 text-[14px] font-medium leading-[1.5]">
              This is the actual Hello Gorgeous Medical Spa bar — healthcare professionals stock all 20 daily. The campaign
              pulls the 6 most requested $20 IM shots for lunch-break speed. Ask about B6, B-Complex, L-Carnitine, Amino
              blends at your visit.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold uppercase">
              <div className="bg-black px-3 py-2 text-white">✓ Medical-grade vials</div>
              <div className="border-[2px] border-black bg-[#FF1493] px-3 py-2 text-black">✓ IM only • No self-admin</div>
              <div className="border-[2px] border-black bg-white px-3 py-2">✓ Healthcare professionals only</div>
              <div className="border-[2px] border-black bg-[#FFEB3B] px-3 py-2">✓ $20 per single shot</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-[4px] border-black bg-[#FFF8F0]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 md:gap-12 md:px-8 md:py-20 lg:grid-cols-2">
          <div>
            <h2 className={`${display} text-[36px] uppercase leading-[0.85] tracking-[-0.04em] md:text-[56px]`}>
              Why $20
              <br />
              Works Better
              <br />
              Than Your
              <br />
              <span className="inline-block -rotate-1 bg-[#FF1493] px-2 text-black">Combo Meal</span>
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-[3px] border-black bg-white p-4">
                <div className="text-[11px] font-black uppercase tracking-widest opacity-60">Fast Food Combo</div>
                <div className="mt-2 text-[32px] font-black leading-none">$12.99</div>
                <ul className="mt-3 space-y-1 text-[13px] font-medium leading-[1.3]">
                  <li>• 800 cal • 3pm crash</li>
                  <li>• Grease + sugar spike</li>
                  <li>• Hungry again in 1hr</li>
                  <li>• Zero glow</li>
                </ul>
              </div>
              <div className="border-[3px] border-black bg-black p-4 text-white shadow-[6px_6px_0_0_#FF1493]">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#FF1493]">Wellness Shot</div>
                <div className="mt-2 text-[32px] font-black leading-none">$20.00</div>
                <ul className="mt-3 space-y-1 text-[13px] font-medium leading-[1.3]">
                  <li>• 0 cal • Energy for days</li>
                  <li>• Direct to bloodstream</li>
                  <li>• 90% absorption (vs 20%)</li>
                  <li>• Glow + metabolism</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-[3px] border-black bg-white p-5 md:p-7">
              <div className="text-[12px] font-black uppercase tracking-[0.2em]">The Science Your Multivitamin Wishes It Had</div>
              <div className="mt-4 grid grid-cols-[56px_1fr] items-start gap-4">
                <div className="grid h-[56px] w-[56px] place-items-center border-[3px] border-black bg-[#FF1493] text-[20px] font-black">
                  IM
                </div>
                <div>
                  <div className="text-[16px] font-black uppercase">Intramuscular = Fast Lane</div>
                  <p className="mt-1 text-[14px] font-medium leading-[1.4]">
                    Oral vitamins lose 80% in digestion. IM bypasses gut, hits bloodstream in minutes. That&apos;s why you feel B12 in 10 min, not 10 days. Medical-grade, not gas station.
                  </p>
                </div>
              </div>
              <div className="relative mt-6 h-[14px] overflow-hidden border-[2px] border-black bg-black">
                <div className="absolute left-0 top-0 h-full w-[90%] bg-[#FF1493]" />
                <div className="absolute left-0 top-0 h-full w-[20%] border-r-[3px] border-black bg-white/60" />
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span>Oral 20%</span>
                <span>IM 90% absorption</span>
              </div>
            </div>
            <div className="border-[3px] border-black bg-[#FFEB3B] p-5 text-[15px] font-black uppercase leading-[1.2] tracking-[-0.01em]">
              <span className="bg-black px-2 text-white">Hot Take:</span> Stop spending $12 on food that makes you tired. Spend $20 on a shot that makes you hot, energetic, and clear-skinned for 3-4 days.
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["0", "No Calories"],
                ["✓", "No Crash"],
                ["100%", "All Glow"],
              ].map(([v, k]) => (
                <div key={k} className="border-[3px] border-black bg-white py-3">
                  <div className="text-[22px] font-black leading-none">{v}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-widest">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-[4px] border-black bg-[#FF1493]">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-12 md:px-8 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 inline-block bg-black px-3 py-1 text-[12px] font-black uppercase tracking-[0.2em] text-white">
              Urgency • Lunch Rush
            </div>
            <h2 className={`${display} text-[44px] uppercase leading-[0.85] tracking-[-0.05em] text-black md:text-[72px]`}>
              Book Right
              <br />
              Away.
              <br />
              Arrive Within
              <br />
              15 Min.
            </h2>
            <p className="mt-6 max-w-[48ch] text-[18px] font-bold leading-[1.25] text-black md:text-[22px]">
              Walk-ins welcome but booking holds your shot. We prep your vial when you tap book — no wait, no “we’re out.” Limited lunch-hour slots 11am-2pm fly fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-black px-4 py-2 text-[12px] font-black uppercase tracking-widest text-white">Today: 11am - 6pm</div>
              <div className="border-[3px] border-black bg-white px-4 py-2 text-[12px] font-black uppercase tracking-widest text-black">
                Avg wait: 2 min booked
              </div>
            </div>
          </div>
          <div className="border-[4px] border-black bg-black p-5 text-white shadow-[10px_10px_0_0_white] md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#FF1493]">Quick Book</span>
              <span className="bg-white px-2 py-1 text-[10px] font-black uppercase text-black">{shot.name} Selected</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-[3px] border-white bg-white p-4 text-black">
                <div>
                  <div className="text-[16px] font-black uppercase leading-none">{shot.name} • $20</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-70">
                    {shot.tagline} • {shot.dose}
                  </div>
                </div>
                <div className="text-[24px]">{shot.emoji}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={WELLNESS_DRIVE_THRU_BOOK_HREF}
                  className="grid h-[56px] place-items-center border-[3px] border-[#FF1493] bg-[#FF1493] text-[14px] font-black uppercase tracking-widest text-black transition-colors hover:bg-white"
                >
                  Book Now →
                </a>
                <a
                  href={WELLNESS_DRIVE_THRU_BOOK_HREF}
                  className="grid h-[56px] place-items-center border-[3px] border-white text-[12px] font-black uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
                >
                  Hold My Shot
                </a>
              </div>
              <div className="text-center text-[11px] font-medium leading-[1.4] opacity-80">
                Tapping book opens Square.
                <br />
                A healthcare professional confirms the shot is appropriate. Bring ID.
              </div>
              <div className="flex items-center gap-3 border-t-[2px] border-dashed border-white/20 pt-4 text-[11px] font-bold uppercase">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">📍</span>
                <span>74 W Washington St, Oswego IL • (630) 636-6193 • Scan to Book</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-[4px] border-black bg-black text-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center bg-[#FF1493] font-black text-black">HG</div>
              <div>
                <div className="text-[18px] font-black uppercase leading-none tracking-[-0.02em]">Hello Gorgeous Medical Spa</div>
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-60">20 Minute Wellness Drive-Thru • Est. Oswego IL</div>
              </div>
            </div>
            <div className="mt-6 max-w-[48ch] text-[13px] leading-[1.5] opacity-80">
              74 W Washington St, Oswego IL 60543 • (630) 636-6193
              <br />
              Administered by healthcare professionals only. Intramuscular only. Not self-administered. Individual results vary. $20 per single IM shot special — in-clinic only.
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white px-3 py-1 text-black">Mon-Fri 11am-6pm</span>
              <span className="bg-[#FF1493] px-3 py-1 text-black">Sat 10am-3pm</span>
              <span className="border border-white px-3 py-1">Walk-ins Welcome</span>
            </div>
          </div>
          <div className="border-[3px] border-white bg-white p-5 text-black">
            <div className="text-[14px] font-black uppercase tracking-widest">Scan To Book Now</div>
            <div className="mt-3 grid grid-cols-[80px_1fr] items-center gap-4">
              <a href={WELLNESS_DRIVE_THRU_BOOK_HREF} className="block h-[80px] w-[80px] border-[3px] border-black bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={QR} alt="Square booking QR code for the $20 wellness shot" className="h-full w-full object-contain" />
              </a>
              <div className="text-[12px] font-bold uppercase leading-[1.3]">
                Arrive within 15 min of booking.
                <br />
                Hold your shot + skip line.
                <br />
                <a href={WELLNESS_DRIVE_THRU_BOOK_HREF} className="mt-2 inline-block border-[2px] border-black bg-[#FF1493] px-3 py-1 text-black">
                  Book Your $20 Shot →
                </a>
              </div>
            </div>
            <div className="mt-4 text-[10px] leading-[1.4] opacity-70">
              Disclaimer: Vitamin injections are wellness services, not medical diagnosis. Not for pregnant/nursing without provider approval. No guarantee of weight loss. IM absorption ~90% vs oral ~20% per literature.
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
          Skip The Drive-Thru. Get Your Wellness Shot. • Hello Gorgeous Medical Spa • $20 Shots • Oswego IL
        </div>
      </footer>
    </div>
  );
}
