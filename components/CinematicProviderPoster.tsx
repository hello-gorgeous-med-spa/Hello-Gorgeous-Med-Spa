import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  name: string;
  role: string;
  badge: string;
  detail?: string;
  image: string;
  imageAlt: string;
  href: string;
  objectPosition?: string;
  footer?: ReactNode;
};

/** 4:5 film still with credits under the photo — faces stay fully visible. */
export function CinematicProviderPoster({
  name,
  role,
  badge,
  detail,
  image,
  imageAlt,
  href,
  objectPosition = "center 18%",
  footer,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      <Link
        href={href}
        className="group flex h-full flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E6007E] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#12060c]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          />
        </div>
        <div className="flex flex-1 flex-col border-t-2 border-white/10 bg-[#0a0a0a] px-3 py-3 sm:px-4 sm:py-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC] sm:text-[10px]">
            {badge}
          </p>
          <h3 className="mt-1 font-serif text-base font-bold leading-snug text-white sm:text-lg">
            {name}
          </h3>
          <p className="mt-0.5 text-[12px] font-semibold text-[#FF2D8E] sm:text-sm">{role}</p>
          {detail ? (
            <p className="mt-1 hidden text-[11px] leading-snug text-white/65 sm:block">{detail}</p>
          ) : null}
          <span className="mt-2 inline-flex text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 sm:mt-2.5">
            View profile →
          </span>
        </div>
      </Link>
      {footer ? <div className="border-t-2 border-white/10 bg-[#0a0a0a] px-3 py-2.5 sm:px-4">{footer}</div> : null}
    </article>
  );
}
