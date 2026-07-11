import {
  JOURNEY_HERO_BG,
  JourneyChip,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { HYDRAFACIAL_MARKETING } from "@/lib/hydrafacial-marketing";

type HydraFacialHeroProps = {
  localityLine: string;
  title: React.ReactNode;
  description: string;
  chips?: string[];
};

export function HydraFacialHero({
  localityLine,
  title,
  description,
  chips = ["Zero downtime", "All skin types", "Membership $99/mo"],
}: HydraFacialHeroProps) {
  return (
    <>
      <header className={JOURNEY_HERO_BG}>
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
              {HYDRAFACIAL_MARKETING.eyebrow}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">{localityLine}</p>
            <h1 className="mt-4 font-serif text-[40px] font-bold leading-[1.05] text-white lg:text-[58px]">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={HYDRAFACIAL_MARKETING.bookHref}>Book your glow</JourneyPinkBtn>
              <JourneyGhostBtn href={HYDRAFACIAL_MARKETING.phoneHref}>
                Call {HYDRAFACIAL_MARKETING.phoneDisplay}
              </JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
          </div>
          <JourneyVideoFrame
            src={HYDRAFACIAL_MARKETING.scienceVideo}
            label="HydraFacial vortex technology — science animation at Hello Gorgeous Med Spa"
            poster={HYDRAFACIAL_MARKETING.poster}
            className="lg:max-w-lg"
          />
        </div>
      </header>
      <JourneyTrustBar />
    </>
  );
}
