import Image from "next/image";
import Link from "next/link";

type ProviderCardProps = {
  provider: {
    id: string;
    slug: string;
    display_name: string;
    credentials?: string | null;
    tagline?: string | null;
    short_bio?: string | null;
    headshot_url?: string | null;
    intro_video_url?: string | null;
    media_counts?: { videos: number; results: number };
    booking_url?: string | null;
  };
};

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="relative rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-8 backdrop-blur-lg shadow-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white/20 bg-black/40">
          {provider.headshot_url ? (
            <Image src={provider.headshot_url} alt={provider.display_name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">👩‍⚕️</div>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-pink-400">Provider</p>
          <h3 className="text-2xl font-bold text-white">{provider.display_name}</h3>
          <p className="text-xs text-blue-200">{provider.credentials}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/80 leading-relaxed">{provider.short_bio || provider.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
          🎬 {provider.media_counts?.videos ?? 0} videos
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
          📸 {provider.media_counts?.results ?? 0} results
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/providers/${provider.slug}`}
          className="flex-1 rounded-2xl border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
        >
          View Results
        </Link>
        <Link
          href={provider.booking_url || `/book?provider=${provider.slug}`}
          className="flex-1 rounded-md bg-hg-pink hover:bg-hg-pinkDeep px-4 py-3 text-center text-sm font-semibold text-white uppercase tracking-widest transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
        >
          Book with {provider.display_name.split(" ")[0]}
        </Link>
      </div>
    </article>
  );
}
