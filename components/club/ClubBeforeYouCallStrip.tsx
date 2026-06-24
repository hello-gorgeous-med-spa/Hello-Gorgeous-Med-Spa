import { CLUB_BEFORE_YOU_CALL } from "@/lib/club-start-here";

export function ClubBeforeYouCallStrip() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <p className="text-sm font-bold text-[#FFB8DC]">{CLUB_BEFORE_YOU_CALL.headline}</p>
      <ul className="mt-3 space-y-1.5">
        {CLUB_BEFORE_YOU_CALL.bullets.map((item) => (
          <li key={item} className="flex gap-2 text-xs text-gray-400 md:text-sm">
            <span className="shrink-0 text-[#FF2D8E]">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
