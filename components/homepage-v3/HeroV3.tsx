import WebsiteHeroBanner from "@/components/WebsiteHeroBanner";

export function HeroV3() {
  return (
    <div className="bg-black px-2 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
        <WebsiteHeroBanner variant="home" />
      </div>
    </div>
  );
}
