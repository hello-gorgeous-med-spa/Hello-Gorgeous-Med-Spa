"use client";

import { Space_Grotesk } from "next/font/google";
import { useState, type ReactNode } from "react";

import {
  WELLNESS_DRIVE_THRU_BOOK_HREF,
  WELLNESS_DRIVE_THRU_PHONE,
  WELLNESS_DRIVE_THRU_PHONE_DISPLAY,
  WELLNESS_SHOTS,
  type WellnessShot,
} from "@/lib/wellness-drive-thru";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });

const display = `${grotesk.className} font-bold tracking-[-0.04em] uppercase`;

function BookLink({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <a href={WELLNESS_DRIVE_THRU_BOOK_HREF} className={className}>
      {children}
    </a>
  );
}

export function WellnessDriveThruPageContent() {
  const [shot, setShot] = useState<WellnessShot>(WELLNESS_SHOTS[0]);

  return (
    <div className={`${grotesk.className} bg-[#FFF8F0] text-[#0A0A0A]`}>
      <style>{`
        @keyframes hg-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <div className="border-b-[3px] border-black bg-[#FFF8F0]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em]">
            20-minute lunch break · Oswego
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border-[3px] border-black bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest">
              Walk-ins welcome
            </span>
            <BookLink className="border-[3px] border-black bg-[#FF1493] px-3 py-1 text-[11px] font-black uppercase tracking-widest">
              Book $20 shot
            </BookLink>
          </div>
        </div>
      </div>

      <section className="border-b-[3px] border-black bg-[#FF1493]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-16">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.2em]">
              20 options on the bar · $20 on this menu · arrive after you book
            </p>
            <h1 className={`${display} mt-4 text-[52px] leading-[0.86] md:text-[88px]`}>
              Skip the
              <br />
              drive-thru.
              <br />
              <span className="underline decoration-black decoration-[6px] underline-offset-[6px]">
                Get your wellness shot.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] font-medium leading-snug md:text-[18px]">
              A $20 intramuscular shot, given here by a licensed RN. Not self-administered.
              Book on Square and we hold the vial. How you feel afterward varies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookLink className="grid h-[56px] place-items-center border-[3px] border-black bg-black px-6 text-[14px] font-black uppercase tracking-widest text-white hover:bg-[#0A0A0A]">
                Book your $20 shot →
              </BookLink>
              <a
                href="#menu"
                className="grid h-[56px] place-items-center border-[3px] border-black bg-white px-6 text-[14px] font-black uppercase tracking-widest"
              >
                See menu ↓
              </a>
            </div>
          </div>
          <div className="border-[3px] border-black bg-white p-6 shadow-[10px_10px_0_0_#0A0A0A]">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#FF1493]">Now serving</p>
            <ul className="mt-4 space-y-2">
              {WELLNESS_SHOTS.map((item) => (
                <li key={item.id} className="flex items-center justify-between border-b border-black/15 py-2 text-[14px] font-black uppercase">
                  <span>
                    {item.emoji} {item.name}
                  </span>
                  <span>$20</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] font-bold uppercase tracking-widest">Shot window · Mon–Fri 11–6 · Sat 10–3</p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y-[3px] border-black bg-black py-3 text-white">
        <div className="flex w-max animate-[hg-marquee_22s_linear_infinite] whitespace-nowrap text-[14px] font-black uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="px-6">
              Stop the fast-food drive-thru · Get a wellness shot instead · $20 · RN administered · IM only ·
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-[1280px] gap-4 px-4 py-10 md:grid-cols-3 md:px-8">
        {[
          ["RN", "Licensed nurse gives the shot"],
          ["5 min", "Injection, then you go"],
          ["15 min", "Square visit after you book"],
        ].map(([k, v]) => (
          <div key={k} className="border-[3px] border-black bg-white p-5">
            <p className={`${display} text-[42px] leading-none`}>{k}</p>
            <p className="mt-2 text-[14px] font-medium">{v}</p>
          </div>
        ))}
      </section>

      <section className="border-y-[3px] border-black bg-black text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8">
          <h2 className={`${display} text-[40px] leading-[0.9] md:text-[64px]`}>
            How the <span className="text-[#FF1493]">drive-thru</span> works
          </h2>
          <p className="mt-3 text-[12px] font-black uppercase tracking-[0.16em]">3 steps · about 20 minutes</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Book", "Tap book. Square opens the $20 shot. We hold a 15-minute visit."],
              ["02", "Pick your shot", "Six lunch favorites are on this page. The bar has more if you ask at check-in."],
              ["03", "Get the shot", "An RN gives the IM injection. You are not doing this at home."],
            ].map(([n, t, d]) => (
              <article key={n} className="border-[3px] border-white bg-white p-6 text-black">
                <p className="text-[12px] font-black tracking-widest text-[#FF1493]">{n}</p>
                <h3 className={`${display} mt-2 text-[28px]`}>{t}</h3>
                <p className="mt-3 text-[14px] font-medium leading-snug">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-[1280px] scroll-mt-24 px-4 py-12 md:px-8 md:py-16">
        <p className="inline-block bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white">
          Most requested $20 menu
        </p>
        <h2 className={`${display} mt-4 text-[44px] leading-[0.88] md:text-[72px]`}>Pick your shot</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {WELLNESS_SHOTS.map((item) => {
            const on = shot.id === item.id;
            return (
              <article
                key={item.id}
                className={`border-[3px] border-black p-5 md:p-6 ${on ? "bg-[#FF1493]" : "bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">{item.code} · {item.aka}</p>
                    <h3 className={`${display} mt-1 text-[28px]`}>{item.emoji} {item.name}</h3>
                    <p className="mt-1 text-[13px] font-bold uppercase tracking-widest">{item.tagline} · {item.dose}</p>
                  </div>
                  <p className={`${display} text-[28px]`}>$20</p>
                </div>
                <p className="mt-4 text-[14px] font-medium leading-snug">{item.does}</p>
                <p className="mt-2 text-[13px] font-medium opacity-80">Best for {item.bestFor}. {item.oral}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShot(item)}
                    className="h-10 border-[3px] border-black bg-white px-4 text-[11px] font-black uppercase tracking-widest"
                  >
                    {on ? "Selected" : "Select"}
                  </button>
                  <BookLink className="grid h-10 place-items-center border-[3px] border-black bg-black px-4 text-[11px] font-black uppercase tracking-widest text-white">
                    Book this shot →
                  </BookLink>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 max-w-3xl text-[14px] font-medium leading-relaxed">
          The clinic bar stocks more than these six, including B6, B-complex, L-carnitine, and amino blends.
          Ask at the visit. This page books the $20 lunch shot. The regular vitamin bar is still $25.
        </p>
      </section>

      <section className="border-y-[3px] border-black bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-4 py-12 md:grid-cols-2 md:px-8">
          <div className="border-[3px] border-black p-6">
            <p className="text-[12px] font-black uppercase tracking-widest">Fast-food combo</p>
            <p className={`${display} mt-2 text-[40px]`}>A lunch that crashes</p>
            <ul className="mt-4 space-y-1 text-[14px] font-medium">
              <li>Grease and a sugar spike</li>
              <li>Hungry again soon</li>
              <li>No vitamin in it</li>
            </ul>
          </div>
          <div className="border-[3px] border-black bg-[#FF1493] p-6">
            <p className="text-[12px] font-black uppercase tracking-widest">Wellness shot</p>
            <p className={`${display} mt-2 text-[40px]`}>$20.00</p>
            <ul className="mt-4 space-y-1 text-[14px] font-medium">
              <li>One IM shot, not a meal</li>
              <li>Given by a licensed RN</li>
              <li>How you feel varies</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 md:px-8">
        <h2 className={`${display} text-[36px] leading-[0.9] md:text-[56px]`}>Why a shot, not a pill</h2>
        <p className="mt-4 max-w-3xl text-[16px] font-medium leading-relaxed">
          An intramuscular shot skips the gut. How much you absorb depends on the vitamin and on you.
          That is why some people notice a B12 shot sooner than a daily pill, and some do not.
          Medical-grade vials. Given in the clinic. Not a gas-station supplement.
        </p>
      </section>

      <section className="border-t-[3px] border-black bg-black text-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 md:grid-cols-[1fr_1fr] md:px-8 md:py-16">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#FF1493]">Lunch rush</p>
            <h2 className={`${display} mt-3 text-[40px] leading-[0.9] md:text-[56px]`}>Booking holds your shot</h2>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/80">
              Walk in if a nurse is free. A Square booking is what tells us to prep {shot.name.toLowerCase()}.
              Shot window is Monday–Friday 11am–6pm and Saturday 10am–3pm. The spa is open longer than the shot window.
            </p>
            <p className="mt-4 text-[13px] font-bold uppercase tracking-widest">
              74 W Washington St, Oswego IL · {WELLNESS_DRIVE_THRU_PHONE_DISPLAY}
            </p>
          </div>
          <div className="border-[3px] border-white p-6">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#FF1493]">Quick book</p>
            <p className={`${display} mt-3 text-[32px]`}>{shot.name} · $20</p>
            <p className="mt-2 text-[13px] font-bold uppercase tracking-widest text-white/70">
              {shot.tagline} · {shot.dose}
            </p>
            <BookLink className="mt-6 grid h-14 place-items-center bg-[#FF1493] text-[14px] font-black uppercase tracking-widest text-black">
              Book on Square →
            </BookLink>
            <a
              href={WELLNESS_DRIVE_THRU_PHONE}
              className="mt-3 grid h-12 place-items-center border-[3px] border-white text-[12px] font-black uppercase tracking-widest"
            >
              Call {WELLNESS_DRIVE_THRU_PHONE_DISPLAY}
            </a>
            <p className="mt-4 text-center text-[11px] font-medium leading-relaxed text-white/70">
              Square shows a 15-minute, $20 visit. Bring ID. An RN confirms the shot is appropriate before it is given.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t-[3px] border-black bg-[#FFF8F0]">
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
          <p className={`${display} text-[28px]`}>Hello Gorgeous Medical Spa</p>
          <p className="mt-2 text-[13px] font-bold uppercase tracking-widest">
            20-minute wellness · Mon–Fri 11am–6pm · Sat 10am–3pm · Walk-ins when a nurse is free
          </p>
          <p className="mt-4 max-w-3xl text-[12px] leading-relaxed">
            Vitamin injections are wellness services, not a diagnosis and not a treatment for a disease.
            Not for pregnancy or nursing unless your own clinician says it is appropriate.
            No guarantee of weight loss, energy, hair, skin, or how long anything lasts.
            IM delivery skips the gut. Absorption still varies.
          </p>
        </div>
      </footer>
    </div>
  );
}
