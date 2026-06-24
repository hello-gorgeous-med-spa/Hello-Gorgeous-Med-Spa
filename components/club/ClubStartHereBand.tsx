import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import type { ClubStartPath } from "@/lib/club-start-here";

export function ClubStartHereBand({
  id = "start-here",
  eyebrow,
  title,
  paths,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  paths: ClubStartPath[];
}) {
  return (
    <Section id={id} className="scroll-mt-24 border-b border-[#FF2D8E]/30 bg-gradient-to-b from-[#151922] to-[#0a0a0a] !py-10 md:!py-14">
      <div className="mx-auto max-w-6xl px-4">
        <FadeUp>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">{eyebrow}</p>
          <h2 className="mt-2 font-serif text-2xl text-white md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Pick the closest match — takes about 2 minutes. Not a diagnosis; it tells us (and you) what to
            book next.
          </p>
        </FadeUp>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {paths.map((path, i) => (
            <FadeUp key={path.id} delayMs={i * 40}>
              <Link
                href={path.href}
                className="group relative flex h-full flex-col rounded-2xl border-4 border-black bg-[#151922] p-5 shadow-[6px_6px_0_0_rgba(255,45,142,0.3)] transition hover:border-[#FF2D8E]/60 hover:shadow-[8px_8px_0_0_rgba(255,45,142,0.4)]"
              >
                {path.badge ? (
                  <span className="absolute -top-3 left-4 rounded-full bg-[#FF2D8E] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    {path.badge}
                  </span>
                ) : null}
                <span className="text-2xl" aria-hidden>
                  {path.icon}
                </span>
                <h3 className="mt-3 font-black text-white group-hover:text-[#FFB8DC]">{path.title}</h3>
                <p className="mt-1 flex-1 text-sm text-gray-400">{path.sub}</p>
                <p className="mt-4 text-sm font-bold text-[#FF2D8E]">{path.cta}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
