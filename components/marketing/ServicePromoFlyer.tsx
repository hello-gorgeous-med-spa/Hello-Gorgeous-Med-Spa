import Image from "next/image";

export function ServicePromoFlyer({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <section className="bg-white border-b-4 border-black" aria-label="Treatment overview">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] bg-white">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={1500}
            className="w-full h-auto"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
