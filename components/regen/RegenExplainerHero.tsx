'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TEAL = '#0D9488';
const PINK = '#E91E8C';
const INK = '#0A0A0A';
const CREAM = '#F4EAD9';
const DURATION = 60;

const CUES = {
  Logo: 0,
  Paths: 5,
  FreeTools: 10,
  Visit: 14,
  Confirmed: 22,
  Review: 27,
  Decision: 34,
  Ships: 42,
  Ongoing: 50,
  EndCard: 55,
} as const;

const IMG = {
  morning: '/images/regen/marketing/man-morning-energy.png',
  closeup: '/images/regen/marketing/woman-skincare.png',
  hydration: '/images/regen/marketing/woman-wellness.png',
  yoga: '/images/regen/marketing/man-fitness.png',
  vials: '/images/regen/explainer/vials.webp',
  cell: '/images/regen/marketing/cell-peptide.png',
};

const ICONS = {
  weight: 'M4 12h16M8 8v8M16 8v8',
  hormone: 'M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.65-9.5 9-9.5 9z',
  peptide: 'M7 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM17 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9.5 9.5l5 5',
  vitamin: 'M9 3h6M12 3v7M6 21h12M8 14a4 4 0 0 0 8 0v-4H8v4z',
  skin: 'M12 21c4.5-3 7-6.5 7-10.5A7 7 0 0 0 5 10.5C5 14.5 7.5 18 12 21z',
  hair: 'M4 20c2-6 2-10 0-16M12 20c2-6 2-10 0-16M20 20c-2-6-2-10 0-16',
  intimacy: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
  check: 'M20 6L9 17l-5-5',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  chart: 'M4 19V9M10 19V5M16 19v-7M22 19H2',
  truck: 'M1 3h13v13H1zM14 8h4l4 4v4h-8zM5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  chat: 'M21 11.5a8.38 8.38 0 0 1-9 8.4A8.5 8.5 0 1 1 21 11.5z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.7 2z',
};

const PATHS = [
  { label: 'Weight', icon: ICONS.weight },
  { label: 'Hormones', icon: ICONS.hormone },
  { label: 'Peptides', icon: ICONS.peptide },
  { label: 'Vitamins', icon: ICONS.vitamin },
  { label: 'Skin', icon: ICONS.skin },
  { label: 'Hair', icon: ICONS.hair },
  { label: 'Intimacy', icon: ICONS.intimacy },
];

const STEPS = ['Goal', 'Program', 'You', 'Screening', 'Consent', 'Checkout'];
const DOORS = [
  { label: 'Labs', color: '#8B5CF6' },
  { label: 'Video', color: '#06B6D4' },
  { label: 'Approved', color: TEAL },
];

function interpolate(range: [number, number], values: [number, number]) {
  return (t: number) => {
    const [a, b] = range;
    const [va, vb] = values;
    if (t <= a) return va;
    if (t >= b) return vb;
    return va + (vb - va) * ((t - a) / (b - a));
  };
}

function trapezoid(t: number, start: number, end: number, fade: number) {
  const inEdge = t <= start - fade ? 0 : t >= start + fade ? 1 : interpolate([start - fade, start + fade], [0, 1])(t);
  const outEdge = t <= end - fade ? 1 : t >= end + fade ? 0 : interpolate([end - fade, end + fade], [1, 0])(t);
  return Math.min(inEdge, outEdge);
}

function easeOutBack(p: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
}

function animate(from: number, to: number, start: number, end: number, t: number, ease?: 'back') {
  if (t <= start) return from;
  if (t >= end) return to;
  const p = (t - start) / (end - start);
  return from + (to - from) * (ease === 'back' ? easeOutBack(p) : p);
}

