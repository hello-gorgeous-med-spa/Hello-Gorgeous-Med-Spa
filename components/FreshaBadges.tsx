import Image from "next/image";
import Link from "next/link";

const BOOK = "/book";

/**
 * Fresha “Book with us online” QR + Best in Class trust badges.
 * QR links to the canonical /book entry; static badge PNGs in /public/images/badges.
 */
export function FreshaBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-6 ${className}`.trim()}>
      <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Book on Fresha</p>
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-5">
        <Link
          href={BOOK}
          className="block rounded-lg overflow-hidden border border-white/20 bg-white/5 p-1 hover:border-[#FF2D8E]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF2D8E] focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Book with us online on Fresha"
        >
          <Image
            src="/images/badges/fresha-book-qr.png"
            alt="Book with us online — scan to open our Fresha booking page"
            width={200}
            height={280}
            className="w-[min(200px,70vw)] h-auto"
            sizes="200px"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-3 max-w-md">
          <Image
            src="/images/badges/fresha-best-in-class-2026.png"
            alt="Fresha Best in Class 2026"
            width={120}
            height={150}
            className="h-24 w-auto"
            sizes="120px"
          />
          <Image
            src="/images/badges/fresha-best-in-class-past-years.png"
            alt="Fresha Best in Class awards 2023 and 2025"
            width={280}
            height={120}
            className="h-16 sm:h-20 w-auto"
            sizes="(max-width: 640px) 240px, 280px"
          />
        </div>
      </div>
    </div>
  );
}
