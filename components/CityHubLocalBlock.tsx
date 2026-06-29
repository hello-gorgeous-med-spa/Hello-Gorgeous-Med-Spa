import { getCityHubProfile } from "@/lib/city-hub-content";
import { LOCAL_DOMINANCE_ACTIONS, LOCAL_DOMINANCE_TAGLINE } from "@/lib/local-dominance";

export function CityHubLocalBlock({ hubSlug }: { hubSlug: string }) {
  const profile = getCityHubProfile(hubSlug);
  if (!profile) return null;

  return (
    <div className="mt-8 rounded-2xl border-2 border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E6007E]">
        {profile.county} · {profile.driveTime}
      </p>
      <p className="mt-3 text-base leading-relaxed text-black/85 md:text-lg">
        {profile.localContext}
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-black/50">Typical drive</dt>
          <dd className="mt-1 text-sm font-medium text-black/80">{profile.primaryRoute}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-black/50">Also serving</dt>
          <dd className="mt-1 text-sm font-medium text-black/80">
            {profile.nearbyAreas.join(" · ")}
          </dd>
        </div>
      </dl>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Area landmarks">
        {profile.landmarks.map((landmark) => (
          <li
            key={landmark}
            className="rounded-full border border-[#E6007E]/25 bg-[#FFF0F7] px-3 py-1 text-xs font-semibold text-[#9b0a4d]"
          >
            {landmark}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm font-medium text-black/70">{LOCAL_DOMINANCE_TAGLINE}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {LOCAL_DOMINANCE_ACTIONS.map((action) => (
          <a
            key={action.id}
            href={action.href}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={
              action.primary
                ? "inline-flex items-center rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_0_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5"
                : "inline-flex items-center rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
            }
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}
