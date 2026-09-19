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

/** Full-bleed 3:4 film still — name sits on the plate, not in a cheap white directory card. */
export function CinematicProviderPoster({
  name,
  role,
  badge,
  detail,
  image,
  imageAlt,
  href,
  objectPosition = "center top",
  footer,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      <Link
        href={href}
        className="group relative block aspect-[3/4] overflow-hidden bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E6007E] focus-visible:ring-offset-2"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          style={{ objectPosition }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,.15) 52%, rgba(0,0,0,.78) 82%, rgba(0,0,0,.94) 100%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC] sm:text-[10px]">
            {badge}
          </p>
          <h3 className="mt-1 font-serif text-base font-bold leading-snug text-white sm:text-xl">
            {name}
          </h3>
          <p className="mt-0.5 text-[12px] font-semibold text-[#FF2D8E] sm:text-sm">{role}</p>
          {detail ? (
            <p className="mt-1 hidden text-[11px] leading-snug text-white/70 sm:block">{detail}</p>
          ) : null}
          <span className="mt-2 inline-flex text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 sm:mt-3">
            View profile →
          </span>
        </div>
      </Link>
      {footer ? <div className="border-t-2 border-white/10 bg-[#0a0a0a] px-3 py-2.5 sm:px-4">{footer}</div> : null}
    </article>
  );
}
