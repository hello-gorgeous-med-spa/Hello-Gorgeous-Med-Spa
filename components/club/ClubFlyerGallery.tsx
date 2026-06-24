import Image from "next/image";
import Link from "next/link";

import type { ClubFlyerCard } from "@/lib/club-flyer-images";

export function ClubFlyerGallery({ flyers, columns = 2 }: { flyers: ClubFlyerCard[]; columns?: 2 | 3 }) {
  const gridClass = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`mt-10 grid gap-5 ${gridClass}`}>
      {flyers.map((flyer) => (
        <Link
          key={flyer.id}
          href={flyer.href}
          className="group overflow-hidden rounded-2xl border-4 border-black bg-black shadow-[6px_6px_0_0_rgba(255,45,142,0.25)] transition hover:border-[#FF2D8E]/50"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={flyer.image}
              alt={flyer.imageAlt}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="border-t-4 border-black bg-[#151922] p-4">
            <p className="font-black text-white">{flyer.name}</p>
            <p className="mt-1 text-sm text-[#7dd3fc]">{flyer.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