function Icon({ d, size = 32, color = CREAM, stroke = 2 }: { d: string; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Backdrop({ src, opacity, dark = 0.55, focus = 'center' }: { src: string; opacity: number; dark?: number; focus?: string }) {
  if (opacity < 0.01) return null;
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focus }} />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(10,10,10,${dark}) 0%, rgba(10,10,10,${dark + 0.15}) 60%, rgba(10,10,10,${dark + 0.3}) 100%)`,
        }}
      />
    </div>
  );
}

function Scene({ opacity, children, className = '' }: { opacity: number; children: React.ReactNode; className?: string }) {
  if (opacity < 0.01) return null;
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center ${className}`}
      style={{ opacity }}
    >
      {children}
    </div>
  );
}

export function RegenExplainerHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0.6);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);
  const tRef = useRef(0.6);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    let raf = 0;
    let last = performance.now();
    const inView = { current: true };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.intersectionRatio > 0;
      },
      { threshold: [0, 0.05] },
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (playingRef.current && inView.current) {
        tRef.current += dt;
        if (tRef.current >= DURATION) tRef.current = 0;
        setT(tRef.current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const S1 = trapezoid(t, CUES.Logo, CUES.Paths, 0.5);
  const S2 = trapezoid(t, CUES.Paths, CUES.FreeTools, 0.5);
  const S3 = trapezoid(t, CUES.FreeTools, CUES.Visit, 0.5);
  const S4 = trapezoid(t, CUES.Visit, CUES.Confirmed, 0.5);
  const S5 = trapezoid(t, CUES.Confirmed, CUES.Review, 0.5);
  const S6 = trapezoid(t, CUES.Review, CUES.Decision, 0.5);
  const S7 = trapezoid(t, CUES.Decision, CUES.Ships, 0.5);
  const S8 = trapezoid(t, CUES.Ships, CUES.Ongoing, 0.5);
  const S9 = trapezoid(t, CUES.Ongoing, CUES.EndCard, 0.5);
  const S10 = trapezoid(t, CUES.EndCard, CUES.EndCard + 5, 0.5);

  const fanProg = animate(0, 1, CUES.Paths, CUES.Paths + 1.4, t, 'back');
  const stepProg = animate(0, 6, CUES.Visit + 0.3, CUES.Confirmed - 0.6, t);
  const shipProg = animate(0, 1, CUES.Ships + 0.3, CUES.Ongoing - 0.4, t);

  const replay = () => {
    tRef.current = 0;
    setT(0);
    setPlaying(true);
    playingRef.current = true;
  };

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden bg-black"
      style={{ backgroundColor: INK }}
    >
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden>
        {Object.values(IMG).map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" />
        ))}
      </div>
      <div className="relative w-full min-h-[560px] sm:min-h-[620px] md:min-h-0 md:aspect-video md:max-h-[min(80vh,860px)]">
        <Backdrop src={IMG.morning} opacity={S1} dark={0.5} focus="70% 30%" />
        <Scene opacity={S1} className="gap-5 md:gap-8">
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-extrabold tracking-wide text-[#F4EAD9] drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            REGEN<span style={{ color: PINK }}>RX</span>
          </div>
          <p className="max-w-4xl text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug text-[#F4EAD9]/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            You don&apos;t need a waiting room to be treated like a patient.
          </p>
        </Scene>

        <Backdrop src={IMG.yoga} opacity={S2} dark={0.6} focus="65% 40%" />
        <Scene opacity={S2} className="gap-6 md:gap-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EAD9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Pick your path
          </h2>
          <div className="flex max-w-6xl flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {PATHS.map((p, i) => {
              const delay = i * 0.08;
              const prog = Math.max(0, Math.min(1, (fanProg - delay) / (1 - delay || 1)));
              const isPulse = i === 2;
              const pulse = isPulse ? 0.5 + 0.5 * Math.sin(t * 4) : 0;
              return (
                <div
                  key={p.label}
                  className="flex w-[4.6rem] sm:w-24 md:w-32 lg:w-40 flex-col items-center justify-center gap-2 rounded-2xl border px-1 py-3 sm:py-5 backdrop-blur-sm"
                  style={{
                    borderColor: isPulse ? PINK : 'rgba(255,255,255,0.25)',
                    background: isPulse ? `rgba(233,30,140,${0.18 + pulse * 0.08})` : 'rgba(10,10,10,0.4)',
                    opacity: prog,
                    transform: `translateY(${(1 - prog) * 24}px) scale(${0.88 + prog * 0.12})`,
                  }}
                >
                  <Icon d={p.icon} size={28} color={isPulse ? PINK : TEAL} />
                  <div className="text-[11px] sm:text-sm md:text-base font-bold text-[#F4EAD9]">{p.label}</div>
                </div>
              );
            })}
          </div>
        </Scene>

        <Backdrop src={IMG.vials} opacity={S3} dark={0.4} focus="30% 50%" />
        <Scene opacity={S3} className="gap-5 md:gap-8">
          <div
            className="rounded-full border-2 px-6 py-2 text-lg font-extrabold sm:text-2xl"
            style={{ background: 'rgba(13,148,136,0.2)', borderColor: TEAL, color: TEAL }}
          >
            Free Tools
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-[#F4EAD9]/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Check your numbers first if you want.
          </p>
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-black/55 px-6 py-4 backdrop-blur-sm sm:px-10">
            <span className="text-xs uppercase tracking-wider text-white/60">BMI</span>
            <span className="font-serif text-4xl font-extrabold sm:text-5xl" style={{ color: PINK }}>29</span>
            <span className="text-sm text-white/50">screening only</span>
          </div>
        </Scene>

        <Backdrop src={IMG.hydration} opacity={S4} dark={0.6} focus="30% 40%" />
        <Scene opacity={S4} className="gap-6 md:gap-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EAD9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Your visit · 6 steps
          </h2>
          <div className="flex max-w-5xl flex-wrap justify-center gap-3 sm:gap-5">
            {STEPS.map((s, i) => {
              const active = stepProg > i;
              const current = Math.floor(stepProg) === i;
              return (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold sm:h-14 sm:w-14 sm:text-xl"
                    style={{
                      background: active ? TEAL : 'rgba(255,255,255,0.12)',
                      border: current ? `3px solid ${PINK}` : '3px solid transparent',
                      color: active ? INK : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="text-xs sm:text-sm"
                    style={{ color: active ? CREAM : 'rgba(255,255,255,0.45)', fontWeight: active ? 700 : 400 }}
                  >
                    {s}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm sm:text-lg md:text-xl text-[#F4EAD9]/80">
            Illinois address · consent boxes · secure checkout
          </p>
        </Scene>

        <Backdrop src={IMG.closeup} opacity={S5} dark={0.55} focus="60% 30%" />
        <Scene opacity={S5} className="gap-4 md:gap-6">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] sm:h-24 sm:w-24"
            style={{ background: 'rgba(13,148,136,0.22)', borderColor: TEAL }}
          >
            <Icon d={ICONS.check} size={44} color={TEAL} stroke={3} />
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F4EAD9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            You&apos;re in.
          </div>
          <p className="flex max-w-3xl items-center justify-center gap-3 text-base sm:text-xl text-[#F4EAD9]/85">
            <Icon d={ICONS.mail} size={22} color={PINK} />
            Confirmation from REGEN RX · your visit is already in our queue
          </p>
        </Scene>

        <Backdrop src={IMG.cell} opacity={S6} dark={0.5} focus="20% 50%" />
        <Scene opacity={S6} className="gap-5 md:gap-8">
          <div className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: TEAL }}>
            24–48 hours
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Screening', 'Consent', 'Shipping'].map((l) => (
              <div
                key={l}
                className="flex w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-teal-500/50 bg-black/50 py-5 backdrop-blur-sm sm:w-44 sm:py-8"
              >
                <Icon d={ICONS.chart} color={TEAL} size={28} />
                <span className="text-sm font-bold text-[#F4EAD9] sm:text-base">{l}</span>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-lg sm:text-2xl md:text-3xl leading-snug text-[#F4EAD9]/90">
            A licensed provider reviews your history — like a medical practice. Because we are one.
          </p>
        </Scene>

        <Scene opacity={S7} className="gap-6 md:gap-10">
          <h2 className="max-w-4xl text-2xl sm:text-3xl md:text-4xl font-bold text-[#F4EAD9]">
            We may ask for labs. Or a short video. Or we approve.
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
            {DOORS.map((d) => (
              <div
                key={d.label}
                className="w-28 rounded-2xl border-2 px-3 py-5 text-center sm:w-48 sm:px-6 sm:py-8"
                style={{ background: `${d.color}18`, borderColor: d.color }}
              >
                <span className="text-lg font-extrabold sm:text-2xl" style={{ color: d.color }}>{d.label}</span>
              </div>
            ))}
          </div>
        </Scene>

        <Scene opacity={S8} className="gap-6 md:gap-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F4EAD9]">If you&apos;re a fit, it ships discreetly.</h2>
          <div className="flex items-center gap-3 sm:gap-8">
            {[
              { icon: ICONS.chart, label: 'Pharmacy', on: shipProg > 0, color: TEAL },
              { icon: ICONS.truck, label: 'In transit', on: shipProg > 0.33, color: TEAL },
              { icon: ICONS.check, label: 'Your door', on: shipProg > 0.66, color: PINK },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-3 sm:gap-8">
                <div className="flex flex-col items-center gap-2">
                  <Icon d={node.icon} color={node.on ? node.color : 'rgba(255,255,255,0.25)'} size={36} />
                  <span className="text-xs text-white/70 sm:text-sm">{node.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="h-0.5 w-8 sm:w-16"
                    style={{ background: (i === 0 ? shipProg > 0.33 : shipProg > 0.66) ? (i === 0 ? TEAL : PINK) : 'rgba(255,255,255,0.15)' }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-base sm:text-xl text-[#F4EAD9]/75">3–5 days · discreet packaging</p>
        </Scene>

        <Backdrop src={IMG.hydration} opacity={S9} dark={0.62} focus="20% 35%" />
        <Scene opacity={S9} className="gap-6 md:gap-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EAD9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            We&apos;re still here.
          </h2>
          <div className="flex flex-col gap-4 text-lg text-[#F4EAD9] sm:flex-row sm:gap-10 sm:text-2xl">
            <span className="flex items-center justify-center gap-3">
              <Icon d={ICONS.chat} color={TEAL} size={26} />
              Message your care team
            </span>
            <a href="tel:6306366193" className="flex items-center justify-center gap-3">
              <Icon d={ICONS.phone} color={PINK} size={24} />
              (630) 636-6193
            </a>
          </div>
        </Scene>

        <Backdrop src={IMG.morning} opacity={S10} dark={0.65} focus="70% 30%" />
        <Scene opacity={S10} className="gap-3 md:gap-5">
          <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#F4EAD9] drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
            REGEN<span style={{ color: PINK }}>RX</span>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-lg" style={{ color: TEAL }}>
            Renew. Rebalance. Regenerate.
          </p>
          <Link
            href="/start"
            className="mt-3 rounded-full px-8 py-3 text-lg font-extrabold text-white sm:px-12 sm:py-4 sm:text-xl"
            style={{ backgroundColor: PINK }}
          >
            Get Started · tryregenrx.com
          </Link>
          <p className="mt-4 max-w-xl text-[11px] leading-relaxed text-[#F4EAD9]/55 sm:text-xs">
            Illinois residents. Compounded Rx are not FDA-approved. Individual results vary. Educational only — not a diagnosis or guarantee.
          </p>
        </Scene>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
        <button
          type="button"
          onClick={() => {
            if (t >= DURATION - 0.05) {
              replay();
              return;
            }
            setPlaying((p) => !p);
          }}
          className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
          aria-label={playing ? 'Pause explainer' : 'Play explainer'}
        >
          {playing ? 'Pause' : t > 0.2 && t < DURATION - 0.2 ? 'Play' : 'Replay'}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full" style={{ width: `${(t / DURATION) * 100}%`, backgroundColor: PINK }} />
        </div>
        <span className="w-10 text-right text-[11px] tabular-nums text-white/60">{Math.min(DURATION, Math.floor(t))}s</span>
      </div>
    </div>
  );
}
