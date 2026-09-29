import {
  REGEN_NOW_LIVE_START_URL,
  REGEN_NOW_LIVE_STEPS,
} from "@/lib/regen/now-live";

const TEAL = "#0B4F4C";
const GOLD = "#E8A317";

/** Pixel flyer — same layout as Danielle’s launch ad, readable type. */
export function RegenNowLiveFlyer({ id = "regen-now-live-flyer" }: { id?: string }) {
  return (
    <article
      id={id}
      className="relative overflow-hidden text-white"
      style={{
        width: 1080,
        height: 1920,
        background: TEAL,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 68%)" }}
      />
      <div className="relative flex h-full flex-col px-16 pb-16 pt-20">
        <div className="flex justify-center">
          <span
            className="rounded-full px-8 py-2 text-lg font-black tracking-[0.18em] text-white"
            style={{ background: GOLD }}
          >
            NOW LIVE
          </span>
        </div>
        <p className="mt-14 text-center text-5xl font-black tracking-[0.18em]">REGEN RX</p>
        <p className="mt-3 text-center text-lg font-semibold tracking-[0.22em] text-white/70">
          BY HELLO GORGEOUS MED SPA
        </p>
        <h1 className="mt-16 text-center text-7xl font-black leading-[0.95] tracking-tight">
          YOUR WELLNESS.
          <br />
          YOUR SCHEDULE.
        </h1>
        <div className="mx-auto mt-8 h-1.5 w-40" style={{ background: GOLD }} />
        <p className="mx-auto mt-10 max-w-[820px] text-center text-3xl font-medium leading-snug text-white/85">
          Care from licensed Illinois clinicians with delivery to your door.
        </p>

        <div className="mt-16 rounded-[2.5rem] bg-white px-12 py-14 text-[#0B4F4C]">
          <p className="text-2xl font-black tracking-[0.2em]">HOW IT WORKS</p>
          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-12">
            {REGEN_NOW_LIVE_STEPS.map((step) => (
              <div key={step.n} className="flex gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-black text-white"
                  style={{ background: TEAL }}
                >
                  {step.n}
                </span>
                <div>
                  <p className="text-xl font-black uppercase tracking-wide">{step.title}</p>
                  <p className="mt-1 text-lg leading-snug text-[#0B4F4C]/70">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={REGEN_NOW_LIVE_START_URL}
          className="mt-12 block rounded-full py-7 text-center text-3xl font-black tracking-wide text-[#0B4F4C]"
          style={{ background: GOLD }}
        >
          START AT TRYREGENRX.COM
        </a>
        <p className="mt-10 text-center text-2xl font-black tracking-[0.12em]">
          NO IN-CLINIC APPOINTMENT REQUIRED
        </p>
        <p className="mt-5 text-center text-xl leading-relaxed text-white/75">
          Illinois adults 21+ · $30 shipping · Approval required
          <br />
          Phone consult or labs may be requested. Compounded drugs are not FDA-approved.
        </p>
        <p className="mt-auto pt-10 text-center text-lg font-bold tracking-[0.18em] text-white/55">
          HELLOGORGEOUSMEDSPA.COM
        </p>
      </div>
    </article>
  );
}
