import Link from "next/link";

import { RegenNowLiveFlyer } from "@/components/regen/RegenNowLiveFlyer";
import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import {
  REGEN_NOW_LIVE_START_URL,
  REGEN_NOW_LIVE_STEPS,
} from "@/lib/regen/now-live";
import { REGEN_START_PATH } from "@/lib/regen/how-it-works";

const TEAL = "#0B4F4C";
const GOLD = "#E8A317";

export function RegenNowLivePageContent() {
  return (
    <div className="min-h-screen" style={{ background: TEAL }}>
      <RegenPublicNav />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-10 text-white">
        <p className="inline-flex rounded-full px-4 py-1 text-xs font-black tracking-[0.2em]" style={{ background: GOLD }}>
          NOW LIVE
        </p>
        <p className="mt-6 text-sm font-semibold tracking-[0.28em] text-white/70">REGEN RX · HELLO GORGEOUS MED SPA</p>
        <h1 className="mt-4 font-serif text-5xl font-black leading-tight md:text-7xl">
          Your wellness.
          <br />
          Your schedule.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/80">
          Care from licensed Illinois clinicians, delivered to your door. Same Oswego clinic. No in-clinic appointment
          required to start a request.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={REGEN_START_PATH}
            className="rounded-full px-7 py-3 text-sm font-black text-[#0B4F4C]"
            style={{ background: GOLD }}
          >
            Start a request
          </Link>
          <a
            href={REGEN_NOW_LIVE_START_URL}
            className="rounded-full border border-white/30 px-7 py-3 text-sm font-black text-white"
          >
            GLP-1 online
          </a>
        </div>

        <section className="mt-14 rounded-[2rem] bg-white p-8 text-[#0B4F4C] md:p-12">
          <p className="text-xs font-black tracking-[0.22em]">HOW IT WORKS</p>
          <ol className="mt-8 grid gap-8 md:grid-cols-2">
            {REGEN_NOW_LIVE_STEPS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: TEAL }}
                >
                  {step.n}
                </span>
                <div>
                  <p className="text-lg font-black">{step.title}</p>
                  <p className="mt-1 text-sm text-[#0B4F4C]/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60">
          Illinois adults 21+. $30 shipping. A clinician must approve. Phone consult or labs may be requested. A request
          is not a guaranteed prescription. Compounded medication is not FDA-approved. Results vary.
        </p>
      </main>

      <div className="overflow-x-auto bg-[#083734] px-4 py-16">
        <p className="mb-6 text-center text-xs font-black tracking-[0.22em] text-white/50">SHARE THIS</p>
        <div className="flex justify-center">
          <div className="origin-top scale-[0.38] md:scale-50">
            <RegenNowLiveFlyer />
          </div>
        </div>
      </div>
    </div>
  );
}
